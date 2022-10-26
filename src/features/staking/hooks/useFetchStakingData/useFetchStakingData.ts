// TODO: Uncomment this after @stakestar/contracts update
import { ValidatorStatus } from '@stakestar/contracts'
import { getBuiltGraphSDK } from '@stakestar/subgraph-client'
import BigNumberJs from 'bignumber.js'
import { useEffect } from 'react'

import { TokenAmount, handleError, useContracts, useDispatch, useSelector } from '~/features/core'
import { useAccount } from '~/features/wallet'

import {
  selectActiveValidatorsCount,
  selectDailyApr,
  selectEthPriceUSD,
  selectSsEthPriceUSD,
  selectTotalSsEthBalance,
  setAccountSsEthBalance,
  setActiveValidatorsCount,
  setDailyApr,
  setEthPriceUSD,
  setSsEthPriceUSD,
  setSsEthToEthRate,
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

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('stakeStar address:', stakeStarContract.address)

    Promise.all([
      loadEthPriceUsd(),
      stakeStarEthContract.totalSupply(),
      sdk.getTokenRateDailies().then(({ tokenRateDailies }) => tokenRateDailies),
      stakeStarEthContract.ssETH_to_ETH(TokenAmount.fromDecimal('ssETH', 1).toWei()),
      stakeStarRegistryContract.countValidatorPublicKeys(ValidatorStatus.CREATED)
    ])
      .then(([ethPriceUsd, stakeStarTvl, tokenRateDailies, ssEthToEth, countValidatorPublicKeys]) => {
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
      })
      .catch(handleError)
  }, [dispatch, stakeStarContract, stakeStarEthContract, stakeStarRegistryContract])

  useEffect(() => {
    if (address) {
      Promise.all([
        sdk.getStakerAtMomentRate({ stakerId: address }).then(({ stakerAtMomentRate }) => stakerAtMomentRate),
        // TODO: Refactor stakeStarEthContract.balanceOf to useFetchAccountSsEthBalance
        stakeStarEthContract.balanceOf(address)
      ])
        .then(([stakerAtMomentRate, ssEthBalance]) => {
          // TODO:
          // eslint-disable-next-line no-console
          console.log('stakerAtMomentRate', stakerAtMomentRate)
          dispatch(setAccountSsEthBalance(TokenAmount.fromWei('ssETH', ssEthBalance.toString()).toEncoded()))
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
    dailyApr
  }
}