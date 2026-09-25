import { useState, useEffect, useCallback } from 'react';
import { scopedStorage } from '@/lib/storage';
import type { KnowledgeStatus } from '@/lib/utils';

// 存储 key 前缀
const KEY_KNOWLEDGE_STATUS = 'knowledge_status';
const KEY_STUDY_PLAN = 'study_plan';
const KEY_QUIZ_RECORDS = 'quiz_records';
const KEY_STUDY_TIME = 'study_time';
const KEY_EXAM_DATE = 'exam_date';
const KEY_EXAM_SESSIONS = 'exam_sessions';
const KEY_FAVORITES = 'favorites';

// 错题本移出阈值：连续答对 N 次才认为真正掌握
export const SRS_GRADUATE_STREAK = 2;

// ========== 知识点掌握状态 ==========
export type KnowledgeStatusMap = Record<string, KnowledgeStatus>;

export function useKnowledgeStatus() {
  const [statusMap, setStatusMap] = useState<KnowledgeStatusMap>({});

  useEffect(() => {
    const raw = scopedStorage.getItem(KEY_KNOWLEDGE_STATUS);
    if (raw) {
      try {
        setStatusMap(JSON.parse(raw));
      } catch {
        setStatusMap({});
      }
    }
  }, []);

  const setStatus = useCallback((id: string, status: KnowledgeStatus) => {
    setStatusMap((prev) => {
      const next = { ...prev, [id]: status };
      scopedStorage.setItem(KEY_KNOWLEDGE_STATUS, JSON.stringify(next));
      return next;
    });
  }, []);

  const getStatus = useCallback(
    (id: string): KnowledgeStatus => statusMap[id] ?? 'not_started',
    [statusMap]
  );

  return { statusMap, setStatus, getStatus };
}

// ========== 学习计划 ==========
export interface IStudyPlanTask {
  id: string;
  knowledgeId: string;
  knowledgeName: string;
  date: string;
  duration: number;
  completed: boolean;
}

export interface IStudyPlan {
  startDate: string;
  examDate: string;
  dailyMinutes: number;
  tasks: IStudyPlanTask[];
  createdAt: string;
}

export function useStudyPlan() {
  const [plan, setPlan] = useState<IStudyPlan | null>(null);

  useEffect(() => {
    const raw = scopedStorage.getItem(KEY_STUDY_PLAN);
    if (raw) {
      try {
        setPlan(JSON.parse(raw));
      } catch {
        setPlan(null);
      }
    }
  }, []);

  const savePlan = useCallback((newPlan: IStudyPlan) => {
    setPlan(newPlan);
    scopedStorage.setItem(KEY_STUDY_PLAN, JSON.stringify(newPlan));
  }, []);

  const toggleTask = useCallback(
    (taskId: string) => {
      if (!plan) return;
      const newTasks = plan.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      const newPlan = { ...plan, tasks: newTasks };
      savePlan(newPlan);
    },
    [plan, savePlan]
  );

  return { plan, savePlan, toggleTask };
}

// ========== 刷题记录 ==========
export interface IQuestionStat {
  attempts: number;       // 累计作答次数
  wrongCount: number;     // 累计答错次数
  correctStreak: number;  // 当前连续答对次数（错题本毕业用）
  lastAt: number;         // 最近一次作答时间戳
  lastCorrect: boolean;
}

export interface IQuizRecords {
  answeredIds: string[];
  wrongIds: string[];
  correctCount: number;   // 首刷正确题数
  totalCount: number;     // 已作答过的不同题目数
  byDirection: Record<string, { correct: number; total: number }>;
  dailyRecords: Record<string, { count: number; correct: number }>;
  /** 每题累计统计（支持间隔重复与错误次数分析） */
  perQuestion: Record<string, IQuestionStat>;
}

const DEFAULT_QUIZ_RECORDS: IQuizRecords = {
  answeredIds: [],
  wrongIds: [],
  correctCount: 0,
  totalCount: 0,
  byDirection: {},
  dailyRecords: {},
  perQuestion: {},
};

export function useQuizRecords() {
  const [records, setRecords] = useState<IQuizRecords>(DEFAULT_QUIZ_RECORDS);

  useEffect(() => {
    const raw = scopedStorage.getItem(KEY_QUIZ_RECORDS);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as IQuizRecords;
        setRecords({ ...DEFAULT_QUIZ_RECORDS, ...parsed });
      } catch {
        setRecords(DEFAULT_QUIZ_RECORDS);
      }
    }
  }, []);

  const saveRecords = useCallback((next: IQuizRecords) => {
    setRecords(next);
    scopedStorage.setItem(KEY_QUIZ_RECORDS, JSON.stringify(next));
  }, []);

  const recordAnswer = useCallback(
    (questionId: string, direction: string, correct: boolean, dateStr: string) => {
      setRecords((prev) => {
        const firstTime = !prev.answeredIds.includes(questionId);
        const stat = prev.perQuestion[questionId] ?? {
          attempts: 0,
          wrongCount: 0,
          correctStreak: 0,
          lastAt: 0,
          lastCorrect: false,
        };

        const nextStat: IQuestionStat = {
          attempts: stat.attempts + 1,
          wrongCount: stat.wrongCount + (correct ? 0 : 1),
          correctStreak: correct ? stat.correctStreak + 1 : 0,
          lastAt: Date.now(),
          lastCorrect: correct,
        };

        // 错题本 SRS：答错入池；连续答对 SRS_GRADUATE_STREAK 次才移出
        const inWrong = prev.wrongIds.includes(questionId);
        let wrongIds = prev.wrongIds;
        if (!correct) {
          wrongIds = inWrong ? prev.wrongIds : [...prev.wrongIds, questionId];
        } else if (inWrong && nextStat.correctStreak >= SRS_GRADUATE_STREAK) {
          wrongIds = prev.wrongIds.filter((id) => id !== questionId);
        }

        const next: IQuizRecords = {
          ...prev,
          // 统计口径统一为「首次作答」，避免重复刷题灌水
          answeredIds: firstTime ? [...prev.answeredIds, questionId] : prev.answeredIds,
          correctCount: firstTime
            ? prev.correctCount + (correct ? 1 : 0)
            : prev.correctCount,
          totalCount: firstTime ? prev.totalCount + 1 : prev.totalCount,
          wrongIds,
          byDirection: firstTime
            ? {
                ...prev.byDirection,
                [direction]: {
                  correct:
                    (prev.byDirection[direction]?.correct ?? 0) + (correct ? 1 : 0),
                  total: (prev.byDirection[direction]?.total ?? 0) + 1,
                },
              }
            : prev.byDirection,
          dailyRecords: firstTime
            ? {
                ...prev.dailyRecords,
                [dateStr]: {
                  count: (prev.dailyRecords[dateStr]?.count ?? 0) + 1,
                  correct:
                    (prev.dailyRecords[dateStr]?.correct ?? 0) + (correct ? 1 : 0),
                },
              }
            : prev.dailyRecords,
          perQuestion: { ...prev.perQuestion, [questionId]: nextStat },
        };
        scopedStorage.setItem(KEY_QUIZ_RECORDS, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  /** 批量记录（模考交卷时用，避免逐题 setState 造成卡顿） */
  const recordMany = useCallback(
    (
      entries: { questionId: string; direction: string; correct: boolean; dateStr: string }[]
    ) => {
      if (!entries.length) return;
      const dateStr = entries[0].dateStr;
      setRecords((prev) => {
        let next: IQuizRecords = { ...prev };
        entries.forEach(({ questionId, direction, correct }) => {
          const firstTime = !next.answeredIds.includes(questionId);
          const stat = next.perQuestion[questionId] ?? {
            attempts: 0,
            wrongCount: 0,
            correctStreak: 0,
            lastAt: 0,
            lastCorrect: false,
          };
          const nextStat: IQuestionStat = {
            attempts: stat.attempts + 1,
            wrongCount: stat.wrongCount + (correct ? 0 : 1),
            correctStreak: correct ? stat.correctStreak + 1 : 0,
            lastAt: Date.now(),
            lastCorrect: correct,
          };

          const inWrong = next.wrongIds.includes(questionId);
          let wrongIds = next.wrongIds;
          if (!correct) {
            wrongIds = inWrong ? next.wrongIds : [...next.wrongIds, questionId];
          } else if (inWrong && nextStat.correctStreak >= SRS_GRADUATE_STREAK) {
            wrongIds = next.wrongIds.filter((id) => id !== questionId);
          }

          next = {
            ...next,
            answeredIds: firstTime ? [...next.answeredIds, questionId] : next.answeredIds,
            correctCount: firstTime
              ? next.correctCount + (correct ? 1 : 0)
              : next.correctCount,
            totalCount: firstTime ? next.totalCount + 1 : next.totalCount,
            wrongIds,
            byDirection: firstTime
              ? {
                  ...next.byDirection,
                  [direction]: {
                    correct:
                      (next.byDirection[direction]?.correct ?? 0) + (correct ? 1 : 0),
                    total: (next.byDirection[direction]?.total ?? 0) + 1,
                  },
                }
              : next.byDirection,
            dailyRecords: firstTime
              ? {
                  ...next.dailyRecords,
                  [dateStr]: {
                    count: (next.dailyRecords[dateStr]?.count ?? 0) + 1,
                    correct:
                      (next.dailyRecords[dateStr]?.correct ?? 0) + (correct ? 1 : 0),
                  },
                }
              : next.dailyRecords,
            perQuestion: { ...next.perQuestion, [questionId]: nextStat },
          };
        });
        scopedStorage.setItem(KEY_QUIZ_RECORDS, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  return { records, recordAnswer, recordMany, saveRecords };
}

// ========== 模考记录 ==========
export interface IExamAnswerItem {
  id: string;
  direction: string;
  type: 'single' | 'multiple' | 'judge';
  correct: boolean;
  seconds: number;   // 该题停留耗时
}

export interface IExamSession {
  id: string;
  presetName: string;
  startedAt: number;
  totalQuestions: number;
  durationSec: number;
  usedSec: number;
  correctCount: number;
  score: number;              // 百分制
  teamScore: number;          // 折算单人 1000 分制（3 人合计 3000）
  byDirection: Record<string, { correct: number; total: number }>;
  items: IExamAnswerItem[];
  autoSubmitted: boolean;
}

export function useExamSessions() {
  const [sessions, setSessions] = useState<IExamSession[]>([]);

  useEffect(() => {
    const raw = scopedStorage.getItem(KEY_EXAM_SESSIONS);
    if (raw) {
      try {
        setSessions(JSON.parse(raw));
      } catch {
        setSessions([]);
      }
    }
  }, []);

  const addSession = useCallback((s: IExamSession) => {
    setSessions((prev) => {
      const next = [s, ...prev].slice(0, 100);
      scopedStorage.setItem(KEY_EXAM_SESSIONS, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearSessions = useCallback(() => {
    setSessions([]);
    scopedStorage.removeItem(KEY_EXAM_SESSIONS);
  }, []);

  return { sessions, addSession, clearSessions };
}

// ========== 收藏/标记 ==========
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const raw = scopedStorage.getItem(KEY_FAVORITES);
    if (raw) {
      try {
        setFavorites(JSON.parse(raw));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      scopedStorage.setItem(KEY_FAVORITES, JSON.stringify(next));
      return next;
    });
  }, []);

  return { favorites, toggleFavorite };
}

// ========== 学习时长 ==========
export function useStudyTime() {
  const [studyTime, setStudyTime] = useState<Record<string, number>>({});

  useEffect(() => {
    const raw = scopedStorage.getItem(KEY_STUDY_TIME);
    if (raw) {
      try {
        setStudyTime(JSON.parse(raw));
      } catch {
        setStudyTime({});
      }
    }
  }, []);

  const addStudyTime = useCallback((dateStr: string, minutes: number) => {
    setStudyTime((prev) => {
      const next = { ...prev, [dateStr]: (prev[dateStr] ?? 0) + minutes };
      scopedStorage.setItem(KEY_STUDY_TIME, JSON.stringify(next));
      return next;
    });
  }, []);

  return { studyTime, addStudyTime };
}

// ========== 比赛日期 ==========
export function useExamDate(defaultDate = '') {
  const [examDate, setExamDateState] = useState<string>(defaultDate);

  useEffect(() => {
    const raw = scopedStorage.getItem(KEY_EXAM_DATE);
    if (raw) {
      setExamDateState(raw);
    } else if (defaultDate) {
      setExamDateState(defaultDate);
    }
  }, [defaultDate]);

  const setExamDate = useCallback((date: string) => {
    setExamDateState(date);
    scopedStorage.setItem(KEY_EXAM_DATE, date);
  }, []);

  return { examDate, setExamDate };
}

// ========== 题目笔记 ==========
export interface IQuestionNote {
  text: string;
  updatedAt: number;
}

export type QuizNotesMap = Record<string, IQuestionNote>;

const KEY_QUIZ_NOTES = 'quiz_notes';

export function useQuizNotes() {
  const [notes, setNotes] = useState<QuizNotesMap>({});

  useEffect(() => {
    const raw = scopedStorage.getItem(KEY_QUIZ_NOTES);
    if (raw) {
      try {
        setNotes(JSON.parse(raw));
      } catch {
        setNotes({});
      }
    }
  }, []);

  const getNote = useCallback(
    (id: string): IQuestionNote | undefined => notes[id],
    [notes]
  );

  const saveNote = useCallback((id: string, text: string) => {
    setNotes((prev) => {
      const next: QuizNotesMap = { ...prev };
      if (text.trim()) {
        next[id] = { text, updatedAt: Date.now() };
      } else {
        delete next[id];
      }
      scopedStorage.setItem(KEY_QUIZ_NOTES, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearNote = useCallback(
    (id: string) => saveNote(id, ''),
    [saveNote]
  );

  return { notes, getNote, saveNote, clearNote };
}

// ========== 备份导出 / 导入 ==========
export const BACKUP_KEYS: Record<string, string> = {
  knowledge_status: KEY_KNOWLEDGE_STATUS,
  study_plan: KEY_STUDY_PLAN,
  quiz_records: KEY_QUIZ_RECORDS,
  study_time: KEY_STUDY_TIME,
  exam_date: KEY_EXAM_DATE,
  exam_sessions: KEY_EXAM_SESSIONS,
  favorites: KEY_FAVORITES,
  quiz_notes: KEY_QUIZ_NOTES,
};

export interface IBackup {
  app: 'ict-network-prep-assistant';
  version: 2;
  exportedAt: string;
  owner?: string;
  data: Record<string, unknown>;
}

export function exportBackup(owner?: string): IBackup {
  const data: Record<string, unknown> = {};
  Object.entries(BACKUP_KEYS).forEach(([name, key]) => {
    const raw = scopedStorage.getItem(key);
    if (raw) {
      try {
        data[name] = JSON.parse(raw);
      } catch {
        data[name] = raw;
      }
    }
  });
  return {
    app: 'ict-network-prep-assistant',
    version: 2,
    exportedAt: new Date().toISOString(),
    owner,
    data,
  };
}

export function importBackup(backup: IBackup, mode: 'merge' | 'replace' = 'replace') {
  if (!backup || backup.app !== 'ict-network-prep-assistant' || !backup.data) {
    throw new Error('备份文件格式不正确');
  }
  if (mode === 'replace') {
    Object.values(BACKUP_KEYS).forEach((key) => scopedStorage.removeItem(key));
  }
  Object.entries(backup.data).forEach(([name, value]) => {
    const key = BACKUP_KEYS[name];
    if (key) scopedStorage.setItem(key, JSON.stringify(value));
  });
}

/** 从备份中解析出各方向正确率（团队对比用） */
export function directionAccuracyFromBackup(backup: IBackup) {
  const rec = backup?.data?.quiz_records as IQuizRecords | undefined;
  const byDirection = rec?.byDirection ?? {};
  const result: Record<string, number> = {};
  Object.entries(byDirection).forEach(([dir, v]) => {
    result[dir] = v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0;
  });
  return {
    byDirection: result,
    totalCount: rec?.totalCount ?? 0,
    correctCount: rec?.correctCount ?? 0,
    wrongCount: rec?.wrongIds?.length ?? 0,
  };
}
