import re

filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\data\quizzes.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

questions = '''
  // ==================== 扩充题库 Batch N ====================
  {
    id: 'dc-n001', type: 'single',
    question: 'OSPF中，以下关于虚链路（Virtual Link）的说法，错误的是？',
    options: ['虚链路用于连接非骨干区域到骨干区域，或修复不连续的骨干区域', '虚链路穿越的传输区域不能是Stub/Totally Stub/NSSA区域', '虚链路两端必须是ABR，虚链路属于骨干区域Area 0', '虚链路可以长期使用，是推荐的网络设计方式'],
    answer: '虚链路可以长期使用，是推荐的网络设计方式',
    explanation: 'OSPF虚链路（Virtual Link）：在两台ABR之间建立逻辑链路，穿越一个传输区域（Transit Area），将非骨干区域逻辑连接到骨干区域Area 0，或修复不连续的骨干区域。限制：1.传输区域不能是Stub/Totally Stub/NSSA（这些区域过滤Type 5，虚链路需要传递路由）。2.两端必须是ABR（至少有一个接口在Area 0或通过虚链路连接到Area 0）。3.虚链路属于骨干区域（逻辑上属于Area 0）。虚链路是临时修复方案，不推荐长期使用（不稳定，依赖传输区域拓扑，增加配置复杂度），最终应重新设计网络使所有区域直接连接Area 0。配置：area <transit-area> virtual-link <peer-router-id>。虚链路是OSPF考点，需掌握作用、适用场景、限制（传输区域不能是末梢区域）、配置等。',
    knowledgeId: 'datacom-ospf', direction: 'datacom',
  },
  {
    id: 'dc-n002', type: 'single',
    question: 'BGP中，以下关于路由反射器（RR）的说法，错误的是？',
    options: ['RR从客户端学到的路由反射给所有客户端和非客户端', 'RR从非客户端学到的路由仅反射给客户端', 'RR的Cluster_List和Originator_ID用于防环', 'RR会修改路由的AS_Path，在AS_Path中添加自己的AS号'],
    answer: 'RR会修改路由的AS_Path，在AS_Path中添加自己的AS号',
    explanation: 'BGP路由反射器（RR，Route Reflector）：打破IBGP水平分割（从IBGP学到的路由不再传给其他IBGP），减少IBGP全互联数量。反射规则：1.从客户端学到的路由→反射给所有客户端和非客户端。2.从非客户端学到的路由→仅反射给客户端（不反射给其他非客户端）。3.从EBGP学到的路由→发给所有客户端和非客户端（正常BGP行为）。防环机制：1.Originator_ID（发起者ID）：RR反射路由时添加原始发起者的Router ID，原始发起者收到含自己ID的路由则丢弃。2.Cluster_List（簇列表）：RR反射路由时添加自己的Cluster ID，RR收到含自己Cluster ID的路由则丢弃。RR不会修改AS_Path（AS_Path在EBGP邻居之间才会添加AS号，IBGP和RR反射都不修改AS_Path），因为RR在同一个AS内，AS_Path不变。RR是BGP扩展性核心技术，是高频考点，需掌握反射规则、防环属性、客户端/非客户端、与联盟（Confederation）区别等。',
    knowledgeId: 'datacom-bgp', direction: 'datacom',
  },
  {
    id: 'dc-n003', type: 'judge',
    question: 'IS-IS中，L1路由器访问其他区域时，通过本区域L1/2路由器生成的默认路由转发，类似OSPF的Stub区域。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'IS-IS L1路由器（Level-1）只维护L1链路状态数据库，只知道本区域内拓扑，不知道其他区域具体路由。L1/2路由器（Level-1-2）在L1 LSP中设置ATT位（Attachment Bit，附着位），通知L1路由器"我连接到L2骨干"。L1路由器收到ATT位后，生成指向最近L1/2路由器的默认路由，将访问其他区域的流量发给L1/2路由器。这与OSPF Stub区域类似（ABR向Stub区域发布默认路由Type 3，Stub区域路由器通过ABR访问外部）。IS-IS的ATT位机制更简单（只需在LSP中设置一位，不需要额外LSA）。路由渗透（Route Leakage）：L1/2可将L2具体路由发布到L1区域，解决次优路径问题（L1路由器可能选择不是最优的L1/2）。IS-IS分层路由是高频考点，需掌握L1/L2/L1-2路由器类型、ATT位、默认路由、路由渗透、与OSPF区域对比等。',
    knowledgeId: 'datacom-isis', direction: 'datacom',
  },
  {
    id: 'dc-n004', type: 'single',
    question: 'RSTP中，P/A（Proposal/Agreement）协商机制的作用是？',
    options: ['选举根桥', '实现点到点链路上端口快速进入Forwarding，无需等待30秒', '选举DR/BDR', '加密BPDU'],
    answer: '实现点到点链路上端口快速进入Forwarding，无需等待30秒',
    explanation: 'RSTP（802.1w）P/A（Proposal/Agreement，提议/同意）协商机制：实现快速收敛的核心。1.指定端口（Designated Port）发送Proposal BPDU（提议自己成为指定端口，请求快速进入Forwarding）。2.对端收到Proposal后进行同步（Sync）：阻塞所有其他非边缘端口（确保无环路），然后回复Agreement BPDU（同意）。3.指定端口收到Agreement后立即进入Forwarding（无需等待Listening+Learning的30秒Forward Delay）。4.对端端口（根端口/替代端口）也同步进入Forwarding。P/A机制在点到点链路（全双工）上有效，实现秒级快速收敛。RSTP其他快速收敛机制：边缘端口（Edge Port，连接终端直接Forwarding）、替代/备份端口（故障快速切换）、更短BPDU超时（6秒vs STP的20秒）。RSTP兼容STP（与STP设备互联时退化为STP速度）。P/A协商是RSTP核心，是高频考点，需掌握协商过程、同步机制、快速收敛原理、与STP收敛对比等。',
    knowledgeId: 'datacom-stp', direction: 'datacom',
  },
  {
    id: 'sec-n001', type: 'single',
    question: '防火墙中，以下关于安全策略的说法，错误的是？',
    options: ['安全策略按顺序匹配（从上到下），匹配到第一条即执行，不再继续匹配', '安全策略可匹配源/目的区域、源/目的IP、端口、协议、应用、用户、时间等', '同区域内流量默认允许，不同区域间流量默认拒绝', '安全策略的动作只有允许（Permit）和拒绝（Deny）两种'],
    answer: '安全策略的动作只有允许（Permit）和拒绝（Deny）两种',
    explanation: '防火墙安全策略（Security Policy）：控制不同区域间流量的访问权限。1.匹配条件：源/目的安全区域、源/目的IP地址（地址对象/地址组）、源/目的端口、协议（TCP/UDP/ICMP等）、应用（Application，通过DPI识别，如HTTP/FTP/微信等）、用户（User，通过认证识别，如用户/用户组）、时间段（Time Range）、服务（Service，端口+协议组合）等。2.动作（Action）：a.允许（Permit）：允许流量通过，可引用UTM配置文件（IPS/AV/URL过滤等）、流量统计、日志记录。b.拒绝（Deny）：静默丢弃流量，不回复（对端超时），可记录日志。c.拒绝并回复（Reject）：丢弃流量并回复（TCP发送RST，ICMP发送不可达），对端立即知道被拒绝，减少等待时间。所以动作不止Permit和Deny两种，还有Reject。3.匹配顺序：按策略ID顺序从上到下匹配，匹配到第一条即执行该策略动作，不再继续匹配后续策略（所以精确策略放上面，宽泛策略放下面，最后默认拒绝）。4.默认行为：同区域内流量默认允许（不需要安全策略），不同区域间流量默认拒绝（需要配置允许策略）。5.安全策略与ACL区别：ACL是匹配条件的集合（permit/deny规则），本身不生效，需被其他功能引用（流量过滤/QoS/NAT等）；安全策略是防火墙的访问控制功能，直接生效，可匹配更丰富的条件（应用、用户、时间等），动作更丰富（Permit/Deny/Reject+UTM）。安全策略是防火墙核心功能，是高频考点，需掌握匹配条件、动作（Permit/Deny/Reject三种）、匹配顺序、默认行为、与ACL区别等。注意：动作有Reject（拒绝并回复），不是只有Permit和Deny，这是常见易错点。',
    knowledgeId: 'security-firewall-basic', direction: 'security',
  },
  {
    id: 'sec-n002', type: 'single',
    question: 'IPSec中，以下关于IKEv1主模式（Main Mode）和野蛮模式（Aggressive Mode）的说法，错误的是？',
    options: ['主模式6条消息，野蛮模式3条消息', '主模式保护身份信息（身份加密传输），野蛮模式身份明文传输', '野蛮模式协商更快，适合对端IP不固定或NAT场景', '主模式比野蛮模式更不安全，因为消息更多'],
    answer: '主模式比野蛮模式更不安全，因为消息更多',
    explanation: 'IKEv1阶段一模式：1.主模式（Main Mode）：6条消息。a.消息1-2：协商IKE策略（加密算法、认证算法、认证方式、DH组、生命周期）。b.消息3-4：DH密钥交换（交换Diffie-Hellman公钥，生成共享密钥）和随机数（Nonce）。c.消息5-6：身份认证（交换身份信息和预共享密钥/证书签名，身份在消息5-6中加密传输，因为此时已生成共享密钥）。主模式保护身份信息（身份加密，窃听者无法看到对端身份），更安全，但协商慢（6条消息）。2.野蛮模式（Aggressive Mode）：3条消息。a.消息1：发起方发送IKE策略+DH公钥+身份+随机数（所有信息一次发送，身份明文传输，因为还没生成共享密钥）。b.消息2：响应方确认+DH公钥+身份+随机数+认证（身份明文）。c.消息3：发起方认证确认。野蛮模式协商快（3条消息），但身份明文传输（不安全，窃听者可看到对端身份，可针对特定身份发起攻击），适合对端IP不固定（拨号用户、远程接入VPN）或NAT场景（需要快速协商）。3.对比：| 维度 | 主模式 | 野蛮模式 | |---|---|---| | 消息数 | 6条 | 3条 | | 身份保护 | 加密（安全） | 明文（不安全） | | 协商速度 | 慢 | 快 | | 适用场景 | 站点到站点VPN（对端固定） | 远程接入VPN（对端不固定/NAT） | 主模式比野蛮模式更安全（身份加密），不是更不安全。IKEv2简化为4条消息（IKE_SA_INIT 2条+IKE_AUTH 2条），同时建立IKE SA和第一个IPSec SA，更安全（抵抗DoS）、更快、支持MOBIKE（移动性），推荐使用。IKE协商是IPSec核心，是高频考点，需掌握主模式/野蛮模式区别、消息数、身份保护、适用场景、IKEv2优势等。注意：主模式更安全（身份加密），野蛮模式更快但身份明文，这是常见易错点。',
    knowledgeId: 'security-ipsec', direction: 'security',
  },
  {
    id: 'wlan-n001', type: 'single',
    question: 'WLAN中，以下关于Wi-Fi 6（802.11ax）OFDMA的说法，错误的是？',
    options: ['OFDMA将信道划分为多个子信道（RU），同时与多个用户通信', 'OFDMA提高多用户效率，降低延迟，适合高密度场景', 'OFDMA是Wi-Fi 6独有的，Wi-Fi 5（802.11ac）不支持OFDMA', 'OFDMA只能在2.4GHz使用，5GHz不支持OFDMA'],
    answer: 'OFDMA只能在2.4GHz使用，5GHz不支持OFDMA',
    explanation: 'OFDMA（Orthogonal Frequency Division Multiple Access，正交频分多址）：Wi-Fi 6（802.11ax）核心技术，从4G/5G移动通信引入。1.原理：将信道（如20MHz）划分为多个更小的子信道（RU，Resource Unit，资源单元，如26/52/106/242/484/996子载波等不同大小），同时与多个用户通信（不同用户用不同RU），而不是传统Wi-Fi的轮流传输（TDMA，一个用户占满整个信道，其他用户等待）。2.优势：a.提高多用户效率：多用户同时传输，减少等待，提高信道利用率，尤其高密度场景（多用户、小包业务如语音/游戏）。b.降低延迟：小数据包可分配小RU快速传输，不需要等待整个信道空闲，降低接入延迟和抖动。c.灵活分配：根据用户数据量和QoS需求分配不同大小RU（大数据用户分配大RU，小数据用户分配小RU）。3.与MU-MIMO区别：a.OFDMA：频域多用户（不同用户用不同子信道/RU），适合多用户小包、低延迟场景。b.MU-MIMO：空间域多用户（不同用户用不同空间流/天线），适合多用户大数据包、高吞吐量场景。c.Wi-Fi 6同时支持OFDMA和上下行MU-MIMO，两者结合性能最优。4.适用频段：OFDMA在2.4GHz和5GHz都支持（802.11ax是MAC层技术，与频段无关），不是只能在2.4GHz使用。Wi-Fi 6E扩展到6GHz，也支持OFDMA。5.Wi-Fi 5（802.11ac）不支持OFDMA（只支持下行MU-MIMO，不支持OFDMA和上行MU-MIMO），OFDMA是Wi-Fi 6新增的标志性技术。OFDMA是Wi-Fi 6核心，是高频考点，需掌握原理（RU划分、多用户同时通信）、优势（多用户效率、低延迟）、与MU-MIMO区别、适用频段（2.4G和5G都支持）、Wi-Fi 5不支持等。注意：OFDMA在2.4GHz和5GHz都支持，不是只能在2.4GHz，这是常见易错点。',
    knowledgeId: 'wlan-wifi6', direction: 'wlan',
  },
  {
    id: 'dcn-n001', type: 'single',
    question: '数据中心网络中，以下关于underlay和overlay的说法，错误的是？',
    options: ['underlay是底层物理网络（IP Fabric），提供IP连通性和ECMP多路径', 'overlay是在underlay之上构建的虚拟网络（VXLAN），提供大二层和多租户隔离', 'VTEP是underlay和overlay的边界点，负责VXLAN封装和解封装', 'underlay网络需要启用STP来防止环路，overlay网络不需要STP'],
    answer: 'underlay网络需要启用STP来防止环路，overlay网络不需要STP',
    explanation: '数据中心underlay/overlay架构：1.underlay（底层网络）：物理网络基础设施，由Spine/Leaf交换机组成，运行三层路由协议（OSPF/IS-IS/eBGP），提供IP连通性和ECMP等价多路径负载分担。underlay特点：a.三层网络（所有链路都是三层路由，没有二层环路，因为三层路由协议天然防环，通过AS_Path/SPF计算无环路径）。b.不需要STP（underlay是三层网络，没有二层环路，STP是二层防环协议，三层网络不需要STP；传统二层网络用STP防环但会阻塞冗余链路，underlay用ECMP利用所有链路，不阻塞）。c.通常不启用组播（VXLAN BUM流量用头端复制HER替代组播，简化underlay）。d.简单、稳定、高性能、可扩展（Spine-Leaf架构，水平扩展）。2.overlay（叠加网络）：在underlay之上构建的虚拟网络，通过隧道封装（VXLAN，MAC-in-UDP）将原始二层帧封装在IP报文中，在underlay三层网络上传输，构建大二层虚拟网络。overlay特点：a.大二层扩展（虚拟机迁移IP不变，业务不中断）。b.多租户隔离（不同VNI隔离，满足云计算多租户需求）。c.与物理网络解耦（虚拟机迁移不影响物理网络拓扑）。d.软件定义（可通过控制器自动化配置）。3.VTEP（VXLAN Tunnel End Point，VXLAN隧道端点）：underlay和overlay的边界点，负责VXLAN封装（overlay→underlay，将原始帧封装为VXLAN UDP/IP报文）和解封装（underlay→overlay，剥离VXLAN头恢复原始帧）。VTEP可在物理交换机（硬件VTEP，Leaf）、虚拟交换机（软件VTEP，OVS）、智能网卡（SmartNIC，卸载封装）上实现。4.常见组合：IP Fabric（OSPF/IS-IS/eBGP）underlay + EVPN/VXLAN overlay，是当前数据中心网络标准架构。5.underlay路由协议选择：a.eBGP（外部BGP，每台设备一个AS号，AS_PATH防环，ECMP天然支持，最稳定，云厂商首选，如AWS/Azure/Google都用eBGP）。b.OSPF（IGP，配置简单，适合中小规模，但OSPF区域设计和LSA泛洪在大规模下复杂）。c.IS-IS（IGP，高效，适合大规模，但配置和维护比OSPF复杂）。underlay/overlay是数据中心网络核心概念，是高频考点，需掌握两者定义、关系、VTEP作用、underlay路由协议、underlay不需要STP（三层网络无环路，用ECMP）等。注意：underlay是三层网络，不需要STP（STP是二层防环协议），用ECMP利用所有链路，这是常见易错点。',
    knowledgeId: 'dcn-vxlan-basic', direction: 'dcn',
  },
'''

idx = content.rfind(']')
new_content = content[:idx] + questions + '\n' + content[idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

count = new_content.count("question: '")
print(f"Inserted batch N, total questions: {count}")
