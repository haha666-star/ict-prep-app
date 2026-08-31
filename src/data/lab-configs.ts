// EXPORTS: ILabConfig, MOCK_LAB_CONFIGS
export interface ILabConfig {
  id: string
  title: string
  direction: 'datacom' | 'dcn' | 'security' | 'wlan'
  subCategory: string
  deviceType: string
  scenario: string
  keyCommands: string
  verifyCommands: string
  notes: string
}

export const MOCK_LAB_CONFIGS: ILabConfig[] = [
  {
    id: '1',
    title: 'OSPF多区域配置',
    direction: 'datacom',
    subCategory: '路由协议',
    deviceType: 'AR2220',
    scenario: '适用于中小型网络OSPF多区域部署，实现区域间路由互通',
    keyCommands: `[Router] ospf 1 router-id 1.1.1.1
[Router-ospf-1] area 0
[Router-ospf-1-area-0.0.0.0] network 192.168.1.0 0.0.0.255`,
    verifyCommands: `[Router] display ospf peer
[Router] display ip routing-table protocol ospf`,
    notes: 'Router-ID建议手动配置，区域0为骨干区域不可缺少'
  },
  {
    id: '2',
    title: 'VLAN与Trunk配置',
    direction: 'datacom',
    subCategory: '二层交换',
    deviceType: 'S5700',
    scenario: '适用于交换机之间跨设备VLAN通信，通过Trunk链路承载多VLAN',
    keyCommands: `[Switch] vlan batch 10 20
[Switch-GigabitEthernet0/0/1] port link-type trunk
[Switch-GigabitEthernet0/0/1] port trunk allow-pass vlan 10 20`,
    verifyCommands: `[Switch] display vlan
[Switch] display port trunk`,
    notes: 'Trunk链路两端PVID需保持一致，默认VLAN1始终允许通过'
  },
  {
    id: '3',
    title: '防火墙安全策略',
    direction: 'security',
    subCategory: '防火墙基础',
    deviceType: 'USG6000V',
    scenario: '适用于不同安全区域间的访问控制，实现流量过滤',
    keyCommands: `[FW] security-policy
[FW-policy-security] rule name allow_web
[FW-policy-security-rule-allow_web] source-zone trust
[FW-policy-security-rule-allow_web] destination-zone untrust
[FW-policy-security-rule-allow_web] action permit`,
    verifyCommands: `[FW] display security-policy rule all
[FW] display firewall session table`,
    notes: '安全策略按顺序匹配，默认最后一条为拒绝所有流量'
  },
  {
    id: '4',
    title: 'WLAN AP上线配置',
    direction: 'wlan',
    subCategory: 'WLAN基础',
    deviceType: 'AC6005',
    scenario: '适用于AP通过CAPWAP隧道在AC上注册上线的典型场景',
    keyCommands: `[AC] wlan
[AC-wlan-view] ap auth-mode mac-auth
[AC-wlan-view] ap-id 1 ap-mac 00e0-fc12-3456
[AC-wlan-ap-1] ap-name ap-01`,
    verifyCommands: `[AC] display ap all
[AC] display ap online-fail-record`,
    notes: 'AP需先获取IP地址并能与AC通信，确认DHCP Option43配置正确'
  },
  {
    id: '5',
    title: 'IPSec VPN配置',
    direction: 'security',
    subCategory: 'VPN技术',
    deviceType: 'AR2220',
    scenario: '适用于分支机构与总部之间通过公网建立安全加密隧道',
    keyCommands: `[Router] ike proposal 10
[Router-ike-proposal-10] encryption-algorithm aes-256
[Router] ipsec policy map1 10 isakmp
[Router-ipsec-policy-isakmp-map1-10] ike-peer peer1`,
    verifyCommands: `[Router] display ike sa
[Router] display ipsec sa`,
    notes: '两端IKE提议和IPSec提议参数必须匹配，感兴趣流ACL需镜像配置'
  },
  {
    id: '6',
    title: 'VXLAN配置',
    direction: 'dcn',
    subCategory: '数据中心网络',
    deviceType: 'CE12800',
    scenario: '适用于数据中心大二层网络，实现跨三层网络的VM迁移',
    keyCommands: `[CE] bridge-domain 10
[CE-BD10] vxlan vni 10010
[CE] interface Nve1
[CE-Nve1] source 1.1.1.1
[CE-Nve1] vni 10010 head-end peer-list 2.2.2.2`,
    verifyCommands: `[CE] display vxlan vni
[CE] display vxlan tunnel`,
    notes: 'VTEP之间需路由可达，建议使用Loopback接口作为NVE源地址'
  }
]
