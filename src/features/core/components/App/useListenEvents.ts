import { usePopup } from '@onestaree/ui-kit'
import { useEffect, useState } from 'react'

import {
  WALLET_EVENT_UNSUPPORTED_NETWORK_POPUP_CLOSE,
  WALLET_EVENT_UNSUPPORTED_NETWORK_POPUP_OPEN,
  popups
} from '~/features/wallet'

import { CORE_EVENT_CONTRACTS_READY } from '../../constants'
import { useDispatch, useEventListener } from '../../hooks'
import { setIsAppReady } from '../../store'

export function useListenEvents(): void {
  const dispatch = useDispatch()
  const popup = usePopup()
  const [isContractsReady, setIsContractsReady] = useState(false)

  useEventListener(CORE_EVENT_CONTRACTS_READY, () => {
    // Use setTimeout because of warning: "Cannot update a component while rendering a different component"
    setTimeout(() => setIsContractsReady(true))
  })

  useEffect(() => {
    if (isContractsReady) {
      dispatch(setIsAppReady(true))
    }
  }, [dispatch, isContractsReady])

  useEventListener(WALLET_EVENT_UNSUPPORTED_NETWORK_POPUP_OPEN, () => popup.open(popups.unsupportedNetworkPopup))
  useEventListener(WALLET_EVENT_UNSUPPORTED_NETWORK_POPUP_CLOSE, () => popup.close())
}
