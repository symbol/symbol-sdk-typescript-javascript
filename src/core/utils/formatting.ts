import {Address, Deadline} from 'nem2-sdk'
import {explorerUrlHead, networkConfig} from "@/config"
import {getRelativeMosaicAmount} from '../utils'
import {NetworkCurrency} from '@/core/model'

export const formatNumber = (number: number): string => {
    if (number <= 1) return `${number}`
    if (number == Number(number.toFixed(0))) return number.toLocaleString('en-US', {minimumFractionDigits: 0})

    const stringOfNumber = number + ''
    const minimumFractionDigits = stringOfNumber.length - stringOfNumber.indexOf('.') - 1
    return number.toLocaleString('en-US', {minimumFractionDigits})

}

export const formatAddress = function (address: string): string {
    if (!address) return
    return Address.createFromRawAddress(address).pretty()
}
export const formatExplorerUrl = (transactionHash) => {
    return explorerUrlHead + transactionHash
}

export const miniHash = (hash: string): string => {
  return `${hash.substring(0, 18).toLowerCase()}***${hash.substring(42).toLowerCase()}`
}

export const tinyHash = (hash: string): string => {
  return `${hash.substring(0, 6).toLowerCase()}***${hash.substring(58).toLowerCase()}`
}

export const absoluteAmountToRelativeAmountWithTicker = (
    amount: number,
    networkCurrency: NetworkCurrency,
): string => {
    const relativeAmount = getRelativeMosaicAmount(amount, networkCurrency.divisibility)
    return amountWithTicker(relativeAmount, networkCurrency)
}

export const amountWithTicker = (
    amount: number,
    networkCurrency: NetworkCurrency,
): string => {
    return `${formatNumber(amount)}`
}
