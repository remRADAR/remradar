# Glass UI visual QA

Date: 2026-08-20

## Homepage

The production homepage returned HTTP 200 and rendered the existing Framer-authored composition with the native floating dock. The root-mounted atmospheric layer and dock selectors are present in the server-rendered output. The Framer iframe remains visually dominant and mostly opaque/black in the initial desktop viewport, so the new atmosphere is intentionally most visible around native shell areas rather than through the authored iframe content.

## Native charts route

The `/charts` route rendered successfully with the native route shell, archive links, page content, and floating dock. The route uses the shared transparent shell, warm background tokens, frosted panel treatment, and responsive styling from `globals.css`.

## Implementation checks

`yarn lint` passed. `yarn build` passed after correcting the fixed-length RGB tuple typing in `time-of-day-background.tsx`. The background engine uses a root-mounted, fixed, pointer-events-none atmospheric layer with time-of-day color interpolation, low-cost CSS haze, restrained stars, grain, reduced-motion handling, and mobile blur/animation adjustments.

## Follow-up consideration

If the user expects the glass treatment to be visible directly over every part of the Framer homepage, the iframe export itself will need a carefully targeted internal surface override. The current change deliberately preserves the authored Framer homepage and applies the new visual system to the shared shell and native pages without rewriting its layout.
