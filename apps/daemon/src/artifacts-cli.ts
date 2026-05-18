import { postCreateArtifactRequest, type CreateProjectArtifactInput } from './artifact-create.js';

export async function runArtifactsCli(): Promise<{ exitCode: number }> {
  console.error('The standalone artifacts CLI was removed from this web-only fork.');
  return { exitCode: 1 };
}

export { postCreateArtifactRequest };
export type { CreateProjectArtifactInput };
