import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  ChevronLeft,
  ChevronRight,
  Timer as TimerIcon,
  Grid3x3,
  Flag,
  CheckCircle2,
  XCircle,
  Trophy,
  AlertTriangle,
  RotateCcw,
  Zap,
  Target,
  BarChart3,
  Clock,
} from 'lucide-react';
import { MOCK_QUIZZES, type IQuizQuestion } from '@/data/quizzes';
import {
  useQuizRecords,
  useExamSessions,
  type IExamAnswerItem,
  type IExamSession,
} from '@/hooks/use-storage';
import { DIRECTION_LABELS, DIRECTION_COLORS, formatDate, cn } from '@/lib/utils';
import {
  EXAM_PRESETS,
  buildExamPaper,
  isAnswerCorrect,
  formatSec,
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
  getDifficulty,
  type IExamPreset,
} from '@/lib/exam';

type Phase = 'select' | 'running' | 'report';

interface IReport {
  preset: IExamPreset;
  questions: IQuizQuestion[];
  answers: Record<string, string[]>;
  items: IExamAnswerItem[];
  usedSec: number;
  correctCount: number;
  score: number;
  teamScore: number;
  byDirection: Record<string, { correct: number; total: number }>;
  unanswered: number;
  autoSubmitted: boolean;
}

export default function ExamPage() {
  const { recordMany } = useQuizRecords();
  const { sessions, addSession } = useExamSessions();

  const [phase, setPhase] = useState<Phase>('select');
  const [preset, setPreset] = useState<IExamPreset>(EXAM_PRESETS[0]);
  const [questions, setQuestions] = useState<IQuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [marks, setMarks] = useState<string[]>([]);
  const [remaining, setRemaining] = useState(0);
  const [report, setReport] = useState<IReport | null>(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showAllWrong, setShowAllWrong] = useState(false);

  const startedAtRef = useRef(0);
  const timeRef = useRef<Record<string, number>>({});
  const submittingRef = useRef(false);

  const current = questions[index];
  const answeredCount = Object.values(answers).filter((a) => a.length > 0).length;

  // ---------- 计时 ----------
  useEffect(() => {
    if (phase !== 'running') return;
    const tid = window.setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
      const q = questions[index];
      if (q) timeRef.current[q.id] = (timeRef.current[q.id] ?? 0) + 1;
    }, 1000);
    return () => window.clearInterval(tid);
  }, [phase, index, questions]);

  // ---------- 到时自动交卷 ----------
  useEffect(() => {
    if (phase === 'running' && remaining === 0) {
      handleSubmit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, phase]);

  const startExam = useCallback((p: IExamPreset) => {
    const paper = buildExamPaper(p);
    if (paper.length === 0) {
      toast.error('题库不足，无法组卷');
      return;
    }
    setPreset(p);
    setQuestions(paper);
    setIndex(0);
    setAnswers({});
    setMarks([]);
    setReport(null);
    setShowAllWrong(false);
    timeRef.current = {};
    submittingRef.current = false;
    startedAtRef.current = Date.now();
    setRemaining(p.minutes * 60);
    setPhase('running');
  }, []);

  const handleSubmit = useCallback(
    (auto = false) => {
      if (submittingRef.current || questions.length === 0) return;
      submittingRef.current = true;

      const usedSec = Math.min(
        preset.minutes * 60,
        Math.round((Date.now() - startedAtRef.current) / 1000)
      );

      const items: IExamAnswerItem[] = questions.map((q) => ({
        id: q.id,
        direction: q.direction,
        type: q.type,
        correct: isAnswerCorrect(q, answers[q.id] ?? []),
        seconds: timeRef.current[q.id] ?? 0,
      }));

      const correctCount = items.filter((i) => i.correct).length;
      const score = Math.round((correctCount / questions.length) * 100);
      const teamScore = Math.round((correctCount / questions.length) * 1000);

      const byDirection: Record<string, { correct: number; total: number }> = {};
      questions.forEach((q) => {
        byDirection[q.direction] ??= { correct: 0, total: 0 };
        byDirection[q.direction].total += 1;
        if (isAnswerCorrect(q, answers[q.id] ?? [])) {
          byDirection[q.direction].correct += 1;
        }
      });

      const r: IReport = {
        preset,
        questions,
        answers,
        items,
        usedSec,
        correctCount,
        score,
        teamScore,
        byDirection,
        unanswered: questions.length - answeredCount,
        autoSubmitted: auto,
      };
      setReport(r);

      // 写入答题记录（批量，避免逐题写入卡顿）
      const dateStr = formatDate(new Date());
      recordMany(
        questions.map((q) => ({
          questionId: q.id,
          direction: q.direction,
          correct: isAnswerCorrect(q, answers[q.id] ?? []),
          dateStr,
        }))
      );

      const session: IExamSession = {
        id: `exam_${startedAtRef.current}`,
        presetName: preset.name,
        startedAt: startedAtRef.current,
        totalQuestions: questions.length,
        durationSec: preset.minutes * 60,
        usedSec,
        correctCount,
        score,
        teamScore,
        byDirection,
        items,
        autoSubmitted: auto,
      };
      addSession(session);

      setPhase('report');
      setCardOpen(false);
      setConfirmOpen(false);
      toast.success(auto ? '时间到，已自动交卷' : '交卷成功');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions, answers, preset, answeredCount, recordMany, addSession]
  );

  const selectOption = (option: string) => {
    if (!current) return;
    setAnswers((prev) => {
      const cur = prev[current.id] ?? [];
      if (current.type === 'multiple') {
        return cur.includes(option)
          ? { ...prev, [current.id]: cur.filter((o) => o !== option) }
          : { ...prev, [current.id]: [...cur, option] };
      }
      return { ...prev, [current.id]: [option] };
    });
  };

  const toggleMark = () => {
    if (!current) return;
    setMarks((prev) =>
      prev.includes(current.id)
        ? prev.filter((x) => x !== current.id)
        : [...prev, current.id]
    );
  };

  // ---------------- 选择页 ----------------
  if (phase === 'select') {
    const poolSize = MOCK_QUIZZES.filter((q) => q.type !== 'judge').length;
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="size-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[12px] leading-relaxed text-amber-200/90">
              省初赛、省复赛均为<b className="text-amber-300">理论机考（单选+多选）</b>。
              本模考已自动排除判断题，并按官方题型配比抽题。当前可用考试题池{' '}
              <b className="text-amber-300 font-mono-data">{poolSize}</b> 题。
            </div>
          </div>
        </div>

        {EXAM_PRESETS.map((p) => (
          <motion.div key={p.id} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
            <Card
              className="cursor-pointer border-cyan-500/15 hover:border-cyan-500/40 transition-all group relative overflow-hidden"
              onClick={() => startExam(p)}
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <CardContent className="py-5 relative">
                <div className="flex items-start gap-3">
                  <div className="size-11 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shrink-0">
                    <TimerIcon className="size-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold">{p.name}</h3>
                      <Badge className="bg-cyan-500/15 text-cyan-400 border-transparent font-mono-data">
                        {p.sub}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {p.tip}
                    </p>
                    <div className="flex gap-1.5 mt-2.5 flex-wrap">
                      {Object.entries(p.weights).map(([d, w]) => (
                        <Badge
                          key={d}
                          variant="outline"
                          className={
                            'text-[10px] border-transparent ' +
                            DIRECTION_COLORS[d].bg +
                            ' ' +
                            DIRECTION_COLORS[d].text
                          }
                        >
                          {DIRECTION_LABELS[d]} {Math.round(w * 100)}%
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" className="shrink-0 shadow-[0_0_14px_rgba(0_229_255_0.25)]">
                    开始
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* 历史模考 */}
        <Card className="border-purple-500/15">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="size-4 text-purple-400" />
              模考记录
              {sessions.length > 0 && (
                <span className="ml-auto text-[11px] font-mono-data text-muted-foreground">
                  共 {sessions.length} 次
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-6">
                <Trophy className="size-9 mx-auto text-muted-foreground/25 mb-2" />
                <p className="text-xs text-muted-foreground">
                  还没有模考记录，先来一场找找节奏
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.slice(0, 6).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0"
                  >
                    <div
                      className={cn(
                        'w-11 text-center text-sm font-bold tabular-nums font-mono-data',
                        s.score >= 85
                          ? 'text-emerald-400'
                          : s.score >= 70
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      )}
                    >
                      {s.score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{s.presetName}</div>
                      <div className="text-[10px] text-muted-foreground font-mono-data">
                        {new Date(s.startedAt).toLocaleDateString('zh-CN')} ·{' '}
                        {s.correctCount}/{s.totalQuestions} 题 · 用时{' '}
                        {formatSec(s.usedSec)}
                      </div>
                    </div>
                    <div className="text-[10px] text-purple-300 font-mono-data shrink-0">
                      折算 {s.teamScore}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------------- 报告页 ----------------
  if (phase === 'report' && report) {
    const wrongItems = report.items.filter((i) => !i.correct);
    const wrongQuestions = wrongItems
      .map((i) => report.questions.find((q) => q.id === i.id))
      .filter(Boolean) as IQuizQuestion[];
    const shown = showAllWrong ? wrongQuestions : wrongQuestions.slice(0, 10);
    const avgSec = Math.round(report.usedSec / report.questions.length);
    const slowest = [...report.items].sort((a, b) => b.seconds - a.seconds).slice(0, 3);

    return (
      <div className="space-y-3">
        <Card className="border-cyan-500/25 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500" />
          <CardContent className="pt-6 text-center">
            <div className="text-[11px] text-muted-foreground font-mono-data mb-1">
              {report.preset.name} · {report.autoSubmitted ? '自动交卷' : '手动交卷'}
            </div>
            <div
              className={cn(
                'text-5xl font-bold tabular-nums font-mono-data',
                report.score >= 85
                  ? 'text-emerald-400'
                  : report.score >= 70
                  ? 'text-amber-400'
                  : 'text-rose-400'
              )}
            >
              {report.score}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              正确 {report.correctCount}/{report.questions.length} 题
              {report.unanswered > 0 && (
                <span className="text-rose-400"> · 未答 {report.unanswered} 题</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="rounded-lg bg-muted/20 py-2">
                <div className="text-sm font-bold font-mono-data text-cyan-400">
                  {formatSec(report.usedSec)}
                </div>
                <div className="text-[10px] text-muted-foreground">总用时</div>
              </div>
              <div className="rounded-lg bg-muted/20 py-2">
                <div className="text-sm font-bold font-mono-data text-purple-400">
                  {avgSec}s
                </div>
                <div className="text-[10px] text-muted-foreground">平均每题</div>
              </div>
              <div className="rounded-lg bg-muted/20 py-2">
                <div className="text-sm font-bold font-mono-data text-amber-400">
                  {report.teamScore}
                </div>
                <div className="text-[10px] text-muted-foreground">折算单人分/1000</div>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
              团队 3 人满分 3000 分。按当前水平单人折算{' '}
              <b className="text-amber-300">{report.teamScore}</b>，三人同水平约{' '}
              <b className="text-amber-300">{report.teamScore * 3}</b> 分。
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/15">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="size-4 text-emerald-400" />
              各方向正确率
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(report.byDirection).map(([dir, v]) => {
              const rate = v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0;
              return (
                <div key={dir} className="flex items-center gap-2">
                  <span className="text-[11px] w-12 shrink-0 text-muted-foreground">
                    {DIRECTION_LABELS[dir]}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        DIRECTION_COLORS[dir].bar
                      )}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-[11px] w-16 text-right font-mono-data shrink-0',
                      rate >= 85
                        ? 'text-emerald-400'
                        : rate >= 70
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    )}
                  >
                    {rate}% ({v.correct}/{v.total})
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {slowest.length > 0 && (
          <Card className="border-amber-500/15">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="size-4 text-amber-400" />
                耗时最长的题
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {slowest.map((it, i) => {
                const q = report.questions.find((x) => x.id === it.id);
                if (!q) return null;
                return (
                  <div key={it.id} className="flex items-start gap-2 text-[11px]">
                    <span className="text-amber-400 font-mono-data shrink-0">
                      {it.seconds}s
                    </span>
                    <span className="text-muted-foreground line-clamp-2 flex-1">
                      {q.question}
                    </span>
                    {it.correct ? (
                      <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="size-3.5 text-rose-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {wrongQuestions.length > 0 && (
          <Card className="border-rose-500/15">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <XCircle className="size-4 text-rose-400" />
                错题解析
                <span className="ml-auto text-[11px] font-mono-data text-muted-foreground">
                  {wrongQuestions.length} 题
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {shown.map((q, i) => (
                <div key={q.id} className="rounded-lg border border-rose-500/10 p-3">
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <Badge
                      className={cn(
                        'text-[10px] border-transparent',
                        DIRECTION_COLORS[q.direction].bg,
                        DIRECTION_COLORS[q.direction].text
                      )}
                    >
                      {DIRECTION_LABELS[q.direction]}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn('text-[10px]', DIFFICULTY_COLORS[getDifficulty(q)])}
                    >
                      {DIFFICULTY_LABELS[getDifficulty(q)]}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono-data">
                      #{i + 1}
                    </span>
                  </div>
                  <p className="text-xs font-medium mb-1.5 leading-relaxed">{q.question}</p>
                  <div className="text-[11px] text-emerald-400 mb-1">
                    正确答案：
                    {Array.isArray(q.answer) ? q.answer.join('、') : q.answer}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              ))}
              {wrongQuestions.length > 10 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowAllWrong((v) => !v)}
                >
                  {showAllWrong ? '收起' : `展开全部 ${wrongQuestions.length} 道错题`}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setPhase('select');
              setReport(null);
            }}
          >
            <ChevronLeft className="size-4 mr-1" />
            返回
          </Button>
          <Button className="flex-1" onClick={() => startExam(report.preset)}>
            <RotateCcw className="size-4 mr-1" />
            再来一次
          </Button>
        </div>
      </div>
    );
  }

  // ---------------- 答题页 ----------------
  if (!current) return null;

  const selected = answers[current.id] ?? [];
  const isMulti = current.type === 'multiple';
  const isMarked = marks.includes(current.id);
  const lowTime = remaining <= 60;

  return (
    <div className="space-y-2">
      {/* 顶部：倒计时 + 进度 + 题卡 */}
      <div className="sticky top-0 z-30 -mx-2 px-2 py-2 bg-background/85 backdrop-blur-xl border-b border-cyan-500/10">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-muted-foreground"
            onClick={() => setConfirmOpen(true)}
          >
            <ChevronLeft className="size-3.5 mr-0.5" />
            交卷
          </Button>
          <div
            className={cn(
              'flex-1 text-center text-base font-bold tabular-nums font-mono-data',
              lowTime ? 'text-rose-400 animate-pulse' : 'text-cyan-400'
            )}
          >
            {formatSec(remaining)}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-muted-foreground"
            onClick={() => setCardOpen(true)}
          >
            <Grid3x3 className="size-3.5 mr-0.5" />
            {answeredCount}/{questions.length}
          </Button>
        </div>
        <div className="mt-1.5 h-1 rounded-full bg-muted/40 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className="border-cyan-500/20">
        <CardHeader className="pt-4 pb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge
              variant="outline"
              className="border-cyan-500/30 text-cyan-400 text-[10px]"
            >
              {isMulti ? '多选题' : '单选题'}
            </Badge>
            <Badge
              className={cn(
                'text-[10px] border-transparent',
                DIRECTION_COLORS[current.direction].bg,
                DIRECTION_COLORS[current.direction].text
              )}
            >
              {DIRECTION_LABELS[current.direction]}
            </Badge>
            <Badge
              variant="outline"
              className={cn('text-[10px]', DIFFICULTY_COLORS[getDifficulty(current)])}
            >
              {DIFFICULTY_LABELS[getDifficulty(current)]}
            </Badge>
            <span className="ml-auto text-[10px] font-mono-data text-muted-foreground/70">
              {index + 1}/{questions.length}
            </span>
          </div>
          <CardTitle className="text-sm mt-2 leading-relaxed flex items-start gap-1.5">
            <Zap className="size-3.5 text-cyan-400 shrink-0 mt-1" />
            <span>{current.question}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {current.options.map((option, i) => {
            const on = selected.includes(option);
            return (
              <div
                key={i}
                onClick={() => selectOption(option)}
                className={cn(
                  'flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all text-sm',
                  on
                    ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-100'
                    : 'border-border/50 hover:border-cyan-500/30'
                )}
              >
                <div
                  className={cn(
                    'size-5 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-medium font-mono-data',
                    on
                      ? 'border-cyan-400 bg-cyan-500 text-card'
                      : 'border-border/60 text-muted-foreground/60'
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="flex-1">{option}</span>
              </div>
            );
          })}

          <div className="flex items-center gap-2 pt-2">
            <Button
              variant={isMarked ? 'default' : 'outline'}
              size="sm"
              onClick={toggleMark}
              className={cn(
                'text-xs',
                !isMarked && 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
              )}
            >
              <Flag className="size-3.5 mr-1" />
              {isMarked ? '已标记' : '标记'}
            </Button>
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            {index < questions.length - 1 ? (
              <Button size="sm" onClick={() => setIndex((i) => i + 1)}>
                下一题
                <ChevronRight className="size-3.5 ml-1" />
              </Button>
            ) : (
              <Button size="sm" onClick={() => setConfirmOpen(true)}>
                交卷
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 题卡 */}
      <Dialog open={cardOpen} onOpenChange={setCardOpen}>
        <DialogContent className="max-w-md border-cyan-500/20 bg-card/95 backdrop-blur-xl cyber-scroll max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-tech text-sm">答题卡</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-6 gap-1.5 py-2">
            {questions.map((q, i) => {
              const done = (answers[q.id] ?? []).length > 0;
              const mk = marks.includes(q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setIndex(i);
                    setCardOpen(false);
                  }}
                  className={cn(
                    'h-8 rounded-md text-xs font-mono-data border transition-all',
                    i === index && 'ring-1 ring-cyan-400',
                    mk
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : done
                      ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                      : 'bg-muted/20 border-border/40 text-muted-foreground'
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground justify-center">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-sm bg-cyan-500/40" />
              已答
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-sm bg-amber-500/50" />
              标记
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-sm bg-muted/50" />
              未答
            </span>
          </div>
          <Button className="w-full mt-2" onClick={() => setConfirmOpen(true)}>
            交卷（剩余 {formatSec(remaining)}）
          </Button>
        </DialogContent>
      </Dialog>

      {/* 交卷确认 */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-xs border-cyan-500/20 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-tech text-sm">确认交卷？</DialogTitle>
          </DialogHeader>
          <div className="text-xs text-muted-foreground space-y-1 py-1">
            <div>
              已答{' '}
              <b className={cn(answeredCount < questions.length ? 'text-rose-400' : 'text-emerald-400')}>
                {answeredCount}
              </b>{' '}
              / {questions.length} 题
            </div>
            <div>
              剩余时间 <b className="text-cyan-400">{formatSec(remaining)}</b>
            </div>
            {answeredCount < questions.length && (
              <div className="text-amber-400 pt-1">
                还有 {questions.length - answeredCount} 题未作答，多选题不选不得分。
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setConfirmOpen(false)}
            >
              继续答题
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                setConfirmOpen(false);
                handleSubmit(false);
              }}
            >
              确认交卷
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
