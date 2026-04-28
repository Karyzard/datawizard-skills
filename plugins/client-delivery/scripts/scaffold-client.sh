#!/bin/bash
set -euo pipefail

CLIENT_NAME="${1:?Usage: scaffold-client.sh <client-name>}"
DATE=$(date +%Y-%m-%d)
CLIENT_DIR=~/Documents/_KLIENTI/$CLIENT_NAME

if [ -d "$CLIENT_DIR" ]; then
    echo "ERROR: Client directory already exists: $CLIENT_DIR"
    exit 1
fi

echo "Creating client workspace: $CLIENT_DIR"

# Create directory structure
mkdir -p "$CLIENT_DIR"/{docs/{knowledge-base/drafts,meetings/transcripts,inbox/done,presales,strategy/archive,research,review,final},projects,research,.cursor/rules,.claude/rules}

# Copy and fill templates
TEMPLATE_DIR=~/.claude/templates/client
for file in CLAUDE.md README.md notes.md log.md docs.md meetings.md worklog.md; do
    if [ -f "$TEMPLATE_DIR/$file" ]; then
        sed "s/{{CLIENT_NAME}}/$CLIENT_NAME/g; s/{{DATE}}/$DATE/g" \
            "$TEMPLATE_DIR/$file" > "$CLIENT_DIR/$file"
    fi
done

# Create .claudeignore
cat > "$CLIENT_DIR/.claudeignore" << 'EOF'
docs/knowledge-base/drafts/
docs/inbox/done/
EOF

echo "Done. Client workspace created at: $CLIENT_DIR"
echo ""
echo "Next steps:"
echo "  1. Edit CLAUDE.md — fill in client identity"
echo "  2. Edit README.md — update handoff section"
echo "  3. Add files to docs/knowledge-base/ as source of truth"
