import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import App from "./app";
import "./index.css";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050914] p-6">
      <div className="max-w-md w-full glass-card rounded-xl p-6 text-center">
        <h2 className="text-lg font-bold text-rose-400 mb-2 font-tech">系统异常</h2>
        <p className="text-sm text-muted-foreground mb-4 font-mono-data break-all">
          {errorMessage}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors"
        >
          重新加载
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
);
