import { StakingPage } from '~/pages'

export const routes = [
  { path: '/', Component: StakingPage },
  { path: '/docs', Component: StakingPage }
] as const

export const menu = [
  { title: 'Staking', path: '/', soon: false },
  { title: 'Docs', path: '/docs', soon: true }
]
