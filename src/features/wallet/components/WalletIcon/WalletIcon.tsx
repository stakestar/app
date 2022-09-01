import { Icon, IconName } from '@onestaree/ui-kit'
import classNames from 'classnames'

import styles from './WalletIcon.module.scss'

export function WalletIcon({ icon }: { icon: IconName }): JSX.Element {
  return (
    <Icon
      className={classNames(styles.WalletIcon, { [styles.withBackground]: icon !== 'walletCoinbaseWallet' })}
      icon={icon}
    />
  )
}
