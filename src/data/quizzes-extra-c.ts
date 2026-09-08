// EXPORTS: EXTRA_QUIZZES_C
// 薄弱知识点补题：BGP4+（原 0 题）+ 10 个仅 1~2 题的叶子知识点
// difficulty: IA=HCIA 初赛难度, IP=HCIP 复赛难度, IE=HCIE 高阶
import type { IQuizQuestion } from './quizzes';

export const EXTRA_QUIZZES_C: IQuizQuestion[] = [
  // ==================== BGP4+（IPv6 骨干核心，原 0 题）====================
  {
    id: 'g-bgp4p-01', type: 'single', difficulty: 'IP',
    question: 'BGP4+ 通过哪个路径属性来携带 IPv6 可达路由信息？',
    options: ['MP_REACH_NLRI', 'MP_UNREACH_NLRI', '传统的 NEXT_HOP 属性', 'AS_PATH'],
    answer: 'MP_REACH_NLRI',
    explanation: 'BGP4+ 是 BGP-4 的多协议扩展（MP-BGP，RFC 4760），它定义了两个新的可选非过渡属性：MP_REACH_NLRI 用于通告可达路由（携带地址族信息、IPv6 下一跳与 NLRI 前缀），MP_UNREACH_NLRI 用于撤销路由。传统 NEXT_HOP 属性长度仅 4 字节，无法承载 16 字节的 IPv6 地址，因此 IPv6 下一跳必须封装在 MP_REACH_NLRI 内部，这是 BGP4+ 最关键的改动点。AS_PATH 仍用于防环，但不负责携带地址族信息。',
    knowledgeId: 'datacom-bgp4plus', direction: 'datacom',
  },
  {
    id: 'g-bgp4p-02', type: 'single', difficulty: 'IP',
    question: 'BGP4+ 中 IPv6 路由的下一跳地址通过什么方式携带？',
    options: [
      '封装在 MP_REACH_NLRI 属性的 Next Hop 字段中',
      '仍使用传统 NEXT_HOP 属性，只是长度扩展',
      '通过 AS_PATH 属性隐式推导',
      '通过 Route Reflector 的 Cluster List 携带',
    ],
    answer: '封装在 MP_REACH_NLRI 属性的 Next Hop 字段中',
    explanation: '由于 IPv6 地址为 128 位（16 字节），远超传统 NEXT_HOP 属性的承载能力，BGP4+ 将下一跳放入 MP_REACH_NLRI 属性内部（该属性可同时携带一个或多个下一跳地址）。这也是为什么在 IPv6 环境中查看 BGP 路由表时，下一跳信息与传统 IPv4 BGP 路由的显示与处理方式有所不同。配置与排错时需特别注意地址族视图下的下一跳策略。',
    knowledgeId: 'datacom-bgp4plus', direction: 'datacom',
  },
  {
    id: 'g-bgp4p-03', type: 'multiple', difficulty: 'IP',
    question: '关于 BGP4+ 邻居建立，以下说法正确的是？',
    options: [
      '可以使用 IPv4 地址建立邻居，同时通告 IPv6 路由',
      '可以直接使用 IPv6 地址建立邻居',
      '无论用哪种地址建邻，BGP Router ID 仍是 32 位点分十进制',
      'BGP4+ 邻居的 Router ID 必须配置为 IPv6 地址',
    ],
    answer: [
      '可以使用 IPv4 地址建立邻居，同时通告 IPv6 路由',
      '可以直接使用 IPv6 地址建立邻居',
      '无论用哪种地址建邻，BGP Router ID 仍是 32 位点分十进制',
    ],
    explanation: 'BGP4+ 支持跨协议建邻：可用 IPv4 地址建立 TCP 会话，并在 ipv6-family 视图下通告 IPv6 路由，这是 IPv4/IPv6 过渡期的常见部署方式；也可直接使用 IPv6 地址建立邻居。关键易错点是 Router ID——它在 BGP 中始终是 32 位的点分十进制标识，用于防环和路径选择，不会因为运行 IPv6 而变成 IPv6 地址，因此 D 错。',
    knowledgeId: 'datacom-bgp4plus', direction: 'datacom',
  },
  {
    id: 'g-bgp4p-04', type: 'multiple', difficulty: 'IP',
    question: '关于 MP-BGP（BGP4+ 的技术基础），以下描述正确的是？',
    options: [
      '可以同时在同一个 BGP 会话中承载 IPv4 与 IPv6 路由',
      '通过 AFI（地址族标识）与 SAFI（子地址族标识）区分不同的网络层协议',
      '每个地址族独立维护路由表与路由策略',
      'MP-BGP 只能用于纯 IPv6 网络，无法与 IPv4 共存',
    ],
    answer: [
      '可以同时在同一个 BGP 会话中承载 IPv4 与 IPv6 路由',
      '通过 AFI（地址族标识）与 SAFI（子地址族标识）区分不同的网络层协议',
      '每个地址族独立维护路由表与路由策略',
    ],
    explanation: 'MP-BGP 的核心价值是"一套会话、多套地址族"：AFI=2 表示 IPv6、AFI=1 表示 IPv4，SAFI 进一步区分单播/组播/VPN 等。各地址族拥有独立的路由表与策略，互不干扰，这样一个 TCP 会话即可同时传递 IPv4 与 IPv6 路由，大幅降低运维复杂度。D 明显错误，MP-BGP 设计的初衷正是支持多协议共存与平滑演进。',
    knowledgeId: 'datacom-bgp4plus', direction: 'datacom',
  },
  {
    id: 'g-bgp4p-05', type: 'single', difficulty: 'IP',
    question: '在华为设备上配置 BGP4+ 时，激活 IPv6 邻居的正确操作位置是？',
    options: [
      '在 BGP 的 IPv6 地址族视图（ipv6-family unicast）下执行 peer enable',
      '在 BGP 全局视图下执行 peer enable 即可',
      '在接口视图下执行 bgp enable',
      '无需任何配置，建立 IPv6 邻居后自动生效',
    ],
    answer: '在 BGP 的 IPv6 地址族视图（ipv6-family unicast）下执行 peer enable',
    explanation: '华为设备的标准配置流程为：bgp <as> → peer <ipv6-addr> as-number <as> → ipv6-family unicast → peer <ipv6-addr> enable。关键易错点是"必须在地址族视图下 enable"——仅指定 peer 而未在 ipv6-family 下激活，BGP 不会与该邻居交换任何 IPv6 路由，这是实验与排错中的高频考点，也是面试官常问的"邻居起来了但没路由"的典型原因。',
    knowledgeId: 'datacom-bgp4plus', direction: 'datacom',
  },
  {
    id: 'g-bgp4p-06', type: 'single', difficulty: 'IA',
    question: '在 IPv6 骨干网络中，BGP4+ 主要解决的问题是？',
    options: [
      '自治系统之间的 IPv6 路由传递',
      '同一自治系统内部的 IPv6 路由发现',
      'IPv6 地址的自动配置',
      'IPv6 主机的邻居发现',
    ],
    answer: '自治系统之间的 IPv6 路由传递',
    explanation: '路由协议按作用范围分工：AS 内部使用 IGP（OSPFv3、IS-IS for IPv6、RIPng）负责内部路由发现与计算；AS 之间使用 EGP，即 BGP4+，负责在运营商或大型网络之间传递 IPv6 路由并实施路由策略。IPv6 地址自动配置依赖 NDP/SLAAC，邻居发现由 ICMPv6 的 NS/NA 完成，均与 BGP4+ 无关。',
    knowledgeId: 'datacom-bgp4plus', direction: 'datacom',
  },
  {
    id: 'g-bgp4p-07', type: 'multiple', difficulty: 'IP',
    question: '关于 BGP4+ 与 BGP-4 的关系，以下说法正确的是？',
    options: [
      'BGP4+ 是 BGP-4 的多协议扩展，向后兼容',
      'BGP4+ 沿用了 BGP-4 的 AS_PATH、Local_Pref、MED 等属性与选路规则',
      'BGP4+ 的 Open 消息中需要通告自身支持的多协议扩展能力',
      'BGP4+ 与 BGP-4 是两个完全独立、互不兼容的协议',
    ],
    answer: [
      'BGP4+ 是 BGP-4 的多协议扩展，向后兼容',
      'BGP4+ 沿用了 BGP-4 的 AS_PATH、Local_Pref、MED 等属性与选路规则',
      'BGP4+ 的 Open 消息中需要通告自身支持的多协议扩展能力',
    ],
    explanation: 'BGP4+ 不是新协议，而是在 BGP-4 基础上增加多协议能力的扩展：邻居建立时通过 Open 消息的能力协商（Capability Advertisement）声明支持哪些 AFI/SAFI，协商通过后才交换对应地址族的路由。核心机制（有限状态机、防环、13 条选路规则、AS_PATH/Local_Pref/MED/Community 等属性）全部沿用，因此 D 错。理解"扩展而非替代"是掌握 BGP4+ 的关键。',
    knowledgeId: 'datacom-bgp4plus', direction: 'datacom',
  },

  // ==================== 应用层协议（原 1 题）====================
  {
    id: 'g-app-01', type: 'single', difficulty: 'IA',
    question: '关于 DNS 的递归查询与迭代查询，以下描述正确的是？',
    options: [
      '递归查询中，DNS 服务器必须返回最终结果，查询压力集中在服务器侧',
      '迭代查询中，DNS 服务器必须返回最终结果',
      '递归查询由客户端自行依次查询各级域名服务器',
      '两种方式对服务器负载没有区别',
    ],
    answer: '递归查询中，DNS 服务器必须返回最终结果，查询压力集中在服务器侧',
    explanation: '递归查询：客户端向 DNS 服务器发起一次请求，服务器负责代为查询各级域名服务器并把最终结果（或失败）返回给客户端，客户端压力小、服务器压力大，常见于客户端到本地 DNS 服务器。迭代查询：服务器每次只返回"下一级服务器地址"，由查询方自行继续查询，常见于本地 DNS 服务器向根/顶级域/权威服务器查询的过程。实际网络中两者通常组合使用。',
    knowledgeId: 'datacom-application-layer', direction: 'datacom',
  },
  {
    id: 'g-app-02', type: 'multiple', difficulty: 'IA',
    question: '以下关于常见应用层协议与端口号的对应，正确的是？',
    options: [
      'DNS 使用 53（UDP 为主，区域传送使用 TCP）',
      'HTTPS 使用 443',
      'SSH 使用 22，Telnet 使用 23',
      'SMTP 使用 25，POP3 使用 110',
    ],
    answer: [
      'DNS 使用 53（UDP 为主，区域传送使用 TCP）',
      'HTTPS 使用 443',
      'SSH 使用 22，Telnet 使用 23',
      'SMTP 使用 25，POP3 使用 110',
    ],
    explanation: '传输层端口是高频考点：DNS 53（普通查询 UDP，超过 512 字节或区域传送走 TCP）、HTTP 80、HTTPS 443、FTP 控制 21/数据 20、SSH 22、Telnet 23、SMTP 25、POP3 110、IMAP 143、SNMP 161/162（Agent/Trap）、DHCP 67（服务器）/68（客户端）、BGP 179、RIP 520、OSPF 89（协议号而非端口）。建议按"安全替代明文"成对记忆：SSH 替代 Telnet、HTTPS 替代 HTTP、SFTP 替代 FTP。',
    knowledgeId: 'datacom-application-layer', direction: 'datacom',
  },

  // ==================== 链路聚合 Eth-Trunk（原 1 题）====================
  {
    id: 'g-la-01', type: 'single', difficulty: 'IP',
    question: 'LACP 模式下，Eth-Trunk 的主动端是如何选举出来的？',
    options: [
      '系统 LACP 优先级数值越小越优先，优先级相同时比较系统 MAC，越小越优先',
      '系统 LACP 优先级数值越大越优先',
      '接口编号最小的设备成为主动端',
      '由管理员手工指定，没有自动选举机制',
    ],
    answer: '系统 LACP 优先级数值越小越优先，优先级相同时比较系统 MAC，越小越优先',
    explanation: 'LACP 主动端选举规则：先比较系统 LACP 优先级（默认 32768，取值范围 0–65535），数值小者胜出；优先级相同则比较系统 MAC 地址，小者胜出。主动端负责决定哪些成员接口被选为活动接口，被动端跟随。这条规则与 STP 的根桥选举（桥优先级小者优先、MAC 小者优先）思路一致，可对比记忆。此外活动接口上限阈值也由主动端决定。',
    knowledgeId: 'datacom-link-aggregation', direction: 'datacom',
  },
  {
    id: 'g-la-02', type: 'multiple', difficulty: 'IP',
    question: '关于 Eth-Trunk 的负载分担方式，以下说法正确的是？',
    options: [
      '可以基于源 MAC、目的 MAC 进行分担',
      '可以基于源 IP、目的 IP 进行分担',
      '可以基于源目端口号进行分担',
      '负载分担是基于数据包的逐包分担',
    ],
    answer: [
      '可以基于源 MAC、目的 MAC 进行分担',
      '可以基于源 IP、目的 IP 进行分担',
      '可以基于源目端口号进行分担',
    ],
    explanation: 'Eth-Trunk 支持按流分担，哈希因子可为源/目的 MAC、源/目的 IP、源/目的端口号或组合，同一条流（相同哈希结果）固定走同一条成员链路，从而保证报文不乱序。D 错：逐包分担会导致同一会话的报文乱序到达，引发 TCP 重传等严重问题，因此 Eth-Trunk 不采用逐包分担。实际工程中 IP 场景下常用 src-dst-ip，需根据流量模型选择哈希因子以避免极化。',
    knowledgeId: 'datacom-link-aggregation', direction: 'datacom',
  },

  // ==================== 堆叠 iStack / CSS（原 1 题）====================
  {
    id: 'g-stk-01', type: 'single', difficulty: 'IP',
    question: '在 iStack 堆叠系统中，关于设备角色的描述正确的是？',
    options: [
      '系统中有且只有一台主交换机（Master），负责管理整个堆叠系统',
      '系统中有多台主交换机同时工作',
      '备份交换机（Backup）与从交换机（Slave）职责完全相同',
      '主交换机故障后，堆叠系统必须整机重启才能恢复',
    ],
    answer: '系统中有且只有一台主交换机（Master），负责管理整个堆叠系统',
    explanation: 'iStack 角色分为三种：Master（主，唯一，负责管理整个系统、维护配置与协议状态）、Backup（备，Master 的备份，Master 故障时优先升主）、Slave（从，仅负责转发）。B 错在"多台主"——主设备唯一是堆叠的基本约束；C 错在 Backup 承担热备份职责，与 Slave 不同；D 错在 Master 故障后由 Backup 快速接管，业务不中断，无需整机重启。',
    knowledgeId: 'datacom-stack', direction: 'datacom',
  },
  {
    id: 'g-stk-02', type: 'multiple', difficulty: 'IP',
    question: '堆叠系统发生分裂（Split）后，可能产生的后果与应对机制包括？',
    options: [
      '两部分都认为自己是主，出现"双主"导致网络冲突',
      '可通过 DAD（双主检测）的直连检测方式发现冲突',
      '可通过 DAD 的代理检测方式（借助上层设备）发现冲突',
      '堆叠分裂对网络没有任何影响，无需处理',
    ],
    answer: [
      '两部分都认为自己是主，出现"双主"导致网络冲突',
      '可通过 DAD（双主检测）的直连检测方式发现冲突',
      '可通过 DAD 的代理检测方式（借助上层设备）发现冲突',
    ],
    explanation: '堆叠链路断开后，分裂出的两部分都会选举自己的 Master，配置 IP、MAC 相同，造成网络中出现"双主"——地址冲突、流量黑洞、STP 震荡。DAD（Dual-Active Detect）用于检测并抑制该问题：直连检测是堆叠成员间通过专用链路（或复用业务口）互发检测报文；代理检测是借助上层交换机转发检测报文。检测到双主后，系统会保留竞争成功的一侧，将另一侧的业务口关闭（Error-Down）。',
    knowledgeId: 'datacom-stack', direction: 'datacom',
  },

  // ==================== 防火墙双机热备（原 1 题）====================
  {
    id: 'g-ha-01', type: 'single', difficulty: 'IP',
    question: '华为防火墙双机热备中，HRP 协议的主要作用是？',
    options: [
      '在主备设备之间同步配置与会话表等状态信息',
      '用于选举生成树根桥',
      '用于动态分配 IP 地址',
      '用于检测链路层环路',
    ],
    answer: '在主备设备之间同步配置与会话表等状态信息',
    explanation: 'HRP（Huawei Redundancy Protocol）是华为私有协议，承载在心跳链路上，负责在双机之间同步：配置命令、会话表（Session）、Server-map 表、黑名单、IPS/AV 特征库状态等。核心价值是主备切换时已有连接不中断——业务流量切换到备用机后，由于会话表已同步，TCP 会话无需重建。B/C/D 分别是 STP、DHCP、环路检测的功能，与 HRP 无关。',
    knowledgeId: 'security-ha', direction: 'security',
  },
  {
    id: 'g-ha-02', type: 'multiple', difficulty: 'IP',
    question: '关于 VGMP 与双机热备状态，以下说法正确的是？',
    options: [
      'VGMP 组将多个 VRRP 组统一管理，保证上下行状态一致',
      'VGMP 有 active 与 standby 两种状态',
      '双机热备支持主备备份与负载分担两种部署方式',
      '心跳线仅用于同步配置，不参与状态检测',
    ],
    answer: [
      'VGMP 组将多个 VRRP 组统一管理，保证上下行状态一致',
      'VGMP 有 active 与 standby 两种状态',
      '双机热备支持主备备份与负载分担两种部署方式',
    ],
    explanation: 'VGMP（VRRP Group Management Protocol）解决"多个 VRRP 组状态不一致导致流量来回路径不对称"的问题：把上行、下行 VRRP 组统一为一个 VGMP 组管理，要么全 active、要么全 standby。D 错：心跳线既承载 HRP 配置/会话同步，也用于检测对端存活，心跳丢失是触发切换的重要条件。负载分担模式下两台设备互为不同业务的主，提升利用率。',
    knowledgeId: 'security-ha', direction: 'security',
  },

  // ==================== UTM / 下一代防火墙（原 1 题）====================
  {
    id: 'g-utm-01', type: 'multiple', difficulty: 'IA',
    question: '相比传统防火墙，下一代防火墙（NGFW）增强的能力包括？',
    options: [
      '应用识别能力，可识别具体应用而非仅靠端口',
      '用户识别能力，可基于用户/用户组实施策略',
      '内容安全一体化，集成 IPS、反病毒、URL 过滤等',
      '仍只能基于五元组（源目 IP、端口、协议）进行控制',
    ],
    answer: [
      '应用识别能力，可识别具体应用而非仅靠端口',
      '用户识别能力，可基于用户/用户组实施策略',
      '内容安全一体化，集成 IPS、反病毒、URL 过滤等',
    ],
    explanation: '传统防火墙基于五元组做访问控制，面对端口复用、动态端口、加密流量时几乎失效。NGFW 的三大增强：应用识别（深度报文检测 DPI，识别微信、抖音等具体应用及其行为）、用户识别（与 AD/LDAP/Radius 联动，策略绑定到人而不是 IP）、内容安全一体化（IPS、AV、URL 过滤、数据防泄漏统一引擎处理）。D 是传统防火墙的局限，恰是 NGFW 要突破的点。',
    knowledgeId: 'security-utm', direction: 'security',
  },
  {
    id: 'g-utm-02', type: 'single', difficulty: 'IA',
    question: 'UTM（统一威胁管理）的核心思想是？',
    options: [
      '将防火墙、IPS、反病毒、URL 过滤等多种安全能力集成在同一设备上统一管理',
      '只做网络层访问控制，不管应用层威胁',
      '通过增加带宽来抵御 DDoS 攻击',
      '依赖终端杀毒软件完成全部安全防护',
    ],
    answer: '将防火墙、IPS、反病毒、URL 过滤等多种安全能力集成在同一设备上统一管理',
    explanation: 'UTM 的核心价值是"一体化集成"：一台设备同时提供防火墙、IPS、反病毒、URL 过滤、邮件过滤、应用控制等能力，并统一配置与日志，降低中小企业部署与运维成本。代价是各功能串行处理带来的性能瓶颈（开启全部特性后吞吐大幅下降）。后续演进的 NGFW 在集成基础上强化了应用/用户识别与并行处理性能，可理解为"UTM 的能力 + 更强的识别与性能"。',
    knowledgeId: 'security-utm', direction: 'security',
  },

  // ==================== ARP（原 2 题）====================
  {
    id: 'g-arp-01', type: 'multiple', difficulty: 'IP',
    question: '关于免费 ARP（Gratuitous ARP），以下说法正确的是？',
    options: [
      '可用于检测网络中的 IP 地址冲突',
      '主机主动发送，用于通告自身的 IP 与 MAC 对应关系',
      'VRRP 主备切换时会发送免费 ARP 刷新下游设备的 MAC 表项',
      '免费 ARP 是攻击行为，网络中应完全禁止',
    ],
    answer: [
      '可用于检测网络中的 IP 地址冲突',
      '主机主动发送，用于通告自身的 IP 与 MAC 对应关系',
      'VRRP 主备切换时会发送免费 ARP 刷新下游设备的 MAC 表项',
    ],
    explanation: '免费 ARP 是主机主动发送的、源目 IP 均为自身 IP 的特殊 ARP 请求，用于：宣告自身上线并刷新全网 ARP/MAC 表项、检测 IP 冲突（若收到应答说明地址已被占用）。VRRP 主备切换时新 Master 发送免费 ARP，让下游交换机更新 MAC 地址表、主机更新网关 MAC，实现快速收敛。D 错：免费 ARP 本身是正常协议行为，只是可被利用于 ARP 欺骗攻击，防御手段是 DAI（动态 ARP 检测）、ARP 表项固化等。',
    knowledgeId: 'datacom-arp', direction: 'datacom',
  },

  // ==================== BFD（原 2 题）====================
  {
    id: 'g-bfd-01', type: 'single', difficulty: 'IP',
    question: 'BFD 相比传统协议 Hello 机制的核心优势是？',
    options: [
      '可以提供毫秒级的链路故障检测',
      '可以替代路由协议完成路由计算',
      '可以减少网络中的广播流量',
      '可以自动修复故障链路',
    ],
    answer: '可以提供毫秒级的链路故障检测',
    explanation: '传统路由协议的 Hello 检测周期通常为秒级（OSPF 默认 10s/40s），无法满足语音、金融等业务的快速收敛需求。BFD 提供通用的、毫秒级（可配 3.3ms/10ms 等）的故障检测服务，并与 OSPF、IS-IS、BGP、静态路由、VRRP、MPLS 等联动，检测失败即通知上层协议快速收敛。B/C/D 错：BFD 只做检测，不参与路由计算、不修复链路，也不以抑制广播为目的。',
    knowledgeId: 'datacom-bfd', direction: 'datacom',
  },
  {
    id: 'g-bfd-02', type: 'multiple', difficulty: 'IP',
    question: 'BFD 可以与哪些协议或功能进行联动以实现快速收敛？',
    options: [
      '与 OSPF / IS-IS 联动，加快路由收敛',
      '与 BGP 联动，加快邻居失效感知',
      '与静态路由联动，实现主备链路快速切换',
      '与 VRRP 联动，加快网关主备切换',
    ],
    answer: [
      '与 OSPF / IS-IS 联动，加快路由收敛',
      '与 BGP 联动，加快邻居失效感知',
      '与静态路由联动，实现主备链路快速切换',
      '与 VRRP 联动，加快网关主备切换',
    ],
    explanation: 'BFD 的设计定位就是"通用检测服务"，通过标准化接口被各类协议调用：与 IGP/BGP 联动加速邻居失效感知；与静态路由联动时，BFD 会话 Down 会使绑定该会话的静态路由失效（常用于主备链路切换）；与 VRRP 联动可实现网关亚秒级切换。此外还支持单臂回声（One-arm Echo）模式，用于一端不支持 BFD 的场景，以及 MPLS LSP、IP-Link 等联动。',
    knowledgeId: 'datacom-bfd', direction: 'datacom',
  },

  // ==================== OSI / TCP-IP 模型（原 2 题）====================
  {
    id: 'g-osi-01', type: 'multiple', difficulty: 'IA',
    question: '关于数据封装单元与层次的对应，以下正确的是？',
    options: [
      '传输层的数据单元称为段（Segment）',
      '网络层的数据单元称为包 / 报文（Packet）',
      '数据链路层的数据单元称为帧（Frame）',
      '物理层传输的是比特流（Bit）',
    ],
    answer: [
      '传输层的数据单元称为段（Segment）',
      '网络层的数据单元称为包 / 报文（Packet）',
      '数据链路层的数据单元称为帧（Frame）',
      '物理层传输的是比特流（Bit）',
    ],
    explanation: '自上而下的封装过程：应用层数据 → 传输层加 TCP/UDP 头部成为段 → 网络层加 IP 头部成为包 → 数据链路层加以太网头尾成为帧 → 物理层以比特流传输。记忆口诀"报文段、IP 包、MAC 帧、物理比特"。另外 TCP 头部 20–60 字节、UDP 固定 8 字节、IPv4 头部 20–60 字节、以太网帧头 14 字节 + FCS 4 字节，这些长度也是常考细节。',
    knowledgeId: 'datacom-osi-tcpip', direction: 'datacom',
  },

  // ==================== OSPFv3（原 2 题）====================
  {
    id: 'g-ospfv3-01', type: 'multiple', difficulty: 'IP',
    question: '关于 OSPFv3 与 OSPFv2 的主要区别，以下说法正确的是？',
    options: [
      'OSPFv3 基于链路运行，而非基于网段',
      'OSPFv3 使用链路本地地址（Link-Local）作为报文源地址',
      'OSPFv3 自身不再提供认证字段，依赖 IPv6 的 AH/ESP',
      'OSPFv3 不再需要 Router ID，由 IPv6 地址自动生成',
    ],
    answer: [
      'OSPFv3 基于链路运行，而非基于网段',
      'OSPFv3 使用链路本地地址（Link-Local）作为报文源地址',
      'OSPFv3 自身不再提供认证字段，依赖 IPv6 的 AH/ESP',
    ],
    explanation: 'OSPFv3（RFC 5340）针对 IPv6 做了多处改造：基于链路而不是网段运行（一条链路可承载多个子网）、邻居识别依赖 Router ID 而非接口 IP、协议报文使用链路本地地址作为源、认证交由 IPv6 扩展头 AH/ESP 完成（协议自身不再带 AuType 字段）。D 是高频易错点：OSPFv3 依然需要 32 位 Router ID，不会自动由 IPv6 地址生成，必须手工配置或沿用其他来源，否则进程无法启动。',
    knowledgeId: 'datacom-ospfv3', direction: 'datacom',
  },
  {
    id: 'g-ospfv3-02', type: 'single', difficulty: 'IP',
    question: 'OSPFv3 中，关于 Router ID 的正确说法是？',
    options: [
      '仍为 32 位点分十进制标识，必须手工配置或由系统选举产生，不能自动取 IPv6 地址',
      '自动使用接口 IPv6 地址的后 32 位作为 Router ID',
      'OSPFv3 已经取消 Router ID 的概念',
      'Router ID 必须是链路本地地址',
    ],
    answer: '仍为 32 位点分十进制标识，必须手工配置或由系统选举产生，不能自动取 IPv6 地址',
    explanation: '这是一道高频陷阱题。虽然 OSPFv3 运行在 IPv6 上，但 Router ID 作为 OSPF 域内路由器的唯一标识，格式仍是 32 位点分十进制，与 IPv6 地址无关。若未手工配置，设备会参照 OSPFv2 的规则从 Loopback / 物理接口的 IPv4 地址中选举；若设备完全没有 IPv4 地址，Router ID 将为 0.0.0.0，OSPFv3 进程无法正常工作，此时必须手工指定。配置命令：ospfv3 1 router-id 1.1.1.1。',
    knowledgeId: 'datacom-ospfv3', direction: 'datacom',
  },

  // ==================== 反病毒与内容过滤（原 2 题）====================
  {
    id: 'g-av-01', type: 'multiple', difficulty: 'IA',
    question: '常见的恶意代码检测技术包括以下哪些？',
    options: [
      '特征签名检测（Signature-based）',
      '启发式检测（Heuristic）',
      '沙箱动态行为分析（Sandbox）',
      '仅依靠黑名单 IP 即可实现完整的病毒防护',
    ],
    answer: [
      '特征签名检测（Signature-based）',
      '启发式检测（Heuristic）',
      '沙箱动态行为分析（Sandbox）',
    ],
    explanation: '主流检测手段分三层：特征签名检测通过比对已知病毒特征库，准确性高、速度快，但无法检出未知与变种；启发式检测基于代码行为特征与规则打分，可发现未知威胁但存在误报；沙箱在隔离环境中实际执行样本，观察其注册表、文件、网络行为，对免杀与 0day 最有效但资源开销大。D 错：IP 黑名单只能阻断已知恶意主机的连接，无法检测通过正常网站、邮件附件传播的病毒。',
    knowledgeId: 'security-antivirus', direction: 'security',
  },
  {
    id: 'g-av-02', type: 'multiple', difficulty: 'IA',
    question: '关于内容过滤（Content Filtering），以下说法正确的是？',
    options: [
      'URL 过滤可基于预定义分类与自定义黑白名单控制网站访问',
      '关键字过滤可对 HTTP/邮件正文中的敏感词进行匹配拦截',
      '文件类型过滤可阻断特定扩展名（如 exe、bat）的下载',
      '内容过滤仅能工作在内网，无法对出向流量生效',
    ],
    answer: [
      'URL 过滤可基于预定义分类与自定义黑白名单控制网站访问',
      '关键字过滤可对 HTTP/邮件正文中的敏感词进行匹配拦截',
      '文件类型过滤可阻断特定扩展名（如 exe、bat）的下载',
    ],
    explanation: '内容过滤是 NGFW/UTM 的核心能力之一，通常包含 URL 过滤（按分类库如游戏/赌博/社交控制，叠加自定义黑白名单）、关键字过滤（HTTP 正文、搜索关键字、邮件标题正文）、文件类型与文件内容过滤（阻断 exe/bat/scr 等，或识别真实文件类型而非仅看扩展名）、邮件过滤（SMTP/POP3/IMAP 附件与正文）。D 明显错误：内容过滤的主要应用场景正是管控内网用户的出向访问。注意 HTTPS 加密流量需配合 SSL 解密才能生效。',
    knowledgeId: 'security-antivirus', direction: 'security',
  },
];
