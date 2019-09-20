import {MosaicAlias, MosaicId, MosaicHttp, Namespace} from 'nem2-sdk'
import {FormattedTransfer, FormattedTransaction, FormattedAggregateComplete} from '../transactions'
import {flatMap, map, toArray} from 'rxjs/operators'
import {AppMosaic} from '@/core/model'

export const AppMosaics = () => ({
    store: null,

    getAvailableToBeLinked(currentHeight: number, address: string, store: any): AppMosaic[] {
        const appMosaics: AppMosaic[] = Object.values(store.getters.mosaicList)
        return appMosaics
            .filter((mosaic: AppMosaic) => (!mosaic.name
                && mosaic.mosaicInfo
                && mosaic.mosaicInfo.owner.address.plain() === address
                && (mosaic.expirationHeight === 'Forever' || currentHeight > mosaic.expirationHeight)))
    },

    getLinked(currentHeight: number, address: string, store: any): AppMosaic[] {
        const appMosaics: AppMosaic[] = Object.values(store.getters.mosaics)
        return appMosaics
            .filter((mosaic: AppMosaic) => (mosaic.name
                && mosaic.mosaicInfo
                && mosaic.mosaicInfo.owner.address.plain() === address
                && mosaic.expirationHeight === 'Forever'
                || currentHeight > mosaic.expirationHeight))
    },

    getItemsWithoutProperties(mosaics: Record<string, AppMosaic>): MosaicId[] {
        return Object.values(mosaics)
            .filter(({properties}) => !properties)
            .map(({hex}) => new MosaicId(hex))
    },

    async updateMosaicInfo(mosaics: Record<string, AppMosaic>, node: string): Promise<AppMosaic[]> {
        const toUpdate = this.getItemsWithoutProperties(mosaics)

        if (!toUpdate.length) return
        const updatedMosaics = await new MosaicHttp(node)
            .getMosaics(toUpdate)
            .pipe(
                flatMap(x => x),
                map(x => (new AppMosaic({mosaicInfo: x, hex: x.mosaicId.toHex()}))),
                toArray(),
            )
            .toPromise()
        return updatedMosaics
    },

    fromTransactions(transactions: FormattedTransfer[]) {
        const allMosaics = transactions.map(x => this.extractMosaicsFromTransaction(x))
        const allMosaicsFlat1 = [].concat(...allMosaics).map(mosaic => mosaic)
        const allMosaicsFlat2 = [].concat(...allMosaicsFlat1).map(mosaic => mosaic)
        const allHexIds = allMosaicsFlat2.filter(x => x).map(x => x.id.toHex())
        const noDuplicate = allHexIds.filter((el, i, a) => i === a.indexOf(el))
        return noDuplicate.map(x => new AppMosaic({hex: x}))
    },

    extractMosaicsFromTransaction(transaction: FormattedTransaction): any[] {
        if (transaction instanceof FormattedAggregateComplete
            && transaction.formattedInnerTransactions) {
            return transaction.formattedInnerTransactions
                .map(t => this.extractMosaicsFromTransaction(t))
        }
        const tx: any = transaction.rawTx
        if (tx.mosaic) return tx.mosaic
        if (tx.mosaics) return tx.mosaics
        if (tx.mosaicId) return tx.mosaicId
    },

    fromNamespaces(namespaces: Namespace[]): AppMosaic[] {
        return namespaces
            .filter(({alias}) => alias instanceof MosaicAlias)
            .map(namespace => AppMosaic.fromNamespace(namespace))
    },
})
