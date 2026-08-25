
## Upward return result

The live homepage was scrolled from the bottom back to the top. The page remained rendered and its visible homepage sections, navigation, and footer controls remained present. The temporary diagnostic recorded six scroll events, no JavaScript `error` events, no unhandled promise rejections, and no document-width changes. The document stayed at 1280px width with a 1280px client width and 3938px height.

This indicates the reported crash-loading is not reproduced as a thrown browser exception in the current desktop pass. It may be a transient visual remount, mobile-only lifecycle issue, stale deployment state, or performance stall caused by the Framer bridge’s scroll/animation work. The next inspection should focus on bridge mutation frequency, observer cleanup, iframe reloads, image/canvas workload, and mobile viewport behavior.
