import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  BarChart3,
  Clock,
  Target,
  CheckCircle2,
  Brain,
  Activity,
  Zap,
} from 'lucide-react';
import { MOCK_KNOWLEDGE } from '@/data/knowledge';
import {
  useKnowledgeStatus,
  useQuizRecords,
  useStudyPlan,
  useStudyTime,
} from '@/hooks/use-storage';
import {
  DIRECTION_LABELS,
  DIRECTION_COLORS,
  DIRECTIONS,
  cn,
} from '@/lib/utils';
import {
  CHART_COLORS,
  CHART_BG,
  CHART_TEXT_COLOR as CHART_TEXT,
  CHART_GRID_COLOR as CHART_GRID,
  CHART_TOOLTIP_BG,
} from '@/lib/chart-colors';

export default function StatisticsPage() {
  const { statusMap } = useKnowledgeStatus();
  const { records } = useQuizRecords();
  const { plan } = useStudyPlan();
  const { studyTime } = useStudyTime();

  // 学习时长转数组
  const dailyRecords = useMemo(() => {
    return Object.entries(studyTime).map(([date, minutes]) => ({ date, minutes }));
  }, [studyTime]);

  const totalMinutes = useMemo(() => {
    return Object.values(studyTime).reduce((sum, m) => sum + m, 0);
  }, [studyTime]);
  const [period, setPeriod] = useState<'7d' | '30d' | 'all'>('7d');

  // 各方向掌握度数据
  const directionMastery = useMemo(() => {
    return DIRECTIONS.map((dir) => {
      const dirNodes = MOCK_KNOWLEDGE.filter(
        (k) => k.direction === dir && k.keyPoints.length > 0
      );
      const total = dirNodes.length;
      const mastered = dirNodes.filter(
        (n) => statusMap[n.id] === 'mastered'
      ).length;
      const learning = dirNodes.filter(
        (n) => statusMap[n.id] === 'learning'
      ).length;
      const notStarted = total - mastered - learning;
      const pct =
        total > 0
          ? Math.round(((mastered + learning * 0.5) / total) * 100)
          : 0;
      return { dir, total, mastered, learning, notStarted, pct };
    });
  }, [statusMap]);

  // 按周期筛选学习时长
  const filteredTimeRecords = useMemo(() => {
    const sorted = [...dailyRecords].sort((a, b) => a.date.localeCompare(b.date));
    if (period === 'all') return sorted;
    const days = period === '7d' ? 7 : 30;
    return sorted.slice(-days);
  }, [dailyRecords, period]);

  // 学习时长柱状图
  const studyTimeOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      grid: {
        top: 30,
        right: 20,
        bottom: 30,
        left: 50,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: CHART_TOOLTIP_BG,
        borderColor: 'rgba(0,229,255,0.3)',
        textStyle: { color: CHART_TEXT },
        axisPointer: {
          type: 'shadow',
          shadowStyle: { color: 'rgba(0,229,255,0.05)' },
        },
        formatter: (params: any[]) => {
          const p = params[0];
          return `${p.axisValue}<br/>⏱ 学习时长：<b>${p.value}</b> 分钟`;
        },
      },
      xAxis: {
        type: 'category',
        data: filteredTimeRecords.map((r) =>
          r.date.slice(5)
        ),
        axisLine: { lineStyle: { color: CHART_GRID } },
        axisLabel: {
          color: CHART_TEXT,
          fontSize: 11,
          fontFamily: 'JetBrains Mono, monospace',
        },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        name: '分钟',
        nameTextStyle: { color: CHART_TEXT, fontSize: 11 },
        axisLine: { show: false },
        axisLabel: {
          color: CHART_TEXT,
          fontSize: 11,
          fontFamily: 'JetBrains Mono, monospace',
        },
        splitLine: { lineStyle: { color: CHART_GRID, type: 'dashed' } },
      },
      series: [
        {
          type: 'bar',
          data: filteredTimeRecords.map((r) => r.minutes),
          barWidth: '55%',
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: CHART_COLORS[0] },
                { offset: 1, color: 'rgba(0,229,255,0.2)' },
              ],
            },
            shadowBlur: 8,
            shadowColor: 'rgba(0,229,255,0.3)',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 16,
              shadowColor: 'rgba(0,229,255,0.5)',
            },
          },
        },
      ],
    };
  }, [filteredTimeRecords]);

  // 各方向掌握度雷达图
  const radarOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        backgroundColor: CHART_TOOLTIP_BG,
        borderColor: 'rgba(181,123,255,0.3)',
        textStyle: { color: CHART_TEXT },
      },
      radar: {
        indicator: DIRECTIONS.map((d) => ({
          name: DIRECTION_LABELS[d],
          max: 100,
        })),
        shape: 'polygon',
        splitNumber: 4,
        axisName: {
          color: CHART_TEXT,
          fontSize: 12,
          fontWeight: 500,
        },
        splitLine: { lineStyle: { color: CHART_GRID } },
        splitArea: {
          areaStyle: {
            color: ['rgba(0,229,255,0.02)', 'rgba(181,123,255,0.02)'],
          },
        },
        axisLine: { lineStyle: { color: CHART_GRID } },
      },
      series: [
        {
          type: 'radar',
          symbol: 'circle',
          symbolSize: 8,
          data: [
            {
              value: directionMastery.map((d) => d.pct),
              name: '掌握度',
              areaStyle: {
                color: {
                  type: 'radial',
                  x: 0.5, y: 0.5, r: 0.8,
                  colorStops: [
                    { offset: 0, color: 'rgba(0,229,255,0.3)' },
                    { offset: 1, color: 'rgba(181,123,255,0.1)' },
                  ],
                },
              },
              lineStyle: {
                color: CHART_COLORS[0],
                width: 2,
                shadowBlur: 8,
                shadowColor: 'rgba(0,229,255,0.5)',
              },
              itemStyle: {
                color: CHART_COLORS[0],
                borderColor: CHART_COLORS[1],
                borderWidth: 2,
                shadowBlur: 8,
                shadowColor: 'rgba(0,229,255,0.6)',
              },
            },
          ],
        },
      ],
    };
  }, [directionMastery]);

  // 正确率趋势（按方向）
  const accuracyByDirection = useMemo(() => {
    return DIRECTIONS.map((dir) => {
      const data = records.byDirection[dir];
      return data && data.total > 0
        ? Math.round((data.correct / data.total) * 100)
        : 0;
    });
  }, [records.byDirection]);

  const accuracyBarOption = useMemo(() => {
    const colors = [
      CHART_COLORS[0],
      CHART_COLORS[1],
      CHART_COLORS[2],
      CHART_COLORS[3],
    ];
    return {
      backgroundColor: 'transparent',
      grid: {
        top: 20,
        right: 30,
        bottom: 20,
        left: 70,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: CHART_TOOLTIP_BG,
        borderColor: 'rgba(46,230,166,0.3)',
        textStyle: { color: CHART_TEXT },
        axisPointer: { type: 'shadow' },
        formatter: (params: any[]) => {
          const p = params[0];
          return `${p.name}<br/>📊 正确率：<b>${p.value}%</b>`;
        },
      },
      xAxis: {
        type: 'value',
        max: 100,
        axisLabel: {
          formatter: '{value}%',
          color: CHART_TEXT,
          fontSize: 11,
          fontFamily: 'JetBrains Mono, monospace',
        },
        splitLine: { lineStyle: { color: CHART_GRID, type: 'dashed' } },
        axisLine: { show: false },
      },
      yAxis: {
        type: 'category',
        data: DIRECTIONS.map((d) => DIRECTION_LABELS[d]),
        axisLine: { lineStyle: { color: CHART_GRID } },
        axisLabel: {
          color: CHART_TEXT,
          fontSize: 12,
        },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: accuracyByDirection.map((v, i) => ({
            value: v,
            itemStyle: {
              borderRadius: [0, 6, 6, 0],
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 0,
                colorStops: [
                  { offset: 0, color: colors[i] + '40' },
                  { offset: 1, color: colors[i] },
                ],
              },
              shadowBlur: 6,
              shadowColor: colors[i] + '60',
            },
          })),
          barWidth: 18,
          label: {
            show: true,
            position: 'right',
            color: CHART_TEXT,
            fontSize: 12,
            fontWeight: 600,
            formatter: '{c}%',
            fontFamily: 'JetBrains Mono, monospace',
          },
        },
      ],
    };
  }, [accuracyByDirection]);

  // 掌握状态饼图
  const masteryPieOption = useMemo(() => {
    const mastered = Object.values(statusMap).filter((s) => s === 'mastered')
      .length;
    const learning = Object.values(statusMap).filter((s) => s === 'learning')
      .length;
    const notStarted =
      MOCK_KNOWLEDGE.filter((k) => k.keyPoints.length > 0).length -
      mastered -
      learning;

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: CHART_TOOLTIP_BG,
        borderColor: 'rgba(0,229,255,0.3)',
        textStyle: { color: CHART_TEXT },
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        bottom: 0,
        textStyle: { color: CHART_TEXT, fontSize: 12 },
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
      },
      series: [
        {
          type: 'pie',
          radius: ['55%', '75%'],
          center: ['50%', '42%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderColor: CHART_BG,
            borderWidth: 2,
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
              color: CHART_TEXT,
            },
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0,229,255,0.5)',
            },
          },
          data: [
            {
              value: mastered,
              name: '已掌握',
              itemStyle: {
                color: CHART_COLORS[3],
                shadowBlur: 8,
                shadowColor: CHART_COLORS[3] + '80',
              },
            },
            {
              value: learning,
              name: '学习中',
              itemStyle: {
                color: CHART_COLORS[0],
                shadowBlur: 8,
                shadowColor: CHART_COLORS[0] + '80',
              },
            },
            {
              value: notStarted,
              name: '未学习',
              itemStyle: { color: 'rgba(100, 116, 139, 0.4)' },
            },
          ],
        },
      ],
    };
  }, [statusMap]);

  const totalAccuracy =
    records.totalCount > 0
      ? Math.round((records.correctCount / records.totalCount) * 100)
      : 0;

  const avgDailyMinutes =
    filteredTimeRecords.length > 0
      ? Math.round(
          filteredTimeRecords.reduce((sum, r) => sum + r.minutes, 0) /
            filteredTimeRecords.length
        )
      : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-mono-data">
          学习数据分析
        </span>
        <Select value={period} onValueChange={(v) => setPeriod(v as '7d' | '30d' | 'all')}>
          <SelectTrigger className="w-[120px] h-8 border-cyan-500/20 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">近 7 天</SelectItem>
            <SelectItem value="30d">近 30 天</SelectItem>
            <SelectItem value="all">全部</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 gap-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0 }}
        >
          <Card className="border-cyan-500/10 h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            <CardContent className="py-3 px-3 relative">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                <Clock className="size-4 text-cyan-400" />
                累计学习时长
              </div>
              <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-cyan-400 tabular-nums font-mono-data text-glow-cyan">
                  {totalMinutes}
                </span>
                <span className="text-xs text-muted-foreground">分钟</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2 font-mono-data">
                ≈ {Math.round(totalMinutes / 60 * 10) / 10} 小时
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <Card className="border-emerald-500/10 h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <CardContent className="py-3 px-3 relative">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                <Target className="size-4 text-emerald-400" />
                刷题正确率
              </div>
              <div className="flex items-baseline gap-1">
                  <span
                    className="text-2xl font-bold text-emerald-400 tabular-nums font-mono-data"
                    style={{ textShadow: '0 0 10px rgba(46,230,166,0.5)' }}
                  >
                  {totalAccuracy}
                </span>
                <span className="text-xs text-muted-foreground">%</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2 font-mono-data">
                {records.correctCount}/{records.totalCount} 题
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-purple-500/10 h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            <CardContent className="py-3 px-3 relative">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                <Brain className="size-4 text-purple-400" />
                知识点掌握
              </div>
              <div className="flex items-baseline gap-1">
                  <span
                    className="text-2xl font-bold text-purple-400 tabular-nums font-mono-data"
                    style={{ textShadow: '0 0 10px rgba(181,123,255,0.5)' }}
                  >
                  {Object.values(statusMap).filter((s) => s === 'mastered').length}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {MOCK_KNOWLEDGE.filter((k) => k.keyPoints.length > 0).length}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-2 font-mono-data">
                已掌握 / 总知识点
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="border-amber-500/10 h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            <CardContent className="py-3 px-3 relative">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                <Activity className="size-4 text-amber-400" />
                日均学习
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-amber-400 tabular-nums font-mono-data" style={{ textShadow: '0 0 10px rgba(255,195,113,0.5)' }}>
                  {avgDailyMinutes}
                </span>
                <span className="text-xs text-muted-foreground">分钟/天</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2 font-mono-data">
                共 {filteredTimeRecords.length} 天
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 图表区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 学习时长趋势 */}
        <Card className="lg:col-span-2 border-cyan-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="size-5 text-cyan-400" />
              学习时长趋势
              <span className="ml-auto text-[10px] font-mono-data text-muted-foreground/60 tracking-widest">
                STUDY TIME TREND
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReactECharts
              option={studyTimeOption}
              style={{ height: '280px' }}
              opts={{ renderer: 'svg' }}
            />
          </CardContent>
        </Card>

        {/* 掌握度雷达 */}
        <Card className="border-purple-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="size-5 text-purple-400" />
              四方向掌握度
              <span className="ml-auto text-[10px] font-mono-data text-muted-foreground/60 tracking-widest">
                MASTERY RADAR
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReactECharts
              option={radarOption}
              style={{ height: '280px' }}
              opts={{ renderer: 'svg' }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 正确率对比 */}
        <Card className="lg:col-span-2 border-emerald-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="size-5 text-emerald-400" />
              各方向刷题正确率
              <span className="ml-auto text-[10px] font-mono-data text-muted-foreground/60 tracking-widest">
                ACCURACY BY MODULE
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReactECharts
              option={accuracyBarOption}
              style={{ height: '260px' }}
              opts={{ renderer: 'svg' }}
            />
          </CardContent>
        </Card>

        {/* 掌握状态分布 */}
        <Card className="border-rose-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="size-5 text-rose-400" />
              掌握状态分布
              <span className="ml-auto text-[10px] font-mono-data text-muted-foreground/60 tracking-widest">
                STATUS DISTRIB
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReactECharts
              option={masteryPieOption}
              style={{ height: '260px' }}
              opts={{ renderer: 'svg' }}
            />
          </CardContent>
        </Card>
      </div>

      {/* 各方向详情 */}
      <Card className="border-cyan-500/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="size-5 text-cyan-400" />
            各方向学习详情
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {directionMastery.map((item, i) => {
              const colors = DIRECTION_COLORS[item.dir];
              return (
                <motion.div
                  key={item.dir}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-4 rounded-lg border border-border/40 bg-muted/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'size-8 rounded-lg flex items-center justify-center border',
                          colors.bg,
                          'border-transparent'
                        )}
                      >
                        <span className="text-sm font-bold" style={{ color: 'inherit' }}>
                          {i + 1}
                        </span>
                      </div>
                      <span className="font-semibold text-foreground">
                        {DIRECTION_LABELS[item.dir]}
                      </span>
                    </div>
                    <span className="text-xl font-bold tabular-nums font-mono-data" style={{ color: 'inherit' }}>
                      {item.pct}%
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full bg-muted/40 overflow-hidden mb-3">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full flow-gradient"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <Badge
                      className={
                        'text-xs h-5 px-1.5 bg-emerald-500/15 text-emerald-400 border-transparent'
                      }
                    >
                      已掌握 {item.mastered}
                    </Badge>
                    <Badge
                      className={
                        'text-xs h-5 px-1.5 bg-cyan-500/15 text-cyan-400 border-transparent'
                      }
                    >
                      学习中 {item.learning}
                    </Badge>
                    <Badge
                      className={
                        'text-xs h-5 px-1.5 bg-muted/40 text-muted-foreground border-transparent'
                      }
                    >
                      未学 {item.notStarted}
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
