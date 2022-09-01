import { PopupType } from '@onestaree/ui-kit'

import { AccountPopup } from './AccountPopup'
import { SelectWalletPopup } from './SelectWalletPopup'

type PopupKey = 'selectWalletPopup' | 'accountPopup'

export const popups: Record<PopupKey, PopupType> = {
  selectWalletPopup: {
    title: 'Select Wallet',
    content: <SelectWalletPopup />
  },
  accountPopup: {
    title: 'Account',
    content: <AccountPopup />
  }
}
