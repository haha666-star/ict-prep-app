import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Copy, Check, Terminal, Server, Shield, Wifi, Code2 } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_LAB_CONFIGS, type ILabConfig } from '@/data/lab-configs';
import { DIRECTION_LABELS, DIRECTION_COLORS } from '@/lib/utils';
import { cn } from '@/lib/utils';

const DIRECTIONS = ['datacom', 'dcn', 'security', 'wlan'] as const;

const DIR_ICONS: Record<string, typeof Terminal> = {
  datacom: Server,
  dcn: Terminal,
  security: Shield,
  wlan: Wifi,
};

export default function LabConfigPage() {
  const [activeDirection, setActiveDirection] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredConfigs = useMemo(() => {
    let result = MOCK_LAB_CONFIGS;
    if (activeDirection !== 'all') {
      result = result.filter((c) => c.direction === activeDirection);
    }
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(kw) ||
          c.keyCommands.toLowerCase().includes(kw) ||
          c.scenario.toLowerCase().includes(kw) ||
          c.subCategory.toLowerCase().includes(kw)
      );
    }
    return result;
  }, [activeDirection, searchKeyword]);

  // 子分类统计
  const subCategories = useMemo(() => {
    const list =
      activeDirection === 'all'
        ? MOCK_LAB_CONFIGS
        : MOCK_LAB_CONFIGS.filter((c) => c.direction === activeDirection);
    return [...new Set(list.map((c) => c.subCategory))];
  }, [activeDirection]);

  const handleCopy = async (config: ILabConfig, field: 'key' | 'verify') => {
    const text =
      field === 'key' ? config.keyCommands : config.verifyCommands;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(config.id + field);
      toast.success('已复制到剪贴板');
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      toast.error('复制失败');
    }
  };

  return (
    <div className="space-y-2">
      {/* 搜索 + 分类筛选 */}
      <Card className="border-cyan-500/10">
        <CardContent className="pt-4 space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索配置名称、命令关键字..."
              className="pl-9 h-11 bg-input/50"
            />
          </div>

          <Tabs value={activeDirection} onValueChange={setActiveDirection}>
            <TabsList className="grid grid-cols-5 w-full bg-muted/30">
              <TabsTrigger value="all">全部</TabsTrigger>
              {DIRECTIONS.map((d) => (
                <TabsTrigger key={d} value={d} className="data-[state=active]:shadow-[0_0_12px_rgba(0_229_255_0.3)]">
                  {DIRECTION_LABELS[d]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {subCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground py-1">
                子分类：
              </span>
              {subCategories.map((sub) => (
                <Badge
                  key={sub}
                  variant="outline"
                  className="cursor-pointer hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-400 transition-colors border-border/50"
                  onClick={() => setSearchKeyword(sub)}
                >
                  {sub}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 配置列表 */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredConfigs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <Terminal className="size-10 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    未找到匹配的配置命令
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            filteredConfigs.map((config, index) => {
              const colors = DIRECTION_COLORS[config.direction];
              const DirIcon = DIR_ICONS[config.direction];
              const isExpanded = expandedId === config.id;

              return (
                <motion.div
                  key={config.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <Card
                    className={cn(
                      'cursor-pointer transition-all border-border/50 hover:border-cyan-500/30',
                      isExpanded && 'border-cyan-500/40 shadow-md shadow-cyan-500/5'
                    )}
                    onClick={() =>
                      setExpandedId(isExpanded ? null : config.id)
                    }
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div
                            className={cn(
                              'size-10 rounded-lg flex items-center justify-center shrink-0 border',
                              colors.bg,
                              'border-transparent'
                            )}
                          >
                            <DirIcon
                              className={cn('size-5', colors.text)}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Code2 className="size-4 text-cyan-400/60" />
                              {config.title}
                              <Badge
                                variant="outline"
                                className="text-xs font-normal border-border/50 text-muted-foreground"
                              >
                                {config.deviceType}
                              </Badge>
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <Badge
                                className={cn(
                                  'text-xs border-transparent',
                                  colors.bg,
                                  colors.text
                                )}
                              >
                                {DIRECTION_LABELS[config.direction]}
                              </Badge>
                              <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground">
                                {config.subCategory}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                              {config.scenario}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <CardContent className="space-y-4">
                            {/* 适用场景 */}
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                <span className="size-1 rounded-full bg-cyan-400" />
                                适用场景
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {config.scenario}
                              </p>
                            </div>

                            {/* 关键命令 */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                  <Terminal className="size-4 text-cyan-400" />
                                  关键命令
                                </h4>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(config, 'key');
                                  }}
                                >
                                  {copiedId === config.id + 'key' ? (
                                    <>
                                      <Check className="size-3 mr-1" />
                                      已复制
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="size-3 mr-1" />
                                      复制命令
                                    </>
                                  )}
                                </Button>
                              </div>
                              <pre className="bg-[#0a0f1e] border border-cyan-500/15 p-4 rounded-lg text-xs font-mono-data overflow-x-auto leading-relaxed text-cyan-200/90 relative">
                                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
                                {config.keyCommands}
                              </pre>
                            </div>

                            {/* 验证命令 */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                  <Check className="size-4 text-emerald-400" />
                                  验证命令
                                </h4>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(config, 'verify');
                                  }}
                                >
                                  {copiedId === config.id + 'verify' ? (
                                    <>
                                      <Check className="size-3 mr-1" />
                                      已复制
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="size-3 mr-1" />
                                      复制
                                    </>
                                  )}
                                </Button>
                              </div>
                              <pre className="bg-muted/30 border border-border/40 p-4 rounded-lg text-xs font-mono-data overflow-x-auto leading-relaxed text-foreground/80">
                                {config.verifyCommands}
                              </pre>
                            </div>

                            {/* 注意事项 */}
                            {config.notes && (
                              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
                                <h4 className="text-sm font-semibold text-amber-400 mb-1 flex items-center gap-2">
                                  ⚠ 注意事项
                                </h4>
                                <p className="text-sm text-amber-200/80">
                                  {config.notes}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
