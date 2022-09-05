import { Button, usePopup } from '@onestaree/ui-kit'

import { WalletIcon } from '../components/WalletIcon'
import { useConnector } from '../hooks'
import { ConnectorId, WalletConnector } from '../providers/ConnectorProvider/types'
import styles from './SelectWalletPopup.module.scss'

export function SelectWalletPopup(): JSX.Element {
  const { connectors, connect } = useConnector()
  const popup = usePopup()

  const onClick = async (walletExtensionId: ConnectorId): Promise<void> => {
    connect(walletExtensionId)
    popup.close()
  }

  return (
    <div className={styles.SelectWalletPopup}>
      {(connectors.filter(({ id }) => id !== 'network') as WalletConnector[]).map(({ id, name, icon }) => (
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
