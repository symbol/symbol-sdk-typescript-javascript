import {Address} from 'nem2-sdk'

export const formatNumber = (number: number): string => {
    if (number > 1) return number.toLocaleString()
    return `${number}`
}

export const formatAddress = function (address: string): string {
    if (!address) return
    return Address.createFromRawAddress(address).pretty()
}
