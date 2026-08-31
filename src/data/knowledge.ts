// EXPORTS: IKnowledge, MOCK_KNOWLEDGE
export interface IKnowledge {
  id: string
  name: string
  direction: 'datacom' | 'dcn' | 'security' | 'wlan'
  parentId: string | null
  level: number
  keyPoints: string[]
  tips: string
}

export const MOCK_KNOWLEDGE: IKnowledge[] = [
  // ==================== 数通方向 ====================
  { id: 'datacom', name: '数通', direction: 'datacom', parentId: null, level: 1, keyPoints: [], tips: '' },

  // 网络基础
  { id: 'datacom-basic', name: '网络基础', direction: 'datacom', parentId: 'datacom', level: 2, keyPoints: [], tips: '' },
  {
    id: 'datacom-osi-tcpip',
    name: 'OSI与TCP/IP模型',
    direction: 'datacom',
    parentId: 'datacom-basic',
    level: 3,
    keyPoints: [
      'OSI七层模型：物理层、数据链路层、网络层、传输层、会话层、表示层、应用层',
      'TCP/IP四层模型：网络接口层、网际层、传输层、应用层',
      '封装与解封装：数据从上到下逐层封装，从下到上逐层解封装',
      'PDU名称：传输层段(Segment)、网络层包(Packet)、数据链路层帧(Frame)、物理层比特(Bit)',
      '常见协议对应层：IP/ICMP/ARP在网络层，TCP/UDP在传输层，HTTP/FTP/DNS在应用层'
    ],
    tips: '考试常考各层功能和协议对应关系，注意ARP在网络层但工作在数据链路层'
  },
  {
    id: 'datacom-ip-subnet',
    name: 'IP地址与子网划分',
    direction: 'datacom',
    parentId: 'datacom-basic',
    level: 3,
    keyPoints: [
      'IPv4地址32位，分网络位和主机位，A/B/C/D/E五类',
      'A类1-126，B类128-191，C类192-223，D类224-239组播，E类240-255保留',
      '私有地址：A类10.0.0.0/8，B类172.16.0.0/12，C类192.168.0.0/16',
      '子网掩码区分网络位和主机位，CIDR表示法如192.168.1.0/24',
      '子网划分公式：子网数=2^借位数，主机数=2^主机位数-2（减网络地址和广播地址）',
      'VLSM可变长子网掩码，支持不同大小子网划分',
      '特殊地址：网络地址（主机位全0）、广播地址（主机位全1）、环回地址127.0.0.1'
    ],
    tips: '子网划分是必考题，掌握2的幂次快速计算，注意/30只有2个可用主机地址常用于点到点链路'
  },
  {
    id: 'datacom-arp',
    name: 'ARP协议',
    direction: 'datacom',
    parentId: 'datacom-basic',
    level: 3,
    keyPoints: [
      'ARP地址解析协议，将IP地址解析为MAC地址',
      'ARP请求是广播，ARP响应是单播',
      'ARP缓存表保存IP-MAC映射，老化时间默认180秒',
      '免费ARP（Gratuitous ARP）用于检测IP冲突和更新ARP表',
      '代理ARP：路由器代替目标主机回应ARP请求',
      'ARP欺骗攻击：伪造ARP响应篡改目标ARP缓存'
    ],
    tips: '华为设备display arp查看ARP表，arp static配置静态ARP绑定'
  },

  // 以太网与交换
  { id: 'datacom-lan', name: '以太网与二层交换', direction: 'datacom', parentId: 'datacom', level: 2, keyPoints: [], tips: '' },
  {
    id: 'datacom-ethernet',
    name: '以太网技术',
    direction: 'datacom',
    parentId: 'datacom-lan',
    level: 3,
    keyPoints: [
      '以太网帧格式：目的MAC(6B)+源MAC(6B)+类型(2B)+数据(46-1500B)+FCS(4B)',
      'MAC地址48位，前24位OUI厂商标识，后24位厂商分配',
      '单播帧目标MAC第一位为0，组播帧第一位为1，广播帧全F',
      '交换机工作原理：学习源MAC、泛洪未知单播、转发已知单播、过滤同端口帧',
      'MAC地址表老化时间默认300秒，display mac-address查看',
      '交换机端口模式：Access、Trunk、Hybrid（华为特有）',
      '半双工CSMA/CD载波监听多路访问/冲突检测，全双工无冲突'
    ],
    tips: '注意区分交换机和集线器工作层次，交换机是数据链路层设备，集线器是物理层设备'
  },
  {
    id: 'datacom-vlan',
    name: 'VLAN',
    direction: 'datacom',
    parentId: 'datacom-lan',
    level: 3,
    keyPoints: [
      'VLAN虚拟局域网，隔离广播域，基于802.1Q标签',
      '802.1Q标签4字节：TPID(0x8100)+TCI(优先级3b+CFI1b+VLAN ID12b)',
      'VLAN ID范围1-4094，VLAN1是默认VLAN，VLAN0和4095保留',
      'Access端口：属于一个VLAN，发送时剥离标签，接收时打PVID标签',
      'Trunk端口：允许多个VLAN通过，默认VLAN1不打标签，其他VLAN打标签',
      'Hybrid端口：华为特有，可灵活配置哪些VLAN打标签、哪些不打标签',
      'VLAN间通信需要三层设备：单臂路由（路由器子接口）或三层交换机SVI接口',
      'VLAN聚合（Super VLAN）：多个Sub VLAN共享一个三层接口，节省IP地址',
      'MUX VLAN：企业园区网中实现VLAN间部分互通、部分隔离'
    ],
    tips: 'Hybrid端口是华为设备特色，考试常考tag/untag配置，注意PVID的作用'
  },
  {
    id: 'datacom-stp',
    name: 'STP/RSTP/MSTP',
    direction: 'datacom',
    parentId: 'datacom-lan',
    level: 3,
    keyPoints: [
      'STP生成树协议，通过阻塞端口消除二层环路，同时提供冗余备份',
      'STP端口角色：根端口(RP)、指定端口(DP)、阻塞端口(AP)',
      '根桥选举：比较桥ID（桥优先级2字节+MAC6字节），值小者优先，默认优先级32768',
      '根端口选举：在非根桥上选到根桥路径开销最小的端口',
      '指定端口选举：在每个网段选到根桥路径开销最小的交换机端口',
      'STP端口状态：Disabled→Blocking→Listening→Learning→Forwarding，收敛慢约30-50秒',
      'RSTP快速生成树：增加替代端口(Alternate)和备份端口(Backup)，边缘端口快速收敛',
      'RSTP端口状态：Discarding、Learning、Forwarding，三种状态',
      'MSTP多生成树：支持多实例，不同VLAN映射到不同实例，实现VLAN负载分担',
      'MST域：相同域名、修订级别、VLAN-实例映射关系的交换机组成一个MST域',
      '边缘端口：直接连接终端，不参与STP计算，可快速进入转发状态',
      'BPDU保护：边缘端口收到BPDU后关闭端口，防止非法接入',
      '根保护：指定端口收到更优BPDU后变为阻塞，防止根桥位置改变'
    ],
    tips: 'STP是高频考点，重点掌握端口角色选举规则和RSTP/MSTP改进点，华为默认MSTP模式'
  },
  {
    id: 'datacom-eth-trunk',
    name: '链路聚合Eth-Trunk',
    direction: 'datacom',
    parentId: 'datacom-lan',
    level: 3,
    keyPoints: [
      'Eth-Trunk将多条物理链路捆绑成一条逻辑链路，增加带宽并提供冗余',
      '手工负载分担模式：所有活动链路都参与数据转发，平均分配流量',
      'LACP模式（静态LACP/动态LACP）：基于IEEE802.3ad，通过LACPDU协商聚合',
      'LACP模式可设置活动接口上限和下限，部分链路故障自动切换',
      '成员接口必须速率、双工模式、VLAN配置一致',
      '负载分担方式：基于源MAC、目的MAC、源IP、目的IP、源端口、目的端口等哈希',
      'Eth-Trunk接口可配置为Access、Trunk、Hybrid模式',
      '最大支持8条成员链路（部分设备支持更多）',
      'LACP优先级：系统优先级和接口优先级，值小者优先，用于确定主动端和活动接口'
    ],
    tips: 'Eth-Trunk常用于核心交换机之间互联，注意成员接口不能配置业务，只能加入Eth-Trunk后在Eth-Trunk上配置'
  },
  {
    id: 'datacom-stack',
    name: '堆叠iStack/CSS',
    direction: 'datacom',
    parentId: 'datacom-lan',
    level: 3,
    keyPoints: [
      'iStack（接入交换机堆叠）/CSS（核心交换机集群）：多台交换机虚拟成一台逻辑设备',
      '堆叠优势：简化管理、跨设备链路聚合、提高可靠性、扩展端口密度',
      '堆叠角色：主交换机（Master）、备交换机（Standby）、从交换机（Slave）',
      '主交换机选举：优先比较堆叠优先级，值大者优先；相同则比较MAC地址，小者优先',
      '堆叠连接方式：业务口堆叠（普通业务口通过专用线缆连接）、堆叠卡堆叠（专用堆叠卡）',
      '堆叠ID：每台成员交换机有唯一堆叠ID（0-8或更多），用于标识成员',
      '跨设备Eth-Trunk：不同成员交换机的接口可加入同一个Eth-Trunk，实现链路冗余',
      '堆叠分裂：堆叠链路故障导致堆叠分裂，可能出现双主，需配置多主检测MAD'
    ],
    tips: '堆叠是园区网核心技术，注意主交换机选举规则和多主检测机制，display stack查看堆叠状态'
  },

  // 路由协议
  { id: 'datacom-routing', name: '路由协议', direction: 'datacom', parentId: 'datacom', level: 2, keyPoints: [], tips: '' },
  {
    id: 'datacom-static-route',
    name: '静态路由',
    direction: 'datacom',
    parentId: 'datacom-routing',
    level: 3,
    keyPoints: [
      '静态路由由管理员手工配置，优点是简单、高效、可靠，缺点是缺乏适应性',
      '静态路由配置：ip route-static 目标网络 掩码 下一跳/出接口',
      '默认路由：0.0.0.0 0.0.0.0，当路由表中无匹配路由时使用',
      '浮动静态路由：配置不同优先级，主路由故障时备用路由生效',
      '静态路由优先级默认60，直连路由优先级0，OSPF优先级10，BGP优先级255(EBGP)/255(IBGP)',
      '路由优先级值越小越优先，不同厂商可能不同',
      '出接口配置静态路由：在点到点链路可指定出接口，在广播型网络必须指定下一跳',
      '静态路由支持迭代：下一跳不是直连时，递归查找最终下一跳'
    ],
    tips: '静态路由常用于小型网络或作为浮动路由备份，注意优先级数值越小越优先'
  },
  {
    id: 'datacom-ospf',
    name: 'OSPF',
    direction: 'datacom',
    parentId: 'datacom-routing',
    level: 3,
    keyPoints: [
      'OSPF开放最短路径优先，链路状态路由协议，基于SPF算法，无环路',
      'OSPF区域划分：骨干区域Area 0必须连续，非骨干区域必须连接骨干区域',
      '区域类型：标准区域、Stub区域（不接收外部路由）、Totally Stub、NSSA（允许引入外部路由）、Totally NSSA',
      'OSPF七种LSA：Type1 Router LSA（本路由器链路状态）、Type2 Network LSA（DR生成的广播网络信息）、Type3 Summary LSA（ABR生成的区域间路由）、Type4 Summary LSA（ASBR位置信息）、Type5 AS External LSA（外部路由）、Type7 NSSA External LSA（NSSA区域外部路由）',
      'OSPF邻居状态机：Down→Init→2-Way→ExStart→Exchange→Loading→Full',
      'DR/BDR选举：在广播和NBMA网络选举，基于接口优先级（默认1，0不参与）和Router ID，值大者优先',
      'OSPF报文类型：Hello（发现维护邻居）、DD（数据库描述）、LSR（链路状态请求）、LSU（链路状态更新）、LSAck（链路状态确认）',
      'Router ID：32位标识路由器，可手动配置或自动选举（最大环回口IP>最大物理口IP）',
      'OSPF开销Cost=参考带宽/接口带宽，默认参考带宽100Mbps，可通过bandwidth-reference修改',
      'ABR区域边界路由器：连接多个区域，至少一个接口在Area 0',
      'ASBR自治系统边界路由器：引入外部路由的路由器，可在任意区域',
      'OSPF认证：接口认证（明文/MD5）、区域认证，防止非法路由器接入',
      '虚链路Virtual Link：解决骨干区域不连续问题，在两个ABR之间建立逻辑通道',
      'OSPF快速收敛：智能定时器、LSA组更新、PRC部分路由计算'
    ],
    tips: 'OSPF是最高频考点，必须掌握LSA类型、邻居状态机、区域类型、DR选举，display ospf peer查看邻居'
  },
  {
    id: 'datacom-isis',
    name: 'IS-IS',
    direction: 'datacom',
    parentId: 'datacom-routing',
    level: 3,
    keyPoints: [
      'IS-IS中间系统到中间系统，链路状态路由协议，基于SPF算法，最初为CLNP设计',
      'IS-IS路由器类型：Level-1（区域内路由）、Level-2（区域间路由）、Level-1-2（同时参与）',
      'Level-1路由器只能与同区域Level-1或Level-1-2建立邻居',
      'Level-2路由器可与任何Level-2或Level-1-2建立邻居，构成骨干',
      'IS-IS区域：NET地址中的Area ID标识区域，同一Level-1区域内Area ID必须相同',
      'NET网络实体标题：8-20字节，包含Area ID+System ID+NSEL(00)',
      'System ID 6字节，通常由IP地址转换而来（如192.168.001.001→1921.6800.1001）',
      'IS-IS报文：IIH（发现邻居）、LSP（链路状态协议数据单元）、CSNP（完全序列号报文）、PSNP（部分序列号报文）',
      'DIS指定中间系统：在广播网络选举，类似OSPF的DR，优先级默认64，0也参与选举，可抢占',
      'IS-IS度量：默认窄度量（6bit，最大63），宽度量（32bit），默认接口开销10',
      'IS-IS路由渗透：Level-2路由向Level-1区域发布，解决次优路径问题',
      'IS-IS认证：接口认证、区域认证、路由域认证'
    ],
    tips: 'IS-IS在运营商网络常用，注意与OSPF的区别：IS-IS没有DR/BDR只有DIS，DIS可抢占且优先级0也参与'
  },
  {
    id: 'datacom-bgp',
    name: 'BGP',
    direction: 'datacom',
    parentId: 'datacom-routing',
    level: 3,
    keyPoints: [
      'BGP边界网关协议，路径矢量协议，基于TCP 179端口，用于AS之间路由交换',
      'AS自治系统：同一管理域内的路由器集合，AS号范围1-65535，64512-65535私有',
      'EBGP：不同AS之间的BGP邻居，默认TTL=1，需直连或多跳',
      'IBGP：同一AS内的BGP邻居，默认不改变下一跳，水平分割防止环路',
      'BGP邻居状态机：Idle→Connect→Active→OpenSent→OpenConfirm→Established',
      'BGP报文：Open（建立邻居）、Update（路由更新/撤销）、Notification（错误通知）、Keepalive（保活）',
      'BGP路由属性：Origin（起源）、AS_Path（AS路径，防环）、Next_Hop（下一跳）、MED（多出口鉴别）、Local_Pref（本地优先级）、Community（团体属性）',
      'BGP路由优选规则：1.优选最大Weight（华为私有）2.最高Local_Pref 3.本地始发路由 4.最短AS_Path 5.最低Origin类型 6.最小MED 7.EBGP优于IBGP 8.最近IGP下一跳 9.最小Cluster List 10.最小Originator ID 11.最小Router ID',
      'IBGP水平分割：从IBGP学到的路由不再发给其他IBGP邻居，导致全互联需求',
      '路由反射器RR：解决IBGP全互联问题，RR将从客户端学到的路由反射给其他客户端和非客户端',
      '联盟Confederation：将一个大AS划分为多个子AS，子AS间用EBGP，子AS内用IBGP',
      'BGP聚合：自动聚合（按自然网段）、手动聚合（可配置属性），聚合路由可抑制明细',
      'BGP多路径：EBGP负载分担、IBGP负载分担，需满足特定条件'
    ],
    tips: 'BGP是难点也是重点，必须掌握路由属性和优选规则，display bgp peer查看邻居，display bgp routing-table查看路由'
  },
  {
    id: 'datacom-route-policy',
    name: '路由策略',
    direction: 'datacom',
    parentId: 'datacom-routing',
    level: 3,
    keyPoints: [
      '路由策略用于控制路由的接收、发布和引入，影响路由选择',
      'Filter-Policy：基于ACL或IP前缀列表过滤路由，可在import或export方向使用',
      'IP-Prefix前缀列表：匹配IP地址前缀和掩码范围，比ACL更精确',
      'Route-Policy：强大的路由策略工具，可匹配路由属性并修改属性，多个节点按序号匹配',
      'Route-Policy节点：if-match匹配条件（ACL、前缀列表、AS路径、团体属性等），apply修改属性（下一跳、开销、优先级、团体属性等）',
      'Route-Policy匹配模式：permit（允许并应用apply）、deny（拒绝）',
      'AS-Path-Filter：基于AS路径正则表达式过滤BGP路由',
      'Community-Filter：基于团体属性过滤BGP路由，团体属性可自定义',
      '路由引入（Import/Redistribute）：将其他协议路由引入本协议，需注意度量值和优先级',
      '双点双向引入可能产生环路和次优路径，需用路由策略控制',
      'Policy-Based-Routing（PBR）：策略路由，基于策略转发数据包，不按路由表，可基于源地址、目的地址、协议等'
    ],
    tips: '路由策略是综合题常考点，重点掌握Route-Policy的if-match和apply，以及路由引入的环路问题'
  },

  // IPv6
  { id: 'datacom-ipv6', name: 'IPv6', direction: 'datacom', parentId: 'datacom', level: 2, keyPoints: [], tips: '' },
  {
    id: 'datacom-ipv6-basic',
    name: 'IPv6基础',
    direction: 'datacom',
    parentId: 'datacom-ipv6',
    level: 3,
    keyPoints: [
      'IPv6地址128位，解决IPv4地址耗尽问题，地址空间2^128',
      'IPv6地址表示：8组16进制，每组16位，冒号分隔，前导零可省略，连续零可用::压缩（只能一次）',
      'IPv6地址类型：单播、组播、任播（Anycast），无广播',
      '单播地址分类：全球单播地址（2000::/3）、链路本地地址（FE80::/10）、唯一本地地址（FC00::/7，类似IPv4私有）、环回地址（::1/128）、未指定地址（::/128）',
      '链路本地地址：仅在本地链路有效，用于邻居发现、路由协议邻居建立，自动生成',
      'IPv6无状态自动配置（SLAAC）：主机根据路由器通告的前缀自动生成地址',
      'EUI-64：接口标识符生成方法，MAC地址中间插入FFFE并翻转第7位',
      '邻居发现协议NDP：替代IPv4的ARP，包括RS/RA/NS/NA/Redirect五种ICMPv6报文',
      '重复地址检测DAD：地址配置后发送NS检测是否冲突',
      'DHCPv6：有状态地址分配，SLAAC+DHCPv6可组合使用',
      'IPv6过渡技术：双栈、隧道（6to4、ISATAP、GRE）、NAT64、翻译技术'
    ],
    tips: 'IPv6是必考内容，重点掌握地址类型、SLAAC、NDP、EUI-64，注意IPv6没有广播用组播替代'
  },
  {
    id: 'datacom-ospfv3',
    name: 'OSPFv3',
    direction: 'datacom',
    parentId: 'datacom-ipv6',
    level: 3,
    keyPoints: [
      'OSPFv3是OSPFv2的IPv6版本，基于链路而非子网运行',
      'OSPFv3使用链路本地地址作为邻居间通信的源地址',
      'OSPFv3 Router ID仍为32位，需手动配置或从IPv4地址获取',
      'OSPFv3 LSA类型变化：Type1/2基本不变，Type3/4/5对应Inter-Area-Prefix/Inter-Area-Router/AS-External，新增Type8 Link LSA和Type9 Intra-Area-Prefix LSA',
      'OSPFv3将地址信息从Router LSA和Network LSA中分离，放到Intra-Area-Prefix LSA',
      'OSPFv3支持在同一链路上运行多个实例（Instance ID），可实现不同VPN',
      'OSPFv3认证使用IPv6 AH/ESP，而非OSPFv2的自带认证',
      'OSPFv3邻居建立、DR选举、区域划分等机制与OSPFv2基本相同',
      'OSPFv3可与OSPFv2同时运行，互不影响'
    ],
    tips: 'OSPFv3重点掌握与OSPFv2的区别：基于链路、链路本地地址、LSA类型变化、认证方式'
  },
  {
    id: 'datacom-bgp4plus',
    name: 'BGP4+',
    direction: 'datacom',
    parentId: 'datacom-ipv6',
    level: 3,
    keyPoints: [
      'BGP4+是BGP-4的多协议扩展，支持IPv6等多种网络层协议',
      'BGP4+通过MP_REACH_NLRI和MP_UNREACH_NLRI属性携带IPv6路由',
      'BGP4+邻居建立可基于IPv4或IPv6地址，支持跨协议建立邻居',
      'BGP4+路由策略与BGP-4基本相同，但需注意地址族的区分',
      'BGP4+在IPv6网络中应用广泛，是运营商IPv6骨干网的核心协议',
      'BGP4+支持6PE（IPv6 over MPLS）和6VPE（IPv6 VPN over MPLS）'
    ],
    tips: 'BGP4+重点掌握多协议扩展属性，以及与BGP-4的区别，实际配置中需进入IPv6地址族视图'
  },

  // 网络服务与安全
  { id: 'datacom-service', name: '网络服务与安全', direction: 'datacom', parentId: 'datacom', level: 2, keyPoints: [], tips: '' },
  {
    id: 'datacom-acl',
    name: 'ACL访问控制列表',
    direction: 'datacom',
    parentId: 'datacom-service',
    level: 3,
    keyPoints: [
      'ACL是一系列规则的集合，用于匹配数据包并执行允许或拒绝动作',
      'ACL分类：基本ACL（2000-2999，仅匹配源IP）、高级ACL（3000-3999，匹配源/目的IP、协议、端口等）、二层ACL（4000-4999，匹配MAC等二层信息）、用户自定义ACL',
      'ACL规则匹配顺序：配置顺序（默认，按rule ID从小到大）、自动排序（按深度优先，精确匹配优先）',
      'ACL默认最后隐含deny any，所有未匹配的数据包都被拒绝',
      'ACL应用位置：接口入方向/出方向、路由策略、流策略、NAT等',
      '高级ACL可匹配：IP协议号、ICMP类型、TCP/UDP源目的端口、TCP标志位（SYN/ACK/FIN等）',
      'ACL通配符掩码：0表示匹配，1表示忽略，与子网掩码相反，如0.0.0.255表示匹配前24位',
      'ACL可用于流量过滤、路由过滤、NAT、QoS分类等多种场景',
      '时间ACL：基于时间段生效，可设置绝对时间或周期时间'
    ],
    tips: 'ACL是必考点，重点掌握基本/高级ACL区别、通配符掩码、默认隐含deny，display acl查看配置'
  },
  {
    id: 'datacom-nat',
    name: 'NAT网络地址转换',
    direction: 'datacom',
    parentId: 'datacom-service',
    level: 3,
    keyPoints: [
      'NAT将私有IP地址转换为公网IP地址，解决IPv4地址不足问题',
      'NAT类型：静态NAT（一对一固定映射）、动态NAT（地址池动态分配）、NAPT/PAT（端口多路复用，多对一）',
      'Easy IP：直接使用接口公网IP做NAPT，适合拨号上网场景',
      'NAT Server：服务器映射，将公网IP+端口映射到内网服务器，实现外网访问内网服务器',
      'NAT工作原理：转换源IP（出方向）或目的IP（入方向），维护NAT会话表',
      'NAT优点：节省公网IP、隐藏内网结构提高安全性、地址复用',
      'NAT缺点：破坏端到端模型、某些协议不支持（如FTP主动模式需ALG）、增加延迟、不支持端到端IPsec',
      'ALG应用层网关：处理应用层载荷中的IP地址，如FTP、SIP、DNS等',
      'NAT穿越：NAT后的主机建立P2P连接，如STUN/TURN/ICE技术',
      '两次NAT（NAT444）：运营商CGN场景，用户私网→运营商私网→公网'
    ],
    tips: 'NAT是高频考点，重点掌握NAPT/Easy IP/NAT Server配置和区别，注意NAT不改变源端口除非冲突'
  },
  {
    id: 'datacom-vrrp',
    name: 'VRRP',
    direction: 'datacom',
    parentId: 'datacom-service',
    level: 3,
    keyPoints: [
      'VRRP虚拟路由冗余协议，将多台路由器组成虚拟路由器，实现网关冗余',
      'VRRP组：一个虚拟路由器，有虚拟IP和虚拟MAC（00-00-5E-00-01-{VRID}）',
      'VRRP角色：Master（主路由器，转发流量）、Backup（备份路由器，监听Master状态）',
      'Master选举：比较优先级（默认100，范围1-254），值大者优先；相同则比较接口IP，大者优先',
      '优先级255表示虚拟IP地址拥有者，直接成为Master，不可抢占',
      'VRRP通告报文：Master周期性发送（默认1秒），组播地址224.0.0.18，协议号112',
      'Master_Down_Interval：Backup三个通告周期未收到报文则认为Master故障，切换为主',
      '抢占模式：默认开启，高优先级Backup发现Master优先级低时抢占成为Master',
      'VRRP跟踪接口/链路：Master上行接口故障时降低优先级，让Backup接管',
      'VRRP认证：无认证、明文认证、MD5认证（华为设备支持）',
      'VRRP负载分担：多个VRRP组，不同VLAN网关指向不同Master，实现流量分担',
      'VRRP与MSTP配合：确保VRRP Master与MSTP根桥位置一致，避免次优路径'
    ],
    tips: 'VRRP是必考点，重点掌握Master选举、抢占机制、跟踪接口、负载分担，display vrrp查看状态'
  },
  {
    id: 'datacom-dhcp',
    name: 'DHCP',
    direction: 'datacom',
    parentId: 'datacom-service',
    level: 3,
    keyPoints: [
      'DHCP动态主机配置协议，自动为客户端分配IP地址等网络参数',
      'DHCP工作过程：Discover（客户端广播发现）→Offer（服务器提供地址）→Request（客户端请求确认）→ACK（服务器确认）',
      'DHCP基于UDP，客户端端口68，服务器端口67',
      'DHCP地址分配方式：自动分配（永久租用）、动态分配（有租期，到期续租）、手动分配（管理员绑定MAC-IP）',
      'DHCP租期：默认通常1天，租期到50%时单播续租，87.5%时广播续租',
      'DHCP服务器类型：全局地址池、接口地址池（接口下配置dhcp select interface）',
      'DHCP中继（Relay）：客户端和服务器不在同一网段时，中继代理转发DHCP报文',
      'DHCP Snooping：交换机上防止非法DHCP服务器，信任端口连接合法服务器，非信任端口丢弃服务器报文',
      'DHCP Snooping绑定表：记录客户端IP-MAC-接口-VLAN映射，可用于DAI和IP Source Guard',
      'Option字段：DHCP报文中的可选字段，如Option3网关、Option6 DNS、Option43 AP发现AC地址、Option82中继代理信息'
    ],
    tips: 'DHCP重点掌握四步工作过程、中继、Snooping，Option43是WLAN中AP发现AC的常用方式'
  },

  // MPLS与VPN
  { id: 'datacom-mpls', name: 'MPLS与VPN', direction: 'datacom', parentId: 'datacom', level: 2, keyPoints: [], tips: '' },
  {
    id: 'datacom-mpls-basic',
    name: 'MPLS基础',
    direction: 'datacom',
    parentId: 'datacom-mpls',
    level: 3,
    keyPoints: [
      'MPLS多协议标签交换，在二层和三层之间增加标签交换层，基于标签转发',
      'MPLS标签：32位，包含Label(20b)+Exp(3b,QoS)+S(1b,栈底标识)+TTL(8b)',
      'MPLS标签空间：0-15保留（0显式空标签、1路由器告警标签、3隐式空标签），16及以上动态分配',
      'LER标签边缘路由器：MPLS网络边缘，负责压入/弹出标签（Ingress压入，Egress弹出）',
      'LSR标签交换路由器：MPLS网络内部，基于标签交换转发',
      'LSP标签交换路径：数据包在MPLS网络中经过的路径，单向，有入节点和出节点',
      'LDP标签分发协议：用于LSR之间分发标签，建立LSP，基于TCP 646端口',
      'LDP标签分发方式：下游自主分发（DU，默认）、下游按需分发（DoD）',
      'LDP标签控制方式：独立控制（收到路由立即分发标签）、有序控制（收到下游标签才分发）',
      'LDP标签保持方式：自由保持（保留所有邻居标签）、保守保持（只保留用得到的）',
      'PHP倒数第二跳弹出：Egress分配隐式空标签（3），倒数第二跳弹出标签后直接转发给Egress，减少Egress负担',
      'MPLS VPN：BGP/MPLS IP VPN，通过MPLS隧道实现VPN隔离，是运营商主流VPN技术'
    ],
    tips: 'MPLS重点掌握标签结构、LER/LSR角色、LDP、PHP机制，display mpls ldp session查看LDP邻居'
  },
  {
    id: 'datacom-mpls-vpn',
    name: 'MPLS VPN',
    direction: 'datacom',
    parentId: 'datacom-mpls',
    level: 3,
    keyPoints: [
      'BGP/MPLS IP VPN：基于MPLS隧道和BGP扩展的三层VPN技术，实现不同VPN站点间安全通信',
      'VPN角色：CE用户边缘路由器（客户侧）、PE运营商边缘路由器（运营商侧，连接CE）、P运营商核心路由器（仅MPLS转发）',
      'VRF VPN路由转发实例：PE上为每个VPN创建独立路由表，实现VPN隔离',
      'RD路由区分符：8字节，添加到IPv4前缀前形成VPN-IPv4地址，确保不同VPN相同地址不冲突',
      'RT路由目标：BGP扩展团体属性，控制VPN路由的导入导出，Export导出时标记，Import导入时匹配',
      'MPLS VPN数据转发：Ingress PE压入两层标签（外层公网标签到Egress PE，内层VPN标签标识VPN），P路由器交换外层标签，Egress PE弹出标签后转发给CE',
      'OSPF VPN：CE和PE间运行OSPF，需注意OSPF超级骨干区域、DN位防环、VPN路由标记',
      'MPLS VPN跨域：Option A（背靠背，VRF到VRF）、Option B（MP-EBGP，单标签）、Option C（多跳MP-EBGP，标签栈）',
      'Hub-Spoke VPN：中心辐射型，Spoke站点间通信必须经过Hub站点',
      '6VPE：IPv6 VPN over MPLS，在MPLS网络上承载IPv6 VPN'
    ],
    tips: 'MPLS VPN是难点，重点掌握RD/RT作用、VRF隔离、两层标签转发、CE-PE路由协议，display ip vpn-instance查看VPN实例'
  },
  {
    id: 'datacom-gre-l2tp',
    name: 'GRE与L2TP',
    direction: 'datacom',
    parentId: 'datacom-mpls',
    level: 3,
    keyPoints: [
      'GRE通用路由封装：在任意网络层协议上封装任意网络层协议，建立虚拟隧道，协议号47',
      'GRE优点：简单、支持多协议、可承载组播；缺点：无加密、无认证、开销大',
      'GRE隧道接口：Tunnel接口，配置源/目的地址和隧道模式，路由指向Tunnel接口',
      'GRE Keepalive：检测隧道对端可达性，默认关闭，可配置检测次数和间隔',
      'L2TP第二层隧道协议：结合Cisco L2F和Microsoft PPTP，用于远程接入VPN，UDP 1701端口',
      'L2TP角色：LAC L2TP访问集中器（用户侧，发起隧道）、LNS L2TP网络服务器（企业侧，终结隧道）',
      'L2TP隧道建立：LAC收到用户连接请求→与LNS建立控制连接→建立会话→数据封装传输',
      'L2TP认证：LAC可对用户进行PPP认证（PAP/CHAP），LNS也可进行二次认证',
      'L2TP over IPSec：L2TP本身无加密，通常与IPSec结合使用，提供安全的远程接入VPN',
      'L2TP多会话：一个L2TP隧道可承载多个会话，每个会话对应一个用户连接'
    ],
    tips: 'GRE和L2TP是VPN基础技术，重点掌握GRE隧道配置和L2TP LAC/LNS角色，注意L2TP本身不加密需结合IPSec'
  },

  // QoS
  { id: 'datacom-qos', name: 'QoS', direction: 'datacom', parentId: 'datacom', level: 2, keyPoints: [], tips: '' },
  {
    id: 'datacom-qos-basic',
    name: 'QoS基础',
    direction: 'datacom',
    parentId: 'datacom-qos',
    level: 3,
    keyPoints: [
      'QoS服务质量，在网络拥塞时为不同业务提供差异化服务，保障关键业务质量',
      'QoS服务模型：Best-Effort（尽力而为，默认）、IntServ（集成服务，RSVP信令预留资源）、DiffServ（区分服务，按类别差异化处理，主流）',
      'DiffServ模型：在网络边缘对流量分类标记，核心节点根据标记进行差异化转发',
      'QoS四大组件：分类与标记、拥塞避免、拥塞管理、流量监管与整形',
      '流量分类：基于ACL、MAC、IP优先级、DSCP、协议、端口等识别不同业务',
      '流量标记：将分类结果标记为IP优先级（IPP，3位，0-7）或DSCP（6位，0-63），或MPLS EXP',
      'DSCP分类：默认转发DF（0）、加速转发EF（46，低丢包低延迟）、确保转发AF（4类×3丢弃优先级=12种）、类选择器CS（8种，兼容IP优先级）',
      '拥塞避免：尾部丢弃（默认，可能导致TCP全局同步）、RED随机早期检测、WRED加权随机早期检测（基于优先级差异化丢弃）',
      '拥塞管理（队列调度）：FIFO先入先出、PQ优先队列（高优先级优先，可能饿死低优先级）、RR轮询、WRR加权轮询、WFQ加权公平队列、CBQ基于类别队列、PQ+WFQ组合',
      '流量监管CAR：限制流量速率，超出部分丢弃或重标记，令牌桶算法，用于入方向',
      '流量整形GTS：限制流量速率，超出部分缓存等待，令牌桶算法，用于出方向，可减少丢包但增加延迟',
      '令牌桶算法：单桶（CIR）、双桶（CIR+PIR），按速率生成令牌，数据包消耗令牌转发'
    ],
    tips: 'QoS重点掌握DSCP分类、WRED、队列调度算法、CAR/GTS区别，display qos policy查看QoS策略'
  },

  // ==================== 安全方向 ====================
  { id: 'security', name: '安全', direction: 'security', parentId: null, level: 1, keyPoints: [], tips: '' },

  { id: 'security-basic', name: '网络安全基础', direction: 'security', parentId: 'security', level: 2, keyPoints: [], tips: '' },
  {
    id: 'security-concept',
    name: '安全基本概念',
    direction: 'security',
    parentId: 'security-basic',
    level: 3,
    keyPoints: [
      '信息安全三要素CIA：机密性（Confidentiality，防泄露）、完整性（Integrity，防篡改）、可用性（Availability，防中断）',
      '安全防护体系：防火墙、入侵检测/防御、VPN、防病毒、内容过滤、身份认证、安全审计',
      '攻击类型：被动攻击（窃听、流量分析，不破坏数据）、主动攻击（篡改、伪造、重放、拒绝服务，破坏数据）',
      'DoS拒绝服务攻击：耗尽目标资源使其无法提供服务，如SYN Flood、UDP Flood、ICMP Flood、Land攻击',
      'DDoS分布式拒绝服务：大量肉鸡同时发起攻击，更难防御',
      '中间人攻击MITM：攻击者插入通信双方之间，窃听或篡改数据',
      '重放攻击：截获合法数据后重新发送，欺骗目标系统',
      '病毒：需要宿主程序，自我复制传播；蠕虫：独立程序，利用漏洞主动传播；木马：伪装成合法程序，窃取信息或远程控制',
      '安全域划分：将网络划分为不同安全域，域间通过防火墙控制，如Trust/Untrust/DMZ/Local',
      '纵深防御：多层安全防护，即使一层被突破仍有其他层保护',
      '最小权限原则：用户和程序只拥有完成工作所需的最小权限'
    ],
    tips: '安全基础概念是必考题，重点掌握CIA三要素、攻击类型分类、病毒/蠕虫/木马区别'
  },
  {
    id: 'security-crypto',
    name: '加解密技术',
    direction: 'security',
    parentId: 'security-basic',
    level: 3,
    keyPoints: [
      '对称加密：加密解密用同一密钥，速度快，适合大数据量，密钥分发困难',
      '对称加密算法：DES（56位，已不安全）、3DES（168位）、AES（128/192/256位，主流）、SM4（国密，128位）',
      '非对称加密：公钥加密私钥解密，或私钥签名公钥验证，速度慢，适合小数据量和密钥交换',
      '非对称加密算法：RSA（1024/2048/4096位）、DH（密钥交换）、ECC（椭圆曲线，更短密钥同等安全）、SM2（国密）',
      '哈希算法：单向不可逆，将任意长度数据映射为固定长度摘要，用于完整性校验',
      '哈希算法：MD5（128位，已不安全）、SHA-1（160位，已不安全）、SHA-2（256/384/512位，主流）、SM3（国密，256位）',
      '数字签名：发送方用私钥对哈希值加密，接收方用公钥验证，提供身份认证、完整性、不可否认性',
      '数字证书：由CA签发，包含公钥、持有者信息、CA签名等，证明公钥与身份的绑定关系',
      'PKI公钥基础设施：管理数字证书的体系，包括CA、RA、证书库、CRL/OCSP等',
      '密钥交换：DH算法、IKE（IPSec中使用）、TLS握手过程中的密钥协商',
      '国密算法：SM1/SM4对称、SM2非对称、SM3哈希、SM9标识密码，国内合规要求'
    ],
    tips: '加解密是安全基础，重点掌握对称/非对称区别、常见算法、哈希用途、数字签名原理'
  },

  { id: 'security-firewall', name: '防火墙技术', direction: 'security', parentId: 'security', level: 2, keyPoints: [], tips: '' },
  {
    id: 'security-firewall-basic',
    name: '防火墙基础',
    direction: 'security',
    parentId: 'security-firewall',
    level: 3,
    keyPoints: [
      '防火墙是位于不同安全域之间的访问控制设备，根据安全策略允许或拒绝流量',
      '防火墙技术发展：包过滤防火墙（ACL，基于五元组）→代理防火墙（应用层代理）→状态检测防火墙（基于会话状态，主流）→下一代防火墙NGFW（集成IPS/AV/应用识别等）',
      '华为防火墙默认安全区域：Local（优先级100，防火墙自身）、Trust（85，内网可信）、DMZ（50，服务器区）、Untrust（5，外网不可信）',
      '安全区域优先级：数值越大越可信，高优先级区域可默认访问低优先级区域（取决于策略），低到高默认拒绝',
      '防火墙转发流程：入接口安全区域检查→会话表查找→首包走安全策略匹配→策略允许则建立会话并转发→后续包直接匹配会话转发',
      '防火墙安全策略：基于源/目的安全区域、源/目的IP、用户、服务/应用、时间等匹配，执行允许/拒绝/日志等动作',
      '状态检测：防火墙维护会话表（五元组+状态），只检查首包，后续包直接匹配会话，提高效率',
      'ASPF应用层包过滤：检测应用层协议状态，如FTP动态端口、DNS响应等，防止应用层攻击',
      '防火墙工作模式：路由模式（三层，接口有IP）、透明模式（二层，接口无IP，像交换机）、混合模式（同时有三层和二层接口）',
      '虚拟系统VSYS：将一台物理防火墙划分为多个逻辑防火墙，独立配置安全策略和路由，提高资源利用率',
      '双机热备：主备模式（主设备转发，备设备 standby）、负载分担模式（两台同时转发，互为主备），通过VGMP管理',
      'HRP双机热备协议：华为私有，用于主备设备间会话表、配置等信息同步'
    ],
    tips: '防火墙是安全方向最高频考点，重点掌握安全区域、安全策略、状态检测、双机热备，display firewall session table查看会话'
  },
  {
    id: 'security-nat',
    name: '防火墙NAT',
    direction: 'security',
    parentId: 'security-firewall',
    level: 3,
    keyPoints: [
      '防火墙NAT功能比路由器更丰富，支持源NAT、目的NAT、双向NAT、NAT Server等',
      '源NAT：转换源IP地址，用于内网用户访问外网，包括No-PAT（一对一，不转换端口）和PAT（多对一，转换端口）',
      '源NAT地址池模式：动态地址池（从地址池分配）、Easy-IP（直接用出接口IP）',
      '目的NAT：转换目的IP地址，用于外网用户访问内网服务器，即NAT Server',
      'NAT Server：配置公网IP+端口映射到内网服务器IP+端口，支持一对一、多对一、端口映射',
      '双向NAT：同时转换源IP和目的IP，用于特定场景如VPN间互访',
      '防火墙NAT与安全策略配合：NAT不替代安全策略，流量仍需匹配安全策略允许',
      'NAT ALG：处理应用层协议中的IP地址和端口信息，如FTP、SIP、RTSP、DNS等',
      'NAT会话表：防火墙维护NAT转换映射关系，确保双向流量正确转换',
      'NAT No-PAT：不转换端口，一个公网IP同时只能被一个内网用户使用，需要地址池有足够地址'
    ],
    tips: '防火墙NAT重点掌握源NAT（PAT/No-PAT/Easy-IP）和NAT Server区别，注意NAT和安全策略的配合顺序'
  },
  {
    id: 'security-attack-defense',
    name: '攻击与防御',
    direction: 'security',
    parentId: 'security-firewall',
    level: 3,
    keyPoints: [
      '单包攻击：单个数据包即可构成攻击，如IP欺骗、Land攻击、Smurf攻击、Fraggle攻击、Ping of Death、Teardrop、扫描攻击',
      'Land攻击：源IP和目的IP都是目标IP，源端口和目的端口相同，导致目标主机自我连接耗尽资源',
      'Smurf攻击：发送源IP为目标、目的为广播地址的ICMP请求，大量主机回复导致目标拥塞',
      'Ping of Death：发送超过65535字节的ICMP数据包，导致目标系统崩溃（现代系统已修复）',
      'Teardrop：发送分片偏移重叠的IP分片，导致目标系统重组时崩溃',
      '扫描攻击：端口扫描（TCP SYN扫描、FIN扫描、NULL扫描、XMAS扫描）、IP扫描（ICMP Sweep）',
      '泛洪攻击：大量数据包耗尽目标资源，如SYN Flood、UDP Flood、ICMP Flood、HTTP Flood、DNS Flood',
      'SYN Flood：大量伪造源IP的SYN包，目标回复SYN-ACK后等待ACK，半连接队列耗尽',
      'SYN Flood防御：SYN Cookie（不建立半连接，用Cookie验证）、SYN Proxy（防火墙代理三次握手）、限制速率',
      'UDP Flood：大量UDP包耗尽带宽和处理能力，防御：限流、黑名单、应用层检测',
      'ICMP Flood：大量ICMP包，防御：限制ICMP速率、禁用ICMP响应',
      '应用层攻击：HTTP Flood（CC攻击）、DNS Query Flood、Slowloris（慢速HTTP头攻击）',
      '扫描攻击防御：阈值检测，超过阈值则告警或阻断',
      '防火墙攻击防范功能：单包攻击防御、泛洪攻击防御、扫描攻击防御，可基于全局或接口配置'
    ],
    tips: '攻击防御是高频考点，重点掌握各种攻击原理（Land/Smurf/SYN Flood等）和对应防御机制，display firewall attack-packet查看攻击统计'
  },

  { id: 'security-vpn', name: 'VPN技术', direction: 'security', parentId: 'security', level: 2, keyPoints: [], tips: '' },
  {
    id: 'security-ipsec',
    name: 'IPSec VPN',
    direction: 'security',
    parentId: 'security-vpn',
    level: 3,
    keyPoints: [
      'IPSec IP安全协议，在IP层提供加密、认证、完整性保护，是站点到站点VPN的主流技术',
      'IPSec安全协议：AH认证头（协议号51，仅认证完整性，不加密，已少用）、ESP封装安全载荷（协议号50，加密+认证，主流）',
      'IPSec工作模式：传输模式（保护传输层，原IP头不变，用于主机到主机）、隧道模式（保护整个IP包，新增外部IP头，用于网关到网关，VPN常用）',
      'IPSec安全联盟SA：单向逻辑连接，定义加密算法、认证算法、密钥等，双向通信需要两个SA（入和出）',
      'IKE互联网密钥交换：用于自动协商SA和密钥，基于UDP 500端口，NAT-T时用UDP 4500',
      'IKE版本：IKEv1（主模式/野蛮模式，阶段一建立IKE SA，阶段二建立IPSec SA）、IKEv2（更简单安全，支持MOBIKE移动性）',
      'IKEv1阶段一：主模式（6条消息，保护身份信息）、野蛮模式（3条消息，不保护身份，用于动态IP场景）',
      'IKEv1阶段二：快速模式（3条消息，协商IPSec SA参数，可建立多个SA）',
      'IKE协商参数：加密算法（DES/3DES/AES/SM4）、认证算法（MD5/SHA1/SHA2/SM3）、认证方式（预共享密钥/数字证书）、DH组（1/2/5/14/19等）、生命周期',
      'IPSec配置方式：策略模板（Template，对端动态IP时用）、策略（Policy，静态IP）、框架（Profile，更灵活）',
      'NAT穿越NAT-T：IPSec流量经过NAT设备时，将ESP封装在UDP 4500报文中，解决NAT无法转发ESP的问题',
      'DPD死端检测：检测对端是否存活，超时未响应则删除SA重新协商',
      'IPSec安全策略：定义感兴趣流（ACL匹配需要保护的流量），匹配的流量进入IPSec处理',
      'OSPF over IPSec：在IPSec隧道上运行OSPF，实现动态路由，需注意隧道接口和MTU问题'
    ],
    tips: 'IPSec是安全方向最高频考点，重点掌握AH/ESP区别、传输/隧道模式、IKEv1两阶段、NAT-T，display ike sa查看IKE SA，display ipsec sa查看IPSec SA'
  },
  {
    id: 'security-ssl-vpn',
    name: 'SSL VPN',
    direction: 'security',
    parentId: 'security-vpn',
    level: 3,
    keyPoints: [
      'SSL VPN基于SSL/TLS协议，在应用层建立安全隧道，主要用于远程用户接入企业内网',
      'SSL VPN优势：无需安装客户端（Web浏览器即可）、穿越NAT和防火墙方便（基于HTTPS 443端口）、细粒度访问控制、支持终端安全检查',
      'SSL VPN接入方式：Web代理（浏览器访问Web资源）、文件共享（访问CIFS/FTP文件）、端口转发（访问TCP应用）、网络扩展（全网络访问，需安装客户端，类似IPSec）',
      'SSL VPN认证方式：用户名密码、数字证书、动态口令（短信/令牌）、双因素认证、LDAP/RADIUS/AD认证',
      'SSL VPN工作流程：用户浏览器访问SSL VPN网关→SSL/TLS握手建立安全通道→用户认证→根据权限访问授权资源',
      'SSL VPN与IPSec VPN对比：IPSec适合站点到站点（网对网），性能好，需客户端；SSL VPN适合远程接入（人对网），易用，Web化，性能略低',
      'SSL VPN安全功能：缓存清理（退出后清除浏览器缓存）、虚拟键盘（防键盘记录）、终端安全检查（操作系统/补丁/杀毒软件检查）、单点登录SSO',
      'TLS握手过程：客户端Hello→服务器Hello+证书→密钥交换→证书验证→Finished，协商加密套件和会话密钥',
      'SSL VPN角色：普通用户（访问授权资源）、管理员（配置管理）、访客（临时有限访问）',
      'SSL VPN资源分类：Web资源、TCP资源、IP资源、文件资源，可按用户/用户组分配权限'
    ],
    tips: 'SSL VPN重点掌握与IPSec的区别、接入方式、认证方式、适用场景，注意SSL VPN默认443端口可穿越防火墙'
  },

  { id: 'security-ips', name: '入侵防御与内容安全', direction: 'security', parentId: 'security', level: 2, keyPoints: [], tips: '' },
  {
    id: 'security-ips-ids',
    name: 'IDS/IPS',
    direction: 'security',
    parentId: 'security-ips',
    level: 3,
    keyPoints: [
      'IDS入侵检测系统：被动监听网络流量，发现攻击行为后告警，不阻断流量，通常旁路部署',
      'IPS入侵防御系统：串接在网络中，实时检测并主动阻断攻击行为，是IDS的升级',
      'IDS/IPS检测技术：特征匹配（基于已知攻击特征签名，准确率高，无法检测未知攻击）、异常检测（基于行为基线，偏离则告警，可检测未知攻击，误报率高）、协议分析（解析应用层协议，发现协议异常）',
      'IPS部署方式：在线模式（串接，阻断攻击）、旁路模式（镜像流量，仅检测告警）、混合模式',
      'IPS签名类型：漏洞签名（针对特定漏洞攻击）、病毒签名（针对恶意代码）、间谍软件签名（针对间谍软件）、应用签名（识别应用）',
      'IPS响应动作：告警（记录日志）、阻断（丢弃数据包/重置连接）、限流（降低速率）、隔离（隔离攻击源）',
      'IPS误报与漏报：误报（正常流量被判定为攻击）、漏报（攻击未被检测到），需平衡两者，定期更新特征库',
      'DDoS防护：专门针对分布式拒绝服务攻击的防护设备，通过流量清洗、行为分析、黑名单等方式防御',
      'WAF Web应用防火墙：专门防护Web应用攻击，如SQL注入、XSS跨站脚本、CSRF跨站请求伪造、文件上传漏洞等',
      '华为防火墙IPS功能：内置入侵防御特征库，可配置IPS策略，基于安全策略调用，支持在线升级特征库'
    ],
    tips: 'IDS/IPS重点掌握IDS与IPS区别、检测技术、响应动作，注意IPS是串接在线阻断，IDS是旁路检测告警'
  },
  {
    id: 'security-antivirus',
    name: '反病毒与内容过滤',
    direction: 'security',
    parentId: 'security-ips',
    level: 3,
    keyPoints: [
      '反病毒AV：检测和清除文件中的病毒、木马、蠕虫等恶意代码，部署在网关或终端',
      '反病毒检测技术：特征码检测（基于已知病毒特征，主流）、启发式检测（基于行为特征，可检测未知病毒）、云查杀（云端特征库，减轻本地负担）、虚拟机检测（在沙箱中运行观察行为）',
      '反病毒处理流程：流量检测→文件还原→病毒扫描→处理（阻断/告警/删除/隔离）→日志记录',
      '反病毒部署位置：网关防病毒（网络入口，防护全网）、服务器防病毒（保护服务器）、终端防病毒（保护PC/移动设备）',
      '内容过滤：对网络传输内容进行过滤控制，包括URL过滤、应用过滤、文件过滤、关键字过滤、邮件过滤等',
      'URL过滤：控制用户可访问的网站，基于URL分类库（如赌博、暴力、社交等）或自定义黑白名单',
      '应用识别与控制：识别网络中的应用（如微信、QQ、迅雷、BT等），基于应用进行允许/拒绝/限流',
      '文件过滤：控制可传输的文件类型（如exe、bat、mp3等），防止恶意文件或非工作文件传输',
      '关键字过滤：检测传输内容中的敏感关键字，进行阻断或告警，用于数据防泄漏',
      '数据防泄漏DLP：监控和防止敏感数据外泄，可识别数据内容（如身份证号、银行卡号、机密文档指纹），在传输通道进行控制',
      '网页过滤：对Web浏览内容进行过滤，包括URL过滤、内容过滤、脚本过滤（阻止恶意脚本）、HTTPS解密（需导入证书才能过滤HTTPS内容）',
      '邮件安全：反垃圾邮件（基于发件人、内容、附件特征识别垃圾邮件）、反钓鱼邮件、邮件加密、邮件归档'
    ],
    tips: '反病毒和内容过滤是NGFW的重要功能，重点掌握检测技术、URL过滤、应用识别、DLP概念'
  },

  { id: 'security-auth', name: '身份认证与准入', direction: 'security', parentId: 'security', level: 2, keyPoints: [], tips: '' },
  {
    id: 'security-8021x',
    name: '802.1X认证',
    direction: 'security',
    parentId: 'security-auth',
    level: 3,
    keyPoints: [
      '802.1X是基于端口的网络接入控制协议，在用户接入网络前进行身份认证，防止非法接入',
      '802.1X体系结构：客户端（Supplicant，用户终端）、认证设备（Authenticator，交换机/AP）、认证服务器（Authentication Server，RADIUS服务器）',
      '802.1X基于EAP可扩展认证协议，EAPoL（EAP over LAN）在客户端和认证设备间传输，EAP over RADIUS在认证设备和服务器间传输',
      '802.1X认证方式：EAP-MD5（仅认证客户端，不安全）、PEAP（受保护EAP，先建立TLS隧道再认证，主流）、EAP-TLS（双向证书认证，最安全）、EAP-TTLS（隧道传输认证）',
      '802.1X端口控制模式：自动模式（自动发起认证）、强制授权模式（不认证直接允许）、强制非授权模式（始终拒绝）',
      '802.1X认证流程：客户端发起EAPoL-Start→认证设备请求身份→客户端回复身份→认证设备转发给RADIUS服务器→服务器挑战→客户端响应→服务器验证通过→认证设备开放端口',
      'MAC认证：基于MAC地址的认证，无需客户端软件，适合打印机、IP电话等无法安装802.1X客户端的设备',
      'Portal认证：Web页面认证，用户访问网络时重定向到认证页面，输入用户名密码，适合访客接入',
      '三种认证对比：802.1X（安全性高，需客户端，适合企业员工）、MAC认证（无需客户端，适合哑终端）、Portal认证（Web化，适合访客，安全性较低）',
      'RADIUS协议：远程认证拨号用户服务，基于UDP 1812（认证）/1813（计费）端口，集中管理用户认证和计费',
      'RADIUS认证流程：客户端→NAS→RADIUS服务器→Access-Accept/Reject→NAS开放/拒绝端口',
      '准入控制NAC：网络准入控制，综合802.1X、MAC、Portal等认证方式，结合终端安全检查（补丁/杀毒/防火墙状态），确保只有合规终端才能接入网络'
    ],
    tips: '802.1X是高频考点，重点掌握三元素、EAP认证方式、与MAC/Portal认证对比，display dot1x查看802.1X状态'
  },

  // ==================== WLAN方向 ====================
  { id: 'wlan', name: 'WLAN', direction: 'wlan', parentId: null, level: 1, keyPoints: [], tips: '' },

  { id: 'wlan-basic', name: 'WLAN基础', direction: 'wlan', parentId: 'wlan', level: 2, keyPoints: [], tips: '' },
  {
    id: 'wlan-standard',
    name: 'WLAN标准与射频',
    direction: 'wlan',
    parentId: 'wlan-basic',
    level: 3,
    keyPoints: [
      'WLAN无线局域网，基于IEEE 802.11标准，通过无线射频提供网络接入',
      '802.11标准演进：802.11（1997，2Mbps）→802.11b（2.4G，11Mbps）→802.11a（5G，54Mbps）→802.11g（2.4G，54Mbps）→802.11n（Wi-Fi 4，2.4/5G，600Mbps，MIMO）→802.11ac（Wi-Fi 5，5G，1Gbps+，MU-MIMO下行）→802.11ax（Wi-Fi 6，2.4/5G，9.6Gbps，OFDMA，MU-MIMO上下行）',
      'Wi-Fi 6（802.11ax）关键技术：OFDMA正交频分多址（子载波分配给多用户，提高效率）、MU-MIMO上下行、1024-QAM高阶调制、BSS着色（减少同频干扰）、目标唤醒时间TWT（终端节能）',
      '2.4GHz频段：频率低，穿透能力强，覆盖范围大，干扰多（蓝牙、微波炉、邻居WiFi），信道少（中国1-13，非重叠只有1/6/11三个）',
      '5GHz频段：频率高，穿透能力弱，覆盖范围小，干扰少，信道多（36/40/44/48/52/56/60/64/149/153/157/161等），带宽大（支持20/40/80/160MHz）',
      '信道带宽：20MHz（基础）、40MHz（绑定两个20MHz）、80MHz（5G）、160MHz（5G，Wi-Fi 5/6），带宽越大速率越高但干扰越大',
      '中国5GHz信道：36-64（室内，需DFS雷达检测）、149-165（室内，无需DFS），部分国家支持更多信道',
      'DFS动态频率选择：5GHz部分信道与雷达系统共用，AP检测到雷达信号后必须切换信道，避免干扰雷达',
      '发射功率：中国规定2.4GHz最大100mW(20dBm)，5GHz室内最大100mW(20dBm)，室外可更高，实际部署需根据覆盖需求调整',
      '自由空间损耗：信号随距离增加而衰减，2.4G损耗小于5G，距离越远速率越低（速率自适应）',
      'MIMO多输入多输出：多根天线同时收发，提高速率和可靠性，空间复用（SM）提高吞吐量，发射分集（SD）提高可靠性',
      '波束成形Beamforming：将信号能量集中指向接收端，提高信号质量和覆盖范围，802.11ac支持显式波束成形'
    ],
    tips: 'WLAN射频是基础考点，重点掌握2.4G/5G区别、信道规划、Wi-Fi 6新技术、DFS，注意中国信道规定'
  },
  {
    id: 'wlan-arch',
    name: 'WLAN架构',
    direction: 'wlan',
    parentId: 'wlan-basic',
    level: 3,
    keyPoints: [
      'FAT AP（胖AP）：独立工作，自主完成射频管理、用户接入、数据转发，配置在每台AP上，适合小型网络',
      'FAT AP优点：结构简单，无需AC，成本低；缺点：管理困难（每台单独配置），漫游差，无法集中管理，不适合大规模部署',
      'FIT AP（瘦AP）：由AC统一管理和控制，AP只负责射频接入和数据加密转发，配置由AC统一下发，适合中大型网络',
      'FIT AP优点：集中管理配置、统一射频优化、快速漫游、安全策略统一、易于扩展；缺点：需AC设备，成本较高，AC故障影响全网（可双AC备份）',
      'AC接入控制器：集中管理AP，负责AP上线、配置下发、用户认证、漫游管理、射频优化、安全策略等',
      'AC+FIT AP组网架构：AP通过CAPWAP隧道与AC通信，控制报文和数据报文均可通过隧道转发',
      'CAPWAP协议：控制和配置无线接入点协议，基于UDP 5246（控制）/5247（数据）端口，用于AC和AP间通信',
      'CAPWAP隧道：控制隧道（传输控制报文，如配置、状态）、数据隧道（传输用户数据，可选，直接转发模式不使用数据隧道）',
      '数据转发模式：直接转发（本地转发，AP直接转发用户数据，不经过AC，性能好，主流）、隧道转发（集中转发，用户数据通过CAPWAP数据隧道到AC转发，便于集中控制，性能较差）',
      'AC组网方式：二层组网（AC和AP在同一二层网络，AP直接发现AC）、三层组网（AC和AP跨三层，AP通过DHCP Option43或DNS发现AC）',
      'AC旁挂组网：AC旁挂在核心交换机上，不串接在数据路径中，仅做管理控制，用户数据直接转发，不影响网络拓扑',
      'AC直连组网：AC串接在网络中，用户数据经过AC转发，可实现更严格的安全控制，但AC成为性能瓶颈',
      'AP上线流程：AP获取IP地址（DHCP/静态）→AP发现AC（广播/DHCP Option43/DNS/静态配置）→AP与AC建立CAPWAP隧道→AP下载软件版本和配置→AP正常工作提供无线接入',
      'AP发现AC方式：广播方式（同二层网络）、DHCP Option43方式（携带AC IP地址，跨三层常用）、DNS方式（通过域名解析AC地址）、静态配置方式（AP上手动配置AC IP）'
    ],
    tips: 'WLAN架构是核心考点，重点掌握FAT/FIT AP区别、CAPWAP隧道、数据转发模式、AP发现AC方式、AP上线流程'
  },

  { id: 'wlan-service', name: 'WLAN服务与安全', direction: 'wlan', parentId: 'wlan', level: 2, keyPoints: [], tips: '' },
  {
    id: 'wlan-vap',
    name: 'VAP与SSID',
    direction: 'wlan',
    parentId: 'wlan-service',
    level: 3,
    keyPoints: [
      'SSID服务集标识：无线网络的名称，用户通过SSID识别和连接无线网络，最多32个字符，区分大小写',
      'BSS基本服务集：一个AP覆盖的区域，BSSID是AP的MAC地址',
      'ESS扩展服务集：多个AP使用相同SSID组成的无线网络，实现大范围覆盖和漫游',
      'VAP虚拟AP：一个物理AP可创建多个虚拟AP，每个VAP有独立的SSID、安全策略、VLAN等，实现多业务隔离',
      'VAP模板：在AC上配置VAP模板，包含SSID、安全策略、转发模式、服务VLAN等，应用到AP组或特定AP',
      'AP组：将配置相同的AP加入一个AP组，统一应用配置模板，简化管理',
      'SSID隐藏：AP不广播SSID，用户需手动输入SSID才能连接，提高安全性但降低易用性',
      'SSID隔离：不同SSID的用户之间隔离，实现业务隔离，如员工SSID和访客SSID隔离',
      '用户隔离：同一SSID下用户之间隔离，防止用户间互访攻击，适用于公共WiFi场景',
      '最大用户数限制：限制单个AP或VAP的最大接入用户数，防止AP过载，保证已接入用户体验',
      '射频模板：配置射频参数（信道、功率、带宽、国家码等），分为2.4G和5G射频模板，应用到AP',
      'RRM射频资源管理：AC自动调整AP的信道和功率，避免同频干扰，优化覆盖，包括动态信道调整DCA和动态功率调整TPC'
    ],
    tips: 'VAP/SSID是WLAN配置基础，重点掌握VAP概念、模板配置、SSID隐藏/隔离、AP组管理，display vap查看VAP状态'
  },
  {
    id: 'wlan-security',
    name: 'WLAN安全',
    direction: 'wlan',
    parentId: 'wlan-service',
    level: 3,
    keyPoints: [
      'WLAN安全威胁：非法AP（钓鱼AP）、非法用户接入、数据窃听、重放攻击、拒绝服务攻击、中间人攻击',
      'WEP有线等效保密：最早的WLAN加密，使用RC4算法，静态密钥，存在严重安全漏洞（IV重用、密钥恢复攻击），已被破解，不推荐使用',
      'WPA Wi-Fi保护访问：过渡方案，使用TKIP临时密钥完整性协议，动态密钥，MIC消息完整性校验，比WEP安全但仍有漏洞',
      'WPA2：基于802.11i标准，使用CCMP（基于AES的加密模式），更安全，是长期主流标准',
      'WPA3：最新标准，使用SAE同时认证对等体（替代PSK，防离线字典攻击）、192位安全套件、前向保密、管理帧保护，更安全',
      'WPA/WPA2个人版（PSK）：预共享密钥，所有用户使用同一密码，适合家庭和小型办公，密码泄露则全网不安全',
      'WPA/WPA2企业版（802.1X）：基于RADIUS服务器的用户认证，每个用户独立账号密码，适合企业，安全性更高',
      '开放认证：不加密不认证，任何人可连接，适合公共WiFi，通常配合Portal认证使用',
      'MAC认证：基于终端MAC地址的白名单认证，无需密码，适合固定终端，但MAC可伪造，安全性低',
      'Portal认证：Web页面认证，用户连接后重定向到认证页面输入账号密码，适合访客和公共WiFi，配合开放SSID使用',
      'WAPI：中国无线局域网安全标准，使用SMS4加密（现SM4）和证书认证，国内合规要求',
      '管理帧保护PMF：802.11w标准，保护管理帧（如解除认证帧），防止欺骗解除攻击，WPA3强制要求',
      '非法AP检测：AC通过AP的空口扫描检测非法AP，基于MAC、SSID、厂商等识别，可告警或反制',
      'WIDS/WIPS：无线入侵检测/防御系统，检测无线攻击（非法AP、非法客户端、Ad-hoc网络、泛洪攻击等），可进行反制'
    ],
    tips: 'WLAN安全是高频考点，重点掌握WEP/WPA/WPA2/WPA3区别、PSK/802.1X/Portal认证方式、PMF、非法AP检测'
  },
  {
    id: 'wlan-roaming',
    name: 'WLAN漫游',
    direction: 'wlan',
    parentId: 'wlan-service',
    level: 3,
    keyPoints: [
      '漫游：用户在同一ESS内从一个AP覆盖区域移动到另一个AP覆盖区域时，无线网络连接不中断',
      '漫游前提：相同SSID、相同安全策略、AC内或AC间漫游、AP覆盖区域有重叠（建议15-20%重叠）',
      '二层漫游：漫游前后用户在同一VLAN/子网，IP地址不变，业务不中断，实现简单',
      '三层漫游：漫游前后用户在不同VLAN/子网，需要特殊技术保持业务不中断，如隧道转发、Home Agent',
      'AC内漫游：用户在同一AC管理的AP间漫游，AC统一管理，漫游速度快',
      'AC间漫游：用户在不同AC管理的AP间漫游，需AC间同步用户信息和密钥，漫游速度较慢，需配置漫游组',
      '漫游触发：基于信号强度（RSSI低于阈值）、基于负载（AP负载过高）、基于误码率、基于用户主动扫描',
      '快速漫游：802.11r标准，通过FT快速BSS切换，减少漫游时认证时间，预认证和密钥缓存，实现毫秒级漫游',
      '802.11r FT：快速转换，在漫游前与目标AP预认证，漫游时直接关联，减少延迟，适合语音等实时业务',
      '密钥缓存：用户漫游回之前关联过的AP时，使用缓存的PMKID，无需重新完整认证，加快漫游',
      '漫游决策：终端主导（终端扫描并决定漫游，大多数情况）、AC主导（AC根据全局信息指导终端漫游，如802.11v BSS过渡管理）',
      '802.11k：无线资源测量，AP向终端提供邻居AP信息（信道、负载等），帮助终端更快扫描和选择漫游目标',
      '802.11v：无线网络管理，BSS过渡管理，AC可建议终端漫游到更优AP，实现负载均衡和优化覆盖',
      '漫游注意事项：确保AP覆盖有足够重叠、信道规划合理避免同频干扰、相同SSID和安全策略、实时业务（语音/视频）需快速漫游支持'
    ],
    tips: '漫游是WLAN重点，重点掌握二/三层漫游区别、AC内/间漫游、802.11k/v/r快速漫游、漫游触发条件'
  },

  { id: 'wlan-qos',
    name: 'WLAN QoS',
    direction: 'wlan',
    parentId: 'wlan-service',
    level: 3,
    keyPoints: [
      'WLAN QoS：为不同无线业务提供差异化服务质量，保障语音、视频等实时业务',
      'WMM Wi-Fi多媒体：802.11e标准的子集，基于用户优先级（UP）将流量分为4类接入类别（AC），是WLAN QoS的基础',
      'WMM接入类别：AC_VO（语音，最高优先级）、AC_VI（视频，次高）、AC_BE（尽力而为，默认）、AC_BK（背景，最低）',
      'WMM队列调度：每个AC有独立队列，高优先级AC优先获得信道访问权，通过ECWmin/ECWmax和AIFS参数差异化',
      'WMM参数：AIFS仲裁帧间间隔（越大等待越久，优先级越低）、ECW最小/最大竞争窗口（越大冲突概率越高，优先级越低）、TXOP传输机会（高优先级可连续发送多个帧）',
      '用户优先级UP：0(BE)、1(BK)、2(保留)、3(EE)、4(CL)、5(VI)、6(VO)、7(NC)，映射到WMM的4个AC',
      'WMM准入控制：语音/视频业务可请求带宽准入，AP根据资源情况决定是否允许，保障已接入实时业务质量',
      'SVP语音优先： SpectraLink语音优先级，为语音业务提供更高优先级',
      '组播转单播：将组播报文转为单播发送给每个用户，提高组播传输可靠性，适用于视频组播场景',
      '空口调度：AP根据用户优先级、业务类型、用户负载等进行空口时间调度，公平分配无线资源',
      '用户限速：基于用户或SSID限制上下行速率，防止个别用户占用过多带宽，保障公平性',
      '流量整形：对突发流量进行整形，平滑输出，减少拥塞',
      'WLAN与有线QoS映射：无线侧UP优先级与有线侧802.1p/DSCP优先级映射，实现端到端QoS'
    ],
    tips: 'WLAN QoS重点掌握WMM 4个接入类别及优先级、AIFS/ECW参数、用户限速、组播转单播，注意语音业务最高优先级'
  },

  // ==================== DCN方向 ====================
  { id: 'dcn', name: 'DCN', direction: 'dcn', parentId: null, level: 1, keyPoints: [], tips: '' },

  { id: 'dcn-basic', name: '数据中心网络基础', direction: 'dcn', parentId: 'dcn', level: 2, keyPoints: [], tips: '' },
  {
    id: 'dcn-arch',
    name: '数据中心网络架构',
    direction: 'dcn',
    parentId: 'dcn-basic',
    level: 3,
    keyPoints: [
      '数据中心网络特点：高带宽、低延迟、大二层、多租户、高可靠、可扩展、虚拟化感知',
      '传统三层架构：核心层（Core）+汇聚层（Aggregation）+接入层（Access），适合传统园区网，数据中心东西向流量大时存在瓶颈',
      'Spine-Leaf架构（叶脊架构）：数据中心主流架构，Spine（脊节点，核心交换）+Leaf（叶节点，接入服务器），每个Leaf连接所有Spine，无阻塞，水平扩展',
      'Spine-Leaf优势：东西向流量只需经过两跳（Leaf→Spine→Leaf），延迟低且可预测；无阻塞带宽；水平扩展只需增加Spine或Leaf；ECMP多路径负载分担',
      'Clos架构：多级交换架构，严格无阻塞，Spine-Leaf是三级Clos的简化，大规模数据中心可采用多级Clos',
      '大二层网络：数据中心需要虚拟机在任意位置迁移且IP不变，要求大二层域，传统STP无法满足，需用TRILL/SPB/VXLAN等技术',
      '数据中心交换机：高密端口（48/96端口）、高带宽（10G/25G/40G/100G/400G）、大缓存、支持VXLAN/EVPN/SDN、支持堆叠/集群',
      '服务器接入：机架顶接入ToR（Top of Rack，每机架顶部放交换机）、列末接入EoR（End of Row，每列末端集中接入）、中列接入MoR',
      '网络虚拟化：将物理网络虚拟为多个逻辑网络，实现多租户隔离，如VLAN、VRF、VXLAN',
      '存储网络：FC SAN（光纤通道存储区域网络）、FCoE（以太网光纤通道，在以太网上承载FC）、NAS（网络附加存储，NFS/CIFS）、iSCSI（IP SCSI，在IP上承载SCSI）',
      '数据中心互联DCI：不同数据中心之间互联，实现跨数据中心大二层、灾备、流量调度，常用VXLAN/EVPN、OTN、DWDM'
    ],
    tips: 'DCN架构重点掌握Spine-Leaf架构特点、大二层需求、Clos架构、ToR/EoR接入，注意数据中心东西向流量为主'
  },
  {
    id: 'dcn-vxlan',
    name: 'VXLAN',
    direction: 'dcn',
    parentId: 'dcn',
    level: 2,
    keyPoints: [],
    tips: ''
  },
  {
    id: 'dcn-vxlan-basic',
    name: 'VXLAN基础',
    direction: 'dcn',
    parentId: 'dcn-vxlan',
    level: 3,
    keyPoints: [
      'VXLAN虚拟可扩展局域网，MAC-in-UDP封装技术，在三层IP网络上构建大二层虚拟网络，解决VLAN数量不足和大二层扩展问题',
      'VXLAN优势：VNI 24位支持约1600万个网段（远多于VLAN的4094）、基于三层网络构建大二层（不受STP限制，可利用ECMP多路径）、支持虚拟机迁移IP不变、网络虚拟化多租户隔离',
      'VXLAN封装格式：外层以太网头（14B）+外层IP头（20B）+外层UDP头（8B，目的端口4789）+VXLAN头（8B）+原始以太网帧（14B+载荷+FCS），封装开销约50字节',
      'VXLAN头8字节：Flags(1B，I位设为1表示有效VNI)+Reserved(3B)+VNI(3B，24位网络标识符)+Reserved(1B)',
      'VNI VXLAN网络标识符：24位，标识一个VXLAN网段，类似VLAN ID，不同VNI之间二层隔离',
      'VTEP VXLAN隧道端点：负责VXLAN封装和解封装的设备（通常是数据中心交换机或vSwitch），有IP地址，建立VXLAN隧道',
      'VNI与VLAN映射：在VTEP上配置VNI与本地VLAN的映射，接入侧VLAN流量封装为VXLAN报文转发到对端VTEP，解封装后恢复VLAN',
      'VXLAN数据转发：同子网（同VNI）：源VTEP学习远端MAC对应的VTEP IP，封装VXLAN报文单播发送；未知单播/广播/组播：通过头端复制（Head End Replication，VTEP复制多份发给所有VTEP）或组播（underlay组播）发送',
      '头端复制：VTEP将广播/未知单播报文复制多份，分别单播发送给所有属于同一VNI的VTEP，简单但VTEP数量多时复制开销大',
      'VXLAN网关：不同VNI之间或VXLAN与非VXLAN之间的三层通信设备，分为二层网关（同VNI二层转发）和三层网关（跨VNI/子网三层转发）',
      '集中式网关：所有三层流量集中到网关设备转发，配置简单但网关可能成为性能瓶颈和单点故障',
      '分布式网关：每个Leaf都是三层网关，本地流量本地转发，东西向流量只需两跳，性能好，是主流方案，需EVPN控制面支持',
      'VXLAN接入方式：二层接入（VLAN到VXLAN映射，服务器在VLAN）、三层接入（服务器网关在VTEP，分布式网关）',
      'VXLAN over IP：underlay是三层IP网络，运行OSPF/IS-IS/BGP等路由协议，提供ECMP多路径负载分担和高可靠'
    ],
    tips: 'VXLAN是DCN核心考点，重点掌握封装格式、VNI/VTEP概念、头端复制、集中/分布式网关、VXLAN转发流程，display vxlan tunnel查看隧道'
  },
  {
    id: 'dcn-evpn',
    name: 'EVPN',
    direction: 'dcn',
    parentId: 'dcn-vxlan',
    level: 3,
    keyPoints: [
      'EVPN以太网VPN，BGP的扩展，作为VXLAN的控制面，自动发现VTEP、同步MAC/ARP/路由信息，替代数据面泛洪学习',
      'EVPN优势：控制面学习MAC（BGP分发MAC地址，无需泛洪）、减少广播流量（ARP代理/抑制）、支持分布式网关（同步主机路由）、快速收敛、多活网关、负载分担',
      'EVPN路由类型（BGP NLRI）：Type1（以太网自动发现路由，ES成员发现）、Type2（MAC/IP地址通告路由，同步主机MAC和IP）、Type3（包含组播以太网标签的集成多播路由，VTEP发现和头端复制列表）、Type4（以太网段路由，DF选举）、Type5（IP前缀路由，同步外部路由）',
      'EVPN Type3路由：VTEP通过Type3路由通告自己的VNI和VTEP IP，其他VTEP学习后建立VXLAN隧道，形成头端复制列表',
      'EVPN Type2路由：VTEP学习到本地主机MAC和IP后，通过Type2路由通告给其他VTEP，其他VTEP直接安装MAC表项，无需数据面学习',
      'EVPN Type5路由：用于分布式网关场景，通告主机路由或外部IP前缀，实现跨子网三层转发',
      'EVPN工作流程：VTEP之间建立BGP EVPN邻居→通过Type3路由发现VTEP并建立隧道→主机上线后VTEP通过Type2路由通告MAC/IP→其他VTEP安装MAC表项→流量转发时直接匹配MAC表项单播发送',
      'ARP抑制/代理：EVPN环境下，VTEP通过Type2路由学习到主机IP-MAC映射，可代理ARP响应，减少ARP广播泛洪',
      '分布式网关EVPN：每个Leaf作为三层网关，主机网关IP是Anycast IP（所有Leaf相同），主机发送网关ARP时本地Leaf直接响应，三层流量本地转发',
      'Anycast网关：所有分布式网关配置相同的网关IP和MAC，主机无论连接到哪个Leaf，网关都相同，虚拟机迁移时无需更改网关',
      'EVPN多活网关：多个网关同时工作，负载分担，一个网关故障时其他网关接管，高可靠',
      'EVPN与VXLAN配合：EVPN是控制面（学习和分发MAC/路由），VXLAN是数据面（封装和转发数据），二者结合是数据中心网络主流方案',
      'EVPN MP-BGP：EVPN使用BGP的多协议扩展，AFI=25（L2VPN），SAFI=70（EVPN），在BGP更新中携带EVPN路由'
    ],
    tips: 'EVPN是VXLAN控制面核心，重点掌握5种路由类型作用、EVPN工作流程、ARP抑制、分布式网关Anycast IP，display bgp evpn查看EVPN路由'
  },

  { id: 'dcn-sdn', name: 'SDN', direction: 'dcn', parentId: 'dcn', level: 2, keyPoints: [], tips: '' },
  {
    id: 'dcn-sdn-basic',
    name: 'SDN基础',
    direction: 'dcn',
    parentId: 'dcn-sdn',
    level: 3,
    keyPoints: [
      'SDN软件定义网络，将控制平面与数据平面分离，控制平面集中化、软件化，数据平面简单化，通过开放接口可编程控制',
      'SDN核心特征：控制与转发分离（控制器集中控制，交换机只负责转发）、集中控制（全局网络视图，统一决策）、开放接口（控制器与应用间通过API交互，控制器与交换机间通过标准协议如OpenFlow）、网络可编程（应用可通过控制器编程控制网络行为）',
      'SDN架构：应用层（各种网络应用，如防火墙、负载均衡、流量工程）→控制层（SDN控制器，如ONOS、OpenDaylight、华为iMaster NCE）→基础设施层（SDN交换机/路由器，数据平面）',
      'OpenFlow：SDN控制器与交换机之间的通信标准协议，控制器通过OpenFlow下发流表（Flow Table），交换机根据流表转发数据包',
      'OpenFlow流表：包含匹配字段（Match Fields，如入端口、源/目的MAC、源/目的IP、协议、端口等）、动作（Actions，如转发、丢弃、修改字段、泛洪等）、计数器（统计匹配的数据包和字节数）、优先级、超时时间等',
      'OpenFlow工作流程：数据包到达交换机→查找流表匹配→匹配则执行对应动作→不匹配则上报控制器（Packet-in）→控制器决策后下发流表（Flow-mod）→交换机按新流表转发',
      'SDN优势：集中管理（全局视图，统一策略）、快速创新（软件定义，无需硬件升级）、自动化（可编程，自动配置和优化）、降低成本（简单交换机替代复杂路由器）',
      'SDN挑战：控制器性能和可靠性（集中控制器可能成为瓶颈和单点故障，需分布式控制器）、安全性（控制器是攻击目标，需安全防护）、标准化（多协议并存，互通性）、现有网络兼容（传统网络向SDN演进）',
      'SDN应用场景：数据中心网络（VXLAN/EVPN自动化、云网络编排）、广域网SD-WAN（智能选路、应用优化）、园区网络（准入控制、策略自动化）、网络功能虚拟化NFV',
      'SD-WAN软件定义广域网：基于SDN技术的广域网解决方案，智能选路（根据应用质量要求选择链路）、应用优化（应用识别和QoS）、集中管理（云管平台统一配置）、低成本（可用Internet替代MPLS）',
      '华为iMaster NCE：华为网络智能管控平台，集成SDN控制器、网络管理、网络分析、网络自动化等功能，支持数据中心、园区、广域等场景',
      'NETCONF/YANG：网络配置协议，基于XML/YANG数据模型，用于网络设备配置管理，是SDN南向接口的重要协议，比传统CLI更结构化、可编程',
      'Telemetry：网络遥测技术，设备主动推送性能数据（端口流量、CPU、内存、队列等）到采集器，实时监控网络状态，比传统SNMP轮询更实时高效'
    ],
    tips: 'SDN重点掌握核心特征（控制转发分离/集中控制/开放接口/可编程）、OpenFlow流表和工作流程、SD-WAN概念、NETCONF/Telemetry'
  },
];
