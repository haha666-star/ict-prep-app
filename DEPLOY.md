# v3 部署说明

目标仓库：`haha666-star/ict-prep-app`，分支 `main`
线上地址：https://haha666-star.github.io/ict-prep-app/

## 一、部署方式（二选一）

### 方式 A：git push（推荐）
```bash
git init
git remote add origin https://github.com/haha666-star/ict-prep-app.git
git add -A
git commit -m "v3: 修复图标404/PWA离线缓存/判断题过滤"
git push -f origin main
```
> 本地仓库已是全新快照（无历史），必须用 `-f` 强推覆盖。

### 方式 B：GitHub 网页端上传
1. 打开 https://github.com/haha666-star/ict-prep-app
2. `Add file → Upload files`
3. 把本包**解压后的全部文件和文件夹**拖入（保留目录结构）
4. 提交到 `main` 分支

> ⚠️ 网页端无法删除文件。旧的 `public/manifest.json` 会残留，但**已无害**（新版 `index.html` 不再引用它），可不管。
> ⚠️ 不要上传 `node_modules` 和 `dist`，本包已排除。

## 二、构建由 GitHub Actions 自动完成
`.github/workflows/deploy.yml` 会在 push 后自动 `npm ci && npm run build` 并发布到 Pages，约 1–2 分钟。

## 三、验证清单
- [ ] 仓库 **Actions** 标签出现绿色对勾
- [ ] 访问站点，手机端强刷新（PWA 缓存需清一次）
- [ ] 「添加到主屏幕」显示青色网络拓扑图标（图标 404 已修）
- [ ] 刷题页出现「仅考试题型」开关（判断题过滤已生效）
- [ ] 断网后仍能切换 Tab（SW 预缓存 23 项已修）

## 四、本版变更
| 项目 | 说明 |
|---|---|
| PWA 图标 | 新增 `public/icons/`：`icon-192/512.png`、`apple-touch-icon.png`(180)、`icon-maskable-512.png`、`icon.svg`、`splash.svg` |
| manifest | 删除手写 `public/manifest.json`，仅保留 PWA 插件生成的 `manifest.webmanifest` |
| iOS 适配 | `apple-touch-icon` 改指 PNG（iOS 不支持 SVG） |
| 判断题过滤 | QuizPage 新增「仅考试题型」开关（默认开），随机/方向练习跳过 87 道判断题，错题本不受影响 |
| 离线缓存 | 本地重建后 precache 覆盖 23 项（含路由分包与图标），修复离线切 Tab 白屏 |

## 五、技术栈
Vite 5 + React 18 + TypeScript + Tailwind + vite-plugin-pwa。
Node 版本要求 ≥ 18（`npm ci` 依赖 `package-lock.json`）。
