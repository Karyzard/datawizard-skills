/**
 * Serverless handler kontaktního formuláře.
 *
 * Přijímá multipart/form-data, validuje pole a Turnstile token,
 * odesílá email přes Resend API s volitelnou přílohou.
 *
 * PŘIZPŮSOBENÍ PRO NOVÝ PROJEKT:
 * 1. Upravit InquiryFields — přidat/odebrat pole dle formuláře
 * 2. Upravit validateFields() — pravidla validace
 * 3. Upravit buildEmailHtml() a buildEmailText() — šablonu emailu
 * 4. Upravit subject v resend.emails.send() — předmět emailu
 * 5. Nastavit env variables v Netlify Dashboard
 */

import { Buffer } from 'node:buffer';
import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';
import type { ReadableStream as NodeReadableStream } from 'node:stream/web';

import type { Context } from '@netlify/functions';
import Busboy from 'busboy';
import { Resend } from 'resend';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const BAD_REQUEST_MESSAGES = new Set([
  'Ověření Turnstile se nepodařilo.',
  'Vyplňte prosím všechna povinná pole.',
  'Zadejte platný email.',
  'Zadejte platné telefonní číslo.',
  'Maximální velikost souboru je 5 MB.',
  'Povolené jsou pouze obrázky JPG, PNG nebo WebP.',
  'Lze nahrát pouze jednu fotku.',
  'Endpoint očekává multipart/form-data.',
]);

// ── PŘIZPŮSOBIT: pole formuláře ──
type InquiryFields = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
  product: string;
  turnstileToken: string;
};

type ParsedPhoto = {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  extension: string;
  size: number;
};

type MultipartPhotoInfo = {
  filename: string;
  mimeType: string;
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function errorResponse(error: string, status = 400) {
  return jsonResponse({ success: false, error }, status);
}

function normalizeText(value: string | undefined) {
  return value?.trim() ?? '';
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderHtmlValue(value: string) {
  return escapeHtml(value).replaceAll('\n', '<br />');
}

function getPhotoExtension(mimeType: string) {
  switch (mimeType) {
    case 'image/jpeg': return 'jpg';
    case 'image/png': return 'png';
    case 'image/webp': return 'webp';
    default: throw new Error(`Unsupported photo mime type: ${mimeType}`);
  }
}

async function readPhotoUpload(
  stream: import('busboy').BusboyFileStream,
  info: MultipartPhotoInfo,
): Promise<ParsedPhoto> {
  const chunks: Buffer[] = [];
  let size = 0;

  return new Promise<ParsedPhoto>((resolve, reject) => {
    stream.on('data', (chunk) => {
      const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      size += bufferChunk.length;
      chunks.push(bufferChunk);
    });

    stream.on('limit', () => reject(new Error('Maximální velikost souboru je 5 MB.')));
    stream.on('error', () => reject(new Error('Nepodařilo se načíst přiloženou fotku.')));

    stream.on('close', () => {
      if (stream.truncated) {
        reject(new Error('Maximální velikost souboru je 5 MB.'));
        return;
      }
      if (!ALLOWED_MIME_TYPES.has(info.mimeType)) {
        reject(new Error('Povolené jsou pouze obrázky JPG, PNG nebo WebP.'));
        return;
      }
      resolve({
        buffer: Buffer.concat(chunks),
        filename: info.filename,
        mimeType: info.mimeType,
        extension: getPhotoExtension(info.mimeType),
        size,
      });
    });
  });
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (!forwardedFor) return '';
  return forwardedFor.split(',')[0]?.trim() ?? '';
}

function getAttachmentFilename(submissionId: string, photo: ParsedPhoto) {
  return `poptavka-${submissionId}.${photo.extension}`;
}

function getErrorStatus(message: string) {
  return BAD_REQUEST_MESSAGES.has(message) ? 400 : 500;
}

// ── PŘIZPŮSOBIT: validační pravidla ──
function validateFields(fields: InquiryFields) {
  if (!fields.firstName || !fields.lastName || !fields.phone || !fields.email) {
    throw new Error('Vyplňte prosím všechna povinná pole.');
  }
  if (!fields.turnstileToken) {
    throw new Error('Ověření Turnstile se nepodařilo.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    throw new Error('Zadejte platný email.');
  }
  if (!/^[+]?[\d\s()-]{6,}$/.test(fields.phone)) {
    throw new Error('Zadejte platné telefonní číslo.');
  }
}

async function parseMultipartForm(request: Request): Promise<{ fields: InquiryFields; photo: ParsedPhoto | null }> {
  if (!request.body) throw new Error('Požadavek neobsahuje tělo.');

  const headers = Object.fromEntries(request.headers.entries());
  const parser = Busboy({
    headers,
    limits: { fieldSize: 10 * 1024, fields: 8, fileSize: MAX_FILE_SIZE, files: 1, parts: 9 },
  });

  const rawFields: Partial<InquiryFields> = {};
  let photo: ParsedPhoto | null = null;

  await new Promise<void>((resolve, reject) => {
    const pendingFileReads: Promise<void>[] = [];
    const fail = (error: Error) => reject(error);

    parser.on('field', (name, value, info) => {
      if (info.valueTruncated) { fail(new Error(`Pole ${name} je příliš dlouhé.`)); return; }
      const trimmedValue = value.trim();
      switch (name) {
        case 'firstName': case 'lastName': case 'phone': case 'email':
        case 'message': case 'product': case 'turnstileToken':
          rawFields[name] = trimmedValue; break;
        case 'productName': rawFields.product = trimmedValue; break;
        case 'cf-turnstile-response': rawFields.turnstileToken = trimmedValue; break;
        default: break;
      }
    });

    parser.on('file', (name, stream, info) => {
      if (name !== 'photo') { stream.resume(); fail(new Error('Neočekávané pole souboru.')); return; }
      if (!info.filename) { stream.resume(); return; }
      pendingFileReads.push(readPhotoUpload(stream, info).then((p) => { photo = p; }));
    });

    parser.on('filesLimit', () => fail(new Error('Lze nahrát pouze jednu fotku.')));
    parser.on('error', () => fail(new Error('Nepodařilo se zpracovat multipart/form-data.')));

    parser.on('close', () => {
      Promise.all(pendingFileReads).then(() => resolve()).catch((e) => {
        fail(e instanceof Error ? e : new Error('Nepodařilo se načíst nahraný soubor.'));
      });
    });

    const nodeStream = Readable.fromWeb(request.body as unknown as NodeReadableStream);
    nodeStream.on('error', () => fail(new Error('Nepodařilo se přečíst tělo požadavku.')));
    nodeStream.pipe(parser);
  });

  return {
    fields: {
      firstName: normalizeText(rawFields.firstName),
      lastName: normalizeText(rawFields.lastName),
      phone: normalizeText(rawFields.phone),
      email: normalizeText(rawFields.email),
      message: normalizeText(rawFields.message),
      product: normalizeText(rawFields.product),
      turnstileToken: normalizeText(rawFields.turnstileToken),
    },
    photo,
  };
}

async function verifyTurnstile(request: Request, token: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error('TURNSTILE_SECRET_KEY není nastaven.');

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: getClientIp(request) }),
  });

  if (!response.ok) throw new Error('Nepodařilo se ověřit Turnstile službou Cloudflare.');

  const payload = (await response.json()) as { success?: boolean; 'error-codes'?: string[] };
  return { success: !!payload.success, errors: payload['error-codes'] ?? [] };
}

// ── PŘIZPŮSOBIT: email šablona ──
function buildEmailHtml(fields: InquiryFields, submissionId: string, photo: ParsedPhoto | null) {
  const rows = [
    ['ID poptávky', submissionId],
    ['Jméno', fields.firstName],
    ['Příjmení', fields.lastName],
    ['Telefon', fields.phone],
    ['Email', fields.email],
    ['Produkt', fields.product],
    ['Zpráva', fields.message],
  ].filter(([, value]) => value);

  const photoRow = photo
    ? `<tr><td style="padding:10px 12px;border:1px solid #dbe3ec;font-weight:700;vertical-align:top">Fotka</td><td style="padding:10px 12px;border:1px solid #dbe3ec">Viz příloha emailu</td></tr>`
    : '';

  return `<div style="font-family:Arial,sans-serif;color:#1f2937;line-height:1.6">
    <h1 style="margin-bottom:16px;font-size:24px">Nová poptávka z webu</h1>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px"><tbody>
      ${rows.map(([label, value]) => `<tr><td style="padding:10px 12px;border:1px solid #dbe3ec;font-weight:700;vertical-align:top;width:180px">${escapeHtml(label)}</td><td style="padding:10px 12px;border:1px solid #dbe3ec">${renderHtmlValue(value)}</td></tr>`).join('')}
      ${photoRow}
    </tbody></table></div>`;
}

function buildEmailText(fields: InquiryFields, submissionId: string, photo: ParsedPhoto | null) {
  return [
    `ID poptávky: ${submissionId}`,
    `Jméno: ${fields.firstName}`,
    `Příjmení: ${fields.lastName}`,
    `Telefon: ${fields.phone}`,
    `Email: ${fields.email}`,
    fields.product ? `Produkt: ${fields.product}` : '',
    fields.message ? `Zpráva: ${fields.message}` : '',
    photo ? 'Fotka: viz příloha emailu' : '',
  ].filter(Boolean).join('\n');
}

// ── HLAVNÍ HANDLER ──
export default async function submitInquiry(request: Request, _context: Context) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed.' }), {
      status: 405,
      headers: { Allow: 'POST', 'content-type': 'application/json; charset=utf-8' },
    });
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().startsWith('multipart/form-data')) {
    return errorResponse('Endpoint očekává multipart/form-data.', 400);
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const inquiryRecipient = process.env.INQUIRY_RECIPIENT;

  if (!resendApiKey || !fromEmail || !inquiryRecipient) {
    console.error('submit-inquiry: Missing env variables');
    return errorResponse('Server není správně nakonfigurovaný.', 500);
  }

  try {
    const { fields, photo } = await parseMultipartForm(request);
    validateFields(fields);

    const turnstileResult = await verifyTurnstile(request, fields.turnstileToken);
    if (!turnstileResult.success) return errorResponse('Ověření Turnstile selhalo.', 403);

    const submissionId = randomUUID();
    const resend = new Resend(resendApiKey);
    const productName = fields.product ? ` / ${fields.product}` : '';

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: inquiryRecipient,
      replyTo: fields.email,
      subject: `Nová poptávka: ${fields.lastName}${productName}`,  // ← PŘIZPŮSOBIT
      html: buildEmailHtml(fields, submissionId, photo),
      text: buildEmailText(fields, submissionId, photo),
      attachments: photo ? [{ filename: getAttachmentFilename(submissionId, photo), content: photo.buffer.toString('base64') }] : undefined,
    });

    if (error) throw new Error(`Resend error: ${error.message}`);
    return jsonResponse({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Neočekávaná chyba.';
    const status = getErrorStatus(message);
    console.error('submit-inquiry:', message, error);
    return errorResponse(
      status === 500 ? 'Nepodařilo se odeslat poptávku. Zkuste to prosím znovu později.' : message,
      status,
    );
  }
}
