import { useCallback } from 'react'

import { useDispatch } from '~/features/core'

import { updateAccountBalances } from '../store'
import { useAccount, useConnector } from './index'

export function useFetchAccountBalances(): (address?: string) => Promise<void> {
  const dispatch = useDispatch()
  const { connector } = useConnector()
  const { address } = useAccount()
  const provider = connector.hooks.useProvider()

  return useCallback(
    (customAccountAddress) => {
      const accountAddress = customAccountAddress || address

      if (!accountAddress || !provider) {
        return Promise.resolve()
      }

      return provider.getBalance(accountAddress).then((balance) => {
        dispatch(
          updateAccountBalances([
            {
              balance: balance.toString(),
              tokenId: 'ETH'
            }
          ])
        )
      })
    },
    [address, dispatch, provider]
  )
}
