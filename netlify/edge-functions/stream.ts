import type { Context } from "https://edge.netlify.com";

interface UIMessage {
  role: string;
  content: string | Array<{ type: string; text?: string }>;
}

interface ProjectData {
  name: string;
  files: Record<string, string>;
}

// ~6000 tokens of docs context — leaves room for system prompt + conversation + response
const DOC_CHAR_BUDGET = 24_000;

// Module-level cache: survives across requests on the same edge instance
const cache = new Map<string, ProjectData>();

async function loadProject(origin: string, projectId: string): Promise<ProjectData | null> {
  if (cache.has(projectId)) return cache.get(projectId)!;

  const res = await fetch(`${origin}/generated/${projectId}.json`);
  if (!res.ok) return null;

  const data: ProjectData = await res.json();
  cache.set(projectId, data);
  return data;
}

/** Score a doc by how many of the query keywords it contains. */
function scoreDoc(content: string, keywords: string[]): number {
  const lower = content.toLowerCase();
  return keywords.reduce((score, kw) => {
    let pos = 0, count = 0;
    while ((pos = lower.indexOf(kw, pos)) !== -1) { count++; pos++; }
    return score + count;
  }, 0);
}

const PINNED_FILES = ["preview/AGENTS.md"];

/** Pick the most relevant docs up to the char budget. Pinned files are always included first. */
function retrieveDocs(files: Record<string, string>, query: string): string[] {
  const stopWords = new Set(["what", "is", "the", "how", "to", "a", "an", "in", "of", "for", "and", "or", "do", "does", "can", "i"]);
  const keywords = query.toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  // Always include pinned files first
  const selected: string[] = [];
  let budget = DOC_CHAR_BUDGET;
  for (const key of PINNED_FILES) {
    const content = files[key];
    if (content) {
      selected.push(content);
      budget -= content.length;
    }
  }

  // Fill remaining budget with keyword-scored docs (excluding already-pinned)
  const scored = Object.entries(files)
    .filter(([path]) => !PINNED_FILES.includes(path))
    .map(([path, content]) => ({ path, content, score: scoreDoc(content, keywords) }))
    .sort((a, b) => b.score - a.score);

  for (const { content } of scored) {
    if (budget <= 0) break;
    selected.push(content.slice(0, budget));
    budget -= content.length;
  }
  return selected;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function extractText(content: UIMessage["content"] | undefined): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("");
}

function buildSystemPrompt(project: ProjectData, query: string): string {
  const relevantDocs = retrieveDocs(project.files, query);
  return [
    `You are a helpful documentation assistant for ${project.name}.`,
    "Answer questions based solely on the documentation below.",
    "Be clear and concise. Use markdown formatting.",
    "Never mention file names or paths. Respond in the user's language.",
    "",
    "=== DOCUMENTATION ===",
    "",
    ...relevantDocs,
  ].join("\n");
}

function buildMessages(systemPrompt: string, userMessages: UIMessage[]) {
  const messages: Array<{ role: string; content: string }> = [
    { role: "system", content: systemPrompt },
  ];
  for (const msg of userMessages) {
    const text = extractText(msg.content);
    if (!text) continue;
    if (msg.role === "user" || msg.role === "assistant") {
      messages.push({ role: msg.role, content: text });
    }
  }
  return messages;
}

export default async function handler(req: Request, _context: Context) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: { messages?: UIMessage[]; project?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  const { messages, project: projectId } = body;
  if (!messages?.length || !projectId) {
    return new Response(JSON.stringify({ error: "messages and project are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  const origin = new URL(req.url).origin;
  const project = await loadProject(origin, projectId);
  if (!project) {
    return new Response(JSON.stringify({ error: `Project '${projectId}' not found` }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  const githubToken = Deno.env.get("AI_GITHUB_TOKEN") ?? Deno.env.get("GITHUB_TOKEN") ?? "";
  const model = Deno.env.get("LLM_MODEL") ?? "gpt-4o-mini";

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const query = lastUserMessage ? extractText(lastUserMessage.content) : "";

  const upstreamRes = await fetch("https://models.inference.ai.azure.com/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${githubToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: buildMessages(buildSystemPrompt(project, query), messages),
      stream: true,
      stream_options: { include_usage: true },
    }),
  });

  if (!upstreamRes.ok) {
    const err = await upstreamRes.text();
    return new Response(JSON.stringify({ error: err }), {
      status: 502,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  // Transform GitHub Models SSE → AI SDK data stream format
  const messageId = crypto.randomUUID().replace(/-/g, "");
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    const reader = upstreamRes.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let promptTokens = 0;
    let completionTokens = 0;

    await writer.write(encoder.encode(`f:{"messageId":"msg_${messageId}"}\n`));

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const chunk = JSON.parse(data);
            const text: string | undefined = chunk.choices?.[0]?.delta?.content;
            if (text) {
              await writer.write(encoder.encode(`0:${JSON.stringify(text)}\n`));
            }
            if (chunk.usage) {
              promptTokens = chunk.usage.prompt_tokens ?? 0;
              completionTokens = chunk.usage.completion_tokens ?? 0;
            }
          } catch {
            // skip malformed SSE chunks
          }
        }
      }
    } catch (err) {
      await writer.write(encoder.encode(`3:${JSON.stringify(String(err))}\n`));
    }

    const usage = `{"promptTokens":${promptTokens},"completionTokens":${completionTokens}}`;
    await writer.write(encoder.encode(`e:{"finishReason":"stop","usage":${usage},"isContinued":false}\n`));
    await writer.write(encoder.encode(`d:{"finishReason":"stop","usage":${usage}}\n`));
    await writer.close();
  })();

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "x-vercel-ai-data-stream": "v1",
      "Cache-Control": "no-cache",
      ...corsHeaders(),
    },
  });
}
