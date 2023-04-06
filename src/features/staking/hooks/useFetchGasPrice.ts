import { useCallback, useEffect, useMemo } from 'react'

import { handleError, selectGasPrice, setGasPrice, useDispatch, useSelector } from '~/features/core'
import { useSignerOrProvider } from '~/features/wallet'

export function useFetchGasPrice(): {
  gasPrice: number
  fetchGasPrice: () => Promise<void>
} {
  const dispatch = useDispatch()
  const signerOrProvider = useSignerOrProvider()
  const gasPrice = useSelector(selectGasPrice)

  const fetchGasPrice = useCallback(() => {
    if (!signerOrProvider?.getGasPrice) {
      return Promise.resolve()
    }

    return signerOrProvider
      .getGasPrice()
      .then((newGasPrice) => {
        dispatch(setGasPrice(newGasPrice.toNumber()))
      })
      .catch(handleError)
  }, [dispatch, signerOrProvider])

  useEffect(() => {
    void fetchGasPrice()
  }, [fetchGasPrice])

  return useMemo(() => ({ gasPrice, fetchGasPrice }), [fetchGasPrice, gasPrice])
}
