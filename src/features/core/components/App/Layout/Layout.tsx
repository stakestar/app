import classNames from 'classnames'

import { WalletControl } from '~/features/wallet'

import { useSelector } from '../../../hooks'
import { selectIsAppReady } from '../../../store'
import { Sidebar } from '../Sidebar'
import styles from './Layout.module.scss'
import { Loading } from './Loading'
import { Router } from './Router'

export function Layout(): JSX.Element {
  const isAppReady = useSelector(selectIsAppReady)

  return (
    <div className={classNames(styles.Layout, '_backgroundColorTransition')}>
      <div className={classNames(styles.Header)}>{isAppReady && <WalletControl />}</div>
      <Sidebar />
      <main className={styles.Content}>{isAppReady ? <Router /> : <Loading />}</main>
    </div>
  )
}
