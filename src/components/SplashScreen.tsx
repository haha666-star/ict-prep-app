import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu } from 'lucide-react';

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050914] cyber-grid-dense"
        >
          {/* 背景光晕 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] splash-pulse" />

          {/* Logo 容器 */}
          <div className="relative mb-6">
            {/* 旋转外环 */}
            <div className="absolute inset-0 w-28 h-28 -m-3 rounded-full border border-cyan-500/30 splash-spin" style={{ borderTopColor: 'hsl(185 100% 55%)', borderRightColor: 'transparent' }} />
            <div className="absolute inset-0 w-24 h-24 -m-0.5 rounded-full border border-purple-500/20 splash-spin" style={{ animationDirection: 'reverse', animationDuration: '4s', borderBottomColor: 'hsl(270 90% 70%)' }} />

            {/* 中心图标 */}
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(0_229_255_0.3)]">
              <Cpu className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_8px_rgba(0_229_255_0.8)]" />
            </div>
          </div>

          {/* 标题 */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-foreground font-tech tracking-[0.2em] text-glow-cyan">
              ICT TRAINING
            </h1>
            <p className="text-xs text-cyan-400/70 font-mono-data tracking-widest">
              // NETWORK v2.0
            </p>
          </div>

          {/* 加载点 */}
          <div className="absolute bottom-20 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 splash-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 splash-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 splash-pulse" style={{ animationDelay: '0.4s' }} />
          </div>

          {/* 底部文字 */}
          <p className="absolute bottom-8 text-[10px] text-muted-foreground/50 font-mono-data tracking-wider">
            POWERED BY NEON CORE
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
