import { StakeStar } from '@stakestar/contracts'
import { BigNumber } from 'ethers'

import { TokenAmount } from '~/features/core'

import { minStakeEthValue } from './constants'

export const getIsStakeEthValueLessMin = (value: string): boolean => !!value.length && Number(value) < minStakeEthValue

export const getIsStakeEthValueMoreBalance = (value: string, balance: TokenAmount): boolean =>
  !!value.length && balance.toBigNumber().lt(TokenAmount.fromDecimal('ETH', value).toWei())

export const getSetValueByMultiplier =
  (setValue: (value: string) => void, balance: TokenAmount): ((multiplier: number) => void) =>
  (multiplier) => {
    if (balance.toBigNumber().gt(0)) {
      const value = TokenAmount.fromBigNumber(
        'ETH',
        balance
          .toBigNumber()
          .mul(multiplier * 100)
          .div(100)
      )

      setValue(multiplier === 1 ? value.toString() : value.toDecimal(4))
    }
  }

export function getDepositAndStakeGasRequired({
  address,
  stakeStarContract,
  value
}: {
  address: string
  stakeStarContract: StakeStar
  value: BigNumber
}): Promise<string> {
  return stakeStarContract.estimateGas
    .depositAndStake({
      from: address,
      // Subtract 1 wei to prevent error for "value = max" estimation
      value: value.sub(1).toString()
    })
    .then((response) =>
      response
        .mul(10 ** 9) // Equivalent to "Low" in MetaMask
        .mul(2) // Make it equivalent to "Aggressive" in MetaMask
        .toString()
    )
}

export function getUnstakeAndWithdrawGasRequired({
  stakeStarContract,
  value
}: {
  stakeStarContract: StakeStar
  value: BigNumber
}): Promise<string> {
  // Subtract 1 wei to prevent error for "value = max" estimation
  const unstakeValue = value.sub(1).toString()

  return stakeStarContract.estimateGas.unstakeAndWithdraw(unstakeValue).then((response) =>
    response
      .mul(10 ** 9) // Equivalent to "Low" in MetaMask
      .mul(2) // Make it equivalent to "Aggressive" in MetaMask
      .toString()
  )
}
