import { AuthCheck } from '../AuthCheck'
import { Account } from './Account'
import { ConnectWalletButton } from './ConnectWalletButton'

export function WalletControl(): JSX.Element {
  return (
    <AuthCheck fallback={<ConnectWalletButton />}>
      <Account />
    </AuthCheck>
  )
}
