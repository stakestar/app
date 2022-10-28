import { InfoCard, Tab } from '@onestaree/ui-kit'
import classNames from 'classnames'
import { useState } from 'react'

import { Page } from '~/features/core'
import {
  Faq,
  Stake,
  TVL,
  Unstake,
  useAccountSsEthBalance,
  useConvertEthToUsd,
  useConvertSsEthToUsd,
  useFetchStakingData
} from '~/features/staking'

import styles from './StakingPage.module.scss'

export function StakingPage(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0)
  const convertEthToUsd = useConvertEthToUsd()
  const convertSsEthToUsd = useConvertSsEthToUsd()
  const accauntSsEthBalance = useAccountSsEthBalance()
  const accauntSsEthBalanceInUsd = convertEthToUsd(accauntSsEthBalance.toWei()).toFormat(2)
  const { activeValidatorsCount, totalSsEthBalance, dailyTvls } = useFetchStakingData()
  const totalTvl = convertSsEthToUsd(totalSsEthBalance.toWei()).toFormat(2)

  return (
    <Page className={styles.StakingPage} title="Staking">
      <div>
        <div className={styles.Info}>
          <InfoCard
            className={styles.InfoCard}
            title="Staked"
            info={`${accauntSsEthBalance.toDecimal(2)} ETH / $${accauntSsEthBalanceInUsd}`}
            variant="large"
          />
          <InfoCard className={styles.InfoCard} title="APR" info="0.00%" variant="large" />
          <InfoCard className={styles.InfoCard} title="APY" info="0.00%" variant="large" />
          <InfoCard className={styles.InfoCard} title="Reward" info="$0.00" variant="large" />
          <InfoCard className={styles.InfoCard} title="Total TVL" info={`$${totalTvl}`} variant="large" />
          <InfoCard
            className={styles.InfoCard}
            title="Active validators"
            info={activeValidatorsCount}
            variant="large"
          />
        </div>
        <div className={styles.Tabs}>
          <Tab title="Stake" index={0} activeIndex={activeIndex} onClick={setActiveIndex} />
          <Tab title="Unstake" disabled={true} index={1} activeIndex={activeIndex} onClick={setActiveIndex} />
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
            <TVL dailyTvls={dailyTvls} />
          </div>
        </div>
      </div>
    </Page>
  )
}
