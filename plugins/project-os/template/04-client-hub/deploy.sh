#!/usr/bin/env bash
# Slozi klientskou plochu a nasadi ji na Netlify.
#
#   ./04-client-hub/deploy.sh                  # draft nahled, neprepise zivou verzi
#   ./04-client-hub/deploy.sh --prod "zprava"  # ostry deploy na zivou URL
#
# POZOR: vsechno nasazene je verejne pro kohokoli s odkazem.
# Pred kazdym deployem projit `git diff 04-client-hub/`.
# Na plochu nikdy: castky, rozpocty, interni IP a pristupy, osobni udaje, nic o jinych klientech.
#
# PUBLIKUJE SE VYCTEM, nikdy plosnym kopirovanim slozky.
# Duvod: `ukoly/10-open/` jsou ukoly, ktere klientovi jeste neodesly, a lezi
# ve stejne slozce jako ty odeslane. Kdo tenhle skript meni, musi vycet zachovat.
set -euo pipefail

SITE_ID="${NETLIFY_SITE_ID:-<doplnit-site-id>}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$REPO_ROOT/04-client-hub"
DIST="$(mktemp -d)/dist"

if [[ "$SITE_ID" == "<doplnit-site-id>" ]]; then
  echo "CHYBA: doplnte SITE_ID v deploy.sh nebo nastavte NETLIFY_SITE_ID." >&2
  exit 1
fi

mkdir -p "$DIST/ukoly"

# --- 1. verejny vycet ---------------------------------------------------------
cp "$SRC/index.html" "$SRC/_redirects" "$DIST/"
for f in co-je-noveho.md milniky.md jak-hlasit.md; do
  [[ -f "$SRC/$f" ]] && cp "$SRC/$f" "$DIST/$f"
done
for d in agenda prototypy; do
  [[ -d "$SRC/$d" ]] && cp -R "$SRC/$d" "$DIST/$d"
done
# Z ukolu jen odeslane a uzavrene. 10-open zustava interni.
for d in 20-sent 30-done; do
  [[ -d "$SRC/ukoly/$d" ]] && cp -R "$SRC/ukoly/$d" "$DIST/ukoly/$d"
done

# CONTEXT.md je interni dokumentace slozek, ven nepatri.
find "$DIST" -name 'CONTEXT.md' -delete

# --- 2. pojistka --------------------------------------------------------------
if [[ -e "$DIST/ukoly/10-open" ]]; then
  echo "CHYBA: ukoly/10-open se dostalo do deploy kopie. Deploy zastaven." >&2
  exit 1
fi

# --- 3. markdown -> html (jen to, co uz je v DIST) -----------------------------
if command -v pandoc >/dev/null 2>&1; then
  while IFS= read -r -d '' f; do
    pandoc --standalone --from=markdown --to=html5 \
           --metadata title="$(basename "${f%.md}")" \
           -o "${f%.md}.html" "$f"
    rm "$f"
  done < <(find "$DIST" -name '*.md' -print0)
else
  echo "VAROVANI: pandoc neni nainstalovany (brew install pandoc)." >&2
  echo "           Markdown stranky se nenasadi." >&2
  find "$DIST" -name '*.md' -delete
fi

# --- 3b. rozcestniky podslozek -------------------------------------------------
# /ukoly/, /agenda/ a /prototypy/ by bez indexu skoncily na 404.
listing () {  # $1 = adresar v DIST, $2 = nadpis, dalsi = dvojice "podslozka|popisek"
  local dir="$1"; local nadpis="$2"; shift 2
  [[ -d "$DIST/$dir" ]] || return 0
  {
    printf '<!doctype html><html lang="cs"><head><meta charset="utf-8">'
    printf '<meta name="viewport" content="width=device-width,initial-scale=1">'
    printf '<meta name="robots" content="noindex,nofollow"><title>%s</title>' "$nadpis"
    printf '<style>:root{--bg:#fbfbfa;--fg:#1b1b19;--muted:#6b6b66;--line:#e6e5e1}'
    printf '@media(prefers-color-scheme:dark){:root{--bg:#151513;--fg:#f2f1ed;--muted:#a3a29c;--line:#33322e}}'
    printf 'body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 -apple-system,system-ui,sans-serif}'
    printf '.w{max-width:760px;margin:0 auto;padding:56px 24px 80px}h1{font-size:28px;margin:0 0 32px;letter-spacing:-.02em}'
    printf 'h2{font-size:15px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:32px 0 12px;font-weight:600}'
    printf 'ul{list-style:none;padding:0;margin:0}li{border-bottom:1px solid var(--line)}'
    printf 'li a{display:block;padding:14px 0;color:inherit;text-decoration:none}li a:hover{color:var(--muted)}'
    printf '.back{display:inline-block;margin-bottom:24px;color:var(--muted);text-decoration:none}'
    printf '.empty{color:var(--muted);padding:14px 0}</style></head><body><div class="w">'
    printf '<a class="back" href="/">&#8592; Zpet</a><h1>%s</h1>' "$nadpis"
    if [[ $# -eq 0 ]]; then set -- ".|"; fi
    for pair in "$@"; do
      local sub="${pair%%|*}"; local label="${pair#*|}"
      [[ -n "$label" ]] && printf '<h2>%s</h2>' "$label"
      printf '<ul>'
      local found=0
      while IFS= read -r f; do
        local rel="${f#$DIST/$dir/}"
        local name; name="$(basename "${rel%.html}")"
        printf '<li><a href="/%s/%s">%s</a></li>' "$dir" "$rel" "${name//-/ }"
        found=1
      done < <(find "$DIST/$dir/$sub" -name '*.html' ! -name 'index.html' 2>/dev/null | sort)
      [[ $found -eq 0 ]] && printf '<li class="empty">Zatim nic.</li>'
      printf '</ul>'
    done
    printf '</div></body></html>'
  } > "$DIST/$dir/index.html"
}
listing ukoly     "Ukoly pro vas" "20-sent|Ceka na vas" "30-done|Vyrizeno"
listing agenda    "Agenda schuzek"
listing prototypy "Prototypy"

# --- 4. zpetny odkaz v prototypech --------------------------------------------
BACKLINK='<a href="/" style="position:fixed;left:16px;bottom:16px;z-index:2147483647;background:#111;color:#fff;font:600 13px/1 system-ui,sans-serif;padding:10px 16px;border-radius:999px;text-decoration:none;box-shadow:0 4px 16px rgba(0,0,0,.3)">&#8592; Zpet</a>'
export BACKLINK
while IFS= read -r -d '' f; do
  perl -0pi -e 's{</body>}{$ENV{BACKLINK} . "</body>"}ie' "$f"
done < <(find "$DIST/prototypy" -name '*.html' -print0 2>/dev/null)

# --- 5. deploy ----------------------------------------------------------------
echo "Publikuje se:"
(cd "$DIST" && find . -type f | sort | sed 's|^\./|  |')

if [[ "${1:-}" == "--prod" ]]; then
  netlify deploy --prod --site "$SITE_ID" --dir "$DIST" --message "${2:-plocha: deploy}"
else
  netlify deploy --site "$SITE_ID" --dir "$DIST" --message "${2:-plocha: nahled}"
fi
