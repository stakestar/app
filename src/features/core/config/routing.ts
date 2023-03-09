import { DashboardPage, StakingPage } from '~/pages'

export const routes = [
  { path: '/', Component: StakingPage },
  { path: '/dashboard', Component: DashboardPage }
  // { path: '/docs', Component: Docs }
] as const

export const menu = [
  { title: 'Staking', path: '/', soon: false },
  { title: 'Dashboard', path: '/dashboard', soon: false },
  { title: 'Docs', url: 'https://docs.stakestar.com/', soon: false }
]
