import type { IQuizQuestion } from '../data/quizzes'

/**
 * 选项顺序稳定打乱
 *
 * 目的：消除题库"正确答案集中在 A/B"的位置偏斜，
 *       避免使用者通过位置而非知识记忆来答题。
 *
 * 设计要点：
 * - 以题目 id 作为随机种子 → 同一题每次进入顺序一致（不会每次刷新都变），
 *   既打散位置又不破坏"复刷时的稳定性"。
 * - answer 字段存的是选项文本（非下标），打乱 options 不影响判分。
 * - 排除两类不可打乱的题：
 *   1) 选项含自引用（"以上都对""前者"等），打乱后语义会错乱；
 *   2) 解析中显式引用了选项字母（如"选项A"），打乱后解析会与选项对不上。
 */

const ORDER_SENSITIVE = /以上|都对|都不|均是|均不|前者|后者|上述|前两项|后两项/
const LETTER_REF = /选项\s*[ABCD]|选\s*[ABCD](?!\w)|（[ABCD]）|\([ABCD]\)|^\s*[ABCD][、．.]/

function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function stableShuffleOptions(q: IQuizQuestion): IQuizQuestion {
  if (q.type === 'judge') return q
  const options = q.options
  if (!options || options.length < 2) return q
  if (options.some((o) => ORDER_SENSITIVE.test(o))) return q
  if (q.explanation && LETTER_REF.test(q.explanation)) return q

  const rnd = mulberry32(hash(q.id))
  const arr = [...options]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return { ...q, options: arr }
}
