import re

filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\pages\QuizPage\QuizPage.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 检查是否已经插入了卡片
if '题库自动更新' in content:
    print("Card already exists, skipping")
else:
    # 找到模式选择页中"选择练习模式"所在的div
    # 插入点：在 <div className="flex items-center justify-between"> 前面，且这个div后面跟着"选择练习模式"
    pattern = r'(\s*)(<div className="flex items-center justify-between">\s*<span className="text-xs text-muted-foreground font-mono-data">\s*选择练习模式)'
    
    card_code = '''
        {/* 题库自动更新进度 */}
        <Card className="border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-transparent overflow-hidden">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-cyan-400" />
                <span className="text-xs font-tech text-cyan-300">题库自动更新</span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 px-2" onClick={handleCheckUpdate}>
                <RefreshCw className="size-3 mr-1" />
                检查更新
              </Button>
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <Unlock className="size-3 text-emerald-400" />
              <span className="text-sm font-mono-data text-emerald-300">{unlockedCount}</span>
              <span className="text-xs text-muted-foreground">已解锁</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm font-mono-data">{totalCount}</span>
              <span className="text-xs text-muted-foreground">总题数</span>
              {lockedCount > 0 && (
                <span className="text-xs text-amber-300 ml-auto">
                  <Lock className="size-3 inline mr-0.5" />{lockedCount}题待解锁
                </span>
              )}
            </div>
            <Progress value={(unlockedCount / totalCount) * 100} className="h-1.5 bg-cyan-950/50" />
            {nextBatchDate && (
              <p className="text-xs text-muted-foreground mt-1.5 font-mono-data">
                下一批 {timeUntilNext} 解锁 · {formatDateCN(nextBatchDate)}
              </p>
            )}
          </CardContent>
        </Card>
'''
    
    replacement = card_code + r'\1\2'
    new_content, count = re.subn(pattern, replacement, content, count=1)
    
    if count > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Card inserted successfully (replacements: {count})")
    else:
        print("Pattern not found!")
        # 调试：打印包含"选择练习模式"的上下文
        idx = content.find('选择练习模式')
        if idx >= 0:
            print("Context around '选择练习模式':")
            print(content[idx-200:idx+100])
