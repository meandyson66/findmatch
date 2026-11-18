/** 官网 / GitHub / 下载（便于搜索：findmatch、寻伴、meandyson66） */
export const APP_LINKS = {
  repo: 'https://github.com/meandyson66/findmatch',
  releasesLatest: 'https://github.com/meandyson66/findmatch/releases/latest',
  releasesAll: 'https://github.com/meandyson66/findmatch/releases',
  pagesDemo: 'https://meandyson66.github.io/findmatch/',
  /** 在 GitHub 搜索框可试用 */
  searchHint: 'findmatch',
  searchHintAlt: 'meandyson66 findmatch',
}

export function githubDownloadTip() {
  return `在 GitHub 搜索「${APP_LINKS.searchHint}」或打开仓库 ${APP_LINKS.repo} → Releases 下载 APK。`
}