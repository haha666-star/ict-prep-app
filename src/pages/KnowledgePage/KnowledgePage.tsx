import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  ChevronDown,
  Search,
  Lightbulb,
  CheckCircle2,
  Clock,
  Circle,
  Database,
} from 'lucide-react';
import { MOCK_KNOWLEDGE, type IKnowledge } from '@/data/knowledge';
import { useKnowledgeStatus } from '@/hooks/use-storage';
import {
  DIRECTION_LABELS,
  DIRECTION_COLORS,
  STATUS_LABELS,
  type KnowledgeStatus,
} from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TreeNode extends IKnowledge {
  children: TreeNode[];
}

function buildTree(nodes: IKnowledge[], direction: string): TreeNode[] {
  const dirNodes = nodes.filter((n) => n.direction === direction);
  const map = new Map<string, TreeNode>();
  dirNodes.forEach((n) => map.set(n.id, { ...n, children: [] }));
  const roots: TreeNode[] = [];
  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else if (!node.parentId) {
      roots.push(node);
    }
  });
  return roots;
}

const DIRECTIONS = ['datacom', 'dcn', 'security', 'wlan'] as const;

export default function KnowledgePage() {
  const { statusMap, setStatus } = useKnowledgeStatus();
  const [activeDirection, setActiveDirection] = useState<string>('datacom');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const trees = useMemo(() => {
    const result: Record<string, TreeNode[]> = {};
    DIRECTIONS.forEach((d) => {
      result[d] = buildTree(MOCK_KNOWLEDGE, d);
    });
    return result;
  }, []);

  // 选中第一个叶子节点
  const defaultSelected = useMemo(() => {
    const firstTree = trees[activeDirection];
    if (!firstTree || firstTree.length === 0) return null;
    const findFirstLeaf = (nodes: TreeNode[]): string | null => {
      for (const n of nodes) {
        if (n.children.length === 0 && n.keyPoints.length > 0) return n.id;
        if (n.children.length > 0) {
          const found = findFirstLeaf(n.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findFirstLeaf(firstTree);
  }, [trees, activeDirection]);

  const currentSelectedId = selectedId ?? defaultSelected;

  const selectedNode = useMemo(() => {
    if (!currentSelectedId) return null;
    return MOCK_KNOWLEDGE.find((k) => k.id === currentSelectedId) ?? null;
  }, [currentSelectedId]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const cycleStatus = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const current = (statusMap[id] ?? 'not_started') as KnowledgeStatus;
      const order: KnowledgeStatus[] = ['not_started', 'learning', 'mastered'];
      const idx = order.indexOf(current);
      const next = order[(idx + 1) % order.length];
      setStatus(id, next);
    },
    [statusMap, setStatus]
  );

  // 搜索过滤
  const filteredTrees = useMemo(() => {
    if (!searchKeyword.trim()) return trees[activeDirection];

    const keyword = searchKeyword.toLowerCase();
    const filterTree = (nodes: TreeNode[]): TreeNode[] => {
      return nodes
        .map((node) => {
          const children = filterTree(node.children);
          const matchSelf = node.name.toLowerCase().includes(keyword);
          const matchChildren = children.length > 0;
          if (matchSelf || matchChildren) {
            return { ...node, children };
          }
          return null;
        })
        .filter((n): n is TreeNode => n !== null);
    };
    return filterTree(trees[activeDirection]);
  }, [trees, activeDirection, searchKeyword]);

  // 方向切换时自动展开第一层
  const handleTabChange = (dir: string) => {
    setActiveDirection(dir);
    setSelectedId(null);
    // 自动展开根节点
    const rootIds = trees[dir].map((n) => n.id);
    setExpandedIds(new Set(rootIds));
  };

  const StatusIcon = ({ status }: { status: KnowledgeStatus }) => {
    if (status === 'mastered')
      return <CheckCircle2 className="size-4 text-emerald-400" />;
    if (status === 'learning')
      return <Clock className="size-4 text-amber-400" />;
    return <Circle className="size-4 text-muted-foreground/40" />;
  };

  const renderTreeNode = (node: TreeNode, level: number) => {
    const isExpanded = expandedIds.has(node.id);
    const hasChildren = node.children.length > 0;
    const isLeaf = !hasChildren && node.keyPoints.length > 0;
    const status = (statusMap[node.id] ?? 'not_started') as KnowledgeStatus;
    const isSelected = currentSelectedId === node.id;

    return (
      <div key={node.id}>
        <div
          className={cn(
            'flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer transition-all group border border-transparent',
            isSelected && isLeaf
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
              : 'hover:bg-muted/40 hover:text-foreground'
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(node.id);
            } else if (isLeaf) {
              setSelectedId(node.id);
            }
          }}
        >
          {hasChildren ? (
            <button
              className="size-4 shrink-0 text-muted-foreground/60 hover:text-cyan-400 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>
          ) : (
            <Database className="size-3.5 shrink-0 text-muted-foreground/40" />
          )}
          <span className="flex-1 text-sm truncate">{node.name}</span>
          {isLeaf && (
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              onClick={(e) => cycleStatus(node.id, e)}
              title={`点击切换: ${STATUS_LABELS[status]}`}
            >
              <StatusIcon status={status} />
            </button>
          )}
          {!isLeaf && (
            <Badge
              variant="outline"
              className="text-[10px] h-5 px-1.5 shrink-0 border-border/50 text-muted-foreground"
            >
              {node.children.length}
            </Badge>
          )}
        </div>
        {hasChildren && isExpanded && (
          <AnimatePresence>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {node.children.map((child) => renderTreeNode(child, level + 1))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  };

  const colors = DIRECTION_COLORS[activeDirection];

  return (
    <div className="space-y-3">
      <Tabs value={activeDirection} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-4 w-full max-w-md bg-muted/30">
          {DIRECTIONS.map((d) => (
            <TabsTrigger key={d} value={d} className="data-[state=active]:shadow-[0_0_12px_rgba(0_229_255_0.3)]">
              {DIRECTION_LABELS[d]}
            </TabsTrigger>
          ))}
        </TabsList>

        {DIRECTIONS.map((d) => (
          <TabsContent key={d} value={d} className="mt-4">
            <div className="grid grid-cols-1 gap-3">
              {/* 知识点树 */}
              <Card className="border-cyan-500/10">
                <CardHeader className="pb-3">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="搜索知识点"
                      className="pl-9 bg-input/50"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0 max-h-64 overflow-y-auto cyber-scroll">
                  {filteredTrees.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      未找到匹配的知识点
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {filteredTrees.map((node) => renderTreeNode(node, 0))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 详情面板 */}
              <Card className="border-purple-500/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
                {selectedNode && selectedNode.keyPoints.length > 0 ? (
                  <>
                    <CardHeader className="relative pb-2">
                      <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <span className="text-cyan-400">▸</span>
                          {selectedNode.name}
                        </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={colors.bg + ' ' + colors.text + ' border-transparent'}>
                              {DIRECTION_LABELS[selectedNode.direction]}
                            </Badge>
                            <Badge
                              variant="outline"
                              onClick={(e) => cycleStatus(selectedNode.id, e)}
                              className="cursor-pointer hover:bg-muted/50 transition-colors"
                            >
                              {STATUS_LABELS[
                                (statusMap[selectedNode.id] ??
                                  'not_started') as KnowledgeStatus
                              ]}
                            </Badge>
                            <span className="ml-auto text-[10px] font-mono-data text-muted-foreground/60">
                              NODE_{selectedNode.id.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 relative pt-2">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Lightbulb className="size-4 text-amber-400" />
                          核心要点
                          <span className="ml-auto text-[10px] font-mono-data text-muted-foreground/60">
                            KEY POINTS
                          </span>
                        </h3>
                        <ul className="space-y-2">
                          {selectedNode.keyPoints.map((point, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: i * 0.05,
                              }}
                              className="flex items-start gap-3 text-sm text-foreground/90 pl-2 border-l-2 border-cyan-500/30"
                            >
                              <span className="text-cyan-400 font-mono-data text-xs shrink-0 mt-0.5">
                                [{i + 1}]
                              </span>
                              <span className="flex-1 leading-relaxed">{point}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {selectedNode.tips && (
                        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
                          <h3 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
                            <Lightbulb className="size-4" />
                            学习提示
                          </h3>
                          <p className="text-sm text-amber-200/80">
                            {selectedNode.tips}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-2">
                        <span className="text-sm text-muted-foreground">
                          掌握状态：
                        </span>
                        {(['not_started', 'learning', 'mastered'] as const).map(
                          (s) => (
                            <Button
                              key={s}
                              variant={
                                (statusMap[selectedNode.id] ??
                                  'not_started') === s
                                  ? 'default'
                                  : 'outline'
                              }
                              size="sm"
                              onClick={() => setStatus(selectedNode.id, s)}
                              className={
                                (statusMap[selectedNode.id] ??
                                  'not_started') === s
                                  ? ''
                                  : 'border-border/50 hover:border-cyan-500/30'
                              }
                            >
                              {STATUS_LABELS[s]}
                            </Button>
                          )
                        )}
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="py-12 text-center">
                    <div className="text-muted-foreground">
                      请选择左侧具体知识点查看详情
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
