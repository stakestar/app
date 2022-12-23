import { UiKitProvider, UiKitProviderProps } from '@onestaree/ui-kit'
import { PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { ConnectorProvider as WalletProvider } from '~/features/wallet'

import { ContractsProvider } from './ContractsProvider'
import { ReduxProvider } from './ReduxProvider'

type ProvidersProps = PropsWithChildren & UiKitProviderProps

export function Providers({ forcedThemeName, children }: ProvidersProps): JSX.Element {
  return (
    <ReduxProvider>
      <WalletProvider>
        <UiKitProvider forcedThemeName={forcedThemeName}>
          <ContractsProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </ContractsProvider>
        </UiKitProvider>
      </WalletProvider>
    </ReduxProvider>
  )
}
