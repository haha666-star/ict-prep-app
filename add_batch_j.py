import re

filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\data\quizzes.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

questions = '''
  // ==================== 扩充题库 Batch J ====================
  {
    id: 'dc-j001', type: 'single',
    question: 'OSPF中，以下哪个LSA类型由ASBR生成，描述外部路由，在整个OSPF域泛洪（除Stub/NSSA区域）？',
    options: ['Type 1 Router LSA', 'Type 3 Summary LSA', 'Type 5 AS External LSA', 'Type 7 NSSA External LSA'],
    answer: 'Type 5 AS External LSA',
    explanation: 'OSPF LSA（Link State Advertisement，链路状态通告）类型详解：1.Type 1 Router LSA（路由器LSA）：每台路由器生成，描述本路由器的接口状态、链路类型、度量值、邻居等，仅在本区域内泛洪。2.Type 2 Network LSA（网络LSA）：DR（指定路由器）生成，描述广播/NBMA网络中所有连接的路由器，仅在本区域内泛洪。3.Type 3 Summary LSA（网络汇总LSA）：ABR（区域边界路由器）生成，描述区域间路由（将本区域Type 1/2汇总为Type 3发布到其他区域，或将其他区域Type 3汇总后发布到本区域），可跨区域泛洪。4.Type 4 Summary LSA（ASBR汇总LSA）：ABR生成，描述ASBR的位置（ASBR的Router ID和到达ASBR的路径），用于让其他区域的路由器知道如何到达ASBR（因为Type 5 LSA只携带ASBR的Router ID，不携带路径，需要Type 4辅助）。5.Type 5 AS External LSA（AS外部LSA）：ASBR（自治系统边界路由器）生成，描述外部路由（从其他协议/静态/直连引入OSPF的路由），在整个OSPF域泛洪（除Stub、Totally Stub、NSSA、Totally NSSA区域，这些区域不接收Type 5）。Type 5携带：外部路由前缀、度量值（Metric）、度量类型（Metric-Type，E1/E2）、转发地址（Forwarding Address）、外部路由标签（Route Tag）等。6.Type 7 NSSA External LSA（NSSA外部LSA）：NSSA区域的ASBR生成，描述外部路由，仅在NSSA区域内泛洪（不跨区域），到ABR后转换为Type 5 LSA发布到其他区域。Type 7解决了Stub区域不能引入外部路由的限制（NSSA=Not-So-Stubby Area，"不那么末梢的区域"）。LSA泛洪范围对比：| LSA类型 | 生成者 | 泛洪范围 | 内容 | |---|---|---|---| | Type 1 | 每台路由器 | 本区域 | 路由器链路状态 | | Type 2 | DR | 本区域 | 广播网络路由器列表 | | Type 3 | ABR | 可跨区域 | 区域间路由 | | Type 4 | ABR | 可跨区域 | ASBR位置 | | Type 5 | ASBR | 整个域（除末梢区域） | 外部路由 | | Type 7 | NSSA ASBR | NSSA区域内 | NSSA外部路由 | Type 5外部路由度量类型：1.E2（External Type 2，默认）：外部度量值固定为ASBR设置的值，不叠加OSPF内部路径开销，即所有路由器看到的外部路由度量值相同（都是ASBR设置的Metric）。适用于外部路由的度量值比内部路径更重要的场景（如默认路由）。2.E1（External Type 1）：外部度量值=ASBR设置的外部Metric+到达ASBR的OSPF内部路径开销，即不同路由器看到的外部路由度量值不同（离ASBR越远度量值越大）。适用于需要考虑内部路径开销的场景（如多个出口选择最优的）。E1比E2更精确（考虑内部路径），E2更简单（固定度量）。OSPF LSA类型是华为ICT大赛网络赛道的高频考点，需掌握每种LSA的生成者、泛洪范围、内容、作用，以及末梢区域对LSA的过滤，Type 5/7的区别和转换，E1/E2度量类型等。',
    knowledgeId: 'datacom-ospf', direction: 'datacom',
  },
  {
    id: 'dc-j002', type: 'single',
    question: 'BGP中，路由聚合（Aggregation）的主要作用是？',
    options: ['减少路由表规模，隐藏明细路由，提高稳定性', '提高路由收敛速度', '加密路由信息', '选择最优路由'],
    answer: '减少路由表规模，隐藏明细路由，提高稳定性',
    explanation: 'BGP路由聚合（Aggregation，也叫路由汇总Route Summarization）：将多条明细路由（更具体的前缀，如192.168.1.0/24、192.168.2.0/24、192.168.3.0/24）汇总为一条更粗的路由（如192.168.0.0/16），减少路由表规模。作用：1.减少路由表规模：互联网BGP路由表已超过100万条，聚合可大幅减少路由数量，降低路由器内存和CPU消耗，提高转发效率。2.隐藏明细路由：聚合后只发布汇总路由，不发布明细路由，隐藏内部网络拓扑，提高安全性和稳定性（明细路由震荡不影响汇总路由，减少路由震荡传播）。3.提高稳定性：明细路由的up/down不会导致汇总路由变化（只要有一条明细存在，汇总路由就存在），减少路由更新和网络震荡。4.节省带宽：减少BGP路由更新报文数量，节省链路带宽。BGP聚合方式：1.静态聚合（Static Aggregation）：手动配置汇总路由（aggregate命令），当路由表中存在至少一条明细路由时，发布汇总路由。可选择是否抑制明细路由（suppress-policy，抑制明细只发布汇总，或选择性抑制）。2.自动聚合（Auto Summary）：有类网络边界自动汇总（如将192.168.1.0/24自动汇总为192.168.0.0/16），只适用于有类网络，不推荐（可能导致不精确路由和环路），华为默认关闭。3.明细路由抑制：聚合后默认仍发布明细路由（除非配置suppress-policy抑制），可通过as-set选项保留明细路由的AS_Path信息（防止环路和路由丢失）。聚合相关属性：1.Atomic_Aggregate（原子聚合，公认自由决定属性）：提示下游路由器该路由是聚合路由，可能丢失了明细路由的信息（如AS_Path、Community），下游不应再分解该聚合路由。2.Aggregator（聚合者，可选过渡属性）：记录执行聚合的路由器的AS号和Router ID，便于追踪聚合来源。3.AS_SET：聚合时使用as-set选项，将所有明细路由的AS_Path合并为AS_SET（无序集合），保留AS信息，防止环路（如果聚合后AS_Path为空，可能导致路由环路，因为接收方无法检测AS是否经过）。但AS_SET会导致聚合路由的AS_Path包含所有明细AS，可能影响路由优选（AS_Path长度）。4.Community：聚合时可设置Community属性（如NO_EXPORT，限制聚合路由不发布给EBGP邻居）。聚合的风险：1.路由黑洞：聚合路由发布后，如果所有明细路由都消失，但聚合路由仍存在（因为静态聚合路由可能手动配置且不自动撤销），导致流量被转发到不存在的网络（黑洞）。解决：使用动态聚合（只有存在明细时才发布汇总），或配合黑洞路由（Null0）防止环路。2.次优路由：聚合后隐藏明细，可能导致次优路径（因为接收方只有汇总路由，不知道明细的最优路径）。3.环路风险：聚合时如果不保留AS_Path（as-set），可能导致环路（接收方无法检测AS是否经过）。BGP路由聚合是华为ICT大赛网络赛道的高频考点，需掌握聚合作用、配置方式（aggregate/suppress-policy/as-set）、Atomic_Aggregate/Aggregator属性、AS_SET作用、聚合风险（黑洞/次优/环路）等。',
    knowledgeId: 'datacom-bgp', direction: 'datacom',
  },
  {
    id: 'wlan-j001', type: 'single',
    question: 'WLAN中，以下关于射频（RF）优化的说法，错误的是？',
    options: ['信道调整（Channel Assignment）用于减少同频干扰，自动或手动分配信道', '功率调整（Power Control）用于平衡覆盖和干扰，高密度场景适当降低功率', '2.4GHz有13个信道，其中1、6、11是三个不重叠信道', '5GHz信道更多，所以5GHz穿墙能力比2.4GHz强'],
    answer: '5GHz信道更多，所以5GHz穿墙能力比2.4GHz强',
    explanation: 'WLAN射频（Radio Frequency，RF）优化：1.信道调整（Channel Assignment）：为AP分配信道，减少同频干扰（同频干扰会降低吞吐量和增加延迟）。a.自动信道调整（Auto Channel）：AC通过检测环境干扰，自动为AP分配最优信道（周期性或触发式调整），是企业WLAN的常用功能。b.手动信道规划：根据场地规划信道，2.4GHz用1、6、11三个不重叠信道蜂窝部署，5GHz用更多信道复用（如36/40/44/48、149/153/157/161）。c.信道宽度：2.4GHz建议20MHz（信道少，40MHz干扰大），5GHz可20/40/80MHz（信道多，高带宽），高密度场景建议20/40MHz（减少干扰，增加信道复用）。2.功率调整（Power Control，TPC Transmit Power Control）：调整AP发射功率，平衡覆盖和干扰。a.高密度场景（会议室、体育场）：适当降低功率（如50%），减小覆盖范围，增加信道复用，减少同频干扰，避免远距离弱信号关联（低速率拖慢整体性能）。b.覆盖场景（仓库、开阔区）：适当提高功率，保证覆盖。c.自动功率调整（Auto Power）：AC根据邻居AP信号强度和用户接入情况，自动调整功率（邻居AP信号强则降低功率，弱则提高）。3.2.4GHz频段：a.中国支持13个信道（1-13），但只有1、6、11三个不重叠信道（信道间隔25MHz，每个信道22MHz带宽，1/6/11间隔5个信道=25MHz，不重叠）。b.其他信道（2-5、7-10、12-13）都会与相邻信道重叠，造成邻频干扰。c.2.4GHz信道少，高密度场景容易拥塞和干扰（蓝牙、微波炉、邻居Wi-Fi都用2.4G）。4.5GHz频段：a.中国支持更多信道（36-64、149-165等，共约20+个不重叠20MHz信道），干扰小，速率高。b.5GHz频率高，波长短，穿墙能力弱（穿透损耗大，混凝土墙衰减严重），覆盖范围小。c.5GHz信道多≠穿墙能力强，恰恰相反，5GHz穿墙能力比2.4GHz弱（频率越高穿透能力越弱，但绕射能力越差）。d.2.4GHz频率低，波长长，绕射能力强，穿墙能力强，覆盖范围大。5.其他射频优化：a.频谱导航（Band Steering）：引导双频终端优先连接5GHz，减轻2.4G拥塞。b.负载均衡（Load Balancing）：在AP间或射频间均衡用户数量，避免单个AP过载。c.漫游优化：802.11k/v/r快速漫游，调整漫游阈值（RSSI阈值），引导终端及时漫游到更优AP。d.射频调优（Radio Calibration）：AC定期或触发式调整信道和功率，适应环境变化。e.禁用低速率（Disable Low Rate）：禁用1/2/5.5/11Mbps等低速率，减少低速率用户占用信道时间，提高整体性能（但可能影响覆盖边缘的老设备）。f.RTS/CTS阈值：调整RTS/CTS阈值，减少隐藏节点冲突（高密度场景适当降低阈值）。g.帧聚合（A-MPDU/A-MSDU）：802.11n/ac/ax的帧聚合技术，提高传输效率。WLAN射频优化是华为ICT大赛WLAN赛道的高频考点，需掌握信道规划（2.4G 1/6/11、5G更多信道）、功率调整、频段对比（2.4G穿墙强/信道少，5G速率高/穿墙弱/信道多）、频谱导航、负载均衡、漫游优化、高密度部署等。注意：5GHz信道多但穿墙能力弱，这是常见考点和易错点。',
    knowledgeId: 'wlan-rf', direction: 'wlan',
  },
  {
    id: 'dcn-j001', type: 'single',
    question: '数据中心网络中，以下关于Spine-Leaf架构的说法，错误的是？',
    options: ['Leaf交换机连接服务器，同时连接所有Spine交换机', 'Spine交换机不连接服务器，只连接Leaf交换机', '任意两台服务器通信经过3跳（Leaf→Spine→Spine→Leaf）', '通过ECMP等价多路径实现负载分担和高可用'],
    answer: '任意两台服务器通信经过3跳（Leaf→Spine→Spine→Leaf）',
    explanation: 'Spine-Leaf（叶脊）架构（也叫Clos架构，由Charles Clos在1953年提出，用于电话交换网络，后应用于数据中心网络）：1.Leaf（叶节点，接入层）：a.连接服务器（TOR，Top of Rack，柜顶交换机，放置在服务器机架顶部）。b.同时连接到所有Spine节点（Full Mesh全互联，每台Leaf与每台Spine都有链路）。c.是服务器的网关（三层网关，分布式网关模式下每台Leaf都是所有VNI的网关）。d.Leaf之间不直接互联（只通过Spine互联）。2.Spine（脊节点，核心层）：a.不连接服务器（Spine只连接Leaf，不直接连接服务器）。b.连接所有Leaf节点，提供高带宽的东西向交换。c.Spine之间不直接互联（Spine只与Leaf互联，Spine之间不需要链路，因为任意两台Leaf之间通过任意一台Spine都能到达，2跳）。3.路径和跳数：a.任意两台服务器通信路径：服务器→源Leaf→任意一台Spine→目的Leaf→目的服务器。b.在网络设备层面经过2跳（Leaf→Spine→Leaf），不是3跳。c.延迟低且可预测（无论哪两台服务器通信都是2跳，不会因为位置不同而延迟不同，这是Spine-Leaf相比传统三层架构的重要优势）。4.ECMP（Equal-Cost Multi-Path，等价多路径）：a.从源Leaf到目的Leaf，经过每台Spine都是等价路径（相同开销），ECMP将流量负载分担到所有Spine链路上，充分利用所有带宽。b.基于五元组（源/目的IP、源/目的端口、协议）哈希计算选择路径，同一流（相同五元组）走同一路径，保证按序到达；不同流走不同路径，实现负载分担。c.某条Spine链路或Spine设备故障时，ECMP自动将流量切换到其他健康路径，实现快速收敛和高可用（毫秒级，不需要STP收敛）。5.无阻塞（Non-blocking）：a.Leaf的上行带宽（到所有Spine的总带宽）≥下行带宽（所有服务器的总带宽），即收敛比（Oversubscription Ratio）≤1:1（无阻塞）或≤3:1（轻度收敛，可接受）。b.传统三层架构收敛比高（如核心层带宽不足，东西向流量瓶颈），Spine-Leaf通过增加Spine数量和链路带宽实现低收敛比。6.水平扩展（Horizontal Scaling）：a.增加Leaf：增加接入端口密度（连接更多服务器）。b.增加Spine：增加东西向带宽（更多ECMP路径，更高总带宽）。c.任意扩展不影响现有拓扑，无需重新设计网络（传统三层架构扩展需要重新规划核心和汇聚）。7.underlay路由协议：a.Spine-Leaf的underlay（底层网络）通常运行eBGP（外部BGP，每台设备一个AS号，AS_PATH防环，ECMP天然支持，最稳定，云厂商首选）或OSPF/IS-IS（IGP，配置简单）。b.underlay不启用STP（三层网络无环路，用ECMP替代STP，充分利用所有链路，STP会阻塞冗余链路浪费带宽）。c.underlay通常不启用组播（VXLAN BUM流量用头端复制HER替代组播，简化underlay）。Spine-Leaf与传统三层架构（核心-汇聚-接入）对比：| 维度 | 传统三层架构 | Spine-Leaf架构 | |---|---|---| | 路径跳数 | 同汇聚2跳，跨汇聚3-4跳，不一致 | 固定2跳，一致 | | 东西向带宽 | 核心层瓶颈，收敛比高 | 无阻塞/低收敛，ECMP充分利用 | | 链路利用率 | STP阻塞冗余链路，利用率低 | ECMP利用所有链路，利用率高 | | 扩展 | 扩展复杂，需重新设计 | 水平扩展，增加Leaf/Spine即可 | | 故障收敛 | STP收敛慢（30-50秒） | ECMP/路由收敛快（毫秒级） | | 适用场景 | 南北向为主的企业网络 | 东西向为主的数据中心 | Spine-Leaf是当前数据中心网络的标准架构，被AWS、Azure、Google、Facebook、阿里云、华为云等所有主流云厂商采用，是华为ICT大赛DCN赛道的核心考点，需掌握架构特点（Leaf/Spine角色、2跳、ECMP、无阻塞、水平扩展）、与传统三层对比、underlay路由协议、收敛比等。注意：任意两台服务器通信是2跳（Leaf→Spine→Leaf），不是3跳，这是常见易错点。',
    knowledgeId: 'dcn-arch', direction: 'dcn',
  },
'''

idx = content.rfind(']')
new_content = content[:idx] + questions + '\n' + content[idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

count = new_content.count("question: '")
print(f"Inserted batch J, total questions: {count}")
