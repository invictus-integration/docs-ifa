/**
 * Netlify Edge Function - Feedback proxy
 *
 * Receives { feedbackType, comment, pageUrl, pageTitle } from the FeedbackWidget
 * and creates a GitHub Issue. Credentials never leave the server.
 *
 * Option A - Fine-grained PAT:
 *   GITHUB_FEEDBACK_TOKEN, GITHUB_REPO
 *
 * Option B - GitHub App (preferred, not tied to a person):
 *   GITHUB_APP_ID, GITHUB_APP_INSTALLATION_ID, GITHUB_APP_PRIVATE_KEY, GITHUB_REPO
 */

function pemToDer(pem) {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  const bin = atob(b64);
  const der = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) der[i] = bin.charCodeAt(i);
  return der;
}

function asn1Wrap(tag, content) {
  const len = content.length;
  const lenBytes = len < 0x80
    ? new Uint8Array([len])
    : len < 0x100
      ? new Uint8Array([0x81, len])
      : new Uint8Array([0x82, (len >> 8) & 0xff, len & 0xff]);
  const out = new Uint8Array(1 + lenBytes.length + len);
  out[0] = tag;
  out.set(lenBytes, 1);
  out.set(content, 1 + lenBytes.length);
  return out;
}

function pkcs1ToPkcs8(pkcs1Der) {
  const algId = new Uint8Array([
    0x30, 0x0d,
    0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01,
    0x05, 0x00,
  ]);
  const version = new Uint8Array([0x02, 0x01, 0x00]);
  const octet   = asn1Wrap(0x04, pkcs1Der);
  const inner   = new Uint8Array(version.length + algId.length + octet.length);
  inner.set(version);
  inner.set(algId, version.length);
  inner.set(octet, version.length + algId.length);
  return asn1Wrap(0x30, inner);
}

async function importPrivateKey(pem) {
  const der   = pemToDer(pem);
  const pkcs8 = pem.includes('BEGIN RSA PRIVATE KEY') ? pkcs1ToPkcs8(der) : der;
  return crypto.subtle.importKey(
    'pkcs8',
    pkcs8,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
}

function b64url(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function b64urlJson(obj) {
  return b64url(new TextEncoder().encode(JSON.stringify(obj)));
}

async function signJwt(key, payload) {
  const header = b64urlJson({ alg: 'RS256', typ: 'JWT' });
  const body   = b64urlJson(payload);
  const sig    = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5', key,
    new TextEncoder().encode(`${header}.${body}`),
  );
  return `${header}.${body}.${b64url(new Uint8Array(sig))}`;
}

async function getGitHubToken() {
  const appId          = Deno.env.get('GITHUB_APP_ID');
  const installationId = Deno.env.get('GITHUB_APP_INSTALLATION_ID');
  const rawKey         = Deno.env.get('GITHUB_APP_PRIVATE_KEY');
  const pat            = Deno.env.get('GITHUB_FEEDBACK_TOKEN');

  if (appId && installationId && rawKey) {
    const privateKeyPem = rawKey.replace(/^['\"]+|['\"]+$/g, '').trim();
    const key = await importPrivateKey(privateKeyPem);
    const now = Math.floor(Date.now() / 1000);
    const jwt = await signJwt(key, { iat: now - 60, exp: now + 600, iss: appId });

    const res = await fetch(
      `https://api.github.com/app/installations/${installationId}/access_tokens`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'invictus-docs-feedback',
        },
      },
    );
    if (!res.ok) throw new Error(`GitHub App token exchange failed: ${res.status}`);
    const { token } = await res.json();
    return `token ${token}`;
  }

  if (pat) return `token ${pat}`;

  throw new Error('not-configured:' + ['GITHUB_APP_ID','GITHUB_APP_INSTALLATION_ID','GITHUB_APP_PRIVATE_KEY','GITHUB_FEEDBACK_TOKEN'].map(k => k + '=' + (Deno.env.get(k) ? 'SET' : 'MISSING')).join(','));
}

const TYPE_MAP = {
  'helpful':     { emoji: String.fromCodePoint(0x1F44D), label: 'helpful',     title: 'Helpful'        },
  'not-helpful': { emoji: String.fromCodePoint(0x1F44E), label: 'not-helpful', title: 'Not helpful'    },
  'question':    { emoji: String.fromCodePoint(0x2753),  label: 'question',    title: 'Question'       },
  'issue':       { emoji: String.fromCodePoint(0x1F41B), label: 'bug',         title: 'Found an issue' },
  'suggestion':  { emoji: String.fromCodePoint(0x1F4A1), label: 'suggestion',  title: 'Suggestion'     },
};

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  const { feedbackType, comment, pageUrl, pageTitle } = body;

  if (!feedbackType || !pageUrl) {
    return new Response('Missing required fields: feedbackType, pageUrl', { status: 400 });
  }

  const repo = Deno.env.get('GITHUB_REPO');

  let authHeader;
  try {
    authHeader = await getGitHubToken();
  } catch (e) {
    if (e.message.startsWith('not-configured')) { return new Response(e.message, { status: 503 }); }
    return new Response(`Auth failed: ${e.message}`, { status: 502 });
  }

  if (!repo) {
    return new Response('GITHUB_REPO is not configured', { status: 503 });
  }

  const type   = TYPE_MAP[feedbackType] ?? TYPE_MAP['not-helpful'];
  const labels = ['feedback', type.label];
  if (comment?.trim()) labels.push('follow-up');

  const issueTitle = `Feedback: ${pageTitle ?? pageUrl} -- ${type.emoji} ${type.title}`;
  const issueBody  = [
    `**Page:** ${pageUrl}`,
    `**Type:** ${type.emoji} ${type.title}`,
    `**Comment:** ${comment?.trim() || '_No additional comment_'}`,
    `**Submitted:** ${new Date().toISOString()}`,
  ].join('\n');

  let response;
  try {
    response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
        'User-Agent': 'invictus-docs-feedback',
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({ title: issueTitle, body: issueBody, labels }),
    });
  } catch (e) {
    return new Response(`GitHub request failed: ${e.message}`, { status: 502 });
  }

  if (!response.ok) {
    const text = await response.text();
    return new Response(text, { status: response.status });
  }

  const { html_url: issueUrl } = await response.json();

  return new Response(JSON.stringify({ ok: true, issueUrl }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export const config = { path: '/api/feedback' };