---
description: Draw or refresh the live Excalidraw mind map of this project's architecture in the side panel
argument-hint: "[optional focus, e.g. 'auth flow' or 'reset']"
allowed-tools: Read, Write, Bash, Glob, Grep, mcp__Excalidraw__create_view
---

Invoke the `mindmap` skill and render the architecture mind map for the current project
now, regardless of whether a milestone was reached.

Argument: `$ARGUMENTS`

- **Empty** — draw the map if none exists, otherwise refresh it against your current
  understanding of the repo (restore the checkpoint and patch the diff).
- **`reset`** — delete this project's state file under `~/.claude/mindmap-state/` and draw
  a completely fresh map from scratch.
- **`zoom <branch>`** — restore the checkpoint, emit no new elements, and end on a
  `600×450` camera framing that branch's slot so the user gets a close-up.
- **Anything else** — treat it as the focus for this render: the map should center on that
  subsystem, expanding it into branches and leaves in more detail than the rest, and carry
  a small subtitle under the root naming the focus.

Follow the skill's layout, color, camera, and state rules exactly. When you're done, say
one sentence — no walkthrough of the map's contents.
