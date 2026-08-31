import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Terminal,
  CalendarCheck,
  PenTool,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TAB_ITEMS = [
  { path: '/', label: '总览', icon: LayoutDashboard },
  { path: '/knowledge', label: '知识', icon: BookOpen },
  { path: '/lab-config', label: '实验', icon: Terminal },
  { path: '/study-plan', label: '计划', icon: CalendarCheck },
  { path: '/quiz', label: '刷题', icon: PenTool },
  { path: '/statistics', label: '统计', icon: BarChart3 },
];

export default function BottomTabBar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-50 border-t border-cyan-500/20 bg-background/85 backdrop-blur-2xl pb-[env(safe-area-inset-bottom)]">
      {/* 顶部发光线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="grid grid-cols-6 h-14">
        {TAB_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/' ? pathname === '/' : pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 transition-all duration-200',
                'min-h-[44px] active:scale-95',
                isActive
                  ? 'text-cyan-400'
                  : 'text-muted-foreground/60 hover:text-foreground/80'
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'size-[22px] transition-all duration-200',
                    isActive &&
                      'drop-shadow-[0_0_6px_rgba(0_229_255_0.8)] -translate-y-0.5'
                  )}
                />
                {isActive && (
                  <span className="absolute -top-1 -right-1 size-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0_229_255_0.9)] animate-pulse" />
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium tracking-wide transition-all',
                  isActive && 'font-semibold'
                )}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
