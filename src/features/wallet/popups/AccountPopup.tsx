import Davatar from '@davatar/react'
import { Button, Link, Typography, usePopup } from '@onestaree/ui-kit'

import { copyToClipboard, getExplorerUrl } from '~/features/core'

import { WalletIcon } from '../components/WalletIcon'
import { useAccount, useConnector } from '../hooks'
import { popups } from '../popups'
import { cropWalletAddress } from '../utils'
import styles from './AccountPopup.module.scss'

export function AccountPopup(): JSX.Element {
  const popup = usePopup()
  const { address } = useAccount()
  const { disconnect, connector } = useConnector()

  const onClickDisconnect = (): void => {
    popup.close()
    popup.open(popups.selectWalletPopup)
    disconnect()
  }

  return (
    <div className={styles.AccountPopup}>
      <div className={styles.Wallet}>
        {connector.id !== 'network' && <WalletIcon icon={connector.icon} />}
        <Davatar size={32} address={address} generatedAvatarType="jazzicon" />
        <div className={styles.Account}>
          <Typography className={styles.Address} variant="text1">
            {cropWalletAddress(address, 13)}
          </Typography>
        </div>
      </div>
      <div className={styles.AccountControls}>
        <Link icon="copy" onClick={(): void => copyToClipboard(address)}>
          Copy address
        </Link>
        <Link icon="external" href={`${getExplorerUrl('address', address)}`}>
          View on Etherscan
        </Link>
      </div>
      <div className={styles.Footer}>
        <Button className={styles.Disconnect} title="Disconnect" type="outline" onClick={onClickDisconnect} />
      </div>
    </div>
  )
}
