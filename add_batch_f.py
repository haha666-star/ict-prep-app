import re

filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\data\quizzes.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

questions = '''
  // ==================== 扩充题库 Batch F ====================
  {
    id: 'dc-f001', type: 'single',
    question: 'OSPF中，虚链路（Virtual Link）的作用是？',
    options: ['连接非骨干区域到骨干区域Area 0，修复不连续的骨干区域', '提高OSPF收敛速度', '加密OSPF报文', '负载均衡'],
    answer: '连接非骨干区域到骨干区域Area 0，修复不连续的骨干区域',
    explanation: 'OSPF虚链路（Virtual Link）：在两台ABR之间建立逻辑链路（穿越一个非骨干区域，称为传输区域Transit Area），将一个非骨干区域逻辑上连接到骨干区域Area 0。作用：1.修复不连续的骨干区域：由于网络合并或设计问题，Area 0被分割成两部分，通过虚链路将两部分逻辑连接，保持骨干区域连续。2.连接远离骨干的区域：一个非骨干区域没有直接连接到Area 0（违反OSPF区域设计规则，所有区域必须直接连接Area 0），通过虚链路逻辑连接到Area 0。虚链路特点：1.穿越一个传输区域（Transit Area，不能是Stub/Totally Stub/NSSA区域，因为这些区域不允许Type 5，虚链路需要Type 5传递）。2.两端必须是ABR（至少有一个接口在Area 0，或通过虚链路连接到Area 0）。3.虚链路属于骨干区域Area 0（逻辑上），在传输区域内通过Type 1/2 LSA计算到对端ABR的路径，然后建立虚邻接。4.虚链路不稳定（依赖传输区域的拓扑），不推荐长期使用，应作为临时修复方案，最终应重新设计网络拓扑使所有区域直接连接Area 0。5.虚链路配置：在两端ABR上配置area <transit-area> virtual-link <peer-router-id>。虚链路是OSPF的重要考点，需掌握作用、适用场景、配置、限制（传输区域不能是末梢区域）等。注意：虚链路不能穿越Stub/Totally Stub/NSSA区域，因为这些区域过滤Type 5 LSA，而虚链路需要传递路由信息。',
    knowledgeId: 'datacom-ospf', direction: 'datacom',
  },
  {
    id: 'dc-f002', type: 'single',
    question: 'BGP中，联盟（Confederation）的主要作用是？',
    options: ['将一个大AS划分为多个子AS，减少IBGP全互联数量', '提高BGP收敛速度', '加密BGP报文', '选择最优路由'],
    answer: '将一个大AS划分为多个子AS，减少IBGP全互联数量',
    explanation: 'BGP联盟（Confederation，也叫联邦）：将一个大的AS（自治系统）划分为多个子AS（Sub-AS，也叫Member AS），子AS之间使用EBGP关系，但对外表现为一个整体AS（联盟AS号，对外可见）。作用：减少IBGP全互联数量（IBGP水平分割导致IBGP邻居需要全互联，n台路由器需n(n-1)/2条IBGP邻居，大规模网络不可扩展）。联盟原理：1.子AS内部：使用IBGP，仍需全互联或使用RR（路由反射器）。2.子AS之间：使用EBGP关系（但行为与普通EBGP不同，Next_Hop、MED、Local_Pref等属性在子AS间保留，类似IBGP），子AS间不需要全互联（EBGP没有水平分割限制）。3.对外：整个联盟使用一个联盟AS号（Confederation ID），外部AS看到的是联盟AS号，不知道内部子AS划分。4.AS_Path属性：子AS号放入AS_Path的AS_CONFED_SEQUENCE/AS_CONFED_SET段，不影响路由优选的AS_Path长度比较（联盟内部AS号不计入AS_Path长度），但用于防环。联盟与RR（路由反射器）对比：1.RR：在一个AS内通过反射器减少IBGP全互联，配置简单，更常用。2.联盟：将AS划分为多个子AS，适合超大规模网络（如运营商），可与RR结合使用（子AS内部用RR）。3.联盟需要修改AS号配置，对外部有影响（联盟AS号），RR对外部透明。华为设备支持联盟，配置：bgp <confederation-id>，confederation id <confederation-id>，confederation peer-as <sub-as-list>。联盟是BGP扩展性的重要技术，是华为ICT大赛网络赛道的考点，需掌握原理、配置、与RR的区别、AS_Path处理等。注意：联盟内子AS号建议使用私有AS号（64512-65534），避免与公网AS号冲突。',
    knowledgeId: 'datacom-bgp', direction: 'datacom',
  },
  {
    id: 'dc-f003', type: 'judge',
    question: 'IS-IS中，ATT位（Attachment位）由L1/2路由器设置在L1 LSP中，通知L1路由器可以通过自己访问其他区域。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'IS-IS中ATT位（Attachment Bit，附着位）：1.由L1/2路由器（Level-1-2）在发送的L1 LSP（链路状态PDU）中设置ATT位为1，表示"我连接到Level-2骨干区域，可以通过我访问其他区域"。2.L1路由器（Level-1）收到设置了ATT位的L1 LSP后，知道本区域有L1/2路由器连接到骨干，会生成一条指向最近的L1/2路由器的默认路由（类似OSPF Stub区域的默认路由），将访问其他区域的流量发给L1/2路由器。3.L1/2路由器如果只有L1邻居（没有L2邻居或L2链路down），则不设置ATT位（因为无法访问其他区域）。4.ATT位只在L1 LSP中有效，L2 LSP中没有ATT位。ATT位的作用：实现L1区域访问其他区域的默认路由，简化L1路由器的路由表（L1路由器只需要本区域路由+默认路由，不需要知道其他区域的具体路由）。这与OSPF的Stub区域类似：Stub区域的ABR向Stub区域发布默认路由（Type 3 LSA），Stub区域内路由器通过ABR访问外部。IS-IS的ATT位机制更简单（不需要额外的LSA，只需在LSP中设置一位）。路由渗透（Route Leakage）：L1/2路由器可以将Level-2的具体路由（而非仅默认路由）发布到L1区域（通过设置ATT位和发布具体路由），解决次优路径问题（L1路由器可能选择不是最优的L1/2路由器，因为只根据最近默认路由，而不知道其他区域的具体路由通过哪个L1/2更优）。ATT位是IS-IS分层路由的重要机制，是华为ICT大赛网络赛道的考点，需掌握ATT位的设置者、作用、L1路由器的行为、与OSPF默认路由的对比等。',
    knowledgeId: 'datacom-isis', direction: 'datacom',
  },
  {
    id: 'dc-f004', type: 'single',
    question: 'RSTP中，替代端口（Alternate Port）的作用是？',
    options: ['根端口的备份，根端口故障时快速切换为根端口', '指定端口的备份', '连接终端的端口', '被阻塞的端口，永远不转发'],
    answer: '根端口的备份，根端口故障时快速切换为根端口',
    explanation: 'RSTP/MSTP端口角色：1.根端口（Root Port）：到根桥路径开销最小的端口，处于Forwarding状态，每台非根桥有且只有一个根端口。2.指定端口（Designated Port）：每条链路到根桥路径开销小的一端的端口，处于Forwarding状态，根桥的所有端口都是指定端口。3.替代端口（Alternate Port）：根端口的备份端口，提供到根桥的替代路径，处于Discarding状态。当根端口故障时，替代端口立即成为新的根端口并进入Forwarding（无需重新计算，快速收敛）。替代端口收到的是更优的对端BPDU（对端是指定端口，本端不是根端口也不是指定端口）。4.备份端口（Backup Port）：指定端口的备份端口，提供到同一网段的备份路径，处于Discarding状态。当指定端口故障时，备份端口成为新的指定端口。备份端口收到的是更优的本端BPDU（本端交换机在同一网段有另一个端口是指定端口）。5.边缘端口（Edge Port）：连接终端，不参与STP，直接Forwarding。RSTP相比STP的端口角色改进：STP只有根端口、指定端口、阻塞端口（Blocking），阻塞端口不区分是根端口备份还是指定端口备份，故障时需要重新计算（30-50秒）。RSTP将阻塞端口细分为替代端口和备份端口，明确了备份关系，故障时可快速切换（秒级）。替代端口是根端口的备份（最常见的冗余场景，交换机有两条上行链路，一条根端口，一条替代端口），备份端口是指定端口的备份（较少见，交换机两个端口连接到同一集线器/共享介质）。RSTP快速收敛机制：P/A协商（指定端口快速进入Forwarding）、边缘端口（终端快速接入）、替代/备份端口（故障快速切换）、更短的BPDU超时（6秒vs20秒）。RSTP/MSTP端口角色是华为ICT大赛网络赛道的高频考点，需掌握各角色定义、状态、切换机制等。',
    knowledgeId: 'datacom-stp', direction: 'datacom',
  },
  {
    id: 'dc-f005', type: 'single',
    question: '以下关于链路聚合（Eth-Trunk）的说法，错误的是？',
    options: ['将多个物理接口捆绑成一个逻辑接口，提高带宽和可靠性', '成员接口可以是不同速率的接口', '成员接口必须具有相同的速率、双工模式、VLAN配置', '支持手工负载分担和LACP模式'],
    answer: '成员接口可以是不同速率的接口',
    explanation: '链路聚合（Link Aggregation，华为叫Eth-Trunk，LACP协议标准IEEE 802.3ad/802.1AX）：将多个物理接口捆绑成一个逻辑接口（Eth-Trunk接口），实现：1.带宽叠加：成员接口带宽叠加（如4个GE捆绑成4GE逻辑接口），提高带宽。2.负载分担：流量在成员接口间负载分担（基于源/目的MAC、IP、端口等哈希算法），提高链路利用率。3.冗余备份：某个成员接口故障时，流量自动切换到其他成员接口，提高可靠性，无需等待STP收敛（毫秒级切换）。成员接口要求（必须一致）：1.相同速率（如都是GE或都是10GE，不能GE和10GE混合）。2.相同双工模式（全双工，半双工不支持链路聚合）。3.相同VLAN配置（Access/Trunk/Hybrid模式、允许通过的VLAN、PVID等必须一致）。4.相同接口类型（都是以太网接口，不能是串行接口等）。5.成员接口不能配置IP地址（IP配置在Eth-Trunk逻辑接口上）。6.成员接口不能有其他配置（如静态MAC、端口安全等，需在Eth-Trunk上配置）。链路聚合模式：1.手工负载分担模式（Manual）：手动配置成员接口，不使用LACP协议，所有活动接口都参与负载分担，配置简单，但不能自动检测故障（只能检测物理故障，不能检测单向故障等）。2.LACP模式（Link Aggregation Control Protocol，链路聚合控制协议）：使用LACP协议（IEEE 802.3ad）动态协商，自动选择活动接口（可设置最大活动接口数，其余为备份），支持M:N冗余（M个活动接口，N个备份接口），能检测单向故障和协议故障，更可靠，推荐使用。LACP模式下，活动接口数达到上限后，新加入的接口为备份状态，活动接口故障时备份接口自动切换为活动。LACP优先级：系统优先级（选举主动端，值小优先，默认32768）、接口优先级（选举活动接口，值小优先，默认32768）。链路聚合是华为ICT大赛网络赛道的高频考点，需掌握原理、成员接口要求、模式（手工/LACP）、配置、负载分担方式、与STP的关系（Eth-Trunk逻辑接口参与STP，成员接口不单独参与）等。注意：不同速率接口不能加入同一Eth-Trunk，这是硬性要求。',
    knowledgeId: 'datacom-link-aggregation', direction: 'datacom',
  },
  {
    id: 'sec-f001', type: 'single',
    question: '防火墙中，Server-Map（服务器映射表）的作用是？',
    options: ['记录NAT Server映射关系，允许外网主动访问内网服务器', '记录会话表', '记录安全策略', '记录用户认证信息'],
    answer: '记录NAT Server映射关系，允许外网主动访问内网服务器',
    explanation: '防火墙Server-Map表（服务器映射表，也叫Server Map）：记录NAT Server（服务器映射，也叫目的NAT/静态NAT）的映射关系，用于允许外网主动访问内网服务器。作用：1.NAT Server配置：将内网服务器的私网IP+端口映射到公网IP+端口，外网用户访问公网IP+端口时，防火墙将目的地址转换为内网服务器私网IP+端口，转发给内网服务器。2.Server-Map表生成：配置NAT Server后，防火墙生成Server-Map表项，记录公网IP+端口→私网IP+端口的映射关系，以及允许的协议。3.流量匹配：外网访问内网服务器的流量匹配Server-Map表，防火墙进行目的NAT转换，并创建会话表，后续流量按会话表转发。4.与安全策略的关系：Server-Map表只做地址映射，流量仍需匹配安全策略（允许相应的源/目的/端口）才能通过（除非配置了"无需安全策略检查"或Server-Map自带允许）。Server-Map表类型：1.静态Server-Map：由NAT Server配置生成，永久存在（直到配置删除）。2.动态Server-Map：由ASPF（应用层包过滤）检测应用层协议协商（如FTP主动模式、SIP、H.323等）动态生成，临时存在（数据传输完成后删除），用于自动开放动态端口。Server-Map表与会话表（Session Table）的区别：1.Server-Map表：记录映射关系（NAT Server或ASPF动态端口），是预定义的允许规则，匹配首包后创建会话。2.会话表：记录每个活动连接的状态（五元组、NAT转换、超时、统计等），后续包直接匹配会话表快速转发。NAT Server是企业网络常用功能（对外发布Web、邮件、FTP等服务器），Server-Map表是其核心机制。华为防火墙配置：nat server protocol tcp global <公网IP> <公网端口> inside <私网IP> <私网端口>，可配置no-reverse（不允许反向访问，即内网服务器主动访问外网时不做源NAT转换）、vrrp（关联VRRP，主备切换时映射关系切换）等。Server-Map表是华为ICT大赛安全赛道的考点，需掌握NAT Server原理、Server-Map表生成、与安全策略关系、静态/动态Server-Map区别等。',
    knowledgeId: 'security-nat', direction: 'security',
  },
  {
    id: 'sec-f002', type: 'single',
    question: 'IPSec中，感兴趣流（Interesting Traffic）由什么定义？',
    options: ['ACL（访问控制列表）', '路由表', '安全策略', 'NAT规则'],
    answer: 'ACL（访问控制列表）',
    explanation: 'IPSec感兴趣流（Interesting Traffic）：由ACL（Access Control List，访问控制列表）定义，指定哪些流量需要IPSec保护（加密/认证），哪些流量按普通方式转发。1.匹配感兴趣流的流量：进入IPSec处理流程，封装为IPSec报文（AH/ESP），通过IPSec隧道转发到对端。2.不匹配感兴趣流的流量：按普通路由方式转发，不经过IPSec处理。感兴趣流配置：在IPSec策略视图下通过security acl <acl-number>引用ACL。ACL规则：permit表示匹配的流量需要IPSec保护，deny表示不需要保护（普通转发）。感兴趣流方向：源和目的要正确配置（本端子网到对端子网），对端的感兴趣流应该是镜像的（源和目的相反），否则可能只有一个方向被保护或建立不了IPSec SA。感兴趣流的作用：1.触发IKE协商：当有匹配感兴趣流的流量需要转发时，如果IPSec SA尚未建立，则触发IKE协商（阶段一+阶段二）建立SA。2.区分保护/非保护流量：只有匹配的流量才加密，其他流量正常转发，提高效率（不需要保护的流量不增加加密开销）。3.多VPN场景：不同的感兴趣流对应不同的IPSec策略，实现多个VPN隧道（不同子网走不同隧道）。感兴趣流粒度：1.粗粒度（大网段，如192.168.0.0/16到10.0.0.0/8）：SA数量少，配置简单，但保护范围大（不需要保护的流量也被加密）。2.细粒度（主机到主机，如192.168.1.1/32到10.1.1.1/32）：SA数量多（每对主机一个SA），保护精确，但配置复杂，SA数量多消耗资源。通常建议用粗粒度（网段到网段），减少SA数量。IPSec策略模式：1.策略模式（ISAKMP/Policy-based）：使用感兴趣流（ACL）定义保护流量，手动配置对端IP和感兴趣流，适合站点到站点VPN。2.模板模式（Template）：对端（动态IP，如拨号用户）不配置感兴趣流和对端IP，由本端定义，对端动态接入，适合远程接入VPN。3.路由模式（Route-based，也叫Tunnel接口）：不使用感兴趣流，而是创建Tunnel接口（IPSec隧道接口），路由指向Tunnel接口的流量自动被IPSec保护，配置更灵活（支持动态路由、多VPN），是当前主流。华为防火墙支持策略模式和模板模式（路由模式在V500R005后支持）。感兴趣流是IPSec的核心概念，是华为ICT大赛安全赛道的高频考点，需掌握定义、配置、作用、粒度选择、与策略模式关系等。',
    knowledgeId: 'security-ipsec', direction: 'security',
  },
  {
    id: 'sec-f003', type: 'judge',
    question: '防火墙中，安全区域（Security Zone）的安全级别数值越大表示越可信，Local区域安全级别为100。',
    options: ['正确', '错误'], answer: '正确',
    explanation: '华为防火墙安全区域（Security Zone）：将接口划分到不同安全区域，基于安全区域配置安全策略（而不是基于接口），简化配置和管理。安全级别（Security Level）：1-100的数值，表示区域的可信程度，数值越大越可信。默认安全区域：1.Local（本地区域，安全级别100）：防火墙本身（防火墙的接口地址、防火墙发起的流量、访问防火墙本身的流量都属于Local区域），安全级别最高。2.Trust（信任区域，安全级别85）：通常用于内网（企业内部网络，可信）。3.DMZ（隔离区，安全级别50）：通常用于放置对外服务器（Web、邮件、DNS等，介于可信和不可信之间）。4.Untrust（非信任区域，安全级别5）：通常用于外网（Internet，不可信）。自定义安全区域：可创建自定义安全区域（如生产区、办公区、 guests区等），安全级别1-100自定义，满足复杂网络分区需求。安全区域规则：1.一个接口只能加入一个安全区域（接口加入区域后，该接口的流量属于该区域）。2.同区域内流量默认允许（不需要安全策略），不同区域间流量默认拒绝（需要安全策略允许）。3.流量方向：从高级别区域到低级别区域为出方向（Outbound，如Trust→Untrust，内网访问外网），从低级别到高级别为入方向（Inbound，如Untrust→DMZ，外网访问服务器）。4.安全策略基于源区域、目的区域、源/目的IP、端口、协议、应用、用户、时间等匹配。安全区域是华为防火墙的核心概念，与传统包过滤基于接口的方式不同，安全区域使策略配置更清晰、更易管理（按区域而非按接口，接口变化不影响策略）。安全级别只用于定义方向和默认行为，不直接用于策略匹配（策略匹配基于区域名称，不是级别）。注意：Local区域是防火墙本身，访问防火墙的管理流量（如SSH、Web管理、Ping防火墙接口）属于到Local区域的流量，需要安全策略允许（或开启接口管理访问权限）。安全区域是华为ICT大赛安全赛道的基础考点，需掌握默认区域、安全级别、流量方向、与安全策略关系等。',
    knowledgeId: 'security-firewall-basic', direction: 'security',
  },
  {
    id: 'sec-f004', type: 'single',
    question: '以下哪个协议用于网络设备的安全远程管理，替代不安全的Telnet？',
    options: ['FTP', 'SSH', 'HTTP', 'SNMPv1'],
    answer: 'SSH',
    explanation: 'SSH（Secure Shell，安全外壳）：用于网络设备和服务器的安全远程管理，替代不安全的Telnet（明文传输，包括用户名密码，易被窃听和篡改）。SSH特点：1.加密传输：所有数据（包括认证、命令、输出）都加密传输，防止窃听。2.身份认证：支持密码认证和公钥认证（更安全，免密码），防止身份伪造。3.完整性校验：通过MAC（消息认证码）保证数据完整性，防止篡改。4.端口转发：支持本地端口转发、远程端口转发、动态端口转发（SOCKS代理），可加密其他应用流量。5.SFTP（SSH File Transfer Protocol）：基于SSH的安全文件传输，替代不安全的FTP。SSH版本：SSH1（已淘汰，有安全漏洞）、SSH2（当前标准，更安全高效）。SSH默认端口22，使用TCP。SSH工作过程：1.版本协商：客户端和服务器协商SSH版本。2.算法协商：协商加密算法（AES、3DES、ChaCha20等）、认证算法（RSA、ECDSA、Ed25519等）、MAC算法（HMAC-SHA256等）、压缩算法。3.密钥交换：通过DH（Diffie-Hellman）或ECDH交换生成会话密钥（非对称加密交换对称密钥）。4.服务器认证：客户端验证服务器公钥（首次连接时提示确认，后续自动验证，防止中间人攻击）。5.用户认证：密码认证或公钥认证。6.交互会话：加密传输命令和输出。其他安全管理协议：1.HTTPS（HTTP over TLS）：Web管理界面的安全协议，替代HTTP。2.SNMPv3：简单网络管理协议v3，支持认证和加密，替代不安全的SNMPv1/v2c（明文community字符串）。3.Netconf/RESTCONF over SSH/TLS：网络配置协议，安全传输。4.SFTP/SCP：安全文件传输，替代FTP/TFTP（TFTP无认证无加密，仅用于本地网络设备升级）。不安全的协议：Telnet（明文远程管理）、FTP（明文文件传输）、HTTP（明文Web）、SNMPv1/v2c（明文管理）、TFTP（无认证文件传输），这些协议应在生产环境中禁用，改用安全版本。安全远程管理是华为ICT大赛安全赛道的考点，需掌握SSH原理、配置、与Telnet对比、其他安全管理协议等。',
    knowledgeId: 'security-management', direction: 'security',
  },
  {
    id: 'wlan-f001', type: 'single',
    question: 'WLAN中，802.11ax（Wi-Fi 6）引入的OFDMA技术的主要作用是？',
    options: ['将信道划分为多个子信道（RU），同时与多个用户通信，提高多用户效率和降低延迟', '增加发射功率', '扩展频段到6GHz', '简化认证流程'],
    answer: '将信道划分为多个子信道（RU），同时与多个用户通信，提高多用户效率和降低延迟',
    explanation: 'OFDMA（Orthogonal Frequency Division Multiple Access，正交频分多址）是Wi-Fi 6（802.11ax）的核心技术，从4G/5G移动通信引入，是Wi-Fi 6相比Wi-Fi 5的最大改进之一。OFDMA原理：1.将信道（如20MHz）划分为多个更小的子信道（RU，Resource Unit，资源单元），如26/52/106/242/484/996/2x996子载波等不同大小的RU。2.同时与多个用户通信：AP将不同的RU分配给不同的用户（或同一用户的不同业务），多个用户同时传输数据，而不是传统Wi-Fi的轮流传输（TDMA，时分多址，一个用户占满整个信道传输，其他用户等待）。3.提高多用户效率：多用户同时传输，减少等待时间，提高信道利用率，尤其在高密度场景（多用户、小包业务如语音、游戏）效果显著。4.降低延迟：用户不需要等待整个信道空闲，小数据包可以分配小RU快速传输，降低接入延迟和抖动。5.灵活分配：根据用户数据量和QoS需求分配不同大小的RU（大数据用户分配大RU，小数据用户分配小RU），提高资源利用率。OFDMA与MU-MIMO的区别：1.OFDMA：频域多用户（不同用户用不同子信道/RU），适合多用户小包、低延迟场景，提高效率。2.MU-MIMO：空间域多用户（不同用户用不同空间流/天线），适合多用户大数据包、高吞吐量场景，提高吞吐量。3.Wi-Fi 6同时支持OFDMA和上下行MU-MIMO，两者结合，在频域和空间域同时多用户，性能最优。4.Wi-Fi 5（802.11ac）只支持下行MU-MIMO，不支持OFDMA和上行MU-MIMO。OFDMA是Wi-Fi 6的标志性技术，是华为ICT大赛WLAN赛道的高频考点，需掌握原理、RU划分、与MU-MIMO区别、优势（多用户效率、低延迟、高密度）、应用场景等。Wi-Fi 6其他关键技术：上下行MU-MIMO、1024-QAM（调制密度提高25%）、BSS Coloring（BSS着色，减少同频干扰）、TWT（目标唤醒时间，降低功耗）、空间复用（SR，提高频谱利用率）等。',
    knowledgeId: 'wlan-wifi6', direction: 'wlan',
  },
  {
    id: 'wlan-f002', type: 'judge',
    question: 'WLAN中，DHCP Option43是AP发现AC的常用方式，DHCP服务器在Option43字段中携带AC的IP地址。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'FIT AP（瘦AP）发现AC（接入控制器）的方式：1.广播方式（Broadcast）：AP发送CAPWAP Discover广播报文，同二层网络的AC回应，适合AC和AP在同一网段（二层组网），简单但跨三层不行。2.DHCP Option43方式：DHCP服务器在Option43字段中携带AC的IP地址列表，AP从DHCP获取IP地址时同时获取AC地址，适合跨三层组网，是企业网络最常用的方式。3.DNS方式：AP通过解析特定域名（如hwac.com，可配置）获取AC IP地址，需DNS服务器配置对应记录，适合大规模网络（AC地址变化时只需更新DNS记录）。4.静态配置方式：在AP上手动配置AC IP地址（通过AP命令行或Web界面），适合固定环境或测试，配置工作量大。5.组播方式：AP发送CAPWAP Discover组播报文（224.0.1.140），AC回应，较少用。DHCP Option43格式：厂商特定选项，不同厂商格式不同。华为Option43格式：Type（1字节，固定0x01）+Length（1字节）+Value（AC IP地址列表，每个IP 4字节，可多个）。如AC IP为192.168.1.1，Option43值为0104C0A80101（01=Type，04=Length，C0A80101=192.168.1.1的十六进制）。AP上线流程：1.获取IP地址（DHCP或静态）。2.发现AC（广播/Option43/DNS/静态）。3.建立CAPWAP控制隧道（Discover→Join→Configure→Data Check→Run，UDP 5246，DTLS加密）。4.下载版本（如AP版本与AC不一致，自动升级）。5.下载配置（VAP模板、射频模板、安全模板等）。6.正常工作（提供无线接入，用户数据转发）。AP发现AC是WLAN基础配置，是华为ICT大赛WLAN赛道的高频考点，需掌握各种发现方式、Option43配置、AP上线流程、CAPWAP隧道等。注意：如果AP发现多个AC，会选择优先级最高的AC（可配置AC优先级，通过CAPWAP Discover报文中的优先级字段），实现AC负载分担和冗余备份（双AC热备/冷备）。',
    knowledgeId: 'wlan-arch', direction: 'wlan',
  },
  {
    id: 'dcn-f001', type: 'single',
    question: 'VXLAN中，分布式网关（Distributed Gateway）相比集中式网关的主要优势是？',
    options: ['跨子网流量在源Leaf直接路由，无需绕行集中网关，延迟低无瓶颈', '配置更简单', '安全性更高', '兼容性更好'],
    answer: '跨子网流量在源Leaf直接路由，无需绕行集中网关，延迟低无瓶颈',
    explanation: 'VXLAN/EVPN网络三层网关模式：1.集中式网关（Centralized Gateway）：所有VNI的三层网关都在一台设备上（通常是Spine或专用网关设备，如华为CE12800/防火墙），虚拟机的默认网关指向集中网关。跨子网流量路径：源虚拟机→源Leaf（二层封装VXLAN）→集中网关（解封装，三层路由，重新封装VXLAN）→目的Leaf→目的虚拟机。优点：网关集中管理，配置简单，便于集中安全策略控制（所有跨子网流量经过网关，可统一防火墙/IPS/审计）。缺点：集中网关是性能瓶颈（所有跨子网流量都经过，东西向流量大时网关带宽和转发能力不足）、单点故障（网关故障所有跨子网通信中断）、延迟高（流量绕行网关，多经过几跳）、东西向流量效率低。2.分布式网关（Distributed Gateway）：每台Leaf都是所有VNI的三层网关，虚拟机的默认网关在本地Leaf上（Anycast Gateway，任播网关，所有Leaf的网关IP和MAC相同）。跨子网流量路径：源虚拟机→源Leaf（本地三层路由，直接封装VXLAN到目的Leaf）→目的Leaf→目的虚拟机。流量在源Leaf直接路由，无需绕行集中网关。优点：延迟低（2跳，与同子网相同）、无瓶颈（分布式转发，每台Leaf只处理本地流量，水平扩展）、无单点故障（Leaf故障只影响本地服务器）、东西向流量效率高（适合数据中心东西向流量为主的场景）。缺点：配置复杂（每台Leaf都要配置所有VNI网关和EVPN）、安全策略分散（跨子网流量不经过集中设备，安全控制需在Leaf上分布式部署或引入服务链）。Anycast Gateway（任播网关）：所有Leaf的三层网关IP和MAC地址相同，虚拟机无论迁移到哪台Leaf，默认网关都不变，无需重新配置，实现无缝迁移。分布式网关通过EVPN Type 2路由（携带主机IP地址）同步主机路由，每台Leaf学习到所有虚拟机的IP-VTEP映射，跨子网时直接查主机路由（32位主机路由）封装到目的Leaf。分布式网关是当前数据中心VXLAN/EVPN的主流方案（中大型数据中心、东西向流量大），集中式网关适合小型数据中心或需要集中安全控制的场景。EVPN支持两种网关模式，可根据需求选择。分布式网关是华为ICT大赛DCN赛道的高频考点，需掌握原理、Anycast Gateway、与集中式对比、EVPN Type 2主机路由、流量路径等。',
    knowledgeId: 'dcn-vxlan-gateway', direction: 'dcn',
  },
  {
    id: 'dcn-f002', type: 'judge',
    question: 'EVPN中，Type 5路由（IP Prefix Route）用于通告IP前缀路由，支持分布式网关和外部路由引入。',
    options: ['正确', '错误'], answer: '正确',
    explanation: 'EVPN（Ethernet VPN）路由类型（RFC 7432及扩展）：1.Type 1（Ethernet Auto-Discovery Route，ES自动发现路由）：多归接入（Multi-homing）场景下发现以太网段（ES，Ethernet Segment）成员，用于快速收敛和别名（Aliasing，负载分担）。携带ESI（Ethernet Segment Identifier，以太网段标识）、EVPN实例标签等。2.Type 2（MAC/IP Advertisement Route，MAC/IP地址通告路由）：同步主机的MAC地址和IP地址（IP可选），实现控制面MAC学习（无需数据面泛洪）、ARP代理/抑制、分布式网关主机路由同步。携带MAC地址、IP地址、VNI、VTEP IP、MPLS标签、ESI等。3.Type 3（Inclusive Multicast Ethernet Tag Route，包含组播以太网标签路由）：发现同VNI的VTEP，构建头端复制（HER）列表，用于BUM流量转发。携带VNI（以太网标签）、VTEP IP、组播地址（如用组播）等。4.Type 4（Ethernet Segment Route，以太网段路由）：多归接入场景下选举DF（Designated Forwarder，指定转发器），避免BUM流量重复转发。携带ESI、VTEP IP、DF选举算法等。5.Type 5（IP Prefix Route，IP前缀路由）：通告IP前缀路由（如外部路由、汇聚路由、默认路由），用于：a.分布式网关场景下通告外部路由（数据中心访问外部网络的路由，通过边界Leaf/防火墙引入）。b.通告汇聚路由（汇总路由，减少主机路由数量）。c.通告默认路由（0.0.0.0/0，引导外部流量）。d.跨子网路由（某些实现中用Type 5而非Type 2的IP字段）。携带IP前缀、前缀长度、VNI、VTEP IP、MPLS标签、ESI（可选）、网关IP（可选）等。Type 5路由是EVPN的重要扩展（RFC 7916），使EVPN不仅能处理二层（MAC），还能处理三层（IP前缀），实现纯EVPN的三层网络（不需要额外的路由协议），是分布式网关和数据中心互联（DCI）的关键。EVPN路由类型是华为ICT大赛DCN赛道的高频考点，需掌握每种类型的作用、携带信息、应用场景，尤其是Type 2（MAC/IP同步）、Type 3（VTEP发现/头端复制）、Type 5（IP前缀/外部路由）。注意：Type 2的IP地址字段是主机IP（/32或/128），用于主机路由；Type 5是任意前缀长度，用于网段路由/外部路由/汇总路由。',
    knowledgeId: 'dcn-evpn', direction: 'dcn',
  },
'''

idx = content.rfind(']')
new_content = content[:idx] + questions + '\n' + content[idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

count = new_content.count("question: '")
print(f"Inserted batch F, total questions: {count}")
