import './Sidebar.css'

import { Icon, Link, Switch, Typography } from '@onestaree/ui-kit'
import classNames from 'classnames'
import { useLocation, useNavigate } from 'react-router-dom'

import { menu } from '../../config'
import { useTheme } from '../../hooks'
import styles from './Sidebar.module.scss'

export function Sidebar(): JSX.Element {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { theme, themeName, setTheme } = useTheme()

  return (
    <div className={classNames(styles.Sidebar, '_backgroundColorTransition')}>
      <div className={styles.Logo} onClick={(): void => navigate('/')}>
        <Typography variant="h2">StakeStar</Typography>
      </div>
      <ul className={styles.Menu}>
        {menu.map(({ title, path, soon }) => (
          <li
            key={path}
            className={classNames(styles.MenuItem, {
              _active: path === pathname || (path === '/' && pathname === '/iframe.html'), // iframe.html for Storybook,
              _MenuItem: !soon,
              [styles.soon]: soon
            })}
            onClick={(): void => {
              if (!soon) {
                navigate(path)
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
            <Icon icon="telegram" withHover />
            <Icon icon="twitter" withHover />
            <Icon icon="medium" withHover />
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
