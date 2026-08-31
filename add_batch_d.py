import re

filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\data\quizzes.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

questions = '''
  // ==================== 扩充题库 Batch D（高频考点） ====================
  {
    id: 'dc-d001', type: 'single',
    question: 'OSPF中，以下哪个LSA类型仅在本区域内泛洪，描述路由器的链路状态？',
    options: ['Type 1 Router LSA', 'Type 3 Summary LSA', 'Type 5 AS External LSA', 'Type 7 NSSA External LSA'],
    answer: 'Type 1 Router LSA',
    explanation: 'OSPF LSA类型及泛洪范围：Type 1 Router LSA（每台路由器生成，描述本路由器接口、开销、邻居，仅在本区域内泛洪）；Type 2 Network LSA（DR生成，描述广播网络所有路由器，仅本区域）；Type 3 Summary LSA（ABR生成，描述区域间路由，可跨区域）；Type 4 Summary LSA（ABR生成，描述ASBR位置，可跨区域）；Type 5 AS External LSA（ASBR生成，描述外部路由，整个OSPF域除Stub/NSSA外泛洪）；Type 7 NSSA External LSA（NSSA区域ASBR生成，仅在NSSA区域内泛洪，到ABR转换为Type 5）。Type 1和Type 2仅在本区域内泛洪，是区域内路由计算的基础。',
    knowledgeId: 'datacom-ospf', direction: 'datacom',
  },
  {
    id: 'dc-d002', type: 'single',
    question: 'BGP路由优选过程中，在比较AS_Path长度之前，先比较什么？',
    options: ['Origin类型', 'Local_Pref（本地优先级）', 'MED', 'Router ID'],
    answer: 'Local_Pref（本地优先级）',
    explanation: 'BGP路由优选顺序（13条，前几条）：1.忽略下一跳不可达的路由；2.优选Weight大的（Cisco私有，华为不支持）；3.优选Local_Pref大的（本地优先级，影响本AS出站流量）；4.优选本地始发的路由（network/aggregate/import-route）；5.优选AS_Path短的；6.优选Origin类型优的（IGP>EGP>Incomplete）；7.优选MED小的（影响相邻AS入站流量）；8.优选EBGP优于IBGP；9.优选到下一跳IGP度量小的；10.优选Cluster_List短的；11.优选Originator_ID小的；12.优选邻居Router ID小的；13.优选邻居IP小的。Local_Pref在AS_Path之前比较，是影响本AS出站流量的重要属性，值越大越优先，默认100，仅在IBGP邻居间传递，不传给EBGP邻居。',
    knowledgeId: 'datacom-bgp', direction: 'datacom',
  },
  {
    id: 'dc-d003', type: 'judge',
    question: 'IS-IS中，L1/2路由器同时维护Level-1和Level-2两个链路状态数据库。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'IS-IS路由器类型：1.L1路由器（Level-1）：只维护L1链路状态数据库，只能与同区域的L1/L1-2建立邻居，只知道本区域内拓扑，访问其他区域通过L1/2默认路由。2.L2路由器（Level-2）：只维护L2链路状态数据库，只能与L2/L1-2建立邻居（可跨区域），负责骨干区域路由，不知道L1区域内具体拓扑。3.L1/2路由器（Level-1-2）：同时维护L1和L2两个独立的链路状态数据库，同时与同区域的L1/L1-2建立L1邻居，与其他区域的L2/L1-2建立L2邻居，是L1区域与L2骨干的桥梁，负责区域间路由发布和默认路由下发（ATT位）。L1/2路由器是IS-IS分层路由的关键，类似OSPF的ABR。默认情况下华为路由器是L1/2类型，可通过is-level命令修改为L1或L2。L1数据库和L2数据库独立计算SPF，互不影响。',
    knowledgeId: 'datacom-isis', direction: 'datacom',
  },
  {
    id: 'dc-d004', type: 'single',
    question: 'RSTP中，边缘端口（Edge Port）的特点是？',
    options: ['直接进入Forwarding状态，不参与STP计算，连接终端设备', '与其他交换机互联的端口', '被阻塞的备份端口', '选举DR的端口'],
    answer: '直接进入Forwarding状态，不参与STP计算，连接终端设备',
    explanation: 'RSTP/MSTP边缘端口（Edge Port）：1.直接进入Forwarding状态，无需经过Listening/Learning的30秒等待，实现终端快速接入。2.不参与STP计算，不接收BPDU（收到BPDU后会自动变为非边缘端口，重新参与STP计算，防止环路）。3.连接终端设备（PC、服务器、打印机等），这些设备不会产生环路。4.边缘端口up/down不会触发拓扑变化（TC），减少网络震荡。5.可通过stp edged-port enable命令在接口上配置，或通过stp default edge-port全局配置（所有端口默认边缘，连接交换机的端口手动关闭边缘）。边缘端口是RSTP快速收敛的重要机制之一，配合P/A协商实现整体快速收敛。注意：边缘端口如果连接了交换机或HUB，可能产生环路，因为边缘端口不监听BPDU（收到第一个BPDU后才变为非边缘），所以必须确保连接终端。BPDU保护（BPDU Protection）：边缘端口收到BPDU时自动关闭端口（Error-Down），防止环路和非法接入，需配合边缘端口使用。',
    knowledgeId: 'datacom-stp', direction: 'datacom',
  },
  {
    id: 'dc-d005', type: 'single',
    question: '以下关于VLAN间路由的说法，正确的是？',
    options: ['不同VLAN默认可以直接通信', '不同VLAN需要三层设备（路由器/三层交换机SVI）才能通信', 'VLAN间路由只能用路由器', 'VLAN间通信不需要IP地址'],
    answer: '不同VLAN需要三层设备（路由器/三层交换机SVI）才能通信',
    explanation: 'VLAN（虚拟局域网）隔离广播域，不同VLAN在二层是隔离的，默认不能直接通信。VLAN间通信需要三层设备（网络层）进行路由转发：1.三层交换机SVI（Switch Virtual Interface，交换虚拟接口，华为叫VLANIF）：为每个VLAN创建逻辑三层接口，配置网关IP，不同VLAN的SVI之间通过三层路由表通信，是企业网络主流方式，硬件转发性能高。2.路由器子接口（单臂路由）：路由器物理接口划分为多个逻辑子接口，每个子接口配置802.1Q封装和网关IP，实现VLAN间路由，性能低（软件转发），所有VLAN共享物理接口带宽，已被三层交换机替代。3.路由器物理接口：每个VLAN用一个物理接口连接路由器，浪费端口，不常用。VLAN间通信原理：主机A（VLAN 10）发现目的IP在不同网段，将数据发给默认网关（VLAN 10的SVI IP），三层设备查路由表发现目的网络是直连的VLAN 20，从VLAN 20的SVI转发给主机B。每个VLAN需要一个独立的IP网段，不同VLAN不能用同一网段（除非用VLAN聚合等特殊技术）。',
    knowledgeId: 'datacom-vlan', direction: 'datacom',
  },
  {
    id: 'sec-d001', type: 'single',
    question: '防火墙安全策略中，以下哪个匹配条件是五元组之外的扩展匹配？',
    options: ['源IP地址', '目的端口', '应用（Application）', '协议号'],
    answer: '应用（Application）',
    explanation: '防火墙安全策略（Security Policy）匹配条件：基本五元组：源IP地址、目的IP地址、源端口、目的端口、协议号（TCP/UDP/ICMP等）。扩展匹配条件：1.应用（Application）：基于应用层协议识别（如HTTP、FTP、DNS、微信、抖音等），通过DPI（深度包检测）识别应用，比端口更准确（应用可使用非标准端口）。2.用户（User）：基于认证用户/用户组，实现基于身份的访问控制（如只有销售部能访问财务系统）。3.时间段（Time Range）：基于时间范围（如工作时间允许，休息时间禁止）。4.服务（Service）：基于预定义或自定义服务（端口+协议组合）。5.源/目的安全区域（Security Zone）：基于流量的入/出安全区域。6.入侵防御（IPS）、反病毒（AV）、URL过滤、文件过滤、内容过滤等UTM功能。7.地理位置（Geo IP）、IP信誉、域名（FQDN）等。安全策略动作：允许（Permit）、拒绝（Deny，静默丢弃）、拒绝并回复（Reject，发送TCP RST或ICMP不可达）、日志记录、流量统计、引用UTM配置文件等。安全策略按顺序匹配（从上到下），匹配到第一条即执行，不再继续匹配，所以策略顺序很重要（精确策略放上面，宽泛策略放下面，最后默认拒绝）。华为防火墙默认安全策略：所有区域间流量默认拒绝（需手动配置允许策略），同区域内默认允许。',
    knowledgeId: 'security-firewall-basic', direction: 'security',
  },
  {
    id: 'sec-d002', type: 'single',
    question: 'IPSec中，IKEv1主模式（Main Mode）需要几条消息完成协商？',
    options: ['3条', '4条', '6条', '8条'],
    answer: '6条',
    explanation: 'IKEv1（Internet Key Exchange version 1）阶段一建立IKE SA，两种模式：1.主模式（Main Mode）：6条消息，保护身份信息（身份在第5、6条加密传输），更安全，但协商慢。消息1-2：协商IKE策略（加密算法、认证算法、认证方式、DH组、生命周期）。消息3-4：DH密钥交换（交换Diffie-Hellman公钥，生成共享密钥）和随机数（Nonce）。消息5-6：身份认证（交换身份信息和预共享密钥/证书签名，加密传输）。2.野蛮模式（Aggressive Mode）：3条消息，身份信息明文传输（不安全），但协商快，适合对端IP不固定或NAT场景。消息1：发起方发送IKE策略+DH公钥+身份+随机数。消息2：响应方确认+DH公钥+身份+随机数+认证。消息3：发起方认证确认。阶段二（快速模式Quick Mode）：3条消息，建立IPSec SA，协商IPSec策略（加密/认证算法、封装模式、感兴趣流、生命周期），生成IPSec密钥，可建立多个IPSec SA（不同方向/协议）。IKEv2简化为4条消息（IKE_SA_INIT 2条+IKE_AUTH 2条），同时建立IKE SA和第一个IPSec SA，更安全高效，支持MOBIKE（移动性），推荐使用。IKE使用UDP 500端口，NAT-T时用UDP 4500。',
    knowledgeId: 'security-ipsec', direction: 'security',
  },
  {
    id: 'sec-d003', type: 'judge',
    question: 'DDoS攻击中，UDP Flood通过发送大量伪造源IP的UDP报文，耗尽目标带宽和处理能力。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'UDP Flood是常见的DDoS攻击：攻击者发送大量伪造源IP的UDP报文到目标服务器的随机端口，目标服务器收到后：1.消耗带宽（大量UDP报文占满上行/下行带宽）。2.消耗CPU（检查端口、发送ICMP端口不可达响应）。3.耗尽连接表（防火墙/路由器状态表被占满）。UDP是无连接协议，不需要三次握手，攻击者可以轻易伪造源IP发送大量UDP报文，目标无法通过握手验证来源，难以防御。防御方法：1.流量清洗（清洗中心识别并丢弃攻击流量，只转发合法流量）。2.黑洞路由（将攻击目标流量引入黑洞，牺牲目标可用性保护网络）。3.限速（对UDP流量限速，限制单IP速率）。4.源IP验证（uRPF，反向路径转发，检查源IP是否真实可达，丢弃伪造源IP）。5.任何cast（分布式架构分散攻击流量）。6.CDN/云清洗（利用云厂商大带宽和清洗能力）。其他DDoS攻击：SYN Flood（TCP半连接耗尽）、ICMP Flood（Ping洪水/Smurf）、HTTP Flood（CC攻击，大量HTTP请求耗尽Web服务器）、DNS Query Flood（大量DNS请求耗尽DNS服务器）、NTP/SSDP反射放大攻击（利用开放服务器放大攻击流量，放大倍数可达数百倍）、慢速攻击（Slowloris，慢速发送HTTP头保持连接耗尽连接数）等。DDoS防御是综合工程，需要网络层、应用层、云清洗多层防护。',
    knowledgeId: 'security-attack-defense', direction: 'security',
  },
  {
    id: 'sec-d004', type: 'single',
    question: 'HTTPS（HTTP over TLS）中，TLS握手过程的主要目的是？',
    options: ['协商加密算法并交换会话密钥，之后用对称密钥加密HTTP数据', '用非对称密钥加密所有HTTP数据', '验证服务器身份并直接传输数据', '压缩HTTP数据'],
    answer: '协商加密算法并交换会话密钥，之后用对称密钥加密HTTP数据',
    explanation: 'HTTPS = HTTP + TLS/SSL，TLS（Transport Layer Security，传输层安全）握手过程：1.客户端发送Client Hello：支持的TLS版本、加密套件列表、随机数（Client Random）。2.服务器回复Server Hello：选择的TLS版本和加密套件、随机数（Server Random）、服务器数字证书（包含公钥）。3.客户端验证证书（CA签名、有效期、域名匹配、是否撤销），生成预主密钥（Pre-master Secret），用服务器公钥加密后发送（Key Exchange）。4.双方用Client Random+Server Random+Pre-master Secret计算会话密钥（Master Secret→会话密钥）。5.客户端发送Finished（用会话密钥加密，验证密钥协商成功）。6.服务器发送Finished（确认）。7.握手完成，之后所有HTTP数据用会话密钥（对称加密，如AES）加密传输，保证机密性、完整性、身份认证。TLS握手的核心：用非对称加密（RSA/ECC）安全交换会话密钥，用对称加密（AES/ChaCha20）高效加密大量数据，用哈希算法（SHA-256）保证完整性，用数字证书认证服务器身份（可选客户端认证）。TLS版本：SSL 3.0（已淘汰，不安全）、TLS 1.0/1.1（已淘汰）、TLS 1.2（当前主流）、TLS 1.3（最新，更快更安全，握手简化为1-RTT甚至0-RTT）。HTTPS默认端口443，HTTP默认80。HTTPS是网络安全基础，所有网站都应启用（Let's Encrypt免费证书）。',
    knowledgeId: 'security-crypto', direction: 'security',
  },
  {
    id: 'wlan-d001', type: 'single',
    question: 'WLAN中，802.11n（Wi-Fi 4）引入的关键技术MIMO的作用是？',
    options: ['使用多根天线同时收发多路数据流，提高速率和可靠性', '增加发射功率', '扩展频段到6GHz', '简化认证流程'],
    answer: '使用多根天线同时收发多路数据流，提高速率和可靠性',
    explanation: 'MIMO（Multiple-Input Multiple-Output，多输入多输出）：使用多根发射天线和多根接收天线，同时收发多路独立的数据流，在不增加带宽和发射功率的情况下，成倍提高无线传输速率和链路可靠性。802.11n（Wi-Fi 4）首次引入MIMO，支持最多4x4 MIMO（4根发射4根接收，4个空间流），理论速率最高600Mbps（40MHz带宽+4空间流+64-QAM）。MIMO技术分类：1.空间复用（Spatial Multiplexing）：多根天线同时发送不同数据流，接收端区分，成倍提高速率（如2x2 MIMO速率是1x1的2倍）。2.发射分集（Transmit Diversity）：多根天线发送相同数据的不同编码，接收端合并，提高可靠性和覆盖（如STBC空时块编码）。3.接收分集（Receive Diversity）：多根天线接收相同信号，选择最强或合并，提高接收质量。4.波束成形（Beamforming）：多根天线调整相位，使信号在目标方向增强，在其他方向减弱，提高覆盖和抗干扰。MIMO是Wi-Fi速率提升的核心技术：Wi-Fi 4（802.11n）4x4 MIMO；Wi-Fi 5（802.11ac）8x8 MU-MIMO（下行）；Wi-Fi 6（802.11ax）8x8上下行MU-MIMO+OFDMA；Wi-Fi 7（802.11be）16x16 MU-MIMO。注意：MIMO需要收发双方都支持多天线才能发挥作用，单天线设备无法享受空间复用增益。实际速率受天线数量、信号质量、干扰、设备能力等影响，通常远低于理论值。',
    knowledgeId: 'wlan-wifi6', direction: 'wlan',
  },
  {
    id: 'wlan-d002', type: 'judge',
    question: 'WLAN直接转发（本地转发）模式下，用户数据不经过AC，由AP直接转发到有线网络。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'WLAN数据转发模式：1.直接转发（Direct Forwarding，本地转发Local Switching）：AP直接将用户数据帧（802.11转802.3，根据VLAN标签）转发到有线网络，不经过AC。控制报文（CAPWAP控制隧道）仍经过AC。优点：性能好（数据不经过AC，AC无瓶颈，AP线速转发）、网络拓扑简单、AC故障不影响已有用户数据。缺点：安全策略分散（用户数据不经过AC，AC上的安全策略/内容过滤无法直接应用，需在AP或上游设备配置）。2.隧道转发（Tunnel Forwarding，集中转发Central Switching）：用户数据通过CAPWAP数据隧道（UDP 5247）封装到AC，由AC统一解封装和转发。优点：集中控制（所有用户数据经过AC，可统一应用安全策略、QoS、内容过滤、流量统计）、便于集中管理审计。缺点：AC可能成为性能瓶颈、延迟稍高、AC故障影响所有用户数据。直接转发是当前企业WLAN主流（AC性能通常不足以承载所有用户数据，尤其高密场景），隧道转发适用于需要集中安全控制或小规模场景。华为AC通过forward-mode命令配置（direct/tunnel），可基于VAP模板配置不同SSID使用不同转发模式。直接转发模式下，AP需要配置业务VLAN（用户数据所属VLAN），AP的上行口需允许这些VLAN通过（Trunk/Hybrid）。隧道转发模式下，用户数据在AC上解封装后从AC的业务VLAN接口转发，AP只需管理VLAN连通AC即可。',
    knowledgeId: 'wlan-arch', direction: 'wlan',
  },
  {
    id: 'dcn-d001', type: 'single',
    question: 'VXLAN中，头端复制（Head End Replication）方式处理BUM流量的特点是？',
    options: ['VTEP将BUM流量复制多份单播发给所有同VNI的VTEP，不需要underlay组播', '利用underlay组播树分发，效率高', '只复制给指定VTEP', '丢弃BUM流量'],
    answer: 'VTEP将BUM流量复制多份单播发给所有同VNI的VTEP，不需要underlay组播',
    explanation: 'VXLAN中BUM流量（Broadcast广播、Unknown unicast未知单播、Multicast组播）处理方式：1.头端复制（Head End Replication，HER）：VTEP收到BUM流量后，将报文复制多份，分别单播发送给所有属于同一VNI的远端VTEP（基于头端复制列表，通过EVPN Type 3路由或静态配置学习）。优点：简单，不需要underlay网络支持组播（数据中心underlay通常不启用组播）。缺点：VTEP数量多时复制开销大，带宽浪费（重复发送多份相同报文），头端VTEP压力大。2.组播（Multicast）：利用underlay三层网络的组播树（PIM等）分发BUM流量，每个VNI映射到一个组播组，VTEP加入对应组播组，BUM流量通过组播树分发。优点：效率高（网络自动复制，不重复发送）。缺点：需要underlay支持组播，配置复杂，数据中心underlay通常不启用组播。EVPN环境下通常用头端复制（因为数据中心underlay不启用组播，用BGP EVPN代替），通过EVPN Type 3路由（Inclusive Multicast Ethernet Tag Route）自动发现同VNI的VTEP并构建头端复制列表，无需手动配置。头端复制列表包含所有同VNI的远端VTEP IP地址，VTEP收到BUM流量后遍历列表逐份发送。头端复制是小规模VXLAN部署的常用方式，大规模部署（VTEP数量多）推荐用组播或EVPN+头端复制（EVPN自动维护列表，减少配置，但复制开销仍在）。BUM流量是VXLAN网络的重要开销，控制面学习（EVPN）可减少未知单播泛洪（MAC地址通过控制面同步，无需数据面学习）。',
    knowledgeId: 'dcn-vxlan-basic', direction: 'dcn',
  },
  {
    id: 'dcn-d002', type: 'judge',
    question: 'EVPN作为VXLAN的控制面，通过BGP Type 2路由同步主机MAC和IP地址，无需数据面泛洪学习。',
    options: ['正确', '错误'], answer: '正确',
    explanation: '传统VXLAN（无EVPN）的控制面：数据面学习（Data Plane Learning），VTEP通过泛洪BUM流量和源MAC学习来获取MAC-VTEP映射，类似传统以太网的学习方式，存在泛洪量大、MAC移动检测慢、扩展性差等问题。EVPN（Ethernet VPN，以太网VPN）作为VXLAN的控制面：1.通过BGP（MP-BGP的L2VPN EVPN地址族）在VTEP之间同步主机信息。2.Type 2路由（MAC/IP Advertisement Route）：携带主机的MAC地址、IP地址、VNI、VTEP IP等信息，VTEP收到后直接安装MAC表项和ARP表项，无需数据面泛洪学习。3.控制面学习的优势：减少BUM泛洪（MAC/IP通过控制面同步，无需泛洪学习）、快速收敛（主机移动/故障时通过路由撤销快速更新）、可扩展（BGP控制面支持大规模网络）、支持高级功能（分布式网关、ARP代理、多归接入等）。EVPN其他路由类型：Type 1（ES自动发现，多归接入）、Type 3（VTEP发现/头端复制列表）、Type 4（DF选举，多归接入避免BUM重复）、Type 5（IP前缀路由，分布式网关/外部路由）。EVPN+VXLAN是当前数据中心overlay网络的标准架构（IP Fabric underlay + EVPN/VXLAN overlay），被各大云厂商和企业数据中心广泛采用，替代了传统VXLAN的数据面学习和STP大二层。EVPN最初用于L2VPN（VPWS/VPLS替代），后扩展到VXLAN控制面，成为数据中心网络的核心技术。华为数据中心交换机（CE系列）全面支持EVPN/VXLAN，iMaster NCE-Fabric控制器实现自动化部署。',
    knowledgeId: 'dcn-evpn', direction: 'dcn',
  },
  {
    id: 'dc-d006', type: 'single',
    question: 'MPLS L3VPN中，RD（Route Distinguisher，路由区分符）的作用是？',
    options: ['解决不同VPN用户使用相同IP地址（地址重叠）的问题，使VPNv4地址全局唯一', '控制VPN路由的导入导出', '加密VPN数据', '选择最优VPN路由'],
    answer: '解决不同VPN用户使用相同IP地址（地址重叠）的问题，使VPNv4地址全局唯一',
    explanation: 'MPLS L3VPN中，RD（Route Distinguisher，路由区分符，8字节）的作用：在用户IPv4地址（4字节）前添加RD，形成12字节的VPNv4地址，使不同VPN用户使用相同的IP地址（地址重叠）时，在公网BGP路由表中仍能区分，保证全局唯一。RD格式：Type 0（2字节Type+2字节AS号+4字节分配值，AS:NN）、Type 1（2字节Type+4字节IP地址+2字节分配值，IP:NN）、Type 2（2字节Type+4字节AS号+2字节分配值）。RD只用于区分地址，不用于控制路由的导入导出（控制导入导出的是RT）。RT（Route Target，路由目标，扩展团体属性，8字节）的作用：控制VPN路由的导入导出。导出（Export RT）：PE将VPN路由发布给对端时，标记Export RT；导入（Import RT）：对端PE根据本地VPN实例的Import RT，只导入RT匹配的路由。RT实现VPN间的路由隔离和互通（不同VPN RT不同则隔离，RT相同则互通）。RD和RT配合：RD解决地址重叠（使VPNv4唯一），RT解决路由隔离（控制哪些路由能进入哪个VPN）。一个VPN实例配置一个RD（也可多个，但通常一个），可配置多个Export RT和Import RT（实现一个VPN与多个VPN互通）。PE上为每个VPN创建独立的VPN实例（VPN Instance），有独立的路由表（VRF，VPN Routing and Forwarding）、转发表、接口，实现不同VPN的路由和数据隔离。',
    knowledgeId: 'datacom-mpls-vpn', direction: 'datacom',
  },
  {
    id: 'dc-d007', type: 'judge',
    question: 'IPv6中，SLAAC（无状态地址自动配置）不需要DHCPv6服务器，主机根据RA报文前缀自动生成地址。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'IPv6地址自动配置方式：1.SLAAC（Stateless Address Autoconfiguration，无状态地址自动配置）：主机根据路由器发送的RA（Router Advertisement，路由器通告）报文中的前缀信息（Prefix Information Option），结合自己的接口标识（EUI-64或随机生成），自动生成全球单播IPv6地址，不需要DHCPv6服务器。过程：主机发送RS（Router Solicitation）请求→路由器回复RA（包含前缀、前缀长度、默认网关、MTU、跳数限制等）→主机用前缀+接口标识生成地址→进行DAD（重复地址检测）确认地址唯一→地址可用。SLAAC简单、无状态、扩展性好，但无法分配DNS、域名等其他参数（需RA中的RDNSS/DNSSL选项，或DHCPv6无状态模式补充）。2.DHCPv6有状态模式（Stateful DHCPv6）：DHCPv6服务器分配IPv6地址和其他参数（DNS、域名、SIP服务器等），有状态管理（服务器记录地址分配），适合需要集中管理和精确控制的场景。3.DHCPv6无状态模式（Stateless DHCPv6）：主机用SLAAC生成地址，用DHCPv6获取其他参数（DNS、域名等），结合两者优势。RA报文中的M位（Managed Address Configuration，管理地址配置位）和O位（Other Configuration，其他配置位）决定主机使用哪种方式：M=0,O=0→仅SLAAC；M=0,O=1→SLAAC+无状态DHCPv6；M=1,O=1→有状态DHCPv6。SLAAC是IPv6的特色，简化了地址配置，是IPv6网络的主流方式（尤其家庭和企业网络），DHCPv6用于需要集中管理的场景。EUI-64接口标识：由MAC地址（48位）插入FFFE在中间，并翻转U/L位（第7位）形成64位接口标识，如MAC 00:11:22:33:44:55→EUI-64 02:11:22:FF:FE:33:44:55。为保护隐私，现代操作系统默认使用随机生成的临时接口标识（Privacy Extensions，RFC 4941），而非EUI-64。',
    knowledgeId: 'datacom-ipv6-basic', direction: 'datacom',
  },
'''

idx = content.rfind(']')
new_content = content[:idx] + questions + '\n' + content[idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

count = new_content.count("question: '")
print(f"Inserted batch D, total questions: {count}")
