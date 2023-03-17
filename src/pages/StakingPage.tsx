import { InfoCard, Tab } from '@onestaree/ui-kit'
import BigNumberJs from 'bignumber.js'
import classNames from 'classnames'
import { useMemo, useState } from 'react'

import { Page, TokenAmount, useSelector } from '~/features/core'
import {
  ClaimTab,
  StakeTab,
  UnstakeTab,
  convertSstarEthToEth,
  useConvertEthToUsd,
  useConvertSstarEthToUsd,
  useFetchStakingData,
  useSstarEthToEthRate
} from '~/features/staking'
import { selectStakerRateDiff } from '~/features/staking/store'
import { useAccount, useAccountBalance } from '~/features/wallet'

import styles from './StakingPage.module.scss'

export function StakingPage(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0)
  const { address } = useAccount()
  const balance = useAccountBalance('sstarETH')
  const convertEthToUsd = useConvertEthToUsd()
  const convertSstarEthToUsd = useConvertSstarEthToUsd()
  const sstarEthToEthRate = useSstarEthToEthRate()
  const stakerRateDiff = useSelector(selectStakerRateDiff)
  const { activeValidatorsCount, totalSstarEth, apr } = useFetchStakingData()
  const totalTvlInUsd = convertSstarEthToUsd(totalSstarEth.toWei()).toFormat(2)

  const totalTvlInEth = useMemo(
    () =>
      sstarEthToEthRate
        ? new BigNumberJs(totalSstarEth.toString())
            .multipliedBy(TokenAmount.fromWei('ETH', sstarEthToEthRate).toString())
            .toFormat(2)
        : 0,
    [sstarEthToEthRate, totalSstarEth]
  )

  const reward = useMemo(() => convertSstarEthToEth(balance.toWei(), stakerRateDiff), [balance, stakerRateDiff])

  const staked = useMemo(() => convertSstarEthToEth(balance.toWei(), sstarEthToEthRate), [balance, sstarEthToEthRate])

  const stakedUsd = useMemo(() => convertEthToUsd(staked.toString()), [staked, convertEthToUsd])

  return (
    <Page className={styles.StakingPage} title="Staking">
      <div>
        <div className={styles.Info}>
          <InfoCard className={styles.InfoCard} title="APR" info={`${apr.toFixed(4)}%`} variant="large" />
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
          <Tab title="Unstake" index={1} activeIndex={activeIndex} onClick={setActiveIndex} />
          <Tab title="Claim" index={2} activeIndex={activeIndex} onClick={setActiveIndex} />
        </div>
        <div className={styles.StakingContainer}>
          <div className={classNames(styles.TabsContent, styles.StakingColumn, { [styles.active]: activeIndex === 0 })}>
            <div className={classNames(styles.TabContent, { [styles.active]: activeIndex === 0 })}>
              <StakeTab />
            </div>
            <div className={classNames(styles.TabContent, { [styles.active]: activeIndex === 1 })}>
              <UnstakeTab />
            </div>
            <div className={classNames(styles.TabContent, { [styles.active]: activeIndex === 2 })}>
              <ClaimTab />
            </div>
          </div>
          <div className={styles.StakingColumn}>
            {address.length > 0 ? (
              <div className={styles.Info}>
                <InfoCard
                  className={styles.InfoCard}
                  title="My Stake"
                  info={`${TokenAmount.fromWei('ETH', staked.toString()).toDecimal(4)} ETH / $${stakedUsd.toFormat(2)}`}
                  variant="large"
                />
                <InfoCard
                  className={styles.InfoCard}
                  title="My Rewards"
                  info={`${TokenAmount.fromWei('ETH', reward.toString()).toDecimal(4)} ETH / $${convertEthToUsd(
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
