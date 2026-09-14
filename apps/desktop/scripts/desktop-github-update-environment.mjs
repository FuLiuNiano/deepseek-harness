/** Resolve GitHub Releases as the Desktop auto-update provider. */

const PROVIDER_ENV = 'DSH_DESKTOP_UPDATE_PROVIDER'
const OWNER_ENV = 'DSH_DESKTOP_GITHUB_OWNER'
const REPOSITORY_ENV = 'DSH_DESKTOP_GITHUB_REPO'

/**
 * Resolve the optional GitHub Releases provider configuration.
 *
 * The repository defaults to the Actions-provided GITHUB_REPOSITORY value so
 * the same workflow can be copied to a fork without editing the application.
 *
 * @param {NodeJS.ProcessEnv} env - Packaging environment.
 * @returns {{ provider: 'github', owner: string, repo: string } | undefined}
 *   GitHub provider settings, or undefined for the existing generic provider.
 */
export function resolveDesktopGitHubPublishConfig(env) {
  const provider = env[PROVIDER_ENV]?.trim() ?? ''
  if (provider === '') return undefined
  if (provider !== 'github') {
    throw new Error(`desktop update: ${PROVIDER_ENV} must be "github" when set`)
  }

  const repository = env.GITHUB_REPOSITORY?.trim() ?? ''
  const [repositoryOwner = '', repositoryName = ''] = repository.split('/', 2)
  const owner = env[OWNER_ENV]?.trim() || repositoryOwner
  const repo = env[REPOSITORY_ENV]?.trim() || repositoryName
  if (!/^[A-Za-z0-9][A-Za-z0-9-]*$/u.test(owner)) {
    throw new Error(`desktop update: ${OWNER_ENV} must be a valid GitHub owner`)
  }
  if (!/^[A-Za-z0-9_.-]+$/u.test(repo)) {
    throw new Error(`desktop update: ${REPOSITORY_ENV} must be a valid GitHub repository`)
  }
  return { provider: 'github', owner, repo }
}
