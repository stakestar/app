import { UiKitProvider, UiKitProviderProps } from '@onestaree/ui-kit'
import { PropsWithChildren, StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { ConnectorProvider } from '~/features/wallet'

import { ContractsProvider, ReduxProvider } from '../../providers'

type ProvidersProps = PropsWithChildren & UiKitProviderProps

export function Providers({ forcedThemeName, children }: ProvidersProps): JSX.Element {
  return (
    <StrictMode>
      <ReduxProvider>
        <UiKitProvider forcedThemeName={forcedThemeName}>
          <ConnectorProvider>
            <ContractsProvider>
              <BrowserRouter>{children}</BrowserRouter>
            </ContractsProvider>
          </ConnectorProvider>
        </UiKitProvider>
      </ReduxProvider>
    </StrictMode>
  )
}
