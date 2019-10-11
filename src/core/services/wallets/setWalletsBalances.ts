import {AppWallet, AppState} from '@/core/model'
import {localSave, localRead} from '@/core/utils'
import { Store } from 'vuex'

export const setWalletsBalances = async (store: Store<AppState>): Promise<void> => {
    try {
        const {wallet, accountName} = store.state.account
        const {walletList} = store.state.app
        if (!walletList.length) return
        const appWalletsWithBalance = await Promise.all(
            [...walletList].map(wallet => new AppWallet(wallet).getAccountBalance(store))
        )

        const activeWalletWithBalance = appWalletsWithBalance.find(w => w.address === wallet.address)

        if (activeWalletWithBalance === undefined) {
            throw new Error('an active wallet was not found in the wallet list')
        }

        store.commit('SET_WALLET_LIST', appWalletsWithBalance)
        store.commit('SET_WALLET', activeWalletWithBalance)

        // @WALLETS: make a standard method
        const localList = localRead('accountMap')
        const listToUpdate = localList === '' ? {} : JSON.parse(localList)
        if (!listToUpdate[accountName]) throw new Error
        listToUpdate[accountName].wallets = appWalletsWithBalance
        localSave('accountMap', JSON.stringify(listToUpdate))
    } catch (error) {
        console.error(error)
    }
}
