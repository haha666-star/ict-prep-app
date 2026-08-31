import { useEffect, useRef } from 'react';
import { scopedStorage } from '@/lib/storage';
import { formatDate } from '@/lib/utils';

const KEY_STUDY_TIME = 'study_time';
const FLUSH_INTERVAL = 60_000; // 每 60 秒写入一次

/**
 * 全局学习时长计时器：
 * - 页面可见且聚焦时累计计时
 * - 每分钟写入一次 localStorage
 * - 页面隐藏/失焦/卸载时也会刷入
 */
export function useStudyTimer() {
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0); // 本次已累计毫秒数（已写入的不算）
  const intervalRef = useRef<number | null>(null);

  const flush = () => {
    if (accumulatedRef.current < 1000) return; // 不足 1 秒不写
    const minutes = Math.floor(accumulatedRef.current / 60_000);
    if (minutes <= 0) return;

    const today = formatDate(new Date());
    const raw = scopedStorage.getItem(KEY_STUDY_TIME);
    let data: Record<string, number> = {};
    try {
      if (raw) data = JSON.parse(raw);
    } catch {
      data = {};
    }
    data[today] = (data[today] ?? 0) + minutes;
    scopedStorage.setItem(KEY_STUDY_TIME, JSON.stringify(data));

    // 减去已写入的整分钟数，保留余数
    accumulatedRef.current -= minutes * 60_000;
  };

  const startTiming = () => {
    if (intervalRef.current) return; // 已经在计时
    startTimeRef.current = Date.now();
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const delta = now - startTimeRef.current;
      startTimeRef.current = now;
      accumulatedRef.current += delta;

      // 每累计超过 1 分钟就刷一次
      if (accumulatedRef.current >= FLUSH_INTERVAL) {
        flush();
      }
    }, 10_000); // 每 10 秒检查一次
  };

  const stopTiming = () => {
    if (!intervalRef.current) return;
    const now = Date.now();
    accumulatedRef.current += now - startTimeRef.current;
    window.clearInterval(intervalRef.current);
    intervalRef.current = null;
    flush(); // 停止时刷一次
  };

  useEffect(() => {
    // 初始：页面加载就开始计时
    startTiming();

    const handleVisibility = () => {
      if (document.hidden) {
        stopTiming();
      } else {
        startTiming();
      }
    };

    const handleFocus = () => startTiming();
    const handleBlur = () => stopTiming();

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      stopTiming();
      flush();
    };
  }, []);
}
