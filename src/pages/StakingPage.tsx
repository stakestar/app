import { InfoCard, Tab } from '@onestaree/ui-kit'
import BigNumberJs from 'bignumber.js'
import classNames from 'classnames'
import { useMemo, useState } from 'react'

import { Page, TokenAmount, useSelector } from '~/features/core'
import {
  Faq,
  Stake,
  TVL,
  Unstake,
  convertSsETHToETH,
  useAccountSsEthBalance,
  useConvertEthToUsd,
  useConvertSsEthToUsd,
  useFetchStakingData,
  useSsEthToEthRate
} from '~/features/staking'
import { selectStakerRateDiff } from '~/features/staking/store'

import styles from './StakingPage.module.scss'

export function StakingPage(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0)
  const convertEthToUsd = useConvertEthToUsd()
  const convertSsEthToUsd = useConvertSsEthToUsd()
  const accauntSsEthBalance = useAccountSsEthBalance()
  const ssEthToEthRate = useSsEthToEthRate()
  const stakerRateDiff = useSelector(selectStakerRateDiff)
  const accauntSsEthBalanceInUsd = convertEthToUsd(accauntSsEthBalance.toWei()).toFormat(2)
  const { activeValidatorsCount, totalSsEthBalance, apr, dailyTvls } = useFetchStakingData()
  const totalTvlInUsd = convertSsEthToUsd(totalSsEthBalance.toWei()).toFormat(2)

  const totalTvlInEth = useMemo(
    () =>
      ssEthToEthRate
        ? new BigNumberJs(totalSsEthBalance.toString())
            .multipliedBy(TokenAmount.fromWei('ETH', ssEthToEthRate).toString())
            .toFormat(2)
        : 0,
    [ssEthToEthRate, totalSsEthBalance]
  )

  const reward = useMemo(
    () => convertSsETHToETH(accauntSsEthBalance.toWei(), stakerRateDiff),
    [accauntSsEthBalance, stakerRateDiff]
  )

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
          <InfoCard className={styles.InfoCard} title="APR" info={`${apr.toFixed(2)}%`} variant="large" />
          <InfoCard
            className={styles.InfoCard}
            title="Reward"
            info={`${TokenAmount.fromWei('ETH', reward.toString()).toDecimal(2)} ETH / $${convertEthToUsd(
              reward.toString()
            ).toFixed(2)}`}
            variant="large"
          />
          <InfoCard
            className={styles.InfoCard}
            title="Total TVL"
            info={`${totalTvlInEth} ETH / $${totalTvlInUsd}`}
            variant="large"
          />
          <InfoCard
            className={styles.InfoCard}
            title="Active validators"
            info={activeValidatorsCount}
            variant="large"
          />
        </div>
        <div className={styles.Tabs}>
          <Tab title="Stake" index={0} activeIndex={activeIndex} onClick={setActiveIndex} />
          <Tab title="Unstake" disabled={true} index={1} activeIndex={activeIndex} />
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
