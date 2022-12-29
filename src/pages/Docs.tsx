import { Page } from '~/features/core'
import { Faq } from '~/features/staking'

import styles from './Docs.module.scss'

export function Docs(): JSX.Element {
  return (
    <Page className={styles.DocsPage} title="Docs">
      <Faq />
    </Page>
  )
}
