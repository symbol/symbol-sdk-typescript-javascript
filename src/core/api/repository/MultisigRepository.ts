import {
    Account,
    AggregateTransaction,
    NetworkType,
    Transaction
} from "nem2-sdk";
import { Observable } from "rxjs";

export interface MultisigRepository {
    getMultisigAccountInfo(address: string, node: string): Observable<any>;


    completeMultisigTransaction(
        networkType: NetworkType,
        fee: number,
        multisigPublickey: string,
        transaction: Array<Transaction>): AggregateTransaction;


    bondedMultisigTransaction(
        networkType: NetworkType,
        account: Account,
        fee: number,
        multisigPublickey: string,
        transaction: Array<Transaction>
    ): AggregateTransaction;
}
