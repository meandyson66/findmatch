# 寻伴 FindMatch

真实相亲平台 **附近交友** 纯前端演示（React 18 + Vite + Tailwind）。用户数据、聊天、会员等全部存于浏览器 `localStorage`，无后端。

## 在线预览

**https://meandyson66.github.io/findmatch/**

## 安卓 APK

在 [Actions → Build Android APK](https://github.com/meandyson66/findmatch/actions/workflows/android-apk.yml) 最新一次运行底部下载 **findmatch-apk** 构件。

包名：`com.meandyson.findmatch`

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

- 首页附近/推荐、筛选与城市、资料卡与默契测试
- 实名认证后发言、会员充值分级特权
- 资料：学历、工作、收入等

---

与 [countdown-clock](https://github.com/meandyson66/countdown-clock)（特码推荐等）**独立仓库**，互不影响部署。
