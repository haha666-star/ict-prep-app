// EXPORTS: EXTRA_KNOWLEDGE
// 补齐题库中已引用但未定义的知识点（悬空 knowledgeId），并覆盖大纲要求但题库空白的方向
import type { IKnowledge } from './knowledge'

export const EXTRA_KNOWLEDGE: IKnowledge[] = [
  {
    id: 'datacom-tcp-udp',
    name: 'TCP与UDP',
    direction: 'datacom',
    parentId: 'datacom-basic',
    level: 3,
    keyPoints: [
      'TCP：面向连接、可靠传输、三次握手与四次挥手、滑动窗口、拥塞控制（慢启动/拥塞避免/快重传/快恢复）',
      'UDP：无连接、不可靠、开销小、时延低，适合语音视频与实时业务',
      '常见端口：HTTP 80/TCP、HTTPS 443/TCP、FTP 20-21/TCP、SSH 22/TCP、Telnet 23/TCP、DNS 53/UDP+TCP、DHCP 67-68/UDP、SNMP 161-162/UDP',
      '常见协议号：ICMP 1、TCP 6、UDP 17、OSPF 89、ESP 50、AH 51',
      'TCP 与 UDP 均提供端口号字段实现复用与分用'
    ],
    tips: '端口号与协议号是必考识记点，注意区分"端口号（传输层）"与"协议号（IP 层）"'
  },
  {
    id: 'datacom-application-layer',
    name: '应用层协议',
    direction: 'datacom',
    parentId: 'datacom-basic',
    level: 3,
    keyPoints: [
      'HTTP/HTTPS：Web 访问，HTTPS = HTTP + TLS，端口 80/443',
      'DNS：域名解析，端口 53，递归查询与迭代查询，常见记录 A/AAAA/CNAME/MX',
      'FTP：文件传输，控制连接 21，数据连接 20（主动模式）',
      'DHCP：动态主机配置，UDP 67/68，DORA 四步交互',
      'SMTP/POP3/IMAP：邮件收发，端口 25/110/143'
    ],
    tips: '重点记端口与协议对应关系，以及 DNS、DHCP 的交互流程'
  },
  {
    id: 'datacom-rip',
    name: 'RIP 路由协议',
    direction: 'datacom',
    parentId: 'datacom-routing',
    level: 3,
    keyPoints: [
      '距离矢量协议，以跳数为度量值，最大 15 跳，16 跳表示不可达',
      'RIPv1：有类路由协议，广播更新，不支持 VLSM 与认证',
      'RIPv2：无类路由协议，组播更新 224.0.0.9，支持 VLSM、CIDR 与明文/MD5 认证',
      'RIPng：用于 IPv6，基于 UDP 521',
      '防环机制：水平分割、毒性逆转、触发更新、抑制计时器、最大跳数'
    ],
    tips: 'RIP 已在现网中基本被 OSPF/IS-IS 取代，但作为距离矢量典型代表仍是高频概念考点'
  },
  {
    id: 'datacom-bfd',
    name: 'BFD 双向转发检测',
    direction: 'datacom',
    parentId: 'datacom-routing',
    level: 3,
    keyPoints: [
      '轻量级快速故障检测机制，可提供毫秒级故障感知',
      '与 OSPF、IS-IS、BGP、VRRP、静态路由、MPLS 等联动，加速业务收敛',
      '会话建立后周期性发送检测报文，支持异步模式与查询模式',
      '可配置最小发送间隔、最小接收间隔与检测倍数',
      'BFD 只负责检测，不参与路由计算'
    ],
    tips: '常考"BFD 的作用与联动对象"，注意 BFD 本身不做选路'
  },
  {
    id: 'datacom-link-aggregation',
    name: '链路聚合',
    direction: 'datacom',
    parentId: 'datacom-lan',
    level: 3,
    keyPoints: [
      'Eth-Trunk 将多条物理链路捆绑为一条逻辑链路，提升带宽并实现冗余',
      '手工模式：不运行 LACP，由管理员静态捆绑',
      'LACP 模式：通过 LACPDU 协商，选举主动端并确定活动/备份链路',
      '成员端口的速率、双工模式、VLAN 配置必须一致',
      '跨设备链路聚合可由堆叠/CSS 或 M-LAG 实现'
    ],
    tips: '注意华为 Trunk 端口默认不放行所有 VLAN，链路聚合成员口配置一致性是高频考点'
  },
  {
    id: 'security-ha',
    name: '防火墙双机热备',
    direction: 'security',
    parentId: 'security-firewall',
    level: 3,
    keyPoints: [
      '主备备份与负载分担两种部署模式',
      '通过 HRP（Huawei Redundancy Protocol）同步会话表、配置与状态',
      'VGMP（VRRP Group Management Protocol）统一管理 VRRP 组状态，避免主备不一致',
      '心跳线用于传输 HRP 报文与状态同步',
      '支持配置自动同步与抢占'
    ],
    tips: '双机热备核心是"会话表同步"，否则主备切换会导致业务中断，VGMP 与 HRP 的分工是难点'
  },
  {
    id: 'security-management',
    name: '安全管理与运维',
    direction: 'security',
    parentId: 'security-basic',
    level: 3,
    keyPoints: [
      '等保 2.0：五个安全保护等级，"一个中心、三重防护"技术框架',
      '三重防护：安全通信网络、安全区域边界、安全计算环境',
      'RTO（恢复时间目标）与 RPO（恢复点目标）的含义与关系',
      '日志集中收集、统一 NTP 时钟源、日志防篡改与留存（不少于 6 个月）',
      '漏洞管理闭环：扫描→评估→排序→验证→灰度→复测'
    ],
    tips: '等保框架与 RTO/RPO 是近年新增的高频考点，注意两者数值越小代表要求越高'
  },
  {
    id: 'security-pki',
    name: 'PKI 与数字证书',
    direction: 'security',
    parentId: 'security-crypto',
    level: 3,
    keyPoints: [
      'PKI 组成：CA、RA、证书库、密钥管理、证书吊销（CRL/OCSP）',
      '数字证书由 CA 签发，绑定公钥与持有者身份',
      '数字签名：发送方用私钥对摘要加密，接收方用公钥验签，提供完整性与不可否认性',
      '典型应用：HTTPS、IPsec 证书认证、802.1X EAP-TLS',
      '非对称算法 RSA/ECC 用于签名与密钥交换，对称算法 AES 用于数据加密'
    ],
    tips: '重点理解"私钥签名、公钥验签"与"公钥加密、私钥解密"两种用法的区别'
  },
  {
    id: 'security-utm',
    name: 'UTM 与下一代防火墙',
    direction: 'security',
    parentId: 'security-firewall',
    level: 3,
    keyPoints: [
      'UTM：将防火墙、IPS、AV、URL 过滤等集成于一台设备',
      'NGFW 在 UTM 基础上增强应用识别与控制、用户身份关联与内容安全',
      '典型功能：应用识别、IPS、AV、URL 过滤、内容过滤、DLP、沙箱联动',
      '与传统包过滤/状态检测的区别在于具备应用层深度检测能力',
      '通常需与态势感知平台联动实现协同防御'
    ],
    tips: 'UTM 与 NGFW 的区别常考：NGFW 强调应用识别、用户感知与内容级防护'
  },
  {
    id: 'dcn-vxlan-gateway',
    name: 'VXLAN 网关',
    direction: 'dcn',
    parentId: 'dcn-vxlan',
    level: 3,
    keyPoints: [
      '集中式网关：网关部署在 Spine 或专用网关设备，便于集中安全策略，但存在流量绕行与性能瓶颈',
      '分布式网关：网关下沉到 Leaf，多台 Leaf 配置相同的 Anycast IP 与 MAC，实现就近转发',
      '分布式网关适合东西向流量为主的中大型数据中心',
      'Anycast Gateway 需配合主机路由（/32）保证流量对称',
      '对称 IRB 与非对称 IRB 的流量路径差异'
    ],
    tips: '高频易错点：分布式网关配置更复杂、安全策略分散（不是更简单更安全）；集中式网关存在次优路径'
  },
  {
    id: 'wlan-rf',
    name: 'WLAN 射频与天线',
    direction: 'wlan',
    parentId: 'wlan-basic',
    level: 3,
    keyPoints: [
      '2.4GHz 中国可用信道 1-13，互不重叠信道为 1/6/11，每信道 20MHz',
      '5GHz 信道资源丰富、干扰少、速率高，但穿透与绕射能力弱于 2.4GHz',
      '全向天线适合开阔区域，定向天线适合走廊、隧道等狭长场景',
      '天线增益越高方向性越强，覆盖范围并非一定更大',
      '射频优化手段：信道规划、功率调整、频谱导航（频段引导）、负载均衡'
    ],
    tips: '易错点：AP 功率并非越大越好，功率过大会导致同频干扰加剧与漫游粘滞'
  },
  {
    id: 'wlan-wifi6',
    name: 'Wi-Fi 6（802.11ax）',
    direction: 'wlan',
    parentId: 'wlan-standard',
    level: 3,
    keyPoints: [
      'OFDMA：划分资源单元 RU，实现多用户并行传输，降低时延',
      '上下行 MU-MIMO：支持多用户同时收发',
      '1024-QAM：相比 Wi-Fi 5 的 256-QAM 提升约 25% 速率',
      'BSS Coloring：通过着色区分同信道 BSS，提升空间复用',
      'TWT 目标唤醒时间：终端按需唤醒，显著降低功耗',
      'Wi-Fi 6 同时支持 2.4GHz 与 5GHz，Wi-Fi 6E 扩展至 6GHz'
    ],
    tips: 'OFDMA 与 MU-MIMO 的区别是高频考点：OFDMA 解决多用户小包并发效率，MU-MIMO 解决多用户空间流并行'
  },

  // ============ 第十届大纲缺口补齐（深圳赛区细则 + 国赛权重重排）============
  {
    id: 'datacom-mstp',
    name: 'MSTP 多生成树',
    direction: 'datacom',
    parentId: 'datacom-lan',
    level: 3,
    keyPoints: [
      'MSTP（IEEE 802.1s）在 RSTP 基础上引入实例（Instance）与域（Region），不同 VLAN 可映射不同生成树实例',
      'MST 域需 Region 名称、修订级别、VLAN-实例映射三者完全一致才能属于同一域',
      'IST（内部生成树）连接所有 MST 域，CST（公共生成树）连接所有 STP 域，CIST 为二者总和',
      'MSTP 既防环又实现 VLAN 级负载分担，优于单棵 STP/RSTP',
      '关键命令：stp mode mstp、stp region-configuration、instance vlan'
    ],
    tips: 'MSTP 域三要素一致性与"实例-VLAN 映射"是必考，注意 MSTP 兼容 RSTP/STP'
  },
  {
    id: 'datacom-vlan-aggregate',
    name: 'VLAN 聚合（Super-VLAN）',
    direction: 'datacom',
    parentId: 'datacom-vlan',
    level: 3,
    keyPoints: [
      'Super-VLAN（VLAN 聚合）用一个三层 VLANIF 接口为多个 Sub-VLAN 提供网关，节省 IP 地址',
      'Sub-VLAN 之间二层隔离，借助 Super-VLAN 的 VLANIF 实现三层互通',
      'ARP 代理（arp-proxy intra-sub-vlan-proxy）使 Sub-VLAN 间可经 Super-VLAN 网关互访',
      'Super-VLAN 不能包含物理端口，端口只能加入 Sub-VLAN',
      '典型场景：园区大量隔离用户共享同一网段网关'
    ],
    tips: '易错点：Sub-VLAN 间二层不通，必须开启 VLAN 间 ARP 代理才能三层互通'
  },
  {
    id: 'datacom-policy-route',
    name: '策略路由 PBR',
    direction: 'datacom',
    parentId: 'datacom-routing',
    level: 3,
    keyPoints: [
      'PBR 按管理员策略（源/目的 IP、协议、端口等）转发，优先级高于普通路由表',
      '通过流分类（traffic classifier）、流行为（traffic behavior）、流策略（traffic policy）重定向下一跳或出接口',
      '与路由策略（route-policy）区别：route-policy 过滤/修改路由，PBR 控制数据转发',
      'PBR 常用于引流、负载分担、出口选路、旁挂设备引流',
      '本地 PBR 作用于本机发出的报文，接口 PBR 作用于过境报文'
    ],
    tips: '高频易混：route-policy 管"路由"，PBR 管"报文转发"，二者作用层次不同'
  },
  {
    id: 'datacom-nms',
    name: '网络管理与运维',
    direction: 'datacom',
    parentId: 'datacom-service',
    level: 3,
    keyPoints: [
      'SNMP：网管协议，v1/v2c 基于团体字（明文），v3 支持认证与加密；代理 Agent 161/162',
      'LLDP：链路层发现协议，用于邻居设备信息发现，与厂商无关的二层邻居发现',
      'NQA：网络质量分析，探测时延/抖动/丢包（ICMP/TCP/HTTP 等），可与静态路由、PBR 联动实现探测联动',
      'NetStream/sFlow：流量采样与统计分析',
      'telemetry：实时采集设备数据，相比 SNMP 轮询更实时'
    ],
    tips: 'SNMP 版本安全差异与 NQA 联动是易考点，注意 SNMP v3 才具备加密'
  },
  {
    id: 'security-dhcp-snooping',
    name: 'DHCP Snooping 与 IPSG',
    direction: 'security',
    parentId: 'security-basic',
    level: 3,
    keyPoints: [
      'DHCP Snooping 建立合法 DHCP 绑定表（MAC-IP-端口-VLAN），区分信任/非信任端口',
      '非信任端口收到的 DHCP Offer/Ack 被丢弃，防止私接 DHCP 服务器（DHCP 欺骗）',
      'IP Source Guard（IPSG）基于绑定表校验 IP+MAC，非法报文丢弃',
      '动态 ARP 检测（DAI）基于绑定表校验 ARP 报文，防 ARP 欺骗',
      '配置：dhcp snooping enable、trust 接口、ip source check user-bind'
    ],
    tips: '三者联动是二层防攻击标准方案：Snooping 建表，IPSG 防 IP 欺骗，DAI 防 ARP 欺骗'
  },
  {
    id: 'security-port-security',
    name: '端口安全与 MAC 安全',
    direction: 'security',
    parentId: 'security-basic',
    level: 3,
    keyPoints: [
      '端口安全（Port Security）限制端口学习 MAC 数量，超阈可 protect/restrict/error-down',
      '端口安全可绑定合法 MAC（sticky 或手工），实现接入准入',
      'MAC 地址漂移检测：同一 MAC 在不同端口间跳变触发告警或阻塞，防环路与攻击',
      '端口隔离（port-isolate）：同隔离组端口二层不互通，节省 VLAN',
      'MACsec：基于 802.1AE 的链路层加密，保护点对点链路数据机密性与完整性'
    ],
    tips: '端口安全三种违规动作差异常考：protect 静默丢弃、restrict 丢弃并告警、error-down 关闭端口'
  },
  {
    id: 'security-portal',
    name: 'Portal 认证',
    direction: 'security',
    parentId: 'security-auth',
    level: 3,
    keyPoints: [
      'Portal 认证（Web 认证）：用户先免认证访问 Portal 页面，输入账号后上线',
      '三层 Portal（直接转发）与二层 Portal（VLAN 内），需 Portal 服务器与 RADIUS 配合',
      '常与 802.1X、MAC 认证组成统一准入，按场景组合（如 802.1X 失败降级 Portal）',
      '典型应用：访客接入、校园/园区 Web 自助认证',
      '相比 802.1X 无需客户端，用户体验友好但安全性略低'
    ],
    tips: '三种准入（802.1X/MAC/Portal）的适用场景对比是高频题，Portal 胜在无客户端'
  },
  {
    id: 'security-fw-advance',
    name: '防火墙虚拟系统与智能选路',
    direction: 'security',
    parentId: 'security-firewall',
    level: 3,
    keyPoints: [
      '虚拟系统（Vsys）：一台物理防火墙虚拟为多台逻辑防火墙，资源与配置隔离，节约成本',
      'Vsys 通过根系统分配资源（会话/策略/带宽），互不影响',
      '智能选路：基于链路质量（时延/丢包/带宽）自动选择最优出口，支持策略路由与链路负载均衡',
      '流量管理（带宽管理）：基于应用/用户/时间段做带宽限速与保障',
      '双链路热备、N+1 备份提升可靠性'
    ],
    tips: 'Vsys 与 VRF 概念不同：Vsys 是防火墙虚拟化，VRF 是路由虚拟化；智能选路核心是链路质量探测'
  },
  {
    id: 'wlan-sta-online',
    name: 'CAPWAP 与 STA 上线',
    direction: 'wlan',
    parentId: 'wlan-arch',
    level: 3,
    keyPoints: [
      'CAPWAP 隧道：控制隧道（UDP 5246）与数据隧道（UDP 5247）分离',
      'Fit AP 上线流程：DHCP 获取 IP → 发现 AC（广播/单播/Option 43/DNS）→ 建立 CAPWAP → 下载配置 → 运行',
      'STA 关联上线：扫描→认证→关联→DHCP→IP 获取→上网',
      'AC 发现方式：二层广播、三层单播、DHCP Option 43、DNS 域名',
      'AP 工作模式：Fit（受 AC 管理）、Fat（独立）、云管理'
    ],
    tips: 'CAPWAP 两端口（5246 控制/5247 数据）与 AP 发现 AC 的四种方式是高频考点'
  },
  {
    id: 'wlan-planning',
    name: '无线规划与部署',
    direction: 'wlan',
    parentId: 'wlan-basic',
    level: 3,
    keyPoints: [
      '信道规划：2.4G 用 1/6/11 互不重叠，5G 自动/手动选无干扰信道',
      '功率调整：避免过覆盖导致同频干扰与漫游粘滞，也要避免覆盖盲区',
      '频谱导航（Band Steer）：引导双频终端优先 5G，分流 2.4G 拥塞',
      '容量规划：单 AP 并发用户数、吞吐与覆盖半径的平衡',
      '高密场景：降低功率、缩小蜂窝、启用负载均衡'
    ],
    tips: '规划核心矛盾：功率过大→干扰与粘滞；功率过小→盲区；需折中'
  },
  {
    id: 'dcn-clos',
    name: 'Spine-Leaf 架构',
    direction: 'dcn',
    parentId: 'dcn-arch',
    level: 3,
    keyPoints: [
      'Clos/Spine-Leaf（胖树）是数据中心主流架构，Spine 与 Leaf 全互联',
      '东西向流量为主，任意 Leaf 间经过一跳 Spine，延迟可预测',
      'Leaf 连接服务器/防火墙，Spine 只做高速转发，无三层网关（Underlay）',
      'Overlay（VXLAN）在 Leaf 上提供二层扩展与租户隔离',
      '相比传统三层架构，Spine-Leaf 带宽利用率高、易横向扩展'
    ],
    tips: 'Spine-Leaf 的"任意 Leaf 间一跳 Spine"与东西向流量优化是核心卖点'
  },
  {
    id: 'dcn-sdn-controller',
    name: 'SDN 控制器与编排',
    direction: 'dcn',
    parentId: 'dcn-sdn',
    level: 3,
    keyPoints: [
      'SDN 核心思想：控制平面与转发平面分离，集中控制，开放可编程',
      '华为 SDN 控制器（如 iMaster NCE）负责网络自动化、策略下发与可视化',
      '南向接口：OpenFlow、NETCONF、OVSDB、BGP-EVPN；北向接口：RESTful API',
      'Underlay 提供 IP 互通，Overlay（VXLAN/EVPN）提供租户二层/三层网络',
      '控制器集群提升可靠性，避免单点故障'
    ],
    tips: 'SDN 三要素（转控分离/集中控制/开放接口）与南北向接口区分是必考'
  },
];
