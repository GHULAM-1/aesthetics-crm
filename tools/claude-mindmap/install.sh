#!/usr/bin/env bash
# Install the live architecture mind map into ~/.claude so it works in every project.
# Idempotent: safe to re-run after editing the sources in this directory.
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"

mkdir -p "$DEST/skills" "$DEST/commands" "$DEST/mindmap-state"

rm -rf "$DEST/skills/mindmap"
cp -R "$SRC/skills/mindmap" "$DEST/skills/mindmap"
cp "$SRC/commands/map.md" "$DEST/commands/map.md"

# Merge the milestone rule into ~/.claude/CLAUDE.md between its markers, replacing any
# previously installed copy rather than appending a second one.
MEM="$DEST/CLAUDE.md"
touch "$MEM"
python3 - "$MEM" "$SRC/CLAUDE.md.snippet" <<'PY'
import sys, re, pathlib

mem_path, snippet_path = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
snippet = snippet_path.read_text().strip()
existing = mem_path.read_text()

block = re.compile(
    r"<!-- BEGIN claude-mindmap -->.*?<!-- END claude-mindmap -->",
    re.DOTALL,
)
if block.search(existing):
    updated = block.sub(lambda _: snippet, existing)
else:
    sep = "" if existing.endswith("\n\n") or not existing.strip() else "\n\n"
    updated = existing + sep + snippet + "\n"

mem_path.write_text(updated)
PY

echo "Installed into $DEST"
echo "  skills/mindmap/     the mind map skill + Excalidraw format reference"
echo "  commands/map.md     the /map slash command"
echo "  CLAUDE.md           milestone auto-draw rule"
echo "  mindmap-state/      per-project checkpoints (created on first draw)"
echo
echo "Requires the Excalidraw MCP connector to be enabled for your account."
echo "Restart Claude Code (or run /doctor) to pick up the new skill and command."
