filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\data\quizzes.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
removed = 0
for line in lines:
    # 跳过包含 batch: 的行
    if 'batch:' in line and 'batch:' in line.replace(' ', ''):
        removed += 1
        continue
    # 跳过自动更新题库的注释行
    if '自动更新题库' in line:
        removed += 1
        continue
    new_lines.append(line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

count = sum(1 for l in new_lines if "id: '" in l)
print(f"Removed {removed} lines")
print(f"Total questions: {count}")
