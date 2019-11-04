import {
    MosaicAlias,
    MosaicId,
    MosaicHttp,
    Namespace,
    Transaction,
    AliasType,
    AddressAlias,
    EmptyAlias,
} from 'nem2-sdk'
import {
    FormattedTransaction,
    FormattedAggregateComplete,
    AppNamespace,
    AppState,
    MosaicNamespaceStatusType,
} from '@/core/model'
import {flatMap, map, toArray} from 'rxjs/operators'
import {AppMosaic} from '@/core/model'
import {Store} from 'vuex'
import {flattenArrayOfStrings} from '@/core/utils'

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
                        name: x.names[0] && x.names[0].name || null,
                        namespaceHex: x.names[0] && x.names[0].namespaceId.toHex() || null,
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
    fromTransactions(transactions: Transaction[]): AppMosaic[] {
        const allMosaics = transactions.map(x => this.extractMosaicsFromTransaction(x))
        const flattenedMosaicIds = flattenArrayOfStrings(allMosaics)

        const allMosaicIds = flattenedMosaicIds
            .filter(x => (x && x.id instanceof MosaicId))
            .map(x => x.id.toHex())

        const mosaicIdsNoDuplicate = allMosaicIds.filter((el, i, a) => i === a.indexOf(el))
        return mosaicIdsNoDuplicate.map(x => new AppMosaic({hex: x}))
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

    fromNamespaces(namespaces: Namespace[], mosaics: Record<string, AppMosaic>): AppMosaic[] {
        const aliasExcludingAddresses = namespaces.filter(({alias}) => alias && alias.type !== AliasType.Address)
        if (!aliasExcludingAddresses.length) return []

        const mosaicsWithAliases = Object.values(mosaics).filter((mosaic: AppMosaic) => mosaic.name)

        const namespacesWithEmptyAlias = aliasExcludingAddresses.filter(({alias}) => alias instanceof EmptyAlias)
        const unBoundMosaics = mosaicsWithAliases.filter(m => namespacesWithEmptyAlias
                .find(({name})=>name === m.name))
                .map(m => new AppMosaic({ hex: m.hex, name: null }))
        
        const namespacesWithAlias = aliasExcludingAddresses.filter(({alias}) => alias instanceof AddressAlias)
        
        const AppMosaics = namespacesWithAlias.map(namespace => AppMosaic.fromNamespace(namespace))

        return [...unBoundMosaics, ...AppMosaics]
    },
})
