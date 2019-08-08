import {
    Deadline,
    UInt64,
    NetworkType,
    MultisigCosignatoryModification,
    MultisigCosignatoryModificationType,
    PublicAccount,
    MosaicId,
    Mosaic,
    AggregateTransaction,
    ModifyMultisigAccountTransaction,
    HashLockTransaction,
    NetworkCurrencyMosaic,
    TransactionHttp,
    AccountHttp,
    Address
    // @ts-ignore
} from 'nem2-sdk'
import {SdkV0} from "./sdkDefine";
import {filter} from "rxjs/operators";
import {mergeMap} from "rxjs/internal/operators/mergeMap";

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
        const {transaction, multisigPublickey, networkType, account, fee} = params
        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [transaction.toAggregate(PublicAccount.createFromPublicKey(multisigPublickey, networkType))],
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
        const {transaction, multisigPublickey, networkType, fee} = params

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transaction.toAggregate(PublicAccount.createFromPublicKey(multisigPublickey, networkType))],
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
