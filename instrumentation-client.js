// instrumentation-client.js
'use client'

// Prefer first-party proxy to bypass blockers; fallback to env host or PostHog cloud
const defaultApiHost = '/ph';
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || defaultApiHost;

// Defer loading analytics until idle and only when key present
if (typeof window !== 'undefined') {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (key) {
    const init = () => {
      import('posthog-js')
        .then(({ default: posthog }) => {
          try {
            posthog.init(key, {
              api_host: apiHost,
              capture_pageview: true,
              capture_pageleave: true,
              session_recording: { enabled: false },
            });
          } catch {}
        })
        .catch(() => {});
    };
    if ('requestIdleCallback' in window) {
      // @ts-ignore
      window.requestIdleCallback(init);
    } else {
      setTimeout(init, 0);
    }
  }
}
            