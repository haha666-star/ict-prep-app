import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Target,
  CalendarClock,
  ChevronRight,
  Flame,
  Award,
  Zap,
  Radio,
  Cpu,
} from 'lucide-react';
import { MOCK_KNOWLEDGE } from '@/data/knowledge';
import {
  useKnowledgeStatus,
  useStudyPlan,
  useQuizRecords,
  useExamDate,
} from '@/hooks/use-storage';
import { DIRECTION_LABELS, DIRECTION_COLORS, formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { statusMap, getStatus } = useKnowledgeStatus();
  const { plan, toggleTask } = useStudyPlan();
  const { records } = useQuizRecords();
  const { examDate, setExamDate } = useExamDate();
  const [dateInput, setDateInput] = useState(examDate);
  const [dateDialogOpen, setDateDialogOpen] = useState(false);

  // 默认比赛日期（90天后）
  const defaultExamDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return formatDate(d);
  }, []);

  const effectiveExamDate = examDate || defaultExamDate;

  // 倒计时计算
  const countdown = useMemo(() => {
    const target = new Date(effectiveExamDate).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours };
  }, [effectiveExamDate]);

  // 各方向掌握度计算
  const directionProgress = useMemo(() => {
    const directions = ['datacom', 'dcn', 'security', 'wlan'] as const;
    return directions.map((dir) => {
      const nodes = MOCK_KNOWLEDGE.filter(
        (k) => k.direction === dir && k.level >= 2
      );
      const leafNodes = nodes.filter((k) => k.keyPoints.length > 0);
      const total = leafNodes.length || 1;
      const mastered = leafNodes.filter(
        (n) => getStatus(n.id) === 'mastered'
      ).length;
      const learning = leafNodes.filter(
        (n) => getStatus(n.id) === 'learning'
      ).length;
      const percent = Math.round((mastered / total) * 100);
      return { direction: dir, total, mastered, learning, percent };
    });
  }, [statusMap, getStatus]);

  // 整体掌握率
  const overallProgress = useMemo(() => {
    const allLeaf = MOCK_KNOWLEDGE.filter((k) => k.keyPoints.length > 0);
    const mastered = allLeaf.filter(
      (k) => getStatus(k.id) === 'mastered'
    ).length;
    return Math.round((mastered / allLeaf.length) * 100);
  }, [statusMap, getStatus]);

  // 今日任务
  const todayStr = formatDate(new Date());
  const todayTasks = useMemo(() => {
    if (!plan) return [];
    return plan.tasks.filter((t) => t.date === todayStr);
  }, [plan, todayStr]);

  const completedToday = todayTasks.filter((t) => t.completed).length;

  const handleSaveExamDate = () => {
    if (dateInput) {
      setExamDate(dateInput);
      setDateDialogOpen(false);
      toast.success('比赛日期已更新');
    }
  };

  const accuracy =
    records.totalCount > 0
      ? Math.round((records.correctCount / records.totalCount) * 100)
      : 0;

  return (
    <div className="space-y-4">
      {/* 顶部概览卡片 */}
      <div className="grid grid-cols-1 gap-3">
        {/* 倒计时卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="h-full relative overflow-hidden border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 via-card to-transparent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <CardHeader className="pb-2 relative">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-cyan-300">
                <Radio className="size-4 neon-pulse" />
                比赛倒计时
                <span className="ml-auto text-[10px] font-mono-data text-muted-foreground/70">
                  COUNTDOWN
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-cyan-400 tabular-nums tracking-tight font-mono-data text-glow-cyan">
                  {countdown.days}
                </span>
                <span className="text-lg font-medium text-muted-foreground">
                  天
                </span>
                <span className="text-2xl font-bold text-foreground tabular-nums ml-2 font-mono-data">
                  {countdown.hours.toString().padStart(2, '0')}
                </span>
                <span className="text-sm text-muted-foreground">h</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono-data">
                  TARGET: {effectiveExamDate}
                </span>
                <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                    >
                      设置日期
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-cyan-500/20 bg-card/95 backdrop-blur-xl">
                    <DialogHeader>
                      <DialogTitle className="font-tech">
                        设置比赛日期
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="exam-date">比赛日期</Label>
                        <Input
                          id="exam-date"
                          type="date"
                          value={dateInput}
                          onChange={(e) => setDateInput(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleSaveExamDate}>保存</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 整体掌握度 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <Card className="h-full relative overflow-hidden border-purple-500/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <CardHeader className="pb-2 relative">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="size-4 text-purple-400" />
                整体掌握度
                <span className="ml-auto text-[10px] font-mono-data text-muted-foreground/70">
                  MASTERY
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-20 h-20 -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-muted/50"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="none"
                      stroke="url(#ringGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 32}
                      strokeDashoffset={
                        2 * Math.PI * 32 * (1 - overallProgress / 100)
                      }
                      className="transition-all duration-700"
                      style={{ filter: 'drop-shadow(0 0 6px rgba(181, 123, 255, 0.6))' }}
                    />
                    <defs>
                      <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00e5ff" />
                        <stop offset="100%" stopColor="#b57bff" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-foreground tabular-nums font-mono-data">
                      {overallProgress}%
                    </span>
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    已掌握{' '}
                    <span className="text-foreground font-medium">
                      {
                        MOCK_KNOWLEDGE.filter(
                          (k) =>
                            k.keyPoints.length > 0 &&
                            statusMap[k.id] === 'mastered'
                        ).length
                      }
                    </span>{' '}
                    /{' '}
                    {MOCK_KNOWLEDGE.filter((k) => k.keyPoints.length > 0).length}{' '}
                    个知识点
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                    onClick={() => navigate('/knowledge')}
                  >
                    查看知识体系
                    <ChevronRight className="size-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 刷题概览 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="h-full relative overflow-hidden border-emerald-500/20">
            <div className="absolute bottom-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <CardHeader className="pb-2 relative">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Flame className="size-4 text-emerald-400" />
                刷题概览
                <span className="ml-auto text-[10px] font-mono-data text-muted-foreground/70">
                  QUIZ
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground tabular-nums font-mono-data">
                    {records.totalCount}
                  </div>
                  <div className="text-xs text-muted-foreground">累计题数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400 tabular-nums font-mono-data">
                    {accuracy}%
                  </div>
                  <div className="text-xs text-muted-foreground">正确率</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-400 tabular-nums font-mono-data">
                    {records.wrongIds.length}
                  </div>
                  <div className="text-xs text-muted-foreground">错题</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3 h-7 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                onClick={() => navigate('/quiz')}
              >
                开始刷题
                <ChevronRight className="size-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 各模块掌握度 */}
      <div className="grid grid-cols-1 gap-3">
        <Card className="border-cyan-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="size-4 text-cyan-400" />
              各模块掌握度
              <span className="ml-auto text-[10px] font-mono-data text-muted-foreground/60">
                MODULE MASTERY
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
              {directionProgress.map((item, i) => {
                const colors = DIRECTION_COLORS[item.direction];
                return (
                   <motion.div
                     key={item.direction}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                   >
                     <div
                       className={`cursor-pointer rounded-lg border p-3 transition-all active:scale-[0.98] ${colors.bg} border-border/50 relative overflow-hidden`}
                      onClick={() => navigate('/knowledge')}
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: item.direction === 'datacom' ? 'rgba(0,229,255,0.2)' : item.direction === 'dcn' ? 'rgba(181,123,255,0.2)' : item.direction === 'security' ? 'rgba(255,92,122,0.2)' : 'rgba(46,230,166,0.2)' }} />
                      <div className="flex items-center justify-between mb-2 relative">
                        <span className={`font-semibold ${colors.text}`}>
                          {DIRECTION_LABELS[item.direction]}
                        </span>
                        <span className={`text-sm font-bold tabular-nums ${colors.text} font-mono-data`}>
                          {item.percent}%
                        </span>
                      </div>
                      <div className="relative h-2 rounded-full bg-muted/50 overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full flow-gradient`}
                          style={{
                            width: `${item.percent}%`,
                            background:
                              item.direction === 'datacom'
                                ? 'linear-gradient(90deg, #00e5ff, #00b8d4)'
                                : item.direction === 'dcn'
                                ? 'linear-gradient(90deg, #b57bff, #7c3aed)'
                                : item.direction === 'security'
                                ? 'linear-gradient(90deg, #ff5c7a, #e11d48)'
                                : 'linear-gradient(90deg, #2ee6a6, #10b981)',
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>已掌握 {item.mastered}/{item.total}</span>
                        <span>学习中 {item.learning}</span>
                      </div>
                    </div>
                  </motion.div>
                );
               })}
            </CardContent>
          </Card>

      {/* 今日任务 */}
      <Card className="border-purple-500/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="size-5 text-purple-400" />
              今日任务
              <span className="ml-auto text-[10px] font-mono-data text-muted-foreground/60">
                TODAY
              </span>
            </CardTitle>
            <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-400">
              {completedToday}/{todayTasks.length}
            </Badge>
          </CardHeader>
          <CardContent>
            {todayTasks.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="size-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">暂无今日任务</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  onClick={() => navigate('/study-plan')}
                >
                  去制定计划
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/30 transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="mt-0.5 size-4 accent-cyan-500 shrink-0 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          task.completed
                            ? 'line-through text-muted-foreground'
                            : 'text-foreground'
                        }`}
                      >
                        {task.knowledgeName}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono-data">
                        {task.duration} min
                      </p>
                    </div>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-7 text-xs mt-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                  onClick={() => navigate('/study-plan')}
                >
                  查看全部计划
                  <ChevronRight className="size-3 ml-1" />
                </Button>
              </div>
            )}
            </CardContent>
          </Card>

        {/* 高频考点 */}
        <Card className="border-cyan-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="size-5 text-cyan-400" />
              高频考点
              <span className="ml-auto text-[10px] font-mono-data text-muted-foreground/60">
                HOT TOPICS
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                'OSPF状态转换与多区域配置',
                'STP端口属性与选举规则',
                'VLAN间通信方式对比',
                '链路聚合Eth-Trunk配置',
                'ACL与NAT综合应用',
                '防火墙安全策略配置',
                'IPSec VPN两阶段协商',
                'WLAN AP上线全流程',
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.03 }}
                  className="flex items-center gap-3 text-sm py-1.5 border-b border-border/20 last:border-0 group cursor-pointer hover:text-cyan-400 transition-colors"
                  onClick={() => navigate('/knowledge')}
                >
                  <Zap className="size-3.5 text-cyan-500/60 group-hover:text-cyan-400 shrink-0" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 常用设备 */}
        <Card className="border-purple-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="size-5 text-purple-400" />
              常用设备
              <span className="ml-auto text-[10px] font-mono-data text-muted-foreground/60">
                EQUIPMENT
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'AR2220', desc: '路由器' },
                { name: 'S5700', desc: '三层交换机' },
                { name: 'USG6000V', desc: '防火墙' },
                { name: 'AC6005', desc: '无线控制器' },
                { name: 'AP4050', desc: '无线接入点' },
                { name: 'S3700', desc: '二层交换机' },
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-card/50 hover:bg-purple-500/5 hover:border-purple-500/30 transition-all cursor-pointer group"
                  onClick={() => navigate('/lab-config')}
                >
                  <div className="size-9 rounded-md bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-purple-500/20 flex items-center justify-center text-cyan-400 group-hover:shadow-[0_0_10px_rgba(0_229_255_0.3)] transition-shadow">
                    <Cpu className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate font-mono-data">
                      {item.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
