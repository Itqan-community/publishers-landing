type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  requestIdleCallback?: (cb: () => void) => number;
};

let initialized = false;
let enabled = false;
let bootstrapped = false;
const pending: Array<() => void> = [];

export interface GaConfig {
  measurementId: string | undefined;
  isProduction: boolean;
}

function isValidMeasurementId(id: string | undefined): id is string {
  return Boolean(id && !id.startsWith('G-PLACEHOLDER'));
}

export function initGa(config: GaConfig): void {
  if (initialized) return;
  if (!config.isProduction) return;
  if (typeof window === 'undefined') return;
  if (!isValidMeasurementId(config.measurementId)) return;

  const measurementId = config.measurementId;

  initialized = true;
  enabled = true;

  const schedule = (cb: () => void) => {
    const win = window as GtagWindow;
    if (typeof win.requestIdleCallback === 'function') {
      win.requestIdleCallback(cb);
      return;
    }
    setTimeout(cb, 0);
  };

  schedule(() => bootstrap(measurementId));
}

function bootstrap(measurementId: string): void {
  if (typeof document === 'undefined') return;

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(tag);

  const inline = document.createElement('script');
  inline.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', { send_page_view: false });
  `;

  const nonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
  if (nonce) {
    inline.setAttribute('nonce', nonce);
  }

  document.head.appendChild(inline);

  bootstrapped = true;
  for (const call of pending) {
    call();
  }
  pending.length = 0;
}

function callGtag(...args: unknown[]): void {
  if (!enabled) return;

  const run = () => {
    const win = window as GtagWindow;
    if (typeof win.gtag === 'function') {
      win.gtag(...args);
      return;
    }
    (win.dataLayer = win.dataLayer || []).push(args);
  };

  if (bootstrapped) {
    run();
    return;
  }
  pending.push(run);
}

export function gaPageView(path: string, title?: string): void {
  const pageLocation =
    typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;

  callGtag('event', 'page_view', {
    page_path: path,
    page_location: pageLocation,
    page_title: title ?? (typeof document !== 'undefined' ? document.title : undefined),
  });
}

export function gaEvent(name: string, params?: Record<string, unknown>): void {
  callGtag('event', name, params);
}
