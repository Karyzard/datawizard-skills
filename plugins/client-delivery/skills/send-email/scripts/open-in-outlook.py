#!/usr/bin/env python3
"""
Open a pre-composed email in Microsoft Outlook on macOS.

Reads a Markdown file with YAML frontmatter and converts it to an HTML email
message opened in Outlook via AppleScript.

Usage:
    python open-in-outlook.py email-draft.md
    python open-in-outlook.py email-draft.md --attachment invoice.pdf --attachment report.docx

Frontmatter fields:
    to:          Recipient email or "Name <email>" (required)
    subject:     Email subject line (required)
    from:        Sender identity — not used by script but kept for context
    attachments: List of file paths (alternative to --attachment flags)
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys

# ---------------------------------------------------------------------------
# Markdown → HTML conversion (basic, no external deps)
# ---------------------------------------------------------------------------

def md_to_html(md: str) -> str:
    """Convert simple Markdown to Outlook-friendly inline-styled HTML."""
    lines = md.split("\n")
    html_parts: list[str] = []
    in_list = False
    in_ordered_list = False

    for line in lines:
        stripped = line.strip()

        # Blank line — close any open list
        if not stripped:
            if in_list:
                html_parts.append("</ul>")
                in_list = False
            if in_ordered_list:
                html_parts.append("</ol>")
                in_ordered_list = False
            continue

        # Horizontal rule
        if re.match(r"^-{3,}$", stripped) or re.match(r"^\*{3,}$", stripped):
            if in_list:
                html_parts.append("</ul>")
                in_list = False
            if in_ordered_list:
                html_parts.append("</ol>")
                in_ordered_list = False
            html_parts.append('<hr style="border:none;border-top:1px solid #cccccc;margin:18px 0;">')
            continue

        # Headings
        heading_match = re.match(r"^(#{1,3})\s+(.*)", stripped)
        if heading_match:
            if in_list:
                html_parts.append("</ul>")
                in_list = False
            if in_ordered_list:
                html_parts.append("</ol>")
                in_ordered_list = False
            level = len(heading_match.group(1))
            text = inline_format(heading_match.group(2))
            sizes = {1: "16px", 2: "15px", 3: "14px"}
            html_parts.append(
                f'<p style="font-size:{sizes.get(level,"14px")};font-weight:bold;'
                f'margin:18px 0 8px 0;">{text}</p>'
            )
            continue

        # Unordered list item
        ul_match = re.match(r"^[-*]\s+(.*)", stripped)
        if ul_match:
            if not in_list:
                if in_ordered_list:
                    html_parts.append("</ol>")
                    in_ordered_list = False
                html_parts.append('<ul style="margin:6px 0 10px 0;padding-left:22px;">')
                in_list = True
            html_parts.append(f'<li style="margin-bottom:5px;">{inline_format(ul_match.group(1))}</li>')
            continue

        # Ordered list item
        ol_match = re.match(r"^(\d+)\.\s+(.*)", stripped)
        if ol_match:
            if not in_ordered_list:
                if in_list:
                    html_parts.append("</ul>")
                    in_list = False
                html_parts.append('<ol style="margin:6px 0 10px 0;padding-left:22px;">')
                in_ordered_list = True
            html_parts.append(f'<li style="margin-bottom:5px;">{inline_format(ol_match.group(2))}</li>')
            continue

        # Regular paragraph
        if in_list:
            html_parts.append("</ul>")
            in_list = False
        if in_ordered_list:
            html_parts.append("</ol>")
            in_ordered_list = False
        html_parts.append(f'<p style="margin:0 0 10px 0;">{inline_format(stripped)}</p>')

    # Close any open list
    if in_list:
        html_parts.append("</ul>")
    if in_ordered_list:
        html_parts.append("</ol>")

    return "\n".join(html_parts)


def inline_format(text: str) -> str:
    """Handle bold, italic, links, and line breaks."""
    # Links: [text](url)
    text = re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        r'<a href="\2" style="color:#0563C1;">\1</a>',
        text,
    )
    # Bold: **text** or __text__
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"__(.+?)__", r"<strong>\1</strong>", text)
    # Italic: *text* or _text_
    text = re.sub(r"\*(.+?)\*", r"<em>\1</em>", text)
    text = re.sub(r"(?<!\w)_(.+?)_(?!\w)", r"<em>\1</em>", text)
    # Inline code: `text`
    text = re.sub(r"`(.+?)`", r"<code>\1</code>", text)
    # Line breaks: two trailing spaces or explicit <br>
    text = re.sub(r"  $", "<br>", text)
    return text


# ---------------------------------------------------------------------------
# Frontmatter parsing
# ---------------------------------------------------------------------------

def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Split YAML frontmatter from body. Returns (metadata, body)."""
    if not content.startswith("---"):
        return {}, content

    end = content.find("---", 3)
    if end == -1:
        return {}, content

    fm_text = content[3:end].strip()
    body = content[end + 3:].strip()

    meta: dict = {}
    current_key = None
    current_list: list[str] | None = None

    for line in fm_text.split("\n"):
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue

        # List item under current key
        if stripped.startswith("- ") and current_key:
            if current_list is None:
                current_list = []
            current_list.append(stripped[2:].strip().strip('"').strip("'"))
            meta[current_key] = current_list
            continue

        # Key: value
        kv = stripped.split(":", 1)
        if len(kv) == 2:
            # Save previous list if any
            current_key = kv[0].strip()
            val = kv[1].strip().strip('"').strip("'")
            current_list = None
            if val:
                meta[current_key] = val
            # else: value might come as list items below

    return meta, body


def parse_recipient(raw: str) -> tuple[str, str]:
    """Parse 'Name <email>' or plain email. Returns (name, email)."""
    match = re.match(r"^(.+?)\s*<(.+?)>\s*$", raw)
    if match:
        return match.group(1).strip(), match.group(2).strip()
    return "", raw.strip()


# ---------------------------------------------------------------------------
# AppleScript generation
# ---------------------------------------------------------------------------

def as_escape(s: str) -> str:
    """Escape a string for embedding inside AppleScript double-quoted strings."""
    return s.replace("\\", "\\\\").replace('"', '\\"')


def build_applescript(
    subject: str,
    to_name: str,
    to_email: str,
    html_body: str,
    attachments: list[str],
) -> str:
    """Build an AppleScript that creates and opens an Outlook message."""
    attach_lines = ""
    for path in attachments:
        abs_path = os.path.abspath(path)
        attach_lines += (
            f'        make new attachment with properties '
            f'{{file:POSIX file "{as_escape(abs_path)}"}}\n'
        )

    return f'''\
tell application "Microsoft Outlook"
    set htmlBody to "{as_escape(html_body)}"
    set newMsg to make new outgoing message with properties {{subject:"{as_escape(subject)}", content:htmlBody}}
    tell newMsg
        make new to recipient with properties {{email address:{{address:"{as_escape(to_email)}", name:"{as_escape(to_name)}"}}}}
{attach_lines}    end tell
    open newMsg
    activate
end tell
'''


# ---------------------------------------------------------------------------
# HTML wrapper
# ---------------------------------------------------------------------------

STYLE = (
    'font-family:Calibri,Arial,sans-serif;font-size:14px;'
    'line-height:1.6;color:#000000;'
)


def wrap_html(body_html: str) -> str:
    """Wrap converted HTML in a minimal container with Outlook-friendly styling."""
    return f'<div style="{STYLE}">{body_html}</div>'


# ---------------------------------------------------------------------------
# Sender profile / signature
#
# The signature is NOT typed into the Markdown body — it's rendered here from a
# reusable sender profile so every mail from a given sender looks identical and
# a new team member configures their own once. The `signature:` frontmatter
# field picks the profile (default: datawizard).
# ---------------------------------------------------------------------------

# User overrides live outside the plugin so they survive plugin updates.
USER_SIGNATURE_DIR = os.path.expanduser("~/.claude/email-signatures")
# Bundled defaults ship with the skill (…/send-email/signatures/).
BUNDLED_SIGNATURE_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "..", "signatures"
)


def load_sender_profile(name: str) -> dict | None:
    """Resolve a sender profile by name. First hit wins:

        1. ~/.claude/email-signatures/<name>.json   (user override)
        2. ~/.claude/email-signatures/<name>.html   (user raw-HTML override)
        3. <skill>/signatures/<name>.json           (bundled default)
        4. <skill>/signatures/<name>.html           (bundled raw HTML)

    Returns the profile dict (fields), {"html": "..."} for raw HTML, or None.
    """
    name = (name or "datawizard").strip()
    for base in (USER_SIGNATURE_DIR, BUNDLED_SIGNATURE_DIR):
        json_path = os.path.join(base, f"{name}.json")
        if os.path.isfile(json_path):
            with open(json_path, encoding="utf-8") as f:
                return json.load(f)
        html_path = os.path.join(base, f"{name}.html")
        if os.path.isfile(html_path):
            with open(html_path, encoding="utf-8") as f:
                return {"html": f.read().strip()}
    return None


def signature_html(profile: dict | None) -> str:
    """Render a sender profile as an Outlook-friendly HTML signature block."""
    if not profile:
        return ""
    if profile.get("html"):
        return "\n" + profile["html"]
    parts = [
        '<div style="margin-top:16px;font-family:Calibri,Arial,sans-serif;'
        'font-size:14px;line-height:1.5;color:#000000;">'
    ]
    if profile.get("name"):
        parts.append(f'  <p style="margin:0 0 2px 0;"><strong>{profile["name"]}</strong></p>')
    if profile.get("tagline"):
        parts.append(f'  <p style="margin:0 0 8px 0;color:#595959;">{profile["tagline"]}</p>')
    if profile.get("email"):
        parts.append(
            f'  <p style="margin:0 0 2px 0;">📧 <a href="mailto:{profile["email"]}" '
            f'style="color:#0563C1;text-decoration:none;">{profile["email"]}</a></p>'
        )
    if profile.get("phone"):
        tel = re.sub(r"[^0-9+]", "", profile["phone"])
        parts.append(
            f'  <p style="margin:0;">📱 <a href="tel:{tel}" '
            f'style="color:#0563C1;text-decoration:none;">{profile["phone"]}</a></p>'
        )
    parts.append("</div>")
    return "\n" + "\n".join(parts)


def signature_text(profile: dict | None) -> str:
    """Render a sender profile as a plain-text signature (for --format text)."""
    if not profile:
        return ""
    if profile.get("html"):
        txt = re.sub(r"<[^>]+>", "", profile["html"])
        return "\n\n" + re.sub(r"\n{2,}", "\n", txt).strip()
    lines = [profile[k] for k in ("name", "tagline") if profile.get(k)]
    if profile.get("email"):
        lines.append(f'📧 {profile["email"]}')
    if profile.get("phone"):
        lines.append(f'📱 {profile["phone"]}')
    return "\n\n" + "\n".join(lines) if lines else ""


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Open a Markdown email draft in Outlook or output as plain text")
    parser.add_argument("file", help="Path to Markdown file with YAML frontmatter")
    parser.add_argument("--attachment", action="append", default=[], help="File to attach (repeatable)")
    parser.add_argument("--format", choices=["outlook", "text"], default="outlook",
                        help="Output format: 'outlook' (default) opens in Outlook, 'text' prints plain text")
    args = parser.parse_args()

    # Read file
    path = os.path.expanduser(args.file)
    if not os.path.isfile(path):
        print(f"Soubor nenalezen: {path}", file=sys.stderr)
        sys.exit(1)

    with open(path, encoding="utf-8") as f:
        content = f.read()

    # Parse
    meta, body = parse_frontmatter(content)

    # Remove the top-level heading (# E-mail...) if present — it's the title, not email content
    body = re.sub(r"^#\s+.*\n*", "", body, count=1).strip()

    # Strip blockquotes that serve as draft metadata (lines starting with >)
    # and the first --- separator after them
    body_lines = []
    skip_meta_block = True
    for line in body.split("\n"):
        if skip_meta_block and not line.strip():
            continue
        if skip_meta_block and line.strip().startswith(">"):
            continue
        if skip_meta_block and line.strip() == "---":
            skip_meta_block = False
            continue
        skip_meta_block = False
        body_lines.append(line)
    body = "\n".join(body_lines).strip()

    subject = meta.get("subject", "")
    to_raw = meta.get("to", "")
    to_name, to_email = parse_recipient(to_raw)

    if not subject:
        print("Chybí pole 'subject' ve frontmatter.", file=sys.stderr)
        sys.exit(1)
    if not to_email:
        print("Chybí pole 'to' ve frontmatter.", file=sys.stderr)
        sys.exit(1)

    # Collect attachments from CLI + frontmatter
    attachments = list(args.attachment)
    fm_attachments = meta.get("attachments", [])
    if isinstance(fm_attachments, str):
        fm_attachments = [fm_attachments]
    if isinstance(fm_attachments, list):
        attachments.extend(fm_attachments)

    # Resolve attachment paths relative to the markdown file's directory
    md_dir = os.path.dirname(os.path.abspath(path))
    resolved = []
    for att in attachments:
        att = att.strip()
        if not att:
            continue
        if not os.path.isabs(att):
            att = os.path.join(md_dir, att)
        if not os.path.isfile(att):
            print(f"Varování: příloha nenalezena: {att}", file=sys.stderr)
        resolved.append(att)

    # Resolve the sender's signature profile (frontmatter `signature:`)
    profile = load_sender_profile(meta.get("signature", "datawizard"))

    # --- Plain text output ---
    if args.format == "text":
        recipient = f"{to_name} <{to_email}>" if to_name else to_email
        print(f"Komu: {recipient}")
        print(f"Předmět: {subject}")
        if resolved:
            print(f"Přílohy: {', '.join(os.path.basename(a) for a in resolved)}")
        print()
        print(body)
        print(signature_text(profile))
        return

    # --- Outlook output ---
    body_html = md_to_html(body)
    full_html = wrap_html(body_html + signature_html(profile))

    script = build_applescript(subject, to_name, to_email, full_html, resolved)
    result = subprocess.run(["osascript", "-e", script], capture_output=True, text=True)

    if result.returncode != 0:
        print("Chyba pri otevirani Outlooku:", file=sys.stderr)
        print(result.stderr, file=sys.stderr)
        sys.exit(1)

    print(f"Hotovo — zprava pro {to_name or to_email} je otevrena v Outlooku.")
    if resolved:
        print(f"Prilohy ({len(resolved)}):")
        for a in resolved:
            print(f"  - {os.path.basename(a)}")


if __name__ == "__main__":
    main()
