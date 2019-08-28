import { Observable } from "rxjs";
import { Address, Listener } from "nem2-sdk";

export interface ListenerRepository {
    openWs(listener: any): Observable<any>;

    listenerUnconfirmed(listener: any, address: Address, fn: any): Observable<any>;

    listenerConfirmed(listener: any, address: Address, fn: any): Observable<any>;

    listenerTxStatus(listener: any, address: Address, fn: any): Observable<any>;

    sendMultisigWs(address: Address, account: any, node: string, signedBondedTx: any, signedLockTx: any, listener: any): Observable<any>;

    newBlock(listener: Listener, pointer: any): Observable<any>;
}
