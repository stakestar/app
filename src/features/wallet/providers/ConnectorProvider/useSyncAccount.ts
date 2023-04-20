import { usePopup } from '@onestaree/ui-kit'
import { Network } from '@web3-react/network'
import { useCallback, useEffect, useRef } from 'react'

import { emitEvent, handleError, useDispatch, usePrevious } from '~/features/core'
import { resetState as resetStakingState } from '~/features/staking'

import {
  WALLET_EVENT_UNSUPPORTED_NETWORK_POPUP_CLOSE,
  WALLET_EVENT_UNSUPPORTED_NETWORK_POPUP_OPEN
} from '../../constants'
import { useConnector, useFetchAccountBalances, useAccount as useWalletAccount } from '../../hooks'
import { resetState as resetWalletState, setAccountAddress, setChainId } from '../../store'
import { isChainIdSupported } from '../../utils'
import { ConnectorId } from './types'
import { getConnector } from './utils'

export function useSyncAccount(connectorId: ConnectorId): void {
  const {
    connector: { hooks },
    connectors,
    disconnect
  } = useConnector()

  const [account, isActive] = [hooks.useAccount(), hooks.useIsActive()]
  const chainId = hooks.useChainId()
  const prevChainId = useRef<number>()
  const dispatch = useDispatch()
  const popup = usePopup()
  const { address } = useWalletAccount()
  const prevConnectorId = usePrevious(connectorId)
  const fetchAccountBalances = useFetchAccountBalances()

  const login = useCallback(
    (props: { address: string; chainId: number }) => {
      dispatch(setChainId(props.chainId))
      dispatch(setAccountAddress(props.address))
    },
    [dispatch]
  )

  const resetState = useCallback(() => {
    dispatch(resetWalletState())
    dispatch(resetStakingState())
  }, [dispatch])

  const logout = useCallback(async () => {
    const { connector } = getConnector(connectors, prevConnectorId)

    if (connector?.deactivate) {
      await connector.deactivate()
    } else {
      await connector.resetState()
    }

    resetState()
    disconnect()
  }, [connectors, disconnect, prevConnectorId, resetState])

  const connect = useCallback(
    (props: { connectorId: ConnectorId; isInitialConnect: boolean }) => {
      const { connector } = getConnector(connectors, props.connectorId)

      if (props.isInitialConnect && !(connector instanceof Network)) {
        connector.connectEagerly().catch(() => logout())

        return
      }

      connector.activate(chainId).catch((error: Error): void => {
        handleError(error, {
          message: error?.message,
          displayGenericMessage: true
        })
      })
    },
    [chainId, connectors, logout]
  )

  useEffect(() => {
    if (connectorId !== prevConnectorId) {
      connect({
        connectorId,
        isInitialConnect: !prevConnectorId
      })
    }
  }, [connect, connectorId, prevConnectorId])

  useEffect(() => {
    if (account && isActive && address !== account && chainId) {
      login({
        address: account,
        chainId
      })
    }
  }, [account, address, chainId, isActive, login])

  useEffect(() => {
    if (!account && address) {
      void logout()
    }
  }, [account, address, logout])

  useEffect(() => {
    if (chainId) {
      emitEvent(
        isChainIdSupported(chainId)
          ? WALLET_EVENT_UNSUPPORTED_NETWORK_POPUP_CLOSE
          : WALLET_EVENT_UNSUPPORTED_NETWORK_POPUP_OPEN
      )

      if (prevChainId.current) {
        if (prevChainId.current !== chainId) {
          prevChainId.current = chainId
          resetState()
        }
      } else {
        prevChainId.current = chainId
      }
    }
  }, [chainId, dispatch, popup, resetState])

  useEffect(() => {
    if (address && isChainIdSupported(chainId)) {
      void fetchAccountBalances(address)
    }
  }, [address, chainId, fetchAccountBalances])
}
