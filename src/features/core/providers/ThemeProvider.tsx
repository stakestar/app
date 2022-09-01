import { PropsWithChildren, createContext, useMemo } from 'react'

import { useLocalStorage, usePrevious } from '../hooks'
import { Theme, ThemeName, themes } from '../themes'

export type ThemeProviderValue = {
  theme: Theme
  themeName: ThemeName
  setTheme: (theme: ThemeName) => void
}

export const ThemeProviderContext = createContext<ThemeProviderValue>({} as ThemeProviderValue)

export interface ThemeProviderProps extends PropsWithChildren {
  forcedThemeName?: ThemeName
}

export function ThemeProvider({ forcedThemeName, children }: ThemeProviderProps): JSX.Element {
  const [themeName, setThemeName] = useLocalStorage<ThemeName>('theme', 'dark')
  const previousForcedThemeName = usePrevious(forcedThemeName)
  const currentThemeName = (forcedThemeName !== previousForcedThemeName ? forcedThemeName : themeName) || themeName // Support Storybook (forcedThemeName)

  const value = useMemo(
    (): ThemeProviderValue => ({
      themeName,
      theme: themes[themeName],
      setTheme: (newThemeName: ThemeName): void => setThemeName(newThemeName)
    }),
    [setThemeName, themeName]
  )

  initThemeVariables(currentThemeName)

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

function initThemeVariables(themeName: ThemeName): void {
  const theme = themes[themeName]

  const cssVariables: Record<string, string> = {
    '--dividerColor': theme.divider,
    '--primaryAccentColor': theme.primaryAccent,
    '--primaryBackgroundColor': theme.primaryBackground,
    '--sidebarBackgroundColor': theme.sidebarBackground,
    '--surfaceDarkColor': theme.surfaceDark,
    '--surfaceGreyColor': theme.surfaceGrey,
    '--surfaceLightColor': theme.surfaceLight,
    '--textColor': theme.text
  }

  window.document.body.className = `_theme _${themeName}`

  for (const cssVariable in cssVariables) {
    window.document.body.style.setProperty(cssVariable, cssVariables[cssVariable])
  }
}
