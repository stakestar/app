import { Button, usePopup } from '@onestaree/ui-kit'

import { popups } from '../../popups'

export function ConnectWalletButton(): JSX.Element {
  const popup = usePopup()

  return (
    <Button
      title="Connect Wallet"
      type="primary"
      size="large"
      onClick={(): void => popup.open(popups.selectWalletPopup)}
    />
  )
}
