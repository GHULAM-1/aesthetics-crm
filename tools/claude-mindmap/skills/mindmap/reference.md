# Excalidraw element format (condensed)

Everything needed for `mcp__Excalidraw__create_view`. Do not call `read_me` — this
replaces it and costs a fraction of the tokens.

`elements` is a **JSON array as a string**. No comments, no trailing commas.

## Required on every drawn element

`type`, `id` (unique, never reused), `x`, `y`, `width`, `height`

Defaults you can omit: `strokeColor: "#1e1e1e"`, `backgroundColor: "transparent"`,
`fillStyle: "solid"`, `strokeWidth: 2`, `roughness: 1`, `opacity: 100`. Canvas is white.

## Shapes

```json
{"type":"rectangle","id":"b_1","x":100,"y":100,"width":220,"height":72,
 "roundness":{"type":3},"backgroundColor":"#a5d8ff","fillStyle":"solid",
 "strokeColor":"#4a9eed","label":{"text":"API routes","fontSize":18}}
```

`ellipse` and `diamond` take the same fields. **Prefer `label` over a separate text
element** — it auto-centers and the container auto-resizes.

Standalone `text` (titles/subtitles only):

```json
{"type":"text","id":"t_1","x":700,"y":650,"text":"Next.js 15","fontSize":14,"strokeColor":"#757575"}
```

`x` is the **left edge**. To center at `cx`: `x = cx - (text.length * fontSize * 0.5) / 2`.
`textAlign` does not position anything — it only affects wrapping.

## Arrows

```json
{"type":"arrow","id":"a_1","x":320,"y":136,"width":200,"height":0,
 "points":[[0,0],[200,0]],"endArrowhead":"arrow","strokeColor":"#8b5cf6",
 "strokeStyle":"dashed","label":{"text":"fetch","fontSize":14},
 "startBinding":{"elementId":"b_1","fixedPoint":[1,0.5]},
 "endBinding":{"elementId":"b_2","fixedPoint":[0,0.5]}}
```

- `points` are `[dx, dy]` offsets from the arrow's own `x, y`. A mid point bows the line:
  `[[0,0],[100,-160],[300,0]]`.
- `endArrowhead`: `null` | `"arrow"` | `"bar"` | `"dot"` | `"triangle"`.
- `fixedPoint`: top `[0.5,0]`, bottom `[0.5,1]`, left `[0,0.5]`, right `[1,0.5]`.
- `strokeStyle`: `"solid"` | `"dashed"` | `"dotted"`.

## Pseudo-elements (not drawn)

**Camera** — must be the first entry, and re-emitted before each section it frames:

```json
{"type":"cameraUpdate","width":800,"height":600,"x":0,"y":0}
```

`x, y` = top-left of the visible area in scene coords. Size **must** be 4:3, one of:
`400×300` (S), `600×450` (M), `800×600` (L), `1200×900` (XL, min font 18),
`1600×1200` (XXL, min font 21). It animates smoothly between positions.

**Restore** — continue from a prior render, including the user's own fullscreen edits:

```json
{"type":"restoreCheckpoint","id":"<checkpointId from the last create_view response>"}
```

**Delete** — placed *after* the elements it removes; also removes their bound labels:

```json
{"type":"delete","ids":"b_2,a_1,t_3"}
```

## Rules that matter

- **Array order is z-order and draw order.** Emit progressively: camera → shape → its
  arrows → next shape. Never all shapes, then all arrows.
- **Ids are permanent.** Never reuse the id of a deleted element.
- **No emoji** — they don't render in Excalidraw's font.
- **Contrast**: minimum text color on white is `#757575`. On light fills use dark
  variants (`#15803d` not `#22c55e`, `#2563eb` not `#4a9eed`).
- **Minimum sizes**: 120×60 for a labeled box, 20–30px gaps, font ≥14 (≥20 for titles).
- **Padding**: don't match camera size to content size — 500px of content wants an
  800×600 camera or it clips.

## Response

`create_view` returns a `checkpointId`. Persist it — it is the only way to patch the
scene later instead of redrawing it.
