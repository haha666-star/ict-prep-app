// 题库自动更新服务：按批次每两天自动解锁新题目
// 现有题库（无 batch 字段）全部立即可用
// 新增题目带 batch 字段，从起始日起每两天解锁一批

export const QUIZ_UPDATE_START_DATE = '2026-08-31'; // 更新机制起始日
export const QUIZ_BATCH_INTERVAL_DAYS = 2; // 每批间隔天数
export const QUIZ_BATCH_SIZE = 50; // 每批约50题

// 计算从起始日到今天经过的天数
function daysSinceStart(): number {
  const start = new Date(QUIZ_UPDATE_START_DATE + 'T00:00:00');
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// 计算当前已解锁的最大批次号
// batch 1 在起始日后第2天解锁，batch 2 在第4天，以此类推
// 起始日当天：已解锁 batch 0（即无 batch 的基础题库）
export function getUnlockedBatchCount(): number {
  const days = daysSinceStart();
  if (days <= 0) return 0;
  return Math.floor(days / QUIZ_BATCH_INTERVAL_DAYS);
}

// 判断某个批次是否已解锁
export function isBatchUnlocked(batch: number): boolean {
  return batch <= getUnlockedBatchCount();
}

// 获取下一批解锁的日期
export function getNextBatchDate(): Date | null {
  const days = daysSinceStart();
  const currentBatch = Math.max(0, Math.floor(days / QUIZ_BATCH_INTERVAL_DAYS));
  const nextBatchDay = (currentBatch + 1) * QUIZ_BATCH_INTERVAL_DAYS;
  const start = new Date(QUIZ_UPDATE_START_DATE + 'T00:00:00');
  const nextDate = new Date(start.getTime() + nextBatchDay * 24 * 60 * 60 * 1000);
  if (nextDate <= new Date()) return null; // 没有待解锁批次
  return nextDate;
}

// 格式化日期为中文
export function formatDateCN(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}年${m}月${d}日`;
}

// 计算距离下一批解锁的剩余时间描述
export function getTimeUntilNextBatch(): string {
  const nextDate = getNextBatchDate();
  if (!nextDate) return '已全部解锁';
  const now = new Date();
  const diff = nextDate.getTime() - now.getTime();
  if (diff <= 0) return '即将解锁';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}天${hours}小时后`;
  if (hours > 0) return `${hours}小时后`;
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${minutes}分钟后`;
}
