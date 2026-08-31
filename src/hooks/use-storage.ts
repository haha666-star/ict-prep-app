import { useState, useEffect, useCallback } from 'react';
import { scopedStorage } from '@/lib/storage';
import type { KnowledgeStatus } from '@/lib/utils';

// 存储 key 前缀
const KEY_KNOWLEDGE_STATUS = 'knowledge_status';
const KEY_STUDY_PLAN = 'study_plan';
const KEY_QUIZ_RECORDS = 'quiz_records';
const KEY_STUDY_TIME = 'study_time';
const KEY_EXAM_DATE = 'exam_date';

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
export interface IQuizRecords {
  answeredIds: string[];
  wrongIds: string[];
  correctCount: number;
  totalCount: number;
  byDirection: Record<string, { correct: number; total: number }>;
  dailyRecords: Record<string, { count: number; correct: number }>;
}

const DEFAULT_QUIZ_RECORDS: IQuizRecords = {
  answeredIds: [],
  wrongIds: [],
  correctCount: 0,
  totalCount: 0,
  byDirection: {},
  dailyRecords: {},
};

export function useQuizRecords() {
  const [records, setRecords] = useState<IQuizRecords>(DEFAULT_QUIZ_RECORDS);

  useEffect(() => {
    const raw = scopedStorage.getItem(KEY_QUIZ_RECORDS);
    if (raw) {
      try {
        setRecords(JSON.parse(raw));
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
        const alreadyAnswered = prev.answeredIds.includes(questionId);
        const next: IQuizRecords = {
          ...prev,
          answeredIds: alreadyAnswered
            ? prev.answeredIds
            : [...prev.answeredIds, questionId],
          correctCount: alreadyAnswered
            ? prev.correctCount
            : prev.correctCount + (correct ? 1 : 0),
          totalCount: alreadyAnswered ? prev.totalCount : prev.totalCount + 1,
          wrongIds: correct
            ? prev.wrongIds.filter((id) => id !== questionId)
            : prev.wrongIds.includes(questionId)
            ? prev.wrongIds
            : [...prev.wrongIds, questionId],
          byDirection: {
            ...prev.byDirection,
            [direction]: {
              correct:
                (prev.byDirection[direction]?.correct ?? 0) + (correct ? 1 : 0),
              total: (prev.byDirection[direction]?.total ?? 0) + 1,
            },
          },
          dailyRecords: {
            ...prev.dailyRecords,
            [dateStr]: {
              count: (prev.dailyRecords[dateStr]?.count ?? 0) + 1,
              correct:
                (prev.dailyRecords[dateStr]?.correct ?? 0) + (correct ? 1 : 0),
            },
          },
        };
        scopedStorage.setItem(KEY_QUIZ_RECORDS, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  return { records, recordAnswer, saveRecords };
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
