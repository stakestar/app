import { usePopup } from '@onestaree/ui-kit'
import { Network } from '@web3-react/network'
import { useCallback, useEffect } from 'react'

import { ChainId, emitEvent, handleError, useDispatch, usePrevious } from '~/features/core'

import {
  WALLET_EVENT_UNSUPPORTED_NETWORK_POPUP_CLOSE,
  WALLET_EVENT_UNSUPPORTED_NETWORK_POPUP_OPEN
} from '../../constants'
import { useConnector, useFetchAccountBalances, useAccount as useWalletAccount } from '../../hooks'
import { resetState, setAccountAddress, setChainId } from '../../store'
import { ConnectorId } from './types'
import { getConnector } from './utils'

interface UseSyncAccountProps {
  connectorId: ConnectorId
}

export function useSyncAccount({ connectorId }: UseSyncAccountProps): void {
  const {
    connector: { hooks },
    connectors
  } = useConnector()

  const [account, isActive] = [hooks.useAccount(), hooks.useIsActive()]
  const chainId = hooks.useChainId()
  const dispatch = useDispatch()
  const popup = usePopup()
  const { address } = useWalletAccount()
  const prevConnectorId = usePrevious(connectorId)
  const fetchAccountBalances = useFetchAccountBalances()

  const connect = useCallback(
    (props: { connectorId: ConnectorId; isInitialConnect: boolean }) => {
      const { connector } = getConnector(connectors, props.connectorId)

      if (props.isInitialConnect && !(connector instanceof Network)) {
        connector.connectEagerly().catch(() => null)

        return
      }

      connector.activate(chainId).catch((error: Error): void => {
        handleError(error, {
          message: error?.message,
          displayGenericMessage: true
        })
      })
    },
    [chainId, connectors]
  )

  const login = useCallback(
    (props: { address: string; chainId: number }) => {
      dispatch(setChainId(props.chainId))
      dispatch(setAccountAddress(props.address))
      fetchAccountBalances(props.address)
    },
    [dispatch, fetchAccountBalances]
  )

  const logout = useCallback(async () => {
    const { connector } = getConnector(connectors, prevConnectorId)

    if (connector?.deactivate) {
      await connector.deactivate()
    } else {
      await connector.resetState()
    }

    dispatch(resetState())
  }, [connectors, dispatch, prevConnectorId])

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
        // Object.values(ChainId).includes(chainId)
        chainId === ChainId.Goerli
          ? WALLET_EVENT_UNSUPPORTED_NETWORK_POPUP_CLOSE
          : WALLET_EVENT_UNSUPPORTED_NETWORK_POPUP_OPEN
      )
    }
  }, [chainId, popup])
}
