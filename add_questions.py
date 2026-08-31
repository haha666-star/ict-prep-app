import re

filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\data\quizzes.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 批量题目
questions = '''
  {
    id: 'dc-131', type: 'single',
    question: 'OSPF中，NSSA区域与Stub区域的主要区别是？',
    options: ['NSSA允许引入外部路由（Type 7），Stub不允许', 'NSSA不接收Type 3，Stub接收', 'NSSA不接收Type 5，Stub接收', 'NSSA是骨干区域，Stub不是'],
    answer: 'NSSA允许引入外部路由（Type 7），Stub不允许',
    explanation: 'NSSA（Not-So-Stubby Area，非纯末梢区域）与Stub区域类似，都不接收Type 5外部LSA，但NSSA允许在区域内引入外部路由（ASBR可以存在于NSSA区域），外部路由以Type 7 LSA（NSSA External LSA）形式在NSSA区域内传播，到达ABR后转换为Type 5 LSA传播到其他区域。Stub区域不允许ASBR存在，也不允许Type 7 LSA。NSSA适合需要引入外部路由但又想减少LSA数量的区域。Totally NSSA是NSSA的更严格版本，不接收Type 3（除默认路由外）、Type 4、Type 5，允许Type 7。',
    knowledgeId: 'datacom-ospf', direction: 'datacom',
  },
  {
    id: 'dc-132', type: 'single',
    question: 'BGP中，路由反射器（RR）从客户端学到的路由会反射给谁？',
    options: ['仅其他客户端', '仅非客户端', '所有客户端和非客户端', '不反射给任何人'],
    answer: '所有客户端和非客户端',
    explanation: '路由反射器（Route Reflector，RR）的反射规则：1.从客户端（Client）学到的路由→反射给所有其他客户端和所有非客户端（Non-Client）。2.从非客户端学到的路由→仅反射给所有客户端（不反射给其他非客户端）。3.从EBGP邻居学到的路由→发给所有客户端和非客户端。这样，一个RR只需与所有客户端建立IBGP邻居，客户端之间不需要全互联，大大减少了IBGP邻居数量。RR防环机制：Originator_ID（原始发起者Router ID，原始发起者收到自己发起的路由则丢弃）和Cluster_List（簇列表，RR反射时添加自己的Cluster ID，RR收到包含自己Cluster ID的路由则丢弃）。RR可以层级部署（RR的RR），也可以多个RR冗余（同一簇多个RR，相同Cluster ID）。',
    knowledgeId: 'datacom-bgp', direction: 'datacom',
  },
  {
    id: 'dc-133', type: 'judge',
    question: 'IS-IS的DIS（指定中间系统）选举中，优先级为0的接口不参与DIS选举。',
    options: ['正确', '错误'],
    answer: '错误',
    explanation: 'IS-IS的DIS（Designated IS，指定中间系统）选举与OSPF的DR选举不同：1.IS-IS DIS优先级默认64，优先级为0的接口仍然参与DIS选举（OSPF中优先级为0的接口不参与DR选举）。2.DIS可抢占：新加入的高优先级路由器会抢占成为DIS（OSPF的DR不可抢占，DR故障后才重新选举BDR为DR）。3.IS-IS没有BDR（备份指定路由器），DIS故障后需要重新选举新的DIS（OSPF有BDR，DR故障后BDR立即成为DR，无需等待选举）。4.DIS选举基于接口优先级（值大者优先），优先级相同时System ID大者优先。DIS负责在广播网络中生成伪节点（Pseudonode）LSA和周期性发送CSNP（完全序列号报文），用于数据库同步。伪节点是DIS创建的虚拟节点，用于简化广播网络的LSA描述（所有连接到该网络的路由器都与伪节点建立邻接，而不是两两建立）。',
    knowledgeId: 'datacom-isis', direction: 'datacom',
  },
  {
    id: 'dc-134', type: 'single',
    question: 'RSTP中，备份端口（Backup Port）的作用是？',
    options: ['根端口的备份', '指定端口的备份，提供到同一网段的冗余连接', '连接终端的端口', '阻塞所有流量的端口'],
    answer: '指定端口的备份，提供到同一网段的冗余连接',
    explanation: 'RSTP端口角色：1.根端口（Root Port，RP）：到根桥路径开销最小的端口，每个非根桥一个。2.指定端口（Designated Port，DP）：每个网段到根桥路径开销最小的端口，负责向该网段转发。3.替代端口（Alternate Port，AP）：根端口的备份，提供到根桥的替代路径，根端口故障时替代端口可快速切换为根端口（无需等待30秒）。替代端口收到的是更优的BPDU（来自其他交换机）。4.备份端口（Backup Port，BP）：指定端口的备份，提供到同一网段的冗余连接，指定端口故障时备份端口可切换为指定端口。备份端口收到的是自己发出的更优BPDU（同一台交换机的另一个端口连接到同一网段，如Hub或共享介质）。替代端口和备份端口在RSTP中都处于Discarding状态，但可快速切换（RSTP的P/A协商机制，Proposal/Agreement，实现快速收敛，无需等待Forward Delay）。边缘端口（Edge Port）不是RSTP的端口角色，是端口属性（连接终端，不参与STP，快速进入Forwarding）。',
    knowledgeId: 'datacom-stp', direction: 'datacom',
  },
  {
    id: 'dc-135', type: 'single',
    question: 'MUX VLAN的主要作用是？',
    options: ['增加VLAN数量', '企业园区网中实现VLAN间部分互通、部分隔离，节省VLAN', '提高VLAN安全性', '加快VLAN转发'],
    answer: '企业园区网中实现VLAN间部分互通、部分隔离，节省VLAN',
    explanation: 'MUX VLAN（Multiplex VLAN，复用VLAN）是华为设备的VLAN特性，用于企业园区网中实现VLAN间的部分互通、部分隔离，同时节省VLAN资源。MUX VLAN分为：1.主VLAN（Principal VLAN）：可以与MUX VLAN内所有VLAN通信。2.从VLAN（Subordinate VLAN）：分为两种：a.互通型从VLAN（Group VLAN）：同一Group VLAN内的端口可以互相通信，也可以与Principal VLAN通信，但不同Group VLAN之间不能通信。b.隔离型从VLAN（Separate VLAN）：同一Separate VLAN内的端口不能互相通信，只能与Principal VLAN通信，不同Separate VLAN之间也不能通信。MUX VLAN的应用场景：企业园区中，员工之间需要互通（Group VLAN），访客之间需要隔离（Separate VLAN），但员工和访客都需要访问服务器（Principal VLAN），通过MUX VLAN可以用少量VLAN实现复杂的访问控制，节省VLAN资源。MUX VLAN配置在接入交换机端口上，基于端口实现VLAN复用和访问控制。',
    knowledgeId: 'datacom-vlan', direction: 'datacom',
  },
  {
    id: 'dc-136', type: 'single',
    question: 'Eth-Trunk中，LACP模式的系统优先级（System Priority）作用是？',
    options: ['确定主动端，由主动端选择活动接口', '确定接口速率', '确定加密算法', '确定负载分担方式'],
    answer: '确定主动端，由主动端选择活动接口',
    explanation: 'LACP（Link Aggregation Control Protocol，链路聚合控制协议，IEEE 802.3ad）模式中，系统优先级（System Priority，默认32768，值小者优先）用于确定LACP主动端（Actor）：1.两端交换机比较系统优先级，优先级高（值小）的一端为主动端。2.系统优先级相同时，比较系统MAC地址，MAC地址小的一端为主动端。3.主动端负责选择活动接口（Active Interface）：根据接口优先级（Port Priority，默认32768，值小者优先）选择活动接口，接口优先级相同时接口编号小的优先。4.活动接口数量受最大活动接口数（max active-linknumber）限制，超过的接口为备用接口（Standby），活动接口故障时备用接口自动切换。LACP模式相比手工负载分担模式的优势：支持活动/备用接口、支持主备冗余、可检测链路故障（LACPDU超时检测）、支持跨设备链路聚合（如堆叠/集群设备间的Eth-Trunk）。LACP优先级：系统优先级（确定主动端）>接口优先级（确定活动接口）。LACPDU（LACP数据单元）每秒发送一次，超时时间通常3倍发送间隔。',
    knowledgeId: 'datacom-eth-trunk', direction: 'datacom',
  },
  {
    id: 'sec-112', type: 'single',
    question: 'IPSec中，ESP隧道模式下，加密的是哪部分？',
    options: ['仅传输层', '整个原始IP包（包括原IP头）', '仅ESP头', '仅外部IP头'],
    answer: '整个原始IP包（包括原IP头）',
    explanation: 'ESP（Encapsulating Security Payload，封装安全载荷，协议号50）提供加密+认证（完整性+数据源认证），是IPSec的主流协议。ESP工作模式：1.传输模式（Transport Mode）：保护传输层数据（TCP/UDP头+数据），原IP头保持不变，ESP头插在原IP头和传输层头之间，加密的是传输层头+数据（ESP载荷），认证的是ESP头+传输层头+数据。传输模式用于主机到主机（End-to-End）。2.隧道模式（Tunnel Mode）：保护整个原始IP包（包括原IP头），新增外部IP头，ESP头插在外部IP头和原始IP包之间，加密的是整个原始IP包（原IP头+传输层头+数据），认证的是ESP头+整个原始IP包。隧道模式用于网关到网关（Site-to-Site VPN），安全性更高（隐藏内部IP地址）。ESP加密算法：DES、3DES、AES（主流）、SM4（国密）。ESP认证算法：MD5、SHA-1、SHA-2（主流）、SM3（国密）。ESP不认证外部IP头（隧道模式），因为外部IP头在传输过程中可能被NAT修改。AH（协议号51）仅提供认证不加密，认证整个IP头（包括不变字段），不支持NAT，已少用。',
    knowledgeId: 'security-ipsec', direction: 'security',
  },
  {
    id: 'sec-113', type: 'judge',
    question: '防火墙透明模式下，接口不需要配置IP地址，但需要配置VLAN。',
    options: ['正确', '错误'],
    answer: '正确',
    explanation: '防火墙工作模式：1.路由模式（三层模式）：接口配置IP地址，像路由器一样转发，支持NAT、VPN、动态路由等三层功能，是最常用的模式。2.透明模式（二层模式）：接口不配置IP地址，像二层交换机一样转发（基于MAC地址表），对用户透明（不改变网络拓扑，不需要修改上下行设备的网关配置），适合在线部署（串接在现有网络中，不改变现有IP规划）。透明模式下需要配置VLAN（接口加入VLAN，基于VLAN转发），防火墙在不同安全区域之间根据安全策略控制流量（即使是二层转发，也需要安全策略允许）。透明模式不支持NAT、VPN等三层功能（因为接口无IP），但支持基本的访问控制、攻击防范、内容过滤等。3.混合模式：同时有三层接口（路由模式）和二层接口（透明模式），适用于部分业务需要三层功能、部分业务需要透明接入的场景。透明模式的优点：部署简单，不改变现有网络拓扑和IP规划，适合旁路/在线部署；缺点：不支持NAT/VPN等三层功能，功能受限。华为防火墙通过firewall zone和interface配置工作模式，透明模式接口需配置portswitch切换为二层口。',
    knowledgeId: 'security-firewall-basic', direction: 'security',
  },
  {
    id: 'wlan-107', type: 'single',
    question: 'WLAN中，802.11ax（Wi-Fi 6）的OFDMA技术相比OFDM的主要优势是？',
    options: ['增加发射功率', '将信道划分为子载波同时服务多用户，提高效率降低延迟', '增加信道数量', '提高加密强度'],
    answer: '将信道划分为子载波同时服务多用户，提高效率降低延迟',
    explanation: 'OFDMA（Orthogonal Frequency Division Multiple Access，正交频分多址）是Wi-Fi 6（802.11ax）的核心技术，是OFDM（Orthogonal Frequency Division Multiplexing，正交频分复用）的多用户扩展。OFDM（802.11a/g/n/ac使用）将信道划分为多个子载波，但同一时刻整个信道只能服务一个用户（即使用户只需要传输少量数据，也占用整个信道），导致信道利用率低、延迟高（特别是密集用户和小包场景）。OFDMA将信道划分为更小的资源单元（RU，Resource Unit，如26/52/106/242/484/996子载波），不同的RU可以同时分配给不同用户，实现多用户同时传输，优势：1.提高信道利用率（多用户共享信道，避免一个用户占用整个信道）2.降低延迟（特别是小包和密集用户场景，用户无需等待整个信道空闲）3.减少冲突（调度式接入，类似蜂窝通信）4.支持上下行OFDMA（802.11ax支持上行和下行OFDMA，802.11ac仅支持下行MU-MIMO）。OFDMA与MU-MIMO配合：OFDMA在频域上区分用户（不同子载波），MU-MIMO在空间上区分用户（不同空间流），两者结合可同时服务更多用户。Wi-Fi 6还引入1024-QAM（高阶调制，比256-QAM提高25%速率）、BSS着色（BSS Coloring，减少同频干扰）、TWT（Target Wake Time，目标唤醒时间，终端节能）等技术。',
    knowledgeId: 'wlan-standard', direction: 'wlan',
  },
  {
    id: 'dcn-105', type: 'single',
    question: 'VXLAN分布式网关中，Anycast网关的特点是？',
    options: ['所有Leaf配置相同的网关IP和MAC，主机迁移时无需改网关', '每个Leaf配置不同的网关IP', '网关集中在Spine上', '网关需要动态分配IP'],
    answer: '所有Leaf配置相同的网关IP和MAC，主机迁移时无需改网关',
    explanation: 'Anycast网关（任播网关）是VXLAN分布式网关的核心技术：1.所有Leaf（叶节点，分布式网关）配置相同的Anycast网关IP地址和Anycast网关MAC地址（虚拟MAC）。2.主机（服务器/虚拟机）的默认网关就是这个Anycast IP，无论主机连接到哪个Leaf，网关IP和MAC都相同。3.当主机发送网关ARP请求时，本地Leaf直接以Anycast MAC响应（ARP代理/分布式ARP代理），主机将数据发给本地Leaf，本地Leaf直接进行三层转发（查找路由表/VXLAN隧道），无需经过集中网关。4.优势：a.东西向流量只需2跳（Leaf→Spine→Leaf），性能好，无瓶颈b.虚拟机迁移时网关IP和MAC不变，业务不中断（无需修改主机网关配置）c.无单点故障（分布式，每个Leaf都是网关，一个Leaf故障不影响其他）d.可扩展（增加Leaf增加网关处理能力）。5.Anycast网关需要EVPN控制面支持：通过EVPN Type 2路由（携带主机IP和MAC）同步主机路由，通过Type 5路由同步外部前缀。Anycast网关是当前数据中心VXLAN网络的标准方案（IP Fabric + EVPN/VXLAN + 分布式网关），替代了传统的集中式网关（所有三层流量集中到网关设备，性能瓶颈和单点故障）。',
    knowledgeId: 'dcn-evpn', direction: 'dcn',
  },
'''

# 插入到batch1注释之前
pattern = r'\n  // ==================== 自动更新题库 Batch 1'
replacement = questions + '\n  // ==================== 自动更新题库 Batch 1'

new_content, count = re.subn(pattern, replacement, content, count=1)

if count > 0:
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Inserted {questions.count('id:')} questions successfully")
else:
    print("Pattern not found!")
