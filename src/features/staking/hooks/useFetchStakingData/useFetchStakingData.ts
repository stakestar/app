// TODO: Uncomment this after @stakestar/contracts update
import { ValidatorStatus } from '@stakestar/contracts'
import BigNumberJs from 'bignumber.js'
import { useEffect } from 'react'

import { DailyTvls, TokenAmount, handleError, useContracts, useDispatch, useSelector } from '~/features/core'
import { getGraphQLClientSdk } from '~/features/core/utils/graphQLClient'
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

const sdk = getGraphQLClientSdk('https://api.thegraph.com/subgraphs/name/arsoba/stakestar-test') // TODO: move it to provider?

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
      stakeStarContract.functions['rate()'](),
      sdk.getTokenRateDailies({ first: 7 }).then(({ data }) => data.tokenRateDailies),
      stakeStarRegistryContract.countValidatorPublicKeys(ValidatorStatus.ACTIVE),
      sdk.getStakeStarTvls({ first: 10 }).then(({ data }) => data.stakeStarTvls)
    ])
      .then(([ethPriceUsd, stakeStarTvl, rate, tokenRateDailies, countValidatorPublicKeys, dailyTvlsData]) => {
        dispatch(setApr(calculateApr(tokenRateDailies)))
        dispatch(setEthPriceUSD(ethPriceUsd))
        dispatch(
          setSsEthPriceUSD(
            new BigNumberJs(rate.toString()).shiftedBy(-18).multipliedBy(new BigNumberJs(ethPriceUsd)).toString()
          )
        )
        dispatch(setTotalSsEthBalance(stakeStarTvl.toString()))
        dispatch(setSsEthToEthRate(rate.toString()))
        dispatch(setActiveValidatorsCount(countValidatorPublicKeys.toNumber()))
        dispatch(setDailyTvls(dailyTvlsData.reverse()))
        // eslint-disable-next-line no-console
        console.log(`[DEBUG] Rate = ${rate.toString()}`)
      })
      .catch(handleError)
  }, [dispatch, stakeStarContract, stakeStarEthContract, stakeStarRegistryContract])

  useEffect(() => {
    if (address) {
      Promise.all([
        sdk.getStakerAtMomentRate({ stakerId: address.toLowerCase() }).then(({ data }) => data.stakerAtMomentRate),
        stakeStarContract.functions['rate()'](),
        // TODO: Refactor stakeStarEthContract.balanceOf to useFetchAccountSsEthBalance
        stakeStarEthContract.balanceOf(address)
      ])
        .then(([stakerAtMomentRate, [rate], ssEthBalance]) => {
          if (stakerAtMomentRate?.atMomentRate) {
            const rateDiff = rate.sub(stakerAtMomentRate?.atMomentRate)
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
