import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { DailyTvls, formatThegraphIdToDate } from '~/features/core'
import { toDecimal } from '~/features/core/utils/math'

import styles from './TVL.module.scss'

interface TvlProps {
  dailyTvls: DailyTvls
}

type TvlItem = {
  title: string
  value: number
}

const prepareDatumForChart = (tvlDatum: { id: string; totalETH: bigint }): TvlItem => {
  return {
    title: formatThegraphIdToDate(Number(tvlDatum.id)),
    value: Number(toDecimal(tvlDatum.totalETH.toString(), 18).toFormat(2))
  }
}

export function TVL({ dailyTvls }: TvlProps): JSX.Element {
  const [tvls, setTvls] = useState<TvlItem[]>([])

  useEffect(() => {
    const result: TvlItem[] = []
    let lastId = 0

    for (const tvl of dailyTvls) {
      const id = Number(tvl.id)

      if (lastId === 0) {
        lastId = id
      }

      while (lastId < id - 1) {
        result.push(
          prepareDatumForChart({
            id: (++lastId).toString(),
            totalETH: tvl.totalETH
          })
        )
      }

      result.push(prepareDatumForChart(tvl))
      lastId = id
    }

    setTvls(result)
  }, [dailyTvls])

  return (
    <div className={styles.TVL}>
      <div className={styles.FixResize}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={tvls}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis orientation="right" />
            <Tooltip formatter={(value): [string, string] => [value as string, 'TVL']} />
            <Area type="linear" dataKey="value" stroke="#f14d1d" strokeWidth={3} fill="transparent" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
