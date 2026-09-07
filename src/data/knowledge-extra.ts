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
];
