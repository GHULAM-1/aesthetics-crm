# claude-mindmap

A live Excalidraw mind map of the current project's architecture, drawn in Claude Code's
side panel and kept up to date as you work — in **every** project, not just this one.

Claude draws it when the architecture actually moves (a subsystem mapped out, a
multi-module plan agreed, a layer added or rewired), and you can force a render any time
with `/map`. Between milestones it stays quiet.

## Install

```sh
tools/claude-mindmap/install.sh
```

This copies into `~/.claude/`:

| Path | What it is |
|---|---|
| `skills/mindmap/SKILL.md` | Layout, color, camera, and state rules for the map |
| `skills/mindmap/reference.md` | Condensed Excalidraw element format — replaces the MCP's `read_me`, which costs ~4k tokens per session |
| `commands/map.md` | The `/map` slash command |
| `CLAUDE.md` | The milestone auto-draw rule, merged between `<!-- BEGIN/END claude-mindmap -->` markers |
| `mindmap-state/` | Per-project checkpoint + node list, written on first draw |

Re-run it after editing anything here. It replaces its own block in `CLAUDE.md` rather
than appending a duplicate, and leaves the rest of the file alone.

**Prerequisite:** the Excalidraw MCP connector must be enabled for your account — the
skill needs `mcp__Excalidraw__create_view`. If it isn't available in a session, the skill
stays silent rather than failing.

Restart Claude Code after installing so the new skill and command are picked up.

## Usage

| Command | Effect |
|---|---|
| `/map` | Draw the map, or refresh it against the current state of the repo |
| `/map reset` | Throw away this project's state and draw a fresh map |
| `/map zoom api` | Close-up camera on one branch, nothing redrawn |
| `/map auth flow` | Render focused on that subsystem, expanded in more detail |

Everything else is automatic.

## How it stays cheap

Redrawing a whole diagram every turn would be unusable, so:

- **Checkpoints.** `create_view` returns a `checkpointId`; it's persisted per project and
  the next render restores it and emits only the diff — a `delete` for what changed plus
  the handful of new elements. Most of the map costs nothing to keep.
- **Milestones, not turns.** The rule in `CLAUDE.md` lists what counts, and — more
  importantly — what doesn't. Identical renders are skipped silently.
- **No exploration budget of its own.** The map reflects what Claude already understands
  from the conversation. It never spawns a subagent or sweeps the codebase just to draw.
- **Bundled format reference.** `reference.md` replaces the Excalidraw MCP's `read_me`
  tool, which is large and would otherwise be pulled into context on every first draw.

## Shape of the map

A root ellipse for the project, 3–6 branches on a fixed ring around it for the repo's real
architectural seams, up to 5 leaves per branch holding **actual file paths**, and dashed
cross-links showing the data flow between branches. Nodes hold their slot for the life of
the project, so the map stays recognizable as it grows instead of reshuffling on every
update. Colors are assigned by role — UI blue, API purple, services amber, data green,
auth red — consistently across every project you open.

The camera pans branch to branch as it draws, then pulls back to a panorama.

## Editing it

The sources in this directory are the ones to change; `~/.claude` holds copies. Tune the
milestone list in `CLAUDE.md.snippet` if the map fires more or less often than you'd like,
and the slot table in `SKILL.md` if you want a different layout. Re-run `install.sh`
afterwards.

Your own edits *inside* the Excalidraw panel survive too — `restoreCheckpoint` loads the
scene including anything you moved or annotated in fullscreen, and the next update patches
around it.
