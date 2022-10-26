import { InfoCard, Table, TableProps, Typography } from '@onestaree/ui-kit'

import { Page } from '~/features/core'

import styles from './DashboardPage.module.scss'

type MyRowItem = {
  id: number
  name: string
  validators: string
  hosting: string
  performance: string
}

const tableProps: TableProps<MyRowItem> = {
  columns: [
    { title: 'ID', render: ({ id }) => <Typography>{id}</Typography> },
    { title: 'NAME', render: ({ name }) => <Typography>{name}</Typography> },
    { title: 'VALIDATORS', render: ({ validators }) => <Typography>{validators}</Typography> },
    { title: 'HOSTING', render: ({ hosting }) => <Typography>{hosting}</Typography> },
    { title: 'PERFORMANCE', render: ({ performance }) => <Typography>{performance}</Typography> }
  ],
  rows: [
    { id: 11, name: 'Allnodes', validators: '3', hosting: 'AWS', performance: '99.2%' },
    { id: 23, name: 'Onestar', validators: '3', hosting: 'GCP', performance: '98.2%' },
    { id: 30, name: 'SafeStake', validators: '3', hosting: 'Azure', performance: '99.4%' },
    { id: 400, name: 'BloxStaking', validators: '3', hosting: 'AWS', performance: '99.1%' }
  ],
  // eslint-disable-next-line no-console
  onRowClick: (rowIndex) => console.log(`rowIndex: ${rowIndex}`)
}

export function DashboardPage(): JSX.Element {
  return (
    <Page className={styles.DashboardPage} title="Dashboard">
      <div className={styles.Info}>
        <InfoCard className={styles.InfoCard} title="TVL" info="$30,21.69" variant="large" />
        <InfoCard className={styles.InfoCard} title="$321.69" info="3" variant="large" />
        <InfoCard className={styles.InfoCard} title="Operators in the Pool" info="4" variant="large" />
      </div>
      <Table className={styles.Table} {...tableProps} />
    </Page>
  )
}
