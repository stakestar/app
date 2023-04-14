import { Button, Typography } from '@onestaree/ui-kit'
import classNames from 'classnames'

import { ChainId, handleError } from '~/features/core'
import { useConnector } from '~/features/wallet'

import styles from './UnsupportedNetworkPopup.module.scss'

export function UnsupportedNetworkPopup(): JSX.Element {
  const { connector } = useConnector()

  const onClick = (isMainnet = true): void => {
    connector.connector.activate(isMainnet ? ChainId.Mainnet : ChainId.Goerli).catch((error: Error): void => {
      handleError(error, {
        message: error?.message,
        displayGenericMessage: true
      })
    })
  }

  return (
    <div className={styles.UnsupportedNetworkPopup}>
      <Typography>StakeStar pool is currently available on Goerli Testnet and Ethereum Mainnet</Typography>
      <div className={styles.Buttons}>
        <Button className={styles.Button} title="Switch to Ethereum Mainnet" onClick={onClick} />
        <Button
          className={classNames(styles.Button, styles.outlined)}
          title="Switch to Goerli Testnet"
          onClick={(): void => onClick(false)}
          type="outline"
        />
      </div>
    </div>
  )
}
