export type Theme = {
  divider: string
  primaryAccent: string
  primaryBackground: string
  sidebarBackground: string
  surfaceDark: string
  surfaceGrey: string
  surfaceLight: string
  text: string
}

export const themeNames = ['light', 'dark'] as const

export type ThemeName = typeof themeNames[number]

export const themes: Record<ThemeName, Theme> = {
  dark: {
    divider: '#272727',
    primaryAccent: '#E72258',
    primaryBackground: '#161616',
    sidebarBackground: '#101010',
    surfaceDark: '#101010',
    surfaceGrey: '#5E5E5E',
    surfaceLight: '#191919',
    text: '#FFFFFF'
  },
  light: {
    divider: '#DCDCDC',
    primaryAccent: '#E72258',
    primaryBackground: '#F3F3F3',
    sidebarBackground: '#FFFFFF',
    surfaceDark: '#E4E4E4',
    surfaceGrey: '#ADADAD',
    surfaceLight: '#F6F6F6',
    text: '#101010'
  }
}
