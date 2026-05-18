export const THAURA_BASE_URL = 'https://backend.thaura.ai/v1';
export const THAURA_MODEL = 'thaura';

export const THAURA_FORCED_CONFIG = {
  mode: 'api' as const,
  apiProtocol: 'openai' as const,
  baseUrl: THAURA_BASE_URL,
  apiProviderBaseUrl: THAURA_BASE_URL,
  model: THAURA_MODEL,
  // Sentinel so apiKey-presence checks in the app pass. The daemon reads the
  // real key from THAURA_API_KEY env — it never arrives from the client.
  apiKey: '__thaura__',
};
