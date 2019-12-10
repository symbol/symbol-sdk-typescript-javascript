import {Address, Deadline} from 'nem2-sdk'
import {explorerUrlHead} from "@/config"

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
