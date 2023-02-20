import { usePopup } from '@onestaree/ui-kit'
import classNames from 'classnames'
import { useCallback } from 'react'

import { useAccount, useAccountBalance, useConnector } from '../../hooks'
import { popups } from '../../popups'
import { cropWalletAddress } from '../../utils'
import { WalletIcon } from '../WalletIcon'
import styles from './Account.module.scss'

export function Account(): JSX.Element {
  const { connector } = useConnector()
  const { address } = useAccount()
  const popup = usePopup()
  const onClick = useCallback(() => popup.open(popups.accountPopup), [popup])
  const ethBalance = useAccountBalance('ETH')

  return (
    <div className={classNames(styles.Account)}>
      <div className={classNames(styles.Content, '_Account')} onClick={onClick}>
        <div className={styles.Balance}>{ethBalance.toDecimal(4)} ETH</div>
        {connector.id !== 'network' && <WalletIcon icon={connector.icon} />}
        <div className={styles.AccountName}>{cropWalletAddress(address.toString())}</div>
      </div>
    </div>
  )
}
