import { BigNumber as BigNumberJs } from 'bignumber.js'

export function convertEthToUsd(ethWei: string, priceUsd: string | null): BigNumberJs {
  if (ethWei === '0' || !priceUsd) {
    return new BigNumberJs(0)
  }

  const ethBigNumber = new BigNumberJs(ethWei).shiftedBy(-18)
  const priceUsdBigNumber = new BigNumberJs(priceUsd)

  return ethBigNumber.multipliedBy(priceUsdBigNumber)
}
