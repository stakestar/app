import { Page } from '~/features/core'
import { Staking } from '~/features/staking'

export function StakePage(): JSX.Element {
  return (
    <Page title="Stake">
      <Staking />
    </Page>
  )
}
