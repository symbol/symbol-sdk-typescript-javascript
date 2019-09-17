import {MosaicAlias, MosaicId, UInt64, MosaicAmountView, MosaicDefinitionTransaction, MosaicInfo} from 'nem2-sdk'
import {getRelativeMosaicAmount, localRead} from '@/core/utils'
import {FormattedTransfer} from '../transactions'

export class AppMosaic {
    hex: string
    amount: any
    balance?: number
    expirationHeight: number | 'Forever'
    height: UInt64
    mosaicInfo: MosaicInfo
    name: string
    show: boolean
    showInManage: boolean

    constructor(appMosaic?: {
        hex: string,
        balance?: number,
        name?: string,
        amount?: any,
        mosaicInfo?: MosaicInfo,
    }) {
        Object.assign(this, appMosaic)
        delete this.amount
        if (this.mosaicInfo) {
            const duration = this.mosaicInfo.duration.compact()
            this.expirationHeight = duration === 0
                ? 'Forever' : this.mosaicInfo.height.compact() + duration
        }
  }

  get(): AppMosaic  {
      return this
  }
}

export const AppMosaics = () => ({
    mosaics: {},
    store: null,

    init(mosaicsFromStore: Record<string, AppMosaic>) {
        this.mosaics = {...mosaicsFromStore}
    },

    getItems() {
        return this.mosaics
    },

    getAvailableToBeLinked(currentHeight: number, address: string): AppMosaic[] {
        const appMosaics: AppMosaic[] = Object.values(this.mosaics)
        return appMosaics
            .filter((mosaic: AppMosaic) => (!mosaic.name
                && mosaic.mosaicInfo.owner.address.plain() === address
                && mosaic.expirationHeight === 'Forever'
                || currentHeight > mosaic.expirationHeight))
    },

    getLinked(currentHeight: number, address: string): AppMosaic[] {
        const appMosaics: AppMosaic[] = Object.values(this.mosaics)
        return appMosaics
            .filter((mosaic: AppMosaic) => (mosaic.name
                && mosaic.mosaicInfo.owner.address.plain() === address
                && mosaic.expirationHeight === 'Forever'
                || currentHeight > mosaic.expirationHeight))
    },

    getItemsWithoutAlias(): AppMosaic[] {
        return Object.values(this.mosaics).filter(({name}) => !name).map(({hex}) => hex)
    },

    storeItems(): void {
        this.store.commit('SET_MOSAICS', this.mosaics)
    },

    reset(store: any): void {
        store.commit('SET_MOSAICS', {})
    },

    addItem(mosaic): void {
        const wallets = JSON.parse(localRead('wallets'))
        const hideMosaicMap = wallets[0].hideMosaicMap
        if (!mosaic.hex) return
        if (!this.mosaics[mosaic.hex]) this.mosaics[mosaic.hex] = {}
        Object.assign(this.mosaics[mosaic.hex], new AppMosaic(mosaic))
        this.storeItems()
    },

    addItems(mosaics): void {
        mosaics.forEach(mosaic => this.addItem(mosaic))
    },

    addNetworkMosaic(mosaic, store): void {
      this.store = store
      this.addItem(mosaic)
    },

    fromTransactions(transactions: FormattedTransfer[], store: any): void {
        const tx: any = transactions
        this.store = store
        const mosaics = tx.map(({rawTx}) => rawTx.mosaics)
        const hexIds = [].concat(...mosaics).map(({id}) => ({hex: id.toHex()}))
        this.addItems(hexIds)
    },

    fromNamespaces(namespaces: any, store: any): void {
        this.store = store
        const items = namespaces
            .filter(({alias}) => alias instanceof MosaicAlias)
            .map(namespace => ({
                hex: new MosaicId(namespace.alias.mosaicId).toHex(),
                name: namespace.name,
            }))
        this.addItems(items)
    },

    fromMosaicAmountView(mosaic: MosaicAmountView, store: any): void {
        let wallets = JSON.parse(localRead('wallets'))
        const hideMosaicMap = wallets[0].hideMosaicMap || {}
        const mosaicHex = mosaic.mosaicInfo.mosaicId.toHex()
        this.store = store
        this.addItem({
            ...mosaic,
            hex: mosaicHex,
            balance: getRelativeMosaicAmount(
                mosaic.amount.compact(),
                mosaic.mosaicInfo.divisibility,
            ),
            show: Boolean(!hideMosaicMap[mosaicHex]),
            showInManage: true,
        })
    },

    fromGetCurrentNetworkMosaic(mosaicDefinitionTransaction: MosaicDefinitionTransaction,
                                name: string,
                                store: any): void {
        this.store = store
        const {mosaicId, mosaicProperties} = mosaicDefinitionTransaction
        this.addItem({
            hex: mosaicId.toHex(),
            mosaicId,
            properties: mosaicProperties,
            name,
        })
    },
})
