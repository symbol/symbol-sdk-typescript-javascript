import {Transaction, Address, TransactionType} from 'nem2-sdk'
import {
    FormattedTransfer,
    FormattedRegisterNamespace,
    FormattedAddressAlias,
    FormattedMosaicAlias,
    FormattedMosaicDefinition,
    FormattedMosaicSupplyChange,
    FormattedModifyMultisigAccount,
    FormattedAggregateComplete,
    FormattedAggregateBonded,
    FormattedLock,
    FormattedSecretLock,
    FormattedSecretProof,
    FormattedModifyAccountRestrictionAddress,
    FormattedModifyAccountRestrictionMosaic,
    FormattedModifyAccountRestrictionOperation,
    FormattedLinkAccount,
} from '@/core/model'

const transactionFactory = () => ({
    router: {
        [TransactionType.TRANSFER] : FormattedTransfer,
        [TransactionType.REGISTER_NAMESPACE] : FormattedRegisterNamespace,
        [TransactionType.ADDRESS_ALIAS] : FormattedAddressAlias,
        [TransactionType.MOSAIC_ALIAS] : FormattedMosaicAlias,
        [TransactionType.MOSAIC_DEFINITION] : FormattedMosaicDefinition,
        [TransactionType.MOSAIC_SUPPLY_CHANGE] : FormattedMosaicSupplyChange,
        [TransactionType.MODIFY_MULTISIG_ACCOUNT] : FormattedModifyMultisigAccount,
        [TransactionType.AGGREGATE_COMPLETE] : FormattedAggregateComplete,
        [TransactionType.AGGREGATE_BONDED] : FormattedAggregateBonded,
        [TransactionType.LOCK] : FormattedLock,
        [TransactionType.SECRET_LOCK] : FormattedSecretLock,
        [TransactionType.SECRET_PROOF] : FormattedSecretProof,
        [TransactionType.MODIFY_ACCOUNT_RESTRICTION_ADDRESS] : FormattedModifyAccountRestrictionAddress,
        [TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC] : FormattedModifyAccountRestrictionMosaic,
        [TransactionType.MODIFY_ACCOUNT_RESTRICTION_OPERATION] : FormattedModifyAccountRestrictionOperation,
        [TransactionType.LINK_ACCOUNT] : FormattedLinkAccount,
    },

    get(  transaction: Transaction,
          address: Address,
          currentXem: string,
          xemDivisibility: number,
          store: any) {
        const {type} = transaction
        const formatter = this.router[type]
        if (!formatter) throw new Error(`no formatter found for transaction type ${type}`)
        return new formatter(transaction, address, currentXem, xemDivisibility, store)
    }
})

export const transactionFormatter = ( transactionList: Array<Transaction>,
                                      accountAddress: Address,
                                      currentXEM: string,
                                      xemDivisibility: number,
                                      node: string,
                                      currentXem: string,
                                      store: any) => {

    // @TODO: manage address aliases
    const enrichedTransactions = transactionList
    return enrichedTransactions
        .map(transaction => transactionFactory().get( transaction,
                                                      accountAddress,
                                                      currentXem,
                                                      xemDivisibility,
                                                      store))
}
