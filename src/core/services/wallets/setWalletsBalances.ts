import {AppState, NetworkCurrency, Log} from '@/core/model'
import {localSave, localRead} from '@/core/utils'
import {Store} from 'vuex'
import {Address, AccountHttp, AccountInfo} from 'nem2-sdk'

const getBalanceFromAccountInfo = (accountInfo: AccountInfo,
                                   networkCurrency: NetworkCurrency): { balance: number, address: string } => {
    const address = accountInfo.address.plain()

    try {
        if (!accountInfo.mosaics.length) return {balance: 0, address}
        const xemIndex = accountInfo.mosaics
            .findIndex(mosaic => mosaic.id.toHex() === networkCurrency.hex)

        if (xemIndex === -1) return {balance: 0, address}

        const balance = accountInfo.mosaics[xemIndex].amount.compact() / Math.pow(10, networkCurrency.divisibility)
        return {balance, address}
    } catch (error) {
        console.error("getBalanceFromAccountInfo: error", error)
        return {balance: 0, address}
    }
}

// @TODO: Could set more things such as multisig status
export const setWalletsBalances = async (store: Store<AppState>): Promise<void> => {
    try {
        const {wallet, currentAccount, node, networkCurrency} = store.state.account
        const {walletList} = store.state.app
        if (!walletList.length) return

        Log.create('setWalletsBalances', walletList.map(({address, name}) => ({address, name})), store)

        const addresses = walletList.map(({address}) => Address.createFromRawAddress(address))
        const accountsInfo: AccountInfo[] = await new AccountHttp(node).getAccountsInfo(addresses).toPromise()
        // set mosaic types and wallets balance
        const balances = accountsInfo.map(ai => {
            return {
                ...getBalanceFromAccountInfo(ai, networkCurrency),
                numberOfMosaics : ai.mosaics.length
            }
        })
        const appWalletsWithBalance = walletList
            .map(wallet => {
                const balanceFromAccountInfo = balances.find(({address}) => wallet.address === address)
                if (balanceFromAccountInfo === undefined) return {...wallet, balance: 0, numberOfMosaics : 0}
                return {
                    ...wallet,
                    balance: balanceFromAccountInfo.balance,
                    numberOfMosaics : balanceFromAccountInfo.numberOfMosaics
                }
            })


        const activeWalletWithBalance = appWalletsWithBalance.find(w => w.address === wallet.address)

        if (activeWalletWithBalance === undefined) {
            throw new Error('an active wallet was not found in the wallet list')
        }

        store.commit('SET_WALLET_LIST', appWalletsWithBalance)
        store.commit('SET_WALLET', activeWalletWithBalance)

        // @WALLETS: make a standard method
        const localList = localRead('accountMap')
        const listToUpdate = localList === '' ? {} : JSON.parse(localList)
        if (!listToUpdate[currentAccount.name]) throw new Error
        listToUpdate[currentAccount.name].wallets = appWalletsWithBalance
        localSave('accountMap', JSON.stringify(listToUpdate))
    } catch (error) {
        console.error('setWalletsBalances: error', error)
    }
}
