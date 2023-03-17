import { BigNumber as BigNumberJs } from 'bignumber.js'

BigNumberJs.config({ EXPONENTIAL_AT: 1e9 })

export function convertEthToUsd(ethWei: string, priceUsd: string | null): BigNumberJs {
  if (ethWei === '0' || !priceUsd) {
    return new BigNumberJs(0)
  }

  const ethBigNumber = new BigNumberJs(ethWei).shiftedBy(-18)
  const priceUsdBigNumber = new BigNumberJs(priceUsd)

  return ethBigNumber.multipliedBy(priceUsdBigNumber)
}

export function convertSstarEthToEth(sstarEth: string, rate: string | null): BigNumberJs {
  if (sstarEth === '0' || !rate) {
    return new BigNumberJs(0)
  }

  return new BigNumberJs(sstarEth)
    .multipliedBy(rate)
    .div(10 ** 18)
    .integerValue(BigNumberJs.ROUND_FLOOR)
}

export function convertEthToSstarEth(eth: string, rate: string | null): BigNumberJs {
  if (eth === '0' || !rate) {
    return new BigNumberJs(0)
  }

  return new BigNumberJs(eth)
    .multipliedBy(10 ** 18)
    .div(rate)
    .integerValue(BigNumberJs.ROUND_FLOOR)
}
