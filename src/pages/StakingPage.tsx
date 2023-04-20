import { Button, InfoCard, Tab } from '@onestaree/ui-kit'
import classNames from 'classnames'
import { useEffect, useMemo, useState } from 'react'

import { Page, TokenAmount, capitalizeText, emitEvent, getLocationHash, setLocationHash } from '~/features/core'
import {
  ClaimTab,
  STAKING_EVENT_CLAIM,
  StakeTab,
  UnstakeTab,
  convertSstarEthToEth,
  useConvertEthToUsd,
  useFetchStakingData,
  usePendingUnstake
} from '~/features/staking'
import { AuthCheck, useAccountBalance } from '~/features/wallet'

import styles from './StakingPage.module.scss'

const tabs = ['stake', 'unstake', 'claim']

export function StakingPage(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0)
  const balance = useAccountBalance('sstarETH')
  const convertEthToUsd = useConvertEthToUsd()
  const { activeValidatorsCount, apr, pendingUnstakeQueueIndex, sstarEthToEthRate, stakerRateDiff, totalTvl } =
    useFetchStakingData()
  const totalTvlInUsd = convertEthToUsd(totalTvl).toFormat(2)
  const totalTvlTokenAmount = useMemo(() => TokenAmount.fromWei('ETH', totalTvl), [totalTvl])
  const reward = useMemo(() => convertSstarEthToEth(balance.toWei(), stakerRateDiff), [balance, stakerRateDiff])
  const staked = useMemo(() => convertSstarEthToEth(balance.toWei(), sstarEthToEthRate), [balance, sstarEthToEthRate])
  const stakedUsd = useMemo(() => convertEthToUsd(staked.toString()), [staked, convertEthToUsd])
  const pendingUnstake = usePendingUnstake()

  const onClickTab = (index: number): void => {
    setActiveIndex(index)
    setLocationHash(tabs[index])
  }

  const onClickClaim = (): void => {
    setActiveIndex(2)
    emitEvent(STAKING_EVENT_CLAIM)
  }

  useEffect(() => {
    const hash = getLocationHash()
    const index = tabs.indexOf(hash)

    setActiveIndex(index > 0 ? index : 0)
  }, [])

  return (
    <Page className={styles.StakingPage} title="Staking">
      <div>
        <div className={styles.Info}>
          <InfoCard className={styles.InfoCard} title="APR" info={`${apr.toFixed(4)}%`} variant="large" />
          <InfoCard
            className={styles.InfoCard}
            title="Total TVL"
            info={`${totalTvlTokenAmount.toDecimal(2)} ETH / $${totalTvlInUsd}`}
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
          {tabs.map((title, index) => (
            <Tab
              key={index}
              title={capitalizeText(title)}
              index={index}
              activeIndex={activeIndex}
              onClick={onClickTab}
            />
          ))}
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
            <AuthCheck>
              <div className={styles.Info}>
                <InfoCard
                  className={styles.InfoCard}
                  title="My Stake"
                  info={`${TokenAmount.fromWei('ETH', staked.toString()).toDecimal(4)} ETH / $${stakedUsd.toFormat(2)}`}
                  variant="small"
                />
                {(pendingUnstake.toBigNumber().gt(0) || !!pendingUnstakeQueueIndex) && (
                  <InfoCard
                    className={styles.InfoCard}
                    title={pendingUnstakeQueueIndex ? 'Ready to Claim' : 'Pending Unstake'}
                    info={
                      <div className={styles.PendingUnstake}>
                        {`${pendingUnstake.toDecimal(4)} ETH`}
                        {!!pendingUnstakeQueueIndex && (
                          <Button
                            className={styles.ClaimButton}
                            onClick={onClickClaim}
                            title="Claim"
                            type="outline"
                            size="small"
                          />
                        )}
                      </div>
                    }
                    variant="small"
                  />
                )}
                <InfoCard
                  className={styles.InfoCard}
                  title="My Rewards"
                  info={`${TokenAmount.fromWei('ETH', reward.toString()).toDecimal(4)} ETH / $${convertEthToUsd(
                    reward.toString()
                  ).toFixed(2)}`}
                  variant="small"
                />
              </div>
            </AuthCheck>
          </div>
        </div>
      </div>
    </Page>
  )
}
