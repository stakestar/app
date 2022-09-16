import { Page } from '~/features/core'
import { Staking } from '~/features/staking'

export function StakingPage(): JSX.Element {
  return (
    <Page title="Staking">
      <Staking />
    </Page>
  )
}
