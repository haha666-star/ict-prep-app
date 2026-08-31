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
  // 数通方向
  { id: 'datacom', name: '数通', direction: 'datacom', parentId: null, level: 1, keyPoints: [], tips: '' },
  { id: 'datacom-routing', name: '路由协议', direction: 'datacom', parentId: 'datacom', level: 2, keyPoints: [], tips: '' },
  {
    id: 'datacom-ospf',
    name: 'OSPF',
    direction: 'datacom',
    parentId: 'datacom-routing',
    level: 3,
    keyPoints: [
      '链路状态路由协议，基于SPF算法',
      '五大区域：骨干区域0必须连续',
      '七种LSA类型，Type1/2/3/4/5/7为主',
      '邻居状态机：Down→Init→2-Way→ExStart→Exchange→Loading→Full',
      'DR/BDR选举基于接口优先级和Router ID'
    ],
    tips: '多区域配置注意ABR和ASBR的角色划分，虚链路可解决骨干不连续问题'
  },
  {
    id: 'datacom-bgp',
    name: 'BGP',
    direction: 'datacom',
    parentId: 'datacom-routing',
    level: 3,
    keyPoints: [
      '路径矢量协议，基于TCP 179端口',
      'IBGP与EBGP的区别与防环机制',
      '路由属性：Origin、AS_Path、Next_Hop、MED、Local_Pref',
      '路由优选规则逐条比较'
    ],
    tips: 'IBGP水平分割导致全互联需求，常用路由反射器或联盟解决'
  },
  { id: 'datacom-switch', name: '二层交换', direction: 'datacom', parentId: 'datacom', level: 2, keyPoints: [], tips: '' },
  {
    id: 'datacom-vlan',
    name: 'VLAN',
    direction: 'datacom',
    parentId: 'datacom-switch',
    level: 3,
    keyPoints: [
      'VLAN隔离广播域，基于802.1Q标签',
      'Access端口发untag，收时打PVID',
      'Trunk端口允许带标签VLAN通过',
      'VLAN间通信需要三层设备'
    ],
    tips: 'Hybrid端口可灵活配置tag/untag列表，是华为设备特色'
  },
  {
    id: 'datacom-stp',
    name: 'STP/RSTP/MSTP',
    direction: 'datacom',
    parentId: 'datacom-switch',
    level: 3,
    keyPoints: [
      'STP通过阻断端口消除二层环路',
      '端口角色：根端口、指定端口、阻塞端口',
      'RSTP增加替代端口和备份端口，加速收敛',
      'MSTP支持多实例，实现VLAN负载分担'
    ],
    tips: '根桥选举比较桥ID（优先级+MAC），值小者优先'
  },

  // DCN方向
  { id: 'dcn', name: 'DCN', direction: 'dcn', parentId: null, level: 1, keyPoints: [], tips: '' },
  {
    id: 'dcn-vxlan',
    name: 'VXLAN',
    direction: 'dcn',
    parentId: 'dcn',
    level: 2,
    keyPoints: [
      'MAC in UDP封装，扩展二层网络',
      'VNI（VXLAN Network Identifier）标识租户',
      'VTEP负责封装解封装',
      '控制面可用EVPN或数据面泛洪'
    ],
    tips: 'VXLAN通过三层网络构建大二层，是数据中心网络核心技术'
  },

  // 安全方向
  { id: 'security', name: '安全', direction: 'security', parentId: null, level: 1, keyPoints: [], tips: '' },
  {
    id: 'security-firewall',
    name: '防火墙安全策略',
    direction: 'security',
    parentId: 'security',
    level: 2,
    keyPoints: [
      '安全区域：Local/Trust/ Untrust/DMZ',
      '安全策略五元组匹配：源目IP、端口、协议',
      '默认域间全拒绝，需手动放通',
      '会话表记录连接状态，支持状态检测'
    ],
    tips: '策略配置遵循精细化原则，最小权限放行'
  },
  {
    id: 'security-ipsec',
    name: 'IPSec VPN',
    direction: 'security',
    parentId: 'security',
    level: 2,
    keyPoints: [
      'AH和ESP两种协议，ESP更常用支持加密',
      '传输模式与隧道模式区别',
      'IKE协商分两阶段：IKE SA + IPSec SA',
      '感兴趣流通过ACL定义'
    ],
    tips: '两端感兴趣流镜像对称，IKE策略参数必须匹配'
  },

  // WLAN方向
  { id: 'wlan', name: 'WLAN', direction: 'wlan', parentId: null, level: 1, keyPoints: [], tips: '' },
  {
    id: 'wlan-ap-online',
    name: 'AP上线流程',
    direction: 'wlan',
    parentId: 'wlan',
    level: 2,
    keyPoints: [
      'AP获取IP地址（DHCP）',
      'AP发现AC（CAPWAP发现机制）',
      'CAPWAP隧道建立（数据隧道+控制隧道）',
      'AP升级与配置下发',
      'AP正常工作，提供SSID服务'
    ],
    tips: 'AP发现AC方式：DHCP Option43、DNS发现、静态配置、广播发现'
  },
  {
    id: 'wlan-security',
    name: '无线安全认证',
    direction: 'wlan',
    parentId: 'wlan',
    level: 2,
    keyPoints: [
      '开放式认证：无密码，适合访客',
      'WPA/WPA2 PSK：预共享密钥，小型网络',
      'WPA/WPA2 802.1X：账号密码，企业级',
      'Portal认证：Web页面推送认证'
    ],
    tips: '安全模板需绑定到VAP模板才生效'
  }
]
