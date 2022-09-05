import { useCallback } from 'react'

import { handleError, useDispatch } from '~/features/core'

import { useConnector } from '../../hooks'
import { updateAccountBalances } from '../../store'

export function useFetchAccountBalances(): (address: string) => void {
  const dispatch = useDispatch()
  const { connector } = useConnector()
  const provider = connector.hooks.useProvider()

  return useCallback(
    (address: string) => {
      if (address && provider) {
        provider
          ?.getBalance(address)
          .then((balance) =>
            dispatch(
              updateAccountBalances([
                {
                  balance: balance.toString(),
                  tokenId: 'ETH'
                }
              ])
            )
          )
          .catch(handleError)
      }
    },
    [dispatch, provider]
  )
}
