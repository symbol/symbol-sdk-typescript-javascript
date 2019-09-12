import { MosaicAlias, MosaicId, UInt64, MosaicAmountView, MosaicDefinitionTransaction, MosaicInfo,
} from 'nem2-sdk'
import {getRelativeMosaicAmount} from '@/core/utils/utils.ts'

class AppMosaic {
    amount: any
    expirationHeight: number | 'Forever'
    height: UInt64
    mosaicInfo: MosaicInfo

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

  get() {
      return this
  }
}

export const AppMosaics = () => ({
    mosaics: {},
    store: null,

    init(mosaicsFromStore: any) {
        this.mosaics = {...mosaicsFromStore}
    },

    getItems() {
        return this.mosaics
    },

    storeItems() {
        this.store.commit('SET_MOSAICS', this.mosaics)
    },

    reset(store: any) {
        store.commit('SET_MOSAICS', {})
    },

    addItem(mosaic) {
        if (!mosaic.hex) return
        if (!this.mosaics[mosaic.hex]) this.mosaics[mosaic.hex] = {}
        Object.assign(this.mosaics[mosaic.hex], new AppMosaic(mosaic).get())
        this.storeItems()
    },

    addItems(mosaics) {
        mosaics.forEach(mosaic => this.addItem(mosaic))
    },

    addNetworkMosaic(mosaic, store) {
      this.store = store
      this.addItem(mosaic)
    },

    getItemsWithoutAlias() {
        return Object.values(this.mosaics).filter(({name}) => !name).map(({hex}) => hex)
    },

    fromTransactions(transactions: any, store: any) {
        this.store = store
        const mosaics = transactions.map(({mosaics}) => mosaics)
        const hexIds = [].concat(...mosaics).map(({id}) => ({hex: id.toHex()}))
        this.addItems(hexIds)
    },

    fromNamespaces(namespaces: any, store: any) {
        this.store = store
        const items = namespaces
            .filter(({alias}) => alias instanceof MosaicAlias)
            .map(namespace => ({
                hex: new MosaicId(namespace.alias.mosaicId).toHex(),
                name: namespace.name,
            }))
            this.addItems(items)
    },

    fromMosaicAmountView(mosaic: MosaicAmountView, store: any) {
        this.store = store
        this.addItem({
              ...mosaic,
              hex: mosaic.mosaicInfo.mosaicId.toHex(),
              balance: getRelativeMosaicAmount(
                  mosaic.amount.compact(),
                  mosaic.mosaicInfo.divisibility,
              ),
              show: true,
              showInManage: true,
          })
    },

    fromGetCurrentNetworkMosaic( mosaicDefinitionTransaction: MosaicDefinitionTransaction,
                                  name: string,
                                  store: any) {
        this.store = store
        const {mosaicId, mosaicProperties} = mosaicDefinitionTransaction
        this.addItem({
            hex: mosaicId.toHex(),
            mosaicId,
            properties: mosaicProperties,
            name,
        })
    },
    
    // @TODO: refactor, pull out from here, rename 
    augmentTransactionsMosaics(transactions: any, store: any) {
      return new Promise(async (resolve, reject) => {
          try {
            const augmentedTransactionList = transactions.transferTransactionList
            .map(tx => {return {...tx, mosaics: tx.mosaics
            .map(mosaic => {
                const newMosaic = this.mosaics[mosaic.id.toHex()]
                if(!newMosaic) return mosaic
                return {...mosaic, ...newMosaic}
            })}})
            .map(tx => {
              return tx.mosaics.length === 1 && tx.mosaics[0] && tx.mosaics[0].mosaicInfo 
              ? {
                  ...tx,
                  infoThird: getRelativeMosaicAmount(
                      tx.mosaics[0].amount.compact(),
                      tx.mosaics[0].mosaicInfo.divisibility,
                  )
              }
              : tx
            })

            await store.commit('SET_TRANSACTION_LIST', {
                transferTransactionList: augmentedTransactionList,
                receiptList: transactions.receiptList,
            })
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
  },

  // @TODO: refactor, pull out from here, rename 
  augmentNewTransactionsMosaics(transactions, store, {isTxUnconfirmed}) {
      try {
        const augmentedTransactionList = transactions.transferTransactionList
        .map(tx => {return {...tx, mosaics: tx.mosaics
        .map(mosaic => {
            const newMosaic = this.mosaics[mosaic.id.toHex()]
            if(!newMosaic) return mosaic
            return {...mosaic, ...newMosaic}
        })}})
        .map(tx => {
          return tx.mosaics.length === 1 && tx.mosaics[0] && tx.mosaics[0].mosaicInfo 
          ? {
              ...tx,
              infoThird: getRelativeMosaicAmount(
                  tx.mosaics[0].amount.compact(),
                  tx.mosaics[0].mosaicInfo.divisibility,
              )
          }
          : tx
        })

        if(isTxUnconfirmed) {
          store.commit('ADD_UNCONFIRMED_TRANSACTION', {
              transferTransactionList: augmentedTransactionList,
              receiptList: transactions.receiptList,
          })
          return
        }

        store.commit('ADD_CONFIRMED_TRANSACTION', {
            transferTransactionList: augmentedTransactionList,
            receiptList: transactions.receiptList,
        })

    } catch (error) {
        console.error(error)
    }
  }
})