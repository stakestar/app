import { BigNumber as BigNumberJs } from 'bignumber.js'

export function convertEthToUsd(ethWei: string, priceUsd: string | null): BigNumberJs {
  if (ethWei === '0' || !priceUsd) {
    return new BigNumberJs(0)
  }

  const ethBigNumber = new BigNumberJs(ethWei).shiftedBy(-18)
  const priceUsdBigNumber = new BigNumberJs(priceUsd)

  return ethBigNumber.multipliedBy(priceUsdBigNumber)
}

export function convertSsETHToETH(ssEthAmount: string, rate: string | null): BigNumberJs {
  if (ssEthAmount === '0' || !rate) {
    return new BigNumberJs(0)
  }

  return new BigNumberJs(ssEthAmount)
    .multipliedBy(rate)
    .div(10 ** 18)
    .integerValue(BigNumberJs.ROUND_FLOOR)
}

export function convertETHToSsETH(ethAmount: string, rate: string | null): BigNumberJs {
  if (ethAmount === '0' || !rate) {
    return new BigNumberJs(0)
  }

  return new BigNumberJs(ethAmount).multipliedBy(10 ** 18).multipliedBy(rate)
}
