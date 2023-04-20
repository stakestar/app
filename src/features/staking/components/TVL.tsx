import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { DailyTvls, TokenAmount, dayjs, formatThegraphIdToDate, toDecimal, tvlChartResultsCount } from '~/features/core'

import styles from './TVL.module.scss'

interface TvlProps {
  dailyTvls: DailyTvls
  totalTvl: TokenAmount
}

type TvlItem = {
  title: string
  value: number
}

export function TVL({ dailyTvls, totalTvl }: TvlProps): JSX.Element {
  const tvls = useMemo(() => {
    const result: TvlItem[] = []
    let lastId = 0

    const dayNumber = Math.floor(Date.now() / 86400000)
    let dailyTvlsForChart: DailyTvls = []

    if (dailyTvls.length && Number(dailyTvls[dailyTvls.length - 1].id) <= dayNumber) {
      if (Number(dailyTvls[dailyTvls.length - 1].id) === dayNumber) {
        dailyTvlsForChart = dailyTvls.slice(0, -1)
      } else {
        dailyTvlsForChart = dailyTvls
      }

      dailyTvlsForChart = [...dailyTvlsForChart, { id: dayNumber.toString(), totalETH: totalTvl.toWei() }]
    }

    for (const tvl of dailyTvlsForChart) {
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

    return result.slice(-tvlChartResultsCount)
  }, [dailyTvls, totalTvl])

  return (
    <div className={styles.TVL}>
      <div className={styles.FixResize}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={tvls}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis orientation="right" />
            <Tooltip
              content={({ active, payload, label }): JSX.Element =>
                active && payload && payload.length ? (
                  <div className={styles.Tooltip}>
                    <div className={styles.Date}>{formatDate(label)}</div>
                    <div className={styles.TVL}>TVL – {payload[0].value}</div>
                  </div>
                ) : (
                  <></>
                )
              }
            />
            <Area type="linear" dataKey="value" stroke="#1BA5F8" strokeWidth={3} fill="transparent" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function prepareDatumForChart(tvlDatum: { id: string; totalETH: bigint }): TvlItem {
  return {
    title: formatThegraphIdToDate(Number(tvlDatum.id)),
    value: Number(toDecimal(tvlDatum.totalETH.toString(), 18).toFormat(2))
  }
}

function formatDate(rawDate: string): string {
  const [date, month] = rawDate.split('/')

  return dayjs(`${month}/${date}/${new Date().getFullYear()}`).format('Do MMMM, YYYY')
}
