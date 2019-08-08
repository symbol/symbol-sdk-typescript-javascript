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
    ModifyMultisigAccountTransaction, HashLockTransaction, NetworkCurrencyMosaic, TransactionHttp, AccountHttp, Address
} from 'nem2-sdk'
import {SdkV0} from "./sdkDefine";
import {filter} from "rxjs/operators";
import {mergeMap} from "rxjs/internal/operators/mergeMap";

export const multisigInterface: SdkV0.multisig = {
    /*
    multisign coversion
    * */
    // covertToBeMultisig: async (params) => {
    //     const {minApprovalDelta, minRemovalDelta, multisigCosignatoryModificationList, networkType, account, fee} = params
    //
    //     const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
    //         Deadline.create(),
    //         minApprovalDelta,
    //         minRemovalDelta,
    //         multisigCosignatoryModificationList,
    //         networkType,
    //         UInt64.fromUint(fee)
    //     );
    //     const aggregateTransaction = AggregateTransaction.createBonded(
    //         Deadline.create(),
    //         [modifyMultisigAccountTransaction.toAggregate(account.publicAccount)],
    //         networkType,
    //         [],
    //         UInt64.fromUint(fee)
    //     );
    //
    //     return {
    //         result: {
    //             aggregateTransaction: aggregateTransaction
    //         }
    //     };
    // },

    // multisetCosignatoryModification: async (params) => {
    //     const {multisigPublickey, minApprovalDelta, minRemovalDelta, multisigCosignatoryModificationList, networkType, account, fee} = params
    //     const multisigPublicAccount = PublicAccount.createFromPublicKey(multisigPublickey, NetworkType.MIJIN_TEST)
    //     const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
    //         Deadline.create(),
    //         Number(minApprovalDelta),
    //         Number(minRemovalDelta),
    //         multisigCosignatoryModificationList,
    //         networkType,
    //     );
    //     const aggregateTransaction = AggregateTransaction.createBonded(
    //         Deadline.create(),
    //         [modifyMultisigAccountTransaction.toAggregate(multisigPublicAccount)],
    //         networkType,
    //         [],
    //         UInt64.fromUint(fee)
    //     );
    //
    //     return {
    //         result: {
    //             aggregateTransaction: aggregateTransaction
    //         }
    //     }
    //
    // },

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
                aggregateTransaction:aggregateTransaction
            }
        }
    },

    completeMultisigTransaction: async (params) => {
        const {transaction, multisigPublickey, networkType, account, generationHash, node, fee} = params
        const transactionHttp = new TransactionHttp(node);

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transaction.toAggregate(PublicAccount.createFromPublicKey(multisigPublickey, networkType))],
            networkType,
            [],
            UInt64.fromUint(fee)
        );
        // todo 代码合并后修改
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        console.log(signedTransaction)
        transactionHttp.announce(signedTransaction).subscribe(x => console.log(x), err => console.error(err));
        return {
            result: {
                result: ''
            }
        }
    },


    completeCosignatoryModification: async (params) => {
        const {multisigPublickey, minApprovalDelta, minRemovalDelta, networkType, account, generationHash, node, fee, multisigCosignatoryModificationList} = params
        const multisigPublicAccount = PublicAccount.createFromPublicKey(
            multisigPublickey, networkType,
        );
        const modifyMultisigAccountTx = ModifyMultisigAccountTransaction.create(
            Deadline.create(),
            Number(minApprovalDelta),
            Number(minRemovalDelta),
            multisigCosignatoryModificationList,
            networkType,
            UInt64.fromUint(fee)
        );
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [modifyMultisigAccountTx.toAggregate(multisigPublicAccount)],
            networkType,
            [],
            UInt64.fromUint(fee)
        );

        // todo 代码合并后修改
        const signedTransaction = account.sign(aggregateTransaction, generationHash)
        console.log(signedTransaction, 'completeCosignatoryModification')
        const announceStatus = await new TransactionHttp(node).announce(signedTransaction);

        return {
            result: {
                result: ''
            }
        }
    }
}
