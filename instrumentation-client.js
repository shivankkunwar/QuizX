// instrumentation-client.js
import posthog from 'posthog-js'

// Prefer first-party proxy to bypass blockers; fallback to env host or PostHog cloud
const defaultApiHost = '/ph';
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || defaultApiHost;

if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: apiHost,
        capture_pageview: true,
        capture_pageleave: true,
        // Respect strict referrer policy issues by not requiring the referrer
        // PostHog doesn't need referrer to function; keep minimal data
        session_recording: {
            enabled: false
        }
    });
}
            