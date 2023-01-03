// TODO: Uncomment this after @stakestar/contracts update
import { ValidatorStatus } from '@stakestar/contracts'
import { getBuiltGraphSDK } from '@stakestar/subgraph-client'
import BigNumberJs from 'bignumber.js'
import { useEffect } from 'react'

import { DailyTvls, TokenAmount, handleError, useContracts, useDispatch, useSelector } from '~/features/core'
import { useAccount } from '~/features/wallet'

import {
  selectActiveValidatorsCount,
  selectApr,
  selectDailyTvls,
  selectEthPriceUSD,
  selectSsEthPriceUSD,
  selectTotalSsEthBalance,
  setAccountSsEthBalance,
  setActiveValidatorsCount,
  setApr,
  setDailyTvls,
  setEthPriceUSD,
  setSsEthPriceUSD,
  setSsEthToEthRate,
  setStakerRateDiff,
  setTotalSsEthBalance
} from '../../store'
import { calculateApr } from '../../utils'
import { useAccountSsEthBalance } from '../useAccountSsEthBalance'
import { loadEthPriceUsd } from './loadEthPriceUsd'

const sdk = getBuiltGraphSDK() // TODO: move it to provider?

export function useFetchStakingData(): {
  activeValidatorsCount: number
  accountSsEthBalance: TokenAmount
  totalSsEthBalance: TokenAmount
  ethPriceUSD: string
  ssEthPriceUSD: string
  apr: number
  dailyTvls: DailyTvls
} {
  const dispatch = useDispatch()
  const { stakeStarContract, stakeStarEthContract, stakeStarRegistryContract } = useContracts()
  const { address } = useAccount()
  const accountSsEthBalance = useAccountSsEthBalance()
  const activeValidatorsCount = useSelector(selectActiveValidatorsCount)
  const totalSsEthBalance = useSelector(selectTotalSsEthBalance)
  const apr = useSelector(selectApr)
  const ethPriceUSD = useSelector(selectEthPriceUSD)
  const ssEthPriceUSD = useSelector(selectSsEthPriceUSD)
  const dailyTvls = useSelector(selectDailyTvls)

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('StakeStar address', stakeStarContract.address)

    Promise.all([
      loadEthPriceUsd(),
      stakeStarEthContract.totalSupply(),
      stakeStarContract.currentApproximateRate(),
      stakeStarEthContract.rate(),
      sdk.getTokenRateDailies({ first: 7 }).then(({ tokenRateDailies }) => tokenRateDailies),
      stakeStarContract.currentApproximateRate(),
      stakeStarRegistryContract.countValidatorPublicKeys(ValidatorStatus.ACTIVE),
      sdk.getStakeStarTvls({ first: 10 }).then(({ stakeStarTvls }) => stakeStarTvls)
    ])
      .then(
        ([
          ethPriceUsd,
          stakeStarTvl,
          currentApproximateRate,
          rate,
          tokenRateDailies,
          ssEthToEth,
          countValidatorPublicKeys,
          dailyTvlsData
        ]) => {
          dispatch(setApr(calculateApr(tokenRateDailies)))
          dispatch(setEthPriceUSD(ethPriceUsd))
          dispatch(
            setSsEthPriceUSD(
              new BigNumberJs(ssEthToEth.toString())
                .shiftedBy(-18)
                .multipliedBy(new BigNumberJs(ethPriceUsd))
                .toString()
            )
          )
          dispatch(setTotalSsEthBalance(stakeStarTvl.toString()))
          dispatch(setSsEthToEthRate(ssEthToEth.toString()))
          dispatch(setActiveValidatorsCount(countValidatorPublicKeys.toNumber()))
          dispatch(setDailyTvls(dailyTvlsData))
          // eslint-disable-next-line no-console
          console.log(`[DEBUG] Rate = ${rate.toString()}`)
          // eslint-disable-next-line no-console
          console.log(`[DEBUG] Current Approximate Rate = ${currentApproximateRate.toString()}`)
        }
      )
      .catch(handleError)
  }, [dispatch, stakeStarContract, stakeStarEthContract, stakeStarRegistryContract])

  useEffect(() => {
    if (address) {
      Promise.all([
        sdk
          .getStakerAtMomentRate({ stakerId: address.toLowerCase() })
          .then(({ stakerAtMomentRate }) => stakerAtMomentRate),
        stakeStarContract.currentApproximateRate(),
        // TODO: Refactor stakeStarEthContract.balanceOf to useFetchAccountSsEthBalance
        stakeStarEthContract.balanceOf(address)
      ])
        .then(([stakerAtMomentRate, currentRate, ssEthBalance]) => {
          if (stakerAtMomentRate?.atMomentRate) {
            const rateDiff = currentRate.sub(stakerAtMomentRate?.atMomentRate)
            dispatch(setStakerRateDiff(rateDiff.toString()))
          }
          dispatch(setAccountSsEthBalance(TokenAmount.fromWei('ssETH', ssEthBalance.toString()).toEncoded()))
        })
        .catch(handleError)
    }
  }, [address, dispatch, stakeStarContract, stakeStarEthContract])

  return {
    activeValidatorsCount,
    accountSsEthBalance,
    totalSsEthBalance,
    ethPriceUSD,
    ssEthPriceUSD,
    apr,
    dailyTvls
  }
}
