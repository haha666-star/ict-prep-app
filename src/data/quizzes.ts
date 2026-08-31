// EXPORTS: IQuizQuestion, MOCK_QUIZZES
export interface IQuizQuestion {
  id: string
  type: 'single' | 'multiple' | 'judge'
  question: string
  options: string[]
  answer: string | string[]
  explanation: string
  knowledgeId: string
  direction: 'datacom' | 'dcn' | 'security' | 'wlan'
}

export const MOCK_QUIZZES: IQuizQuestion[] = [
  {
    id: '1',
    type: 'single',
    question: 'OSPF协议中，DR和BDR的选举发生在哪个状态？',
    options: ['Init状态', '2-Way状态', 'ExStart状态', 'Loading状态'],
    answer: '2-Way状态',
    explanation: 'OSPF在2-Way状态后进行DR/BDR选举，选举基于接口优先级和Router ID。',
    knowledgeId: 'datacom-ospf',
    direction: 'datacom',
  },
  {
    id: '2',
    type: 'multiple',
    question: '以下哪些属于VLAN间通信的方式？（多选）',
    options: ['单臂路由', '三层交换机SVI接口', 'VLAN聚合', 'Hybrid端口'],
    answer: ['单臂路由', '三层交换机SVI接口'],
    explanation: 'VLAN间通信主要通过单臂路由（路由器子接口）和三层交换机的SVI虚拟接口实现。',
    knowledgeId: 'datacom-vlan',
    direction: 'datacom',
  },
  {
    id: '3',
    type: 'judge',
    question: 'STP协议中，根桥上的所有端口都是指定端口。',
    options: ['正确', '错误'],
    answer: '正确',
    explanation: '根桥的所有端口均为指定端口（Designated Port），不存在根端口。',
    knowledgeId: 'datacom-stp',
    direction: 'datacom',
  },
  {
    id: '4',
    type: 'single',
    question: 'VXLAN协议中，VNI字段占用多少比特？',
    options: ['12比特', '16比特', '24比特', '32比特'],
    answer: '24比特',
    explanation: 'VXLAN网络标识符（VNI）占24比特，最多支持约1600万个VXLAN网段。',
    knowledgeId: 'dcn-vxlan',
    direction: 'dcn',
  },
  {
    id: '5',
    type: 'single',
    question: '华为USG6000V防火墙默认安全区域中，优先级最高的是？',
    options: ['Local区域', 'Trust区域', 'DMZ区域', 'Untrust区域'],
    answer: 'Local区域',
    explanation: 'Local区域优先级为100，是所有安全区域中最高的，代表防火墙自身。',
    knowledgeId: 'security-firewall',
    direction: 'security',
  },
  {
    id: '6',
    type: 'multiple',
    question: '以下哪些属于IPSec VPN的工作模式？（多选）',
    options: ['传输模式', '隧道模式', '路由模式', '透明模式'],
    answer: ['传输模式', '隧道模式'],
    explanation: 'IPSec有两种工作模式：传输模式（保护传输层）和隧道模式（保护整个IP数据包）。',
    knowledgeId: 'security-vpn',
    direction: 'security',
  },
  {
    id: '7',
    type: 'single',
    question: 'WLAN中，AP发现AC的方式不包括以下哪项？',
    options: ['DNS方式', 'DHCP Option43方式', '广播方式', 'PPP拨号方式'],
    answer: 'PPP拨号方式',
    explanation: 'AP发现AC的常用方式有：DNS、DHCP Option43、广播、CAPWAP发现等，不包括PPP拨号。',
    knowledgeId: 'wlan-ap',
    direction: 'wlan',
  },
  {
    id: '8',
    type: 'judge',
    question: '在WLAN组网中，Fit AP可以独立进行配置和管理。',
    options: ['正确', '错误'],
    answer: '错误',
    explanation: 'Fit AP（瘦AP）必须由AC统一管理和配置，自身无法独立工作。',
    knowledgeId: 'wlan-arch',
    direction: 'wlan',
  },
  {
    id: '9',
    type: 'single',
    question: 'VRRP协议中，虚拟路由器的默认MAC地址前缀是？',
    options: ['00-00-5E-00-01', '00-00-0C-07-AC', '00-E0-FC-00-00', '00-1B-54-00-00'],
    answer: '00-00-5E-00-01',
    explanation: 'VRRP虚拟MAC地址格式为00-00-5E-00-01-{VRID}，前缀是00-00-5E-00-01。',
    knowledgeId: 'datacom-vrrp',
    direction: 'datacom',
  },
]
