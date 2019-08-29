import {
    Deadline,
    UInt64,
    PublicAccount,
    AggregateTransaction,
    AccountHttp,
    Address, NetworkType, Account, Transaction
} from 'nem2-sdk'
import { from as observableFrom, Observable } from "rxjs";

export class MultisigApiRxjs  {
    getMultisigAccountInfo(
        address: string,
        node: string
    ) {
        if (!address) return
        const accountHttp = new AccountHttp(node)
        return observableFrom(accountHttp.getMultisigAccountInfo(Address.createFromRawAddress(address)))
    }

    bondedMultisigTransaction(
        networkType: NetworkType,
        fee: number,
        multisigPublickey: string,
        transaction: Array<Transaction>
    ) {
        transaction = transaction.map((item) => {
            item = item.toAggregate(PublicAccount.createFromPublicKey(multisigPublickey, networkType))
            return item
        })
        return AggregateTransaction.createBonded(
            Deadline.create(),
            transaction,
            networkType,
            [],
            UInt64.fromUint(fee)
        );
    }


    completeMultisigTransaction(
        networkType: NetworkType,
        fee: number,
        multisigPublickey: string,
        transaction: Array<Transaction>) {
        transaction = transaction.map((item) => {
            item = item.toAggregate(PublicAccount.createFromPublicKey(multisigPublickey, networkType))
            return item
        })
        return AggregateTransaction.createComplete(
            Deadline.create(),
            transaction,
            networkType,
            [],
            UInt64.fromUint(fee)
        );
    }
}
