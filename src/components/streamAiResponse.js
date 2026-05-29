/**
 * Streams an AI answer from /api/ask-ai.
 * Shared by SearchBar and Faq components.
 */
export async function streamAiResponse({ question, onChunk, onCitations, onDone, onError, signal }) {
  let res;
  try {
    res = await fetch('/api/ask-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
      signal,
    });
  } catch (e) {
    onError(e);
    return;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    onError(new Error(err?.error?.message ?? res.statusText));
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') { onDone(); return; }
        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta;
          if (delta?.content) onChunk(delta.content);
          if (delta?.context?.citations?.length) onCitations(delta.context.citations);
        } catch { /* skip malformed lines */ }
      }
    }
    onDone();
  } catch (e) {
    if (e?.name !== 'AbortError' && e?.message !== 'BodyStreamBuffer was aborted') {
      onError(e);
    } else {
      onDone();
    }
  }
}
