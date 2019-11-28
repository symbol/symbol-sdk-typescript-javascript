import {Address, Deadline} from 'nem2-sdk'
import {explorerUrlHead} from "@/config"

export const formatNumber = (number: number): string => {
    if (number > 1) return number.toLocaleString()
    return `${number}`
}

export const formatAddress = function (address: string): string {
    if (!address) return
    return Address.createFromRawAddress(address).pretty()
}
export const formatExplorerUrl = (transactionHash) =>{
    return explorerUrlHead + transactionHash
}
