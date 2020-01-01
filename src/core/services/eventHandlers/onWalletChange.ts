import {Store} from 'vuex'
import {setMosaics, setNamespaces, setTransactionList} from '@/core/services'
import {Address} from 'nem2-sdk'
import {localRead} from '@/core/utils'
import {AppWallet, AppState, Listeners} from '@/core/model'

export class OnWalletChange {
  newWallet: AppWallet

  private constructor(
    private readonly store: Store<AppState>,
    private readonly listeners: Listeners,
    newWallet?: AppWallet,
  ) {
    this.newWallet = newWallet || this.getWalletFromStore()
  }

  static async trigger(
    store: Store<AppState>,
    listeners: Listeners,
    newWallet?: AppWallet,
  ): Promise <void> {
    const that = new OnWalletChange(store, listeners, newWallet)
    if (!that.newWallet) return
    that.toggleLoadingStatesTo(true)
    that.resetWalletAssets()
    that.setMosaicsFromStorage()
    await that.setWalletDataFromNetwork()
    that.startListeners()
    that.toggleLoadingStatesTo(false)
  }

  private getWalletFromStore() {
    const walletFromStore = this.store.state.account.wallet
    if (!walletFromStore) return null
    return AppWallet.createFromDTO(walletFromStore)
  }

  private toggleLoadingStatesTo(bool: boolean) {
    this.store.commit('SET_TRANSACTIONS_LOADING', bool)
    this.store.commit('SET_MOSAICS_LOADING', bool)
    this.store.commit('SET_NAMESPACE_LOADING', bool)
    this.store.commit('SET_MULTISIG_LOADING', bool)
  }

  private resetWalletAssets() {
    this.store.commit('RESET_TRANSACTION_LIST')
    this.store.commit('RESET_MOSAICS')
    this.store.commit('RESET_NAMESPACES')
  }

  private setMosaicsFromStorage() {
    const mosaicsFromStorage = this.getMosaicsFromStorage()
    if (mosaicsFromStorage) this.store.commit('SET_MOSAICS', mosaicsFromStorage)
  }

  private getMosaicsFromStorage() {
    const mosaicListFromStorage = localRead(this.newWallet.address)
    return !mosaicListFromStorage || mosaicListFromStorage === ''
      ? null : JSON.parse(mosaicListFromStorage)
  }

  private async setWalletDataFromNetwork() {
    const {newWallet, store} = this
    await newWallet.setAccountInfo(store)
    await newWallet.setMultisigStatus(store.state.account.node, store)
    await setMosaics(newWallet, store)
    await setNamespaces(newWallet.address, store)
    setTransactionList(newWallet.address, store)
  }

  private startListeners() {
    this.listeners.switchAddress(Address.createFromRawAddress(this.newWallet.address))
  }
}