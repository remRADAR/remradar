# Welcome animation preview verification

Preview URL: `http://localhost:3000/?preview=welcome-animation`

The initial runtime view showed the optimized vertical RADARCharts video poster/video occupying the viewport, the `RADARCharts` loading label, and an accessible `ENTER SITE` button. The underlying preserved Framer homepage was already present in the same page extraction, including the Framer content markers, `RADARARTICLES` card stack, `NOW READING...`, and the replacement footer navigation. This confirms the homepage remains mounted and can preload beneath the welcome gate.

The browser viewport was desktop-sized during this inspection. Mobile timing, video playback completion, reduced-motion behavior, and the post-fade state remain to be checked.

The 360x800 mobile capture showed the vertical clip filling the viewport without side gutters or distortion. The RADARCharts label and `ENTER SITE` control remained inside the safe lower region, and the button met the 44px minimum touch-height target.

A separate 360px post-fade headless capture was attempted with a 9.5-second virtual-time budget but did not produce an image because the Chromium process timed out while emitting sandbox audio/GCM diagnostics. The interactive browser session did verify the post-eight-second state: the welcome gate was absent and the Framer homepage, article stack, and footer were visible. Mobile post-fade screenshot evidence is therefore UNVERIFIED, while desktop post-fade behavior is verified.

A fresh-page CDP mobile test at 390x844 measured a full-viewport gate and video, a 105.6x44px Enter site target positioned 20px from the right and 22px from the bottom, zero horizontal overflow, and CSS scroll lock (`html` and `body` hidden). The automated touch dispatch did not dismiss the gate, and the page’s React active class was absent while the server-rendered gate remained. This indicates a hydration/touch-harness timing issue or a real interaction issue requiring isolation; it is not yet counted as a pass.

The corrected mobile harness measured all tested viewports at full width and height with no horizontal overflow and CSS scroll lock. At 390x844, the control remained 105.6x44px and 20px from the right / 22px from the bottom. However, both the CDP touch-emulated interaction and a programmatic `.click()` in the fresh headless target failed to change the server-rendered gate state; the active React class was absent. This points to a headless hydration/runtime timing issue rather than a confirmed visual layout defect. An interactive browser click could not be completed because the browser session became unavailable. Mobile touch dismissal is therefore UNVERIFIED and should be retested in a real mobile browser after deployment.
