import re

filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\data\quizzes.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

questions = '''
  // ==================== 扩充题库 Batch C ====================
  {
    id: 'dc-c001', type: 'single',
    question: 'OSPF中，ABR（区域边界路由器）的定义是？',
    options: ['连接不同区域的路由器，至少一个接口在骨干区域Area 0', '只在骨干区域的路由器', '引入外部路由的路由器', 'DR路由器'],
    answer: '连接不同区域的路由器，至少一个接口在骨干区域Area 0',
    explanation: 'ABR（Area Border Router，区域边界路由器）：同时连接多个OSPF区域，且至少有一个接口在骨干区域（Area 0）的路由器。ABR维护每个连接区域的独立LSDB，负责将本区域的Type 1/2 LSA汇总为Type 3 Summary LSA发布到其他区域，将其他区域的Type 3汇总后发布到本区域。ABR是区域间路由的桥梁。ASBR（AS Boundary Router，自治系统边界路由器）：引入外部路由（其他协议/静态/直连）到OSPF的路由器，生成Type 5 LSA，可在任意区域。DR（Designated Router，指定路由器）：广播网络中选举，负责生成Type 2 LSA和泛洪。骨干路由器：至少一个接口在Area 0的路由器（ABR也是骨干路由器）。内部路由器：所有接口都在同一区域的路由器。',
    knowledgeId: 'datacom-ospf', direction: 'datacom',
  },
  {
    id: 'dc-c002', type: 'single',
    question: 'BGP中，IBGP邻居之间为什么不传递从其他IBGP学到的路由？',
    options: ['防止AS内环路（IBGP水平分割）', '性能考虑', '安全考虑', '协议bug'],
    answer: '防止AS内环路（IBGP水平分割）',
    explanation: 'BGP的IBGP水平分割（Split Horizon）规则：从IBGP邻居学到的路由，不再传递给其他IBGP邻居。这是为了防止AS内环路（因为BGP路由的AS_Path在AS内不变化，无法通过AS_Path检测AS内环路）。这导致IBGP邻居需要全互联（Full Mesh）才能让所有路由器学到所有路由，n台路由器需要n(n-1)/2条IBGP邻居，扩展性差。解决方案：1.路由反射器（RR，Route Reflector）：RR将从客户端学到的路由反射给其他客户端和非客户端，打破全互联限制。2.联盟（Confederation）：将一个大AS划分为多个子AS，子AS间用EBGP关系，子AS内用IBGP，减少全互联数量。3.两者结合使用。EBGP邻居之间没有水平分割限制（AS_Path会变化，可检测环路），从EBGP学到的路由可传递给所有IBGP和EBGP邻居。',
    knowledgeId: 'datacom-bgp', direction: 'datacom',
  },
  {
    id: 'dc-c003', type: 'judge',
    question: 'IS-IS中，NET（网络实体标题）的System ID占6字节，同一区域内必须唯一。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'NET（Network Entity Title，网络实体标题）是IS-IS路由器的网络层地址，格式：Area ID（1-13字节）+ System ID（6字节）+ NSEL（1字节，值为00表示路由器本身）。System ID（系统ID）6字节，唯一标识一个路由器，同一区域内必须唯一（不同区域System ID可以相同，但建议全局唯一）。System ID通常由IP地址转换而来（如192.168.001.001→1921.6800.1001），或用MAC地址，或手动配置。Area ID标识区域，同一L1区域内Area ID必须相同。NET长度8-20字节，通常10字节（Area ID 3字节+System ID 6字节+NSEL 1字节）。一台路由器可配置多个NET（最多3个），System ID必须相同，Area ID可不同（用于区域迁移）。NSEL为00表示IS本身，非00表示主机或特定服务。',
    knowledgeId: 'datacom-isis', direction: 'datacom',
  },
  {
    id: 'dc-c004', type: 'single',
    question: 'MSTP中，不同MST域之间通过什么实现互通？',
    options: ['CST（公共生成树）', 'MSTI', 'IST', 'RSTP'],
    answer: 'CST（公共生成树）',
    explanation: 'MSTP（Multiple Spanning Tree Protocol，802.1s）中：1.MSTI（Multiple Spanning Tree Instance，多生成树实例）：MST域内的生成树实例，每个MSTI独立计算，可映射不同VLAN，实现负载分担。MSTI仅在域内有效，不跨域。2.IST（Internal Spanning Tree，内部生成树，MSTI 0）：MST域内的默认生成树实例，所有VLAN默认映射到IST，IST在域内运行，域间表现为CST的一部分。3.CST（Common Spanning Tree，公共生成树）：在整个交换网络（不同MST域和STP/RSTP域）中形成的一棵公共生成树，将每个MST域视为一个虚拟桥，域间运行CST，确保域间无环路。4.CIST（Common and Internal Spanning Tree，公共和内部生成树）：CIST = CST（域间）+ IST（域内MSTI 0），是整个网络的总生成树。MST域判定条件：域名（Configuration Name）、修订级别（Revision Level）、VLAN-实例映射关系三者完全相同。MSTP兼容STP/RSTP，与STP/RSTP设备互联时，MSTP端口发送STP/RSTP BPDU实现互通。MSTP优势：兼容STP/RSTP、多实例负载分担、减少VLAN场景端口阻塞、提高链路利用率，是企业网络主流生成树协议。',
    knowledgeId: 'datacom-stp', direction: 'datacom',
  },
  {
    id: 'dc-c005', type: 'single',
    question: 'QinQ（802.1Q-in-802.1Q）技术的主要作用是？',
    options: ['扩展VLAN数量（4094*4094），用于运营商网络', '加密VLAN标签', '提高VLAN转发速度', '减少VLAN标签长度'],
    answer: '扩展VLAN数量（4094*4094），用于运营商网络',
    explanation: 'QinQ（802.1Q-in-802.1Q，也叫VLAN Stacking，VLAN堆叠）：在用户的802.1Q标签（内层标签，C-Tag，Customer Tag）外再添加一层802.1Q标签（外层标签，S-Tag，Service Tag，运营商标签），形成两层标签。作用：1.扩展VLAN数量：外层4094*内层4094≈1600万个VLAN，解决公网VLAN ID不足问题。2.用户隔离：不同用户使用不同外层VLAN（S-Tag），内层VLAN（C-Tag）用户可自由规划，用户间二层隔离。3.节省公网VLAN资源：运营商只需分配外层VLAN，内层VLAN由用户管理。4.便于批量管理：按外层VLAN对用户流量进行QoS、统计、策略控制。QinQ封装：用户帧带C-Tag进入运营商网络，PE设备添加S-Tag（外层），在公网中按S-Tag转发，到达对端PE后剥离S-Tag，恢复用户原始帧。QinQ类型：1.基本QinQ（基于端口）：端口收到的所有帧都添加相同外层VLAN。2.灵活QinQ（基于流）：根据内层VLAN、优先级、协议等添加不同外层VLAN，更灵活。QinQ与VXLAN对比：QinQ是二层标签堆叠，扩展性有限（1600万），适合运营商二层专线；VXLAN是MAC-in-UDP封装，扩展性更强（1600万VNI），适合数据中心大二层和多租户。',
    knowledgeId: 'datacom-vlan', direction: 'datacom',
  },
  {
    id: 'sec-c001', type: 'single',
    question: '防火墙状态检测（Stateful Inspection）的核心是？',
    options: ['基于ACL逐条过滤每个报文', '维护会话表，只检查首包，后续包按会话表转发', '基于应用层内容过滤', '基于IP地址黑名单'],
    answer: '维护会话表，只检查首包，后续包按会话表转发',
    explanation: '状态检测（Stateful Inspection，也叫状态包过滤）是现代防火墙的核心技术：1.首包检查：当新连接的第一个报文到达时，防火墙根据安全策略（源/目的IP、端口、协议、应用、用户、时间等）判断是否允许，允许则创建会话表项（Session Table），记录五元组、状态、超时、NAT信息、字节/包统计等。2.后续包快速转发：同一会话的后续报文直接匹配会话表转发，无需再次匹配安全策略，性能高（基于硬件ASIC/NP芯片线速转发）。3.状态跟踪：跟踪协议状态（TCP三次握手/四次挥手、UDP会话、ICMP请求/响应、应用层协议状态如FTP动态端口），检测异常报文（如未建立连接直接发数据、非法TCP标志位），防止应用层攻击。4.会话超时：不同协议/状态有不同超时时间（TCP ESTABLISHED通常1200秒，UDP 120秒，ICMP 20秒），超时后删除会话表项。状态检测相比包过滤（ACL逐条过滤）的优势：性能高（后续包不查策略）、安全性高（检测协议状态和异常）、支持应用层协议（ASPF检测动态端口）。华为防火墙状态检测：默认开启，支持TCP/UDP/ICMP/SCTP等协议状态检测，支持ASPF（应用层包过滤）检测FTP、SIP、H.323、RTSP、DNS等应用层协议，自动开放动态端口。会话表数量是防火墙重要性能指标（并发连接数），每秒新建连接数（CPS）也是关键指标。',
    knowledgeId: 'security-firewall-basic', direction: 'security',
  },
  {
    id: 'sec-c002', type: 'single',
    question: 'IPSec NAT穿越（NAT-T）使用的端口号是？',
    options: ['UDP 500', 'UDP 4500', 'TCP 179', 'UDP 4789'],
    answer: 'UDP 4500',
    explanation: 'IPSec NAT穿越（NAT Traversal，NAT-T）：当IPSec VPN路径中存在NAT设备时，ESP（IP协议号50）和AH（协议号51）无法通过NAT（NAT只能处理TCP/UDP/ICMP，无法修改ESP/AH的校验和，且ESP加密后NAT无法识别）。NAT-T将ESP报文封装在UDP报文中（端口4500），使ESP能通过NAT设备。NAT-T工作过程：1.IKE协商阶段一（主模式/野蛮模式）使用UDP 500端口，双方通过NAT-D载荷（NAT Discovery）检测路径中是否存在NAT，以及哪一端在NAT后。2.检测到NAT后，IKE协商切换到UDP 4500端口（阶段一后续消息和阶段二快速模式都用4500）。3.IPSec数据报文（ESP）封装在UDP 4500报文中传输，NAT设备能正常处理（修改UDP端口和IP）。4.对端收到后剥离UDP头，恢复ESP报文，正常解密。NAT-T注意：1.只能用ESP，不能用AH（AH认证整个IP头，NAT修改IP头会导致认证失败）。2.传输模式下NAT-T有限制（ESP传输模式不加密IP头，NAT修改IP头可能影响上层校验和），隧道模式更适合NAT-T。3.NAT设备需要支持ESP的ALG或直接放行UDP 4500。4.华为防火墙默认开启NAT-T，可通过nat traversal命令控制。其他端口：UDP 500是IKE默认端口（无NAT时），TCP 179是BGP，UDP 4789是VXLAN。IPSec VPN在NAT场景下（如家庭宽带、移动网络）必须使用NAT-T，否则无法建立连接。',
    knowledgeId: 'security-ipsec', direction: 'security',
  },
  {
    id: 'sec-c003', type: 'judge',
    question: 'ARP欺骗（ARP Spoofing）通过发送伪造的ARP响应，将网关MAC地址替换为攻击者MAC，实现中间人攻击。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'ARP欺骗（ARP Spoofing/ARP Poisoning，ARP投毒）：攻击者在局域网内发送伪造的ARP响应报文（免费ARP或响应ARP请求），将目标IP（如网关IP）对应的MAC地址替换为攻击者的MAC地址。受害主机的ARP表被污染，将本应发给网关的流量发给攻击者，攻击者可嗅探、篡改、中断流量，实现中间人攻击（MITM）。ARP协议无认证机制，任何主机都可发送ARP响应，主机默认信任收到的ARP响应并更新ARP表，这是ARP欺骗的根本原因。防御方法：1.静态ARP绑定：在主机/交换机上静态绑定IP-MAC，不动态学习。2.DAI（Dynamic ARP Inspection，动态ARP检测）：交换机结合DHCP Snooping绑定表，检查ARP报文的IP-MAC是否合法，丢弃伪造ARP。3.DHCP Snooping：记录合法IP-MAC-端口绑定，为DAI提供依据。4.端口安全（Port Security）：限制端口MAC地址数量，防止MAC泛洪。5.ARP网关保护：在交换机上配置网关IP-MAC静态绑定，防止网关被欺骗。6.私有VLAN（PVLAN）：隔离主机间二层通信，防止ARP欺骗扩散。7.加密协议：使用HTTPS/SSH等加密协议，即使被嗅探也无法解密内容。其他二层攻击：MAC泛洪（CAM表溢出，使交换机退化为集线器）、DHCP欺骗（伪造DHCP服务器分配错误网关/DNS）、STP攻击（伪造BPDU抢占根桥）、VLAN跳跃（Double Tagging/Switch Spoofing）等。',
    knowledgeId: 'security-attack-defense', direction: 'security',
  },
  {
    id: 'sec-c004', type: 'single',
    question: '数字签名（Digital Signature）的实现原理是？',
    options: ['用私钥对消息摘要加密，接收方用公钥验证', '用公钥对消息加密，接收方用私钥解密', '用对称密钥加密消息', '用哈希算法生成摘要'],
    answer: '用私钥对消息摘要加密，接收方用公钥验证',
    explanation: '数字签名（Digital Signature）实现原理：1.发送方对原始消息计算哈希摘要（如SHA-256、SM3），得到固定长度摘要。2.发送方用自己的私钥（Private Key）对摘要加密（签名），生成数字签名。3.发送方将原始消息+数字签名一起发给接收方。4.接收方用发送方的公钥（Public Key）解密数字签名，得到摘要A。5.接收方对收到的原始消息计算哈希摘要，得到摘要B。6.比较摘要A和摘要B，相同则验证通过（消息未被篡改，且确实由私钥持有者发送）。数字签名的特性：1.身份认证（Authentication）：只有私钥持有者能生成签名，公钥能验证，证明发送者身份。2.完整性（Integrity）：消息被篡改后摘要变化，签名验证失败。3.不可否认（Non-repudiation）：发送方不能否认发送过该消息（私钥只有自己有）。数字签名与加密的区别：加密用公钥加密私钥解密（保证机密性，只有接收方能解密），签名用私钥加密公钥验证（保证身份和完整性，任何人都能验证）。常见数字签名算法：RSA、DSA、ECDSA（椭圆曲线）、SM2（国密）、Ed25519。数字签名应用：HTTPS/TLS证书验证、软件代码签名、电子邮件（S/MIME）、电子合同/电子签名、区块链、VPN认证（IPSec数字证书认证）等。PKI体系中，CA用自己的私钥对数字证书签名，用户用CA公钥验证证书合法性，这也是数字签名的典型应用。',
    knowledgeId: 'security-crypto', direction: 'security',
  },
  {
    id: 'wlan-c001', type: 'single',
    question: 'WLAN中，CAPWAP协议的作用是？',
    options: ['AP与AC之间的通信协议，用于控制管理和数据隧道', '无线加密协议', '射频管理协议', '用户认证协议'],
    answer: 'AP与AC之间的通信协议，用于控制管理和数据隧道',
    explanation: 'CAPWAP（Control And Provisioning of Wireless Access Points，无线接入点控制与供应协议，RFC 5415）是FIT AP架构中AP与AC之间的通信协议，基于UDP。CAPWAP两个隧道：1.控制隧道（Control Tunnel）：UDP 5246端口，使用DTLS加密，传输AP与AC之间的控制报文（配置下发、状态上报、固件升级、漫游管理、统计信息等）。2.数据隧道（Data Tunnel）：UDP 5247端口，可选DTLS加密，传输用户数据报文（隧道转发模式下，用户数据通过CAPWAP数据隧道封装到AC转发）。CAPWAP协议功能：1.AP发现AC（Discover/Join）。2.AP配置管理（配置下发、配置更新）。3.AP固件管理（版本升级、版本回退）。4.用户数据转发（隧道转发模式）。5.漫游管理（跨AC漫游时上下文同步）。6.状态监控和统计（AP状态、射频状态、用户统计、性能统计）。7.安全控制（DTLS加密、接入控制）。AP上线流程：获取IP（DHCP/静态）→发现AC（广播/DHCP Option43/DNS/静态）→建立CAPWAP控制隧道（Discover→Join→Configure→Data Check→Run）→下载版本（如需）→下载配置→正常工作。CAPWAP与LWAPP（Lightweight Access Point Protocol，Cisco私有）类似，CAPWAP是IETF标准，更通用。华为AC支持CAPWAP，可配置CAPWAP源接口（AC的源IP）、隧道加密（DTLS）、数据转发模式（直接/隧道）等。CAPWAP控制隧道必须建立，数据隧道仅在隧道转发模式下建立（直接转发模式不建立数据隧道，用户数据由AP直接转发）。',
    knowledgeId: 'wlan-arch', direction: 'wlan',
  },
  {
    id: 'wlan-c002', type: 'judge',
    question: 'WLAN中，5GHz频段相比2.4GHz频段，信道更多、干扰更小、速率更高，但穿墙能力更弱。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'WLAN两个主要频段对比：2.4GHz频段：1.优点：穿墙能力强（频率低波长长，绕射能力强）、覆盖范围大、兼容性好（所有Wi-Fi设备都支持）。2.缺点：信道少（中国常用1、6、11三个不重叠信道，共13个信道）、干扰大（蓝牙、微波炉、无线鼠标、邻居Wi-Fi都用2.4G）、速率低（802.11n最高600Mbps，实际更低）、拥塞严重。5GHz频段：1.优点：信道多（中国支持36-64、149-165等多个不重叠信道，802.11ac支持20/40/80/160MHz带宽）、干扰小（使用设备少，非Wi-Fi干扰少）、速率高（802.11ac最高3.5Gbps，802.11ax更高）、延迟低。2.缺点：穿墙能力弱（频率高波长短，穿透损耗大，混凝土墙衰减严重）、覆盖范围小（需更多AP）、兼容性（老设备可能不支持5G）。6GHz频段（Wi-Fi 6E）：信道更多更宽（支持160MHz连续信道）、几乎无干扰（新频段）、速率更高，但穿墙能力更弱，覆盖更小，需新设备支持。企业WLAN部署：1.双频AP同时提供2.4G和5G，频谱导航（Band Steering）引导双频终端优先连接5G（减轻2.4G拥塞）。2.高密度场景（会议室、体育场）优先5G，2.4G仅用于老设备和IoT。3.覆盖设计：5G按覆盖设计（需更多AP），2.4G按容量设计（可能需要降低功率避免干扰）。4.信道规划：2.4G用1/6/11蜂窝部署，5G用更多信道复用（如36/40/44/48、149/153/157/161）。5.功率调整：2.4G功率适当降低（避免远距离关联和干扰），5G功率适当提高（保证覆盖）。',
    knowledgeId: 'wlan-rf', direction: 'wlan',
  },
  {
    id: 'dcn-c001', type: 'single',
    question: 'VXLAN中，VTEP（VXLAN隧道端点）的功能不包括？',
    options: ['VXLAN封装和解封装', '维护MAC-VTEP映射表', '路由计算（OSPF/BGP）', '用户认证'],
    answer: '用户认证',
    explanation: 'VTEP（VXLAN Tunnel End Point，VXLAN隧道端点）是VXLAN网络的边缘设备，负责VXLAN封装和解封装，功能包括：1.VXLAN封装：收到虚拟机/服务器的二层帧后，根据目的MAC查找MAC-VTEP映射表，封装VXLAN头（VNI）+UDP头+外层IP头（源VTEP IP，目的VTEP IP），通过underlay三层网络转发。2.VXLAN解封装：收到VXLAN报文后，剥离外层IP/UDP/VXLAN头，恢复原始二层帧，根据目的MAC转发到对应虚拟机/服务器。3.维护MAC-VTEP映射表：记录虚拟机MAC地址与所属VTEP IP的映射关系，用于封装时确定目的VTEP。映射表学习方式：数据面学习（泛洪+学习，传统VXLAN）或控制面学习（EVPN Type 2路由，EVPN/VXLAN）。4.BUM流量处理：广播、未知单播、组播流量通过头端复制（HER）或组播方式转发给同VNI的所有VTEP。5.二层/三层网关：VTEP可作为二层网关（同VNI转发）或三层网关（分布式网关/集中式网关，跨VNI/子网路由）。6.隧道管理：建立和维护VXLAN隧道，支持隧道冗余和负载分担。用户认证不是VTEP的功能（用户认证由接入交换机、防火墙、AAA服务器等完成）。VTEP可在物理交换机（硬件VTEP，性能高）、虚拟交换机vSwitch（软件VTEP，如OVS，灵活但性能低）、服务器网卡（智能网卡SmartNIC，卸载VXLAN封装，降低CPU开销）上实现。VXLAN网络模型：VTEP之间通过underlay三层网络（IP Fabric，运行OSPF/IS-IS/BGP）建立VXLAN隧道，overlay网络（VXLAN）为虚拟机提供大二层网络。VNI标识VXLAN网段，不同VNI二层隔离，类似VLAN。',
    knowledgeId: 'dcn-vxlan-basic', direction: 'dcn',
  },
  {
    id: 'dcn-c002', type: 'judge',
    question: '分布式网关（Distributed Gateway）中，每台Leaf都是网关，虚拟机的默认网关在本地Leaf上，跨子网流量在源Leaf直接路由。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'VXLAN/EVPN网络中，三层网关有两种模式：1.集中式网关（Centralized Gateway）：所有VNI的三层网关都在一台设备上（通常是Spine或专用网关设备），虚拟机的默认网关指向集中网关。跨子网流量路径：源虚拟机→源Leaf（二层封装VXLAN）→集中网关（解封装，三层路由，重新封装VXLAN）→目的Leaf→目的虚拟机。优点：网关集中管理，配置简单，便于策略控制。缺点：集中网关是性能瓶颈和单点故障，跨子网流量绕行（经过集中网关），延迟高，东西向流量效率低。2.分布式网关（Distributed Gateway）：每台Leaf都是所有VNI的三层网关，虚拟机的默认网关在本地Leaf上（Anycast Gateway，任播网关，所有Leaf的网关IP和MAC相同）。跨子网流量路径：源虚拟机→源Leaf（本地三层路由，直接封装VXLAN到目的Leaf）→目的Leaf→目的虚拟机。流量在源Leaf直接路由，无需绕行集中网关，延迟低，效率高，无瓶颈和单点故障。分布式网关通过EVPN Type 2路由（携带主机IP）同步主机路由，每台Leaf学习到所有虚拟机的IP-VTEP映射，跨子网时直接查主机路由封装到目的Leaf。分布式网关是数据中心VXLAN/EVPN的主流方案，适合东西向流量大的数据中心。Anycast Gateway（任播网关）：所有Leaf的三层网关IP和MAC地址相同，虚拟机无论迁移到哪台Leaf，默认网关都不变，无需重新配置，实现无缝迁移。集中式网关适合小型数据中心或需要集中安全策略的场景，分布式网关适合中大型数据中心和东西向流量为主的场景。',
    knowledgeId: 'dcn-vxlan-gateway', direction: 'dcn',
  },
  {
    id: 'dc-c006', type: 'single',
    question: 'BFD（双向转发检测）的主要作用是？',
    options: ['快速检测链路故障（毫秒级），联动路由协议快速收敛', '加密链路数据', '负载均衡', '流量整形'],
    answer: '快速检测链路故障（毫秒级），联动路由协议快速收敛',
    explanation: 'BFD（Bidirectional Forwarding Detection，双向转发检测）是一种快速故障检测协议，能在毫秒级（通常50ms-1s）检测到链路或设备故障，比传统路由协议的Hello检测（OSPF默认40秒死亡时间，IS-IS默认30秒）快得多。BFD特点：1.快速检测：最小可配置3.3ms间隔，检测时间<100ms，实现亚秒级收敛。2.与协议无关：BFD本身不负责路由计算，只负责故障检测，可与OSPF、IS-IS、BGP、静态路由、VRRP、MPLS LSP、PWE3等各种协议联动。3.简单轻量：BFD控制报文简单，封装在UDP中（端口3784/4784），开销小。4.双向检测：同时检测两个方向的连通性，单向故障也能检测。BFD工作模式：1.异步模式（Asynchronous）：双方周期性发送BFD控制报文，检测时间内未收到则认为故障，是默认模式。2.查询模式（Demand）：不周期性发送，需要时发送查询报文检测，适用于不希望周期性发送的场景。3.回声模式（Echo）：发送回声报文，对端不处理直接环回，检测本地转发路径故障，可与异步模式结合。BFD联动：1.BFD与OSPF/IS-IS/BGP联动：BFD检测到故障后通知路由协议，立即撤销邻居和路由，触发快速收敛，无需等待协议Hello超时。2.BFD与静态路由联动：BFD检测到下一跳故障后，静态路由失效，切换备份路由。3.BFD与VRRP联动：BFD检测到上行链路故障后，VRRP快速切换主备。4.BFD与MPLS LSP/PW联动：检测LSP/PW故障，触发保护倒换（FRR）。BFD是实现网络高可用（HA）和快速收敛的关键技术，运营商和企业网络广泛使用。华为设备支持BFD，可配置单跳/多跳BFD、BFD会话参数（最小发送间隔、最小接收间隔、检测倍数）、BFD与各种协议联动。注意：BFD检测时间越短，对设备性能和链路质量要求越高（CPU开销、报文丢失可能导致误检），需根据实际场景合理配置。',
    knowledgeId: 'datacom-bfd', direction: 'datacom',
  },
  {
    id: 'dc-c007', type: 'judge',
    question: 'VRRP（虚拟路由冗余协议）中，Master路由器负责转发流量，Backup路由器在Master故障后接管成为新的Master。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'VRRP（Virtual Router Redundancy Protocol，虚拟路由冗余协议，RFC 5798，华为默认VRRPv3支持IPv4/IPv6）：将多台路由器组成一个虚拟路由器（Virtual Router），对外提供一个虚拟IP（VIP）和虚拟MAC（VMAC，00-00-5E-00-01-{VRID}），局域网内主机的默认网关指向虚拟IP。VRRP路由器角色：1.Master（主路由器）：优先级最高的路由器成为Master，负责转发以虚拟MAC为目的的流量，响应ARP请求（回复虚拟MAC），周期性发送VRRP通告报文（Advertisement，默认1秒，组播224.0.0.18）。2.Backup（备份路由器）：其他路由器为Backup，不转发流量，不响应ARP，只监听Master的通告报文。如果在Master_Down_Interval（默认3倍通告间隔+偏移时间，约3.6秒）内未收到Master通告，则认为Master故障，优先级最高的Backup抢占成为新Master，接管虚拟IP和MAC，继续转发流量，实现网关冗余。VRRP优先级：1-254，默认100，值越大越优先。优先级255保留给虚拟IP所有者（IP Address Owner，物理接口IP=虚拟IP的路由器，自动成为Master且不可被抢占）。优先级0用于Master主动放弃（发送优先级0的通告，Backup立即接管）。VRRP抢占模式：默认开启，高优先级Backup发现自己优先级高于Master时，抢占成为Master。可配置抢占延迟（避免网络震荡时频繁切换）。VRRP跟踪（Track）：1.跟踪接口/链路：Master上行接口故障时，降低优先级，让Backup接管，避免黑洞。2.跟踪BFD：BFD快速检测故障，联动VRRP快速切换（亚秒级）。3.跟踪路由：路由消失时降低优先级。VRRP与HSRP（Cisco私有）、GLBP（Cisco私有，支持负载分担）类似，VRRP是IETF标准，华为支持。VRRP只能实现主备冗余（同一时间只有Master转发），不能负载分担（可通过多VRRP组+不同VLAN网关指向不同VRRP实现负载分担，即VRRP负载分担模式）。VRRPv2仅支持IPv4，VRRPv3支持IPv4和IPv6。',
    knowledgeId: 'datacom-vrrp', direction: 'datacom',
  },
'''

idx = content.rfind(']')
new_content = content[:idx] + questions + '\n' + content[idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

count = new_content.count("question: '")
print(f"Inserted batch C, total questions: {count}")
