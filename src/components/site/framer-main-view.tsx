import Link from "next/link";
import type { NativeComponentReplacement } from "@/lib/native-content";

function buildFramerHeightBridge(replacement: NativeComponentReplacement) {
  const safeReplacement = JSON.stringify(replacement).replace(/</g, "\\u003c");

  return `(() => {
  const selector = 'iframe[data-radar-framer]';
  const replacement = ${safeReplacement};

  const measure = (frame) => {
    const document = frame.contentDocument;
    if (!document) return;

    frame.dataset.radarFramerReady = 'true';

    const applyReplacement = () => {
      const innerDocument = frame.contentDocument;
      if (!innerDocument) return;

      const copy = [...innerDocument.querySelectorAll('p')].find((paragraph) =>
        paragraph.textContent?.includes('Experience the perfect fusion') || paragraph.textContent?.trim() === 'AKT!V'
      );
      if (!copy) return;

      copy.textContent = replacement.text;
      copy.dataset.radarComponent = replacement.componentKey;
      copy.classList.toggle('radar-aktiv-3d', Boolean(replacement.text));
      const frameContainer = copy.closest('.framer-50j9t5-container');
      frameContainer?.classList.add('radar-aktiv-frame-container');
      const existingImage = frameContainer?.querySelector('img');
      const isVideo = replacement.mediaType === 'video' || /\.(webm|mp4)(?:$|\?)/i.test(replacement.imageUrl);
      if (isVideo && existingImage) {
        const video = document.createElement('video');
        video.src = replacement.imageUrl;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.setAttribute('aria-hidden', 'true');
        video.className = 'radar-aktiv-video';
        video.style.transform = 'none';
        existingImage.replaceWith(video);
        video.parentElement?.classList.add('radar-aktiv-image-frame');
        void video.play().catch(() => undefined);
      } else if (!isVideo && existingImage) {
        existingImage.src = replacement.imageUrl;
        existingImage.removeAttribute('srcset');
        existingImage.removeAttribute('sizes');
        existingImage.classList.add('radar-aktiv-image');
        existingImage.parentElement?.classList.add('radar-aktiv-image-frame');
        existingImage.style.transform = 'none';
      }
    };

    const styleId = 'radar-native-component-replacement-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = [
        '@keyframes radarAktivDepth {',
        '  0%, 100% { transform: perspective(720px) rotateX(0deg) rotateY(0deg) translateZ(0); }',
        '  50% { transform: perspective(720px) rotateX(4deg) rotateY(-3deg) translateZ(16px); }',
        '}',
        '.radar-aktiv-3d { display: inline-block !important; transform-style: preserve-3d; will-change: transform; text-shadow: 0 1px 0 rgba(255,255,255,.55), 0 2px 0 rgba(255,255,255,.25), 0 4px 0 rgba(0,0,0,.18), 0 8px 18px rgba(0,0,0,.35) !important; animation: radarAktivDepth 4.8s ease-in-out infinite; }',
        '.radar-aktiv-frame-container { width: 100% !important; height: auto !important; min-height: 0 !important; aspect-ratio: 16 / 9 !important; }',
        '.radar-aktiv-frame-container > *, .radar-aktiv-frame-container > * > *, .radar-aktiv-frame-container > * > * > * { height: 100% !important; min-height: 0 !important; }',
        '.radar-aktiv-image-frame { position: relative !important; width: 100% !important; height: 100% !important; display: flex !important; align-items: center !important; justify-content: center !important; overflow: hidden !important; }',
        '.radar-aktiv-image, .radar-aktiv-video { position: relative !important; inset: auto !important; display: block !important; width: 100% !important; height: 100% !important; max-width: none !important; max-height: none !important; object-fit: cover !important; object-position: 50% 50% !important; transform: none !important; }',
        '.framer-hz7xvy { position: relative !important; top: -14px !important; }',
        '@media (prefers-reduced-motion: reduce) { .radar-aktiv-3d { animation: none !important; } .radar-aktiv-video { display: none !important; } }',
      ].join('\\n');
      document.head.appendChild(style);
    }
    applyReplacement();
    if (frame.contentDocument?.body && 'MutationObserver' in window) {
      const observer = new MutationObserver(applyReplacement);
      observer.observe(frame.contentDocument.body, { subtree: true, childList: true, characterData: true });
      window.setTimeout(() => observer.disconnect(), 12000);
    }

    const root = document.documentElement;
    const body = document.body;
    const height = Math.max(root.scrollHeight, root.offsetHeight, root.clientHeight, body ? body.scrollHeight : 0, body ? body.offsetHeight : 0, body ? body.clientHeight : 0);
    if (height > 0) frame.style.height = Math.ceil(height) + 'px';
  };

  const sync = () => document.querySelectorAll(selector).forEach(measure);
  const start = () => {
    sync();
    document.querySelectorAll(selector).forEach((frame) => {
      frame.addEventListener('error', () => {
        const error = frame.parentElement?.querySelector('[data-radar-framer-error]');
        if (error) error.removeAttribute('hidden');
      }, { once: true });
      try {
        const innerDocument = frame.contentDocument;
        if (innerDocument?.body && 'ResizeObserver' in window) new ResizeObserver(() => measure(frame)).observe(innerDocument.body);
      } catch {
        const error = frame.parentElement?.querySelector('[data-radar-framer-error]');
        if (error) error.removeAttribute('hidden');
      }
    });
    let remaining = 40;
    const settle = () => { sync(); remaining -= 1; if (remaining > 0) window.setTimeout(settle, 250); };
    window.setTimeout(settle, 0);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();`;
}

export function FramerMainView({ replacement }: { replacement: NativeComponentReplacement }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: buildFramerHeightBridge(replacement) }} />
      <div className="radar-framer-frame-shell">
        <iframe
          data-radar-framer="true"
          title="RADARCharts Framer homepage"
          src="/framer-site/aktiv-section-v4.html?v=aktiv-section-8"
          loading="eager"
          allow="autoplay"
          scrolling="no"
          className="block min-h-screen w-full overflow-hidden border-0 bg-transparent"
        />
        <div data-radar-framer-error hidden className="radar-framer-error" role="status">
          <strong>RADARCharts is still loading.</strong>
          <span>Refresh the page if the homepage does not appear.</span>
          <Link href="/">Refresh homepage</Link>
        </div>
      </div>
    </>
  );
}
