import re

filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\data\quizzes.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

questions = '''
  // ==================== 扩充题库 Batch A（数通） ====================
  {
    id: 'dc-a001',
    type: 'single',
    question: 'TCP三次握手过程中，第二次握手的报文标志位是？',
    options: ['SYN', 'ACK', 'SYN+ACK', 'FIN+ACK'],
    answer: 'SYN+ACK',
    explanation: 'TCP三次握手：1.客户端发送SYN（同步序号），请求建立连接。2.服务器回复SYN+ACK（同步+确认），确认客户端的SYN，同时发送自己的SYN。3.客户端回复ACK（确认），确认服务器的SYN，连接建立。第二次握手是SYN+ACK，既有确认又有同步。',
    knowledgeId: 'datacom-tcp-udp',
    direction: 'datacom',
  },
  {
    id: 'dc-a002',
    type: 'single',
    question: 'TCP四次挥手中，TIME_WAIT状态持续多久？',
    options: ['30秒', '60秒', '2MSL（最大报文生存时间的2倍）', '永久'],
    answer: '2MSL（最大报文生存时间的2倍）',
    explanation: 'TCP四次挥手后，主动关闭方进入TIME_WAIT状态，持续2MSL（Maximum Segment Lifetime，最大报文生存时间，通常2分钟，即120秒）。作用：1.确保最后一个ACK能到达对端（如果丢失，对端会重发FIN，主动方还能重发ACK）。2.让本次连接的所有报文在网络中消失，避免影响下一个相同四元组的连接。MSL通常设为2分钟，所以TIME_WAIT通常4分钟。可通过tcp_tw_reuse等参数优化。',
    knowledgeId: 'datacom-tcp-udp',
    direction: 'datacom',
  },
  {
    id: 'dc-a003',
    type: 'judge',
    question: 'UDP是无连接的、不可靠的传输层协议，不保证数据按序到达。',
    options: ['正确', '错误'],
    answer: '正确',
    explanation: 'UDP（User Datagram Protocol，用户数据报协议）特点：1.无连接：发送数据前不需要建立连接，发送后也不需要释放连接。2.不可靠：不保证数据一定到达，不保证按序到达，不保证不重复，没有确认和重传机制。3.面向报文：对应用层交下来的报文，添加首部后直接交给IP层，不合并也不拆分。4.无拥塞控制：网络拥塞时不会降低发送速率。5.首部开销小：只有8字节（源端口、目的端口、长度、校验和），TCP首部20字节。6.支持一对一、一对多、多对一、多对多通信。UDP适用于实时应用（语音、视频、直播、DNS、DHCP、TFTP、SNMP、RIP等），这些应用能容忍少量丢包但要求低延迟。',
    knowledgeId: 'datacom-tcp-udp',
    direction: 'datacom',
  },
  {
    id: 'dc-a004',
    type: 'single',
    question: '以下哪个应用层协议使用UDP作为传输层协议？',
    options: ['HTTP', 'FTP', 'DNS', 'SMTP'],
    answer: 'DNS',
    explanation: 'DNS（Domain Name System，域名系统）默认使用UDP 53端口进行域名解析（查询响应小，一次交互即可，UDP效率高）。当响应超过512字节或区域传输（AXFR/IXFR）时使用TCP 53端口。HTTP使用TCP 80，HTTPS使用TCP 443。FTP使用TCP 21（控制连接）和TCP 20（主动模式数据连接）。SMTP使用TCP 25（发送邮件）。其他使用UDP的常见协议：DHCP（67/68）、TFTP（69）、SNMP（161/162）、RIP（520）、NTP（123）、SIP（5060）、RTP（动态端口，实时传输）、QUIC（UDP 443，HTTP/3）。',
    knowledgeId: 'datacom-tcp-udp',
    direction: 'datacom',
  },
  {
    id: 'dc-a005',
    type: 'single',
    question: 'IP地址192.168.1.10/28的网络地址和广播地址分别是？',
    options: ['192.168.1.0 和 192.168.1.15', '192.168.1.0 和 192.168.1.255', '192.168.1.8 和 192.168.1.15', '192.168.1.8 和 192.168.1.23'],
    answer: '192.168.1.0 和 192.168.1.15',
    explanation: '/28表示前28位是网络位，后4位是主机位。块大小=2^(32-28)=16。网络地址：192.168.1.0（第4字节0，是16的倍数）。广播地址：网络地址+块大小-1=192.168.1.15。可用主机地址：192.168.1.1-192.168.1.14，共14个。192.168.1.10在192.168.1.0/28网段内。子网划分计算：1.确定块大小=2^主机位数。2.网络地址是块大小的整数倍（且小于等于IP）。3.广播地址=下一个网络地址-1。4.可用主机=网络地址+1 到 广播地址-1。',
    knowledgeId: 'datacom-ip-subnet',
    direction: 'datacom',
  },
  {
    id: 'dc-a006',
    type: 'single',
    question: '以下哪个IP地址是私有IP地址？',
    options: ['8.8.8.8', '172.32.1.1', '192.168.1.1', '202.103.0.117'],
    answer: '192.168.1.1',
    explanation: '私有IP地址范围（RFC 1918）：1.A类：10.0.0.0-10.255.255.255（10.0.0.0/8），约1600万个地址。2.B类：172.16.0.0-172.31.255.255（172.16.0.0/12），约100万个地址。3.C类：192.168.0.0-192.168.255.255（192.168.0.0/16），约6.5万个地址。私有IP地址在公网上不可路由，需要NAT（网络地址转换）转换为公网IP才能访问互联网。172.32.1.1不在私有范围（172.16-172.31才是私有），是公网IP。8.8.8.8是Google DNS公网IP。202.103.0.117是中国电信公网IP。其他特殊地址：127.0.0.0/8环回地址、169.254.0.0/16链路本地地址（APIPA）、0.0.0.0/0默认路由、224.0.0.0/4组播、240.0.0.0/4保留。',
    knowledgeId: 'datacom-ip-subnet',
    direction: 'datacom',
  },
  {
    id: 'dc-a007',
    type: 'judge',
    question: '静态路由的优先级（Preference）默认值是60，数值越小优先级越高。',
    options: ['正确', '错误'],
    answer: '正确',
    explanation: '华为设备中，路由优先级（Preference，也叫管理距离Administrative Distance）数值越小优先级越高。常见协议默认优先级：直连路由0（最高）、静态路由60、OSPF内部路由10、IS-IS Level-1 15、IS-IS Level-2 18、EBGP 25、RIP 100、OSPF ASE/Type5 150、IBGP 255（最低）。当不同协议学到相同目的网段的路由时，优先级高（数值小）的协议路由被选中。静态路由优先级60，比OSPF（10）低，比RIP（100）高。可通过ip route-static命令的preference参数修改静态路由优先级。浮动静态路由（Floating Static Route）：配置高优先级（大数值）的静态路由作为备份，主路由故障时才启用。注意：不同厂商优先级数值不同，Cisco的管理距离：直连0、静态1、EIGRP汇总5、EBGP 20、EIGRP内部90、IGRP 100、OSPF 110、IS-IS 115、RIP 120、ODR 160、EIGRP外部170、IBGP 200。',
    knowledgeId: 'datacom-static-route',
    direction: 'datacom',
  },
  {
    id: 'dc-a008',
    type: 'single',
    question: '默认路由0.0.0.0/0的作用是？',
    options: ['匹配所有IP地址，当没有更具体路由时使用', '只匹配0.0.0.0', '匹配私有IP', '匹配组播IP'],
    answer: '匹配所有IP地址，当没有更具体路由时使用',
    explanation: '默认路由（Default Route）0.0.0.0/0是一种特殊的静态路由，前缀长度为0，匹配所有IP地址（因为最长匹配原则下，任何地址都至少匹配0位）。当路由表中没有更具体的路由匹配目的地址时，使用默认路由转发。默认路由通常用于：1.企业网络出口路由器，指向ISP（所有未知流量都发给ISP）。2.末梢网络（Stub Network），只有一个出口，用默认路由简化路由表。3.OSPF Stub/Totally Stub区域，ABR向区域内发布默认路由（Type 3 LSA）。4.IS-IS L1区域，L1/2路由器通过ATT位通知L1路由器生成默认路由。配置方式：静态默认路由ip route-static 0.0.0.0 0.0.0.0 下一跳。默认路由的优先级与静态路由相同（60），可修改。最长匹配原则（Longest Match）：路由器转发时选择前缀最长（最具体）的路由，默认路由前缀最短（0），所以只有在没有其他匹配路由时才使用。',
    knowledgeId: 'datacom-static-route',
    direction: 'datacom',
  },
  {
    id: 'dc-a009',
    type: 'single',
    question: 'RIP协议的最大跳数是多少？',
    options: ['15跳', '16跳', '32跳', '255跳'],
    answer: '15跳',
    explanation: 'RIP（Routing Information Protocol，路由信息协议）是距离矢量路由协议，以跳数（Hop Count）为度量值（Metric），最大有效跳数为15跳，16跳表示不可达（网络不可达）。这限制了RIP只能用于小型网络（直径不超过15台路由器）。RIP版本：RIPv1（有类路由，不支持VLSM，广播更新255.255.255.255，不支持认证）、RIPv2（无类路由，支持VLSM和CIDR，组播更新224.0.0.9，支持明文和MD5认证）、RIPng（IPv6版本，基于RIPv2，组播FF02::9，UDP 521）。RIP特点：1.定期更新（默认30秒发送完整路由表）。2.触发更新（拓扑变化时立即发送更新）。3.水平分割（Split Horizon，不从收到路由的接口发回该路由）。4.毒性逆转（Poison Reverse，将从某接口学到的路由以跳数16发回该接口）。5.抑制计时（Hold-down，180秒，路由不可达后在一定时间内不接受更差路由）。6.刷新计时（Flush，240秒，超时后删除路由）。RIP使用UDP 520端口。RIP适用于小型网络，大型网络用OSPF或IS-IS。',
    knowledgeId: 'datacom-rip',
    direction: 'datacom',
  },
  {
    id: 'dc-a010',
    type: 'judge',
    question: 'RIPv2使用组播地址224.0.0.9发送路由更新，支持VLSM和认证。',
    options: ['正确', '错误'],
    answer: '正确',
    explanation: 'RIPv2相比RIPv1的改进：1.无类路由（Classless）：路由更新中携带子网掩码，支持VLSM（可变长子网掩码）和CIDR（无类域间路由）。RIPv1是有类路由，不携带掩码，不支持VLSM。2.组播更新：使用组播地址224.0.0.9发送路由更新，而不是RIPv1的广播255.255.255.255，减少对不运行RIP的设备的干扰。3.认证支持：支持明文认证和MD5认证，提高安全性。RIPv1不支持认证。4.下一跳字段：路由更新中携带下一跳地址，可避免次优路径。5.路由标记（Route Tag）：可标记外部路由，便于策略控制。RIPv2向后兼容RIPv1，可配置接口发送版本（version 1/2/multicast）和接收版本。RIPv2默认自动汇总（在主类网络边界汇总），可通过undo summary关闭自动汇总以支持不连续子网。RIPv2仍保留RIP的基本机制：距离矢量、跳数度量、最大15跳、30秒定期更新、水平分割、毒性逆转等。RIPv2适用于小型网络，是RIP的主流版本。',
    knowledgeId: 'datacom-rip',
    direction: 'datacom',
  },
  {
    id: 'dc-a011',
    type: 'single',
    question: 'OSPF中，DR和BDR的选举基于什么？',
    options: ['路由器ID大小', '接口优先级（大的优先），优先级相同时Router ID大的优先', '接口IP地址大小', '链路带宽'],
    answer: '接口优先级（大的优先），优先级相同时Router ID大的优先',
    explanation: 'OSPF在广播网络（Broadcast）和NBMA网络中选举DR（Designated Router，指定路由器）和BDR（Backup Designated Router，备份指定路由器）。选举规则：1.比较接口优先级（Priority，0-255，默认1，值越大越优先）。优先级为0的路由器不参与DR/BDR选举（DROther）。2.优先级相同时，比较Router ID（路由器ID），Router ID大的优先。3.DR选举是不可抢占的（Non-preemptive）：一旦DR选举完成，即使新加入更高优先级的路由器，也不会抢占当前DR，只有当DR故障时BDR才成为DR，然后重新选举BDR。DR/BDR的作用：1.减少邻接关系数量：广播网络中所有路由器只与DR和BDR建立邻接关系，DROther之间只建立邻居关系（2-Way），不建立邻接。n台路由器只需2(n-1)条邻接，而非全互联的n(n-1)/2。2.减少LSA泛洪：DROther只将LSA发给DR（组播224.0.0.6），DR再泛洪给所有DROther（组播224.0.0.5），避免重复泛洪。3.DR生成Type 2 Network LSA，描述广播网络中的所有路由器。点到点（P2P）和点到多点（P2MP）网络不选举DR/BDR。',
    knowledgeId: 'datacom-ospf',
    direction: 'datacom',
  },
  {
    id: 'dc-a012',
    type: 'single',
    question: 'OSPF中，路由器ID（Router ID）的选举顺序是？',
    options: ['手动配置>Loopback接口最大IP>物理接口最大IP', '物理接口最大IP>Loopback最大IP>手动配置', 'Loopback最大IP>物理接口最大IP>手动配置', '随机选举'],
    answer: '手动配置>Loopback接口最大IP>物理接口最大IP',
    explanation: 'OSPF Router ID（路由器ID）是一个32位的点分十进制数值，唯一标识OSPF域中的一台路由器。选举顺序（优先级从高到低）：1.手动配置：通过router-id命令手动指定Router ID，优先级最高。2.Loopback接口：如果没有手动配置，选择所有Loopback接口中IP地址最大的作为Router ID。3.物理接口：如果没有Loopback接口，选择所有物理接口中IP地址最大的（接口状态为up的）作为Router ID。Router ID的特点：1.一旦选举完成，即使接口IP变化或手动配置，也不会立即改变，需要重启OSPF进程或手动执行reset ospf process命令才会重新选举。2.Router ID在OSPF域内必须唯一，重复会导致邻接关系建立失败或路由计算错误。3.Router ID格式与IP地址相同，但只是一个标识符，不一定是真实的IP地址。4.建议手动配置Router ID（通常用Loopback接口地址），便于管理和维护，避免因接口变化导致Router ID变化。5.Router ID为0.0.0.0的路由器不能建立OSPF邻接。OSPFv3（IPv6）也使用Router ID（32位IPv4格式），因为IPv6地址128位不适合做Router ID。',
    knowledgeId: 'datacom-ospf',
    direction: 'datacom',
  },
  {
    id: 'dc-a013',
    type: 'judge',
    question: 'OSPF邻接关系建立过程中，Exchange状态下双方交换DD报文（数据库描述报文）。',
    options: ['正确', '错误'],
    answer: '正确',
    explanation: 'OSPF邻接关系建立的状态机：1.Down：初始状态，未收到任何Hello报文。2.Init：收到对方的Hello报文，但对方的Hello中没有包含自己的Router ID（单向通信）。3.2-Way：收到对方的Hello报文，且其中包含自己的Router ID（双向通信），邻居关系建立。在广播网络中，此状态后选举DR/BDR。4.ExStart（交换初始）：协商主从关系（Master/Slave）和DD报文序列号，主路由器先发DD。5.Exchange（交换）：双方交换DD报文（Database Description，数据库描述），DD报文包含本地LSDB中所有LSA的摘要（LSA头部信息），不包含完整LSA内容。6.Loading（加载）：根据DD报文中的LSA摘要，发现本地缺失的LSA，发送LSR（Link State Request，链路状态请求）请求完整LSA；对方回复LSU（Link State Update，链路状态更新）携带完整LSA；收到LSU后回复LSAck（Link State Acknowledgment，链路状态确认）。7.Full（完全邻接）：双方LSDB同步完成，邻接关系建立。只有达到Full状态才是真正的邻接关系（Adjacency），2-Way只是邻居关系（Neighbor）。点到点网络中所有邻居都建立Full邻接；广播网络中DROther之间停留在2-Way，只与DR/BDR建立Full。',
    knowledgeId: 'datacom-ospf',
    direction: 'datacom',
  },
  {
    id: 'dc-a014',
    type: 'single',
    question: 'BGP中，以下哪个属性用于判断AS间的入站流量，值越小越优先？',
    options: ['Local_Pref', 'MED', 'AS_Path', 'Origin'],
    answer: 'MED',
    explanation: 'MED（Multi-Exit Discriminator，多出口区分符，也叫Metric）是BGP可选非过渡属性，用于影响相邻AS的入站流量选择（告诉对端AS从哪个入口进入本AS更优）。MED值越小越优先（类似IGP的度量值）。MED只在相邻两个AS之间传递，默认不跨AS传递（收到的MED只用于本AS与相邻AS的比较，不会传给第三个AS），除非配置always-compare-med或compare-med。MED的典型应用：一个AS有多个出口连接到同一个相邻AS时，通过设置不同的MED值，让对端AS优先选择MED小的入口，实现入站流量负载分担或路径优化。BGP路由优选顺序（13条）：1.忽略下一跳不可达的路由。2.优选Weight大的（Cisco私有，华为不支持）。3.优选Local_Pref大的。4.优选本地始发的路由（network/aggregate/import-route）。5.优选AS_Path短的。6.优选Origin类型优的（IGP>EGP>Incomplete）。7.优选MED小的。8.优选EBGP路由优于IBGP路由。9.优选到下一跳IGP度量小的。10.优选Cluster_List短的（RR场景）。11.优选Originator_ID小的。12.优选邻居Router ID小的。13.优选邻居IP地址小的。Local_Pref影响本AS出站流量（值大优先），MED影响相邻AS入站流量（值小优先）。',
    knowledgeId: 'datacom-bgp',
    direction: 'datacom',
  },
  {
    id: 'dc-a015',
    type: 'single',
    question: 'BGP建立邻居关系时，使用的端口号是？',
    options: ['TCP 179', 'UDP 179', 'TCP 520', 'UDP 520'],
    answer: 'TCP 179',
    explanation: 'BGP（Border Gateway Protocol，边界网关协议）使用TCP作为传输层协议，端口号179。BGP是唯一使用TCP的路由协议（OSPF/IS-IS/RIP都不使用TCP：OSPF直接封装在IP中协议号89，IS-IS直接封装在数据链路层，RIP使用UDP 520）。BGP使用TCP的原因：1.BGP需要可靠传输：路由更新必须可靠到达，不能丢失，TCP提供确认和重传机制。2.BGP邻居之间可能跨多跳（EBGP邻居通常直连，但也可多跳；IBGP邻居可跨多跳），TCP提供端到端可靠通信。3.BGP更新量可能很大（完整路由表数十万条），TCP的流量控制和拥塞控制能保证稳定传输。BGP邻居建立过程：1.主动端（Active）向被动端（Passive）的TCP 179端口发起连接。2.如果双方都配置了对方为邻居，会同时发起连接，最终只保留一个（Router ID大的作为主动方）。3.TCP连接建立后，发送Open报文协商参数（版本、AS号、Hold Time、Router ID、能力等）。4.协商成功后发送Keepalive报文确认。5.邻居关系建立（Established状态），开始交换Update报文（路由更新）。BGP状态机：Idle→Connect→Active→OpenSent→OpenConfirm→Established。BGP是外部网关协议（EGP），用于AS之间交换路由信息，是互联网的核心路由协议。',
    knowledgeId: 'datacom-bgp',
    direction: 'datacom',
  },
  {
    id: 'dc-a016',
    type: 'judge',
    question: 'IS-IS协议直接封装在数据链路层，不使用IP协议号或UDP/TCP端口。',
    options: ['正确', '错误'],
    answer: '正确',
    explanation: 'IS-IS（Intermediate System to Intermediate System，中间系统到中间系统）是ISO（国际标准化组织）开发的链路状态路由协议，最初为CLNP（无连接网络协议）设计，后来扩展支持IP（集成IS-IS，Integrated IS-IS）。IS-IS的封装方式：直接封装在数据链路层帧中，以太网类型字段为0x88FE（IPv4）和0x88FE（IPv6，同一类型号通过协议ID区分）。不使用IP协议号（OSPF用IP协议号89），不使用UDP/TCP端口（RIP用UDP 520，BGP用TCP 179）。IS-IS的PDU（Protocol Data Unit，协议数据单元）类型：1.IIH（IS-to-IS Hello PDU）：类似OSPF的Hello，用于发现和维护邻居，分为L1 IIH、L2 IIH、P2P IIH。2.LSP（Link State PDU，链路状态PDU）：类似OSPF的LSA，描述链路状态信息，分为L1 LSP和L2 LSP。3.CSNP（Complete Sequence Number PDU，完全序列号PDU）：包含本地LSDB中所有LSP的摘要，用于数据库同步，DIS在广播网络中周期性发送。4.PSNP（Partial Sequence Number PDU，部分序列号PDU）：请求缺失的LSP或确认收到的LSP。IS-IS的优点：1.封装效率高（直接二层封装，首部开销小）。2.协议扩展性好（TLV结构，易于扩展新功能）。3.路由计算效率高（SPF计算范围小，L1/L2分层）。4.适用于大规模网络（运营商骨干网常用IS-IS）。IS-IS与OSPF都是链路状态协议，都使用SPF算法，但IS-IS更简洁高效，在运营商网络中广泛使用。',
    knowledgeId: 'datacom-isis',
    direction: 'datacom',
  },
  {
    id: 'dc-a017',
    type: 'single',
    question: 'STP中，根桥（Root Bridge）的选举依据是？',
    options: ['MAC地址最小', '桥ID（Bridge ID）最小，优先级+MAC地址', 'IP地址最小', '接口数量最多'],
    answer: '桥ID（Bridge ID）最小，优先级+MAC地址',
    explanation: 'STP（Spanning Tree Protocol，生成树协议，802.1D）中，根桥（Root Bridge）是整个交换网络的逻辑中心，所有其他交换机都以根桥为计算无环拓扑的基准。根桥选举依据：桥ID（Bridge ID，BID）最小的成为根桥。桥ID由两部分组成：1.桥优先级（Bridge Priority，2字节，默认32768，范围0-61440，步长4096）。2.MAC地址（6字节，交换机的基础MAC地址）。比较规则：先比较桥优先级，优先级小的成为根桥；优先级相同时，比较MAC地址，MAC地址小的成为根桥。可通过stp priority命令修改桥优先级，或通过stp root primary（自动设为4096）/stp root secondary（自动设为8192）配置根桥/备份根桥。根桥的所有端口都是指定端口（Designated Port），都处于Forwarding状态。其他交换机选举根端口（Root Port，到根桥路径开销最小的端口）。每条链路上选举指定端口（Designated Port，到根桥路径开销小的一端）。既不是根端口也不是指定端口的被阻塞（Blocking）。STP通过阻塞冗余端口实现无环拓扑，同时提供冗余备份（活动链路故障时阻塞端口转为转发）。RSTP（802.1w）和MSTP（802.1s）的根桥选举规则与STP相同。',
    knowledgeId: 'datacom-stp',
    direction: 'datacom',
  },
  {
    id: 'dc-a018',
    type: 'single',
    question: 'VLAN标签（802.1Q）中，VLAN ID字段占多少位？',
    options: ['8位', '10位', '12位', '16位'],
    answer: '12位',
    explanation: '802.1Q VLAN标签（Tag）插在以太网帧的源MAC地址和类型字段之间，共4字节（32位）：1.TPID（Tag Protocol Identifier，标签协议标识符，2字节）：固定为0x8100，表示这是802.1Q标签帧。2.TCI（Tag Control Information，标签控制信息，2字节）：包含：- PCP（Priority Code Point，优先级代码点，3位）：802.1p优先级，0-7，用于QoS。- CFI（Canonical Format Indicator，规范格式指示符，1位）：以太网中通常为0，令牌环中为1。- VID（VLAN ID，VLAN标识符，12位）：VLAN编号，范围0-4095。可用VLAN ID为1-4094（0和4095保留），所以最多支持4094个VLAN。VLAN 1是默认VLAN，所有端口默认属于VLAN 1，通常作为管理VLAN或本征VLAN（Native VLAN）。VLAN 1002-1005在Cisco中保留用于令牌环和FDDI，华为设备可使用全部1-4094。802.1Q标签的作用：1.标识帧所属的VLAN，实现VLAN间隔离。2.Trunk链路中携带VLAN信息，使多个VLAN的流量能在同一条物理链路上复用。3.PCP字段提供QoS优先级标记。Access端口发送帧时剥离标签（Untagged），接收时打上PVID标签。Trunk端口发送时，PVID VLAN的帧不打标签（Native VLAN），其他VLAN帧保留标签。QinQ（802.1Q-in-802.1Q）在帧中插入两层VLAN标签，扩展VLAN数量（4094*4094），用于运营商网络。',
    knowledgeId: 'datacom-vlan',
    direction: 'datacom',
  },
  {
    id: 'dc-a019',
    type: 'judge',
    question: 'MPLS标签栈中，S位（Stack位）为1表示这是栈底标签。',
    options: ['正确', '错误'],
    answer: '正确',
    explanation: 'MPLS（Multi-Protocol Label Switching，多协议标签交换）标签（Label）共4字节（32位），位于二层帧头和三层IP头之间（也叫"2.5层"）。标签格式：1.Label（标签值，20位）：标签标识符，范围0-1048575。0-15为保留标签（0=IPv4显式空标签，1=路由器告警标签，2=IPv6显式空标签，3=隐式空标签），16以上为普通标签。2.Exp（Experimental，实验位，3位）：用于QoS（类似802.1p的PCP），标记流量优先级。3.S（Stack，栈位，1位）：表示是否为栈底标签。S=1表示这是栈底标签（最底层标签，靠近IP头）；S=0表示栈中还有更多标签（上层标签）。MPLS支持标签栈（Label Stack），可嵌套多层标签，从栈顶到栈底依次处理。4.TTL（Time To Live，生存时间，8位）：与IP TTL类似，每经过一台LSR减1，为0时丢弃，防止环路。S位的作用：标识标签栈的底部，让LSR知道何时停止弹出标签。当LSR弹出标签后，如果S=1（栈底），则按IP转发（或下一层协议）；如果S=0，则继续处理下一层标签。典型的标签栈应用：1.VPN（L3VPN）：两层标签，外层公网标签（LDP分配，到达出口PE），内层VPN标签（MP-BGP分配，标识VPN实例）。2.MPLS TE：一层或多层标签。3.AToM（L2VPN）：两层标签。标签操作：Push（压入标签，在栈顶添加新标签）、Pop（弹出标签，移除栈顶标签）、Swap（交换标签，替换栈顶标签）。PHP（Penultimate Hop Popping，倒数第二跳弹出）：倒数第二跳LSR弹出栈底标签，减少最后一跳的处理负担，使用隐式空标签（标签值3）实现。',
    knowledgeId: 'datacom-mpls-vpn',
    direction: 'datacom',
  },
  {
    id: 'dc-a020',
    type: 'single',
    question: 'MPLS L3VPN中，用户路由在PE之间通过什么协议传递？',
    options: ['LDP', 'MP-BGP（多协议BGP）', 'OSPF', 'RSVP-TE'],
    answer: 'MP-BGP（多协议BGP）',
    explanation: 'MPLS L3VPN（三层VPN）中，PE（Provider Edge，运营商边缘路由器）之间通过MP-BGP（Multi-Protocol BGP，多协议BGP）传递VPN用户路由。MP-BGP在BGP基础上扩展，支持多种网络层协议（IPv4单播、IPv4组播、IPv6、VPNv4等），通过新增地址族（Address Family）和子地址族（Subsequent Address Family）实现。VPNv4地址族（VPNv4 Address Family）：在IPv4地址前添加8字节的RD（Route Distinguisher，路由区分符），形成12字节的VPNv4地址，解决不同VPN用户使用相同IP地址（地址重叠）的问题。RD+IPv4 = VPNv4，全局唯一。MP-BGP传递VPN路由时携带：1.VPNv4前缀（RD+用户IPv4路由）。2.VPN标签（MP-BGP分配的内层标签，标识VPN实例和出接口）。3.RT（Route Target，路由目标，扩展团体属性，控制VPN路由的导入导出）。LDP（Label Distribution Protocol，标签分发协议）用于分配公网标签（外层标签），建立公网LSP（标签交换路径），使MPLS报文能在运营商网络中传输。OSPF/RIP等IGP用于运营商骨干网内部路由，使PE之间能互通。RSVP-TE用于MPLS TE（流量工程），建立约束路由LSP。MPLS L3VPN的基本模型：1.CE（Customer Edge，用户边缘路由器）连接PE，通过静态路由或IGP（OSPF/RIP/BGP）交换用户路由。2.PE将CE路由引入VPN实例，添加RD形成VPNv4，通过MP-BGP传给对端PE。3.对端PE根据RT导入到对应VPN实例，添加RD后传给CE。4.数据转发时，PE压入两层标签（内层VPN标签+外层公网标签），在公网通过MPLS转发，到达对端PE后弹出标签，按VPN路由转发给CE。',
    knowledgeId: 'datacom-mpls-vpn',
    direction: 'datacom',
  },
'''

# 在文件末尾的 ] 之前插入
pattern = r'\n\]\n\s*$'
if re.search(pattern, content):
    new_content = re.sub(pattern, questions + '\n]\n', content, count=1)
else:
    # 尝试在最后一个 ] 前插入
    idx = content.rfind(']')
    new_content = content[:idx] + questions + '\n' + content[idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

count = new_content.count("question: '")
print(f"Inserted batch, total questions: {count}")
