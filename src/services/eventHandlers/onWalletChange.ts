import {Store} from 'vuex'
import {setMosaics, setNamespaces} from '@/core/services'
import {Address} from 'nem2-sdk'
import {localRead} from '@/core/utils'
import {AppWallet, AppState, Listeners} from '@/core/model'

export class OnWalletChange {
  private newWallet: AppWallet
  private readonly listeners: Listeners

  private constructor(
    private readonly store: Store<AppState>,
    newWallet?: AppWallet,
  ) {
    this.listeners = store.state.app.listeners
    this.newWallet = newWallet ? AppWallet.createFromDTO(newWallet) : this.getWalletFromStore()
  }

  static async trigger(
    store: Store<AppState>,
    newWallet?: AppWallet,
  ): Promise <void> {
    await new OnWalletChange(store, newWallet).start()
  }

  private async start() {
    if (!this.newWallet) return
    this.toggleLoadingStatesTo(true)
    this.resetWalletAssets()
    this.setMosaicsFromStorage()
    await this.setWalletDataFromNetwork()
    this.startListeners()
    this.toggleLoadingStatesTo(false)
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
    this.store.commit('RESET_TRANSACTIONS_TO_COSIGN')
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
    const {walletKnownByNetwork} = await newWallet.setAccountInfo(store)

    if (!walletKnownByNetwork) return

    await newWallet.setMultisigStatus(store.state.account.node, store)
    await setMosaics(newWallet, store)
    await setNamespaces(newWallet.address, store)
    await newWallet.setTransactionList(store)
    newWallet.setPartialTransactions(store)
  }

  private startListeners() {
    this.listeners.switchAddress(Address.createFromRawAddress(this.newWallet.address))
  }
}
