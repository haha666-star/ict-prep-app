import re

filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\data\quizzes.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

questions = '''
  // ==================== 扩充题库 Batch I ====================
  {
    id: 'dc-i001', type: 'single',
    question: 'IS-IS中，以下哪种PDU（协议数据单元）用于描述路由器的链路状态信息，类似OSPF的LSA？',
    options: ['IIH（Hello报文）', 'LSP（链路状态PDU）', 'CSNP（完全序列号PDU）', 'PSNP（部分序列号PDU）'],
    answer: 'LSP（链路状态PDU）',
    explanation: 'IS-IS PDU（Protocol Data Unit，协议数据单元）类型：1.IIH（IS-to-IS Hello PDU，IS到IS Hello报文）：用于发现和维护邻居关系，类似OSPF的Hello报文。分为L1 IIH（组播01:80:C2:00:00:14）、L2 IIH（组播01:80:C2:00:00:15）、P2P IIH（组播01:80:C2:00:00:13）。携带System ID、区域地址、优先级、保持时间、接口IP等。2.LSP（Link State PDU，链路状态PDU）：描述路由器的链路状态信息，类似OSPF的LSA（链路状态通告）。分为L1 LSP（在L1区域内泛洪）和L2 LSP（在骨干区域泛洪）。携带：System ID（发送路由器）、伪节点ID（Pseudonode ID，0表示普通LSP，非0表示伪节点LSP，由DIS生成）、序列号（Sequence Number，越大越新）、剩余生存时间（Remaining Lifetime，默认1200秒=20分钟，超时后从LSDB删除）、校验和（Checksum）、邻居列表（Neighbor ID+度量）、IP前缀（IP Reachability，IP可达性信息，包含前缀和度量）等。LSP在区域内泛洪，所有路由器的LSDB（链路状态数据库）包含本区域所有LSP，基于LSP运行SPF算法计算最短路径。3.CSNP（Complete Sequence Number PDU，完全序列号PDU）：包含本地LSDB中所有LSP的摘要（LSP ID+序列号+校验和），用于数据库同步。在广播网络中，DIS周期性发送CSNP（默认10秒），其他路由器对比发现缺失的LSP，发送PSNP请求。在点到点网络中，邻居建立后双方互发CSNP（只发一次）。4.PSNP（Partial Sequence Number PDU，部分序列号PDU）：包含部分LSP的摘要，用于：a.请求缺失的LSP（路由器发现CSNP中有自己没有的LSP，发送PSNP请求）。b.确认收到的LSP（点到点网络中，收到LSP后发送PSNP确认，因为点到点没有DIS泛洪机制，需要显式确认）。LSP与OSPF LSA对比：| IS-IS LSP | OSPF LSA | |---|---| | 直接封装在数据链路层 | 封装在IP中（协议号89） | | L1/L2两种类型 | Type 1-7多种类型 | | 伪节点LSP由DIS生成 | Type 2 Network LSA由DR生成 | | 序列号+生存时间+校验和 | 序列号+年龄+校验和 | | 区域内泛洪 | 区域内/域内泛洪（不同类型范围不同） | IS-IS PDU类型是华为ICT大赛网络赛道的考点，需掌握每种PDU的作用、发送者、与OSPF对应关系等。注意：LSP是链路状态信息的载体，类似OSPF的LSA；CSNP/PSNP用于数据库同步，类似OSPF的DD/LSR/LSU/LSAck。',
    knowledgeId: 'datacom-isis', direction: 'datacom',
  },
  {
    id: 'dc-i002', type: 'single',
    question: '以下关于VRRP（虚拟路由冗余协议）的说法，错误的是？',
    options: ['VRRP将多台路由器组成一个虚拟路由器，对外提供虚拟IP和虚拟MAC', 'Master路由器负责转发流量，Backup路由器在Master故障时接管', 'VRRP优先级默认100，优先级255保留给虚拟IP所有者', 'VRRP可以实现负载分担，同一时间多台路由器同时转发同一虚拟IP的流量'],
    answer: 'VRRP可以实现负载分担，同一时间多台路由器同时转发同一虚拟IP的流量',
    explanation: 'VRRP（Virtual Router Redundancy Protocol，虚拟路由冗余协议，RFC 5798，华为默认VRRPv3支持IPv4/IPv6）：1.虚拟路由器（Virtual Router）：将多台路由器组成一个虚拟路由器，对外提供一个虚拟IP（VIP，Virtual IP）和虚拟MAC（VMAC，Virtual MAC，00-00-5E-00-01-{VRID}，VRID为虚拟路由器ID，1-255）。局域网内主机的默认网关指向虚拟IP，不需要感知实际转发的路由器。2.角色：a.Master（主路由器）：优先级最高的路由器成为Master，负责转发以虚拟MAC为目的的流量，响应ARP请求（回复虚拟MAC），周期性发送VRRP通告报文（Advertisement，默认1秒，组播224.0.0.18，IPv6为FF02::12）。b.Backup（备份路由器）：其他路由器为Backup，不转发流量，不响应ARP，只监听Master的通告报文。如果在Master_Down_Interval（默认3倍通告间隔+偏移时间，约3.6秒）内未收到Master通告，则认为Master故障，优先级最高的Backup抢占成为新Master，接管虚拟IP和MAC，继续转发流量，实现网关冗余。3.优先级（Priority）：1-254，默认100，值越大越优先。优先级255保留给虚拟IP所有者（IP Address Owner，物理接口IP=虚拟IP的路由器，自动成为Master且不可被抢占，优先级自动为255）。优先级0用于Master主动放弃（发送优先级0的通告，Backup立即接管）。4.抢占模式（Preempt）：默认开启，高优先级Backup发现自己优先级高于Master时，抢占成为Master。可配置抢占延迟（Preempt Delay，避免网络震荡时频繁切换，默认0秒立即抢占）。5.认证（Authentication）：VRRPv2支持明文认证和MD5认证（防止非法路由器加入VRRP组或发送伪造通告），VRRPv3取消了认证（认为安全应由上层协议保证，如IPSec）。6.跟踪（Track）：a.跟踪接口/链路（Interface Track）：Master上行接口故障时，降低优先级（如降低10），让Backup接管，避免黑洞（Master还在但上行断了，流量发给Master但无法转发）。b.跟踪BFD（BFD Track）：BFD快速检测故障（毫秒级），联动VRRP快速切换（亚秒级），比等待Master_Down_Interval（3.6秒）快得多。c.跟踪路由（Route Track）：路由消失时降低优先级。VRRP限制：1.同一时间只有Master转发流量（主备模式），Backup不转发，所以VRRP本身不能实现同一虚拟IP的负载分担（同一时间只有一台转发）。2.要实现负载分担，需要配置多个VRRP组（不同VRID，不同虚拟IP），不同VLAN/网段的网关指向不同VRRP组的虚拟IP，不同VRRP组的Master在不同路由器上，从而实现不同网段的流量分担（如VLAN 10网关VRRP 1的Master在SW1，VLAN 20网关VRRP 2的Master在SW2，两台交换机都转发部分流量）。这叫VRRP负载分担模式（多VRRP组），但每个VRRP组本身仍是主备。3.VRRPv2仅支持IPv4，VRRPv3支持IPv4和IPv6。4.VRRP不能检测上行故障（需配置Track）。VRRP与HSRP（Cisco私有，热备份路由器协议）、GLBP（Cisco私有，网关负载均衡协议，支持同一虚拟IP的真正负载分担，AVG分配虚拟MAC，AVF转发）类似，VRRP是IETF标准，华为支持。VRRP是华为ICT大赛网络赛道的高频考点，需掌握原理、虚拟IP/MAC、Master/Backup、优先级、抢占、认证、Track、负载分担（多VRRP组）、配置等。注意：VRRP本身是主备，不是负载分担；负载分担需要多个VRRP组。',
    knowledgeId: 'datacom-vrrp', direction: 'datacom',
  },
  {
    id: 'sec-i001', type: 'single',
    question: '防火墙中，以下哪种NAT类型用于将内网服务器映射到公网，允许外网主动访问内网服务器？',
    options: ['源NAT（NAT Outbound，PAT）', '目的NAT（NAT Server，服务器映射）', '静态NAT（一对一）', '黑洞NAT（Null0）'],
    answer: '目的NAT（NAT Server，服务器映射）',
    explanation: '防火墙NAT（Network Address Translation，网络地址转换）类型：1.源NAT（Source NAT，也叫NAT Outbound，出方向NAT）：转换报文的源IP地址，用于内网用户访问外网（内网私有IP→公网IP）。包括：a.No-PAT（不转换端口，多对多，从公网地址池动态分配，内网主机数不超过公网IP数）。b.PAT（Port Address Translation，端口地址转换，也叫NAPT，多对一，多个内网主机共享一个或少量公网IP，通过不同源端口区分，最常用，大幅节省公网IP）。c.Smart NAT（智能NAT，No-PAT+PAT，No-PAT地址用完后自动使用PAT，兼顾性能和地址利用率）。d.三元组NAT（IP+端口+协议，固定映射，便于P2P应用，如视频会议）。e.Easy IP（直接使用出接口IP作为公网IP，适合拨号/动态IP场景，如家庭宽带）。源NAT只转换源IP（和端口），目的IP不变，用于内网主动访问外网。2.目的NAT（Destination NAT，也叫NAT Inbound，入方向NAT，华为叫NAT Server服务器映射）：转换报文的目的IP地址（和端口），用于外网用户主动访问内网服务器（公网IP→内网服务器私网IP）。配置：nat server protocol tcp global <公网IP> <公网端口> inside <私网IP> <私网端口>，将公网IP+端口映射到内网服务器私网IP+端口。外网用户访问公网IP+端口时，防火墙将目的地址转换为内网服务器私网IP+端口，转发给内网服务器；内网服务器回复时，源地址（私网IP+端口）被转换为公网IP+端口（反向NAT，No-PAT，因为NAT Server生成的Server-Map表项包含反向映射）。NAT Server生成Server-Map表（服务器映射表），记录公网IP+端口→私网IP+端口的映射，允许外网主动访问（普通源NAT只允许内网主动访问外网，外网不能主动访问内网，因为没有公网到私网的映射）。NAT Server是企业对外发布服务器（Web、邮件、FTP、DNS等）的常用方式。3.静态NAT（Static NAT）：一对一固定映射，内网IP与公网IP一一对应，不转换端口，既支持内网主动访问外网，也支持外网主动访问内网（因为映射是双向的、固定的）。静态NAT不节省公网IP（需要与内网主机相同数量的公网IP），主要用于需要外网主动访问的服务器（但NAT Server更灵活，可端口映射，一个公网IP映射多个服务器不同端口）。4.黑洞NAT（Blackhole NAT，Null0）：下一跳为Null0接口的路由，匹配的流量被丢弃，用于防环路（如聚合路由的防环）或流量过滤，不是真正的NAT转换。5.Twice NAT（两次NAT，也叫双向NAT）：同时转换源IP和目的IP，用于源和目的地址重叠的场景（如两个内网使用相同IP段，VPN互联时地址冲突），或需要同时转换源和目的的场景。NAT Server与源NAT的区别：| 类型 | 转换方向 | 转换内容 | 用途 | 主动访问方向 | |---|---|---|---|---| | 源NAT（PAT） | 出方向（内网→外网） | 源IP+源端口 | 内网用户访问外网 | 内网主动访问外网 | | 目的NAT（NAT Server） | 入方向（外网→内网） | 目的IP+目的端口 | 外网访问内网服务器 | 外网主动访问内网 | | 静态NAT | 双向 | IP（不转端口） | 服务器固定映射 | 双向都可 | NAT是华为ICT大赛安全赛道的高频考点，需掌握各种NAT类型、原理、配置、Server-Map表、与安全策略关系、NAT穿越（IPSec NAT-T）等。注意：NAT Server是目的NAT，允许外网主动访问内网；源NAT（PAT）只允许内网主动访问外网。',
    knowledgeId: 'security-nat', direction: 'security',
  },
  {
    id: 'sec-i002', type: 'judge',
    question: '802.1X认证中，认证系统（Authenticator，交换机/AP）在用户认证通过前，端口只允许EAPoL报文通过，其他流量被阻塞。',
    options: ['正确', '错误'], answer: '正确',
    explanation: '802.1X（IEEE 802.1X，端口-based网络访问控制）是一种基于端口的网络访问控制协议，用于企业网络的用户认证和准入控制。802.1X体系结构：1.客户端（Supplicant，请求者）：用户终端（PC、手机、笔记本等），运行802.1X客户端软件（Windows自带、iNode、AnyConnect等），发起认证请求，发送EAPoL报文。2.认证系统（Authenticator，认证者）：交换机、AP、AC等网络接入设备，控制端口的访问权限。在用户认证通过前，端口处于未授权状态（Unauthorized），只允许EAPoL（EAP over LAN，802.1X认证报文，目的MAC 01-80-C2-00-00-03，类型0x888E）通过，其他所有流量（HTTP、DHCP、TCP/IP数据等）都被阻塞，用户无法访问网络资源。认证通过后，端口变为授权状态（Authorized），允许正常流量通过。3.认证服务器（Authentication Server）：RADIUS服务器（Remote Authentication Dial-In User Service，远程认证拨号用户服务），存储用户账号密码和策略，验证客户端身份，返回认证结果（接受/拒绝）和授权信息（VLAN、ACL、超时时间等）。认证系统与认证服务器之间使用RADIUS协议（UDP 1812认证、1813计费）。802.1X认证流程（EAP中继方式，最常用）：1.客户端发起认证：客户端发送EAPoL-Start（EAPOL开始）报文，或认证系统检测到端口up后主动发起认证（发送EAP-Request/Identity请求身份）。2.身份请求：认证系统发送EAP-Request/Identity（EAP请求/身份）给客户端，请求用户名。3.身份响应：客户端回复EAP-Response/Identity（EAP响应/身份），携带用户名。4.封装RADIUS：认证系统将EAP-Response/Identity封装为RADIUS Access-Request（访问请求）报文，发送给RADIUS服务器。5.RADIUS挑战：RADIUS服务器验证用户名，选择认证方法（如EAP-PEAP、EAP-TLS、EAP-MSCHAPv2等），发送RADIUS Access-Challenge（访问挑战，携带EAP-Request）给认证系统。6.转发EAP：认证系统解封装，将EAP-Request转发给客户端。7.客户端响应：客户端根据EAP方法进行响应（如输入密码、证书验证），发送EAP-Response给认证系统。8.封装转发：认证系统封装为RADIUS Access-Request转发给RADIUS服务器。9.认证结果：RADIUS服务器验证通过后，发送RADIUS Access-Accept（访问接受，携带授权信息如VLAN、ACL、Session-Timeout等）；验证失败发送Access-Reject（访问拒绝）。10.授权端口：认证系统收到Access-Accept后，发送EAP-Success（EAP成功）给客户端，端口变为授权状态，允许正常流量通过，应用授权信息（动态VLAN、动态ACL等）。收到Access-Reject则发送EAP-Failure，端口保持未授权。802.1X端口控制模式（Port Control）：1.自动模式（Auto，默认）：端口自动发起802.1X认证，认证通过后开放。2.强制授权（Force Authorized）：不进行认证，端口始终允许所有流量通过（相当于关闭802.1X）。3.强制非授权（Force Unauthorized）：端口始终拒绝所有流量（始终关闭）。802.1X扩展功能：1.Guest VLAN（访客VLAN）：认证失败或无客户端的用户可访问Guest VLAN（有限资源，如Internet、自助注册），是802.1X的扩展功能。2.Critical VLAN（关键VLAN/故障VLAN）：RADIUS服务器不可达时，用户可访问Critical VLAN，保证基本网络访问（如内网资源）。3.Restart VLAN（重认证VLAN）：重认证失败时用户进入的VLAN。4.动态VLAN（Dynamic VLAN）：RADIUS返回Tunnel-Private-Group-ID属性，动态将用户端口加入指定VLAN，不同用户认证后进入不同VLAN。5.动态ACL（Dynamic ACL）：RADIUS返回Filter-ID属性，动态应用ACL，控制用户访问权限。6.双因素认证（2FA）：结合密码+证书/短信/令牌，提高安全性。7.MAC旁路（MAC Authentication Bypass，MAB）：不支持802.1X的设备（如打印机、IP电话、摄像头等IoT设备），通过MAC地址认证（认证系统学习MAC地址，作为用户名/密码发送给RADIUS验证），不需要客户端软件。8.Web认证（Portal认证）：不支持802.1X的设备，通过Web页面输入账号密码认证，常用于访客网络。802.1X是华为ICT大赛安全赛道的高频考点，需掌握体系结构（Supplicant/Authenticator/Server）、EAPoL、认证流程、端口控制模式、RADIUS、Guest VLAN/Critical VLAN、动态VLAN/ACL、MAB、与Portal认证区别等。注意：认证通过前只允许EAPoL通过，其他流量阻塞；EAPoL目的MAC是组播01-80-C2-00-00-03，不会被交换机转发（只在本地端口处理）。',
    knowledgeId: 'security-8021x', direction: 'security',
  },
'''

idx = content.rfind(']')
new_content = content[:idx] + questions + '\n' + content[idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

count = new_content.count("question: '")
print(f"Inserted batch I, total questions: {count}")
