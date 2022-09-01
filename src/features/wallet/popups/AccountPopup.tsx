import Davatar from '@davatar/react'
import { Button, Link, Typography, usePopup } from '@onestaree/ui-kit'

import { copyToClipboard, useExplorerUrl } from '~/features/core'

import { WalletIcon } from '../components/WalletIcon'
import { useAccount, useWalletExtension } from '../hooks'
import { popups } from '../popups'
import { cropWalletAddress } from '../utils'
import styles from './AccountPopup.module.scss'

export function AccountPopup(): JSX.Element {
  const popup = usePopup()
  const { address } = useAccount()
  const { disconnect, walletExtension } = useWalletExtension()

  const onClickDisconnect = (): void => {
    popup.close()
    popup.open(popups.selectWalletPopup)
    disconnect()
  }

  return (
    <div className={styles.AccountPopup}>
      <div className={styles.Wallet}>
        <WalletIcon icon={walletExtension.icon} />
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
        <Link icon="external" href={`${useExplorerUrl('address', address)}`}>
          View on explorer
        </Link>
      </div>
      <div className={styles.Footer}>
        <Button
          className={styles.Disconnect}
          title="Disconnect"
          size="small"
          type="outline"
          onClick={onClickDisconnect}
        />
      </div>
    </div>
  )
}
