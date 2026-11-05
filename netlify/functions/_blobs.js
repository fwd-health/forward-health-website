// Shared helper for @netlify/blobs.
//
// When Netlify Functions use custom bundling (external_node_modules,
// included_files, etc.) the automatic Blobs context sometimes isn't injected
// into the Lambda runtime, and getStore("name") then throws
// MissingBlobsEnvironmentError.
//
// This helper tries auto-config first and falls back to explicit siteID +
// token credentials from env vars.
//
// Env vars needed for the fallback (set these in Netlify → Env vars):
//   NETLIFY_SITE_ID        — site ID (also auto-provided by Netlify at runtime)
//   NETLIFY_AUTH_TOKEN     — a Netlify personal access token with blobs:read,write

import { getStore as _getStore } from "@netlify/blobs";

export function getStore(name) {
  try {
    return _getStore(name);
  } catch (e) {
    // Fall through to explicit credentials
  }
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN;
  if (!siteID || !token) {
    throw new Error(
      "Netlify Blobs not configured: set NETLIFY_AUTH_TOKEN (and NETLIFY_SITE_ID if not auto-provided).",
    );
  }
  return _getStore({ name, siteID, token });
}
