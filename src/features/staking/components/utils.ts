import { StakeStar } from '@stakestar/contracts'
import { BigNumber } from 'ethers'

import { TokenAmount } from '~/features/core'

import { minStakeEthValue } from './constants'

export const getIsValueMinMaxError = (value: string, balance: TokenAmount): boolean =>
  !!value.length &&
  (Number(value) < minStakeEthValue || balance.toBigNumber().lt(TokenAmount.fromDecimal('ETH', value).toWei()))

export const getSetValueByMultiplier =
  (setValue: (value: string) => void, balance: TokenAmount): ((multiplier: number) => void) =>
  (multiplier) => {
    if (balance.toBigNumber().gt(0)) {
      setValue(
        TokenAmount.fromBigNumber(
          'ETH',
          balance
            .toBigNumber()
            .mul(multiplier * 100)
            .div(100)
        ).toString()
      )
    }
  }

export function getGasRequired({
  address,
  stakeStarContract,
  value
}: {
  address: string
  stakeStarContract: StakeStar
  value: BigNumber
}): Promise<string> {
  return stakeStarContract.estimateGas
    .stake({
      from: address,
      // Subtract 1 wei to prevent error for "value = max" estimation
      value: value.sub(1).toString()
    })
    .then((response) =>
      response
        .mul(10 ** 9) // Equivalent to "Low" in MetaMask
        .mul(2) // Equivalent to "Aggressive" in MetaMask
        .toString()
    )
}