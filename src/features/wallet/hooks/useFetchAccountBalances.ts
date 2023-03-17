import { useCallback } from 'react'

import { handleError, useDispatch } from '~/features/core'

import { updateAccountBalances } from '../store'
import { useAccount, useConnector, useSstarEthContract } from './'

export function useFetchAccountBalances(): (address?: string) => Promise<void> {
  const dispatch = useDispatch()
  const { connector } = useConnector()
  const { address } = useAccount()
  const provider = connector.hooks.useProvider()
  const sstarEthContract = useSstarEthContract()

  return useCallback(
    (customAccountAddress) => {
      const accountAddress = customAccountAddress || address

      if (!accountAddress || !provider || !sstarEthContract) {
        return Promise.resolve()
      }

      return Promise.all([provider.getBalance(accountAddress), sstarEthContract.balanceOf(address)])
        .then(([eth, sstarEth]) => {
          dispatch(
            updateAccountBalances([
              {
                balance: eth.toString(),
                tokenId: 'ETH'
              },
              {
                balance: sstarEth.toString(),
                tokenId: 'sstarETH'
              }
            ])
          )
        })
        .catch(handleError)
    },
    [address, dispatch, provider, sstarEthContract]
  )
}
