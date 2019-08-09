import {
    Deadline,
    UInt64,
    PublicAccount,
    AggregateTransaction,
    AccountHttp,
    Address
} from 'nem2-sdk'
import {SdkV0} from "./sdkDefine";

export const multisigInterface: SdkV0.multisig = {

    getMultisigAccountInfo: async (params) => {
        const {address, node} = params
        const accountHttp = new AccountHttp(node)
        const multisigInfo = await accountHttp.getMultisigAccountInfo(Address.createFromRawAddress(address)).toPromise();
        return {
            result: {
                multisigInfo: multisigInfo
            }
        }
    },

    bondedMultisigTransaction: async (params) => {
        let {transaction, multisigPublickey, networkType, account, fee} = params
        transaction = transaction.map((item) => {
            item.toAggregate(PublicAccount.createFromPublicKey(multisigPublickey, networkType))
            return item
        })
        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            transaction,
            networkType,
            [],
            UInt64.fromUint(fee)
        );
        return {
            result: {
                aggregateTransaction: aggregateTransaction
            }
        }
    },

    completeMultisigTransaction: async (params) => {
        let {transaction, multisigPublickey, networkType, fee} = params
        transaction = transaction.map((item) => {
            item = item.toAggregate(PublicAccount.createFromPublicKey(multisigPublickey, networkType))
            return item
        })
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            transaction,
            networkType,
            [],
            UInt64.fromUint(fee)
        );
        return {
            result: {
                aggregateTransaction: aggregateTransaction
            }
        }
    },
}
