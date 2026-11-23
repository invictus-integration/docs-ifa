/**
 * Netlify Edge Function — MCP (Model Context Protocol) server
 *
 * Exposes the documentation's Azure AI Search index to MCP-compatible
 * agents (e.g. Copilot, Claude, custom bots) as a single read-only tool:
 * `search_documentation`.
 *
 * This is intentionally isolated from ask-ai.js and the rest of the site:
 *   - Separate route (/api/mcp), separate file, separate env var usage.
 *   - Read-only: it only queries the search index, never writes to it.
 *   - Stateless: safe for many agents/requests concurrently, same as any
 *     other Netlify Edge Function.
 *
 * Protocol notes (JSON-RPC 2.0 over a single POST endpoint):
 *   - "initialize"   -> capabilities handshake
 *   - "tools/list"   -> describes available tools
 *   - "tools/call"   -> invokes a tool and returns its result
 *
 * Step 2: `tools/call` now queries the real Azure AI Search index, reusing
 * the same env vars as ask-ai.js (AZURE_SEARCH_ENDPOINT / _INDEX /
 * _ADMIN_KEY) — no new secrets to configure.
 */

const SERVER_INFO = { name: 'invictus-docs-mcp', version: '0.1.0' };

const TOOLS = [
  {
    name: 'search_documentation',
    description:
      'Search the Invictus for Azure documentation and return the most relevant excerpts.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The search query, e.g. a question or keywords.' },
      },
      required: ['query'],
    },
  },
];

function jsonRpcResult(id, result) {
  return { jsonrpc: '2.0', id, result };
}

function jsonRpcError(id, code, message) {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

/**
 * Query Azure AI Search and return plain-text-formatted results, ready to
 * hand back to an MCP client as tool output.
 */
async function searchDocumentation(query) {
  const endpoint = Deno.env.get('AZURE_SEARCH_ENDPOINT');
  const index    = Deno.env.get('AZURE_SEARCH_INDEX');
  const adminKey = Deno.env.get('AZURE_SEARCH_ADMIN_KEY');

  if (!endpoint || !index || !adminKey) {
    throw new Error('Azure AI Search is not configured on this server');
  }

  const params = new URLSearchParams({
    'api-version': '2024-07-01',
    search: query,
    searchFields: 'title,content',
    highlight: 'content',
    highlightPreTag: '',
    highlightPostTag: '',
    // Azure AI Search's REST API uses OData-style names for paging/projection.
    '$select': 'id,title,filepath,category,content,sidebar_label',
    '$top': '5',
  });

  const response = await fetch(`${endpoint}/indexes/${index}/docs?${params}`, {
    headers: { 'api-key': adminKey },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Azure AI Search request failed (${response.status}): ${body}`);
  }

  const data = await response.json();
  const hits = data.value ?? [];

  if (!hits.length) {
    return `No documentation found for: "${query}"`;
  }

  return hits
    .map((hit, i) => {
      // Prefer the highlighted snippet (already trimmed to the matching
      // passage) and fall back to a truncated excerpt of the raw content.
      const snippet = hit['@search.highlights']?.content?.[0] ?? `${(hit.content ?? '').slice(0, 400)}...`;
      return `${i + 1}. ${hit.title} (${hit.category})\n   Path: ${hit.filepath}\n   ${snippet}`;
    })
    .join('\n\n');
}

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
    return Response.json(jsonRpcError(null, -32700, 'Invalid JSON'), { status: 400 });
  }

  const { id, method, params } = body ?? {};

  switch (method) {
    case 'initialize':
      return Response.json(
        jsonRpcResult(id, {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: SERVER_INFO,
        })
      );

    case 'tools/list':
      return Response.json(jsonRpcResult(id, { tools: TOOLS }));

    case 'tools/call': {
      const toolName = params?.name;
      if (toolName !== 'search_documentation') {
        return Response.json(jsonRpcError(id, -32602, `Unknown tool: ${toolName}`));
      }

      const query = params?.arguments?.query ?? '';
      if (!query.trim()) {
        return Response.json(jsonRpcError(id, -32602, 'Missing required argument: query'));
      }

      try {
        const text = await searchDocumentation(query);
        return Response.json(
          jsonRpcResult(id, { content: [{ type: 'text', text }] })
        );
      } catch (e) {
        // Report the failure as tool-level content (isError) rather than a
        // transport error, per MCP convention, so the agent can see and
        // react to it instead of the whole request just failing.
        return Response.json(
          jsonRpcResult(id, {
            isError: true,
            content: [{ type: 'text', text: `Search failed: ${e.message}` }],
          })
        );
      }
    }

    default:
      return Response.json(jsonRpcError(id, -32601, `Method not found: ${method}`), {
        status: 400,
      });
  }
}

export const config = { path: '/api/mcp' };
