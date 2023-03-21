import { ValidatorStatus } from '@stakestar/contracts'
import BigNumberJs from 'bignumber.js'
import { useEffect, useRef } from 'react'

import {
  DailyTvls,
  handleError,
  setBlockNumber,
  thegraphUrl,
  tvlChartResultsCount,
  useBlockNumber,
  useContracts,
  useDispatch,
  useSelector
} from '~/features/core'
import { getGraphQLClientSdk } from '~/features/core/utils/graphQLClient'
import { useAccount, useConnector, useSstarEthContract } from '~/features/wallet'

import {
  selectActiveValidatorsCount,
  selectApr,
  selectDailyTvls,
  selectEthPriceUSD,
  selectSstarEthPriceUSD,
  selectSstarEthToEthRate,
  selectStakerRateDiff,
  selectTotalSstarEth,
  selectTotalTVL,
  setActiveValidatorsCount,
  setApr,
  setDailyTvls,
  setEthPriceUSD,
  setLocalPool,
  setPendingUnstake,
  setSstarEthPriceUSD,
  setSstarEthToEthRate,
  setStakerRateDiff,
  setTotalSstarEth,
  setTotalTVL
} from '../../store'
import { calculateApr, convertSstarEthToEth } from '../../utils'
import { loadEthPriceUsd } from './loadEthPriceUsd'

export function useFetchStakingData(): {
  activeValidatorsCount: number
  blockNumber: number
  totalSstarEth: string
  totalTvl: string
  sstarEthToEthRate: string
  stakerRateDiff: string
  ethPriceUSD: string
  sstarEthPriceUSD: string
  apr: number
  dailyTvls: DailyTvls
} {
  const dispatch = useDispatch()
  const blockNumber = useBlockNumber()
  const { stakeStarContract, stakeStarEthContract, stakeStarRegistryContract } = useContracts()
  const sstarEthContract = useSstarEthContract()
  const { address } = useAccount()
  const sdk = useRef(getGraphQLClientSdk(thegraphUrl))
  const activeValidatorsCount = useSelector(selectActiveValidatorsCount)
  const totalSstarEth = useSelector(selectTotalSstarEth)
  const totalTvl = useSelector(selectTotalTVL)
  const sstarEthToEthRate = useSelector(selectSstarEthToEthRate)
  const stakerRateDiff = useSelector(selectStakerRateDiff)
  const apr = useSelector(selectApr)
  const ethPriceUSD = useSelector(selectEthPriceUSD)
  const sstarEthPriceUSD = useSelector(selectSstarEthPriceUSD)
  const dailyTvls = useSelector(selectDailyTvls)
  const { connector } = useConnector()
  const provider = connector.hooks.useProvider()

  useEffect(() => {
    if (!address || !sstarEthToEthRate) {
      return
    }

    const stakerId = address.toLowerCase()

    Promise.all([
      sdk.current.getStakerAtMomentRate({ stakerId }).then(({ data }) => data.stakerAtMomentRate),
      stakeStarContract.localPoolWithdrawalHistory(stakerId),
      stakeStarContract.pendingWithdrawal(stakerId)
    ])
      .then(([stakerAtMomentRate, localPoolWithdrawalHistory, pendingWithdrawal]) => {
        if (stakerAtMomentRate?.atMomentRate) {
          dispatch(
            setStakerRateDiff(new BigNumberJs(sstarEthToEthRate).minus(stakerAtMomentRate.atMomentRate).toString())
          )
        }

        dispatch(setPendingUnstake(pendingWithdrawal.toString()))
        dispatch(setLocalPool({ withdrawalHistory: localPoolWithdrawalHistory.toString() }))
      })
      .catch(handleError)
  }, [address, dispatch, sstarEthToEthRate, stakeStarContract])

  useEffect(() => {
    if (!sstarEthContract || !provider) {
      return
    }

    Promise.all([
      provider.getBlockNumber(),
      loadEthPriceUsd(),
      stakeStarEthContract.totalSupply(),
      sstarEthContract.totalSupply(),
      stakeStarContract.localPoolSize(),
      stakeStarContract.localPoolWithdrawalLimit(),
      stakeStarContract.localPoolWithdrawalFrequencyLimit(),
      stakeStarContract.functions['rate()'](),
      sdk.current.getTokenRateDailies({ first: 7 }).then(({ data }) => data.tokenRateDailies),
      stakeStarRegistryContract.countValidatorPublicKeys(ValidatorStatus.ACTIVE),
      sdk.current.getStakeStarTvls({ first: tvlChartResultsCount }).then(({ data }) => data.stakeStarTvls)
    ])
      .then(
        ([
          blockNumber,
          ethPriceUsd,
          stakeStarTvl,
          sstarEthTotalSupply,
          localPoolSize,
          localPoolWithdrawalLimit,
          localPoolWithdrawalFrequencyLimit,
          rate,
          tokenRateDailies,
          countValidatorPublicKeys,
          dailyTvlsData
        ]) => {
          const newSstarEthToEthRate = rate.toString()

          dispatch(setBlockNumber(blockNumber))
          dispatch(setApr(calculateApr(tokenRateDailies)))
          dispatch(setEthPriceUSD(ethPriceUsd))
          dispatch(
            setSstarEthPriceUSD(
              new BigNumberJs(newSstarEthToEthRate).shiftedBy(-18).multipliedBy(new BigNumberJs(ethPriceUsd)).toString()
            )
          )
          dispatch(setTotalSstarEth(stakeStarTvl.toString()))
          dispatch(setActiveValidatorsCount(countValidatorPublicKeys.toNumber()))
          dispatch(setDailyTvls(dailyTvlsData.reverse()))
          dispatch(setSstarEthToEthRate(newSstarEthToEthRate))
          console.info(`[DEBUG] Rate = ${newSstarEthToEthRate}`)

          const newTotalTvl = newSstarEthToEthRate
            ? stakeStarTvl
                .add(convertSstarEthToEth(sstarEthTotalSupply.toString(), newSstarEthToEthRate).toString())
                .toString()
            : ''

          dispatch(setTotalTVL(newTotalTvl))

          dispatch(
            setLocalPool({
              size: localPoolSize.toString(),
              withdrawalLimit: localPoolWithdrawalLimit.toString(),
              withdrawalFrequencyLimit: localPoolWithdrawalFrequencyLimit.toString()
            })
          )
        }
      )
      .catch(handleError)
  }, [dispatch, provider, sstarEthContract, stakeStarContract, stakeStarEthContract, stakeStarRegistryContract])

  return {
    activeValidatorsCount,
    blockNumber,
    totalSstarEth,
    totalTvl,
    sstarEthToEthRate,
    stakerRateDiff,
    ethPriceUSD,
    sstarEthPriceUSD,
    apr,
    dailyTvls
  }
}
