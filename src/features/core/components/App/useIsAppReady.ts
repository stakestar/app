import { useEffect, useState } from 'react'

import { APP_EVENT_CONTRACTS_READY } from '~/features/core/constants'

import { useDispatch, useEventListener } from '../../hooks'
import { setIsAppReady } from '../../store'

export function useIsAppReady(): void {
  const dispatch = useDispatch()
  const [isContractsReady, setIsContractsReady] = useState(false)

  useEventListener(APP_EVENT_CONTRACTS_READY, () => {
    // Use setTimeout because of warning: "Cannot update a component while rendering a different component"
    setTimeout(() => setIsContractsReady(true))
  })

  useEffect(() => {
    if (isContractsReady) {
      dispatch(setIsAppReady(true))
    }
  }, [dispatch, isContractsReady])
}
