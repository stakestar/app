import { Button, Typography } from '@onestaree/ui-kit'

import { ChainId, getDefaultChainId, handleError } from '~/features/core'
import { useConnector } from '~/features/wallet'

import styles from './UnsupportedNetworkPopup.module.scss'

export function UnsupportedNetworkPopup(): JSX.Element {
  const { connector } = useConnector()

  const onClick = (): void => {
    connector.connector.activate(getDefaultChainId()).catch((error: Error): void => {
      handleError(error, {
        message: error?.message,
        displayGenericMessage: true
      })
    })
  }

  const networkName = getDefaultChainId() === ChainId.Mainnet ? 'Ethereum Mainnet' : 'Goerli Testnet'

  return (
    <div className={styles.UnsupportedNetworkPopup}>
      <Typography>StakeStar pool is currently available on {networkName}</Typography>
      <div className={styles.Buttons}>
        <Button className={styles.Button} title={`Switch to ${networkName}`} onClick={onClick} />
      </div>
    </div>
  )
}
