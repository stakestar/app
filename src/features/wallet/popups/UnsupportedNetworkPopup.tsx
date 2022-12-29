import { Button, Typography } from '@onestaree/ui-kit'

import { ChainId, handleError } from '~/features/core'
import { useConnector } from '~/features/wallet'

import styles from './UnsupportedNetworkPopup.module.scss'

export function UnsupportedNetworkPopup(): JSX.Element {
  const { connector } = useConnector()

  const onClick = (): Promise<void> =>
    connector.connector.activate(ChainId.Goerli).catch((error: Error): void => {
      handleError(error, {
        message: error?.message,
        displayGenericMessage: true
      })
    })

  return (
    <div className={styles.UnsupportedNetworkPopup}>
      <Typography>StakeStar pool is currently available on Goerli testnet only.</Typography>
      <Button className={styles.Button} title="Switch to Goerli testnet" onClick={onClick} size="small" />
    </div>
  )
}
