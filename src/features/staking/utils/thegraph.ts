import { TokenRateDaily } from '@stakestar/subgraph-client/dist/types.d.ts'
import BigNumber from 'bignumber.js'

export function calculateApr(tokenRateDailies: Array<Pick<TokenRateDaily, 'id' | 'date' | 'rate'>>): number {
  if (tokenRateDailies.length < 3) {
    return 0
  }

  const firstState = tokenRateDailies[0]
  const lastState = tokenRateDailies[3]

  const firstRate = new BigNumber(String(firstState.rate))
  const secondRate = new BigNumber(String(lastState.rate))
  const secondsBetweenRates = Number(firstState.date) - Number(lastState.date)

  return firstRate
    .dividedBy(secondRate)
    .minus(1)
    .multipliedBy(365 / (secondsBetweenRates / 86400))
    .multipliedBy(100)
    .toNumber()
}
