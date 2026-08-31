import re

filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\data\quizzes.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

questions = '''
  // ==================== 扩充题库 Batch M ====================
  {
    id: 'dc-m001', type: 'single',
    question: 'IS-IS中，以下关于NET（网络实体标题）的说法，错误的是？',
    options: ['NET格式为Area ID + System ID + NSEL，NSEL为00表示路由器本身', 'System ID占6字节，同一区域内必须唯一', 'Area ID占1-13字节，同一L1区域内必须相同', '一台路由器只能配置一个NET，不能配置多个NET'],
    answer: '一台路由器只能配置一个NET，不能配置多个NET',
    explanation: 'IS-IS NET（Network Entity Title，网络实体标题）：IS-IS路由器的网络层地址，格式为Area ID（区域ID，1-13字节）+ System ID（系统ID，6字节）+ NSEL（网络服务选择器，1字节）。1.Area ID（区域ID）：1-13字节，标识IS-IS区域，同一L1区域内所有路由器的Area ID必须相同。Area ID通常为3字节（如49.0001，49是AFI，0001是区域ID），也可更长。2.System ID（系统ID）：6字节，唯一标识一台路由器，同一区域内必须唯一（不同区域System ID可以相同，但建议全局唯一）。System ID通常由IP地址转换而来（如192.168.001.001→1921.6800.1001），或用MAC地址，或手动配置。3.NSEL（Network Service Access Point Selector，网络服务接入点选择器）：1字节，值为00表示该NET对应路由器本身（IS本身），非00表示主机或特定服务（如CLNP传输层协议）。IS-IS路由器的NET的NSEL必须为00。4.NET长度：8-20字节（Area ID 1-13 + System ID 6 + NSEL 1），通常为10字节（Area ID 3 + System ID 6 + NSEL 1）。5.多NET配置：一台路由器可以配置多个NET（最多3个，华为设备默认最多3个，可通过max-area-address命令调整），多个NET的System ID必须相同，Area ID可以不同。多NET用于区域迁移（如从Area 1迁移到Area 2，同时配置两个Area ID的NET，平滑过渡，避免中断），或路由器同时属于多个区域（L1/2路由器连接多个L1区域）。注意：多个NET的System ID必须相同（同一台路由器只有一个System ID），Area ID可以不同。6.NET与OSPF Router ID对比：a.OSPF Router ID：32位（4字节，点分十进制格式），手动配置或自动选举（Loopback最大IP>物理接口最大IP），全局唯一。b.IS-IS System ID：48位（6字节，十六进制格式），必须手动配置（不能自动选举），区域内唯一（建议全局唯一）。c.IS-IS NET包含Area ID（OSPF区域在接口上配置，不在Router ID中）。7.NET配置示例：a.命令：network-entity 49.0001.0000.0000.0001.00（49.0001是Area ID，0000.0000.0001是System ID，00是NSEL）。b.格式：Area ID用点分十六进制（每2字节一组，如49.0001），System ID用点分十六进制（每2字节一组，如0000.0000.0001），NSEL为2位十六进制（00）。8.NET相关命令：a.display isis lsdb：查看链路状态数据库（LSP）。b.display isis peer：查看IS-IS邻居。c.display isis route：查看IS-IS路由。d.display isis interface：查看IS-IS接口。IS-IS NET是华为ICT大赛网络赛道的高频考点，需掌握NET格式（Area ID+System ID+NSEL）、各字段长度和作用、System ID唯一性、多NET配置（最多3个，System ID相同，Area ID可不同）、与OSPF Router ID对比、配置命令等。注意：一台路由器可以配置多个NET（最多3个），不是只能一个，这是常见易错点。',
    knowledgeId: 'datacom-isis', direction: 'datacom',
  },
  {
    id: 'dc-m002', type: 'single',
    question: '以下关于STP/RSTP/MSTP的说法，错误的是？',
    options: ['STP（802.1D）收敛慢（30-50秒），端口状态有Blocking/Listening/Learning/Forwarding', 'RSTP（802.1w）收敛快（秒级），端口状态简化为Discarding/Learning/Forwarding', 'MSTP（802.1s）兼容STP/RSTP，支持多实例负载分担', 'MSTP实例可以跨MST域，不同MST域的实例可以直接互通'],
    answer: 'MSTP实例可以跨MST域，不同MST域的实例可以直接互通',
    explanation: '生成树协议演进：1.STP（Spanning Tree Protocol，生成树协议，IEEE 802.1D）：a.端口状态：Disabled（禁用）、Blocking（阻塞，不转发数据，不学习MAC，只收BPDU）、Listening（监听，不转发数据，不学习MAC，收/发BPDU，15秒Forward Delay）、Learning（学习，不转发数据，学习MAC，收/发BPDU，15秒Forward Delay）、Forwarding（转发，正常转发数据，学习MAC，收/发BPDU）。b.收敛慢：Blocking→Forwarding需要经过Listening（15秒）+Learning（15秒）=30秒，拓扑变化收敛30-50秒。c.端口角色：根端口（Root Port）、指定端口（Designated Port）、阻塞端口（Blocking Port，不区分备份类型）。d.无快速收敛机制，边缘端口需手动配置PortFast（Cisco）或边缘端口（华为）。2.RSTP（Rapid Spanning Tree Protocol，快速生成树协议，IEEE 802.1w）：a.端口状态简化：Discarding（丢弃，合并STP的Disabled/Blocking/Listening，不转发数据，不学习MAC）、Learning（学习，不转发数据，学习MAC）、Forwarding（转发，正常转发）。b.收敛快：通过P/A（Proposal/Agreement，提议/同意）协商机制，点到点链路上端口快速进入Forwarding（无需等30秒），秒级收敛。c.端口角色细化：根端口（Root Port）、指定端口（Designated Port）、替代端口（Alternate Port，根端口备份）、备份端口（Backup Port，指定端口备份）、边缘端口（Edge Port，连接终端，直接Forwarding）。d.更短的BPDU超时：Hello Time 2秒，超时3倍=6秒（STP的Max Age 20秒），故障检测更快。e.兼容STP：与STP设备互联时退化为STP速度。3.MSTP（Multiple Spanning Tree Protocol，多生成树协议，IEEE 802.1s）：a.兼容STP/RSTP：MSTP域与STP/RSTP设备互联时，MSTP端口发送STP/RSTP BPDU（或MSTP BPDU，STP设备视为RSTP BPDU），实现互通。b.多实例负载分担：MST域内运行多个MSTI（Multiple Spanning Tree Instance，多生成树实例），每个MSTI独立计算生成树，不同VLAN映射到不同MSTI，实现VLAN流量负载分担（不同VLAN走不同路径，提高链路利用率）。c.MSTI仅在MST域内有效，不跨域（不同MST域的MSTI不能直接互通，域间通过CST公共生成树互通，MST域对外表现为一个虚拟桥）。d.MST域判定条件：域名（Configuration Name）、修订级别（Revision Level）、VLAN-实例映射关系三者完全相同。e.CIST（Common and Internal Spanning Tree，公共和内部生成树）：CIST = CST（Common Spanning Tree，域间公共生成树）+ IST（Internal Spanning Tree，域内MSTI 0，内部生成树），是整个网络的总生成树。4.对比总结：| 协议 | 标准 | 收敛速度 | 端口状态 | 负载分担 | 兼容 | |---|---|---|---|---|---| | STP | 802.1D | 慢（30-50秒） | 5种状态 | 不支持（单生成树） | - | | RSTP | 802.1w | 快（秒级） | 3种状态 | 不支持（单生成树） | 兼容STP | | MSTP | 802.1s | 快（秒级） | 3种状态 | 支持（多实例） | 兼容STP/RSTP | 5.MSTP域间互通：a.不同MST域之间通过CST（公共生成树）互通，CST将每个MST域视为一个虚拟桥，域间运行CST（类似RSTP的单生成树）。b.MSTI（MSTI 1-4094）仅在域内有效，不跨域；MSTI 0（IST）在域内运行，域间表现为CST的一部分。c.不同MST域的VLAN映射可以不同（每个域独立配置VLAN-实例映射），域间通过CST保证无环路。d.MSTP域与STP/RSTP域互通时，MSTP域对外表现为一个RSTP桥（发送RSTP BPDU），STP/RSTP域看不到MSTI。生成树协议是华为ICT大赛网络赛道的高频考点，需掌握STP/RSTP/MSTP的区别、端口状态/角色、收敛机制（P/A协商）、MSTP域配置和判定、MSTI不跨域（域间通过CST互通）、负载分担配置等。注意：MSTI仅在MST域内有效，不跨域，不同MST域通过CST互通，这是常见易错点。',
    knowledgeId: 'datacom-stp', direction: 'datacom',
  },
  {
    id: 'sec-m001', type: 'single',
    question: '以下关于非对称加密算法的说法，错误的是？',
    options: ['非对称加密使用公钥/私钥对，公钥加密私钥解密，或私钥签名公钥验证', 'RSA是常见的非对称加密算法，基于大整数分解难题', 'ECC（椭圆曲线密码）比RSA密钥短但安全性更高', '非对称加密速度快，适合加密大量数据'],
    answer: '非对称加密速度快，适合加密大量数据',
    explanation: '非对称加密（Asymmetric Encryption，也叫公钥加密Public Key Encryption）：1.原理：使用一对密钥（公钥Public Key和私钥Private Key），公钥公开，私钥保密。a.公钥加密，私钥解密（加密/解密）：用接收方公钥加密数据，只有接收方私钥能解密，保证机密性（只有接收方能解密）。b.私钥签名，公钥验证（数字签名）：用发送方私钥对消息摘要签名，接收方用发送方公钥验证，保证身份认证和不可否认（只有私钥持有者能签名）。c.公钥和私钥数学相关，但从公钥无法推导出私钥（计算上不可行）。2.常见算法：a.RSA（Rivest-Shamir-Adleman）：基于大整数分解难题（两个大素数相乘容易，分解乘积难），最常用，支持加密和签名，密钥长度1024/2048/3072/4096位（2048位当前安全，1024位已不安全）。b.ECC（Elliptic Curve Cryptography，椭圆曲线密码）：基于椭圆曲线离散对数难题，密钥短（256位ECC≈3072位RSA安全性），计算量小，性能高，适合移动设备和物联网，支持加密和签名（ECDSA签名、ECDH密钥交换）。c.DSA（Digital Signature Algorithm，数字签名算法）：仅用于数字签名，不支持加密，基于离散对数难题，密钥长度1024/2048位（已逐渐被RSA/ECC替代）。d.DH（Diffie-Hellman，迪菲-赫尔曼）：密钥交换算法，不是加密算法，双方在不安全信道上协商出共享密钥（不直接传输密钥），基于离散对数难题，用于IPSec/TLS的密钥交换。e.SM2（中国国密椭圆曲线密码）：中国国家密码管理局发布的椭圆曲线公钥密码算法，基于ECC，支持加密和签名，256位密钥，符合中国密码法要求，国内合规场景必须使用。3.非对称加密特点：a.速度慢：非对称加密计算复杂（大整数运算、椭圆曲线运算），速度比对称加密慢得多（RSA比AES慢约1000倍），不适合加密大量数据。b.密钥管理简单：不需要安全信道传输密钥（公钥公开，私钥本地保存），解决了对称加密的密钥分发问题。c.功能丰富：支持加密、数字签名、密钥交换，对称加密只支持加密。d.密钥长度：非对称加密密钥长度比对称加密长（RSA 2048位 vs AES 256位），因为非对称加密基于数学难题（需要更长密钥保证安全性）。4.混合加密（Hybrid Encryption）：实际应用中结合非对称加密和对称加密的优势：a.用非对称加密交换对称密钥（如RSA加密AES密钥，或DH协商AES密钥）。b.用对称密钥加密大量数据（AES加密实际数据，速度快）。c.这是HTTPS/TLS、IPSec IKE、PGP、SSH等几乎所有安全协议的标准做法（非对称加密密钥交换+对称加密数据传输）。5.对称加密vs非对称加密对比：| 维度 | 对称加密 | 非对称加密 | |---|---|---| | 密钥 | 一个共享密钥 | 公钥/私钥对 | | 速度 | 快（适合大量数据） | 慢（不适合大量数据） | | 密钥分发 | 困难（需安全信道） | 简单（公钥公开） | | 功能 | 仅加密 | 加密+签名+密钥交换 | | 密钥长度 | 短（AES 256位） | 长（RSA 2048位） | | 常见算法 | AES、DES、3DES、SM4 | RSA、ECC、DSA、SM2 | 6.应用场景：a.非对称加密：数字签名（证书、代码签名、电子合同）、密钥交换（TLS/IPSec）、身份认证（802.1X EAP-TLS）、小数据加密（如加密对称密钥）。b.对称加密：大量数据加密（HTTPS数据传输、IPSec数据加密、文件加密、磁盘加密）。c.混合加密：几乎所有实际安全协议（HTTPS/TLS、IPSec、SSH、PGP、S/MIME）。非对称加密是华为ICT大赛安全赛道的高频考点，需掌握非对称加密原理（公钥/私钥对、加密/签名）、常见算法（RSA/ECC/SM2）、特点（速度慢不适合大量数据、密钥管理简单）、混合加密（非对称交换密钥+对称加密数据）、与对称加密对比等。注意：非对称加密速度慢，不适合加密大量数据，这是常见易错点。',
    knowledgeId: 'security-crypto', direction: 'security',
  },
  {
    id: 'dcn-m001', type: 'single',
    question: 'EVPN中，以下关于多归接入（Multi-homing）的说法，错误的是？',
    options: ['多归接入指一台服务器/CE同时连接到多台PE/Leaf，提高可靠性', 'ESI（Ethernet Segment Identifier）标识一个多归接入的以太网段', 'DF（Designated Forwarder，指定转发器）负责转发BUM流量，避免重复', '多归接入时所有PE都同时转发单播流量，导致环路'],
    answer: '多归接入时所有PE都同时转发单播流量，导致环路',
    explanation: 'EVPN多归接入（Multi-homing，也叫多宿主接入）：1.定义：一台服务器/CE（客户边缘设备）同时连接到多台PE/Leaf（提供商边缘设备），提高可靠性（一台PE故障时，其他PE继续转发，业务不中断）和带宽（多链路负载分担）。多归接入是EVPN的重要特性，解决了传统VPLS/VXLAN多归接入的环路和重复流量问题。2.ESI（Ethernet Segment Identifier，以太网段标识符）：a.10字节（80位）的唯一标识符，标识一个多归接入的以太网段（即同一台CE连接到多台PE的那组接口）。b.同一多归接入段的所有PE上，连接到同一CE的接口配置相同的ESI（手动配置或自动生成，自动生成基于CE的MAC+VLAN或LACP系统MAC）。c.ESI为0表示单归接入（Single-homing，CE只连接一台PE），非0表示多归接入。d.ESI在EVPN Type 1/2/4路由中携带，用于标识多归接入段，实现多归接入的协同（别名、DF选举、快速收敛）。3.EVPN多归接入路由类型：a.Type 1（Ethernet Auto-Discovery Route，ES自动发现路由）：多归接入段的PE互相发现（知道哪些PE属于同一ESI），携带ESI、EVPN实例标签、以太网标签（Ethernet Tag，VLAN）。用于快速收敛（成员PE故障时，其他PE快速切换）和别名（Aliasing，负载分担）。b.Type 2（MAC/IP Advertisement Route，MAC/IP地址通告路由）：携带ESI（如果是多归接入的MAC），标识该MAC属于哪个多归接入段，其他PE根据ESI和别名实现负载分担（流量可发送到同一ESI的任意PE，因为它们都能到达该MAC）。c.Type 4（Ethernet Segment Route，以太网段路由）：用于DF（Designated Forwarder，指定转发器）选举，携带ESI、VTEP IP、DF选举算法（默认算法，基于IP地址哈希）。同一ESI的PE通过Type 4路由互相发现，选举DF。4.DF（Designated Forwarder，指定转发器）选举：a.作用：在多归接入场景中，BUM流量（Broadcast广播、Unknown unicast未知单播、Multicast组播）如果所有PE都转发，会导致重复流量（CE收到多份相同BUM流量）和环路。DF负责转发BUM流量到CE（只有DF转发，其他PE不转发BUM到CE），避免重复和环路。b.选举：同一ESI的PE通过Type 4路由选举DF，默认基于VLAN（以太网标签）和PE IP地址哈希，每个VLAN选举一个DF（不同VLAN的DF可以不同，实现负载分担，即DF负载分担）。c.DF故障：DF故障时，其他PE通过Type 1路由快速检测，重新选举DF（秒级收敛），业务不中断。5.单播流量负载分担（别名Aliasing）：a.别名（Aliasing）：同一ESI的PE都发布Type 2路由（携带相同MAC和ESI），远端PE看到多个PE都能到达同一MAC（同一ESI），可通过ECMP将单播流量负载分担到多台PE（多链路利用，提高带宽），因为它们都能到达CE。b.这解决了传统多归接入的问题（传统方式只能用主备，不能负载分担，或用LACP但需要CE支持）。c.单播流量不会环路（因为远端PE通过ECMP选择一条路径，CE收到后不会再转发回其他PE，因为CE的接口是接入接口，不会转发BUM，单播有明确目的）。6.多归接入模式：a.单活（Single-Active，也叫主备）：同一时间只有一台PE转发流量（主PE转发，备PE不转发，主PE故障时备PE切换），类似VRRP主备。b.双活（All-Active，也叫负载分担）：所有PE同时转发单播流量（通过别名和ECMP负载分担），BUM流量由DF转发（避免重复），提高带宽和利用率，是EVPN多归接入的推荐模式。c.单活配置简单，双活性能更好（需要CE支持LACP或多链路，且PE支持别名）。7.EVPN多归接入优势：a.高可靠：PE故障时快速收敛（秒级），业务不中断。b.高带宽：双活模式下多链路负载分担，充分利用带宽。c.无环路：通过DF选举避免BUM重复和环路，通过别名实现单播负载分担。d.标准化：EVPN多归接入是IETF标准（RFC 7432等），不同厂商设备可互通。EVPN多归接入是华为ICT大赛DCN赛道的高级考点，需掌握多归接入定义、ESI作用、Type 1/2/4路由作用、DF选举（避免BUM重复）、别名（单播负载分担）、单活/双活模式等。注意：多归接入时单播流量可负载分担（不会环路），BUM流量由DF转发（避免重复），不是所有PE都同时转发导致环路，这是常见易错点。',
    knowledgeId: 'dcn-evpn', direction: 'dcn',
  },
'''

idx = content.rfind(']')
new_content = content[:idx] + questions + '\n' + content[idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

count = new_content.count("question: '")
print(f"Inserted batch M, total questions: {count}")
