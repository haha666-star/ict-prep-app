# ICT 网络备考助手

华为ICT大赛网络赛道备考工作台 - 科幻未来风格 PWA 移动端应用

## 功能特性

- **仪表盘**：比赛倒计时、整体掌握度、刷题概览、各模块掌握度、今日任务、高频考点、常用设备
- **知识体系**：数通、云网、安全、无线四大方向知识点树，核心要点、学习提示、掌握状态标记
- **学习计划**：自动生成备考计划，日视图/周视图，任务勾选完成
- **刷题练习**：按知识点刷题、随机练习、错题重做，单选/多选/判断，答案解析
- **实验速查**：设备配置命令速查，关键命令+验证命令，一键复制
- **数据统计**：学习时长趋势、四方向掌握度雷达、各方向正确率、掌握状态分布

## 技术栈

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- shadcn/ui 组件库
- Framer Motion 动画
- ECharts 图表
- React Router 7
- localStorage 本地存储
- PWA (Service Worker 离线缓存)

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 部署到 GitHub Pages

### 方法一：GitHub Actions 自动部署（推荐）

1. 在 GitHub 创建新仓库
2. 推送代码到仓库：
   ```bash
   git remote add origin https://github.com/你的用户名/仓库名.git
   git branch -M main
   git push -u origin main
   ```
3. 进入仓库 Settings → Pages
4. Source 选择 "GitHub Actions"
5. 每次推送 main 分支会自动构建并部署
6. 部署完成后访问：`https://你的用户名.github.io/仓库名/`

### 方法二：手动部署

```bash
# 构建
npm run build

# 进入构建目录
cd dist

# 初始化 git 并推送到 gh-pages 分支
git init
git add -A
git commit -m "deploy"
git branch -M gh-pages
git remote add origin https://github.com/你的用户名/仓库名.git
git push -f origin gh-pages
```

然后在 Settings → Pages 中选择 gh-pages 分支。

## 添加到手机主屏幕

本应用支持 PWA，可像原生 App 一样添加到手机主屏幕：

### Android (Chrome)
1. 用 Chrome 打开应用网址
2. 点击菜单 → "添加到主屏幕"
3. 确认添加

### iOS (Safari)
1. 用 Safari 打开应用网址
2. 点击分享按钮 → "添加到主屏幕"
3. 确认添加

添加后可离线使用，数据保存在浏览器本地。

## 数据存储

- 所有学习数据保存在浏览器 localStorage 中
- 不上传任何服务器，隐私安全
- 换机迁移：可在应用内导出/导入 JSON 备份

## 项目结构

```
src/
├── components/          # 通用组件
│   ├── ui/             # shadcn/ui 组件
│   └── Layout.tsx      # 布局组件
├── data/               # 数据文件
│   ├── knowledge.ts    # 知识点数据
│   ├── quizzes.ts      # 题库数据
│   └── lab-configs.ts  # 实验配置数据
├── hooks/              # 自定义 Hooks
│   └── use-storage.ts  # 本地存储 Hook
├── lib/                # 工具函数
├── pages/              # 页面组件
│   ├── DashboardPage/
│   ├── KnowledgePage/
│   ├── StudyPlanPage/
│   ├── QuizPage/
│   ├── LabConfigPage/
│   └── StatisticsPage/
├── app.tsx             # 应用入口
├── index.tsx           # 渲染入口
└── index.css           # 全局样式
```
