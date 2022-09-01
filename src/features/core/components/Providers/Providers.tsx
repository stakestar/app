import { Providers as UiKitProviders } from '@onestaree/ui-kit'
import { PropsWithChildren, StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { WalletExtensionProvider } from '~/features/wallet'

import { ReduxProvider, ThemeProvider, ThemeProviderProps } from '../../providers'

type ProvidersProps = PropsWithChildren & ThemeProviderProps

export function Providers({ forcedThemeName, children }: ProvidersProps): JSX.Element {
  return (
    <StrictMode>
      <ReduxProvider>
        <WalletExtensionProvider>
          <UiKitProviders forcedThemeName={forcedThemeName}>
            <ThemeProvider forcedThemeName={forcedThemeName}>
              <BrowserRouter>{children}</BrowserRouter>
            </ThemeProvider>
          </UiKitProviders>
        </WalletExtensionProvider>
      </ReduxProvider>
    </StrictMode>
  )
}
