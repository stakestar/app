// TODO: Uncomment this after @stakestar/contracts update
import { ValidatorStatus } from '@stakestar/contracts'
import BigNumberJs from 'bignumber.js'
import { useEffect } from 'react'

import { DailyTvls, handleError, useContracts, useDispatch, useSelector } from '~/features/core'
import { getGraphQLClientSdk } from '~/features/core/utils/graphQLClient'
import { useAccount, useSstarEthContract } from '~/features/wallet'

import {
  selectActiveValidatorsCount,
  selectApr,
  selectDailyTvls,
  selectEthPriceUSD,
  selectSstarEthPriceUSD,
  selectTotalSstarEth,
  setActiveValidatorsCount,
  setApr,
  setDailyTvls,
  setEthPriceUSD,
  setSstarEthPriceUSD,
  setSstarEthToEthRate,
  setStakerRateDiff,
  setTotalSstarEth,
  setTotalTVL
} from '../../store'
import { calculateApr, convertSstarEthToEth } from '../../utils'
import { loadEthPriceUsd } from './loadEthPriceUsd'

const sdk = getGraphQLClientSdk('https://subgraph.stakestar.io/subgraphs/name/stakestar-testnet') // TODO: move it to provider?

export function useFetchStakingData(): {
  activeValidatorsCount: number
  totalSstarEth: string
  ethPriceUSD: string
  sstarEthPriceUSD: string
  apr: number
  dailyTvls: DailyTvls
} {
  const dispatch = useDispatch()
  const { stakeStarContract, stakeStarEthContract, stakeStarRegistryContract } = useContracts()
  const sstarEthContract = useSstarEthContract()
  const { address } = useAccount()
  const activeValidatorsCount = useSelector(selectActiveValidatorsCount)
  const totalSstarEth = useSelector(selectTotalSstarEth)
  const apr = useSelector(selectApr)
  const ethPriceUSD = useSelector(selectEthPriceUSD)
  const sstarEthPriceUSD = useSelector(selectSstarEthPriceUSD)
  const dailyTvls = useSelector(selectDailyTvls)

  useEffect(() => {
    if (!sstarEthContract) {
      return
    }

    Promise.all([
      loadEthPriceUsd(),
      stakeStarEthContract.totalSupply(),
      sstarEthContract.totalSupply(),
      stakeStarContract.functions['rate()'](),
      sdk.getTokenRateDailies({ first: 7 }).then(({ data }) => data.tokenRateDailies),
      stakeStarRegistryContract.countValidatorPublicKeys(ValidatorStatus.ACTIVE),
      sdk.getStakeStarTvls({ first: 10 }).then(({ data }) => data.stakeStarTvls)
    ])
      .then(
        ([
          ethPriceUsd,
          stakeStarTvl,
          sstarEthTotalSupply,
          rate,
          tokenRateDailies,
          countValidatorPublicKeys,
          dailyTvlsData
        ]) => {
          const sstarEthToEthRate = rate.toString()

          dispatch(setApr(calculateApr(tokenRateDailies)))
          dispatch(setEthPriceUSD(ethPriceUsd))
          dispatch(
            setSstarEthPriceUSD(
              new BigNumberJs(sstarEthToEthRate).shiftedBy(-18).multipliedBy(new BigNumberJs(ethPriceUsd)).toString()
            )
          )
          dispatch(setTotalSstarEth(stakeStarTvl.toString()))
          dispatch(setSstarEthToEthRate(sstarEthToEthRate))
          dispatch(setActiveValidatorsCount(countValidatorPublicKeys.toNumber()))
          dispatch(setDailyTvls(dailyTvlsData.reverse()))
          // eslint-disable-next-line no-console
          console.log(`[DEBUG] Rate = ${sstarEthToEthRate}`)

          const totalTvl = sstarEthToEthRate
            ? convertSstarEthToEth(totalSstarEth, sstarEthToEthRate)
                .plus(convertSstarEthToEth(sstarEthTotalSupply.toString(), sstarEthToEthRate))
                .toString()
            : ''

          dispatch(setTotalTVL(totalTvl))
        }
      )
      .catch(handleError)
  }, [dispatch, sstarEthContract, stakeStarContract, stakeStarEthContract, stakeStarRegistryContract, totalSstarEth])

  useEffect(() => {
    if (address) {
      Promise.all([
        sdk.getStakerAtMomentRate({ stakerId: address.toLowerCase() }).then(({ data }) => data.stakerAtMomentRate),
        stakeStarContract.functions['rate()']()
      ])
        .then(([stakerAtMomentRate, [rate]]) => {
          if (stakerAtMomentRate?.atMomentRate) {
            const rateDiff = rate.sub(stakerAtMomentRate?.atMomentRate)
            dispatch(setStakerRateDiff(rateDiff.toString()))
          }
        })
        .catch(handleError)
    }
  }, [address, dispatch, stakeStarContract, stakeStarEthContract])

  return {
    activeValidatorsCount,
    totalSstarEth,
    ethPriceUSD,
    sstarEthPriceUSD,
    apr,
    dailyTvls
  }
}
