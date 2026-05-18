import type { ChatMessage } from '../types';
import type { ChatRunStatus, ChatRunStatusResponse } from '@open-design/contracts';
import type { StreamHandlers } from './anthropic';

export function latestUserPromptFromHistory(history: ChatMessage[]): string {
  for (let index = history.length - 1; index >= 0; index -= 1) {
    const message = history[index];
    if (message?.role === 'user') return message.content;
  }
  return '';
}

export function buildDaemonTranscript(history: ChatMessage[]): string {
  return history.map((message) => `${message.role}: ${message.content}`).join('\n\n');
}

export interface DaemonStreamHandlers extends StreamHandlers {
  onEvent?: (event: unknown) => void;
  onAgentEvent?: (event: any) => void;
  onRunId?: (runId: string) => void;
  onStatus?: (status: ChatRunStatus) => void;
  onRunCreated?: (runId: string) => void;
  onRunStatus?: (status: ChatRunStatus) => void;
  onTitle?: (title: string) => void;
}

export interface DaemonStreamOptions {
  [key: string]: unknown;
  projectId?: string | null;
  conversationId?: string | null;
  history: ChatMessage[];
  signal: AbortSignal;
  handlers: DaemonStreamHandlers;
  onRunCreated?: (runId: string) => void;
  onRunStatus?: (status: ChatRunStatus) => void;
  onRunEventId?: (lastRunEventId: string) => void;
}

export interface DaemonReattachOptions {
  [key: string]: unknown;
  runId: string;
  signal: AbortSignal;
  handlers: DaemonStreamHandlers;
  onRunStatus?: (status: ChatRunStatus) => void;
  onRunEventId?: (lastRunEventId: string) => void;
}

export async function streamViaDaemon({ handlers }: DaemonStreamOptions): Promise<void> {
  handlers.onError(new Error('Agent runs are not available in this web-only fork.'));
}

export async function reattachDaemonRun(options: DaemonReattachOptions): Promise<void> {
  options.handlers.onError(new Error('Agent runs are not available in this web-only fork.'));
}

export async function fetchChatRunStatus(_runId: string): Promise<ChatRunStatusResponse | null> {
  return null;
}

export async function submitChatRunToolResult(
  _runId: string,
  _toolUseId: string,
  _content: string,
): Promise<{ ok: boolean }> {
  return { ok: false };
}

export interface ActiveChatRunSummary {
  id: string;
  assistantMessageId?: string | null;
  status: ChatRunStatus;
}

export async function listActiveChatRuns(_projectId?: string, _conversationId?: string): Promise<ActiveChatRunSummary[]> {
  return [];
}

export async function saveArtifact(input: {
  projectId?: string | null;
  name: string;
  content: string;
  artifactManifest?: unknown;
}): Promise<{ ok: boolean; path?: string }> {
  const response = await fetch('/api/artifacts/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) return { ok: false };
  return (await response.json()) as { ok: boolean; path?: string };
}
