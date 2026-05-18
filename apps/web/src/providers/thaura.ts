import type { AppConfig, ChatMessage } from '../types';
import { effectiveMaxTokens } from '../state/maxTokens';
import { parseSseFrame } from './sse';
import type { StreamHandlers } from './anthropic';
import { THAURA_MODEL } from '../lib/thaura';

export async function streamThaura(
  cfg: AppConfig,
  system: string,
  history: ChatMessage[],
  signal: AbortSignal,
  handlers: StreamHandlers,
): Promise<void> {
  let acc = '';
  try {
    const resp = await fetch('/api/proxy/thaura/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: THAURA_MODEL,
        systemPrompt: system,
        messages: history.map((m) => ({ role: m.role, content: m.content })),
        maxTokens: effectiveMaxTokens(cfg),
      }),
      signal,
    });

    if (!resp.ok || !resp.body) {
      const text = await resp.text().catch(() => '');
      handlers.onError(new Error(`thaura proxy ${resp.status}: ${text || 'no body'}`));
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      while (true) {
        const match = buf.match(/\r?\n\r?\n/);
        if (!match || match.index === undefined) break;
        const frame = buf.slice(0, match.index);
        buf = buf.slice(match.index + match[0].length);

        const parsed = parseSseFrame(frame);
        if (!parsed || parsed.kind !== 'event') continue;

        if (parsed.event === 'delta') {
          const text = String(parsed.data.delta ?? parsed.data.text ?? '');
          if (text) {
            acc += text;
            handlers.onDelta(text);
          }
          continue;
        }
        if (parsed.event === 'error') {
          handlers.onError(new Error(String(parsed.data.message ?? 'proxy error')));
          return;
        }
        if (parsed.event === 'end') {
          handlers.onDone(acc);
          return;
        }
      }
    }

    handlers.onDone(acc);
  } catch (err) {
    if ((err as Error).name === 'AbortError') return;
    handlers.onError(err instanceof Error ? err : new Error(String(err)));
  }
}
