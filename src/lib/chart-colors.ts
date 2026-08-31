// ECharts 图表颜色（hex 格式，科幻霓虹风格）
// 与 tailwind-theme.css 中 chart-1..5 变量对应

export const CHART_COLORS = [
  '#00e5ff', // chart-1 - 霓虹青
  '#b57bff', // chart-2 - 霓虹紫
  '#ff5cc8', // chart-3 - 霓虹粉
  '#2ee6a6', // chart-4 - 霓虹绿
  '#ffc93f', // chart-5 - 霓虹金
];

// 四方向专用颜色（科幻霓虹）
export const DIRECTION_CHART_COLORS: Record<string, string> = {
  datacom: '#00e5ff',   // 霓虹青 - 数通
  dcn: '#b57bff',       // 霓虹紫 - DCN
  security: '#ff5c7a',  // 霓虹品红 - 安全
  wlan: '#2ee6a6',      // 霓虹绿 - WLAN
};

// 状态颜色（科幻霓虹）
export const STATUS_CHART_COLORS = {
  not_started: '#3d4f6b', // 深灰蓝 - 未学
  learning: '#ffc93f',    // 霓虹金 - 学习中
  mastered: '#2ee6a6',    // 霓虹绿 - 已掌握
};

// 图表全局背景色
export const CHART_BG = 'transparent';
export const CHART_TEXT_COLOR = '#9fb3c8';     // 坐标轴文字
export const CHART_GRID_COLOR = 'rgba(0, 229, 255, 0.08)'; // 网格线
export const CHART_TOOLTIP_BG = 'rgba(10, 18, 35, 0.92)';
export const CHART_TOOLTIP_BORDER = 'rgba(0, 229, 255, 0.3)';
