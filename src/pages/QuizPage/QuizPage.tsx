import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  PenTool,
  Shuffle,
  BookX,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Target,
  Filter,
  Trash2,
  BookOpen,
  Zap,
} from 'lucide-react';
import { MOCK_QUIZZES, type IQuizQuestion } from '@/data/quizzes';
import { MOCK_KNOWLEDGE } from '@/data/knowledge';
import { useQuizRecords } from '@/hooks/use-storage';
import { DIRECTION_LABELS, DIRECTION_COLORS, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { getUnlockedBatchCount, isBatchUnlocked, getNextBatchDate, getTimeUntilNextBatch, formatDateCN } from '@/lib/quiz-updater';
import { RefreshCw, Lock, Unlock, Sparkles } from 'lucide-react';

type QuizMode = 'select' | 'random' | 'wrong' | null;

export default function QuizPage() {
  const { records, recordAnswer } = useQuizRecords();
  const [mode, setMode] = useState<QuizMode>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string[]>
  >({});
  const [submittedMap, setSubmittedMap] = useState<Record<string, boolean>>({});
  const [showWrongBook, setShowWrongBook] = useState(false);
  const [selectedDirection, setSelectedDirection] = useState<string>('all');
  const [updateCheckTime, setUpdateCheckTime] = useState<number>(Date.now());

  const unlockedQuizzes = useMemo(() => MOCK_QUIZZES.filter((q) => !q.batch || isBatchUnlocked(q.batch)), [updateCheckTime]);
  const totalCount = MOCK_QUIZZES.length;
  const unlockedCount = unlockedQuizzes.length;
  const lockedCount = totalCount - unlockedCount;
  const nextBatchDate = getNextBatchDate();
  const timeUntilNext = getTimeUntilNextBatch();
  const handleCheckUpdate = () => {
    setUpdateCheckTime(Date.now());
    const n = MOCK_QUIZZES.filter((q) => !q.batch || isBatchUnlocked(q.batch)).length;
    if (n > unlockedCount) toast.success(`发现新题目！已解锁 ${n - unlockedCount} 道新题`);
    else toast.info('当前已是最新题库，下一批新题将自动解锁');
  };

  // 当前模式的题目列表
  const questions = useMemo(() => {
    if (mode === 'random') {
      return [...unlockedQuizzes].sort(() => Math.random() - 0.5);
    }
    if (mode === 'wrong') {
      return unlockedQuizzes.filter((q) => records.wrongIds.includes(q.id));
    }
    if (mode === 'select') {
      if (selectedDirection === 'all') return unlockedQuizzes;
      return unlockedQuizzes.filter((q) => q.direction === selectedDirection);
    }
    return [];
  }, [mode, records.wrongIds, selectedDirection, unlockedQuizzes]);

  const currentQuestion = questions[currentIndex];
  const isSubmitted = currentQuestion
    ? submittedMap[currentQuestion.id]
    : false;

  const isCorrect = useMemo(() => {
    if (!currentQuestion || !isSubmitted) return false;
    const selected = selectedAnswers[currentQuestion.id] || [];
    const answer = currentQuestion.answer;
    if (Array.isArray(answer)) {
      if (selected.length !== answer.length) return false;
      return answer.every((a) => selected.includes(a));
    }
    return selected[0] === answer;
  }, [currentQuestion, isSubmitted, selectedAnswers]);

  const handleSelectAnswer = (questionId: string, option: string) => {
    if (submittedMap[questionId]) return;

    setSelectedAnswers((prev) => {
      const q = MOCK_QUIZZES.find((q) => q.id === questionId);
      if (!q) return prev;

      if (q.type === 'single' || q.type === 'judge') {
        return { ...prev, [questionId]: [option] };
      }
      // 多选
      const current = prev[questionId] || [];
      if (current.includes(option)) {
        return { ...prev, [questionId]: current.filter((o) => o !== option) };
      }
      return { ...prev, [questionId]: [...current, option] };
    });
  };

  const handleSubmit = () => {
    if (!currentQuestion) return;
    const selected = selectedAnswers[currentQuestion.id] || [];
    if (selected.length === 0) {
      toast.info('请先选择答案');
      return;
    }

    setSubmittedMap((prev) => ({ ...prev, [currentQuestion.id]: true }));

    // 记录答题
    const answer = currentQuestion.answer;
    let correct = false;
    if (Array.isArray(answer)) {
      correct =
        selected.length === answer.length &&
        answer.every((a) => selected.includes(a));
    } else {
      correct = selected[0] === answer;
    }

    recordAnswer(currentQuestion.id, currentQuestion.direction, correct, formatDate(new Date()));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleStartMode = (m: QuizMode) => {
    setMode(m);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmittedMap({});
  };

  const handleBack = () => {
    setMode(null);
    setCurrentIndex(0);
  };

  // 错题集
  const wrongQuestions = useMemo(() => {
    return MOCK_QUIZZES.filter((q) => records.wrongIds.includes(q.id));
  }, [records.wrongIds]);

  // 各方向错题数
  const wrongByDirection = useMemo(() => {
    const map: Record<string, number> = {};
    wrongQuestions.forEach((q) => {
      map[q.direction] = (map[q.direction] || 0) + 1;
    });
    return map;
  }, [wrongQuestions]);

  const accuracy =
    records.totalCount > 0
      ? Math.round((records.correctCount / records.totalCount) * 100)
      : 0;

  // 模式选择页
  if (!mode) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-mono-data">
            选择练习模式
          </span>
          <Dialog open={showWrongBook} onOpenChange={setShowWrongBook}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-rose-500/30 text-rose-400 hover:bg-rose-500/10">
                <BookX className="size-3.5 mr-1" />
                错题本
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto cyber-scroll border-cyan-500/20 bg-card/95 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="font-tech flex items-center gap-2">
                  <BookX className="size-5 text-rose-400" />
                  错题本
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                {wrongQuestions.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="size-10 mx-auto text-emerald-400/30 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      暂无错题，继续保持！
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(wrongByDirection).map(([dir, count]) => {
                        const colors = DIRECTION_COLORS[dir];
                        return (
                          <Badge
                            key={dir}
                            className={colors.bg + ' ' + colors.text + ' border-transparent'}
                          >
                            {DIRECTION_LABELS[dir]}：{count} 题
                          </Badge>
                        );
                      })}
                    </div>
                    <div className="space-y-2">
                      {wrongQuestions.map((q, i) => (
                        <Card key={q.id} className="border-rose-500/10">
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                              <span className="text-sm font-medium text-muted-foreground shrink-0 font-mono-data">
                                [{i + 1}]
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs border-border/50">
                                    {q.type === 'single'
                                      ? '单选'
                                      : q.type === 'multiple'
                                      ? '多选'
                                      : '判断'}
                                  </Badge>
                                  <Badge
                                    className={
                                      DIRECTION_COLORS[q.direction].bg +
                                      ' ' +
                                      DIRECTION_COLORS[q.direction].text +
                                      ' border-transparent'
                                    }
                                  >
                                    {DIRECTION_LABELS[q.direction]}
                                  </Badge>
                                </div>
                                <p className="text-sm font-medium text-foreground mb-2">
                                  {q.question}
                                </p>
                                <div className="text-xs text-emerald-400 mb-1 font-medium">
                                  正确答案：
                                  {Array.isArray(q.answer)
                                    ? q.answer.join('、')
                                    : q.answer}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {q.explanation}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 刷题数据概览 */}
        <div className="grid grid-cols-2 gap-2">
          <Card className="border-cyan-500/10">
            <CardContent className="py-3 px-3">
              <div className="text-xl font-bold text-foreground tabular-nums font-mono-data">
                {records.totalCount}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">累计刷题</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/10">
            <CardContent className="py-3 px-3">
              <div className="text-xl font-bold text-emerald-400 tabular-nums font-mono-data text-glow-green" style={{ textShadow: '0 0 8px rgba(46,230,166,0.5)' }}>
                {accuracy}%
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">正确率</div>
            </CardContent>
          </Card>
          <Card className="border-rose-500/10">
            <CardContent className="py-3 px-3">
              <div className="text-xl font-bold text-rose-400 tabular-nums font-mono-data">
                {records.wrongIds.length}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">错题数</div>
            </CardContent>
          </Card>
          <Card className="border-purple-500/10">
            <CardContent className="py-3 px-3">
              <div className="text-xl font-bold text-purple-400 tabular-nums font-mono-data">
                {MOCK_QUIZZES.length}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">题库总数</div>
            </CardContent>
          </Card>
        </div>

        {/* 练习模式选择 */}
        <div className="grid grid-cols-1 gap-3">
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card
              className="cursor-pointer h-full hover:border-cyan-500/40 transition-all border-cyan-500/10 group relative overflow-hidden"
              onClick={() => handleStartMode('select')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <CardContent className="py-8 text-center relative">
                <div className="size-16 mx-auto rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 border border-cyan-500/20 group-hover:shadow-[0_0_20px_rgba(0_229_255_0.3)] transition-shadow">
                  <Target className="size-8 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  按知识点刷题
                </h3>
                <p className="text-sm text-muted-foreground">
                  按技术方向分类，针对性练习
                </p>
                <Button className="mt-4 w-full shadow-[0_0_16px_rgba(0_229_255_0.2)]">
                  开始练习
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card
              className="cursor-pointer h-full hover:border-purple-500/40 transition-all border-purple-500/10 group relative overflow-hidden"
              onClick={() => handleStartMode('random')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <CardContent className="py-8 text-center relative">
                <div className="size-16 mx-auto rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20 group-hover:shadow-[0_0_20px_rgba(181_123_255_0.3)] transition-shadow">
                  <Shuffle className="size-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  随机练习
                </h3>
                <p className="text-sm text-muted-foreground">
                  随机抽题，全面检测掌握程度
                </p>
                <Button variant="secondary" className="mt-4 w-full bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30">
                  开始随机
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card
              className={cn(
                'cursor-pointer h-full hover:border-rose-500/40 transition-all border-rose-500/10 group relative overflow-hidden',
                records.wrongIds.length === 0 && 'opacity-60'
              )}
              onClick={() => {
                if (records.wrongIds.length === 0) {
                  toast.info('暂无错题');
                  return;
                }
                handleStartMode('wrong');
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <CardContent className="py-8 text-center relative">
                <div className="size-16 mx-auto rounded-xl bg-rose-500/10 flex items-center justify-center mb-4 border border-rose-500/20 group-hover:shadow-[0_0_20px_rgba(255_92_122_0.3)] transition-shadow">
                  <BookX className="size-8 text-rose-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  错题重做
                </h3>
                <p className="text-sm text-muted-foreground">
                  重做错题，巩固薄弱知识点
                </p>
                <Button variant="destructive" className="mt-4 w-full">
                  重做错题
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 方向筛选（仅知识点刷题模式下显示） */}
        {mode === 'select' && (
          <Card className="border-cyan-500/10">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="size-4 text-cyan-400" />
                选择练习方向
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedDirection === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDirection('all')}
                  className={selectedDirection !== 'all' ? 'border-border/50 hover:border-cyan-500/30' : ''}
                >
                  全部方向
                </Button>
                {(['datacom', 'dcn', 'security', 'wlan'] as const).map((d) => {
                  const colors = DIRECTION_COLORS[d];
                  const count = MOCK_QUIZZES.filter((q) => q.direction === d).length;
                  return (
                    <Button
                      key={d}
                      variant={selectedDirection === d ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDirection(d)}
                      className={cn(
                        selectedDirection !== d && 'border-border/50 hover:border-cyan-500/30'
                      )}
                    >
                      {DIRECTION_LABELS[d]} ({count})
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // 答题页
  if (questions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack} className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="size-4 mr-1" />
            返回
          </Button>
        </div>
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <BookOpen className="size-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">暂无题目</p>
            <Button variant="outline" className="mt-4" onClick={handleBack}>
              返回选择其他模式
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const typeLabel =
    currentQuestion?.type === 'single'
      ? '单选题'
      : currentQuestion?.type === 'multiple'
      ? '多选题'
      : '判断题';

  return (
    <div className="space-y-2">
      {/* 顶部：返回 + 进度 */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={handleBack} className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4 mr-1" />
          返回
        </Button>
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground font-mono-data">
              PROGRESS: {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-cyan-400 font-medium">
              {mode === 'random'
                ? '随机练习'
                : mode === 'wrong'
                ? '错题重做'
                : '知识点刷题'}
            </span>
          </div>
          <div className="relative h-1.5 rounded-full bg-muted/40 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full flow-gradient transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 题目卡片 */}
      <AnimatePresence mode="wait">
        {currentQuestion && (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-cyan-500/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 flow-gradient" />
              <CardHeader className="pt-6">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                    {typeLabel}
                  </Badge>
                  <Badge
                    className={
                      DIRECTION_COLORS[currentQuestion.direction].bg +
                      ' ' +
                      DIRECTION_COLORS[currentQuestion.direction].text +
                      ' border-transparent'
                    }
                  >
                    {DIRECTION_LABELS[currentQuestion.direction]}
                  </Badge>
                  <span className="ml-auto text-[10px] font-mono-data text-muted-foreground/60">
                    Q_{String(currentIndex + 1).padStart(3, '0')}
                  </span>
                </div>
                <CardTitle className="text-base mt-3 leading-relaxed flex items-start gap-2">
                  <Zap className="size-4 text-cyan-400 shrink-0 mt-1" />
                  <span>{currentQuestion.question}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 选项 */}
                <div className="space-y-2">
                  {currentQuestion.options.map((option, i) => {
                    const selected = (
                      selectedAnswers[currentQuestion.id] || []
                    ).includes(option);
                    const answer = currentQuestion.answer;
                    const isAnswer = Array.isArray(answer)
                      ? answer.includes(option)
                      : answer === option;

                    let optionClass =
                      'border-border/50 bg-card/30 hover:border-cyan-500/40 hover:bg-cyan-500/5';
                    if (isSubmitted) {
                      if (isAnswer) {
                        optionClass = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(46_230_166_0.15)]';
                      } else if (selected && !isAnswer) {
                        optionClass = 'border-rose-500/50 bg-rose-500/10 text-rose-300 shadow-[0_0_12px_rgba(255_92_122_0.15)]';
                      } else {
                        optionClass = 'border-border/30 opacity-50';
                      }
                    } else if (selected) {
                      optionClass = 'border-cyan-500/50 bg-cyan-500/10 text-cyan-200 shadow-[0_0_12px_rgba(0_229_255_0.2)]';
                    }

                    return (
                      <div
                        key={i}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                          optionClass
                        )}
                        onClick={() =>
                          handleSelectAnswer(currentQuestion.id, option)
                        }
                      >
                        <div
                          className={cn(
                            'size-6 rounded-full border flex items-center justify-center shrink-0 text-xs font-medium font-mono-data',
                            selected
                              ? isSubmitted
                                ? isAnswer
                                  ? 'border-emerald-400 bg-emerald-500 text-white'
                                  : 'border-rose-400 bg-rose-500 text-white'
                                : 'border-cyan-400 bg-cyan-500 text-card'
                              : 'border-border/60 text-muted-foreground/60'
                          )}
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="flex-1 text-sm">{option}</span>
                        {isSubmitted && isAnswer && (
                          <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
                        )}
                        {isSubmitted && selected && !isAnswer && (
                          <XCircle className="size-5 text-rose-400 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 提交按钮 */}
                {!isSubmitted && (
                  <Button
                    className="w-full shadow-[0_0_20px_rgba(0_229_255_0.3)]"
                    onClick={handleSubmit}
                    disabled={
                      !selectedAnswers[currentQuestion.id] ||
                      selectedAnswers[currentQuestion.id].length === 0
                    }
                  >
                    提交答案
                  </Button>
                )}

                {/* 结果与解析 */}
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={cn(
                        'rounded-lg p-4 border',
                        isCorrect
                          ? 'border-emerald-500/30 bg-emerald-500/5'
                          : 'border-rose-500/30 bg-rose-500/5'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="size-5 text-emerald-400" />
                            <span className="font-semibold text-emerald-400">
                              回答正确
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="size-5 text-rose-400" />
                            <span className="font-semibold text-rose-400">
                              回答错误
                            </span>
                          </>
                        )}
                      </div>
                      <div className="text-sm text-foreground/80 mb-2">
                        <span className="text-muted-foreground">正确答案：</span>
                        <span className="font-medium font-mono-data">
                          {Array.isArray(currentQuestion.answer)
                            ? currentQuestion.answer.join('、')
                            : currentQuestion.answer}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-border/30">
                        <div className="flex items-center gap-2 mb-1">
                          <Lightbulb className="size-4 text-amber-400" />
                          <span className="text-sm font-semibold text-amber-400">
                            解析
                          </span>
                        </div>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>

                    {/* 导航按钮 */}
                    <div className="flex items-center justify-between mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                      >
                        <ChevronLeft className="size-4 mr-1" />
                        上一题
                      </Button>
                      {currentIndex < questions.length - 1 ? (
                        <Button onClick={handleNext} className="shadow-[0_0_16px_rgba(0_229_255_0.25)]">
                          下一题
                          <ChevronRight className="size-4 ml-1" />
                        </Button>
                      ) : (
                        <Badge className="text-sm px-3 py-1 bg-emerald-500/20 text-emerald-400 border-transparent">
                          <CheckCircle2 className="size-3.5 mr-1" />
                          已完成本模式
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
