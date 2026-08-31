import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  CalendarCheck,
  Plus,
  Check,
  Clock,
  Target,
  AlertCircle,
  CalendarRange,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { MOCK_KNOWLEDGE } from '@/data/knowledge';
import {
  useStudyPlan,
  useExamDate,
  type IStudyPlanTask,
} from '@/hooks/use-storage';
import { formatDate, DIRECTION_LABELS, DIRECTION_COLORS } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function StudyPlanPage() {
  const { plan, savePlan, toggleTask } = useStudyPlan();
  const { examDate, setExamDate } = useExamDate();
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // 表单状态
  const [formStartDate, setFormStartDate] = useState(formatDate(new Date()));
  const [formExamDate, setFormExamDate] = useState(examDate || '');
  const [formDailyMinutes, setFormDailyMinutes] = useState(60);

  useEffect(() => {
    if (!formExamDate && examDate) {
      setFormExamDate(examDate);
    }
  }, [examDate, formExamDate]);

  // 默认比赛日期（90天后）
  const defaultExamDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return formatDate(d);
  }, []);

  const effectiveExamDate = examDate || defaultExamDate;

  // 生成学习计划
  const generatePlan = () => {
    const start = new Date(formStartDate);
    const end = new Date(formExamDate || effectiveExamDate);

    if (end <= start) {
      toast.error('比赛日期需晚于开始日期');
      return;
    }

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const leafNodes = MOCK_KNOWLEDGE.filter((k) => k.keyPoints.length > 0);

    // 为每个知识点分配任务，按天均匀分布
    const tasksPerDay = Math.max(1, Math.ceil(leafNodes.length / totalDays));
    const tasks: IStudyPlanTask[] = [];

    let dayIndex = 0;
    let taskIndex = 0;

    for (let i = 0; i < leafNodes.length; i++) {
      const node = leafNodes[i];
      const taskDate = new Date(start);
      taskDate.setDate(taskDate.getDate() + dayIndex);

      tasks.push({
        id: `task-${node.id}`,
        knowledgeId: node.id,
        knowledgeName: node.name,
        date: formatDate(taskDate),
        duration: Math.ceil(formDailyMinutes / tasksPerDay),
        completed: false,
      });

      taskIndex++;
      if (taskIndex >= tasksPerDay) {
        taskIndex = 0;
        dayIndex++;
      }
    }

    const newPlan = {
      startDate: formStartDate,
      examDate: formExamDate || effectiveExamDate,
      dailyMinutes: formDailyMinutes,
      tasks,
      createdAt: new Date().toISOString(),
    };

    savePlan(newPlan);
    if (formExamDate) {
      setExamDate(formExamDate);
    }
    setShowPlanDialog(false);
    toast.success('学习计划已生成');
  };

  // 按日期分组任务
  const tasksByDate = useMemo(() => {
    if (!plan) return {};
    const map: Record<string, IStudyPlanTask[]> = {};
    plan.tasks.forEach((t) => {
      if (!map[t.date]) map[t.date] = [];
      map[t.date].push(t);
    });
    return map;
  }, [plan]);

  // 日期列表（排序）
  const sortedDates = useMemo(() => {
    return Object.keys(tasksByDate).sort();
  }, [tasksByDate]);

  // 今日所在索引
  const todayStr = formatDate(new Date());
  const todayIndex = sortedDates.findIndex((d) => d === todayStr);

  // 当前周日期
  const currentWeekDates = useMemo(() => {
    if (sortedDates.length === 0) return [];
    const idx = todayIndex >= 0 ? todayIndex : 0;
    const start = Math.max(0, idx - 2);
    return sortedDates.slice(start, start + 7);
  }, [sortedDates, todayIndex]);

  // 计划进度
  const planProgress = useMemo(() => {
    if (!plan || plan.tasks.length === 0) return 0;
    const completed = plan.tasks.filter((t) => t.completed).length;
    return Math.round((completed / plan.tasks.length) * 100);
  }, [plan]);

  // 重新生成确认
  const handleRegenerate = () => {
    setFormStartDate(plan?.startDate ?? formatDate(new Date()));
    setFormExamDate(plan?.examDate ?? effectiveExamDate);
    setFormDailyMinutes(plan?.dailyMinutes ?? 60);
    setShowResetDialog(true);
  };

  const confirmReset = () => {
    setShowResetDialog(false);
    setShowPlanDialog(true);
  };

  if (!plan) {
    return (
      <div className="space-y-3">

        <Card className="max-w-lg mx-auto border-cyan-500/10 bg-gradient-to-br from-cyan-500/5 via-card to-transparent relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <CardContent className="py-12 text-center relative">
            <CalendarCheck className="size-16 mx-auto text-cyan-400/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              还没有学习计划
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              设置你的备考周期和每日学习时长，系统将自动为你分配知识点学习任务
            </p>
            <Button onClick={() => setShowPlanDialog(true)} className="shadow-[0_0_20px_rgba(0_229_255_0.3)]">
              <Plus className="size-4 mr-2" />
              生成学习计划
            </Button>
          </CardContent>
        </Card>

        {/* 生成计划 Dialog */}
        <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
          <DialogContent className="border-cyan-500/20 bg-card/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="font-tech">生成学习计划</DialogTitle>
              <DialogDescription>
                设置备考周期，系统将自动分配知识点学习任务
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="start-date">开始日期</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam-date-plan">比赛日期</Label>
                <Input
                  id="exam-date-plan"
                  type="date"
                  value={formExamDate || effectiveExamDate}
                  onChange={(e) => setFormExamDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="daily-minutes">每日学习时长（分钟）</Label>
                <Input
                  id="daily-minutes"
                  type="number"
                  min={15}
                  max={480}
                  value={formDailyMinutes}
                  onChange={(e) =>
                    setFormDailyMinutes(Number(e.target.value))
                  }
                />
              </div>
              <div className="rounded-lg bg-muted/50 border border-border/50 p-3 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>知识点总数：</span>
                  <span className="font-medium text-foreground font-mono-data">
                    {MOCK_KNOWLEDGE.filter((k) => k.keyPoints.length > 0).length} 个
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPlanDialog(false)}>
                取消
              </Button>
              <Button onClick={generatePlan}>生成计划</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 进度总览 + 操作 */}
      <Card className="border-cyan-500/10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-20 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <CardContent className="pt-4 relative">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Target className="size-4 text-cyan-400 shrink-0" />
              <span className="text-sm font-medium text-foreground">
                整体进度
              </span>
              <span className="text-[10px] font-mono-data text-muted-foreground/60 ml-auto shrink-0">
                {planProgress}%
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              className="h-7 text-xs border-purple-500/30 text-purple-400 hover:bg-purple-500/10 shrink-0"
            >
              <RefreshCw className="size-3 mr-1" />
              重生成
            </Button>
          </div>
          <div className="relative h-3 rounded-full bg-muted/40 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full flow-gradient"
              style={{ width: `${planProgress}%` }}
            />
          </div>
           <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/30">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground tabular-nums font-mono-data">
                {plan.tasks.length}
              </div>
              <div className="text-xs text-muted-foreground">总任务数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400 tabular-nums font-mono-data">
                {plan.tasks.filter((t) => t.completed).length}
              </div>
              <div className="text-xs text-muted-foreground">已完成</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400 tabular-nums font-mono-data">
                {plan.tasks.filter((t) => !t.completed).length}
              </div>
              <div className="text-xs text-muted-foreground">待完成</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 视图切换 */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'day' | 'week')}>
        <TabsList className="bg-muted/30">
          <TabsTrigger value="day" className="flex items-center gap-2 data-[state=active]:shadow-[0_0_12px_rgba(0_229_255_0.3)]">
            <CalendarCheck className="size-4" />
            日视图
          </TabsTrigger>
          <TabsTrigger value="week" className="flex items-center gap-2 data-[state=active]:shadow-[0_0_12px_rgba(0_229_255_0.3)]">
            <CalendarRange className="size-4" />
            周视图
          </TabsTrigger>
        </TabsList>

        <TabsContent value="day" className="mt-4">
          {/* 日期导航 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 cyber-scroll">
            {sortedDates
              .slice(Math.max(0, todayIndex - 3), todayIndex + 10)
              .map((date) => {
                const tasks = tasksByDate[date] || [];
                const completed = tasks.filter((t) => t.completed).length;
                const isToday = date === todayStr;
                return (
                  <Badge
                    key={date}
                    variant={isToday ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer whitespace-nowrap transition-all',
                      isToday
                        ? 'shadow-[0_0_12px_rgba(0_229_255_0.4)]'
                        : 'border-border/50 hover:border-cyan-500/40 hover:text-cyan-400'
                    )}
                  >
                    {date} · {completed}/{tasks.length}
                  </Badge>
                );
              })}
          </div>

          {/* 今日任务 */}
          <Card className="border-purple-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="size-5 text-purple-400" />
                {todayStr} 任务
                <Badge variant="outline" className="ml-auto border-purple-500/30 text-purple-400">
                  {(tasksByDate[todayStr] || []).filter((t) => t.completed).length}/
                  {(tasksByDate[todayStr] || []).length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(tasksByDate[todayStr] || []).length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="size-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">今日无学习任务</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {(tasksByDate[todayStr] || []).map((task, i) => {
                    const node = MOCK_KNOWLEDGE.find(
                      (k) => k.id === task.knowledgeId
                    );
                    const colors = node
                      ? DIRECTION_COLORS[node.direction]
                      : DIRECTION_COLORS.datacom;
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors group"
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          className="mt-0.5 size-4 accent-cyan-500 shrink-0 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={cn(
                                'text-sm font-medium',
                                task.completed &&
                                  'line-through text-muted-foreground'
                              )}
                            >
                              {task.knowledgeName}
                            </span>
                            <Badge
                              className={cn(
                                'text-[10px] h-5 px-1.5 border-transparent',
                                colors.bg,
                                colors.text
                              )}
                            >
                              {node && DIRECTION_LABELS[node.direction]}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 font-mono-data">
                            EST. {task.duration} min
                          </p>
                        </div>
                        {task.completed && (
                          <Check className="size-4 text-emerald-400 shrink-0" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="mt-3">
           <div className="grid grid-cols-1 gap-3">
            {currentWeekDates.map((date) => {
              const tasks = tasksByDate[date] || [];
              const completed = tasks.filter((t) => t.completed).length;
              const isToday = date === todayStr;
              const pct =
                tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
              return (
                <Card
                  key={date}
                  className={cn(
                    'transition-all',
                    isToday &&
                      'border-cyan-500/50 ring-1 ring-cyan-500/20 shadow-[0_0_20px_rgba(0_229_255_0.1)]'
                  )}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between font-mono-data">
                      <span>{date}</span>
                      {isToday && (
                        <Badge className="text-[10px] h-5 px-1.5 bg-cyan-500/20 text-cyan-400 border-transparent">
                          <Sparkles className="size-3 mr-1" />
                          今天
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">完成</span>
                      <span className="font-medium tabular-nums text-foreground">
                        {completed}/{tasks.length}
                      </span>
                    </div>
                    <div className="relative h-1.5 mb-3 rounded-full bg-muted/50 overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      {tasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span
                            className={cn(
                              'size-1.5 rounded-full shrink-0',
                              task.completed
                                ? 'bg-emerald-400'
                                : 'bg-muted-foreground/30'
                            )}
                          />
                          <span
                            className={cn(
                              'truncate flex-1',
                              task.completed &&
                                'line-through text-muted-foreground'
                            )}
                          >
                            {task.knowledgeName}
                          </span>
                        </div>
                      ))}
                      {tasks.length > 3 && (
                        <div className="text-xs text-muted-foreground pl-3.5">
                          还有 {tasks.length - 3} 项任务
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* 生成计划 Dialog */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent className="border-cyan-500/20 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-tech">重新生成计划</DialogTitle>
            <DialogDescription>
              重新生成计划将覆盖现有进度，请谨慎操作
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="start-date-2">开始日期</Label>
              <Input
                id="start-date-2"
                type="date"
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam-date-2">比赛日期</Label>
              <Input
                id="exam-date-2"
                type="date"
                value={formExamDate}
                onChange={(e) => setFormExamDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="daily-minutes-2">每日学习时长（分钟）</Label>
              <Input
                id="daily-minutes-2"
                type="number"
                min={15}
                max={480}
                value={formDailyMinutes}
                onChange={(e) => setFormDailyMinutes(Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlanDialog(false)}>
              取消
            </Button>
            <Button onClick={generatePlan}>重新生成</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 重置确认 Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="border-rose-500/20 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-tech">确认重新生成？</DialogTitle>
            <DialogDescription>
              重新生成计划将清除所有已有的任务完成进度，此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmReset}>
              继续重新生成
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
