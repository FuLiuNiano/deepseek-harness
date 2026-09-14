import { describe, expect, it } from 'vitest'
import { resolveDesktopGitHubPublishConfig } from '../scripts/desktop-github-update-environment.mjs'

describe('desktop GitHub update environment', () => {
  it('uses the Actions repository when explicit values are absent', () => {
    expect(resolveDesktopGitHubPublishConfig({
      DSH_DESKTOP_UPDATE_PROVIDER: 'github',
      GITHUB_REPOSITORY: 'alice/deepseek-harness-desktop',
    })).toEqual({
      provider: 'github',
      owner: 'alice',
      repo: 'deepseek-harness-desktop',
    })
  })

  it('allows explicit values for local packaging', () => {
    expect(resolveDesktopGitHubPublishConfig({
      DSH_DESKTOP_UPDATE_PROVIDER: 'github',
      DSH_DESKTOP_GITHUB_OWNER: 'alice',
      DSH_DESKTOP_GITHUB_REPO: 'harness-desktop',
    })).toMatchObject({ owner: 'alice', repo: 'harness-desktop' })
  })

  it('keeps the provider optional for the existing generic deployment', () => {
    expect(resolveDesktopGitHubPublishConfig({})).toBeUndefined()
  })

  it('rejects incomplete or invalid GitHub settings', () => {
    expect(() => resolveDesktopGitHubPublishConfig({ DSH_DESKTOP_UPDATE_PROVIDER: 'github' }))
      .toThrow(/DSH_DESKTOP_GITHUB_OWNER/u)
    expect(() => resolveDesktopGitHubPublishConfig({
      DSH_DESKTOP_UPDATE_PROVIDER: 'github',
      DSH_DESKTOP_GITHUB_OWNER: 'bad owner',
      DSH_DESKTOP_GITHUB_REPO: 'harness',
    })).toThrow(/valid GitHub owner/u)
    expect(() => resolveDesktopGitHubPublishConfig({ DSH_DESKTOP_UPDATE_PROVIDER: 'cos' }))
      .toThrow(/must be "github"/u)
  })
})
