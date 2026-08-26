---
name: mindmap
description: Draw and incrementally update a live Excalidraw mind map of the current project's codebase architecture in the side panel. Use at architectural milestones - after mapping out a subsystem, after agreeing on a plan that touches multiple modules, after adding or removing a module, after a refactor changes how layers connect - and whenever the user runs /map or asks to see, draw, refresh, or update the map / mind map / architecture diagram. Do NOT use for one-off explanatory diagrams unrelated to this repo's structure.
---

# Codebase Architecture Mind Map

A persistent, incrementally-updated mind map of **this project's architecture**, rendered
into the Excalidraw side panel via `mcp__Excalidraw__create_view`.

The map is a companion to the conversation, not a deliverable. It should feel like a
whiteboard someone keeps adding to while you talk — not like a document you regenerate.

## Hard rules

1. **Never call `mcp__Excalidraw__read_me`.** The format reference you need is in
   `reference.md` next to this file. Read that instead, once per session, right before
   your first `create_view` call.
2. **Never redraw from scratch when a checkpoint exists.** Restore and patch. See
   *Incremental updates*.
3. **Never launch a subagent or a broad codebase sweep just to draw the map.** The map
   reflects what you already understand. If you know almost nothing yet, draw a small
   honest map — 1 root and 2–4 branches — and grow it as you learn.
4. **Never let the map interrupt the actual work.** Draw it, then continue. One or two
   sentences of prose about it, maximum. Do not explain the map's contents in the
   transcript — the picture is the explanation.
5. **Never draw the same state twice.** If nothing architecturally new happened since the
   last render, skip it silently.

## State

Per-project state lives at:

```
~/.claude/mindmap-state/<slug>.json
```

where `<slug>` is the absolute project root with `/` replaced by `-` and a leading `-`
stripped (e.g. `/home/user/aesthetics-crm` → `home-user-aesthetics-crm.json`).

Schema:

```json
{
  "projectRoot": "/home/user/aesthetics-crm",
  "checkpointId": "ckpt_...",
  "title": "aesthetics-crm",
  "nodes": [
    { "id": "b_api", "label": "API routes", "kind": "branch", "x": 1180, "y": 500 },
    { "id": "l_api_1", "label": "app/api/leads", "kind": "leaf", "parent": "b_api", "x": 1180, "y": 600 }
  ],
  "edges": [{ "id": "e_1", "from": "b_ui", "to": "b_api" }],
  "nextSeq": 14,
  "updatedAt": "2026-08-26T00:00:00Z"
}
```

Read it at the start of every map operation (`cat` it; treat a missing file as a first
draw). Write it back immediately after `create_view` returns, storing the new
`checkpointId` from the tool response. If the file is missing, corrupt, or its
`projectRoot` doesn't match the current cwd, start fresh.

`nextSeq` is a monotonically increasing counter. **Every new element id must use it**
(`b_7`, `l_7`, `e_7`, …) and it must never go backwards — ids of deleted elements can
never be reused.

## When to draw

**On `/map`** — always draw or refresh, even if little changed.

**Automatically, at architectural milestones only.** A milestone is a moment where the
*shape* of the system in your head changed:

- You finished exploring a subsystem and now understand how its pieces connect.
- You and the user agreed on a plan that spans more than one module.
- You added, removed, or renamed a module, route group, service, table, or layer.
- A refactor changed which layer talks to which.
- You discovered a connection that contradicts what the map currently shows.

**Not** a milestone: a single-file edit, a bug fix inside one function, a test run, a
question answered from memory, formatting, dependency bumps, or anything where the map
would come out byte-identical.

When in doubt, don't draw. A map that redraws constantly is noise; a map that appears at
the three moments the architecture actually moved is the whole point.

## What to draw

The subject is always **the architecture of the current repo** — never the conversation,
never a generic tutorial diagram.

Structure it as a mind map radiating from the project:

- **Root** (ellipse, center): the project name, and a one-line stack descriptor
  underneath as a separate small text element (e.g. `Next.js 16 · Prisma · Postgres`).
  Read the major versions out of the manifest — never write one from memory. A stale
  framework version in the subtitle is the single most likely thing to be wrong on the
  whole map.
- **Branches** (rounded rects, ring around the root): the top-level architectural
  divisions. Pick 3–6. Use whatever the repo's real seams are — typically some of:
  UI / routes, API, domain logic or services, data & schema, auth, external integrations,
  background jobs, config & build.
- **Leaves** (smaller rounded rects, outside their branch): the concrete things — actual
  directory or file paths, table names, service names. **Use real paths from the repo**,
  relative to root, shortened from the left if long (`…/api/leads/route.ts`). A leaf whose
  label you invented is worse than no leaf.
- **Cross-links** (dashed arrows between branches): the data flow. This is the part that
  makes the map worth looking at — `UI → API → services → DB`, `auth → every branch`.
  Label them with the mechanism (`fetch`, `server action`, `prisma`, `webhook`).

Cap it: **6 branches, 5 leaves per branch, 6 cross-links.** Past that it stops being
readable at panel width. If the repo is bigger than that, the map shows the parts
relevant to what you're working on, and you say so in a small subtitle.

### Colors (by role, consistently)

| Role | Fill | Stroke |
|---|---|---|
| Root | `#fff3bf` | `#f59e0b` |
| UI / frontend / routes | `#a5d8ff` | `#4a9eed` |
| API / transport | `#d0bfff` | `#8b5cf6` |
| Domain logic / services | `#ffd8a8` | `#f59e0b` |
| Data / schema / storage | `#c3fae8` | `#22c55e` |
| Auth / security | `#ffc9c9` | `#ef4444` |
| External / third-party | `#eebefa` | `#ec4899` |
| Config / build / tooling | `#e9ecef` | `#757575` |

Leaves use the same fill as their branch. Cross-link arrows take the stroke color of
their **source** branch, `strokeStyle: "dashed"`.

## Layout

Work in a fixed 1600×1200 scene so coordinates stay stable across incremental updates.

- Root ellipse: `x: 660, y: 520, width: 280, height: 120`. Stack descriptor text centered
  at `(800, 660)`.
- Branch slots — use them in this order, and **once a branch owns a slot it keeps it
  forever**, even if other branches are deleted:

  | Slot | Branch x, y (220×72) | Leaf column x | Leaf start y | Leaf step |
  |---|---|---|---|---|
  | 1 right | 1180, 544 | 1200 | 660 | 64 |
  | 2 left | 200, 544 | 180 | 660 | 64 |
  | 3 top-right | 1040, 200 | 1060 | 100 | -64 (upward) |
  | 4 top-left | 340, 200 | 320 | 100 | -64 (upward) |
  | 5 bottom-right | 1040, 888 | 1060 | 990 | 64 |
  | 6 bottom-left | 340, 888 | 320 | 990 | 64 |

  Leaf boxes are 200×48. Slots 3–6 grow their leaf stacks *away* from the root; slots 1–2
  grow downward.
- Root→branch arrows: solid, `strokeWidth: 2`, bound with `startBinding` on the root and
  `endBinding` on the branch.
- Branch→leaf arrows: skip them. Instead draw one thin vertical `strokeWidth: 1`,
  `#b0b0b0` line down the leaf column. Fewer elements, reads cleaner.
- Cross-links route around the root — give them a mid `points` waypoint that bows outward
  by 120–180px so they never cross the root ellipse.

**Font sizes:** root 24, branches 18, leaves 15, cross-link labels 14, subtitle 14.
Never below 14.

## Camera choreography

This is what makes it feel alive. Do not draw everything under one static camera.

1. `cameraUpdate` **M** `600×450` at `(500, 400)` — draw the root and its subtitle.
2. For **each branch**: `cameraUpdate` **M** `600×450` framing that branch's slot, then
   draw the root→branch arrow, the branch box, the leaf column line, then its leaves.
3. `cameraUpdate` **L** `800×600` at `(400, 300)` — draw the cross-link arrows.
4. `cameraUpdate` **XXL** `1600×1200` at `(0, 0)` — final panorama. Nothing new drawn.

Framing rule for step 2: camera `x = branchX - 190`, `y = branchY - 190`, clamped so the
leaf stack stays in frame (for downward stacks, `y = branchY - 60`).

Emit in draw order — camera, then the elements it frames, then the next camera. Never
batch all shapes then all arrows.

## Incremental updates

When `checkpointId` exists in state:

```json
[
  {"type":"restoreCheckpoint","id":"<checkpointId>"},
  {"type":"cameraUpdate","width":600,"height":450,"x":990,"y":354},
  {"type":"delete","ids":"l_4,l_5"},
  ...new elements with fresh ids from nextSeq...,
  {"type":"cameraUpdate","width":1600,"height":1200,"x":0,"y":0}
]
```

Diff the state file's `nodes`/`edges` against what you now believe:

- **Unchanged** → emit nothing. This is most of the map, most of the time.
- **Relabeled** → `delete` the old id, draw a replacement at the *same coordinates* with a
  new id.
- **Removed** → `delete` the id (and any arrow ids touching it).
- **Added** → draw at the next free coordinate in its slot.

Then always close with the XXL panorama camera so the user ends on the whole picture.

If a restore fails or the checkpoint is rejected, fall back to a full redraw from the
state file's `nodes` — reusing their recorded coordinates — and mint fresh ids for
everything.

## Procedure

1. Read the state file. Read `reference.md` if you haven't this session.
2. Decide the map's contents from what you already know about the repo. Only if the state
   file is missing *and* you have no repo knowledge yet, take one cheap pass: read
   `package.json`/equivalent manifest, and list directories two levels deep. Nothing more.
3. Build the element array per the layout and camera rules above.
4. Call `mcp__Excalidraw__create_view` once, with the whole array.
5. Write the state file back with the returned `checkpointId`, the full node/edge list,
   and the advanced `nextSeq`.
6. Say at most one sentence, then get back to the actual task.
