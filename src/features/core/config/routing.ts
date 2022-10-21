import { DashboardPage, StakingPage } from '~/pages'

export const routes = [
  { path: '/', Component: DashboardPage },
  { path: '/staking', Component: StakingPage },
  { path: '/docs', Component: StakingPage }
] as const

export const menu = [
  { title: 'Dashboard', path: '/', soon: false },
  { title: 'Staking', path: '/staking', soon: false },
  { title: 'Docs', path: '/docs', soon: true }
]
