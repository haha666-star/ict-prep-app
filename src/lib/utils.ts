import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 方向列表
export const DIRECTIONS = ['datacom', 'dcn', 'security', 'wlan'] as const;

// 方向名称映射
export const DIRECTION_LABELS: Record<string, string> = {
  datacom: '数通',
  dcn: 'DCN',
  security: '安全',
  wlan: 'WLAN',
};

// 方向颜色映射（科幻霓虹深色风格）
export const DIRECTION_COLORS: Record<string, { bg: string; text: string; bar: string; glow: string }> = {
  datacom: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    bar: 'bg-gradient-to-r from-cyan-500 to-cyan-400',
    glow: 'shadow-[0_0_12px_rgba(0_229_255_0.4)]',
  },
  dcn: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    bar: 'bg-gradient-to-r from-purple-500 to-purple-400',
    glow: 'shadow-[0_0_12px_rgba(181_123_255_0.4)]',
  },
  security: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    bar: 'bg-gradient-to-r from-rose-500 to-rose-400',
    glow: 'shadow-[0_0_12px_rgba(255_92_122_0.4)]',
  },
  wlan: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    bar: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
    glow: 'shadow-[0_0_12px_rgba(46_230_166_0.4)]',
  },
};

// 知识点掌握状态
export type KnowledgeStatus = 'not_started' | 'learning' | 'mastered';

export const STATUS_LABELS: Record<KnowledgeStatus, string> = {
  not_started: '未学',
  learning: '学习中',
  mastered: '已掌握',
};

export const STATUS_COLORS: Record<KnowledgeStatus, string> = {
  not_started: 'bg-muted/50 text-muted-foreground border border-border/50',
  learning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  mastered: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
};

// 格式化日期 YYYY-MM-DD
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 计算两个日期之间的天数差
export function daysBetween(from: string, to: string): number {
  const f = new Date(from).getTime();
  const t = new Date(to).getTime();
  return Math.ceil((t - f) / (1000 * 60 * 60 * 24));
}
