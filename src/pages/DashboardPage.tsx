import { InfoCard, Table, TableProps, Typography } from '@onestaree/ui-kit'
import { useEffect, useMemo, useState } from 'react'

import { Page, TokenAmount, getOperatorsIds } from '~/features/core'
import { handleError, ssvClient } from '~/features/core'
import { TVL, useConvertEthToUsd, useFetchStakingData } from '~/features/staking'

import styles from './DashboardPage.module.scss'

type Operator = {
  id: number
  name: string
  validators: number
  hosting: string
  performance: string
}

const tableProps: TableProps<Operator> = {
  columns: [
    { title: 'ID', render: ({ id }) => <Typography>{id}</Typography> },
    { title: 'NAME', render: ({ name }) => <Typography>{name}</Typography> },
    { title: 'VALIDATORS', render: ({ validators }) => <Typography>{validators}</Typography> },
    { title: 'HOSTING', render: ({ hosting }) => <Typography>{hosting}</Typography> },
    {
      title: 'PERFORMANCE',
      render: ({ performance }) => <Typography>{parseFloat(performance).toFixed(2)}%</Typography>
    }
  ],
  rows: [],
  // eslint-disable-next-line no-console
  onRowClick: (rowIndex) => console.log(`rowIndex: ${rowIndex}`)
}

export function DashboardPage(): JSX.Element {
  const convertEthToUsd = useConvertEthToUsd()
  const operatorsIds = getOperatorsIds()
  const { activeValidatorsCount, apr, dailyTvls, totalTvl } = useFetchStakingData()
  const totalTvlInUsd = convertEthToUsd(totalTvl).toFormat(2)
  const totalTvlTokenAmount = useMemo(() => TokenAmount.fromWei('ETH', totalTvl), [totalTvl])
  const [rows, setRows] = useState<Operator[]>([])

  useEffect(() => {
    const promises = []
    for (let i = 0; i < operatorsIds.length; i++) {
      promises.push(ssvClient.get(`/operators/${operatorsIds[i]}`))
    }

    Promise.all(promises)
      .then((responses) => {
        setRows(
          responses.map(
            (response): Operator => ({
              id: response.data.id,
              name: response.data.name,
              validators: activeValidatorsCount,
              hosting: 'N/A',
              performance: response.data.performance['24h']
            })
          )
        )
      })
      .catch(handleError)
  }, [operatorsIds, activeValidatorsCount])

  return (
    <Page className={styles.DashboardPage} title="Dashboard">
      <div className={styles.Info}>
        <InfoCard className={styles.InfoCard} title="APR" info={`${apr.toFixed(4)}%`} variant="large" />
        <InfoCard
          className={styles.InfoCard}
          title="Total TVL"
          info={`${totalTvlTokenAmount.toDecimal(2)} ETH / $${totalTvlInUsd}`}
          variant="large"
        />{' '}
        <InfoCard
          className={styles.InfoCard}
          title="Active validators"
          info={`${activeValidatorsCount}`}
          variant="large"
        />
      </div>
      <Typography className={styles.Title} variant="h2">
        Total Eth Staked
      </Typography>
      <div className={styles.Tvl}>
        <TVL dailyTvls={dailyTvls} totalTvl={totalTvlTokenAmount} />
      </div>
      <Typography className={styles.Title} variant="h2">
        Node operators
      </Typography>
      <Table<Operator>
        className={styles.Table}
        columns={tableProps.columns}
        rows={rows}
        onRowClick={tableProps.onRowClick}
      />
    </Page>
  )
}
