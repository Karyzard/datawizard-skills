/**
 * Centrální konfigurace webu — VYPLNIT PŘI STARTU PROJEKTU.
 *
 * Tento soubor je jediné místo, kde se definují klientské údaje.
 * Všechny komponenty, layouty a stránky importují odtud.
 *
 * Po vyplnění spustit: grep -r '{{' src/ public/ netlify/ --include='*.astro' --include='*.ts' --include='*.yml'
 * Pokud se nic nenajde, všechny placeholdery jsou nahrazené.
 */

// ── Základní údaje webu ──

export const site = {
  /** URL webu bez trailing slash */
  url: 'https://www.example.cz',

  /** Název firmy / webu — používá se v title, OG, JSON-LD */
  name: 'Název firmy',

  /** Krátký tagline — součást <title> na homepage */
  tagline: 'Krátký slogan firmy',

  /** Popis webu — meta description, OG description */
  description: 'Popis toho, co firma dělá a proč by měl návštěvník zůstat.',

  /** Jazyk webu */
  lang: 'cs',

  /** Theme color (pro manifest a meta tag) — odpovídá --color-primary */
  themeColor: '#0f172a',
} as const;


// ── Firma ──

export const company = {
  /** Právní název (pro patičku, dokumenty) */
  legalName: 'Firma s.r.o.',

  /** IČO */
  ico: '12345678',

  /** DIČ (pokud je plátce DPH) */
  dic: 'CZ12345678',

  /** Rok založení (pro "X let na trhu" badge apod.) */
  founded: 1997,
} as const;


// ── Kontakty ──

export const contact = {
  /** Hlavní email */
  email: 'info@example.cz',

  /** Hlavní telefon (s předvolbou) */
  phone: '+420 123 456 789',

  /** Telefon pro href="tel:..." (bez mezer) */
  phoneHref: '+420123456789',
} as const;


// ── Pobočky / lokace ──

export interface Location {
  /** Název pobočky */
  title: string;
  /** Firma (může být stejná všude) */
  company: string;
  /** Ulice a číslo */
  street: string;
  /** PSČ */
  postalCode: string;
  /** Město */
  city: string;
  /** Telefon */
  phone: string;
  /** Telefon pro href (bez mezer) */
  phoneHref: string;
  /** Email (volitelný — pokud se liší od hlavního) */
  email?: string;
  /** Google Maps embed URL (volitelný) */
  mapUrl?: string;
}

export const locations: Location[] = [
  {
    title: 'Hlavní sídlo',
    company: 'Firma s.r.o.',
    street: 'Ulice 123',
    postalCode: '100 00',
    city: 'Praha',
    phone: '+420 123 456 789',
    phoneHref: '+420123456789',
  },
  // Přidat další pobočky dle potřeby:
  // {
  //   title: 'Pobočka Brno',
  //   company: 'Firma s.r.o.',
  //   street: 'Jiná ulice 456',
  //   postalCode: '602 00',
  //   city: 'Brno',
  //   phone: '+420 987 654 321',
  //   phoneHref: '+420987654321',
  // },
];

/** Primární lokace — pro JSON-LD, footer, mapu */
export const primaryLocation = locations[0];


// ── Sociální sítě ──

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export const socials: SocialLink[] = [
  // Odkomentovat a vyplnit dle potřeby:
  // { name: 'Facebook', url: 'https://facebook.com/firma', icon: 'facebook' },
  // { name: 'Instagram', url: 'https://instagram.com/firma', icon: 'instagram' },
  // { name: 'LinkedIn', url: 'https://linkedin.com/company/firma', icon: 'linkedin' },
];


// ── CMS ──

export const cms = {
  /** GitHub repo ve formátu Owner/repo-name */
  githubRepo: 'Owner/repo-name',

  /** DecapBridge Site ID */
  decapBridgeSiteId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
} as const;


// ── Formulář ──

export const form = {
  /** Cloudflare Turnstile Site Key (veřejný) — nastavit i jako env var */
  turnstileSiteKey: '0x0000000000000000000000',

  /** Consent key pro cookie banner (unikátní per projekt) */
  consentKey: 'firma_cookie_consent',
} as const;


// ── SEO ──

export const seo = {
  /** URL k OG image (1200×630) */
  ogImage: '/og-image.jpg',

  /** URL k logu (pro JSON-LD) */
  logo: '/images/logo.png',
} as const;


// ── Helper: plná adresa pro JSON-LD ──

export function getJsonLdAddress() {
  return {
    '@type': 'PostalAddress' as const,
    streetAddress: primaryLocation.street,
    postalCode: primaryLocation.postalCode,
    addressLocality: primaryLocation.city,
    addressCountry: 'CZ',
  };
}

export function getJsonLdBusiness(description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    description,
    url: site.url,
    logo: `${site.url}${seo.logo}`,
    telephone: contact.phone,
    email: contact.email,
    address: getJsonLdAddress(),
    image: `${site.url}${seo.ogImage}`,
  };
}
