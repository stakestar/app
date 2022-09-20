import { InfoCard, Tab } from '@onestaree/ui-kit'
import classNames from 'classnames'
import { useState } from 'react'

import { Unstake } from '~/features/staking/components/Staking/Unstake'

import { useConvertSsEthToUsd } from '../../hooks'
import { Faq } from './Faq'
import { Stake } from './Stake'
import styles from './Staking.module.scss'
import { TVL } from './TVL'
import { useFetchStakingData } from './useFetchStakingData'

export function Staking(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0)
  const convertSsEthToUsd = useConvertSsEthToUsd()
  const { activeValidatorsCount, totalSsEthBalance } = useFetchStakingData()
  const totalTvl = convertSsEthToUsd(totalSsEthBalance.toWei()).toFormat(2)

  return (
    <div className={styles.Staking}>
      <div className={styles.Info}>
        <InfoCard className={styles.InfoCard} title="APR" info="0.00%" variant="large" />
        <InfoCard className={styles.InfoCard} title="APY" info="0.00%" variant="large" />
        <InfoCard className={styles.InfoCard} title="Reward" info="$0.00" variant="large" />
        <InfoCard className={styles.InfoCard} title="Total TVL" info={`$${totalTvl}`} variant="large" />
        <InfoCard className={styles.InfoCard} title="Active validators" info={activeValidatorsCount} variant="large" />
      </div>
      <div className={styles.Tabs}>
        <Tab title="Stake" index={0} activeIndex={activeIndex} onClick={setActiveIndex} />
        <Tab title="Unstake" index={1} activeIndex={activeIndex} onClick={setActiveIndex} />
      </div>
      <div className={styles.StakingContainer}>
        <div className={classNames(styles.TabsContent, styles.StakingColumn, { [styles.active]: activeIndex === 0 })}>
          <div className={classNames(styles.TabContent, { [styles.active]: activeIndex === 0 })}>
            <Stake />
          </div>
          <div className={classNames(styles.TabContent, { [styles.active]: activeIndex === 1 })}>
            <Unstake />
          </div>
          <Faq />
        </div>
        <div className={styles.StakingColumn}>
          <TVL />
        </div>
      </div>
    </div>
  )
}
