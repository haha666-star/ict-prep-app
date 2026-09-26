// 本地存储封装：替换 app_builder 环境中的 scopedStorage
// 统一添加 key 前缀，避免与其他应用冲突
// 支持多用户档案：业务数据按当前激活用户隔离（u_<uid>_ 前缀），用户档案自身 key 全局共享

export const STORAGE_PREFIX = '__app_huawei_ict_';

// 全局（不随用户切换）的 key
export const USER_PROFILES_KEY = 'user_profiles';
export const ACTIVE_USER_KEY = 'active_user';

export function getActiveUserId(): string {
  try {
    return localStorage.getItem(STORAGE_PREFIX + ACTIVE_USER_KEY) || 'default';
  } catch {
    return 'default';
  }
}

function scopedKey(key: string): string {
  if (key === USER_PROFILES_KEY || key === ACTIVE_USER_KEY) {
    return STORAGE_PREFIX + key;
  }
  return `${STORAGE_PREFIX}u_${getActiveUserId()}_${key}`;
}

// 旧版数据（无用户前缀，单用户时代）迁移到 default 用户命名空间
function migrateLegacyData() {
  try {
    if (localStorage.getItem(STORAGE_PREFIX + 'migrated_v1')) return;
    const legacy: Array<[string, string]> = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (
        k &&
        k.startsWith(STORAGE_PREFIX) &&
        !k.includes('u_') &&
        k !== STORAGE_PREFIX + 'migrated_v1'
      ) {
        const v = localStorage.getItem(k);
        if (v !== null) legacy.push([k.slice(STORAGE_PREFIX.length), v]);
      }
    }
    legacy.forEach(([bare, v]) => {
      localStorage.setItem(`${STORAGE_PREFIX}u_default_${bare}`, v);
    });
    localStorage.setItem(STORAGE_PREFIX + 'migrated_v1', '1');
  } catch {
    // 迁移失败不阻塞：后续新写入走新命名空间
  }
}
migrateLegacyData();

export const scopedStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(scopedKey(key));
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(scopedKey(key), value);
    } catch {
      // 存储已满或不可用时静默失败
    }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(scopedKey(key));
    } catch {
      // 静默失败
    }
  },
};
