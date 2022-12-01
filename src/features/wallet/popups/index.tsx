import { PopupType } from '@onestaree/ui-kit'

import { AccountPopup } from './AccountPopup'
import { SelectWalletPopup } from './SelectWalletPopup'
import { UnsupportedNetworkPopup } from './UnsupportedNetworkPopup'

type PopupKey = 'selectWalletPopup' | 'accountPopup' | 'unsupportedNetworkPopup'

export const popups: Record<PopupKey, PopupType> = {
  selectWalletPopup: {
    title: 'Select Wallet',
    content: <SelectWalletPopup />
  },
  accountPopup: {
    title: 'Account',
    content: <AccountPopup />
  },
  unsupportedNetworkPopup: {
    title: 'Unsupported Network',
    content: <UnsupportedNetworkPopup />,
    options: {
      closeOnOverlayClick: false,
      hideCloseButton: true
    }
  }
}
