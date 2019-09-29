import {localRead, localSave} from "@/core/utils"
import {NetworkType} from "nem2-sdk"

export class AppAccount {
    accountName: string
    wallets: Array<any>
    password: string
    hint: string
    seed: string
    currentNetType:NetworkType

    constructor(
        accountName: string,
        wallets: Array<any>,
        password: string,
        hint: string,
        currentNetType:NetworkType,
        seed?: string
    ) {
        this.accountName = accountName
        this.wallets = wallets
        this.password = password
        this.hint = hint
        this.currentNetType = currentNetType
        this.seed = seed ? seed : ''
    }

    get(): AppAccount {
        return this
    }
}


export const AppAccounts = () => ({
    accountName: '',

    getAccountFromLocalStorage(accountName) {
        const accountMapData = localRead('accountMap') || ''
        if (!accountMapData) {
            return ''
        }
        let accountMap = JSON.parse(localRead('accountMap'))
        return accountMap[accountName]
    },

    saveAccountInLocalStorage(appAccount: AppAccount): void {
        const accountMap = localRead('accountMap') ? JSON.parse(localRead('accountMap')) : {}
        accountMap[appAccount.accountName] = appAccount
        localSave('accountMap', JSON.stringify(accountMap))
    },
    createWalletByPath(path: string, accountName: string, password: string) {

    }


})
