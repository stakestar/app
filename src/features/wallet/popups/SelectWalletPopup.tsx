import { Button, usePopup } from '@onestaree/ui-kit'

import { WalletIcon } from '../components/WalletIcon'
import { useWalletExtension } from '../hooks'
import { WalletExtensionId } from '../providers/WalletExtensionProvider/types'
import styles from './SelectWalletPopup.module.scss'

export function SelectWalletPopup(): JSX.Element {
  const { walletsExtensions, connect } = useWalletExtension()
  const popup = usePopup()

  const onClick = async (walletExtensionId: WalletExtensionId): Promise<void> => {
    connect(walletExtensionId)
    popup.close()
  }

  return (
    <div className={styles.SelectWalletPopup}>
      {walletsExtensions.map(({ id, name, icon }) => (
        <Button
          key={id}
          className={styles.Button}
          title={name}
          customIcon={<WalletIcon icon={icon} />}
          onClick={(): Promise<void> => onClick(id)}
        />
      ))}
    </div>
  )
}
