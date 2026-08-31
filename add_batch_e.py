import re

filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\data\quizzes.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

questions = '''
  // ==================== 扩充题库 Batch E ====================
  {
    id: 'dc-e001', type: 'single',
    question: 'OSPF中，NSSA区域与Stub区域的主要区别是？',
    options: ['NSSA允许引入外部路由（Type 7），Stub不允许', 'NSSA不接收Type 3，Stub接收', 'NSSA不接收Type 5，Stub接收', 'NSSA是骨干区域，Stub不是'],
    answer: 'NSSA允许引入外部路由（Type 7），Stub不允许',
    explanation: 'OSPF末梢区域对比：Stub区域：不接收Type 4（ASBR位置）和Type 5（外部路由），但接收Type 3（区域间路由）和Type 1/2（本区域）。Stub区域内不能有ASBR（不能引入外部路由）。Totally Stub：不接收Type 3（除默认路由）、Type 4、Type 5，只接收Type 1/2和默认Type 3，最严格。NSSA（Not-So-Stubby Area，非纯末梢区域）：不接收Type 4和Type 5，但接收Type 3，且允许本区域内有ASBR引入外部路由（生成Type 7 LSA，仅在NSSA内泛洪，到ABR后转换为Type 5发布到其他区域）。NSSA解决了Stub区域不能引入外部路由的限制，适用于需要引入外部路由但又想减少LSA的末节区域。Totally NSSA：不接收Type 3（除默认）、Type 4、Type 5，允许Type 7，是NSSA的更严格版本。四种末梢区域都不能有虚链路（Virtual Link），都不能有ASBR（NSSA除外）。末梢区域的作用：减少LSA数量和路由表规模，提高稳定性，降低路由器资源消耗，适用于只有一个出口的末节区域。',
    knowledgeId: 'datacom-ospf', direction: 'datacom',
  },
  {
    id: 'dc-e002', type: 'single',
    question: 'BGP中，路由反射器（RR）从客户端学到的路由会反射给谁？',
    options: ['仅反射给其他客户端', '反射给所有客户端和非客户端', '仅反射给非客户端', '不反射，只自己使用'],
    answer: '反射给所有客户端和非客户端',
    explanation: 'BGP路由反射器（RR，Route Reflector）的反射规则：1.从客户端（Client）学到的路由：反射给所有其他客户端和所有非客户端（Non-client）。2.从非客户端学到的路由：仅反射给所有客户端，不反射给其他非客户端。3.从EBGP邻居学到的路由：发给所有客户端和非客户端（正常BGP行为）。4.从EBGP学到的路由不反射给EBGP邻居（正常BGP行为，防环）。RR打破了IBGP水平分割（从IBGP学到的路由不再传给其他IBGP），通过反射机制使IBGP邻居无需全互联。RR的防环机制：Originator_ID（标记路由原始发起者，原始发起者收到含自己ID的路由则丢弃）和Cluster_List（记录路由经过的RR簇，RR收到含自己Cluster ID的路由则丢弃）。RR的客户端（Client）：与RR建立IBGP邻居，接受RR反射的路由，客户端之间不需要建立IBGP邻居。非客户端（Non-client）：与RR建立IBGP邻居，但不是RR的客户端，非客户端之间仍需全互联（或被其他RR管理）。一个RR可管理多个客户端，形成一个簇（Cluster），簇ID默认是RR的Router ID，可手动配置。多个RR可组成相同簇（相同Cluster ID），提供冗余备份，避免单点故障。RR是大规模BGP网络的必备技术，运营商网络和大型企业网络广泛使用，替代IBGP全互联（n台路由器需n(n-1)/2条IBGP邻居，扩展性差）。RR可层级部署（RR的RR，即分层路由反射），适用于超大规模网络。',
    knowledgeId: 'datacom-bgp', direction: 'datacom',
  },
  {
    id: 'dc-e003', type: 'judge',
    question: 'IS-IS中，DIS（指定中间系统）选举是可抢占的，新加入的高优先级路由器会立即成为DIS。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'IS-IS中DIS（Designated IS，指定中间系统）选举特点：1.选举依据：接口优先级（Priority，0-127，默认64，值越大越优先，优先级0也参与选举），优先级相同时System ID大的优先。2.可抢占（Preemptive）：新加入的高优先级路由器会立即抢占成为DIS，不需要等待当前DIS故障。这与OSPF不同（OSPF DR不可抢占，只有DR故障时BDR才成为DR）。3.没有备份DIS（没有BDR）：DIS故障后需要重新选举新DIS，期间有短暂中断。OSPF有BDR（备份指定路由器），DR故障后BDR立即成为DR，无中断。4.DIS负责：生成伪节点（Pseudonode）LSP（简化广播网络链路状态描述）、周期性发送CSNP（完全序列号报文，10秒一次，用于数据库同步）。IS-IS DIS与OSPF DR对比：IS-IS DIS可抢占、无备份、优先级0也参与、生成伪节点LSP；OSPF DR不可抢占、有BDR备份、优先级0不参与选举（DROther）、生成Type 2 Network LSA。两者都是在广播网络（Broadcast）和NBMA网络中选举，点到点（P2P）和点到多点（P2MP）网络不选举。DIS的优先级可通过isis dis-priority命令在接口上配置（0-127），修改后立即生效（可抢占）。DIS选举是IS-IS的重要机制，确保广播网络中链路状态数据库的高效同步和LSA的高效泛洪。',
    knowledgeId: 'datacom-isis', direction: 'datacom',
  },
  {
    id: 'dc-e004', type: 'single',
    question: 'MSTP中，MST域（MST Region）的判定条件不包括以下哪项？',
    options: ['域名（Configuration Name）相同', '修订级别（Revision Level）相同', 'VLAN-实例映射关系相同', '交换机的MAC地址相同'],
    answer: '交换机的MAC地址相同',
    explanation: 'MSTP（Multiple Spanning Tree Protocol，802.1s）中，MST域（MST Region）的判定条件（三个条件必须完全相同）：1.域名（Configuration Name，配置名称，32字节）：MST域的名称，标识一个MST域。2.修订级别（Revision Level，修订级别，2字节）：MST域配置的版本号，修改配置后可递增。3.VLAN-实例映射关系（VLAN-to-instance Mapping，VLAN与MSTI的映射关系）：哪些VLAN映射到哪个MSTI实例。这三个条件完全相同的交换机才属于同一个MST域，不同MST域之间通过CST（公共生成树）互通。MAC地址不需要相同（每台交换机MAC地址都不同）。MST域内运行多个MSTI（多生成树实例），每个MSTI独立计算生成树，可映射不同VLAN，实现VLAN负载分担（不同VLAN走不同路径，提高链路利用率）。MSTI仅在MST域内有效，不跨域。MSTP兼容STP和RSTP：与STP/RSTP设备互联时，MSTP端口发送STP/RSTP BPDU（或MSTP BPDU，STP设备将MSTP BPDU视为RSTP BPDU），实现互通。MSTP的优势：兼容STP/RSTP、多实例负载分担、减少VLAN场景端口阻塞、提高链路利用率、可扩展性好，是企业网络的主流生成树协议。华为交换机默认MSTP模式，可通过stp mode命令修改为STP/RSTP/MSTP。MSTP配置：配置域名、修订级别、VLAN-实例映射、MSTI优先级（指定根桥/备份根桥）、端口优先级/路径开销等。MSTP是华为ICT大赛网络赛道的高频考点，需重点掌握MST域配置、MSTI负载分担、与STP/RSTP互通等。',
    knowledgeId: 'datacom-stp', direction: 'datacom',
  },
  {
    id: 'dc-e005', type: 'single',
    question: '以下关于静态路由的说法，错误的是？',
    options: ['静态路由由管理员手动配置，不会自动适应拓扑变化', '静态路由优先级默认60，数值越小优先级越高', '静态路由支持迭代（下一跳非直连时递归查找最终下一跳）', '静态路由不能用于默认路由（0.0.0.0/0）'],
    answer: '静态路由不能用于默认路由（0.0.0.0/0）',
    explanation: '静态路由（Static Route）特点：1.手动配置：由管理员手动配置，不会自动适应拓扑变化，拓扑变化后需手动修改，适合小型稳定网络。2.优先级默认60（华为），数值越小优先级越高，可通过preference参数修改。3.支持迭代（递归查找）：下一跳非直连时，递归查找最终下一跳（通过路由表查找下一跳的出接口）。4.可用于默认路由：ip route-static 0.0.0.0 0.0.0.0 下一跳，静态默认路由是最常用的默认路由方式（企业出口指向ISP）。5.支持浮动静态路由（Floating Static）：配置高优先级（大数值）作为备份，主路由故障时启用。6.支持黑洞路由（Null0）：下一跳为Null0接口，丢弃匹配流量，用于防环路或流量过滤。7.支持永久静态路由（Permanent）：出接口down时仍保留在路由表中（普通静态路由出接口down时撤销）。静态路由的优点：简单、可控、不占用带宽（无路由协议报文）、安全（不广播路由信息）、路由器资源消耗小。缺点：不能自动适应拓扑变化、配置维护工作量大（大规模网络）、容易配置错误、不适合大规模复杂网络。静态路由适用于：小型网络、末节网络（只有一个出口）、默认路由、特定流量的精确控制、与动态路由协议配合（如引入静态路由到OSPF/BGP）。静态路由是华为ICT大赛网络赛道的基础考点，需掌握配置、优先级、迭代、浮动路由、黑洞路由、默认路由等。',
    knowledgeId: 'datacom-static-route', direction: 'datacom',
  },
  {
    id: 'sec-e001', type: 'single',
    question: '防火墙中，ASPF（应用层包过滤）的主要作用是？',
    options: ['检测应用层协议状态，自动开放动态端口（如FTP数据连接）', '加密应用层数据', '过滤URL', '防病毒'],
    answer: '检测应用层协议状态，自动开放动态端口（如FTP数据连接）',
    explanation: 'ASPF（Application Specific Packet Filter，应用层包过滤，也叫状态检测的应用层扩展）：1.检测应用层协议状态：跟踪应用层协议的协商过程（如FTP的PORT/PASV命令、SIP的邀请/响应、H.323的呼叫建立、RTSP的播放/暂停、DNS的查询/响应等），理解应用层语义。2.自动开放动态端口：很多应用层协议（如FTP主动模式、SIP、H.323、RTSP、Oracle等）在控制连接中协商动态数据端口，数据连接使用临时端口，传统包过滤无法预知这些端口（无法预先开放），ASPF检测控制连接中的协商信息，自动临时开放对应的数据端口（创建临时会话表项），数据传输完成后自动关闭，既保证应用正常工作，又提高安全性（不需要长期开放大范围端口）。3.检测应用层异常：如FTP命令序列异常、SIP消息格式错误、DNS报文异常等，防止应用层攻击。4.支持的协议：FTP、SIP、H.323（H.225/H.245）、RTSP、DNS、HTTP、SMTP、POP3、IMAP、Oracle、MSN/QQ（即时通讯）、PPTP、SQL*Net等。ASPF与状态检测（Stateful Inspection）的关系：状态检测跟踪传输层状态（TCP/UDP/ICMP会话），ASPF进一步跟踪应用层状态（应用层协议协商和动态端口），是状态检测的扩展和增强。华为防火墙默认开启状态检测，ASPF需在安全策略或域间配置中启用（detect ftp/sip/h323等）。ASPF是防火墙的重要功能，确保多通道应用（控制+数据）在严格安全策略下正常工作，是华为ICT大赛安全赛道的高频考点。注意：ASPF只检测应用层控制连接中的协商信息，不进行深度内容检测（DPI），深度内容检测由IPS/AV/URL过滤等UTM功能完成。',
    knowledgeId: 'security-firewall-basic', direction: 'security',
  },
  {
    id: 'sec-e002', type: 'single',
    question: 'IPSec中，传输模式（Transport Mode）与隧道模式（Tunnel Mode）的主要区别是？',
    options: ['传输模式不新增IP头（原IP头不变），隧道模式新增外部IP头', '传输模式更安全', '隧道模式只能用于IPv6', '传输模式只能用于网关到网关'],
    answer: '传输模式不新增IP头（原IP头不变），隧道模式新增外部IP头',
    explanation: 'IPSec两种工作模式：1.传输模式（Transport Mode）：不新增外部IP头，原IP头保持不变，IPSec头（AH/ESP）插入在原IP头和传输层头之间。保护的是传输层及以上（TCP/UDP/应用数据），原IP头不被加密（ESP传输模式不加密IP头，AH认证IP头）。适用于主机到主机（End-to-End）通信，两台主机都支持IPSec，直接在两端之间建立IPSec，保护端到端通信。传输模式开销小（不新增IP头），但原IP头明文暴露（可被看到源/目的IP），且不支持NAT（NAT修改IP头会导致AH认证失败，ESP可用NAT-T但传输模式有限制）。2.隧道模式（Tunnel Mode）：新增外部IP头（新的源/目的IP，通常是VPN网关的IP），原IP头（用户的源/目的IP）被加密保护（ESP隧道模式加密整个原始IP包，包括原IP头）。适用于网关到网关（Site-to-Site）VPN，两台VPN网关之间建立IPSec隧道，用户数据在网关处封装，通过公网传输到对端网关解封装，用户主机不需要支持IPSec。隧道模式开销大（新增IP头，MTU减小），但原IP头被加密隐藏（更安全，用户内网拓扑不暴露），支持NAT（NAT-T），是VPN的主流模式。AH和ESP都支持传输模式和隧道模式，但AH不支持NAT（认证整个IP头，NAT修改IP头导致认证失败），ESP支持NAT-T（封装在UDP中）。IPSec VPN通常使用ESP隧道模式（加密+认证+网关到网关+支持NAT）。传输模式用于主机到主机的端到端保护（如服务器之间安全通信），隧道模式用于站点到站点VPN和远程接入VPN。',
    knowledgeId: 'security-ipsec', direction: 'security',
  },
  {
    id: 'sec-e003', type: 'judge',
    question: '入侵防御系统（IPS）与入侵检测系统（IDS）的主要区别是IPS可以实时阻断攻击，IDS只能检测和告警。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'IDS（Intrusion Detection System，入侵检测系统）和IPS（Intrusion Prevention System，入侵防御系统）的区别：1.部署方式：IDS通常旁路部署（镜像流量，不串接在网络中），IPS通常串接部署（Inline，流量经过IPS）。2.响应方式：IDS只能检测和告警（发现攻击后发送告警，不阻断流量，因为旁路部署无法阻断），IPS可以实时阻断攻击（发现攻击后直接丢弃或重置连接，因为串接部署可以阻断）。3.实时性：IDS是事后检测（检测到攻击时攻击可能已经发生），IPS是实时防御（在攻击到达目标前阻断）。4.性能要求：IDS对性能要求较低（旁路，不影响业务），IPS对性能要求高（串接，不能成为瓶颈，不能误阻断正常业务）。5.误报影响：IDS误报只产生告警，不影响业务；IPS误报会阻断正常业务，影响较大，所以IPS需要更精确的检测和更谨慎的策略。现代防火墙通常集成IPS功能（UTM/NGFW，下一代防火墙），在防火墙的基础上增加入侵防御、反病毒、URL过滤、应用控制等功能，一台设备实现多种安全防护。IPS检测方法：1.特征匹配（Signature-based）：基于已知攻击特征（漏洞利用代码、恶意软件特征）匹配，准确率高，但只能检测已知攻击。2.异常检测（Anomaly-based）：基于行为基线，检测偏离正常行为的异常，可检测未知攻击（零日攻击），但误报率较高。3.协议分析（Protocol Analysis）：解析应用层协议，检测协议异常和攻击（如SQL注入、XSS、缓冲区溢出）。IPS是华为ICT大赛安全赛道的重要考点，需掌握IPS原理、部署方式、签名管理、响应动作（告警/阻断/重置）、与防火墙联动等。',
    knowledgeId: 'security-ips', direction: 'security',
  },
  {
    id: 'sec-e004', type: 'single',
    question: '以下哪个不是哈希算法（Hash Algorithm）的特性？',
    options: ['固定长度输出', '单向性（不可逆）', '抗碰撞性', '加密后可解密还原'],
    answer: '加密后可解密还原',
    explanation: '哈希算法（Hash Algorithm，散列算法）特性：1.固定长度输出：任意长度输入映射为固定长度输出（如MD5 128位、SHA-256 256位、SM3 256位）。2.单向性（One-way，不可逆）：从输入容易计算哈希值，但从哈希值无法反推原始输入（计算上不可行）。3.抗碰撞性（Collision Resistance）：难以找到两个不同输入产生相同哈希值（计算上不可行）。4.雪崩效应（Avalanche Effect）：输入微小变化（如一位改变）导致输出巨大变化（约一半位改变）。5.确定性：相同输入始终产生相同输出。哈希算法不是加密算法（加密是可逆的，有密钥，可解密还原；哈希是不可逆的，无密钥，不能还原）。哈希算法用途：1.数据完整性校验：文件下载校验、消息完整性验证（对比哈希值）。2.数字签名：对消息摘要签名（非对称加密签名摘要，不直接签名原始消息，因为非对称加密慢）。3.密码存储：存储密码的哈希值（加盐+慢哈希），不存储明文密码，验证时对比哈希。4.消息认证码（HMAC）：哈希+密钥，实现消息认证和完整性。5.区块链：区块哈希、Merkle树。已不安全的哈希算法：MD5（2004年碰撞攻击，已破解）、SHA-1（2017年实际碰撞，已破解）。仍安全的算法：SHA-2（SHA-256/384/512）、SHA-3（Keccak）、SM3（国密）、BLAKE2/3。注意：密码存储不能直接用MD5/SHA等快速哈希（易被彩虹表/暴力破解），应使用加盐+慢哈希算法（bcrypt、scrypt、Argon2、PBKDF2）。哈希算法是华为ICT大赛安全赛道的基础考点，需掌握常见算法、特性、安全性、应用场景等。',
    knowledgeId: 'security-crypto', direction: 'security',
  },
  {
    id: 'wlan-e001', type: 'single',
    question: 'WLAN中，以下哪种认证方式安全性最高？',
    options: ['开放认证（Open System）', '共享密钥认证（Shared Key，WEP）', 'WPA2-PSK（AES）', 'WPA3-Enterprise（802.1X+SAE）'],
    answer: 'WPA3-Enterprise（802.1X+SAE）',
    explanation: 'WLAN认证方式安全性从低到高：1.开放认证（Open System Authentication）：无认证，任何设备都可关联，完全不安全，仅用于公共热点（配合Portal认证）或测试。2.WEP（Wired Equivalent Privacy，有线等效保密）：共享密钥认证+WEP加密（RC4），已被破解（IV重用、密钥流恢复、FMS攻击），安全性极低，已淘汰。3.WPA-PSK（TKIP）：预共享密钥+TKIP加密（RC4的改进，仍不安全），临时过渡方案，已淘汰。4.WPA2-PSK（AES-CCMP）：预共享密钥+AES-CCMP加密，四次握手，安全性较好，但存在KRACK攻击（密钥重装攻击）和离线字典攻击（PSK被捕获后可暴力破解），适合家庭和小型企业。5.WPA2-Enterprise（802.1X+RADIUS）：企业级认证，每个用户独立账号密码（或证书），RADIUS服务器认证，每个用户独立密钥，安全性高，适合中大型企业。6.WPA3-Enterprise（802.1X+SAE/192位安全模式）：WPA3企业级，使用SAE（Simultaneous Authentication of Equals，对等同时认证，抵抗离线字典攻击和KRACK），192位安全模式（CNSA算法套件，最高安全等级），安全性最高，适合高安全要求场景（政府、金融、军事）。7.WPA3-Personal（SAE）：WPA3个人级，使用SAE替代PSK四次握手，抵抗离线字典攻击，安全性比WPA2-PSK高，适合家庭和小型企业。WPA3是当前最新Wi-Fi安全标准（2018年发布），强制使用AES-CCMP（WPA3-Personal）或AES-GCMP-256（WPA3-Enterprise 192位），支持管理帧保护（PMF，Protected Management Frames，防止解除认证攻击），前向保密（Forward Secrecy）。WLAN安全是华为ICT大赛WLAN赛道的高频考点，需掌握各种认证加密方式、原理、安全性、配置等。',
    knowledgeId: 'wlan-security', direction: 'wlan',
  },
  {
    id: 'wlan-e002', type: 'judge',
    question: 'WLAN中，频谱导航（Band Steering）的作用是引导双频终端优先连接5GHz，减轻2.4GHz拥塞。',
    options: ['正确', '错误'], answer: '正确',
    explanation: '频谱导航（Band Steering，也叫频段导航、双频优选）：双频AP同时提供2.4GHz和5GHz两个频段，频谱导航功能引导支持双频的终端（手机、笔记本等）优先连接5GHz频段，将2.4GHz留给仅支持2.4GHz的终端（IoT设备、老设备），从而：1.减轻2.4GHz拥塞（2.4G信道少、干扰大、设备多，容易拥塞）。2.提高整体性能（5G速率高、干扰小、延迟低，双频终端在5G获得更好体验）。3.负载均衡（两个频段合理分配终端，避免2.4G过载而5G空闲）。频谱导航工作原理：1.终端扫描时，AP在2.4GHz延迟响应或不响应Probe Request（探测请求），引导终端去扫描5GHz。2.终端关联2.4GHz时，AP拒绝关联（或先拒绝几次），引导终端关联5GHz。3.如果终端多次尝试2.4G仍不连接5G（可能5G信号弱或终端仅支持2.4G），则允许连接2.4G。4.基于终端的双频能力（支持5G）、信号强度（5G信号足够好）、负载情况（2.4G负载高）综合判断。频谱导航配置：在AP系统模板或VAP模板下配置band-steer enable，可配置拒绝关联次数、5G信号阈值、2.4G负载阈值等参数。频谱导航是企业WLAN的常用功能，尤其高密度场景（会议室、体育场、商场），能显著提升整体性能和用户体验。注意：频谱导航需要终端支持5GHz，仅支持2.4GHz的终端不受影响；频谱导航可能导致终端关联时间稍长（几次拒绝后才允许），但体验提升明显；某些终端可能对频谱导航不友好（反复尝试2.4G），可调整参数或关闭。WLAN射频优化是华为ICT大赛WLAN赛道的高频考点，需掌握频谱导航、负载均衡、漫游优化、信道功率调整、覆盖优化、高密部署等。',
    knowledgeId: 'wlan-rf', direction: 'wlan',
  },
  {
    id: 'dcn-e001', type: 'single',
    question: '数据中心网络中，东西向流量（East-West Traffic）是指？',
    options: ['数据中心内部服务器之间的流量', '数据中心与Internet之间的流量', '数据中心与分支机构之间的流量', '用户访问数据中心的流量'],
    answer: '数据中心内部服务器之间的流量',
    explanation: '数据中心流量分类：1.东西向流量（East-West Traffic）：数据中心内部服务器之间的流量（服务器到服务器），如分布式计算（Hadoop/Spark）、存储访问（SAN/NAS）、虚拟机迁移、微服务通信、数据库复制、应用服务器到数据库服务器等。东西向流量占数据中心总流量的70-80%以上（云计算和分布式应用使得内部流量远大于外部流量）。2.南北向流量（North-South Traffic）：数据中心与外部网络之间的流量（数据中心到Internet/分支机构/用户），如用户访问Web应用、服务器访问Internet、数据中心间互联等。南北向流量占20-30%。东西向流量的特点：流量大、持续增长、模式复杂（多对多通信）、对延迟和带宽敏感、虚拟机动态迁移导致流量模式变化。传统三层架构（核心-汇聚-接入）的问题：东西向流量需要经过核心层（接入→汇聚→核心→汇聚→接入），核心层成为瓶颈，延迟高，带宽不足，STP阻塞冗余链路导致带宽利用率低。Spine-Leaf架构的优势：任意两台服务器通信都是2跳（Leaf→Spine→Leaf），延迟低且一致，ECMP多路径负载分担充分利用所有链路带宽，无阻塞，水平扩展方便，专门优化东西向流量。数据中心网络设计以东西向流量为中心（而不是传统网络以南北向为中心），这是数据中心网络与传统企业网络的核心区别。VXLAN/EVPN大二层、分布式网关、Spine-Leaf、RDMA/RoCE（低延迟存储网络）、网络遥测（Telemetry）等都是为了优化东西向流量。数据中心网络是华为ICT大赛DCN（数据通信网络）赛道的重要方向，需掌握Spine-Leaf、VXLAN、EVPN、SDN、存储网络、网络自动化等。',
    knowledgeId: 'dcn-arch', direction: 'dcn',
  },
  {
    id: 'dcn-e002', type: 'judge',
    question: 'VXLAN中，VNI（VXLAN网络标识符）占24位，支持约1600万个VXLAN网段，远多于VLAN的4094个。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'VXLAN（Virtual Extensible LAN，虚拟可扩展局域网，RFC 7348）中，VNI（VXLAN Network Identifier，VXLAN网络标识符）占24位，支持2^24 = 16,777,216个VXLAN网段（约1600万个），远多于VLAN的4094个（VLAN ID占12位，2^12=4096，可用1-4094）。VNI的作用：1.标识一个VXLAN网段（类似VLAN ID标识VLAN），不同VNI之间二层隔离。2.在VXLAN封装头中携带VNI，对端VTEP根据VNI确定目标VXLAN网段。3.解决VLAN数量不足的问题，满足云计算和多租户数据中心的需求（大量租户需要隔离的二层网络，4094个VLAN远远不够）。VXLAN封装格式：外层以太网头（14字节）+外层IP头（20字节，源/目的VTEP IP）+外层UDP头（8字节，目的端口4789，源端口哈希用于ECMP负载分担）+VXLAN头（8字节，Flags 1字节+Reserved 3字节+VNI 3字节+Reserved 1字节）+原始以太网帧（14字节+载荷+FCS 4字节）。VXLAN头8字节中，VNI占24位（3字节），Flags中I位（第8位）设为1表示VNI有效。VXLAN通过MAC-in-UDP封装，在三层IP网络（underlay）上构建大二层虚拟网络（overlay），解决：1.VLAN数量不足（4094限制）。2.大二层扩展（STP无法支撑大规模二层，VXLAN基于三层underlay，可利用ECMP多路径）。3.虚拟机迁移（IP不变，大二层域内任意迁移，业务不中断）。4.多租户隔离（不同VNI隔离，满足云计算多租户需求）。VXLAN是当前数据中心网络overlay的主流技术，通常与EVPN（控制面）配合使用（IP Fabric + EVPN/VXLAN），被AWS、Azure、Google、阿里云、华为云等所有主流云厂商采用。VXLAN是华为ICT大赛DCN赛道的核心考点，需掌握封装格式、VNI、VTEP、BUM流量处理、头端复制、EVPN控制面、分布式网关等。',
    knowledgeId: 'dcn-vxlan-basic', direction: 'dcn',
  },
'''

idx = content.rfind(']')
new_content = content[:idx] + questions + '\n' + content[idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

count = new_content.count("question: '")
print(f"Inserted batch E, total questions: {count}")
