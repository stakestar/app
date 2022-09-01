import { DashboardPage, StakePage } from '~/pages'

export const routes = [
  { path: '/', Component: DashboardPage },
  { path: '/stake', Component: StakePage }
] as const

export const menu = [
  { title: 'Dashboard', path: '/', soon: false },
  { title: 'Stake', path: '/stake', soon: false }
]
