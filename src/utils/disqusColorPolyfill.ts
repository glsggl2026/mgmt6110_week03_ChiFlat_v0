/**
 * Polyfill for window.getComputedStyle to handle modern CSS color spaces (oklch, lab, lch)
 * which Disqus's legacy parseColor regex cannot parse ("parseColor received unparseable color: oklch(...)").
 */
export function initDisqusColorPolyfill() {
  if (typeof window === 'undefined') return;

  const win = window as any;
  if (win.__disqus_color_polyfilled__) return;
  win.__disqus_color_polyfilled__ = true;

  let canvasCtx: CanvasRenderingContext2D | null = null;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    canvasCtx = canvas.getContext('2d');
  } catch {
    // canvas not available
  }

  function sanitizeColor(val: any): any {
    if (typeof val !== 'string') return val;
    if (
      !val.includes('oklch') &&
      !val.includes('lab') &&
      !val.includes('lch') &&
      !val.includes('color(')
    ) {
      return val;
    }

    if (canvasCtx) {
      try {
        canvasCtx.fillStyle = '#000000';
        canvasCtx.fillStyle = val;
        const resolved = canvasCtx.fillStyle;
        if (resolved && !resolved.includes('oklch')) {
          return resolved;
        }
      } catch {
        // canvas fillStyle failed
      }
    }

    // Safe fallback hex
    return '#1f2937';
  }

  const origGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = function (elt: Element, pseudoElt?: string | null): CSSStyleDeclaration {
    const origStyle = origGetComputedStyle.call(window, elt, pseudoElt);
    return new Proxy(origStyle, {
      get(target, prop, receiver) {
        if (prop === 'getPropertyValue') {
          return function (propertyName: string) {
            const val = target.getPropertyValue(propertyName);
            return sanitizeColor(val);
          };
        }
        const val = Reflect.get(target, prop, receiver);
        if (typeof val === 'string') {
          return sanitizeColor(val);
        }
        if (typeof val === 'function') {
          return val.bind(target);
        }
        return val;
      },
    });
  };

  // Catch benign cross-origin errors originating from third-party scripts like Disqus
  window.addEventListener(
    'error',
    (event) => {
      const msg = typeof event.message === 'string' ? event.message : '';
      const src = typeof event.filename === 'string' ? event.filename : '';
      if (msg === 'Script error.' || src.includes('disqus') || msg.includes('parseColor')) {
        event.preventDefault?.();
        event.stopPropagation?.();
      }
    },
    true
  );
}
