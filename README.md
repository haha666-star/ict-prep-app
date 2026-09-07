# ICT 网络备考助手

华为 ICT 大赛实践赛·网络赛道备考工作台（PWA，移动端优先）。

线上地址：https://haha666-star.github.io/ict-prep-app/

## 本次升级内容（2026-09）

### P0 · 赛制对齐

- **限时模考引擎（新增「模考」Tab）**：省初赛 60 题/60 分钟、省复赛 150 题/120 分钟两档；全局倒计时、题卡跳题、标记待定、交卷确认、成绩报告（总分 + 各方向正确率 + 用时）。只抽单选 + 多选，与真实考制一致。
- **题库扩容与修复**：
  - 多选题从 17 题扩容（数通 / 安全 / WLAN / DCN 高频考点）
  - DCN 方向补题
  - 全库 500+ 题打上 HCIA / HCIP / HCIE 难度标签
  - 修复 4 组重复题干、12 个悬空 knowledgeId（补充对应知识点定义）
- **判断题降权**：答题页对判断题标注「省赛不考判断题」。

### P0 · 核心 Bug 修复

1. **随机练习洗牌跳题**：题目列表改为进入模式时一次性快照 + Fisher-Yates 洗牌，答题过程中不再重排。
2. **错题重做越界白屏**：列表收缩时索引自动钳制，不再越界。
3. **统计灌水**：正确率 / byDirection / dailyRecords 全部改为「首次作答」口径，重复刷题不再刷数据。
4. **错题 SRS**：答错入池，连续答对 2 次才移出错题本（`SRS_GRADUATE_STREAK`），并记录每题的错误次数统计。
5. **方向筛选死代码**：「按知识点刷题」现在会先弹出方向选择（含题量预览），原判断条件永不成立的问题已修复。

### P1 · 新功能

- **设置与备份页**：JSON 一键导出 / 导入（支持合并或覆盖两种恢复模式），团队三人数据对比、共同弱项分析。
- **真·离线 PWA**：`vite-plugin-pwa` 生成 Service Worker，全量资源预缓存，离线可用。
- **构建拆包**：ECharts / React 框架 / 题库数据独立 chunk，主入口从 2.4MB 降至 124KB（gzip 30KB），手机首屏明显加快。

## 技术栈

Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui + ECharts + framer-motion + vite-plugin-pwa

## 开发

```bash
npm install
npm run dev        # 本地开发 http://localhost:5173
npm run build      # 类型检查 + 生产构建（输出 dist/）
npm run preview    # 预览生产构建
```

## 部署

GitHub Actions 自动部署到 GitHub Pages（`.github/workflows/deploy.yml`），push 到 main 即生效。

## 数据存储

所有学习数据（答题记录 / 错题本 / 学习时长 / 模考成绩）存储在浏览器 localStorage，可随时在「设置」页导出 JSON 备份。
