# AKT!V centered image, 3D typography, and spacing verification

The supplied `Photoroom_20260820_92233AM(convert.io).webp` was installed as `public/framer-site/_deps/images/radar-aktiv-centered.webp`. The Framer runtime now applies the image with `width: 100%`, `height: 100%`, `object-fit: cover`, `object-position: 50% 50%`, and no transform. This preserves the center focus and avoids artificial scale transforms; the frame may still crop by design where its aspect ratio differs from the 16:9 source.

The AKT!V copy receives the `radar-aktiv-3d` class with a restrained perspective keyframe animation, layered text shadows, and a reduced-motion override. The charts wrapper `.framer-27qyin-container` remains 380px high at y=2010 in the live desktop preview. The first photo carousel `.framer-hz7xvy` is shifted up 14px, resulting in a measured 24px gap instead of the previous 38px gap, with no overlap.

Fresh checks: ESLint passed; production build passed; routes /, /charts, /ontheradar, /magazine, /radarmusic, /store, /spotlights, /motherland, and /platforms returned HTTP 200 from port 3002; active Framer documents reference the centered image and contain no obsolete wide/square references; browser runtime confirmed the centered image source, `object-fit: cover`, `object-position: 50% 50%`, `transform: none`, AKT!V animation name `radarAktivDepth`, and 24px charts-to-carousel gap.

The existing mobile harness completed without horizontal overflow at 390x844, but its welcome-gate dismissal fields remain unverified in that harness because it targets the intro timing path rather than the updated section. The desktop live browser verification is confirmed.

Source: repository command output and public browser preview at https://3002-i91j7hdnytwwwr6cqrbvt-905e6703.us3.manus.computer/?review=aktiv-centered-3d-spacing.

---

