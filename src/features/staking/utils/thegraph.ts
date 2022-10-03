import { TokenRateDaily } from '@stakestar/subgraph-client/dist/types.d.ts'
import BigNumber from 'bignumber.js'

export function calculateDailyApr(tokenRateDailies: Array<Pick<TokenRateDaily, 'id' | 'date' | 'rate'>>): number {
  if (tokenRateDailies.length < 3) {
    return 0
  }

  const firstState = tokenRateDailies[1]
  const secondState = tokenRateDailies[2]

  const firstRate = new BigNumber(String(firstState.rate))
  const secondRate = new BigNumber(String(secondState.rate))
  const daysBetweenStates = Number(firstState.id) - Number(secondState.id)

  return firstRate.dividedBy(secondRate).minus(1).dividedBy(daysBetweenStates).multipliedBy(100).toNumber()
}
