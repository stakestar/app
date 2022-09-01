import { PropsWithChildren, ReactNode } from 'react'

import { useAccount } from '../../hooks'
import { ConnectWalletButton } from '../WalletControl/ConnectWalletButton'
import styles from './AuthCheck.module.scss'

interface AuthCheckProps extends PropsWithChildren {
  fallback?: ReactNode
  useDefaultFallback?: boolean
}

export function AuthCheck({ fallback, useDefaultFallback = false, children }: AuthCheckProps): JSX.Element {
  const { address } = useAccount()

  return address.length ? (
    <>{children}</>
  ) : fallback ? (
    <>{fallback}</>
  ) : useDefaultFallback ? (
    <div className={styles.AuthCheck}>
      <div className="_mb-3">Connect your wallet to see the content</div>
      <ConnectWalletButton />
    </div>
  ) : (
    <></>
  )
}
