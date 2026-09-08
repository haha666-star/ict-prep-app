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

---

## v4 更新（2026-09-07 深夜）

### 变更内容
1. **新增 `src/data/quizzes-extra-c.ts`（25 题）**，已在 `quizzes.ts` 中通过 `...EXTRA_QUIZZES_C` 展开合入
   - `datacom-bgp4plus` 从 **0 题补到 7 题**（真考点漏题）
   - 另 10 个薄弱叶子知识点各补 1–2 题（application-layer / link-aggregation / stack / security-ha / security-utm / arp / bfd / osi-tcpip / ospfv3 / antivirus）
2. **删除 4 道重复题干**：`dc-e001`、`dc-e002`、`dc-f004`、`dcn-108`（与原题 dc-131 / dc-132 / dc-075 / dcn-009 完全重复）
3. **难度标签补齐到 100%**：30 道缺 `difficulty` 的题已按关键词启发式标注

### 部署后题库数据（源码级实测）
- 总题量 **555**（原 530）
- 题型：单选 350 / 多选 **119** / 判断 87
- 方向：datacom 266 / security 120 / dcn **95** / wlan 75
- 难度：IA 193 / IP 270 / IE 92（覆盖率 100%）
- 重复题干 **0**、重复 id **0**、悬空 knowledgeId **0**

### 验证状态
- `tsc --noEmit` 零错误
- `vite build` 成功，PWA precache **23 项**
- 本地 HTTP 冒烟测试：首页 / 6 个 chunk / 6 个图标 / sw.js / manifest 全部 200

### 部署方式（同上一版）
- `git push -f origin main`（推荐），或网页端全量覆盖上传
- 产物：`ict-prep-app-v4-dist.zip` 直接解压覆盖仓库亦可

### 部署后自检 3 条
1. Actions 绿勾
2. 「刷题」页显示总题量 **555**
3. 「仅考试题型」开关存在且默认开启

---

## v5 性能与交互修复（2026-09-08）

用户反馈：**点击 Tab 时页面闪两次、跳转很慢**。定位到 3 个叠加原因，全部修复。

### 1. 闪两次 —— `<Outlet />` 放进 `AnimatePresence` 的经典坑
React Router 的 `<Outlet />` 在路由变化瞬间就渲染**新页面**，而 `AnimatePresence mode="wait"` 还在播旧组件的退场动画。
结果：新内容先「淡出」再「淡入」，同一页面走两遍动画 = 看到闪两次。
**修复**：改用 `useOutlet()` 取得元素快照传给 `motion.div`，退场期间冻结的是旧页面内容。

### 2. 跳转慢 —— 首屏打包了 1MB ECharts
`StatisticsPage` 静态引入 `echarts-for-react`，因为路由全静态导入，打开首页就要下载 1MB 图表库。
**修复**：路由改 `React.lazy` 懒加载（首页 DashboardPage 保持即时渲染），ECharts 只在进「统计」页时才加载。

### 3. 滚动/切换卡顿 —— 全屏实时毛玻璃
容器 `backdrop-blur-sm` 覆盖整个可滚动区域，移动端每帧都要重算全屏模糊；外加两个 `blur-[120px]` 大光晕。
**修复**：
- 容器改为 `bg-background/85`（高不透明度，免去 blur，同时保留网格透出感）
- 两处光晕改用 `radial-gradient` 静态渐变，不再用 filter blur
- 底部 Tab 栏 `backdrop-blur-2xl` → `backdrop-blur-md`

附带把页面切换动画从 0.2s×2（横向位移）缩到 **0.15s×2（纵向微移）**，并加 `initial={false}` 去掉首屏多余动画。

### 构建结果对比
| 指标 | 修复前 | 修复后 |
|---|---|---|
| 入口 JS | 124.65 kB | **39.75 kB** |
| 首屏是否加载 ECharts | 是（1,046 kB） | **否**（按需） |
| 首屏 gzip 合计 | ≈799 kB | **≈452 kB** |
| PWA precache | 23 项 | **32 项**（8 个页面分包全部缓存，离线仍可用） |

### 验证
- `tsc --noEmit` 零错误
- `vite build` 成功，precache 32 项
- 本地冒烟：首页 / 4 个首屏 chunk / sw.js / manifest / 图标 全部 200
- `index.html` 中已无 echarts 引用（确认不再首屏加载）
