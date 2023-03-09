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
            key={path}
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
            <Link href="#" target="_self">
              <Typography variant="text2">T&Cs</Typography>
            </Link>
            <Link href="#" target="_self">
              <Typography variant="text2">Privacy Policy</Typography>
            </Link>
          </li>
          <li className={styles.LinksRow}>
            <Icon icon="telegram" fillColor={theme.text} withHover />
            <Icon icon="twitter" fillColor={theme.text} withHover />
            <Icon icon="medium" fillColor={theme.text} withHover />
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
