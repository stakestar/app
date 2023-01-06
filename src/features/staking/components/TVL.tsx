import { useTheme } from '@onestaree/ui-kit'
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

export function TVL({ dailyTvls }: TvlProps): JSX.Element {
  const { theme } = useTheme()

  const [tvls, setTvls] = useState<TvlItem[]>([])

  useEffect(() => {
    const tvlForChart = dailyTvls.map((tvl) => {
      return {
        title: formatThegraphIdToDate(Number(tvl.id)),
        value: Number(toDecimal(tvl.totalETH.toString(), 18).toFormat(2))
      }
    })
    setTvls(tvlForChart)
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
            <Area type="linear" dataKey="value" stroke={theme.primaryAccent} fill={theme.primaryAccent} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
