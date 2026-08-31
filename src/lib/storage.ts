// 本地存储封装：替换 app_builder 环境中的 scopedStorage
// 统一添加 key 前缀，避免与其他应用冲突

const STORAGE_PREFIX = '__app_huawei_ict_';

export const scopedStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(STORAGE_PREFIX + key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, value);
    } catch {
      // 存储已满或不可用时静默失败
    }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch {
      // 静默失败
    }
  },
};
