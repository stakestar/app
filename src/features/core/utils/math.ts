import { BigNumber, ethers } from 'ethers'

export function toDecimal(value: BigNumber | number | string, decimals: number): BigNumber {
  const multiplier = Math.pow(10, Number(decimals || 0))

  return BigNumber.from(String(value)).div(multiplier)
}

export function fromDecimal(value: BigNumber | number | string, decimals: number): BigNumber {
  if (value === '') {
    value = 0
  }

  if (value instanceof BigNumber) {
    const multiplier = Math.pow(10, Number(decimals || 0))

    return value.div(multiplier)
  } else {
    return ethers.utils.parseUnits(String(value), decimals)
  }
}
