// TODO: Uncomment this after @stakestar/contracts update
import { ValidatorStatus } from '@stakestar/contracts'
import { getBuiltGraphSDK } from '@stakestar/subgraph-client'
import BigNumberJs from 'bignumber.js'
import { useEffect } from 'react'

import { DailyTvls, TokenAmount, handleError, useContracts, useDispatch, useSelector } from '~/features/core'
import { useAccount } from '~/features/wallet'

import {
  selectActiveValidatorsCount,
  selectDailyApr,
  selectDailyTvls,
  selectEthPriceUSD,
  selectSsEthPriceUSD,
  selectTotalSsEthBalance,
  setAccountSsEthBalance,
  setActiveValidatorsCount,
  setDailyApr,
  setDailyTvls,
  setEthPriceUSD,
  setSsEthPriceUSD,
  setSsEthToEthRate,
  setStakerRateDiff,
  setTotalSsEthBalance
} from '../../store'
import { calculateDailyApr } from '../../utils'
import { useAccountSsEthBalance } from '../useAccountSsEthBalance'
import { loadEthPriceUsd } from './loadEthPriceUsd'

const sdk = getBuiltGraphSDK() // TODO: move it to provider?

export function useFetchStakingData(): {
  activeValidatorsCount: number
  accountSsEthBalance: TokenAmount
  totalSsEthBalance: TokenAmount
  ethPriceUSD: string
  ssEthPriceUSD: string
  dailyApr: number
  dailyTvls: DailyTvls
} {
  const dispatch = useDispatch()
  const { stakeStarContract, stakeStarEthContract, stakeStarRegistryContract } = useContracts()
  const { address } = useAccount()
  const accountSsEthBalance = useAccountSsEthBalance()
  const activeValidatorsCount = useSelector(selectActiveValidatorsCount)
  const totalSsEthBalance = useSelector(selectTotalSsEthBalance)
  const dailyApr = useSelector(selectDailyApr)
  const ethPriceUSD = useSelector(selectEthPriceUSD)
  const ssEthPriceUSD = useSelector(selectSsEthPriceUSD)
  const dailyTvls = useSelector(selectDailyTvls)

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('stakeStar address:', stakeStarContract.address)

    Promise.all([
      loadEthPriceUsd(),
      stakeStarEthContract.totalSupply(),
      sdk.getTokenRateDailies().then(({ tokenRateDailies }) => tokenRateDailies),
      stakeStarEthContract.ssETH_to_ETH(TokenAmount.fromDecimal('ssETH', 1).toWei()),
      stakeStarRegistryContract.countValidatorPublicKeys(ValidatorStatus.CREATED),
      sdk.getStakeStarTvls({ first: 10 }).then(({ stakeStarTvls }) => stakeStarTvls)
    ])
      .then(([ethPriceUsd, stakeStarTvl, tokenRateDailies, ssEthToEth, countValidatorPublicKeys, dailyTvlsData]) => {
        // eslint-disable-next-line no-console
        console.log(countValidatorPublicKeys)
        dispatch(setDailyApr(calculateDailyApr(tokenRateDailies)))
        dispatch(setEthPriceUSD(ethPriceUsd))
        dispatch(
          setSsEthPriceUSD(
            new BigNumberJs(ssEthToEth.toString()).shiftedBy(-18).multipliedBy(new BigNumberJs(ethPriceUsd)).toString()
          )
        )
        dispatch(setTotalSsEthBalance(stakeStarTvl.toString()))
        dispatch(setSsEthToEthRate(ssEthToEth.toString()))
        dispatch(setActiveValidatorsCount(countValidatorPublicKeys))
        dispatch(setDailyTvls(dailyTvlsData))
      })
      .catch(handleError)
  }, [dispatch, stakeStarContract, stakeStarEthContract, stakeStarRegistryContract])

  useEffect(() => {
    if (address) {
      Promise.all([
        sdk.getStakerAtMomentRate({ stakerId: address }).then(({ stakerAtMomentRate }) => stakerAtMomentRate),
        stakeStarEthContract.rate(),
        // TODO: Refactor stakeStarEthContract.balanceOf to useFetchAccountSsEthBalance
        stakeStarEthContract.balanceOf(address)
      ])
        .then(([stakerAtMomentRate, currentRate, ssEthBalance]) => {
          if (stakerAtMomentRate?.atMomentRate) {
            const rateDiff = currentRate.sub(stakerAtMomentRate?.atMomentRate)
            dispatch(setStakerRateDiff(rateDiff.toString()))
            // TODO:
            // eslint-disable-next-line no-console
            dispatch(setAccountSsEthBalance(TokenAmount.fromWei('ssETH', ssEthBalance.toString()).toEncoded()))
          }
        })
        .catch(handleError)
    }
  }, [address, dispatch, stakeStarEthContract])

  return {
    activeValidatorsCount,
    accountSsEthBalance,
    totalSsEthBalance,
    ethPriceUSD,
    ssEthPriceUSD,
    dailyApr,
    dailyTvls
  }
}
