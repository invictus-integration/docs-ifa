/**
 * Netlify Edge Function — AI search proxy
 *
 * Keeps all secrets (Azure OpenAI key, Search admin key) server-side.
 * The browser POSTs { question } and receives the same SSE stream that
 * Azure OpenAI would return, so the existing client-side parser is unchanged.
 *
 * Required environment variables (set in Netlify UI → Site settings → Env vars):
 *   AZURE_OPENAI_ENDPOINT      e.g. https://my-resource.openai.azure.com
 *   AZURE_OPENAI_DEPLOYMENT    e.g. gpt-4o
 *   AZURE_OPENAI_API_KEY
 *   AZURE_SEARCH_ENDPOINT      e.g. https://invictus-docs.search.windows.net
 *   AZURE_SEARCH_INDEX         e.g. v6-docs
 *   AZURE_SEARCH_ADMIN_KEY
 */
export default async function handler(request) {
  // Handle CORS preflight
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

  let question;
  try {
    ({ question } = await request.json());
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  if (!question?.trim()) {
    return new Response('Missing required field: question', { status: 400 });
  }

  const endpoint   = Deno.env.get('AZURE_OPENAI_ENDPOINT');
  const deployment = Deno.env.get('AZURE_OPENAI_DEPLOYMENT');
  const apiKey     = Deno.env.get('AZURE_OPENAI_API_KEY');

  if (!endpoint || !deployment || !apiKey) {
    return new Response('AI search is not configured on this server', { status: 503 });
  }

  const searchEndpoint = Deno.env.get('AZURE_SEARCH_ENDPOINT');
  const searchIndex    = Deno.env.get('AZURE_SEARCH_INDEX');
  const searchAdminKey = Deno.env.get('AZURE_SEARCH_ADMIN_KEY');

  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-01`;

  let upstream;
  try {
    upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stream: true,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant for the Invictus for Azure documentation. ' +
              'Answer questions accurately and concisely based only on the provided documentation. ' +
              'If the answer is not in the docs, say so.',
          },
          { role: 'user', content: question },
        ],
        ...(searchEndpoint && searchIndex && searchAdminKey
          ? {
              data_sources: [
                {
                  type: 'azure_search',
                  parameters: {
                    endpoint: searchEndpoint,
                    index_name: searchIndex,
                    authentication: { type: 'api_key', key: searchAdminKey },
                  },
                },
              ],
            }
          : {}),
      }),
    });
  } catch (e) {
    return new Response(`Upstream request failed: ${e.message}`, { status: 502 });
  }

  if (!upstream.ok) {
    const body = await upstream.text();
    return new Response(body, { status: upstream.status });
  }

  // Pipe the SSE stream straight back to the browser — no buffering
  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}

export const config = { path: '/api/ask-ai' };
