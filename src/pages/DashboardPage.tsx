import { InfoCard, Table, TableProps, Typography } from '@onestaree/ui-kit'

import { Page } from '~/features/core'

import styles from './DashboardPage.module.scss'

type MyRowItem = {
  name: string
  value: string
  id: number
}

const tableProps: TableProps<MyRowItem> = {
  columns: [
    { title: 'ID', render: ({ id }) => <Typography>{id}</Typography> },
    { title: 'NAME', render: ({ name }) => <Typography>{name}</Typography> },
    { title: 'VALUE', render: ({ value }) => <Typography>{value}</Typography> },
    {
      title: ['NAME /', 'VALUE'],
      render: ({ name, value }) => (
        <Typography>
          {name} / {value}
        </Typography>
      )
    }
  ],
  rows: [
    { name: 'Hello 1', value: 'World 1', id: 1 },
    { name: 'Hello 2', value: 'World 2', id: 2 },
    { name: 'Hello 3', value: 'World 3', id: 3 }
  ],
  // eslint-disable-next-line no-console
  onRowClick: (rowIndex) => console.log(`rowIndex: ${rowIndex}`)
}

export function DashboardPage(): JSX.Element {
  return (
    <Page className={styles.DashboardPage} title="Dashboard">
      <div className={styles.Info}>
        <InfoCard className={styles.InfoCard} title="Some Info 1" info="0.00%" variant="large" />
        <InfoCard className={styles.InfoCard} title="Some Info 2" info="0.00%" variant="large" />
        <InfoCard className={styles.InfoCard} title="Some Info 3" info="$0.00" variant="large" />
        <InfoCard className={styles.InfoCard} title="Some Info 4" info="0.01" variant="large" />
        <InfoCard className={styles.InfoCard} title="Some Info 5" info="0.02" variant="large" />
        <InfoCard className={styles.InfoCard} title="Some Info 6" info="0.03" variant="large" />
      </div>
      <Table className={styles.Table} {...tableProps} />
    </Page>
  )
}
