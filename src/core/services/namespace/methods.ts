import {NamespaceHttp, Address, QueryParams, NamespaceId} from 'nem2-sdk'
import {AppNamespace, AppState, FormattedTransaction, FormattedAggregateComplete} from '@/core/model'
import {flattenArrayOfStrings} from '@/core/utils'
import {Store} from 'vuex'


export const setNamespaces = async (address: string, store: Store<AppState>): Promise<void> => {
    try {
        const {node} = store.state.account
        const namespaces = await getNamespacesFromAddress(address, node)
        store.commit('UPDATE_NAMESPACES', namespaces)
    } catch (error) {
        store.commit('RESET_NAMESPACES')
        throw new Error(error)
    } finally {
        store.commit('SET_NAMESPACE_LOADING', false)
    }
}

export const getNamespacesFromAddress = async (address: string,
                                               node: string): Promise<AppNamespace[]> => {
    try {
        const namespaceHttp = new NamespaceHttp(node)
        const accountAddress = Address.createFromRawAddress(address)
        const namespaceInfo = await namespaceHttp
            .getNamespacesFromAccount(accountAddress, new QueryParams(100))
            .toPromise()

        const namespaceIds = namespaceInfo.map(nsInfo => nsInfo.id)
        const namespaceNames = namespaceIds.length
            ? await namespaceHttp.getNamespacesName(namespaceIds).toPromise()
            : []

        return namespaceInfo.map(nsInfo => AppNamespace.fromNamespaceInfo(nsInfo, namespaceNames))
    } catch (error) {
        throw new Error(error)
    }
}

export const getNamespaceNameFromNamespaceId = (hexId: string, store: Store<AppState>) => {
    const {namespaces} = store.state.account
    const namespace = namespaces.find(({ hex }) => hex === hexId)
    if (namespace === undefined) return hexId
    return namespace.name
}

export const extractNamespacesFromTransaction = (transaction: FormattedTransaction): any[] => {
    if (transaction instanceof FormattedAggregateComplete && transaction.formattedInnerTransactions) {
        return transaction.formattedInnerTransactions.map(extractNamespacesFromTransaction)
    }
    const tx: any = transaction.rawTx
    if (tx.recipientAddress && tx.recipientAddress instanceof NamespaceId) return tx.recipientAddress
}

export const handleRecipientAddressAsNamespaceId = async (  transactions: FormattedTransaction[],
                                                            store: Store<AppState>): Promise<void> => {
    try {
        const namespaceIds = transactions.map(extractNamespacesFromTransaction)
        if (!namespaceIds.length) return

        const {node, namespaces} = store.state.account
        
        const newNamespacesIds = flattenArrayOfStrings(namespaceIds)
            .filter(x => x)                            
            .map(x => x.toHex())
            .filter(x => namespaces.find(({hex}) => hex === x) === undefined)
            .filter((el, i, a) => i === a.indexOf(el))
            .map(x => NamespaceId.createFromEncoded(x))

    if (!newNamespacesIds.length) return
        const newNamespaces = await new NamespaceHttp(node).getNamespacesName(newNamespacesIds).toPromise()
        const appNamespaces = AppNamespace.fromNamespaceNames(newNamespaces)
        store.commit('ADD_NAMESPACE_FROM_RECIPIENT_ADDRESS', appNamespaces)
    } catch (error) {
        console.error("handleRecipientAddressAsNamespaceId -> error", error)
    }
}

export const formatSenderOrRecipient = (recipient: string | NamespaceId, store: Store<AppState>): string => {
    if (recipient instanceof NamespaceId) {
        return getNamespaceNameFromNamespaceId(recipient.id.toHex(), store)
    }
    return recipient
}
