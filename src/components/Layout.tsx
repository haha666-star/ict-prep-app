import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import BottomTabBar from '@/components/BottomTabBar';
import SplashScreen from '@/components/SplashScreen';
import { useStudyTimer } from '@/hooks/use-study-timer';

const PAGE_TITLES: Record<string, string> = {
  '/': '备考总览',
  '/knowledge': '知识体系',
  '/lab-config': '实验速查',
  '/study-plan': '学习计划',
  '/quiz': '刷题练习',
  '/statistics': '进度统计',
};

export function Layout() {
  useStudyTimer();
  const location = useLocation();
  const pathname = location.pathname;
  const title = PAGE_TITLES[pathname] ?? 'ICT 备考';

  return (
    <div className="relative h-screen w-full bg-[#050914] cyber-grid-dense overflow-hidden">
      {/* 启动画面 */}
      <SplashScreen />
      {/* 背景光晕装饰 */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* 手机外壳容器 */}
      <div className="relative mx-auto w-full max-w-[420px] h-screen bg-background/60 backdrop-blur-sm flex flex-col overflow-hidden">
        {/* 顶部状态栏（模拟手机状态栏） */}
        <div className="sticky top-0 z-50 flex items-center justify-between h-10 px-5 bg-background/80 backdrop-blur-xl border-b border-cyan-500/10">
          <span className="text-[11px] font-mono-data text-foreground/70 font-semibold tabular-nums">
            9:41
          </span>
          <div className="flex items-center gap-1.5">
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-1.5 bg-foreground/70 rounded-sm" />
              <span className="w-0.5 h-2 bg-foreground/70 rounded-sm" />
              <span className="w-0.5 h-2.5 bg-foreground/70 rounded-sm" />
              <span className="w-0.5 h-3 bg-foreground/70 rounded-sm" />
            </div>
            {/* WiFi图标 */}
            <svg className="w-3.5 h-3.5 text-foreground/70" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 18.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM5.9 11.9a9 9 0 0 1 12.2 0l-1.4 1.4a7 7 0 0 0-9.4 0L5.9 11.9zM2.6 8.6a14 14 0 0 1 18.8 0l-1.4 1.4a12 12 0 0 0-16 0L2.6 8.6z" />
            </svg>
            {/* 电池 */}
            <div className="flex items-center">
              <div className="w-6 h-3 border border-foreground/70 rounded-[2px] relative">
                <div className="absolute inset-0.5 bg-cyan-400 rounded-[1px] w-[75%]" />
              </div>
              <div className="w-0.5 h-1.5 bg-foreground/70 rounded-r-sm" />
            </div>
          </div>
        </div>

        {/* App标题栏 */}
        <header className="sticky top-10 z-40 h-12 flex items-center px-4 bg-background/70 backdrop-blur-xl border-b border-cyan-500/10">
          <h1 className="text-sm font-semibold text-foreground font-tech tracking-wider flex items-center gap-2">
            <span className="text-cyan-400 text-glow-cyan">▌</span>
            {title}
          </h1>
          <div className="ml-auto flex items-center gap-1 text-[10px] font-mono-data text-emerald-400/80">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            ONLINE
          </div>
        </header>

        {/* 主内容区 - 独立滚动 */}
        <main className="flex-1 w-full overflow-y-auto px-2 py-2 pb-16 cyber-scroll">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* 底部Tab栏 */}
        <BottomTabBar />

        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast:
                'bg-card/90 backdrop-blur-xl border border-cyan-500/20 text-foreground shadow-lg shadow-cyan-500/10',
              title: 'text-foreground font-medium',
              description: 'text-muted-foreground',
              success: 'border-emerald-500/30 shadow-emerald-500/10',
              error: 'border-rose-500/30 shadow-rose-500/10',
              info: 'border-cyan-500/30 shadow-cyan-500/10',
              warning: 'border-amber-500/30 shadow-amber-500/10',
            },
          }}
        />
      </div>
    </div>
  );
}
