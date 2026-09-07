import { MOCK_QUIZZES, type IQuizQuestion, type QuizDifficulty } from '@/data/quizzes';

export type ExamPresetId = 'province-prelim' | 'province-final' | 'sprint';

export interface IExamPreset {
  id: ExamPresetId;
  name: string;
  sub: string;
  questionCount: number;
  minutes: number;
  difficultyMix: QuizDifficulty[];
  weights: Record<string, number>;
  tip: string;
}

/** 官方赛制：省初赛 60 题/60 分钟，省复赛 150 题/120 分钟，均为单选+多选 */
export const EXAM_PRESETS: IExamPreset[] = [
  {
    id: 'province-prelim',
    name: '省初赛模考',
    sub: '60 题 / 60 分钟',
    questionCount: 60,
    minutes: 60,
    difficultyMix: ['IA', 'IP'],
    weights: { datacom: 0.4, security: 0.25, wlan: 0.2, dcn: 0.15 },
    tip: '对应省初赛规格：平均 60 秒/题，以 HCIA 为主、少量 HCIP。',
  },
  {
    id: 'province-final',
    name: '省复赛模考',
    sub: '150 题 / 120 分钟',
    questionCount: 150,
    minutes: 120,
    difficultyMix: ['IP', 'IE'],
    weights: { datacom: 0.4, security: 0.25, wlan: 0.2, dcn: 0.15 },
    tip: '对应省复赛规格：平均 48 秒/题，HCIP 为主，含 HCIE 高阶题。节奏是最大失分点。',
  },
  {
    id: 'sprint',
    name: '冲刺小测',
    sub: '20 题 / 20 分钟',
    questionCount: 20,
    minutes: 20,
    difficultyMix: ['IA', 'IP', 'IE'],
    weights: { datacom: 0.4, security: 0.25, wlan: 0.2, dcn: 0.15 },
    tip: '碎片时间自测，全难度混合抽题。',
  },
];

/** Fisher-Yates 洗牌（无偏），替代 sort(() => Math.random() - 0.5) */
export function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** 题干去重：题库中存在少量完全重复的题干（ID 不同），考试中只保留一道 */
export function dedupeQuestions(list: IQuizQuestion[]): IQuizQuestion[] {
  const seen = new Set<string>();
  const out: IQuizQuestion[] = [];
  for (const q of list) {
    const key = q.question.trim();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}

/** 考试用题库：排除判断题（官方省赛只考单选+多选）并去重 */
export function getExamPool(): IQuizQuestion[] {
  return dedupeQuestions(MOCK_QUIZZES).filter((q) => q.type !== 'judge');
}

export function getDifficulty(q: IQuizQuestion): QuizDifficulty {
  return q.difficulty ?? 'IA';
}

/** 按预设组卷：先按方向配额抽样，不足时从全池补齐，最后整体打乱 */
export function buildExamPaper(preset: IExamPreset): IQuizQuestion[] {
  const pool = getExamPool().filter((q) => preset.difficultyMix.includes(getDifficulty(q)));
  const fallback = getExamPool();

  const byDir: Record<string, IQuizQuestion[]> = {};
  pool.forEach((q) => {
    (byDir[q.direction] ??= []).push(q);
  });

  const picked: IQuizQuestion[] = [];
  const used = new Set<string>();

  Object.entries(preset.weights).forEach(([dir, w]) => {
    const need = Math.round(preset.questionCount * w);
    const bucket = shuffle(byDir[dir] ?? []);
    let n = 0;
    for (const q of bucket) {
      if (n >= need) break;
      if (used.has(q.id)) continue;
      used.add(q.id);
      picked.push(q);
      n++;
    }
  });

  // 配额不足时用全池补齐（难度不限）
  if (picked.length < preset.questionCount) {
    for (const q of shuffle(fallback)) {
      if (picked.length >= preset.questionCount) break;
      if (used.has(q.id)) continue;
      used.add(q.id);
      picked.push(q);
    }
  }

  return shuffle(picked).slice(0, preset.questionCount);
}

/** 判分：多选要求完全一致 */
export function isAnswerCorrect(q: IQuizQuestion, selected: string[]): boolean {
  const answer = q.answer;
  if (Array.isArray(answer)) {
    if (selected.length !== answer.length) return false;
    return answer.every((a) => selected.includes(a));
  }
  return selected.length === 1 && selected[0] === answer;
}

export function formatSec(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

export const DIFFICULTY_LABELS: Record<QuizDifficulty, string> = {
  IA: 'HCIA',
  IP: 'HCIP',
  IE: 'HCIE',
};

export const DIFFICULTY_COLORS: Record<QuizDifficulty, string> = {
  IA: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  IP: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  IE: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};
