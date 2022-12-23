import '~/features/core/styles/index.scss'

import { Buffer } from 'buffer'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '~/features/core/components/App'
import { Providers } from '~/features/core/providers'

window.Buffer = window.Buffer || Buffer

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
)
