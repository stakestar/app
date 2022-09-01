import './Account.css'

import { usePopup } from '@onestaree/ui-kit'
import classNames from 'classnames'
import { useCallback } from 'react'

import { useAccount, useWalletExtension } from '../../hooks'
import { popups } from '../../popups'
import { cropWalletAddress } from '../../utils'
import { WalletIcon } from '../WalletIcon'
import styles from './Account.module.scss'

export function Account(): JSX.Element {
  const { walletExtension } = useWalletExtension()
  const { address } = useAccount()
  const popup = usePopup()
  const onClick = useCallback(() => popup.open(popups.accountPopup), [popup])

  return (
    <div className={classNames(styles.Account)}>
      <div className={classNames(styles.Content, '_Account')} onClick={onClick}>
        <WalletIcon icon={walletExtension.icon} />
        <div className={styles.AccountName}>{cropWalletAddress(address.toString())}</div>
      </div>
    </div>
  )
}
