import { Suspense } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import BottomTabBar from '@/components/BottomTabBar';
import SplashScreen from '@/components/SplashScreen';
import { useStudyTimer } from '@/hooks/use-study-timer';
import { Settings } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/': '备考总览',
  '/knowledge': '知识体系',
  '/lab-config': '实验速查',
  '/study-plan': '学习计划',
  '/quiz': '刷题练习',
  '/exam': '限时模考',
  '/statistics': '进度统计',
  '/settings': '设置与备份',
};

export function Layout() {
  useStudyTimer();
  const location = useLocation();
  const pathname = location.pathname;
  const title = PAGE_TITLES[pathname] ?? 'ICT 备考';
  // 冻结当前路由元素快照：避免 AnimatePresence 退场动画期间
  // <Outlet /> 已切换到新页面，导致「新内容淡出+淡入」闪两次
  const outlet = useOutlet();

  return (
    <div className="relative h-screen w-full bg-[#050914] cyber-grid-dense overflow-hidden">
      {/* 启动画面 */}
      <SplashScreen />
      {/* 背景光晕装饰：改用 radial-gradient 代替 blur filter，避免整屏实时模糊重绘 */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none bg-[radial-gradient(ellipse_at_center,hsl(185_100%_55%/0.07)_0%,transparent_70%)]" />
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none bg-[radial-gradient(ellipse_at_center,hsl(270_90%_70%/0.07)_0%,transparent_70%)]" />

      {/* 手机外壳容器：用高不透明度替代 backdrop-blur，保留网格透出感且免去全屏实时模糊 */}
      <div className="relative mx-auto w-full max-w-[420px] h-screen bg-background/85 flex flex-col overflow-hidden">
        {/* App标题栏 */}
        <header className="sticky top-0 z-40 h-12 flex items-center px-4 bg-background/70 backdrop-blur-xl border-b border-cyan-500/10">
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
          {/*
            路由切换动画：用 keyed motion.div 实现「入场淡入」，不做 AnimatePresence 退场。
            实测 AnimatePresence mode="wait" + useOutlet 快照在懒加载页面下会卡死：
            路由已切换（标题/URL 更新）但内容区永久停留在旧页面。
            移除退场动画后切换即时、无闪屏，入场 0.12s 淡入保留手感。
          */}
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{ willChange: 'opacity' }}
          >
            <Suspense fallback={<PageLoading />}>{outlet}</Suspense>
          </motion.div>
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

/** 路由懒加载时的占位（不用毛玻璃，避免切换时重绘抖动） */
function PageLoading() {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 rounded-full bg-cyan-400"
            style={{ animation: `splash-pulse 1.2s ease-in-out ${i * 0.15}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
