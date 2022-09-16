import { formatFixed } from '@ethersproject/bignumber'
import { BigNumber, utils } from 'ethers'

import { chainIdLocalSorageKey, defaultChainId } from '~/features/core'
import { getLocalStorageItem } from '~/features/core/hooks/useLocalStorage'

import { chainConfigs } from '../config'
import type { Token, TokenId } from '../types'

const _constructorGuard = Symbol()

export type TokenAmountEncoded = {
  type: 'TokenAmountEncoded'
  tokenId: TokenId
  wei: string
}

export class TokenAmount {
  private readonly inner: BigNumber
  private readonly token: Token

  /**
   * @description constructor is closed for external use
   * @protected
   */
  protected constructor(constructorGuard: typeof _constructorGuard, tokenId: TokenId, wei: string) {
    if (constructorGuard !== _constructorGuard) {
      throw new Error("You can't call constructor directly; Please use TokenAmount.fromWei or TokenAmount.fromDecimal")
    }

    this.inner = BigNumber.from(wei)
    this.token = getTokenById(tokenId)
    Object.freeze(this)
  }

  /**
   * @example TokenAmount.fromWei('ACA', '123456789') => TokenAmount
   */
  public static fromWei(tokenOrTokenId: Token | TokenId, value: string | BigNumber): TokenAmount {
    const tokenId = typeof tokenOrTokenId === 'string' ? tokenOrTokenId : tokenOrTokenId.id

    return new TokenAmount(_constructorGuard, tokenId, typeof value === 'string' ? value : value.toString())
  }

  /**
   * @example TokenAmount.fromDecimal('ACA', '1.23456789').toWei() => '1234567890000'
   */
  public toWei(): string {
    return this.inner.toString()
  }

  /**
   * @example TokenAmount.fromDecimal('ACA', '1.23456789') => TokenAmount
   */
  public static fromDecimal(tokenOrTokenId: Token | TokenId, value: number | string): TokenAmount {
    const tokenId = typeof tokenOrTokenId === 'string' ? tokenOrTokenId : tokenOrTokenId.id
    const wei = utils.parseUnits(value.toString(), getTokenById(tokenId).decimals).toString()

    return new TokenAmount(_constructorGuard, tokenId, wei)
  }

  /**
   * @example TokenAmount.fromDecimal('ACA', '12345.6789').toDecimal(2) => '12345.67'
   * @example TokenAmount.fromDecimal('ACA', '12345.6089').toDecimal(2) => '12345.60'
   */
  public toDecimal(decimals = 0): string {
    let decimalPlaces = decimals

    if (!decimalPlaces) {
      decimalPlaces = this.token.decimals
    }

    return formatNumberDecimals(this.toNumber(), decimalPlaces)
  }

  public toString(): string {
    return formatFixed(this.inner, this.token.decimals)
  }

  public toNumber(): number {
    return parseFloat(this.toString())
  }

  /**
   * @example TokenAmount.fromBigNumber('ACA', BigNumber) => TokenAmount
   */
  public static fromBigNumber(tokenOrTokenId: Token | TokenId, value: BigNumber): TokenAmount {
    const tokenId = typeof tokenOrTokenId === 'string' ? tokenOrTokenId : tokenOrTokenId.id

    return new TokenAmount(_constructorGuard, tokenId, value.toString())
  }

  /**
   * @example TokenAmount.fromDecimal('ACA', '1.23456789').toBigNumber() => BigNumber
   */
  public toBigNumber(): BigNumber {
    return this.inner
  }

  /**
   * @example TokenAmount.fromEncoded({ type: 'TokenAmount', tokenId: 'ACA', wei: '123456789' }) => TokenAmount
   */
  public static fromEncoded(tokenAmountEncoded: TokenAmountEncoded): TokenAmount {
    return new TokenAmount(_constructorGuard, tokenAmountEncoded.tokenId, tokenAmountEncoded.wei)
  }

  public toEncoded(): TokenAmountEncoded {
    return {
      type: 'TokenAmountEncoded',
      tokenId: this.token.id,
      wei: this.inner.toString()
    }
  }

  public toUsd = (tokenPriceInUsd: number): number => {
    const amountByPrice = this.inner.mul(Math.ceil(tokenPriceInUsd * 100))

    return amountByPrice.div(10 ** (this.token.decimals - 2)).toNumber() / 10000
  }

  public getTokenId(): TokenId {
    return this.token.id
  }
}

// TODO: Take a look at circular dependencies
// Can't import these functions from '../utils' because of circular dependency

// TODO: Rewrite it using bignumber.js
function formatNumberDecimals(value: number | string, decimals: number): string {
  return (
    Math.floor((typeof value === 'number' ? value : parseFloat(value)) * 10 ** decimals) /
    10 ** decimals
  ).toFixed(decimals)
}

function getTokenById(tokenId: TokenId): Token {
  const chainId = getLocalStorageItem(chainIdLocalSorageKey, defaultChainId)

  return chainConfigs[chainId].tokens[tokenId]
}
