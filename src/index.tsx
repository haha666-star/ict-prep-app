import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import App from "./app";
import "./index.css";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  // 动态导入失败（Failed to fetch dynamically imported module）通常是 PWA 缓存了旧版主包、
  // 它引用的旧 hash chunk 已被新版本替换删除。此时单纯 reset 会再次加载同一不存在的 chunk 陷入死循环；
  // 必须注销 SW、清空所有缓存后强制刷新，让浏览器拉取最新版本。
  const handleReload = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const r of regs) await r.unregister();
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        for (const k of keys) await caches.delete(k);
      }
    } catch {
      // 忽略清理异常，直接刷新
    }
    // 绕过缓存强制重载
    window.location.reload();
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050914] p-6">
      <div className="max-w-md w-full glass-card rounded-xl p-6 text-center">
        <h2 className="text-lg font-bold text-rose-400 mb-2 font-tech">系统异常</h2>
        <p className="text-sm text-muted-foreground mb-4 font-mono-data break-all">
          {errorMessage}
        </p>
        <button
          onClick={handleReload}
          className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors"
        >
          重新加载（自动清缓存）
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <App />
      </ErrorBoundary>
    </HashRouter>
  </StrictMode>,
);
