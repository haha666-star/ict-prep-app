import re

filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\data\quizzes.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

questions = '''
  // ==================== 扩充题库 Batch G ====================
  {
    id: 'dc-g001', type: 'single',
    question: 'OSPF中，以下哪个区域不允许存在ASBR（自治系统边界路由器）？',
    options: ['骨干区域Area 0', '普通区域', 'Stub区域', 'NSSA区域'],
    answer: 'Stub区域',
    explanation: 'OSPF末梢区域限制：1.Stub区域：不允许存在ASBR（不能引入外部路由，因为Stub区域不接收Type 5外部LSA，如果有ASBR引入外部路由，Type 5无法在Stub区域内泛洪，外部路由不可达）。Stub区域内可以有ABR（连接Area 0），但不能有ASBR。2.Totally Stub区域：同样不允许ASBR，比Stub更严格（还不接收Type 3除默认路由）。3.NSSA区域：允许存在ASBR，可以引入外部路由（生成Type 7 LSA，仅在NSSA区域内泛洪，到ABR转换为Type 5）。NSSA就是为了解决Stub区域不能引入外部路由的限制而设计的。4.Totally NSSA区域：允许ASBR（Type 7），但不接收Type 3除默认路由。5.普通区域（非末梢区域）：允许ASBR，接收Type 5外部路由。6.骨干区域Area 0：允许ASBR，是所有区域的中心，必须连续。末梢区域共同限制：a.不能有虚链路（Virtual Link）穿越（虚链路需要Type 5传递，末梢区域过滤Type 5）。b.不能有ASBR（Stub/Totally Stub，NSSA除外）。c.所有路由器必须一致配置为末梢区域（否则邻居关系建立失败，因为末梢区域标志位在Hello报文中携带，两端必须一致）。d.ABR会向末梢区域发布默认路由（Type 3 Summary LSA，0.0.0.0/0），引导外部流量。OSPF区域类型是华为ICT大赛网络赛道的高频考点，需掌握每种区域的特点（允许/不允许的LSA类型、是否允许ASBR、是否有默认路由、适用场景）、配置命令（stub、nssa、stub no-summary、nssa no-summary等）、ABR行为等。注意：NSSA区域的ASBR引入外部路由生成Type 7，ABR将Type 7转换为Type 5发布到其他区域，转换时可设置Metric、Metric-Type、Forwarding Address等。',
    knowledgeId: 'datacom-ospf', direction: 'datacom',
  },
  {
    id: 'dc-g002', type: 'single',
    question: 'BGP中，以下哪个属性是公认必遵（Well-known Mandatory）属性，所有BGP更新必须包含？',
    options: ['Local_Pref', 'MED', 'AS_Path', 'Community'],
    answer: 'AS_Path',
    explanation: 'BGP属性分类：1.公认必遵（Well-known Mandatory）：所有BGP路由器都必须识别，每条更新消息必须包含，缺少则报错。包括：Origin（起源，i/e/?）、AS_Path（AS路径，经过的AS列表，防环+优选）、Next_Hop（下一跳，到达目的的BGP下一跳IP）。2.公认自由决定（Well-known Discretionary）：所有BGP路由器都能识别，但不一定每条更新都包含，可选择是否使用。包括：Local_Pref（本地优先级，影响本AS出站，值大优先，默认100）、Atomic_Aggregate（原子聚合，提示路由被聚合，丢失了具体路由信息）。3.可选过渡（Optional Transitive）：不要求所有路由器识别，但如果不识别，应原样传递给其他邻居（可过渡）。包括：Community（团体，标记一组路由，便于策略控制）、Aggregator（聚合者，指示聚合路由的路由器AS和Router ID）。4.可选非过渡（Optional Non-transitive）：不要求所有路由器识别，如果不识别，可忽略不传递。包括：MED（多出口区分符，影响相邻AS入站，值小优先）、Originator_ID（发起者ID，RR防环）、Cluster_List（簇列表，RR防环）、MP_REACH_NLRI（多协议可达NLRI，MP-BGP扩展，如VPNv4、IPv6）、MP_UNREACH_NLRI（多协议不可达NLRI）、Extended Communities（扩展团体，如RT/RD用于VPN）等。AS_Path是公认必遵属性，作用：1.防环：BGP路由器收到包含自己AS号的AS_Path的路由时，丢弃该路由（防止AS间环路）。2.路由优选：AS_Path越短越优先（BGP优选规则第5条，在Weight、Local_Pref、本地始发之后比较）。3.路径信息：记录路由经过的AS，可用于策略控制（如根据AS_Path过滤或设置属性）。AS_Path类型：AS_SEQUENCE（有序AS列表，最常见）、AS_SET（无序AS集合，聚合路由时使用，防止环路）、AS_CONFED_SEQUENCE/AS_CONFED_SET（联盟内部AS号，不计入AS_Path长度，仅用于联盟内防环）。BGP属性分类是华为ICT大赛网络赛道的考点，需掌握每种属性的分类、作用、默认值、传递范围等。',
    knowledgeId: 'datacom-bgp', direction: 'datacom',
  },
  {
    id: 'dc-g003', type: 'judge',
    question: 'IS-IS中，CSNP（完全序列号报文）由DIS在广播网络中周期性发送，用于数据库同步。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'IS-IS报文类型（PDU，Protocol Data Unit）：1.IIH（IS-to-IS Hello PDU，IS到IS Hello报文）：用于发现和维护邻居关系，类似OSPF的Hello。分为L1 IIH（Level-1，组播01:80:C2:00:00:14）、L2 IIH（Level-2，组播01:80:C2:00:00:15）、P2P IIH（点到点，组播01:80:C2:00:00:13）。IIH携带：System ID、区域地址、优先级、保持时间、接口IP等。2.LSP（Link State PDU，链路状态PDU）：描述路由器的链路状态信息，类似OSPF的LSA。分为L1 LSP和L2 LSP，携带：System ID、序列号、校验和、生存时间、邻居列表、IP前缀、度量值等。LSP在区域内泛洪（L1 LSP在L1区域，L2 LSP在骨干）。3.CSNP（Complete Sequence Number PDU，完全序列号PDU）：包含本地链路状态数据库（LSDB）中所有LSP的摘要（LSP ID、序列号、校验和），用于数据库同步。在广播网络中，DIS（指定中间系统）周期性发送CSNP（默认10秒），其他路由器对比CSNP发现自己缺失的LSP，发送PSNP请求。在点到点网络中，邻居建立后双方互发CSNP（只发一次，不是周期性）。4.PSNP（Partial Sequence Number PDU，部分序列号PDU）：包含部分LSP的摘要，用于：a.请求缺失的LSP（路由器发现CSNP中有自己没有的LSP，发送PSNP请求该LSP）。b.确认收到的LSP（点到点网络中，收到LSP后发送PSNP确认，因为点到点没有DIS泛洪机制，需要显式确认）。CSNP和PSNP是IS-IS数据库同步的核心机制，类似OSPF的DD（数据库描述）、LSR（链路状态请求）、LSU（链路状态更新）、LSAck（链路状态确认）。IS-IS报文直接封装在数据链路层（以太网类型0x88FE），不使用IP协议号或UDP/TCP端口。IS-IS报文类型是华为ICT大赛网络赛道的考点，需掌握每种报文的作用、发送者、周期、与OSPF对应关系等。注意：广播网络中DIS周期性发CSNP（10秒），点到点网络中只在邻居建立时发一次CSNP（后续用PSNP请求和确认）。',
    knowledgeId: 'datacom-isis', direction: 'datacom',
  },
  {
    id: 'dc-g004', type: 'single',
    question: 'MSTP中，MSTI（多生成树实例）的特点是？',
    options: ['每个MSTI独立计算生成树，可映射不同VLAN，实现负载分担', '所有MSTI共享一棵生成树', 'MSTI可以跨MST域', 'MSTI 0是用户自定义实例'],
    answer: '每个MSTI独立计算生成树，可映射不同VLAN，实现负载分担',
    explanation: 'MSTP（Multiple Spanning Tree Protocol，802.1s）中MSTI（Multiple Spanning Tree Instance，多生成树实例）：1.独立计算：每个MSTI独立运行RSTP算法，独立计算生成树，有自己的根桥、根端口、指定端口，互不影响。2.VLAN映射：每个VLAN映射到一个MSTI（一个MSTI可包含多个VLAN，一个VLAN只能属于一个MSTI），映射关系在MST域内一致。3.负载分担：不同VLAN映射到不同MSTI，各MSTI的根桥和拓扑不同，不同VLAN的流量走不同路径，实现链路负载分担（如VLAN 10走MSTI 1，根桥为SW1；VLAN 20走MSTI 2，根桥为SW2，两条上行链路都被利用）。4.仅在域内有效：MSTI仅在MST域内有效，不跨域（域间通过CST公共生成树互通，MST域对外表现为一个虚拟桥）。5.MSTI 0（IST，Internal Spanning Tree，内部生成树）：默认实例，所有未显式映射的VLAN都属于MSTI 0，MSTI 0在域内运行，域间表现为CST的一部分，是MSTP的基础实例（其他MSTI的拓扑基于IST计算）。用户自定义实例为MSTI 1-4094（实际支持数量取决于设备，通常16-64个）。MSTP配置：1.配置MST域：域名（region-name）、修订级别（revision-level）、VLAN-实例映射（instance <id> vlan <vlan-range>）。2.配置MSTI根桥：stp instance <id> root primary（自动设置优先级为4096的倍数，确保成为根桥）/root secondary（备份根桥），或stp instance <id> priority <priority>手动设置优先级。3.配置端口参数：stp instance <id> cost <cost>（路径开销）、stp instance <id> port priority <priority>（端口优先级）。MSTP优势：兼容STP/RSTP、多实例负载分担、减少VLAN场景端口阻塞、提高链路利用率、可扩展性好，是企业网络的主流生成树协议。MSTI是MSTP的核心概念，是华为ICT大赛网络赛道的高频考点，需掌握原理、VLAN映射、负载分担配置、与CST/IST关系、域间互通等。',
    knowledgeId: 'datacom-stp', direction: 'datacom',
  },
  {
    id: 'dc-g005', type: 'single',
    question: '以下关于ACL（访问控制列表）的说法，错误的是？',
    options: ['基本ACL只匹配源IP地址，编号范围2000-2999', '高级ACL可匹配源/目的IP、端口、协议等，编号范围3000-3999', 'ACL规则按顺序匹配，匹配到第一条即执行，不再继续匹配', 'ACL可以直接用于数据转发，不需要被其他功能引用'],
    answer: 'ACL可以直接用于数据转发，不需要被其他功能引用',
    explanation: 'ACL（Access Control List，访问控制列表）：定义一组规则（匹配条件+动作），用于匹配流量，但ACL本身不能直接用于数据转发，必须被其他功能引用才能生效（如流量过滤、QoS、NAT、路由策略、IPSec感兴趣流等）。ACL类型（华为）：1.基本ACL（Basic ACL，编号2000-2999）：只匹配源IP地址，用于粗略过滤（如禁止某个源IP访问）。2.高级ACL（Advanced ACL，编号3000-3999）：可匹配源IP、目的IP、源端口、目的端口、协议号（TCP/UDP/ICMP等）、ICMP类型、DSCP优先级、TCP标志位等，用于精确过滤，是最常用的ACL。3.二层ACL（Layer 2 ACL，编号4000-4999）：匹配源MAC、目的MAC、以太网类型、VLAN ID、802.1p优先级等二层信息。4.用户自定义ACL（User-defined ACL，编号5000-5999）：自定义匹配报文偏移位置和内容，非常灵活但配置复杂。5.命名ACL（Named ACL）：用名称代替编号，便于记忆和管理，可包含基本/高级规则。ACL匹配原则：1.按顺序匹配（Top-Down）：规则按配置顺序从上到下匹配，匹配到第一条规则即执行该规则的动作（permit/deny），不再继续匹配后续规则。2.默认拒绝（Implicit Deny）：所有规则都不匹配时，默认执行deny（拒绝），但具体行为取决于引用ACL的功能（如流量过滤默认拒绝，QoS流分类默认不匹配则不处理）。3.规则ID：每条规则有一个ID（默认步长5，如5、10、15），可在指定ID前插入新规则，便于维护。ACL动作：permit（允许，匹配的流量通过/处理）、deny（拒绝，匹配的流量丢弃/不处理）。ACL应用场景：1.流量过滤（Traffic Filter）：在接口上应用ACL，过滤进出流量（替代传统包过滤防火墙）。2.QoS流分类（Traffic Classifier）：用ACL匹配特定流量，进行QoS处理（限速、标记、队列调度）。3.NAT：用ACL匹配需要NAT转换的流量（源NAT的ACL）。4.路由策略（Route-Policy）：用ACL匹配路由，进行路由过滤或属性修改。5.IPSec感兴趣流：用ACL定义需要IPSec保护的流量。6.用户登录控制：用ACL限制Telnet/SSH/HTTP管理访问的源IP。ACL是华为ICT大赛网络赛道的基础考点，需掌握类型、编号范围、匹配原则、配置、应用场景等。注意：ACL本身不生效，必须被引用；高级ACL可匹配五元组，是最常用的；规则顺序很重要（精确规则放上面，宽泛规则放下面）。',
    knowledgeId: 'datacom-acl', direction: 'datacom',
  },
  {
    id: 'sec-g001', type: 'single',
    question: '防火墙中，双机热备（HRP）的主备切换机制中，以下哪个说法是错误的？',
    options: ['主设备故障时，备设备自动切换为主，保证业务不中断', '主备设备之间通过心跳线同步会话表和配置', '主备切换时所有会话都需要重新建立', '支持负载分担模式（两台设备同时转发，互为备份）'],
    answer: '主备切换时所有会话都需要重新建立',
    explanation: '防火墙双机热备（HRP，Huawei Redundancy Protocol，华为冗余协议）：1.主备模式（Active/Standby）：一台主设备（Active）转发流量，一台备设备（Standby）不转发，实时同步会话表和配置。主设备故障时，备设备自动切换为主（毫秒级，VGMP统一管理），由于会话表已同步，已有会话不需要重新建立，业务不中断（用户无感知）。2.负载分担模式（Active/Active）：两台设备同时转发流量（各自承担一部分流量），互为备份，一台故障时另一台接管所有流量，会话表实时同步。3.心跳线（Heartbeat）：主备设备之间通过专用心跳线（或业务口复用）同步：a.配置同步（主设备配置自动同步到备设备，命令hrp auto-sync config）。b.会话表同步（实时同步新建会话，主备切换时已有会话不中断）。c.状态同步（接口状态、VLAN状态、ARP表、MAC表、Server-Map表等）。4.VGMP（VRRP Group Management Protocol，VRRP组管理协议）：统一管理多个VRRP组（主备状态一致，避免部分组主部分组备导致的异常），监控接口/链路状态，故障时触发主备切换。5.主备切换触发条件：a.主设备整机故障（断电/死机）。b.主设备上行/下行接口故障（监控接口，故障时降低优先级触发切换）。c.主设备业务板卡故障。d.手动强制切换（hrp switch active/standby）。6.会话表同步：HRP实时同步会话表（包括TCP/UDP/ICMP会话、NAT转换信息、ASPF动态会话等），主备切换时已有会话保持，不需要重新建立，保证业务不中断。这是防火墙双机热备的关键优势（与路由器VRRP不同，VRRP只切换网关，会话表不同步，TCP会话可能中断）。注意：某些状态无法同步（如正在进行的IKE协商、部分动态协议状态），切换时可能需要重新建立，但已建立的IPSec SA和会话会同步。双机热备是华为ICT大赛安全赛道的高频考点，需掌握主备/负载分担模式、心跳线、VGMP、会话同步、切换触发、配置等。',
    knowledgeId: 'security-ha', direction: 'security',
  },
  {
    id: 'sec-g002', type: 'single',
    question: 'IPSec中，IKEv2相比IKEv1的主要改进不包括？',
    options: ['握手消息更少（4条vs6+3条），更快', '支持MOBIKE（移动性，IP变化时保持连接）', '更安全（抵抗DoS攻击、Cookie验证）', '支持更多加密算法'],
    answer: '支持更多加密算法',
    explanation: 'IKEv2（Internet Key Exchange version 2，RFC 7296）相比IKEv1的改进：1.握手更简单快速：IKEv2只需4条消息（IKE_SA_INIT 2条+IKE_AUTH 2条）同时建立IKE SA和第一个IPSec SA，而IKEv1需要主模式6条+快速模式3条=9条（野蛮模式3条+快速模式3条=6条）。IKEv2建立连接更快，延迟更低。2.更安全：a.抵抗DoS攻击：IKEv2在IKE_SA_INIT响应中包含Cookie，请求方必须在后续消息中返回Cookie，防止伪造源IP的DoS攻击（IKEv1主模式没有这个机制，容易被DoS）。b.更强的密钥派生：IKEv2使用更安全的密钥派生函数（SK_d/SK_a/SK_e分离），密钥更新更安全。c.内置NAT-T检测：IKEv2内置NAT穿越检测，IKEv1需要额外协商。3.支持MOBIKE（Mobility and Multihoming，移动性和多宿主，RFC 4555）：IKEv2扩展支持MOBIKE，当客户端IP地址变化时（如Wi-Fi切换到4G、移动设备移动），保持IPSec连接不中断，不需要重新协商。IKEv1不支持MOBIKE，IP变化时连接中断需重新建立。4.可靠性更高：IKEv2所有消息都有确认机制（请求/响应配对，Message ID），丢失时重传，IKEv1阶段二没有可靠传输（快速模式消息丢失可能导致SA不一致）。5.支持更多功能：IKEv2支持EAP认证（可扩展认证协议，如EAP-TLS、EAP-MSCHAPv2，与802.1X/RADIUS集成）、支持初始联系人（Initial Contact，删除旧SA）、支持配置载荷（Configuration Payload，分配IP/DNS，用于远程接入VPN）。加密算法方面：IKEv1和IKEv2都支持相同的加密算法（AES、3DES、DES、SM4等）、认证算法（SHA-256、SHA-1、MD5、SM3等）、DH组（1/2/5/14/19/20/21等），IKEv2并不支持更多加密算法（算法是独立的，不是IKE版本决定的）。IKEv2是当前推荐使用的IKE版本（更安全、更快、更可靠、支持移动性），华为防火墙和路由器都支持IKEv2，是华为ICT大赛安全赛道的考点，需掌握IKEv1与IKEv2的区别、IKEv2优势、MOBIKE、EAP认证等。',
    knowledgeId: 'security-ipsec', direction: 'security',
  },
  {
    id: 'sec-g003', type: 'judge',
    question: '防火墙中，UTM（统一威胁管理）功能包括IPS、反病毒、URL过滤、应用控制等，都在防火墙设备上集成实现。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'UTM（Unified Threat Management，统一威胁管理）：将多种安全功能集成在一台防火墙设备上，统一管理和处理，替代传统的多台独立安全设备（防火墙+IDS+防毒墙+URL过滤网关等）。UTM功能包括：1.IPS（Intrusion Prevention System，入侵防御系统）：检测和阻断网络攻击（漏洞利用、缓冲区溢出、SQL注入、XSS、扫描、暴力破解等），基于特征匹配和协议分析，实时阻断攻击。2.反病毒（Antivirus，AV）：检测和清除文件中的病毒、木马、蠕虫、恶意软件，基于病毒特征库和启发式分析，支持HTTP/FTP/SMTP/POP3/IMAP等协议的文件扫描。3.URL过滤（URL Filtering）：根据URL分类库（如赌博、暴力、社交、娱乐等）控制用户访问的网站，提高工作效率、防止恶意网站、满足合规要求。4.应用控制（Application Control）：基于DPI（深度包检测）识别应用（如微信、抖音、BT下载、在线视频等），控制应用的使用（禁止/限速/记录），比传统端口控制更精确（应用可使用非标准端口）。5.内容过滤（Content Filtering）：过滤网页内容、邮件内容、文件类型等（如禁止上传特定文件类型、过滤敏感关键词）。6.数据防泄漏（DLP，Data Loss Prevention）：检测和防止敏感数据（如身份证号、银行卡号、商业机密）外泄。7.威胁情报（Threat Intelligence）：基于云威胁情报，实时检测最新威胁（C2服务器、恶意IP、恶意域名）。NGFW（Next-Generation Firewall，下一代防火墙）= 传统防火墙（状态检测+ACL+NAT+VPN）+ UTM功能（IPS/AV/URL过滤/应用控制）+ 应用识别+ 用户识别+ 深度集成，是当前企业网络边界安全的主流设备。华为USG系列防火墙支持UTM功能，通过 license 激活（部分功能需要license和特征库升级服务）。UTM处理流程：流量先经过防火墙基础处理（状态检测、安全策略、NAT），匹配安全策略后，如果策略引用了UTM配置文件（IPS/AV/URL过滤等），则进入UTM引擎进行深度检测，检测通过后转发，发现威胁则阻断/告警。UTM是华为ICT大赛安全赛道的重要考点，需掌握各UTM功能的原理、配置、与安全策略关系、性能影响（UTM深度检测会降低转发性能，需考虑设备性能）等。注意：UTM功能需要特征库定期升级（IPS特征库、病毒库、URL分类库），才能检测最新威胁，通常需要订阅服务。',
    knowledgeId: 'security-utm', direction: 'security',
  },
  {
    id: 'sec-g004', type: 'single',
    question: '以下关于数字证书（Digital Certificate）的说法，错误的是？',
    options: ['数字证书由CA签发，证明公钥与身份的绑定关系', '数字证书格式遵循X.509标准', '数字证书可以无限期使用，不会过期', '验证证书时需要验证CA签名、有效期、是否被撤销'],
    answer: '数字证书可以无限期使用，不会过期',
    explanation: '数字证书（Digital Certificate）：由CA（Certificate Authority，证书颁发机构）签发，将用户/设备的公钥与其身份（姓名、组织、域名、邮箱等）绑定，用CA的私钥签名，证明公钥的合法性和所有者身份。1.格式标准：X.509 v3标准（最常用），包含：版本（Version）、序列号（Serial Number，CA内唯一）、签名算法（Signature Algorithm，如SHA256withRSA、SM3withSM2）、颁发者（Issuer，CA的DN）、有效期（Validity，Not Before+Not After，有明确的起止时间，不是无限期）、主体（Subject，证书所有者的DN）、主体公钥信息（Subject Public Key Info，公钥算法+公钥）、扩展（Extensions，如密钥用法、增强型密钥用法、主题备用名称SAN、CRL分发点、颁发者信息访问等）、签名（CA的签名值）。2.有效期：数字证书有明确的有效期（Not Before到Not After），过期后证书失效，需要更新（renew）。常见有效期：SSL/TLS服务器证书1年（CA/B论坛规定最长1年）、代码签名证书1-3年、个人邮件证书1年、设备证书可更长（如3-5年）、根证书有效期通常10-20年（根证书是信任锚点，自签名，有效期长）。3.证书验证：验证数字证书时需要：a.验证CA签名（用CA的公钥验证证书签名，确保证书未被篡改，确实由该CA签发）。b.验证有效期（当前时间在Not Before和Not After之间，证书未过期）。c.验证是否被撤销（检查CRL证书撤销列表或OCSP在线证书状态协议，确认证书未被CA提前撤销，如私钥泄露、身份变更等）。d.验证证书用途（密钥用法/增强型密钥用法是否匹配，如服务器认证证书不能用于代码签名）。e.验证证书链（从终端证书到根证书，逐级验证，确保信任链完整）。f.验证主体身份（域名/名称是否匹配，如访问https://www.example.com，证书的CN或SAN必须包含www.example.com）。4.证书撤销：证书在有效期内可能被提前撤销（如私钥泄露、员工离职、域名变更等），通过CRL（Certificate Revocation List，证书撤销列表，CA定期发布）或OCSP（Online Certificate Status Protocol，在线证书状态协议，实时查询）查询。数字证书是PKI（公钥基础设施）的核心，应用于HTTPS/TLS、IPSec、802.1X（EAP-TLS）、代码签名、电子邮件加密（S/MIME）、电子签名、VPN等。数字证书是华为ICT大赛安全赛道的考点，需掌握X.509格式、CA、有效期、验证过程、撤销机制、PKI应用等。注意：证书不是无限期的，必须定期更新；根证书通常预装在操作系统/浏览器中，作为信任锚点。',
    knowledgeId: 'security-pki', direction: 'security',
  },
'''

idx = content.rfind(']')
new_content = content[:idx] + questions + '\n' + content[idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

count = new_content.count("question: '")
print(f"Inserted batch G, total questions: {count}")
