/** Resolve GitHub Releases as the Desktop auto-update provider. */

export function resolveDesktopGitHubPublishConfig(
  env: NodeJS.ProcessEnv,
): { provider: 'github'; owner: string; repo: string } | undefined
