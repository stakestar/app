import { PopupType } from '@onestaree/ui-kit'

import { AccountPopup } from './AccountPopup'
import { SelectWalletPopup } from './SelectWalletPopup'
import { UnsupportedNetworkPopup } from './UnsupportedNetworkPopup'

type PopupKey = 'selectWalletPopup' | 'accountPopup' | 'unsupportedNetworkPopup'

export const popups: Record<PopupKey, PopupType> = {
  selectWalletPopup: {
    id: 'selectWalletPopup',
    title: 'Select Wallet',
    content: <SelectWalletPopup />
  },
  accountPopup: {
    id: 'accountPopup',
    title: 'Account',
    content: <AccountPopup />
  },
  unsupportedNetworkPopup: {
    id: 'unsupportedNetworkPopup',
    title: 'Unsupported Network',
    content: <UnsupportedNetworkPopup />,
    options: {
      closeOnOverlayClick: false,
      hideCloseButton: true
    }
  }
}
