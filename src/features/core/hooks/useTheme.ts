import { useContext } from 'react'

import { ThemeProviderContext, ThemeProviderValue } from '../providers'

export function useTheme(): ThemeProviderValue {
  return useContext(ThemeProviderContext)
}
