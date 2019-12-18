import {Store} from 'vuex'
import {NetworkType, Address, MosaicAmountView} from 'nem2-sdk'
import {AppNamespace, AppMosaic, AppState} from '@/core/model'
import {
  getNamespacesFromAddress, mosaicsAmountViewFromAddress,
  AppMosaics, setMultisigAccountMultisigAccountInfo,
} from '..'

export class OnActiveMultisigAccountChange {
  private address: Address

  private constructor(
    private readonly publicKey: string,
    private readonly node: string,
    networkType: NetworkType,
    private readonly store: Store<AppState>,
  ) {
    this.address = Address.createFromPublicKey(publicKey, networkType)
  }

  static async trigger(
    publicKey: string,
    node: string,
    networkType: NetworkType,
    store: Store<AppState>,
  ) {
    const that = new OnActiveMultisigAccountChange(publicKey, node, networkType, store)
    await that.setDataFromNetwork()
  }

  private async setDataFromNetwork() {
    const {address, node, publicKey, store} = this
    const appNamespaces = await getNamespacesFromAddress(address.plain(), node)
    const mosaicAmountViews = await mosaicsAmountViewFromAddress(node, address)
    await setMultisigAccountMultisigAccountInfo(publicKey, store)
    this.setNamespaces(appNamespaces)
    this.setMosaics(mosaicAmountViews)
  }

  private async setNamespaces(appNamespaces: AppNamespace[]) {
    const address = this.address.plain()
    this.store.commit('SET_MULTISIG_ACCOUNT_NAMESPACES', { address, namespaces: appNamespaces })
    const appMosaicsFromNamespaces = await AppMosaics().fromAppNamespaces(appNamespaces)
    this.store.commit('UPDATE_MULTISIG_ACCOUNT_MOSAICS', {address, mosaics: appMosaicsFromNamespaces})
  }

  private async setMosaics(mosaicAmountViews: MosaicAmountView[]) {
    const address = this.address.plain()
    const appMosaics = mosaicAmountViews.map(x => AppMosaic.fromMosaicAmountView(x))
    this.store.commit('UPDATE_MULTISIG_ACCOUNT_MOSAICS', {address, mosaics: appMosaics})
  }
} 