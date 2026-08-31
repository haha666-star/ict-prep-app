import re

filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\data\quizzes.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

questions = '''
  // ==================== 扩充题库 Batch H ====================
  {
    id: 'wlan-h001', type: 'single',
    question: 'WLAN中，以下哪种安全标准使用SAE（对等同时认证）替代PSK四次握手，抵抗离线字典攻击？',
    options: ['WPA', 'WPA2', 'WPA3', 'WEP'],
    answer: 'WPA3',
    explanation: 'WPA3（Wi-Fi Protected Access 3，Wi-Fi保护访问3，2018年发布）是当前最新的Wi-Fi安全标准，相比WPA2的主要改进：1.SAE（Simultaneous Authentication of Equals，对等同时认证，基于Dragonfly密钥交换算法）：替代WPA2-PSK的四次握手（4-Way Handshake），抵抗离线字典攻击（Offline Dictionary Attack）。WPA2-PSK中，攻击者捕获四次握手报文后，可以离线暴力破解PSK（弱密码容易被破解）；WPA3-SAE中，每次认证使用不同的随机数，攻击者无法离线破解，必须在线尝试（在线尝试会被检测和限制），大大提高安全性。2.前向保密（Forward Secrecy，也叫完美前向保密PFS）：即使长期密钥（PSK或证书）泄露，之前的会话密钥也不会被破解（因为每次会话使用独立的临时密钥）。WPA2不强制前向保密，WPA3强制。3.管理帧保护（PMF，Protected Management Frames，802.11w）：WPA3强制启用PMF，保护管理帧（解除认证、解除关联、信标等），防止欺骗解除认证攻击（Deauthentication Attack，攻击者发送伪造的解除认证帧让用户掉线）。WPA2中PMF是可选的。4.192位安全模式（WPA3-Enterprise 192-bit）：WPA3企业级提供192位安全套件（CNSA，Commercial National Security Algorithm Suite），使用AES-256-GCMP加密、SHA-384哈希、ECDH P-384密钥交换、ECDSA P-384签名，满足政府、金融、军事等高安全要求。5.易连接（Easy Connect，也叫Device Provisioning Protocol，DPP）：简化IoT设备的Wi-Fi配置（通过NFC或二维码配置，不需要输入密码），提高IoT设备安全性。WPA3版本：1.WPA3-Personal（个人级，SAE）：替代WPA2-PSK，适合家庭和小型企业。2.WPA3-Enterprise（企业级，802.1X+SAE/EAP）：替代WPA2-Enterprise，适合中大型企业，支持192位安全模式。WPA3向下兼容WPA2（支持WPA3的AP可以同时支持WPA2，允许老设备连接），但WPA3功能需要AP和终端都支持才能生效。WEP（已破解，不安全）、WPA（TKIP，已淘汰）、WPA2（AES-CCMP，当前主流，但有KRACK和离线字典攻击风险）、WPA3（最新，最安全）。WLAN安全是华为ICT大赛WLAN赛道的高频考点，需掌握各代安全标准、加密算法、认证方式、WPA3新特性（SAE、前向保密、PMF）等。',
    knowledgeId: 'wlan-security', direction: 'wlan',
  },
  {
    id: 'wlan-h002', type: 'judge',
    question: 'WLAN中，802.11r快速漫游（FT）通过PMK-R0/R1密钥层次，漫游时无需重新进行802.1X认证，实现毫秒级切换。',
    options: ['正确', '错误'], answer: '正确',
    explanation: '802.11r（Fast BSS Transition，快速BSS切换，也叫FT，Fast Transition）：WLAN漫游优化标准，减少漫游时的认证和密钥协商时间，实现毫秒级快速切换，避免语音/视频等实时业务中断。传统漫游（无802.11r）：终端漫游到新AP时，需要重新进行完整的802.1X认证（企业级WPA/WPA2，与RADIUS服务器通信，数百毫秒到1秒）+四次握手（4-Way Handshake，生成PTK），耗时长，可能导致语音通话中断或视频卡顿。802.11r快速漫游原理：1.PMK密钥层次：a.PMK-R0（R0密钥）：由认证服务器（RADIUS）或AC生成，存储在R0密钥持有者（R0KH，通常是AC或认证服务器），是整个漫游域的根密钥。b.PMK-R1（R1密钥）：由PMK-R0派生，存储在R1密钥持有者（R1KH，通常是AP），每个AP有自己的PMK-R1。c.PTK（Pairwise Transient Key，成对临时密钥）：由PMK-R1派生，用于加密终端与AP之间的数据。2.预认证（Pre-authentication）：终端在漫游前，通过当前AP与目标AP预认证，获取目标AP的PMK-R1（或PMK-R0的派生材料）。3.快速切换：漫游时，终端与目标AP直接使用PMK-R1协商PTK（只需2次FT消息交换，而非完整的802.1X认证+四次握手），实现<50ms快速切换。802.11r两种模式：1.Over-the-DS（通过分布式系统）：终端通过当前AP与目标AP通信（预认证和FT请求都通过当前AP转发），终端不需要离开当前AP信道，更常用。2.Over-the-Air（直接无线）：终端直接与目标AP通信（离开当前AP信道，直接发送FT请求给目标AP），切换稍慢但更直接。802.11r与802.11k（Radio Resource Measurement，无线资源测量，帮助终端快速发现邻居AP，减少扫描时间）和802.11v（BSS Transition Management，BSS过渡管理，AC/AP指导终端漫游到更优AP，实现负载均衡和优化覆盖）配合（合称802.11k/v/r），实现智能快速漫游，是企业WLAN的重要功能，特别适合VoWiFi（Voice over WiFi）、视频会议等实时业务。802.11r需要AP和终端都支持才能生效（大多数现代智能手机和笔记本支持）。华为AC支持802.11r，可在安全模板下配置ft enable，支持Over-the-DS和Over-the-Air模式，可与802.11k/v配合实现智能漫游。WLAN漫游是华为ICT大赛WLAN赛道的高频考点，需掌握漫游类型（同AC/跨AC、二层/三层）、802.11r原理、PMK密钥层次、FT消息、与802.11k/v配合等。',
    knowledgeId: 'wlan-roaming', direction: 'wlan',
  },
  {
    id: 'dcn-h001', type: 'single',
    question: '数据中心网络中，underlay网络和overlay网络的关系是？',
    options: ['underlay是底层物理网络（IP Fabric），overlay是在underlay之上构建的虚拟网络（VXLAN）', 'underlay是虚拟网络，overlay是物理网络', 'underlay和overlay是同一层', 'underlay用于用户数据，overlay用于管理数据'],
    answer: 'underlay是底层物理网络（IP Fabric），overlay是在underlay之上构建的虚拟网络（VXLAN）',
    explanation: '数据中心网络underlay/overlay架构：1.Underlay网络（底层网络）：物理网络基础设施，由交换机（Spine/Leaf）、路由器、链路组成，运行传统三层路由协议（OSPF/IS-IS/BGP），提供IP连通性和ECMP多路径负载分担。Underlay的作用：为overlay提供高速、可靠、无阻塞的IP传输通道，只负责将IP报文从一个VTEP传输到另一个VTEP，不关心虚拟机、租户、VLAN等逻辑信息。Underlay特点：简单、稳定、高性能、可扩展（Spine-Leaf架构，水平扩展），通常不做复杂策略（如ACL、QoS），只做高速转发。2.Overlay网络（叠加网络）：在underlay之上构建的虚拟网络，通过隧道封装（如VXLAN、NVGRE、GRE）将原始二层帧封装在IP报文中，在underlay三层网络上传输，构建大二层虚拟网络。Overlay的作用：提供大二层扩展（虚拟机迁移IP不变）、多租户隔离（不同VNI隔离）、灵活的网络服务（分布式网关、服务链、负载均衡等），满足云计算和多租户数据中心需求。Overlay特点：灵活、可扩展、与物理网络解耦（虚拟机迁移不影响物理网络）、支持多租户、软件定义（可通过控制器自动化配置）。3.两者关系：a.Underlay是基础，overlay依赖underlay提供IP连通性（VXLAN报文是UDP/IP报文，需要underlay路由转发）。b.Overlay是上层服务，在underlay之上提供虚拟网络功能，不改变underlay拓扑。c.两者独立扩展：underlay通过增加Spine/Leaf扩展带宽和接入，overlay通过增加VNI和VTEP扩展租户和虚拟网络。d.常见组合：IP Fabric（OSPF/IS-IS/BGP）underlay + EVPN/VXLAN overlay，是当前数据中心网络的标准架构。4.VTEP（VXLAN Tunnel End Point，VXLAN隧道端点）：是underlay和overlay的边界点，负责VXLAN封装（overlay→underlay，将原始帧封装为VXLAN UDP/IP报文）和解封装（underlay→overlay，剥离VXLAN头恢复原始帧）。VTEP可以在物理交换机（硬件VTEP，Leaf交换机）、虚拟交换机（软件VTEP，如OVS）、智能网卡（SmartNIC，卸载封装）上实现。5.underlay网络设计：a.Spine-Leaf架构（Clos架构），任意两台服务器2跳，ECMP多路径。b.underlay路由协议：OSPF（简单，适合中小规模）、IS-IS（高效，适合大规模）、eBGP（最稳定，无环路，适合超大规模，云厂商首选）。c.underlay不启用STP（三层网络无环路，用ECMP替代STP，充分利用所有链路）。d.underlay不启用组播（通常用头端复制HER替代组播，简化underlay）。6.overlay网络设计：a.VXLAN封装（MAC-in-UDP，UDP 4789）。b.EVPN控制面（BGP EVPN，Type 2/3/5路由）。c.分布式网关（Anycast Gateway，每台Leaf都是网关）。d.多租户隔离（VNI，每个租户一个或多个VNI）。underlay/overlay是数据中心网络的核心概念，是华为ICT大赛DCN赛道的高频考点，需掌握两者定义、关系、常见技术组合、VTEP作用、underlay路由协议选择等。',
    knowledgeId: 'dcn-vxlan-basic', direction: 'dcn',
  },
  {
    id: 'dcn-h002', type: 'judge',
    question: 'SD-WAN（软件定义广域网）相比传统MPLS VPN，可使用Internet链路降低成本，并通过智能选路保证关键应用体验。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'SD-WAN（Software Defined Wide Area Network，软件定义广域网）：基于SDN技术的广域网解决方案，是当前企业广域网改造的主流方向。相比传统MPLS VPN的优势：1.降低成本：可使用廉价的Internet链路（宽带、4G/5G、LTE）替代或补充昂贵的MPLS专线，混合链路（Hybrid WAN，MPLS+Internet+4G/5G），降低广域网成本（通常可降低30-50%，MPLS专线月租费高）。2.智能选路（Application-aware Routing）：基于应用识别（DPI深度包检测，识别具体应用如Office 365、Zoom、SAP等）和链路质量（延迟、丢包、抖动、带宽利用率），动态选择最优链路（关键应用走MPLS或高质量Internet，普通应用走普通Internet），提高用户体验和链路利用率。传统MPLS VPN只能基于目的地址选路，不感知应用和链路质量。3.集中管理和自动化：云管平台（Controller）统一配置、监控、运维，零接触部署（ZTP，Zero Touch Provisioning，设备上电自动获取配置），减少运维成本和部署时间。传统MPLS VPN需要在每台CE/PE上手动配置，复杂且耗时。4.应用优化：内置应用识别、QoS、TCP优化、缓存、压缩、FEC（前向纠错）、报文复制等，提升应用体验（尤其跨广域网的应用）。5.安全集成：集成防火墙、IPS、URL过滤、加密等安全功能（SASE，Secure Access Service Edge，安全访问服务边缘，将SD-WAN与安全服务融合，云原生安全），传统MPLS VPN需要额外部署安全设备。6.灵活扩展：支持多种链路类型（MPLS、Internet、4G/5G、卫星），快速开通新分支（天级 vs MPLS的周/月级），支持云应用访问（直接访问云服务，不需要绕行总部）。SD-WAN与传统MPLS VPN对比：| 维度 | 传统MPLS VPN | SD-WAN | |---|---|---| | 链路 | 仅MPLS专线 | 混合链路（MPLS+Internet+4G/5G） | | 成本 | 高（MPLS专线贵） | 低（利用廉价Internet） | | 选路 | 基于目的地址，静态 | 基于应用+链路质量，动态智能 | | 部署 | 慢（手动配置，周/月级） | 快（ZTP零接触，天级） | | 管理 | 分布式（每台设备配置） | 集中式（云管平台） | | 安全 | 需额外安全设备 | 集成安全（SASE） | | 云应用 | 绕行总部 | 直接访问（云网关） | SD-WAN不是要完全替代MPLS，而是混合使用（关键业务仍可用MPLS，普通业务用Internet），根据业务需求灵活选择。SD-WAN适用于：多分支企业、云应用多的企业、需要快速开通分支的企业、对广域网成本敏感的企业。SD-WAN是华为ICT大赛DCN/网络赛道的考点，需掌握原理、与MPLS对比、智能选路、ZTP、SASE、应用场景等。华为SD-WAN解决方案：AR路由器（CPE）+ iMaster NCE-WAN控制器，支持混合链路、智能选路、应用优化、安全集成等。',
    knowledgeId: 'dcn-sdn-basic', direction: 'dcn',
  },
  {
    id: 'dc-h001', type: 'single',
    question: 'BGP中，以下哪个属性用于影响本AS的出站流量，值越大越优先？',
    options: ['MED', 'Local_Pref（本地优先级）', 'AS_Path', 'Origin'],
    answer: 'Local_Pref（本地优先级）',
    explanation: 'BGP路径属性对比：1.Local_Pref（Local Preference，本地优先级）：公认自由决定属性，默认100，值越大越优先。作用：影响本AS的出站流量（本AS内路由器选择从哪个出口出去访问外部网络）。Local_Pref仅在IBGP邻居之间传递，不传给EBGP邻居（在本AS内有效，外部AS看不到）。配置：在入口路由器（从EBGP收到路由时）根据策略设置Local_Pref（如对重要前缀设置高Local_Pref，引导流量从特定出口出去）。2.MED（Multi-Exit Discriminator，多出口区分符，也叫Metric）：可选非过渡属性，默认0，值越小越优先。作用：影响相邻AS的入站流量（告诉对端AS从哪个入口进入本AS更优）。MED只在相邻两个AS之间传递，默认不跨AS（收到的MED只用于本AS与相邻AS的比较，不会传给第三个AS），除非配置always-compare-med。配置：在出口路由器（向EBGP邻居发布路由时）根据策略设置MED（如希望对端从特定入口进入，设置该入口的MED较小）。3.AS_Path（AS路径）：公认必遵属性，路由经过的AS列表，越短越优先。作用：防环（收到包含自己AS号的路由则丢弃）和路由优选（AS_Path短的优先）。可通过AS_Path前置（AS-Path Prepend，在路由前添加多次自己的AS号，使AS_Path变长，降低优先级）控制入站流量。4.Origin（起源）：公认必遵属性，IGP（i，最优先）> EGP（e）> Incomplete（?，最不优先）。作用：标识路由来源，影响路由优选。Local_Pref vs MED对比：| 属性 | 影响方向 | 优先级方向 | 传递范围 | 默认值 | |---|---|---|---|---| | Local_Pref | 本AS出站 | 值大优先 | IBGP内 | 100 | | MED | 相邻AS入站 | 值小优先 | 相邻AS间 | 0 | 简单记忆：Local_Pref管"出去"（出站，从本AS哪个出口出去），值大优先；MED管"进来"（入站，对端从哪个入口进来），值小优先。BGP流量工程：1.出站流量控制：主要用Local_Pref（在本AS入口设置，影响本AS内路由器选择出口）。2.入站流量控制：主要用MED（告诉对端从哪个入口进来）和AS_Path前置（使某些入口的路由AS_Path变长，降低优先级），但入站流量控制更难（因为对端AS的策略不受本AS控制，MED只是建议，对端可以忽略）。BGP属性和流量工程是华为ICT大赛网络赛道的高频考点，需掌握各属性的作用、默认值、传递范围、优先级方向、配置方法、流量工程应用等。',
    knowledgeId: 'datacom-bgp', direction: 'datacom',
  },
  {
    id: 'dc-h002', type: 'judge',
    question: 'OSPF中，SPF算法（最短路径优先）基于链路状态数据库（LSDB）计算最短路径树，以自己为根节点。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'OSPF（Open Shortest Path First，开放最短路径优先）是链路状态路由协议，使用SPF算法（Shortest Path First，最短路径优先，也叫Dijkstra算法，由荷兰计算机科学家Edsger Dijkstra提出）计算最短路径。OSPF工作过程：1.发现邻居：通过Hello报文发现和维护邻居关系（2-Way状态）。2.建立邻接：通过DD/LSR/LSU/LSAck报文交换链路状态信息，同步链路状态数据库（LSDB，Link State Database），达到Full状态。3.泛洪LSA：拓扑变化时，通过LSU报文泛洪LSA（链路状态通告），确保所有路由器的LSDB一致（链路状态协议的关键：所有路由器有相同的LSDB，即相同的网络拓扑图）。4.SPF计算：每台路由器基于自己的LSDB（完整的网络拓扑图），以自己为根节点，运行SPF算法（Dijkstra算法）计算最短路径树（Shortest Path Tree），得到到每个目的网络的最短路径和下一跳。5.生成路由：将SPF计算结果写入路由表（OSPF路由，优先级10）。SPF算法特点：a.以自己为根：每台路由器独立计算，以自己为根节点，得到从自己到所有目的的最短路径。b.基于完整拓扑：链路状态协议中，每台路由器都有完整的网络拓扑（LSDB），可以独立计算最短路径，不像距离矢量协议（RIP）只知道邻居的路由（传闻式路由，容易环路和计数到无穷）。c.计算复杂度：Dijkstra算法时间复杂度O(N^2)（N为节点数），区域内路由器数量多时SPF计算开销大，所以OSPF划分区域（Area）减少每台路由器的LSDB规模和SPF计算范围（区域内计算Type 1/2，区域间用Type 3不跑SPF，外部用Type 5不跑SPF）。d.触发计算：拓扑变化时触发SPF计算（可配置SPF计算延迟和保持时间，避免频繁计算），但只有变化的区域需要重新计算（其他区域不受影响）。OSPF区域划分的原因：1.减少LSDB规模（每台路由器只需维护本区域+其他区域的汇总路由，不需要所有区域的详细拓扑）。2.减少SPF计算范围（区域内拓扑变化只触发本区域SPF，不影响其他区域）。3.减少LSA泛洪范围（Type 1/2只在本区域泛洪）。4.支持末梢区域（Stub/Totally Stub/NSSA）进一步减少LSA和路由表。5.提高网络稳定性和可扩展性。SPF算法和链路状态原理是华为ICT大赛网络赛道的基础考点，需掌握OSPF工作过程、LSDB、LSA类型、SPF计算、区域划分原因等。注意：OSPF区域内路由（Intra-area，Type 1/2）通过SPF计算，区域间路由（Inter-area，Type 3）和外部路由（External，Type 5/7）不通过SPF计算（直接作为叶子节点挂在最短路径树上，类似距离矢量），所以区域间和外部路由可能有环路风险（OSPF通过区域设计和防环机制避免）。',
    knowledgeId: 'datacom-ospf', direction: 'datacom',
  },
'''

idx = content.rfind(']')
new_content = content[:idx] + questions + '\n' + content[idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

count = new_content.count("question: '")
print(f"Inserted batch H, total questions: {count}")
