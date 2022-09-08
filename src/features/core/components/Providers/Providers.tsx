import { UiKitProvider } from '@onestaree/ui-kit'
import { PropsWithChildren, StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { ConnectorProvider } from '~/features/wallet'

import { ContractsProvider, GraphQLProvider, ReduxProvider, ThemeProvider, ThemeProviderProps } from '../../providers'

type ProvidersProps = PropsWithChildren & ThemeProviderProps

export function Providers({ forcedThemeName, children }: ProvidersProps): JSX.Element {
  return (
    <StrictMode>
      <ReduxProvider>
        <ConnectorProvider>
          <ContractsProvider>
            <UiKitProvider forcedThemeName={forcedThemeName}>
              <ThemeProvider forcedThemeName={forcedThemeName}>
                <GraphQLProvider>
                  <BrowserRouter>{children}</BrowserRouter>
                </GraphQLProvider>
              </ThemeProvider>
            </UiKitProvider>
          </ContractsProvider>
        </ConnectorProvider>
      </ReduxProvider>
    </StrictMode>
  )
}
