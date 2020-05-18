/*
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Observable, Subject } from 'rxjs';
import { filter, map, share, withLatestFrom } from 'rxjs/operators';
import * as WebSocket from 'ws';
import { Address } from '../model/account/Address';
import { PublicAccount } from '../model/account/PublicAccount';
import { BlockInfo } from '../model/blockchain/BlockInfo';
import { AggregateTransaction } from '../model/transaction/AggregateTransaction';
import { CosignatureSignedTransaction } from '../model/transaction/CosignatureSignedTransaction';
import { Deadline } from '../model/transaction/Deadline';
import { Transaction } from '../model/transaction/Transaction';
import { TransactionStatusError } from '../model/transaction/TransactionStatusError';
import { UInt64 } from '../model/UInt64';
import { IListener } from './IListener';
import { CreateTransactionFromDTO } from './transaction/CreateTransactionFromDTO';
import { NamespaceRepository } from './NamespaceRepository';
import { NamespaceName } from '../model/namespace/NamespaceName';

enum ListenerChannelName {
    block = 'block',
    confirmedAdded = 'confirmedAdded',
    unconfirmedAdded = 'unconfirmedAdded',
    unconfirmedRemoved = 'unconfirmedRemoved',
    aggregateBondedAdded = 'partialAdded',
    aggregateBondedRemoved = 'partialRemoved',
    cosignature = 'cosignature',
    modifyMultisigAccount = 'modifyMultisigAccount',
    status = 'status',
}

interface ListenerMessage {
    readonly channelName: ListenerChannelName;
    readonly message: Transaction | string | BlockInfo | TransactionStatusError | CosignatureSignedTransaction;
}

/**
 * Listener service
 */
export class Listener implements IListener {
    public readonly url: string;
    /**
     * @internal
     * WebSocket connector
     */
    private webSocket: WebSocket;
    /**
     * @internal
     * Message subject for all requests
     */
    private messageSubject: Subject<ListenerMessage>;
    /**
     * @internal
     * id
     */
    private uid: string;

    /**
     * Constructor
     * @param config - Listener configuration
     * @param websocketInjected - (Optional) WebSocket injected when using listeners in client
     */
    constructor(
        /**
         * Listener configuration.
         */
        private config: string,
        /**
         * Namespace repository for resolving account alias
         */
        private namespaceRepository: NamespaceRepository,
        /**
         * WebSocket injected when using listeners in client.
         */
        private websocketInjected?: any,
    ) {
        this.config = config.replace(/\/$/, '');
        this.url = `${this.config}/ws`;
        this.messageSubject = new Subject();
    }

    /**
     * Open web socket connection.
     * @returns Promise<Void>
     */
    public open(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.webSocket === undefined || this.webSocket.readyState === WebSocket.CLOSED) {
                if (this.websocketInjected) {
                    this.webSocket = new this.websocketInjected(this.url);
                } else {
                    this.webSocket = new WebSocket(this.url);
                }
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                this.webSocket.onopen = (): void => {};
                this.webSocket.onerror = (err: Error): void => {
                    reject(err);
                };
                this.webSocket.onmessage = (msg: any): void => {
                    const message = JSON.parse(msg.data as string);
                    this.handleMessage(message, resolve);
                };
            } else {
                resolve();
            }
        });
    }

    /**
     * @internal
     *
     * This method handles one incoming message from the web socket and it dispatches it to the message subject listener.
     *
     * @param message the object payload.
     * @param resolve the method to notify when the uid has been resolved and the listener connection has been stablished.
     */
    handleMessage(message: any, resolve: any): void {
        if (message.uid) {
            this.uid = message.uid;
            resolve();
        } else if (message.transaction) {
            this.messageSubject.next({
                channelName: message.meta.channelName,
                message: CreateTransactionFromDTO(message),
            });
        } else if (message.block) {
            this.messageSubject.next({
                channelName: ListenerChannelName.block,
                message: new BlockInfo(
                    message.meta.hash,
                    message.meta.generationHash,
                    message.meta.totalFee ? UInt64.fromNumericString(message.meta.totalFee) : new UInt64([0, 0]),
                    message.meta.numTransactions,
                    message.block.signature,
                    PublicAccount.createFromPublicKey(message.block.signerPublicKey, message.block.network),
                    message.block.network,
                    message.block.version,
                    message.block.type,
                    UInt64.fromNumericString(message.block.height),
                    UInt64.fromNumericString(message.block.timestamp),
                    UInt64.fromNumericString(message.block.difficulty),
                    message.block.feeMultiplier,
                    message.block.previousBlockHash,
                    message.block.blockTransactionsHash,
                    message.block.blockReceiptsHash,
                    message.block.stateHash,
                    message.block.proofGamma,
                    message.block.proofScalar,
                    message.block.proofVerificationHash,
                    message.block.beneficiaryPublicKey,
                ),
            });
        } else if (message.code) {
            this.messageSubject.next({
                channelName: ListenerChannelName.status,
                message: new TransactionStatusError(
                    Address.createFromEncoded(message.address),
                    message.hash,
                    message.code,
                    Deadline.createFromDTO(message.deadline),
                ),
            });
        } else if (message.parentHash) {
            this.messageSubject.next({
                channelName: ListenerChannelName.cosignature,
                message: new CosignatureSignedTransaction(message.parentHash, message.signature, message.signerPublicKey),
            });
        } else if (message.meta && message.meta.hash) {
            this.messageSubject.next({
                channelName: message.meta.channelName,
                message: message.meta.hash,
            });
        }
    }

    /**
     * returns a boolean that repressents the open state
     * @returns a boolean
     */
    public isOpen(): boolean {
        if (this.webSocket) {
            return this.webSocket.readyState === WebSocket.OPEN;
        }
        return false;
    }

    /**
     * Close web socket connection.
     * @returns void
     */
    public close(): void {
        if (this.webSocket && (this.webSocket.readyState === WebSocket.OPEN || this.webSocket.readyState === WebSocket.CONNECTING)) {
            this.webSocket.close();
        }
    }

    /**
     * Returns an observable stream of BlockInfo.
     * Each time a new Block is added into the blockchain,
     * it emits a new BlockInfo in the event stream.
     *
     * @return an observable stream of BlockInfo
     */
    public newBlock(): Observable<BlockInfo> {
        this.subscribeTo('block');
        return this.messageSubject.asObservable().pipe(
            share(),
            filter((_) => _.channelName === ListenerChannelName.block),
            filter((_) => _.message instanceof BlockInfo),
            map((_) => _.message as BlockInfo),
        );
    }

    /**
     * Returns an observable stream of Transaction for a specific address.
     * Each time a transaction is in confirmed state an it involves the address,
     * it emits a new Transaction in the event stream.
     *
     * @param address address we listen when a transaction is in confirmed state
     * @param transactionHash transactionHash for filtering multiple transactions
     * @return an observable stream of Transaction with state confirmed
     */
    public confirmed(address: Address, transactionHash?: string): Observable<Transaction> {
        this.subscribeTo(`confirmedAdded/${address.plain()}`);
        return this.messageSubject.asObservable().pipe(
            withLatestFrom(this.namespaceRepository.getAccountsNames([address])),
            filter((_) => _[0].channelName === ListenerChannelName.confirmedAdded),
            filter((_) => _[0].message instanceof Transaction),
            filter((_) =>
                (_[0].message as Transaction).NotifyAccount(
                    address,
                    ([] as NamespaceName[])
                        .concat(...Array.from(_[1].map((accountName) => accountName.names)))
                        .map((name) => name.namespaceId),
                ),
            ),
            filter((_) => {
                if (transactionHash === undefined) {
                    return true;
                } else {
                    const metaHash = (_[0].message as Transaction).transactionInfo!.hash;
                    return metaHash !== undefined ? metaHash.toUpperCase() === transactionHash.toUpperCase() : false;
                }
            }),
            map((_) => _[0].message as Transaction),
        );
    }

    /**
     * Returns an observable stream of Transaction for a specific address.
     * Each time a transaction is in unconfirmed state an it involves the address,
     * it emits a new Transaction in the event stream.
     *
     * @param address address we listen when a transaction is in unconfirmed state
     * @return an observable stream of Transaction with state unconfirmed
     */
    public unconfirmedAdded(address: Address): Observable<Transaction> {
        this.subscribeTo(`unconfirmedAdded/${address.plain()}`);
        return this.messageSubject.asObservable().pipe(
            withLatestFrom(this.namespaceRepository.getAccountsNames([address])),
            filter((_) => _[0].channelName === ListenerChannelName.unconfirmedAdded),
            filter((_) => _[0].message instanceof Transaction),
            filter((_) =>
                (_[0].message as Transaction).NotifyAccount(
                    address,
                    ([] as NamespaceName[])
                        .concat(...Array.from(_[1].map((accountName) => accountName.names)))
                        .map((name) => name.namespaceId),
                ),
            ),
            map((_) => _[0].message as Transaction),
        );
    }

    /**
     * Returns an observable stream of Transaction Hashes for specific address.
     * Each time a transaction with state unconfirmed changes its state,
     * it emits a new message with the transaction hash in the event stream.
     *
     * @param address address we listen when a transaction is removed from unconfirmed state
     * @return an observable stream of Strings with the transaction hash
     */
    public unconfirmedRemoved(address: Address): Observable<string> {
        this.subscribeTo(`unconfirmedRemoved/${address.plain()}`);
        return this.messageSubject.asObservable().pipe(
            filter((_) => _.channelName === ListenerChannelName.unconfirmedRemoved),
            filter((_) => typeof _.message === 'string'),
            map((_) => _.message as string),
        );
    }

    /**
     * Return an observable of {@link AggregateTransaction} for specific address.
     * Each time an aggregate bonded transaction is announced,
     * it emits a new {@link AggregateTransaction} in the event stream.
     *
     * @param address address we listen when a transaction with missing signatures state
     * @param transactionHash transactionHash for filtering multiple transactions
     * @return an observable stream of AggregateTransaction with missing signatures state
     */
    public aggregateBondedAdded(address: Address, transactionHash?: string): Observable<AggregateTransaction> {
        this.subscribeTo(`partialAdded/${address.plain()}`);
        return this.messageSubject.asObservable().pipe(
            withLatestFrom(this.namespaceRepository.getAccountsNames([address])),
            filter((_) => _[0].channelName === ListenerChannelName.aggregateBondedAdded),
            filter((_) => _[0].message instanceof AggregateTransaction),
            filter((_) =>
                (_[0].message as AggregateTransaction).NotifyAccount(
                    address,
                    ([] as NamespaceName[])
                        .concat(...Array.from(_[1].map((accountName) => accountName.names)))
                        .map((name) => name.namespaceId),
                ),
            ),
            filter((_) => {
                if (transactionHash === undefined) {
                    return true;
                } else {
                    const metaHash = (_[0].message as AggregateTransaction).transactionInfo!.hash;
                    return metaHash !== undefined ? metaHash.toUpperCase() === transactionHash.toUpperCase() : false;
                }
            }),
            map((_) => _[0].message as AggregateTransaction),
        );
    }

    /**
     * Returns an observable stream of Transaction Hashes for specific address.
     * Each time an aggregate bonded transaction is announced,
     * it emits a new message with the transaction hash in the event stream.
     *
     * @param address address we listen when a transaction is confirmed or rejected
     * @return an observable stream of Strings with the transaction hash
     */
    public aggregateBondedRemoved(address: Address): Observable<string> {
        this.subscribeTo(`partialRemoved/${address.plain()}`);
        return this.messageSubject.asObservable().pipe(
            filter((_) => _.channelName === ListenerChannelName.aggregateBondedRemoved),
            filter((_) => typeof _.message === 'string'),
            map((_) => _.message as string),
        );
    }

    /**
     * Returns an observable stream of {@link TransactionStatusError} for specific address.
     * Each time a transaction contains an error,
     * it emits a new message with the transaction status error in the event stream.
     *
     * @param address address we listen to be notified when some error happened
     * @return an observable stream of {@link TransactionStatusError}
     */
    public status(address: Address): Observable<TransactionStatusError> {
        this.subscribeTo(`status/${address.plain()}`);
        return this.messageSubject.asObservable().pipe(
            filter((_) => _.channelName === ListenerChannelName.status),
            filter((_) => _.message instanceof TransactionStatusError),
            map((_) => _.message as TransactionStatusError),
            filter((_) => address.equals(_.address)),
        );
    }

    /**
     * Returns an observable stream of {@link CosignatureSignedTransaction} for specific address.
     * Each time a cosigner signs a transaction the address initialized,
     * it emits a new message with the cosignatory signed transaction in the even stream.
     *
     * @param address address we listen when a cosignatory is added to some transaction address sent
     * @return an observable stream of {@link CosignatureSignedTransaction}
     */
    public cosignatureAdded(address: Address): Observable<CosignatureSignedTransaction> {
        this.subscribeTo(`cosignature/${address.plain()}`);
        return this.messageSubject.asObservable().pipe(
            filter((_) => _.channelName.toUpperCase() === ListenerChannelName.cosignature.toUpperCase()),
            filter((_) => _.message instanceof CosignatureSignedTransaction),
            map((_) => _.message as CosignatureSignedTransaction),
        );
    }

    /**
     * @internal
     * Subscribes to a channelName.
     * @param channel - Channel subscribed to.
     */
    private subscribeTo(channel: string): void {
        const subscriptionMessage = {
            uid: this.uid,
            subscribe: channel,
        };
        this.webSocket.send(JSON.stringify(subscriptionMessage));
    }
}
