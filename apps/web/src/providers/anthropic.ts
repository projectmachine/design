import type { AppConfig, ChatMessage } from '../types';
import { isOpenAICompatible } from './openai-compatible';

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
  _cfg: AppConfig,
  _system: string,
  _history: ChatMessage[],
  _signal: AbortSignal,
  handlers: StreamHandlers,
): Promise<void> {
  handlers.onError(new Error('AI chat generation is not available in this web-only fork.'));
}
