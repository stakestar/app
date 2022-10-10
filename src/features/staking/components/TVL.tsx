import { Typography, useTheme } from '@onestaree/ui-kit'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import styles from './TVL.module.scss'

const data = [
  { title: '12.09', value: 1000 },
  { title: '13.09', value: 5000 },
  { title: '14.09', value: 10000 },
  { title: '15.09', value: 15000 },
  { title: '16.09', value: 12000 },
  { title: '17.09', value: 20000 },
  { title: '18.09', value: 45000 },
  { title: '19.09', value: 30000 },
  { title: '20.09', value: 55000 }
]

export function TVL(): JSX.Element {
  const { theme } = useTheme()

  return (
    <div className={styles.TVL}>
      <Typography className={styles.Title} variant="h2">
        TVL
      </Typography>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Area type="natural" dataKey="value" stroke={theme.primaryAccent} fill={theme.primaryAccent} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
