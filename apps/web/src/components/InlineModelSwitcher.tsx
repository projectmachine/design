import type { AgentInfo, ApiProtocol, AppConfig, ExecMode } from '../types';

// Props kept for call-site compatibility; all are ignored since the provider
// is hardcoded to Thaura and switching is not available.
interface Props {
  config: AppConfig;
  agents: AgentInfo[];
  daemonLive: boolean;
  onModeChange: (mode: ExecMode) => void;
  onAgentChange: (id: string) => void;
  onAgentModelChange: (
    id: string,
    choice: { model?: string; reasoning?: string },
  ) => void;
  onApiProtocolChange: (protocol: ApiProtocol) => void;
  onApiModelChange: (model: string) => void;
  onOpenSettings: (
    section?:
      | 'execution'
      | 'media'
      | 'composio'
      | 'language'
      | 'appearance'
      | 'notifications'
      | 'pet'
      | 'about',
  ) => void;
}

export function InlineModelSwitcher(_props: Props) {
  return (
    <div className="inline-switcher">
      <div className="inline-switcher__chip" style={{ cursor: 'default' }}>
        <span className="inline-switcher__chip-text">
          <span className="inline-switcher__chip-primary">Thaura</span>
          <span className="inline-switcher__chip-sep" aria-hidden="true">·</span>
          <span className="inline-switcher__chip-model">thaura</span>
        </span>
      </div>
    </div>
  );
}
