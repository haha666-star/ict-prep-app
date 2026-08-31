import re

filepath = r"C:\Users\34598\Doubao\chats\2026-08-31\new-chat\ict-prep-app\src\data\quizzes.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

questions = '''
  // ==================== 扩充题库 Batch K ====================
  {
    id: 'dc-k001', type: 'single',
    question: 'TCP协议中，滑动窗口（Sliding Window）机制的主要作用是？',
    options: ['流量控制（防止发送方发送过快导致接收方缓冲区溢出）', '拥塞控制（防止网络拥塞）', '差错控制（检测和重传丢失报文）', '连接管理（三次握手/四次挥手）'],
    answer: '流量控制（防止发送方发送过快导致接收方缓冲区溢出）',
    explanation: 'TCP滑动窗口（Sliding Window）：1.流量控制（Flow Control）：接收方通过TCP首部的窗口大小（Window Size）字段告知发送方自己的接收缓冲区大小，发送方根据窗口大小控制发送速率，确保发送的数据不超过接收方的处理能力，防止接收方缓冲区溢出。2.滑动窗口机制：发送方维护一个发送窗口（已发送但未确认的报文+可发送的报文），接收方维护一个接收窗口（可接收的报文范围）。窗口随确认报文（ACK）滑动，已确认的报文移出窗口，新的报文可进入窗口发送。3.窗口大小：接收方根据缓冲区剩余空间动态调整窗口大小（0表示接收方缓冲区满，发送方停止发送，等待接收方窗口更新）。4.与拥塞控制的区别：a.流量控制（滑动窗口）：端到端，防止发送方过快导致接收方溢出，由接收方窗口大小控制。b.拥塞控制（Congestion Control）：全局性，防止网络拥塞，由发送方根据网络状况（丢包、延迟）调整拥塞窗口（cwnd），包括慢启动（Slow Start）、拥塞避免（Congestion Avoidance）、快速重传（Fast Retransmit）、快速恢复（Fast Recovery）等算法。c.发送方实际发送窗口=min(接收方窗口rwnd, 拥塞窗口cwnd)，取两者较小值。5.其他TCP机制：a.差错控制：通过校验和（Checksum）、确认（ACK）、超时重传（Retransmission Timeout，RTO）、快速重传（收到3个重复ACK立即重传，不等超时）实现可靠传输。b.连接管理：三次握手建立连接，四次挥手释放连接，SYN/FIN标志位，ISN初始序列号。c.按序交付：通过序列号（Sequence Number）保证数据按序到达，乱序报文暂存缓冲区，等缺失报文到达后按序交付应用层。d.全双工：TCP连接双方可同时发送和接收数据，双方独立维护序列号和窗口。TCP是面向连接的、可靠的、基于字节流的传输层协议，滑动窗口是TCP流量控制的核心机制，是华为ICT大赛网络赛道的基础考点，需掌握滑动窗口原理、流量控制与拥塞控制的区别、窗口大小、慢启动/拥塞避免等。',
    knowledgeId: 'datacom-tcp-udp', direction: 'datacom',
  },
  {
    id: 'dc-k002', type: 'single',
    question: '以下关于DNS（域名系统）的说法，错误的是？',
    options: ['DNS使用UDP 53端口进行域名解析，响应超过512字节时使用TCP 53', 'DNS递归查询（Recursive Query）由DNS服务器替客户端查询，返回最终结果', 'DNS迭代查询（Iterative Query）由DNS服务器返回下一个可查询的服务器地址，客户端自行查询', 'DNS缓存只能在客户端缓存，DNS服务器不能缓存'],
    answer: 'DNS缓存只能在客户端缓存，DNS服务器不能缓存',
    explanation: 'DNS（Domain Name System，域名系统）：将域名（如www.example.com）解析为IP地址（如93.184.216.34），是互联网的核心服务。1.传输协议：a.默认使用UDP 53端口（查询响应小，一次交互即可，UDP效率高）。b.响应超过512字节（如区域传输AXFR/IXFR、大量记录）时使用TCP 53端口（TCP可靠，支持大数据传输）。c.DNSSEC（DNS安全扩展）签名后响应可能超过512字节，也会使用TCP或EDNS0（扩展DNS，支持更大UDP报文）。2.查询方式：a.递归查询（Recursive Query）：客户端向本地DNS服务器（递归解析器）发送查询，本地DNS服务器替客户端查询（从根服务器开始，逐级查询），最终返回最终结果（IP地址或不存在）。客户端只需一次查询，由本地DNS服务器完成所有工作。通常客户端→本地DNS服务器是递归查询。b.迭代查询（Iterative Query，也叫反复查询）：DNS服务器向其他DNS服务器查询时，对方返回"我不知道，但你可以去问XX服务器"（下一个可查询的服务器地址，如根服务器返回顶级域服务器地址，顶级域服务器返回权威服务器地址），查询方自行继续查询。通常本地DNS服务器→根/顶级域/权威服务器是迭代查询。3.DNS缓存（DNS Cache）：a.客户端缓存：操作系统和浏览器缓存DNS解析结果，减少重复查询，提高速度（缓存时间由TTL决定）。b.DNS服务器缓存（递归解析器缓存）：本地DNS服务器缓存查询过的域名结果，后续相同域名查询直接返回缓存，不需要再次逐级查询，大幅提高解析速度和减少根/权威服务器负载。c.权威服务器不缓存（权威服务器是域名记录的原始来源，直接返回配置的记录）。d.缓存时间由TTL（Time To Live，生存时间）决定，TTL过期后缓存删除，需要重新查询。4.DNS服务器类型：a.根服务器（Root Server）：全球13组根服务器（A-M，实际数百台实例），存储顶级域（.com/.org/.cn等）的权威服务器地址。b.顶级域服务器（TLD Server，Top Level Domain）：存储.com/.org/.cn等顶级域下的域名权威服务器地址。c.权威服务器（Authoritative Server）：存储具体域名的DNS记录（A/AAAA/CNAME/MX/NS/TXT等），是域名记录的原始来源。d.递归解析器（Recursive Resolver，本地DNS服务器）：替客户端逐级查询，缓存结果，如运营商DNS、公共DNS（8.8.8.8 Google、1.1.1.1 Cloudflare、223.5.5.5阿里）。5.DNS记录类型：a.A（Address）：域名→IPv4地址。b.AAAA：域名→IPv6地址。c.CNAME（Canonical Name）：域名→另一个域名（别名，如www.example.com→example.com）。d.MX（Mail Exchange）：邮件交换服务器，用于邮件路由。e.NS（Name Server）：域名的权威DNS服务器。f.TXT：文本记录，用于SPF（反垃圾邮件）、DKIM（邮件签名）、域名验证等。g.PTR（Pointer）：IP→域名（反向解析）。h.SRV（Service）：服务位置记录（如_sip._tcp.example.com，用于SIP/XMPP等）。i.SOA（Start of Authority）：区域起始授权记录，包含区域版本、刷新时间、重试时间、过期时间、最小TTL等。6.DNS查询过程（以www.example.com为例）：a.客户端检查本地缓存（浏览器/操作系统），有则直接返回。b.无缓存则向本地DNS服务器（递归解析器）发送递归查询。c.本地DNS服务器检查缓存，有则返回。d.无缓存则向根服务器发送迭代查询，根返回.com顶级域服务器地址。e.本地DNS向.com顶级域服务器查询，返回example.com权威服务器地址。f.本地DNS向example.com权威服务器查询，返回www.example.com的A记录（IP地址）。g.本地DNS将结果缓存（TTL时间），返回给客户端。h.客户端缓存结果，使用IP地址访问目标服务器。DNS是华为ICT大赛网络赛道的基础考点，需掌握DNS原理、UDP/TCP端口、递归/迭代查询、缓存机制（客户端和服务器都缓存）、服务器类型、记录类型、查询过程等。注意：DNS服务器（递归解析器）也会缓存，这是常见易错点。',
    knowledgeId: 'datacom-application-layer', direction: 'datacom',
  },
  {
    id: 'sec-k001', type: 'single',
    question: '以下关于防火墙会话表（Session Table）的说法，错误的是？',
    options: ['会话表记录五元组（源/目的IP、源/目的端口、协议）、状态、超时、NAT信息等', '首包匹配安全策略后创建会话表，后续包直接匹配会话表快速转发', 'TCP会话建立后永久有效，不会超时删除', '不同协议/状态有不同的超时时间（如TCP ESTABLISHED 1200秒，UDP 120秒）'],
    answer: 'TCP会话建立后永久有效，不会超时删除',
    explanation: '防火墙会话表（Session Table，也叫会话表项）：状态检测防火墙的核心，记录每个活动连接的状态信息，实现快速转发和状态跟踪。1.会话表内容：a.五元组（5-Tuple）：源IP、目的IP、源端口、目的端口、协议号（TCP/UDP/ICMP等），唯一标识一个会话。b.会话状态：TCP的状态机（SYN、SYN-ACK、ESTABLISHED、FIN、CLOSE-WAIT等）、UDP的会话状态（UP/DOWN）、ICMP的请求/响应状态。c.超时时间（Timeout）：会话剩余生存时间，超时后删除会话表项。d.NAT信息：如果经过NAT转换，记录转换前后的地址/端口（源NAT、目的NAT、NAT Server等）。e.安全策略：匹配的安全策略ID。f.统计信息：字节数、包数、开始时间、最后活动时间。g.接口信息：入接口、出接口。h.应用信息：识别的应用类型（如HTTP、FTP、微信等，通过DPI识别）。2.会话表建立：a.首包（第一个报文）到达防火墙，匹配安全策略（源/目的区域、IP、端口、协议、应用、用户、时间等）。b.安全策略允许（Permit），则创建会话表项，记录五元组、状态、NAT转换等信息，转发报文。c.安全策略拒绝（Deny），则丢弃报文，不创建会话。d.后续报文（同一会话的后续包）直接匹配会话表（五元组匹配），不需要再次匹配安全策略，直接按会话表信息转发（包括NAT转换、出接口等），性能高（硬件线速转发）。3.会话表超时：a.会话表项不是永久有效的，有超时时间，超时后自动删除（释放资源）。b.不同协议/状态有不同的超时时间（华为防火墙默认值）：- TCP SYN状态：30秒（半连接超时，防止SYN Flood占满会话表）。- TCP ESTABLISHED状态：1200秒（20分钟，正常建立的会话，长时间无数据则超时删除）。- TCP FIN状态：10秒（收到FIN后等待关闭）。- UDP会话：120秒（2分钟，UDP无连接，基于最后活动时间超时）。- ICMP会话：20秒。- DNS会话：30秒（DNS查询响应快，超时短）。- HTTP会话：120秒（可基于应用调整）。c.超时时间可根据需求调整（如长连接应用需要更长超时，可配置长连接策略）。d.会话表项数量是防火墙的重要性能指标（最大并发连接数，如每秒新建连接数CPS、最大并发连接数），会话表满后新连接无法建立（被丢弃），所以SYN Flood等攻击会占满会话表导致拒绝服务。4.会话表与状态检测：a.状态检测（Stateful Inspection）：只检查首包（匹配安全策略），后续包按会话表转发，同时跟踪协议状态（TCP状态机、应用层协议状态如FTP动态端口）。b.状态检测能检测异常报文（如未建立连接直接发数据、非法TCP标志位、伪造的ACK等），丢弃异常报文，提高安全性。c.ASPF（应用层包过滤）：进一步检测应用层协议状态（FTP/SIP/H.323等），自动开放动态端口，创建动态会话表项。5.会话表查看：华为防火墙通过display firewall session table命令查看会话表，可按协议、源/目的IP、接口等过滤，显示详细会话信息（五元组、状态、超时、NAT、包数/字节数等）。会话表是华为ICT大赛安全赛道的高频考点，需掌握会话表内容、建立过程（首包查策略，后续查会话）、超时机制（不同协议不同超时，不是永久有效）、状态检测、性能指标（并发连接数/CPS）、与安全策略关系等。注意：会话表会超时删除，不是永久有效，这是常见易错点。',
    knowledgeId: 'security-firewall-basic', direction: 'security',
  },
  {
    id: 'wlan-k001', type: 'single',
    question: 'WLAN中，以下关于WMM（Wi-Fi多媒体）QoS的说法，错误的是？',
    options: ['WMM将流量分为4个接入类别（AC）：AC_VO（语音）、AC_VI（视频）、AC_BE（尽力而为）、AC_BK（背景）', 'AC_VO优先级最高，AC_BK优先级最低', '优先级通过AIFS（仲裁帧间间隔）、ECW（竞争窗口）、TXOP（传输机会）参数区分', 'WMM只能在5GHz使用，2.4GHz不支持WMM'],
    answer: 'WMM只能在5GHz使用，2.4GHz不支持WMM',
    explanation: 'WMM（Wi-Fi Multimedia，Wi-Fi多媒体，基于IEEE 802.11e标准）：WLAN的QoS（服务质量）基础，为不同业务提供差异化服务，保证语音/视频等实时业务的低延迟和低丢包。1.接入类别（Access Category，AC）：WMM将流量分为4个优先级队列（从高到低）：a.AC_VO（Voice，语音）：最高优先级，低延迟、低丢包、低抖动，用于VoWiFi电话、实时语音等。b.AC_VI（Video，视频）：次高优先级，用于视频会议、流媒体视频、监控视频等。c.AC_BE（Best Effort，尽力而为）：默认优先级，用于网页浏览、文件下载、邮件等普通业务。d.AC_BK（Background，背景）：最低优先级，用于后台下载、软件更新、备份等不敏感业务。2.QoS参数（区分优先级的机制）：a.AIFS（Arbitration Inter-Frame Space，仲裁帧间间隔）：发送数据前需要等待的空闲时间，AIFS越小等待越短，优先级越高（AC_VO的AIFS最小，AC_BK最大）。b.ECW（Exponent of Contention Window，竞争窗口指数）：冲突后随机退避的时间范围，ECW越小竞争窗口越小，冲突概率越低，优先级越高（AC_VO的ECW最小，AC_BK最大）。c.TXOP（Transmission Opportunity，传输机会）：获得信道后可连续发送的最大时间（可连续发送多个帧），TXOP越大可发送的数据越多，AC_VO/AC_VI的TXOP较大（高优先级可连续发送更多），AC_BK的TXOP为0（每次只能发一个帧）。3.用户优先级映射（UP，User Priority，802.1p，0-7）：以太网帧的802.1p优先级（0-7）映射到WMM AC：- UP 7（Network Control，网络控制）、UP 6（Voice，语音）→AC_VO。- UP 5（Video，视频）、UP 4（Controlled Load，受控负载）→AC_VI。- UP 0（Best Effort，尽力而为）、UP 3（Excellent Effort，优秀尽力而为）→AC_BE。- UP 1（Background，背景）、UP 2（Spare，备用）→AC_BK。4.WMM适用频段：WMM在2.4GHz和5GHz都支持（802.11e是MAC层QoS，与频段无关），不是只能在5GHz使用。a.802.11n（Wi-Fi 4）及以后的标准都支持WMM（WMM是802.11n的强制要求，不支持WMM不能使用802.11n的高吞吐量）。b.802.11ac（Wi-Fi 5）、802.11ax（Wi-Fi 6）都支持WMM，并增强了QoS（如Wi-Fi 6的OFDMA进一步提高多用户QoS）。c.老的802.11a/b/g设备可能不支持WMM（但现在几乎所有设备都支持）。5.WMM其他功能：a.WMM-PS（WMM Power Save，WMM省电）：更高效的省电机制，结合U-APSD（Unscheduled Automatic Power Save Delivery，非调度自动省电交付），终端在休眠期间缓存下行数据，唤醒后批量接收，延长电池寿命，适合语音等实时业务（语音包小但频繁，U-APSD可快速响应）。b.准入控制（Admission Control，TSPEC）：语音/视频业务可请求带宽预留（TSPEC，流量规格），AP根据资源情况决定是否准入，保证已准入业务的QoS（防止过多语音业务导致拥塞）。c.流量分类：AP根据端口/协议/应用将流量映射到不同AC队列（如SIP/RTP端口映射到AC_VO，HTTP端口映射到AC_BE），也可根据用户配置的QoS策略映射。6.WMM与其他QoS技术：a.WMM是无线侧QoS（空口资源调度），有线侧QoS（802.1p/DSCP）需要端到端配合（有线侧优先级映射到无线侧WMM AC，保证端到端QoS）。b.Wi-Fi 6的OFDMA与WMM配合：OFDMA在频域多用户，WMM在时域优先级，两者结合提供更优的多用户QoS。c.Airtime Fairness（空口时间公平）：保证不同速率的用户获得相同的空口时间（而非相同的帧数），防止低速率用户拖慢整体性能，与WMM配合优化整体性能。WMM是华为ICT大赛WLAN赛道的高频考点，需掌握4个AC类别及优先级、QoS参数（AIFS/ECW/TXOP）、802.1p映射、WMM-PS/U-APSD、适用频段（2.4G和5G都支持）等。注意：WMM在2.4GHz和5GHz都支持，不是只能在5GHz，这是常见易错点。',
    knowledgeId: 'wlan-qos', direction: 'wlan',
  },
'''

idx = content.rfind(']')
new_content = content[:idx] + questions + '\n' + content[idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

count = new_content.count("question: '")
print(f"Inserted batch K, total questions: {count}")
