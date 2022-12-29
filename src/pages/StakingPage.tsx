import { InfoCard, Tab } from '@onestaree/ui-kit'
import BigNumberJs from 'bignumber.js'
import classNames from 'classnames'
import { useMemo, useState } from 'react'

import { Page, TokenAmount, useSelector } from '~/features/core'
import {
  Faq,
  Stake,
  Unstake,
  convertSsETHToETH,
  useAccountSsEthBalance,
  useConvertEthToUsd,
  useConvertSsEthToUsd,
  useFetchStakingData,
  useSsEthToEthRate
} from '~/features/staking'
import { selectStakerRateDiff } from '~/features/staking/store'
import { useAccount } from '~/features/wallet'

import styles from './StakingPage.module.scss'

export function StakingPage(): JSX.Element {
  const { address } = useAccount()
  const [activeIndex, setActiveIndex] = useState(0)
  const convertEthToUsd = useConvertEthToUsd()
  const convertSsEthToUsd = useConvertSsEthToUsd()
  const accauntSsEthBalance = useAccountSsEthBalance()
  const ssEthToEthRate = useSsEthToEthRate()
  const stakerRateDiff = useSelector(selectStakerRateDiff)
  const { activeValidatorsCount, totalSsEthBalance, apr } = useFetchStakingData()
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

  const staked = useMemo(
    () => convertSsETHToETH(accauntSsEthBalance.toWei(), ssEthToEthRate),
    [accauntSsEthBalance, ssEthToEthRate]
  )

  const stakedUsd = useMemo(() => convertEthToUsd(staked.toString()), [staked, convertEthToUsd])

  return (
    <Page className={styles.StakingPage} title="Staking">
      <div>
        <div className={styles.Info}>
          <InfoCard className={styles.InfoCard} title="APR" info={`${apr.toFixed(2)}%`} variant="large" />
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
            {address.length > 0 ? (
              <div className={styles.Info}>
                <InfoCard
                  className={styles.InfoCard}
                  title="My Stake"
                  info={`${TokenAmount.fromWei('ETH', staked.toString()).toDecimal(2)} ETH / $${stakedUsd.toFormat(2)}`}
                  variant="large"
                />
                <InfoCard
                  className={styles.InfoCard}
                  title="My Rewards"
                  info={`${TokenAmount.fromWei('ETH', reward.toString()).toDecimal(2)} ETH / $${convertEthToUsd(
                    reward.toString()
                  ).toFixed(2)}`}
                  variant="large"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Page>
  )
}
