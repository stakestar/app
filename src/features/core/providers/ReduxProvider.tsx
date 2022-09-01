import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

import { configuredStore } from '../store/configuredStore'

export function ReduxProvider({ children }: PropsWithChildren): JSX.Element {
  return <Provider store={configuredStore}>{children}</Provider>
}
