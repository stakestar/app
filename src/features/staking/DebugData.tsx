import { Typography } from '@onestaree/ui-kit'
import { StakeStarTvl, getBuiltGraphSDK } from '@stakestar/subgraph-client'
import { useEffect, useState } from 'react'

import { TokenAmount, handleError, useContracts } from '~/features/core'
import { useAccount } from '~/features/wallet'

import styles from './Staking.module.scss'
import { useEthPriceUsd } from './useEthPriceUsd'

const sdk = getBuiltGraphSDK() // TODO: move it to provider?

export function DebugData(): JSX.Element {
  const { address } = useAccount()
  const { stakeStarEthContract, stakeStarContract } = useContracts()
  const [stakeStarTvls, setStakeStarTvls] = useState<Pick<StakeStarTvl, 'id' | 'totalETH'>[]>([])
  const [ssEthBalance, setSsEthBalance] = useState('0')
  const [ethBalance, setEthBalance] = useState('0')
  const { ethPriceUsd, ethToUsd } = useEthPriceUsd()
  const ethInUsd = ethToUsd(ethBalance)

  useEffect(() => {
    sdk
      .getStakeStarTvls()
      // TODO: move it to RTK Query?
      .then((data) => setStakeStarTvls(data.stakeStarTvls))
      .catch(handleError)

    if (address) {
      stakeStarEthContract
        .balanceOf(address)
        .then((ssEthBalanceBigNumber) => {
          setSsEthBalance(ssEthBalanceBigNumber.toString())

          stakeStarEthContract
            .ssETH_to_ETH(ssEthBalanceBigNumber.toString())
            .then((ethBalanceBigNumber) => setEthBalance(ethBalanceBigNumber.toString()))
            .catch(handleError)
        })
        .catch(handleError)
    }
  }, [address, stakeStarEthContract])

  return (
    <div className={styles.Container}>
      <Typography variant="h2">Debug data</Typography>
      <Typography className="_mt-2" variant="h3">
        Staked Amount
      </Typography>
      <Typography>
        ssETH: {TokenAmount.fromWei('ETH', ssEthBalance).toDecimal(2)} ({ssEthBalance})
      </Typography>
      <Typography>
        ETH: {TokenAmount.fromWei('ETH', ethBalance).toDecimal(2)} ({ethBalance})
      </Typography>
      <Typography>
        ETH in USD: ${ethInUsd.toFormat(2)} ({ethInUsd.toString()})
      </Typography>

      <Typography className="_mt-2">
        ETH price in USD: ${ethPriceUsd.toFormat(2)} ({ethPriceUsd.toString()})
      </Typography>

      <Typography className="_mt-2" variant="h3">
        StakeStarTvls
      </Typography>
      {stakeStarTvls.map(({ id, totalETH }) => (
        <Typography key={id}>
          {id}: {TokenAmount.fromWei('ETH', String(totalETH)).toDecimal(2)} ({totalETH.toString()})
        </Typography>
      ))}

      <Typography className="_mt-2" variant="h3">
        Addresses
      </Typography>
      <Typography>StakeStar: {stakeStarContract.address}</Typography>
      <Typography>StakeStarETH: {stakeStarEthContract.address}</Typography>
    </div>
  )
}
