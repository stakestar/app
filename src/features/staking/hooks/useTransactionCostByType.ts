import BigNumberJs from 'bignumber.js'
import { useEffect, useMemo, useState } from 'react'

import { TokenAmount, useContracts } from '~/features/core'
import { useAccount } from '~/features/wallet'

import { useConvertEthToUsd } from './useConvertEthToUsd'
import { useFetchGasPrice } from './useFetchGasPrice'

export function useTransactionCostByType(type: 'stake' | 'unstake'): number {
  const [estimatedGas, setEstimatedGas] = useState('0')
  const { stakeStarContract } = useContracts()
  const { address } = useAccount()
  const { gasPrice } = useFetchGasPrice()
  const convertEthToUsd = useConvertEthToUsd()

  useEffect(() => {
    const value = 1
    let promise = null

    switch (type) {
      case 'stake':
        if (address) {
          promise = stakeStarContract.estimateGas.depositAndStake({ from: address, value })
        }
        break

      case 'unstake':
        promise = stakeStarContract.estimateGas.unstakeAndWithdraw(value)
        break
    }

    promise?.then((response) => setEstimatedGas(response.toString())).catch(console.info)
  }, [address, stakeStarContract, type])

  // TODO: Can be removed
  if (parseFloat(estimatedGas)) {
    console.info(
      '[DEBUG] Transaction cost',
      type,
      `${TokenAmount.fromWei('ETH', convertGasEstimatedToGasRequired(estimatedGas, gasPrice)).toDecimal(
        8
      )} GoerliETH *`,
      `$${convertEthToUsd(TokenAmount.fromDecimal('ETH', 1).toWei()).toNumber()} = `,
      `$${convertEthToUsd(convertGasEstimatedToGasRequired(estimatedGas, gasPrice)).toNumber()}`
    )
  }

  return useMemo(
    () => convertEthToUsd(convertGasEstimatedToGasRequired(estimatedGas, gasPrice)).toNumber(),
    [convertEthToUsd, estimatedGas, gasPrice]
  )
}

function convertGasEstimatedToGasRequired(gasEstimated: string, gasPrice: number): string {
  const fromLowToMarketMetamaskCoefficient = 1.5

  return new BigNumberJs(gasEstimated)
    .multipliedBy(gasPrice) // Equivalent to "Low" in MetaMask
    .multipliedBy(fromLowToMarketMetamaskCoefficient) // Equivalent to "Market" in MetaMask
    .toString()
    .split('.')[0]
}
