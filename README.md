# 寻伴 FindMatch · 附近交友

[![Release](https://img.shields.io/github/v/release/meandyson66/findmatch?label=下载APK&sort=semver)](https://github.com/meandyson66/findmatch/releases/latest)
[![Pages](https://img.shields.io/badge/网页演示-GitHub%20Pages-3EB575)](https://meandyson66.github.io/findmatch/)

真实相亲 / 附近交友 **纯前端演示**（React 18 + Vite + Tailwind + 安卓 WebView）。数据存于本机 `localStorage`，无后端。

## 在 GitHub 上找到并下载

| 方式 | 说明 |
|------|------|
| **搜索** | 打开 [GitHub](https://github.com) 搜索 **`findmatch`** 或 **`meandyson66 findmatch`** / **`寻伴`** |
| **直达仓库** | https://github.com/meandyson66/findmatch |
| **下载安卓 APK** | https://github.com/meandyson66/findmatch/releases/latest →  assets 里 **`app-release.apk`** |
| **应用内** | 「我的」→ **GitHub 下载** 或 **检查更新** |

更多说明见 [DOWNLOAD.md](./DOWNLOAD.md)。

## 在线预览（无需安装）

**https://meandyson66.github.io/findmatch/**

## 安卓

- 包名：`com.meandyson.findmatch`
- 最新 APK：[Releases](https://github.com/meandyson66/findmatch/releases/latest)
- CI 构件：[Actions → Build Android APK](https://github.com/meandyson66/findmatch/actions/workflows/android-apk.yml)（`findmatch-apk`）

### 本机构建

```bash
npm install
npm run sync:android
cd android
gradle :app:assembleRelease
```

## 本地开发

```bash
npm install
npm run dev
```

| 命令 | 说明 |
|------|------|
| `npm run build:pages` | GitHub Pages（`base: /findmatch/`） |
| `npm run build:android` | 相对路径，写入安卓 assets |
| `npm run sync:android` | 构建并同步到 `android/app/src/main/assets` |

## 功能概要

- 首页焦点展示、交流广场、精选推荐、会员橱窗、红娘牵线
- 实名后发言、会员充值分级特权
- **检查更新**：安卓拉取线上 `version.json`（[Pages](https://meandyson66.github.io/findmatch/version.json)）

### 发布新版本

1. 修改 **`app-version.json`**（`versionCode` 递增，更新 `apkUrl` / 说明）
2. `npm run pages:bundle` 并 push `main`（更新 Pages 与搜索用的 `version.json`）
3. `npm run sync:android` 打 APK，发 [GitHub Release](https://github.com/meandyson66/findmatch/releases/new)

---

与 [countdown-clock](https://github.com/meandyson66/countdown-clock) 为**独立仓库**。