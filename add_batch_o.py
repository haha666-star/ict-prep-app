import re

filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\data\quizzes.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

questions = '''
  // ==================== 扩充题库 Batch O ====================
  {
    id: 'dc-o001', type: 'single',
    question: 'OSPF中，以下关于末梢区域（Stub Area）的说法，错误的是？',
    options: ['Stub区域不接收Type 5外部路由，但接收Type 3区域间路由', 'Totally Stub区域不接收Type 3（除默认路由）、Type 4、Type 5', 'NSSA区域允许引入外部路由（Type 7），Stub区域不允许', 'Stub区域可以有ASBR（引入外部路由），也可以有虚链路穿越'],
    answer: 'Stub区域可以有ASBR（引入外部路由），也可以有虚链路穿越',
    explanation: 'OSPF末梢区域对比：1.Stub区域：不接收Type 4（ASBR位置）和Type 5（外部路由），接收Type 3（区域间路由）和Type 1/2（本区域）。不能有ASBR（不能引入外部路由，因为Type 5无法在Stub区域泛洪），不能有虚链路穿越（虚链路需要Type 5传递）。ABR向Stub区域发布默认路由（Type 3，0.0.0.0/0）。2.Totally Stub（完全末梢）：不接收Type 3（除默认路由）、Type 4、Type 5，只接收Type 1/2和默认Type 3，最严格，路由表最小。3.NSSA（Not-So-Stubby Area，非纯末梢）：不接收Type 4和Type 5，接收Type 3，允许本区域有ASBR引入外部路由（生成Type 7 LSA，仅在NSSA内泛洪，到ABR转换为Type 5）。NSSA解决了Stub不能引入外部路由的限制。4.Totally NSSA：不接收Type 3（除默认）、Type 4、Type 5，允许Type 7。末梢区域共同限制：不能有ASBR（NSSA除外）、不能有虚链路穿越、所有路由器必须一致配置末梢区域（Hello报文中的E位/N位必须一致，否则邻居建立失败）。末梢区域作用：减少LSA数量和路由表规模，提高稳定性，降低路由器资源消耗，适用于只有一个出口的末节区域。OSPF区域类型是高频考点，需掌握每种区域允许/不允许的LSA类型、是否允许ASBR、是否有默认路由、配置命令（stub/nssa/stub no-summary/nssa no-summary）等。注意：Stub区域不能有ASBR和虚链路，这是常见易错点。',
    knowledgeId: 'datacom-ospf', direction: 'datacom',
  },
  {
    id: 'dc-o002', type: 'single',
    question: 'BGP中，以下关于AS_Path属性的说法，错误的是？',
    options: ['AS_Path是公认必遵属性，记录路由经过的AS列表', 'AS_Path用于防环（收到包含自己AS号的路由则丢弃）和路由优选（AS_Path短的优先）', 'AS_Path前置（Prepend）可在路由前添加多次自己的AS号，使AS_Path变长，降低优先级', '联盟（Confederation）内部的子AS号会计入AS_Path长度，影响路由优选'],
    answer: '联盟（Confederation）内部的子AS号会计入AS_Path长度，影响路由优选',
    explanation: 'BGP AS_Path属性：1.公认必遵属性（Well-known Mandatory），所有BGP更新必须包含，记录路由经过的AS列表（从始发AS到当前AS的顺序）。2.作用：a.防环：BGP路由器收到包含自己AS号的AS_Path的路由时，丢弃该路由（防止AS间环路）。b.路由优选：AS_Path越短越优先（BGP优选规则第5条，在Weight、Local_Pref、本地始发之后比较）。c.路径信息：记录路由经过的AS，可用于策略控制（如根据AS_Path过滤或设置属性）。3.AS_Path类型：a.AS_SEQUENCE（有序AS列表，最常见，按经过顺序排列）。b.AS_SET（无序AS集合，聚合路由时使用，将所有明细AS合并为集合，防止环路，不计入长度比较的有序部分）。c.AS_CONFED_SEQUENCE/AS_CONFED_SET（联盟内部AS号，联盟子AS之间的路径，不计入AS_Path长度比较，仅用于联盟内部防环，对外不可见）。4.AS_Path前置（Prepend）：在发布路由时，在AS_Path前添加多次自己的AS号（如ip route-static ... description，或route-policy中apply as-path），使AS_Path变长，降低该路由的优先级（对端看到AS_Path更长，优选其他路径），用于控制入站流量（如希望对端从其他入口进入，在某个入口发布的路由前添加多次AS号，使其优先级降低）。5.联盟（Confederation）：将一个大AS划分为多个子AS，子AS之间使用EBGP关系，但对外表现为一个联盟AS号。子AS号放在AS_Path的AS_CONFED_SEQUENCE/AS_CONFED_SET段，不计入AS_Path长度比较（不影响路由优选的AS_Path长度），仅用于联盟内部防环。对外发布路由时，剥离联盟内部AS号，只保留联盟AS号。所以联盟内部子AS号不会影响AS_Path长度比较。BGP属性是高频考点，需掌握AS_Path的作用（防环+优选）、类型（SEQUENCE/SET/CONFED）、AS_Path前置（控制入站流量）、联盟AS号不计入长度等。注意：联盟内部子AS号不计入AS_Path长度，这是常见易错点。',
    knowledgeId: 'datacom-bgp', direction: 'datacom',
  },
  {
    id: 'dc-o003', type: 'judge',
    question: 'IS-IS中，DIS（指定中间系统）选举是可抢占的，且没有备份DIS（BDR），这与OSPF的DR选举不同。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'IS-IS DIS vs OSPF DR对比：1.IS-IS DIS（Designated IS，指定中间系统）：a.选举依据：接口优先级（0-127，默认64，值大优先，优先级0也参与选举），优先级相同时System ID大的优先。b.可抢占（Preemptive）：新加入的高优先级路由器立即抢占成为DIS，不需要等待当前DIS故障。c.没有备份DIS（没有BDR）：DIS故障后需要重新选举新DIS，期间有短暂中断。d.DIS职责：生成伪节点（Pseudonode）LSP（简化广播网络链路状态描述）、周期性发送CSNP（完全序列号报文，10秒一次，用于数据库同步）。2.OSPF DR（Designated Router，指定路由器）：a.选举依据：接口优先级（0-255，默认1，值大优先，优先级0不参与选举，成为DROther），优先级相同时Router ID大的优先。b.不可抢占（Non-preemptive）：一旦DR选举完成，即使新加入更高优先级路由器，也不会抢占当前DR，只有DR故障时BDR才成为DR，然后重新选举BDR。c.有BDR（Backup Designated Router，备份指定路由器）：BDR监听DR的LSA，DR故障后BDR立即成为DR（无中断），然后重新选举新BDR。d.DR职责：生成Type 2 Network LSA（描述广播网络所有路由器）、泛洪LSA（DROther只与DR/BDR建立邻接，LSA发给DR，DR泛洪给所有DROther）。3.对比总结：| 维度 | IS-IS DIS | OSPF DR | |---|---|---| | 优先级范围 | 0-127（0也参与） | 0-255（0不参与） | | 抢占性 | 可抢占 | 不可抢占 | | 备份 | 无备份DIS | 有BDR备份 | | 网络LSA | 伪节点LSP | Type 2 Network LSA | | 数据库同步 | DIS周期性发CSNP | DR/BDR与DROther建立邻接 | 两者都在广播网络（Broadcast）和NBMA网络中选举，点到点（P2P）和点到多点（P2MP）网络不选举。IS-IS DIS和OSPF DR是高频考点，需掌握选举规则、抢占性、备份机制、职责、与OSPF DR的区别等。注意：IS-IS DIS可抢占且无备份，OSPF DR不可抢占且有BDR，这是常见易错点。',
    knowledgeId: 'datacom-isis', direction: 'datacom',
  },
  {
    id: 'dc-o004', type: 'single',
    question: 'MSTP中，以下关于MST域（MST Region）的说法，错误的是？',
    options: ['MST域由域名、修订级别、VLAN-实例映射关系三个条件判定', 'MSTI（多生成树实例）仅在MST域内有效，不跨域', '不同MST域之间通过CST（公共生成树）互通，MST域对外表现为一个虚拟桥', 'MST域内所有交换机的MAC地址必须相同，否则不属于同一域'],
    answer: 'MST域内所有交换机的MAC地址必须相同，否则不属于同一域',
    explanation: 'MSTP（Multiple Spanning Tree Protocol，802.1s）MST域：1.MST域判定条件（三个条件必须完全相同，才属于同一个MST域）：a.域名（Configuration Name，配置名称，32字节）：MST域的名称，标识一个MST域。b.修订级别（Revision Level，修订级别，2字节）：MST域配置的版本号，修改配置后可递增。c.VLAN-实例映射关系（VLAN-to-instance Mapping，VLAN与MSTI的映射关系）：哪些VLAN映射到哪个MSTI实例。这三个条件完全相同的交换机才属于同一个MST域，不同则属于不同MST域。MAC地址不需要相同（每台交换机MAC地址都不同，这是正常的），MAC地址不影响MST域判定。2.MSTI（Multiple Spanning Tree Instance，多生成树实例）：a.每个MSTI独立计算生成树（基于RSTP算法），有自己的根桥、根端口、指定端口。b.不同VLAN映射到不同MSTI，实现VLAN流量负载分担（不同VLAN走不同路径，提高链路利用率）。c.MSTI仅在MST域内有效，不跨域（不同MST域的MSTI不能直接互通，域间通过CST互通）。d.MSTI 0（IST，Internal Spanning Tree，内部生成树）：默认实例，所有未显式映射的VLAN都属于MSTI 0，MSTI 0在域内运行，域间表现为CST的一部分，是MSTP的基础实例（其他MSTI的拓扑基于IST计算）。用户自定义实例为MSTI 1-4094（实际支持数量取决于设备，通常16-64个）。3.CST（Common Spanning Tree，公共生成树）：a.在整个交换网络（不同MST域和STP/RSTP域）中形成的一棵公共生成树，将每个MST域视为一个虚拟桥，域间运行CST，确保域间无环路。b.CIST（Common and Internal Spanning Tree，公共和内部生成树）：CIST = CST（域间公共生成树）+ IST（域内MSTI 0内部生成树），是整个网络的总生成树，确保整个网络无环路。4.MSTP兼容STP/RSTP：MST域与STP/RSTP设备互联时，MSTP端口发送STP/RSTP BPDU（或MSTP BPDU，STP设备将MSTP BPDU视为RSTP BPDU），实现互通。5.MSTP配置：a.配置MST域：stp region-configuration进入域配置视图，region-name配置域名，revision-level配置修订级别，instance <id> vlan <vlan-range>配置VLAN-实例映射，active激活配置。b.配置MSTI根桥：stp instance <id> root primary/secondary，或stp instance <id> priority <priority>。c.配置端口参数：stp instance <id> cost <cost>，stp instance <id> port priority <priority>。MSTP是企业网络主流生成树协议，是高频考点，需掌握MST域判定条件（域名/修订级别/VLAN映射，不是MAC地址）、MSTI特点（独立计算、域内有效、负载分担）、CST/CIST概念、与STP/RSTP互通、配置命令等。注意：MST域判定不包括MAC地址，MAC地址每台设备都不同，这是常见易错点。',
    knowledgeId: 'datacom-stp', direction: 'datacom',
  },
  {
    id: 'sec-o001', type: 'single',
    question: '防火墙中，以下关于NAT的说法，错误的是？',
    options: ['源NAT（NAT Outbound）转换源IP，用于内网用户访问外网，PAT是多对一端口地址转换', '目的NAT（NAT Server）转换目的IP，用于外网访问内网服务器，生成Server-Map表', '静态NAT是一对一固定映射，既支持内网主动访问外网，也支持外网主动访问内网', 'NAT可以解决IPv4地址不足问题，也可以提高网络安全性，因为NAT加密了数据'],
    answer: 'NAT可以解决IPv4地址不足问题，也可以提高网络安全性，因为NAT加密了数据',
    explanation: '防火墙NAT（Network Address Translation，网络地址转换）：1.源NAT（Source NAT，NAT Outbound，出方向NAT）：a.转换报文的源IP地址（和端口），用于内网用户访问外网（内网私有IP→公网IP）。b.类型：No-PAT（不转换端口，多对多，从公网地址池动态分配）、PAT（Port Address Translation，端口地址转换，多对一，多个内网主机共享一个公网IP，通过不同源端口区分，最常用，大幅节省公网IP）、Smart NAT（No-PAT+PAT，No-PAT用完后自动用PAT）、Easy IP（直接使用出接口IP作为公网IP，适合拨号/动态IP场景）。c.源NAT只允许内网主动访问外网（外网不能主动访问内网，因为没有公网到私网的映射，外网发起的连接无法到达内网主机）。2.目的NAT（Destination NAT，NAT Inbound，入方向NAT，华为叫NAT Server服务器映射）：a.转换报文的目的IP地址（和端口），用于外网用户主动访问内网服务器（公网IP→内网服务器私网IP）。b.配置：nat server protocol tcp global <公网IP> <公网端口> inside <私网IP> <私网端口>。c.生成Server-Map表（服务器映射表），记录公网IP+端口→私网IP+端口的映射，允许外网主动访问（普通源NAT不允许外网主动访问）。d.内网服务器回复时，源地址（私网IP+端口）被转换为公网IP+端口（反向NAT，No-PAT，因为NAT Server生成的Server-Map包含反向映射）。3.静态NAT（Static NAT）：a.一对一固定映射，内网IP与公网IP一一对应，不转换端口。b.既支持内网主动访问外网（源NAT），也支持外网主动访问内网（目的NAT，因为映射是双向的、固定的）。c.不节省公网IP（需要与内网主机相同数量的公网IP），主要用于需要外网主动访问的服务器（但NAT Server更灵活，可端口映射，一个公网IP映射多个服务器不同端口）。4.NAT作用：a.解决IPv4地址不足（内网用私有IP，通过NAT访问公网，PAT多对一，大幅节省公网IP）。b.隐藏内网拓扑（外网看不到内网私有IP和拓扑，提高安全性，因为外网无法直接访问内网主机）。c.网络迁移时保持内部地址不变（更换公网IP时，内网地址不需要改变）。5.NAT不加密数据：NAT只是转换IP地址（和端口），不加密数据内容，数据加密需要IPSec/SSL/TLS等加密技术。NAT提高安全性是因为隐藏内网拓扑和地址（外网无法直接访问内网），不是因为加密。6.NAT限制：a.破坏端到端模型（外网无法主动访问内网主机，需静态NAT/NAT Server）。b.部分应用不兼容（如FTP/SIP等在载荷中携带IP/端口的应用，需ALG应用层网关）。c.影响IPSec（AH不兼容NAT，ESP可用NAT-T穿越）。d.增加延迟和单点故障。NAT是防火墙核心功能，是高频考点，需掌握源NAT/目的NAT/静态NAT区别、PAT原理、Server-Map表、NAT作用（地址不足+隐藏拓扑，不加密）、NAT限制等。注意：NAT不加密数据，只是转换地址，这是常见易错点。',
    knowledgeId: 'security-nat', direction: 'security',
  },
  {
    id: 'sec-o002', type: 'single',
    question: '以下关于加密算法的说法，错误的是？',
    options: ['对称加密使用相同密钥加密解密，速度快，适合大量数据，如AES、SM4', '非对称加密使用公钥/私钥对，速度慢，适合密钥交换和数字签名，如RSA、ECC、SM2', '哈希算法是单向不可逆的，用于完整性校验和数字签名，如MD5、SHA-256、SM3', 'MD5和SHA-1仍然是安全的，可以用于数字签名和密码存储'],
    answer: 'MD5和SHA-1仍然是安全的，可以用于数字签名和密码存储',
    explanation: '加密算法分类：1.对称加密（Symmetric Encryption）：a.加密和解密使用相同密钥，速度快（适合大量数据加密），密钥分发困难（需要安全信道传输密钥）。b.常见算法：AES（128/192/256位，当前主流，安全）、DES（56位，已破解，不安全）、3DES（三重DES，112/168位，已逐渐被AES替代）、SM4（中国国密，128位，安全，国内合规）、Blowfish、RC4（已不安全）、ChaCha20（安全，高性能，适合移动设备）。2.非对称加密（Asymmetric Encryption，公钥加密）：a.使用公钥/私钥对，公钥加密私钥解密（机密性），私钥签名公钥验证（身份认证/不可否认），速度慢（不适合大量数据），密钥管理简单（公钥公开，私钥保密）。b.常见算法：RSA（1024位已不安全，2048位当前安全，4096位更安全，基于大整数分解）、ECC（椭圆曲线，256位≈3072位RSA安全性，密钥短性能高，基于椭圆曲线离散对数）、DSA（仅签名，基于离散对数，已逐渐被RSA/ECC替代）、SM2（中国国密椭圆曲线，256位，安全，国内合规）、DH（Diffie-Hellman，密钥交换算法，不是加密算法，基于离散对数）。3.哈希算法（Hash Algorithm，散列算法）：a.单向不可逆（从输入计算哈希容易，从哈希反推输入计算上不可行），固定长度输出，抗碰撞（难以找到两个不同输入产生相同哈希），用于完整性校验、数字签名（签名摘要，不直接签名原始消息）、密码存储（加盐+慢哈希）。b.已不安全（已破解碰撞攻击）：MD5（128位，2004年王小云团队证明碰撞攻击，2008年实际碰撞伪造SSL证书，已不安全，不推荐用于安全场景，可用于非安全场景如文件校验/UUID）、SHA-1（160位，2017年Google证明实际碰撞SHAttered，已不安全，不推荐用于数字签名/证书，NIST已弃用）。c.仍安全：SHA-2（SHA-224/256/384/512，当前主流，未发现有效碰撞）、SHA-3（Keccak，最新标准，基于海绵结构，安全性更高）、SM3（中国国密，256位，安全，国内合规）、BLAKE2/3（高性能安全哈希）。4.密码存储注意：不能直接用MD5/SHA等快速哈希存储密码（易被彩虹表/暴力破解），应使用加盐（Salt）+慢哈希算法（bcrypt、scrypt、Argon2、PBKDF2），这些算法计算慢（可配置迭代次数/内存/并行度），增加暴力破解成本。5.混合加密（Hybrid Encryption）：实际应用中结合非对称加密和对称加密：用非对称加密交换对称密钥（如RSA加密AES密钥，或DH/ECDH协商AES密钥），用对称密钥加密大量数据（AES加密实际数据，速度快）。这是HTTPS/TLS、IPSec IKE、SSH、PGP等几乎所有安全协议的标准做法。加密算法是安全基础，是高频考点，需掌握对称/非对称/哈希算法区别、常见算法、安全性（MD5/SHA-1已破解，AES/SHA-2/SM2/SM3安全）、混合加密、密码存储（加盐+慢哈希）等。注意：MD5和SHA-1已不安全，不能用于数字签名和密码存储，这是常见易错点。',
    knowledgeId: 'security-crypto', direction: 'security',
  },
  {
    id: 'wlan-o001', type: 'single',
    question: 'WLAN中，以下关于WPA3的说法，错误的是？',
    options: ['WPA3使用SAE（对等同时认证）替代PSK四次握手，抵抗离线字典攻击', 'WPA3强制启用管理帧保护（PMF），防止欺骗解除认证攻击', 'WPA3-Enterprise提供192位安全模式，满足高安全要求', 'WPA3只能在5GHz使用，2.4GHz不支持WPA3'],
    answer: 'WPA3只能在5GHz使用，2.4GHz不支持WPA3',
    explanation: 'WPA3（Wi-Fi Protected Access 3，2018年发布）：当前最新Wi-Fi安全标准，相比WPA2的主要改进：1.SAE（Simultaneous Authentication of Equals，对等同时认证，基于Dragonfly密钥交换算法）：a.替代WPA2-PSK的四次握手（4-Way Handshake）。b.抵抗离线字典攻击（Offline Dictionary Attack）：WPA2-PSK中，攻击者捕获四次握手后可离线暴力破解PSK（弱密码容易被破解）；WPA3-SAE中，每次认证使用不同随机数，攻击者无法离线破解，必须在线尝试（在线尝试会被检测和限制），大大提高安全性。c.前向保密（Forward Secrecy，PFS）：即使长期密钥（PSK）泄露，之前的会话密钥也不会被破解（每次会话使用独立临时密钥）。WPA2不强制前向保密。2.管理帧保护（PMF，Protected Management Frames，802.11w）：a.WPA3强制启用PMF（WPA2中PMF是可选的）。b.保护管理帧（解除认证Deauthentication、解除关联Disassociation、信标Beacon等），防止欺骗解除认证攻击（攻击者发送伪造的解除认证帧让用户掉线，然后进行邪恶双子攻击或密码破解）。c.管理帧加密和认证，防止伪造和篡改。3.192位安全模式（WPA3-Enterprise 192-bit）：a.WPA3企业级提供192位安全套件（CNSA，Commercial National Security Algorithm Suite）。b.使用AES-256-GCMP加密、SHA-384哈希、ECDH P-384密钥交换、ECDSA P-384签名。c.满足政府、金融、军事等高安全要求。4.易连接（Easy Connect，DPP，Device Provisioning Protocol）：a.简化IoT设备的Wi-Fi配置（通过NFC或二维码配置，不需要输入密码）。b.提高IoT设备安全性（IoT设备通常没有输入界面，配置困难，易被攻击）。5.WPA3版本：a.WPA3-Personal（个人级，SAE）：替代WPA2-PSK，适合家庭和小型企业。b.WPA3-Enterprise（企业级，802.1X+SAE/EAP）：替代WPA2-Enterprise，适合中大型企业，支持192位安全模式。6.兼容性：a.WPA3向下兼容WPA2（支持WPA3的AP可同时支持WPA2，允许老设备连接）。b.WPA3功能需要AP和终端都支持才能生效（大多数2019年后的智能手机和笔记本支持WPA3，老设备可能不支持）。7.适用频段：WPA3在2.4GHz和5GHz都支持（WPA3是MAC层安全协议，与频段无关），不是只能在5GHz使用。Wi-Fi 6E扩展到6GHz，6GHz频段强制要求WPA3（6GHz设备必须支持WPA3，不允许WPA2，提高安全性）。WLAN安全是高频考点，需掌握WEP/WPA/WPA2/WPA3各代安全标准、加密算法（WEP RC4/TKIP/AES-CCMP/AES-GCMP）、认证方式（PSK/802.1X/SAE）、WPA3新特性（SAE/PMF/192位/易连接）、适用频段（2.4G和5G都支持）等。注意：WPA3在2.4GHz和5GHz都支持，不是只能在5GHz，这是常见易错点。',
    knowledgeId: 'wlan-security', direction: 'wlan',
  },
  {
    id: 'dcn-o001', type: 'single',
    question: 'VXLAN中，以下关于分布式网关（Distributed Gateway）的说法，错误的是？',
    options: ['分布式网关每台Leaf都是所有VNI的三层网关，虚拟机默认网关在本地Leaf', '跨子网流量在源Leaf直接路由，无需绕行集中网关，延迟低无瓶颈', '分布式网关通过EVPN Type 2路由（携带主机IP）同步主机路由', '分布式网关配置更简单，安全性更高，因为所有流量都经过集中网关'],
    answer: '分布式网关配置更简单，安全性更高，因为所有流量都经过集中网关',
    explanation: 'VXLAN/EVPN三层网关模式：1.集中式网关（Centralized Gateway）：a.所有VNI的三层网关都在一台设备上（通常是Spine或专用网关设备，如华为CE12800/防火墙），虚拟机的默认网关指向集中网关。b.跨子网流量路径：源虚拟机→源Leaf（二层封装VXLAN）→集中网关（解封装，三层路由，重新封装VXLAN）→目的Leaf→目的虚拟机。c.优点：网关集中管理，配置简单，便于集中安全策略控制（所有跨子网流量经过网关，可统一防火墙/IPS/审计）。d.缺点：集中网关是性能瓶颈（所有跨子网流量都经过，东西向流量大时网关带宽和转发能力不足）、单点故障（网关故障所有跨子网通信中断）、延迟高（流量绕行网关，多经过几跳）、东西向流量效率低。2.分布式网关（Distributed Gateway）：a.每台Leaf都是所有VNI的三层网关，虚拟机的默认网关在本地Leaf上（Anycast Gateway，任播网关，所有Leaf的网关IP和MAC相同）。b.跨子网流量路径：源虚拟机→源Leaf（本地三层路由，直接封装VXLAN到目的Leaf）→目的Leaf→目的虚拟机。流量在源Leaf直接路由，无需绕行集中网关。c.优点：延迟低（2跳，与同子网相同）、无瓶颈（分布式转发，每台Leaf只处理本地流量，水平扩展）、无单点故障（Leaf故障只影响本地服务器）、东西向流量效率高（适合数据中心东西向流量为主的场景）。d.缺点：配置复杂（每台Leaf都要配置所有VNI网关和EVPN）、安全策略分散（跨子网流量不经过集中设备，安全控制需在Leaf上分布式部署或引入服务链Service Chain）。3.Anycast Gateway（任播网关）：a.所有Leaf的三层网关IP和MAC地址相同（任播地址）。b.虚拟机无论迁移到哪台Leaf，默认网关都不变，无需重新配置，实现无缝迁移。c.虚拟机发送到网关的流量，由本地Leaf响应（因为本地Leaf有相同的网关IP/MAC），不需要跨网络。4.EVPN分布式网关路由：a.Type 2路由（MAC/IP Advertisement）：携带主机的MAC地址和IP地址（IP可选，分布式网关需要IP字段），每台Leaf学习到所有虚拟机的IP-VTEP映射。b.跨子网路由：源Leaf收到虚拟机发送到其他子网的流量，查路由表（主机路由/32位，通过Type 2学习到目的IP对应的VTEP），直接封装VXLAN到目的Leaf，目的Leaf解封装后转发给目的虚拟机。c.Type 5路由（IP Prefix Route）：通告IP前缀路由（如外部路由、汇总路由、默认路由），用于分布式网关场景下访问外部网络（通过边界Leaf/防火墙引入外部路由）。5.对比总结：| 维度 | 集中式网关 | 分布式网关 | |---|---|---| | 网关位置 | 集中设备（Spine/专用网关） | 每台Leaf | | 跨子网路径 | 绕行集中网关（3-4跳） | 源Leaf直接路由（2跳） | | 性能 | 集中网关瓶颈 | 分布式，无瓶颈 | | 可靠性 | 单点故障 | 无单点故障 | | 配置 | 简单 | 复杂 | | 安全控制 | 集中（所有流量经过网关） | 分散（需分布式安全/服务链） | | 适用场景 | 小型数据中心/集中安全 | 中大型数据中心/东西向流量大 | 分布式网关是当前数据中心VXLAN/EVPN的主流方案（中大型数据中心、东西向流量为主），集中式网关适合小型数据中心或需要集中安全控制的场景。EVPN支持两种网关模式，可根据需求选择。VXLAN网关是高频考点，需掌握集中式/分布式网关区别、Anycast Gateway、EVPN Type 2/5路由、流量路径、适用场景等。注意：分布式网关配置更复杂，安全策略分散（不是更简单更安全），这是常见易错点。',
    knowledgeId: 'dcn-vxlan-gateway', direction: 'dcn',
  },
'''

idx = content.rfind(']')
new_content = content[:idx] + questions + '\n' + content[idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

count = new_content.count("question: '")
print(f"Inserted batch O, total questions: {count}")
