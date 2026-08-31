import re

filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\data\quizzes.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

questions = '''
  // ==================== 扩充题库 Batch L ====================
  {
    id: 'dc-l001', type: 'single',
    question: 'OSPF中，以下关于度量值（Metric/Cost）的说法，错误的是？',
    options: ['OSPF度量值基于接口带宽，默认Cost=100Mbps/接口带宽', '10GE接口默认Cost为1，GE接口默认Cost为1', '可通过ip ospf cost命令手动修改接口Cost', 'OSPF选路时优先选择度量值（Cost）最小的路径'],
    answer: '10GE接口默认Cost为1，GE接口默认Cost为1',
    explanation: 'OSPF度量值（Metric，也叫Cost，开销）：1.计算方式：OSPF接口Cost默认基于带宽计算，公式为Cost=参考带宽/接口带宽。默认参考带宽（Reference Bandwidth）为100Mbps（100000000bps）。a.GE（1Gbps=1000Mbps）接口：Cost=100Mbps/1000Mbps=0.1，但OSPF Cost最小为1（整数，不能小于1），所以GE接口默认Cost=1。b.10GE（10Gbps）接口：Cost=100Mbps/10000Mbps=0.01，同样最小为1，所以10GE接口默认Cost=1。c.FE（100Mbps）接口：Cost=100Mbps/100Mbps=1。d.E1（2Mbps）接口：Cost=100Mbps/2Mbps=50。e.串行接口（如64kbps）：Cost=100Mbps/0.064Mbps=1562。2.问题：默认参考带宽100Mbps导致GE和10GE接口Cost都为1（无法区分，因为都小于1取整为1），在高速网络中无法区分不同带宽的链路（如GE和10GE都为1，OSPF认为等价，可能选择GE而非10GE，次优路径）。3.解决：调整参考带宽（auto-cost reference-bandwidth命令），如设置为10000Mbps（10Gbps），则：a.GE接口：Cost=10000Mbps/1000Mbps=10。b.10GE接口：Cost=10000Mbps/10000Mbps=1。c.这样GE和10GE的Cost不同，能区分带宽，选择更优路径。d.参考带宽建议设置为网络中最高接口带宽（如100GE网络设置为100000Mbps），确保所有接口Cost>1且可区分。e.注意：参考带宽必须在整个OSPF域内统一设置（所有路由器一致），否则不同路由器计算的Cost不一致，导致路由计算错误。4.手动修改：可通过ip ospf cost <cost>命令在接口上手动设置Cost（1-65535），手动设置的Cost优先于自动计算的Cost，用于精确控制路径（如希望某条链路优先，设置更小Cost；或希望某条链路作为备份，设置更大Cost）。5.OSPF选路：a.区域内路由（Intra-area，Type 1/2 LSA）：通过SPF算法计算最短路径，选择Cost最小的路径（Cost=路径上所有出接口Cost之和）。b.区域间路由（Inter-area，Type 3 LSA）：Cost=ABR到目的的Cost+本路由器到ABR的Cost，选择Cost最小的。c.外部路由（External，Type 5/7 LSA）：- E2（External Type 2，默认）：Cost=外部度量值（固定，不叠加内部路径），所有路由器看到的Cost相同。- E1（External Type 1）：Cost=外部度量值+到达ASBR的内部路径Cost，不同路由器Cost不同。- 选路时E1优先于E2（如果同时有E1和E2到同一目的，E1优先，因为E1更精确）。d.等价路径（Equal Cost）：如果有多条路径Cost相同，OSPF支持等价多路径（ECMP），负载分担（默认最多4条，可通过maximum load-balancing命令调整）。6.与其他协议度量对比：a.RIP：跳数（Hop Count，最大15跳）。b.IS-IS：接口度量（默认10，可配置，窄度量63，宽度量16777215）。c.BGP：多属性（AS_Path、Local_Pref、MED等，不是单一度量）。d.静态路由：无度量（优先级决定）。OSPF度量值是华为ICT大赛网络赛道的高频考点，需掌握Cost计算方式（参考带宽/接口带宽）、默认参考带宽100Mbps的问题（GE/10GE都为1）、调整参考带宽、手动设置Cost、E1/E2外部路由度量、等价多路径等。注意：默认参考带宽100Mbps下GE和10GE Cost都为1，这是常见考点和易错点。',
    knowledgeId: 'datacom-ospf', direction: 'datacom',
  },
  {
    id: 'dc-l002', type: 'judge',
    question: 'BGP中，EBGP邻居默认需要直连（TTL=1），如果EBGP邻居非直连（多跳），需要配置ebgp-max-hop。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'BGP邻居（Peer）类型：1.EBGP（External BGP，外部BGP）：不同AS之间的BGP邻居，用于AS之间交换路由信息。a.默认EBGP邻居需要直连（直连链路，同一网段），因为EBGP发送的BGP报文TTL=1（生存时间为1，只能经过1跳，防止非直连的EBGP连接和路由环路）。b.如果EBGP邻居非直连（多跳，如通过其他路由器、或使用Loopback接口建立EBGP邻居），需要配置ebgp-max-hop <跳数>命令（如peer <ip> ebgp-max-hop 2），允许BGP报文TTL>1，支持多跳EBGP。c.EBGP多跳的应用场景：- 使用Loopback接口建立EBGP邻居（提高稳定性，Loopback接口不随物理接口down而down，需要IGP或静态路由保证Loopback互通，同时配置ebgp-max-hop）。- 非直连的EBGP邻居（如两台EBGP路由器之间隔了其他设备，但不在同一AS，需要多跳）。- 建立更稳定的EBGP连接（多路径，一条物理链路故障仍可通过其他路径到达Loopback）。2.IBGP（Internal BGP，内部BGP）：同一AS内部的BGP邻居，用于AS内部传递EBGP路由。a.IBGP邻居默认TTL=255（不受跳数限制，因为IBGP在AS内部，可跨多跳，不需要直连）。b.IBGP邻居通常使用Loopback接口建立（提高稳定性，物理接口故障不影响BGP邻居，只要Loopback可达），需要IGP（OSPF/IS-IS）保证Loopback互通。c.IBGP邻居不需要配置ebgp-max-hop（因为TTL=255，天然支持多跳）。3.BGP邻居建立条件：a.IP可达：邻居IP地址必须路由可达（EBGP直连或多跳配置ebgp-max-hop，IBGP通过IGP可达）。b.AS号正确：对端AS号必须与本地配置的peer-as一致（EBGP对端AS不同，IBGP对端AS相同）。c.TCP 179端口可达：BGP使用TCP 179，防火墙/ACL必须允许TCP 179。d.源地址正确：BGP报文源地址必须与对端配置的邻居地址一致（使用Loopback建立邻居时需要配置peer <ip> connect-interface LoopBack0，指定源接口）。e.没有被安全策略/ACL拒绝。4.BGP邻居状态机：a.Idle（空闲）：初始状态，未发起连接。b.Connect（连接）：发起TCP连接，等待TCP连接建立。c.Active（活跃）：TCP连接失败，重试连接（如果反复在Connect/Active之间，说明TCP连接有问题，如IP不可达、端口被禁、AS号错误）。d.OpenSent（Open报文已发送）：TCP连接建立，发送Open报文，等待对端Open报文。e.OpenConfirm（Open报文确认）：收到对端Open报文，参数协商成功，等待Keepalive报文。f.Established（已建立）：收到Keepalive，邻居关系建立，开始交换Update报文（路由更新）。5.BGP报文类型：a.Open（打开）：协商参数（版本、AS号、Hold Time、Router ID、能力如MP-BGP、路由刷新等），建立邻居时发送。b.Keepalive（保持连接）：周期性发送（默认Hold Time的1/3，如Hold Time 180秒则Keepalive 60秒），维持邻居关系，防止超时断开。c.Update（更新）：发布路由（可达路由，带路径属性）或撤销路由（不可达路由），是BGP路由信息的载体。d.Notification（通知）：错误通知，发生错误时发送，然后断开邻居关系（如AS号错误、 Hold Time超时、路由属性错误等）。e.Route-Refresh（路由刷新）：请求对端重新发送路由（策略变化后刷新路由，无需重置邻居，软复位）。BGP邻居建立是华为ICT大赛网络赛道的高频考点，需掌握EBGP/IBGP区别、EBGP直连/多跳（ebgp-max-hop）、Loopback建立邻居（connect-interface）、邻居状态机、报文类型、邻居建立条件和故障排查等。注意：EBGP默认TTL=1需要直连，非直连需配置ebgp-max-hop，这是常见考点和易错点。',
    knowledgeId: 'datacom-bgp', direction: 'datacom',
  },
  {
    id: 'sec-l001', type: 'single',
    question: 'IPSec中，以下关于IKE SA和IPSec SA的说法，错误的是？',
    options: ['IKE SA用于保护IKE协商（阶段二），IPSec SA用于保护用户数据', 'IKE SA默认生命周期86400秒（24小时），IPSec SA默认3600秒（1小时）', '一个IKE SA只能建立一个IPSec SA', 'IPSec SA是单向的，每个方向一个SA（inbound/outbound）'],
    answer: '一个IKE SA只能建立一个IPSec SA',
    explanation: 'IPSec SA（Security Association，安全联盟）：IPSec通信双方约定的安全参数集合（加密算法、认证算法、密钥、封装模式、生命周期等），是IPSec通信的基础。1.IKE SA（IKE安全联盟，阶段一SA）：a.作用：保护IKE协商过程（阶段二的快速模式协商），加密和认证IKE报文，防止窃听和篡改。b.数量：一对IKE邻居之间只有一个IKE SA（双向，一个IKE SA保护两个方向的IKE报文）。c.生命周期：默认86400秒（24小时），可通过ike sa duration命令修改（180-604800秒）。d.建立：IKEv1阶段一（主模式6条/野蛮模式3条）或IKEv2的IKE_SA_INIT+IKE_AUTH（4条）建立。2.IPSec SA（IPSec安全联盟，阶段二SA）：a.作用：保护用户数据（加密和认证业务报文，ESP/AH）。b.数量：一个IKE SA可以建立多个IPSec SA（不同的感兴趣流/不同的协议/不同的方向），如同时保护多个子网的流量、同时有ESP和AH、同时有IPv4和IPv6等。c.单向性：IPSec SA是单向的，每个方向一个SA（inbound入方向SA和outbound出方向SA），一对邻居之间有两个IPSec SA（一个入一个出，参数相同但方向不同，SPI不同）。d.生命周期：默认3600秒（1小时），或按流量计算（如10GB/100GB，默认184549353KB≈180GB），可通过ipsec sa duration time/volume命令修改。e.建立：IKEv1阶段二（快速模式3条）或IKEv2的CREATE_CHILD_SA（在IKE SA建立后创建第一个IPSec SA，后续可创建更多）。3.SPI（Security Parameter Index，安全参数索引）：a.32位数值，唯一标识一个SA（在同一台路由器上，SPI+目的IP+协议号唯一标识一个SA）。b.每个SA有一个SPI，发送方在IPSec报文头中携带SPI，接收方根据SPI查找对应的SA（解密/验证参数）。c.IKE SA的SPI由IKE协商生成，IPSec SA的SPI由IKE协商生成（或手动配置）。4.SA生命周期和重协商（Rekey）：a.SA有生命周期，到期前自动重新协商（Rekey），生成新的SA和密钥，旧SA在一段时间后删除（平滑过渡，不中断业务）。b.重协商保证密钥定期更新，提高安全性（即使密钥泄露，影响时间有限）。c.IKE SA重协商时，所有IPSec SA也会重新协商（因为IKE SA保护IPSec SA协商）。d.IPSec SA重协商不需要重新建立IKE SA（在现有IKE SA保护下快速协商新的IPSec SA）。5.IPSec SA与感兴趣流：a.每个IPSec SA对应一条感兴趣流（ACL规则），不同的感兴趣流建立不同的IPSec SA。b.粗粒度感兴趣流（大网段）SA数量少，细粒度感兴趣流（主机到主机）SA数量多。c.SA数量是IPSec VPN的重要性能指标（最大SA数、每秒新建SA数），SA过多会消耗设备资源（内存、CPU）。6.手动SA vs IKE动态SA：a.手动SA（Manual）：手动配置SPI、密钥、加密/认证算法，不使用IKE协商，配置复杂，密钥不自动更新，安全性低，适合简单场景或设备不支持IKE时。b.IKE动态SA（ISAKMP）：通过IKE自动协商SA和密钥，自动更新，配置简单，安全性高，是主流方式。IPSec SA是华为ICT大赛安全赛道的高频考点，需掌握IKE SA与IPSec SA的区别（作用、数量、生命周期、单向/双向）、SPI、SA生命周期和重协商、感兴趣流与SA数量、手动/动态SA等。注意：一个IKE SA可以建立多个IPSec SA（不是只能一个），IPSec SA是单向的（每个方向一个），这是常见易错点。',
    knowledgeId: 'security-ipsec', direction: 'security',
  },
  {
    id: 'wlan-l001', type: 'single',
    question: 'WLAN中，以下关于CAPWAP隧道的说法，错误的是？',
    options: ['CAPWAP控制隧道使用UDP 5246端口，数据隧道使用UDP 5247端口', '控制隧道用于配置管理和状态上报，数据隧道用于用户数据转发（隧道转发模式）', '直接转发模式下不建立CAPWAP数据隧道，用户数据由AP直接转发', 'CAPWAP隧道只能在AP和AC之间建立，不能跨三层网络'],
    answer: 'CAPWAP隧道只能在AP和AC之间建立，不能跨三层网络',
    explanation: 'CAPWAP（Control And Provisioning of Wireless Access Points，无线接入点控制与供应协议，RFC 5415）：FIT AP架构中AP与AC之间的通信协议，基于UDP。1.CAPWAP隧道类型：a.控制隧道（Control Tunnel）：UDP 5246端口，使用DTLS（Datagram Transport Layer Security，数据报传输层安全）加密，传输AP与AC之间的控制报文（配置下发、状态上报、固件升级、漫游管理、统计信息、事件通知等）。控制隧道必须建立（AP上线的必要条件）。b.数据隧道（Data Tunnel）：UDP 5247端口，可选DTLS加密，传输用户数据报文（隧道转发模式下，用户数据通过CAPWAP数据隧道封装到AC转发）。数据隧道仅在隧道转发模式下建立，直接转发模式下不建立。2.数据转发模式：a.直接转发（Direct Forwarding，本地转发Local Switching）：用户数据由AP直接转发到有线网络（根据VLAN标签转发），不经过AC，不建立CAPWAP数据隧道（只建立控制隧道）。优点：性能好（数据不经过AC，AC无瓶颈）、网络拓扑简单、AC故障不影响已有用户数据。缺点：安全策略分散（用户数据不经过AC，AC上的安全策略/内容过滤无法直接应用）。b.隧道转发（Tunnel Forwarding，集中转发Central Switching）：用户数据通过CAPWAP数据隧道封装到AC，由AC统一解封装和转发，建立CAPWAP数据隧道。优点：集中控制（所有用户数据经过AC，可统一应用安全策略、QoS、内容过滤、流量统计）、便于集中管理审计。缺点：AC可能成为性能瓶颈、延迟稍高、AC故障影响所有用户数据。3.CAPWAP跨三层网络：a.CAPWAP隧道可以跨三层网络建立（AP和AC可以在不同网段，通过三层路由可达），这是企业WLAN的常见部署方式（AC在核心机房，AP在各个楼层/园区，跨三层网络）。b.AP发现AC的方式支持跨三层：DHCP Option43（携带AC IP，跨三层最常用）、DNS（解析域名获取AC IP，跨三层）、静态配置（手动配置AC IP，跨三层）。c.广播方式只支持同二层（广播报文不跨三层），跨三层网络不能用广播发现AC。d.CAPWAP隧道本身是UDP报文（IP网络可路由），只要AP和AC之间IP可达，就能建立CAPWAP隧道，不受物理距离和网络层次限制。4.CAPWAP DTLS加密：a.控制隧道默认使用DTLS加密（可配置关闭，默认开启），保证控制报文安全（防止窃听、篡改、伪造）。b.数据隧道可选DTLS加密（默认关闭，因为用户数据通常已通过WPA2/WPA3加密，再加密会增加开销，可根据安全需求开启）。c.DTLS基于PSK（预共享密钥）或证书认证，AC和AP之间协商加密参数（加密算法、认证算法、密钥）。5.AP上线流程（CAPWAP状态机）：a.发现（Discovery）：AP发送CAPWAP Discover报文（广播/单播），AC回应Discover Response（携带AC优先级、负载等信息）。b.加入（Join）：AP选择最优AC（优先级高、负载低），发送Join Request，AC回应Join Response（配置参数、DTLS参数），建立CAPWAP控制隧道。c.配置（Configure）：AC向AP下发配置（固件版本、射频配置、VAP配置、安全配置等），AP确认。d.数据检查（Data Check）：协商数据隧道参数（如使用隧道转发，建立数据隧道）。e.运行（Run）：AP正常工作，提供无线接入，周期性发送Keepalive（默认30秒）维持CAPWAP隧道，AC周期性发送配置更新和收集统计。6.CAPWAP隧道维护：a.Keepalive（保活）：AP周期性发送Keepalive报文（默认30秒），AC回应，维持隧道状态。如果连续3个Keepalive无回应（默认90秒），则认为AC故障，AP重新发现AC。b.隧道切换：AP发现更优AC（优先级更高）或当前AC故障时，可切换到其他AC（双AC热备/冷备场景）。c.CAPWAP分片：CAPWAP报文可能超过MTU（加上CAPWAP头和外层IP头），需要分片或调整MTU（建议AC和AP之间链路MTU≥1500，或启用PMTU发现）。CAPWAP是华为ICT大赛WLAN赛道的高频考点，需掌握CAPWAP控制/数据隧道端口（5246/5247）、直接/隧道转发区别、DTLS加密、AP上线流程、跨三层部署（CAPWAP可跨三层，不是只能同二层）等。注意：CAPWAP隧道可以跨三层网络建立（通过DHCP Option43/DNS/静态配置发现AC），不是只能在同二层，这是常见易错点。',
    knowledgeId: 'wlan-arch', direction: 'wlan',
  },
'''

idx = content.rfind(']')
new_content = content[:idx] + questions + '\n' + content[idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

count = new_content.count("question: '")
print(f"Inserted batch L, total questions: {count}")
