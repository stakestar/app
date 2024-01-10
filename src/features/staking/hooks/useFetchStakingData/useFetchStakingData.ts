import { ValidatorStatus } from '@stakestar/contracts'
import BigNumberJs from 'bignumber.js'
import { useCallback, useEffect } from 'react'

import {
  DailyTvls,
  handleError,
  setBlockNumber,
  tvlChartResultsCount,
  useBlockNumber,
  useContracts,
  useDispatch,
  useSelector
} from '~/features/core'
import { useGraphQLClientSdk } from '~/features/core/hooks/useGraphQLClientSdk'
import { useAccount, useConnector, useSstarEthContract } from '~/features/wallet'

import {
  selectActiveValidatorsCount,
  selectApr,
  selectDailyTvls,
  selectEthPriceUSD,
  selectPendingUnstakeQueueIndex,
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
  setPendingUnstakeQueueIndex,
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
  pendingUnstakeQueueIndex: number
  sstarEthToEthRate: string
  stakerRateDiff: string
  ethPriceUSD: string
  sstarEthPriceUSD: string
  apr: number
  dailyTvls: DailyTvls
  fetchStakingData: () => Promise<void>
} {
  const dispatch = useDispatch()
  const blockNumber = useBlockNumber()
  const { stakeStarContract, stakeStarEthContract, stakeStarRegistryContract } = useContracts()
  const sstarEthContract = useSstarEthContract()
  const { address } = useAccount()
  const sdk = useGraphQLClientSdk()
  const activeValidatorsCount = useSelector(selectActiveValidatorsCount)
  const totalSstarEth = useSelector(selectTotalSstarEth)
  const pendingUnstakeQueueIndex = useSelector(selectPendingUnstakeQueueIndex)
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
      sdk.getStakerAtMomentRate({ stakerId }).then(({ data }) => data.stakerAtMomentRate),
      stakeStarContract.localPoolWithdrawalHistory(stakerId),
      stakeStarContract.queue(stakerId),
      stakeStarContract.queueIndex(stakerId)
    ])
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then(([stakerAtMomentRate, localPoolWithdrawalHistory, [_, pendingWithdrawal], queueIndex]) => {
        if (stakerAtMomentRate?.atMomentRate) {
          dispatch(
            setStakerRateDiff(new BigNumberJs(sstarEthToEthRate).minus(stakerAtMomentRate.atMomentRate).toString())
          )
        }

        dispatch(setPendingUnstake(pendingWithdrawal.toString()))
        dispatch(setPendingUnstakeQueueIndex(queueIndex))
        dispatch(setLocalPool({ withdrawalHistory: localPoolWithdrawalHistory.toString() }))
      })
      .catch(handleError)
  }, [address, dispatch, sstarEthToEthRate, stakeStarContract, sdk])

  const fetchStakingData = useCallback(() => {
    if (!sstarEthContract || !provider) {
      return Promise.reject()
    }

    return Promise.all([
      provider.getBlockNumber(),
      loadEthPriceUsd(),
      stakeStarEthContract.totalSupply(),
      sstarEthContract.totalSupply(),
      stakeStarContract.localPoolSize(),
      stakeStarContract.localPoolWithdrawalLimit(),
      stakeStarContract.localPoolWithdrawalPeriodLimit(),
      stakeStarContract.functions['rate()'](),
      sdk.getTokenRateDailies({ first: 7 }).then(({ data }) => data.tokenRateDailies),
      stakeStarRegistryContract.countValidatorPublicKeys(ValidatorStatus.ACTIVE),
      sdk.getStakeStarTvls({ first: tvlChartResultsCount }).then(({ data }) => data.stakeStarTvls)
    ])
      .then(
        ([
          newBlockNumber,
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

          dispatch(setBlockNumber(newBlockNumber))
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
  }, [dispatch, provider, sstarEthContract, stakeStarContract, stakeStarEthContract, stakeStarRegistryContract, sdk])

  useEffect(() => {
    fetchStakingData()
  }, [fetchStakingData])

  return {
    activeValidatorsCount,
    blockNumber,
    totalSstarEth,
    totalTvl,
    pendingUnstakeQueueIndex,
    sstarEthToEthRate,
    stakerRateDiff,
    ethPriceUSD,
    sstarEthPriceUSD,
    apr,
    dailyTvls,
    fetchStakingData
  }
}
