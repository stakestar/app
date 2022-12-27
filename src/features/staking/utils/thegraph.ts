import { TokenRateDaily } from '@stakestar/subgraph-client/dist/types.d.ts'
import BigNumber from 'bignumber.js'

export function calculateApr(tokenRateDailies: Array<Pick<TokenRateDaily, 'id' | 'date' | 'rate'>>): number {
  if (tokenRateDailies.length < 3) {
    return 0
  }

  const firstState = tokenRateDailies[1]
  const lastState = tokenRateDailies[tokenRateDailies.length - 1]

  const firstRate = new BigNumber(String(firstState.rate))
  const secondRate = new BigNumber(String(lastState.rate))
  const daysBetweenStates = Number(firstState.id) - Number(lastState.id)

  return firstRate
    .dividedBy(secondRate)
    .minus(1)
    .multipliedBy(365 / daysBetweenStates)
    .multipliedBy(100)
    .toNumber()
}
