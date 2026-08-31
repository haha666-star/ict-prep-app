import re

filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\data\quizzes.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 移除所有 batch: N, 字段
content = re.sub(r'\n\s*batch: \d+,', '', content)

# 移除自动更新题库的注释标记
content = re.sub(r'\n\s*// ==================== 自动更新题库 Batch \d+.*', '', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed all batch fields and update markers")
count = content.count("id: '")
print(f"Total questions: {count}")
