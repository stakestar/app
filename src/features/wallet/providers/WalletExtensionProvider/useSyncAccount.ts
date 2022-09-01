import { Web3ReactHooks } from '@web3-react/core'
import { Empty } from '@web3-react/empty'
import { NoMetaMaskError } from '@web3-react/metamask'
import { useCallback, useEffect } from 'react'

import { handleError, useDispatch, usePrevious } from '~/features/core'

import { useAccount as useWalletAccount } from '../../hooks'
import { resetState, setAccountAddress, setChainId } from '../../store'
import { WalletExtensionId } from './types'
import { getWalletExtensionByWalletExtensionId } from './utils'

interface UseSyncAccountProps {
  walletExtensionId: WalletExtensionId | null
  web3ReactHooks: Web3ReactHooks
}

export function useSyncAccount({ walletExtensionId, web3ReactHooks }: UseSyncAccountProps): void {
  const { useAccount, useIsActive, useChainId } = web3ReactHooks
  const [account, isActive, chainId] = [useAccount(), useIsActive(), useChainId()]
  const { address } = useWalletAccount()
  const dispatch = useDispatch()
  const prevWalletExtensionId = usePrevious(walletExtensionId)

  const connect = useCallback(
    ({
      connectEagerly,
      newWalletExtensionId
    }: {
      connectEagerly: boolean
      newWalletExtensionId: WalletExtensionId | null
    }) => {
      // TODO
      const targetChainId = 5
      const { connector } = getWalletExtensionByWalletExtensionId(newWalletExtensionId)

      if (connector instanceof Empty) {
        return
      }

      if (connectEagerly) {
        connector.connectEagerly().catch(() => null)

        return
      }

      connector.activate(targetChainId).catch((error: Error | NoMetaMaskError): void => {
        if (!(error instanceof NoMetaMaskError)) {
          handleError(error, {
            message: error?.message,
            displayGenericMessage: true
          })
        }
      })
    },
    []
  )

  const login = useCallback(
    (props: { address: string; chainId: number }) => {
      dispatch(setChainId(props.chainId))
      dispatch(setAccountAddress(props.address))
    },
    [dispatch]
  )

  const logout = useCallback(async () => {
    const { connector } = getWalletExtensionByWalletExtensionId(prevWalletExtensionId || null)

    if (connector?.deactivate) {
      await connector.deactivate()
    } else {
      await connector.resetState()
    }

    dispatch(resetState())
  }, [dispatch, prevWalletExtensionId])

  useEffect(() => {
    if (walletExtensionId && walletExtensionId !== prevWalletExtensionId) {
      connect({
        connectEagerly: !prevWalletExtensionId,
        newWalletExtensionId: walletExtensionId
      })
    }
  }, [connect, prevWalletExtensionId, walletExtensionId])

  useEffect(() => {
    if (account && isActive && chainId && !address) {
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
}
