import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Download,
  Upload,
  Users,
  Trash2,
  Database,
  ShieldAlert,
  WifiOff,
  CheckCircle2,
} from 'lucide-react';
import {
  exportBackup,
  importBackup,
  directionAccuracyFromBackup,
  useQuizRecords,
  type IBackup,
} from '@/hooks/use-storage';
import { DIRECTION_LABELS, DIRECTION_COLORS, cn } from '@/lib/utils';

interface IMember {
  name: string;
  acc: Record<string, number>;
  total: number;
  accuracy: number;
}

const TEAM_TARGET = 80; // 团队弱项阈值：低于该正确率视为短板

export default function SettingsPage() {
  const { records } = useQuizRecords();
  const fileRef = useRef<HTMLInputElement>(null);
  const teamFileRef = useRef<HTMLInputElement>(null);
  const [owner, setOwner] = useState('');
  const [members, setMembers] = useState<IMember[]>([]);

  const accuracy =
    records.totalCount > 0
      ? Math.round((records.correctCount / records.totalCount) * 100)
      : 0;

  // ---------- 备份导出 ----------
  const handleExport = () => {
    const backup = exportBackup(owner.trim() || undefined);
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ict-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('备份已导出');
  };

  // ---------- 备份导入 ----------
  const readJson = (file: File): Promise<IBackup> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          resolve(JSON.parse(String(reader.result)) as IBackup);
        } catch {
          reject(new Error('不是有效的 JSON 文件'));
        }
      };
      reader.onerror = () => reject(new Error('读取文件失败'));
      reader.readAsText(file);
    });

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const backup = await readJson(file);
      importBackup(backup, 'replace');
      toast.success('备份已导入，正在刷新…');
      setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '导入失败');
    } finally {
      e.target.value = '';
    }
  };

  // ---------- 团队成员导入 ----------
  const handleAddMember = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const backup = await readJson(file);
      const info = directionAccuracyFromBackup(backup);
      const acc =
        info.totalCount > 0
          ? Math.round((info.correctCount / info.totalCount) * 100)
          : 0;
      setMembers((prev) => [
        ...prev.filter((m) => m.name !== (backup.owner || file.name)),
        {
          name: backup.owner || file.name.replace('.json', ''),
          acc: info.byDirection,
          total: info.totalCount,
          accuracy: acc,
        },
      ]);
      toast.success(`已载入 ${backup.owner || file.name}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '解析失败');
    } finally {
      e.target.value = '';
    }
  };

  // ---------- 清空 ----------
  const handleClear = () => {
    if (!window.confirm('确定清空本机全部学习数据？此操作不可恢复，建议先导出备份。')) {
      return;
    }
    Object.keys(localStorage)
      .filter((k) => k.startsWith('__app_huawei_ict_'))
      .forEach((k) => localStorage.removeItem(k));
    toast.success('已清空，正在刷新…');
    setTimeout(() => window.location.reload(), 600);
  };

  // ---------- 团队共同弱项 ----------
  const weakDirections = ['datacom', 'dcn', 'security', 'wlan'].filter((d) => {
    if (members.length < 2) return false;
    return members.every((m) => (m.acc[d] ?? 0) < TEAM_TARGET);
  });

  return (
    <div className="space-y-3">
      {/* 数据备份 */}
      <Card className="border-cyan-500/15">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="size-4 text-cyan-400" />
            数据备份
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-muted/20 py-2">
              <div className="text-sm font-bold font-mono-data text-cyan-400">
                {records.totalCount}
              </div>
              <div className="text-[10px] text-muted-foreground">已做题目</div>
            </div>
            <div className="rounded-lg bg-muted/20 py-2">
              <div className="text-sm font-bold font-mono-data text-emerald-400">
                {accuracy}%
              </div>
              <div className="text-[10px] text-muted-foreground">首刷正确率</div>
            </div>
            <div className="rounded-lg bg-muted/20 py-2">
              <div className="text-sm font-bold font-mono-data text-rose-400">
                {records.wrongIds.length}
              </div>
              <div className="text-[10px] text-muted-foreground">错题本</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              姓名（导出时写入备份，便于组队识别）
            </Label>
            <Input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="例如：张三"
              className="h-9"
            />
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleExport}>
              <Download className="size-4 mr-1" />
              导出备份
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => fileRef.current?.click()}>
              <Upload className="size-4 mr-1" />
              导入备份
            </Button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImport}
          />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            数据只存在本机浏览器。换手机、换浏览器、清理缓存都会丢失，<b className="text-amber-400">建议每周导出一次</b>。
          </p>
        </CardContent>
      </Card>

      {/* 团队对比 */}
      <Card className="border-purple-500/15">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="size-4 text-purple-400" />
            团队弱项对比
            <span className="ml-auto text-[10px] font-mono-data text-muted-foreground">
              {members.length}/3 人
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            省赛是 3 人团队赛，合计 3000 分。让每位队友各自导出备份发给你，导入后即可看到
            <b className="text-purple-300">三人共同的弱项方向</b> —— 那才是队伍真正的失分点。
          </p>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => teamFileRef.current?.click()}
            disabled={members.length >= 3}
          >
            <Upload className="size-4 mr-1" />
            导入队友备份（{members.length}/3）
          </Button>
          <input
            ref={teamFileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleAddMember}
          />

          {members.length > 0 && (
            <div className="space-y-2">
              {members.map((m) => (
                <div key={m.name} className="rounded-lg border border-border/40 p-2.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-medium">{m.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono-data">
                      {m.total} 题
                    </span>
                    <span
                      className={cn(
                        'ml-auto text-xs font-bold font-mono-data',
                        m.accuracy >= 85
                          ? 'text-emerald-400'
                          : m.accuracy >= 70
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      )}
                    >
                      {m.accuracy}%
                    </span>
                    <button
                      className="text-muted-foreground/60 hover:text-rose-400"
                      onClick={() => setMembers((prev) => prev.filter((x) => x.name !== m.name))}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['datacom', 'dcn', 'security', 'wlan'].map((d) => {
                      const v = m.acc[d] ?? 0;
                      return (
                        <div key={d} className="text-center">
                          <div className="text-[9px] text-muted-foreground">
                            {DIRECTION_LABELS[d]}
                          </div>
                          <div
                            className={cn(
                              'text-[11px] font-mono-data font-bold',
                              v >= TEAM_TARGET
                                ? 'text-emerald-400'
                                : v > 0
                                ? 'text-rose-400'
                                : 'text-muted-foreground/50'
                            )}
                          >
                            {v > 0 ? `${v}%` : '—'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {weakDirections.length > 0 && (
                <div className="rounded-lg border border-rose-500/25 bg-rose-500/5 p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ShieldAlert className="size-3.5 text-rose-400" />
                    <span className="text-xs font-semibold text-rose-300">
                      全队共同弱项（均低于 {TEAM_TARGET}%）
                    </span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {weakDirections.map((d) => (
                      <Badge
                        key={d}
                        className={cn(
                          'text-[10px] border-transparent',
                          DIRECTION_COLORS[d].bg,
                          DIRECTION_COLORS[d].text
                        )}
                      >
                        {DIRECTION_LABELS[d]}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    这三方向建议优先集体补强，团队总分提升最快。
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 离线与说明 */}
      <Card className="border-emerald-500/15">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <WifiOff className="size-4 text-emerald-400" />
            离线使用
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-[11px] text-muted-foreground leading-relaxed">
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              已开启 Service Worker，断网也能刷题。首次打开后请把页面
              <b className="text-emerald-300">添加到主屏幕</b>。
            </span>
          </div>
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>所有数据保存在浏览器本地，不上传服务器。</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-rose-500/15">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-rose-400">
            <Trash2 className="size-4" />
            危险操作
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" className="w-full" onClick={handleClear}>
            清空本机全部学习数据
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
