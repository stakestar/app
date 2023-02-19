import { Button, usePopup } from '@onestaree/ui-kit'

import { popups } from '../../popups'
import styles from './ConnectWalletButton.module.scss'

export function ConnectWalletButton(): JSX.Element {
  const popup = usePopup()

  return (
    <Button
      className={styles.ConnectWalletButton}
      title="Connect Wallet"
      type="primary"
      size="small"
      onClick={(): void => popup.open(popups.selectWalletPopup)}
    />
  )
}
