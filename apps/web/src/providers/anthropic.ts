import type { AppConfig, ChatMessage } from '../types';
import { isOpenAICompatible } from './openai-compatible';
import { streamThaura } from './thaura';

export { isOpenAICompatible } from './openai-compatible';

export interface StreamHandlers {
  onDelta: (textDelta: string) => void;
  onDone: (fullText: string) => void;
  onError: (err: Error) => void;
}

export function makeClient(_cfg: AppConfig): never {
  throw new Error('Browser LLM clients are not available in this web-only fork.');
}

export async function streamMessage(
  cfg: AppConfig,
  system: string,
  history: ChatMessage[],
  signal: AbortSignal,
  handlers: StreamHandlers,
): Promise<void> {
  return streamThaura(cfg, system, history, signal, handlers);
}
