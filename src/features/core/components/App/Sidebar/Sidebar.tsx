import { Icon, Link, Switch, Typography, useTheme } from '@onestaree/ui-kit'
import classNames from 'classnames'
import { useLocation, useNavigate } from 'react-router-dom'

import { menu } from '../../../config'
import styles from './Sidebar.module.scss'

export function Sidebar(): JSX.Element {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { theme, themeName, setTheme } = useTheme()

  return (
    <div className={classNames(styles.Sidebar, '_backgroundColorTransition')}>
      <div className={styles.LogoContainer} onClick={(): void => navigate('/')}>
        <div className={styles.Logo} />
      </div>
      <ul className={styles.Menu}>
        {menu.map(({ title, path, url, soon }) => (
          <li
            key={title}
            className={classNames(styles.MenuItem, {
              _active: path === pathname || (path === '/' && pathname === '/iframe.html'), // iframe.html for Storybook,
              _MenuItem: !soon,
              [styles.soon]: soon
            })}
            onClick={(): void => {
              if (!soon) {
                if (path) {
                  navigate(path)
                } else if (url) {
                  window.open(url, '_blank', 'noopener noreferrer')
                }
              }
            }}
          >
            {title}
            {soon && <span className={styles.Badge}>Soon</span>}
          </li>
        ))}
      </ul>
      <div className={styles.Footer}>
        <ul className={styles.Links}>
          <li className={styles.LinksRow}>
            <Link href="https://stakestar.io/terms" target="_blank">
              <Typography variant="text2">T&Cs</Typography>
            </Link>
            <Link href="https://stakestar.io/privacy" target="_blank">
              <Typography variant="text2">Privacy Policy</Typography>
            </Link>
          </li>
          <li className={styles.LinksRow}>
            {/*<Icon icon="telegram" fillColor={theme.text} withHover />*/}
            <a href="https://twitter.com/stakestar_pool" target="_blank" rel="noopener noreferrer">
              <Icon icon="twitter" fillColor={theme.text} withHover />
            </a>
            {/*<Icon icon="medium" fillColor={theme.text} withHover />*/}
            <a className={styles.Icon} href="https://stakestar.io" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 512 512">
                <path d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48Z" />
                <path d="M256 48c-58.07 0-112.67 93.13-112.67 208S197.93 464 256 464s112.67-93.13 112.67-208S314.07 48 256 48Z" />
                <path d="M117.33 117.33c38.24 27.15 86.38 43.34 138.67 43.34s100.43-16.19 138.67-43.34M394.67 394.67c-38.24-27.15-86.38-43.34-138.67-43.34s-100.43 16.19-138.67 43.34" />
                <path d="M256 48v416M464 256H48" />
              </svg>
            </a>
          </li>
        </ul>
        <Switch
          checked={themeName === 'dark'}
          onClick={(): void => setTheme(themeName === 'light' ? 'dark' : 'light')}
          onIcon="moon"
          offIcon="sun"
          onIconSize={12}
          offIconSize={14}
          offColor={theme.divider}
        />
      </div>
    </div>
  )
}
