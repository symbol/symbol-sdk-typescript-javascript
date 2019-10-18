import {MosaicAlias, MosaicId, MosaicHttp, Namespace, NamespaceId, Transaction, AliasType} from 'nem2-sdk'
import {
    FormattedTransaction,
    FormattedAggregateComplete,
    AppNamespace,
    AppState,
    MosaicNamespaceStatusType
} from '@/core/model'
import {flatMap, map, toArray} from 'rxjs/operators'
import {AppMosaic} from '@/core/model'
import {Store} from 'vuex'

export const AppMosaics = () => ({
    store: null,

    getAvailableToBeLinked(currentHeight: number, address: string, store: Store<AppState>): AppMosaic[] {
        const appMosaics: AppMosaic[] = Object.values(store.state.account.mosaics)
        return appMosaics
            .filter((mosaic: AppMosaic) =>(!mosaic.name
                    && mosaic.mosaicInfo
                    && mosaic.mosaicInfo.owner.address.plain() === address
                    && (mosaic.expirationHeight === MosaicNamespaceStatusType.FOREVER
                    || currentHeight < mosaic.expirationHeight)))
    },

    getItemsWithoutProperties(mosaics: Record<string, AppMosaic>): MosaicId[] {
        return Object.values(mosaics)
            .filter(({properties}) => !properties)
            .map(({hex}) => new MosaicId(hex))
    },

    getItemsWithoutName(mosaics: Record<string, AppMosaic>): MosaicId[] {
        return Object.values(mosaics).filter(({name}) => !name).map(({hex}) => new MosaicId(hex))
    },

    async updateMosaicsInfo(mosaics: Record<string, AppMosaic>, store: Store<AppState>): Promise<void> {
        const {node} = store.state.account
        const toUpdate = this.getItemsWithoutProperties(mosaics)
        if (!toUpdate.length) return

        try {
            const updatedMosaics = await new MosaicHttp(node)
            .getMosaics(toUpdate)
            .pipe(
                flatMap(x => x),
                map(x => (new AppMosaic({ hex: x.id.toHex(), mosaicInfo: x }))),
                toArray(),
            )
            .toPromise()
            store.commit('UPDATE_MOSAICS_INFO', updatedMosaics)
        } catch (error) {
            console.error("updateMosaicsInfo: error", error)
        }
    },

    async updateMosaicsName(mosaics: Record<string, AppMosaic>, store: Store<AppState>): Promise<void> {
        const {node} = store.state.account
        const toUpdate = this.getItemsWithoutName(mosaics)
        if (!toUpdate.length) return

        try {
            const mosaicsWithName = await new MosaicHttp(node)
                .getMosaicsNames(toUpdate)
                .pipe(
                    flatMap(x => x),
                    map(x => (new AppMosaic({
                        hex: x.mosaicId.toHex(),
                        name: x.names[0] && x.names[0].name || null
                    }))),
                    toArray(),
                )
                .toPromise()

            store.commit('UPDATE_MOSAICS_NAMESPACES', mosaicsWithName)
        } catch (error) {
            console.error("updateMosaicsName: error", error)
        }
    },

    /**
     * Extracts any MosaicId and NamespaceId from an array of transactions
     * Returns AppMosaics for MosaicId, hex Id for NamespaceIds
     * @param transactions
     */
    fromTransactions(transactions: Transaction[]): {appMosaics: AppMosaic[], namespaceIds: NamespaceId[]} {
        const allMosaics = transactions.map(x => this.extractMosaicsFromTransaction(x))
        const allMosaicsFlat1 = [].concat(...allMosaics).map(mosaic => mosaic)
        const allMosaicsFlat2 = [].concat(...allMosaicsFlat1).map(mosaic => mosaic)

        const allMosaicIds = allMosaicsFlat2
            .filter(x => (x && x.id instanceof MosaicId))
            .map(x => x.id.toHex())

        const allNamespaceIds = allMosaicsFlat2
            .filter(x => (x && x.id instanceof NamespaceId))
            .map(x => ({ id: x.id, hex: x.id.toHex() }))

        const namespaceHex = allNamespaceIds.map(({ hex }) => hex)
        const mosaicIdsNoDuplicate = allMosaicIds.filter((el, i, a) => i === a.indexOf(el))
        const namespaceHexNoDuplicate = namespaceHex.filter((el, i, a) => i === a.indexOf(el))
        const namespaceIds = namespaceHexNoDuplicate
                                .map(x => allNamespaceIds
                                        .find(({ hex }) => hex === x).id)
        return {
            appMosaics: mosaicIdsNoDuplicate.map(x => new AppMosaic({hex: x})),
            namespaceIds
        }
    },

    /**
     *
     * @param transaction
     */
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

    fromAppNamespaces(namespaces: AppNamespace[]): AppMosaic[] {
        return namespaces
          .filter(({alias}) => alias instanceof MosaicAlias)
          .map(namespace => AppMosaic.fromNamespace(namespace))
    },

    fromNamespaces(namespaces: Namespace[]): AppMosaic[] {
        return namespaces
            .filter(({alias}) => alias.type == AliasType.Mosaic )
            .map(namespace => AppMosaic.fromNamespace(namespace))
    },
})
