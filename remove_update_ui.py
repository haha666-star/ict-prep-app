filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\pages\QuizPage\QuizPage.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 移除 quiz-updater 导入行
content = content.replace("import { getUnlockedBatchCount, isBatchUnlocked, getNextBatchDate, getTimeUntilNextBatch, formatDateCN } from '@/lib/quiz-updater';\n", "")

# 2. 移除只用于更新卡片的图标导入（RefreshCw, Lock, Unlock, Sparkles）
content = content.replace("import { RefreshCw, Lock, Unlock, Sparkles } from 'lucide-react';\n", "")

# 3. 移除 updateCheckTime 状态
content = content.replace("  const [updateCheckTime, setUpdateCheckTime] = useState<number>(Date.now());\n", "")

# 4. 替换 unlockedQuizzes 为直接使用 MOCK_QUIZZES
old_filter = "  const unlockedQuizzes = useMemo(() => MOCK_QUIZZES.filter((q) => !q.batch || isBatchUnlocked(q.batch)), [updateCheckTime]);\n  const totalCount = MOCK_QUIZZES.length;\n  const unlockedCount = unlockedQuizzes.length;\n  const lockedCount = totalCount - unlockedCount;\n  const nextBatchDate = getNextBatchDate();\n  const timeUntilNext = getTimeUntilNextBatch();\n  const handleCheckUpdate = () => {\n    setUpdateCheckTime(Date.now());\n    const n = MOCK_QUIZZES.filter((q) => !q.batch || isBatchUnlocked(q.batch)).length;\n    if (n > unlockedCount) toast.success(`发现新题目！已解锁 ${n - unlockedCount} 道新题`);\n    else toast.info('当前已是最新题库，下一批新题将自动解锁');\n  };\n"
new_simple = "  const totalCount = MOCK_QUIZZES.length;\n"
content = content.replace(old_filter, new_simple)

# 5. 将所有 unlockedQuizzes 替换为 MOCK_QUIZZES
content = content.replace("unlockedQuizzes", "MOCK_QUIZZES")

# 6. 移除 JSX 中的更新进度卡片（从 {/* 题库自动更新进度 */} 到对应的 </Card>）
import re
# 匹配更新卡片的完整块
pattern = r'\n\s*{/\* 题库自动更新进度 \*/}\s*\n\s*<Card className="border-cyan-500/20.*?</Card>\s*\n'
content = re.sub(pattern, '\n', content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed all update-related code from QuizPage")
