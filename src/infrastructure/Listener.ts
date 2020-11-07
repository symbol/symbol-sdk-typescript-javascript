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

import { Observable, of, OperatorFunction, Subject } from 'rxjs';
import { filter, flatMap, map, share, switchMap } from 'rxjs/operators';
import { BlockInfoDTO } from 'symbol-openapi-typescript-fetch-client';
import * as WebSocket from 'ws';
import { Address } from '../model/account/Address';
import { PublicAccount } from '../model/account/PublicAccount';
import { FinalizedBlock } from '../model/blockchain/FinalizedBlock';
import { NewBlock } from '../model/blockchain/NewBlock';
import { NamespaceName } from '../model/namespace/NamespaceName';
import { AggregateTransaction } from '../model/transaction/AggregateTransaction';
import { CosignatureSignedTransaction } from '../model/transaction/CosignatureSignedTransaction';
import { Deadline } from '../model/transaction/Deadline';
import { Transaction } from '../model/transaction/Transaction';
import { TransactionStatusError } from '../model/transaction/TransactionStatusError';
import { UInt64 } from '../model/UInt64';
import { IListener } from './IListener';
import { NamespaceRepository } from './NamespaceRepository';
import { CreateTransactionFromDTO } from './transaction/CreateTransactionFromDTO';

export enum ListenerChannelName {
    block = 'block',
    confirmedAdded = 'confirmedAdded',
    unconfirmedAdded = 'unconfirmedAdded',
    unconfirmedRemoved = 'unconfirmedRemoved',
    partialAdded = 'partialAdded',
    partialRemoved = 'partialRemoved',
    cosignature = 'cosignature',
    modifyMultisigAccount = 'modifyMultisigAccount',
    status = 'status',
    finalizedBlock = 'finalizedBlock',
}

interface ListenerMessage {
    readonly channelName: ListenerChannelName;
    readonly channelParam: string;
    readonly message: Transaction | string | NewBlock | TransactionStatusError | CosignatureSignedTransaction | FinalizedBlock;
}

/**
 * Listener service
 */
export class Listener implements IListener {
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
     * @param url - Listener websocket server url. default: rest-gateway's url with ''/ws'' suffix. (e.g. http://localhost:3000/ws).
     * @param namespaceRepository - NamespaceRepository interface for resolving alias.
     * @param websocketInjected - (Optional) WebSocket injected when using listeners in client.
     */
    constructor(
        /**
         * Listener websocket server url. default: rest-gateway's url with ''/ws'' suffix. (e.g. http://localhost:3000/ws)
         */
        public readonly url: string,
        /**
         * Namespace repository for resolving account alias
         */
        private namespaceRepository: NamespaceRepository,
        /**
         * WebSocket injected when using listeners in client.
         */
        private websocketInjected?: any,
    ) {
        this.url = url.replace(/\/$/, '');
        this.messageSubject = new Subject();
    }

    /**
     * Open web socket connection.
     * @returns Promise<Void>
     */
    public open(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.webSocket === undefined || this.webSocket.readyState === this.webSocket.CLOSED) {
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
            return;
        }
        const topic = message.topic as string;
        const channelName = topic.indexOf('/') >= 0 ? topic.substr(0, topic.indexOf('/')) : topic;
        const channelParam = topic.indexOf('/') >= 0 ? topic.split('/')[1] : '';
        switch (channelName) {
            case ListenerChannelName.confirmedAdded:
            case ListenerChannelName.unconfirmedAdded:
            case ListenerChannelName.partialAdded:
                this.messageSubject.next({
                    channelName: ListenerChannelName[channelName],
                    channelParam: channelParam,
                    message: CreateTransactionFromDTO(message.data),
                });
                break;
            case ListenerChannelName.block:
                this.messageSubject.next({
                    channelName: ListenerChannelName[channelName],
                    channelParam: channelParam,
                    message: this.toNewBlock(message.data),
                });
                break;
            case ListenerChannelName.status:
                this.messageSubject.next({
                    channelName: ListenerChannelName[channelName],
                    channelParam: channelParam,
                    message: new TransactionStatusError(
                        Address.createFromRawAddress(channelParam),
                        message.data.hash,
                        message.data.code,
                        Deadline.createFromDTO(message.data.deadline),
                    ),
                });
                break;
            case ListenerChannelName.cosignature:
                this.messageSubject.next({
                    channelName: ListenerChannelName[channelName],
                    channelParam: channelParam,
                    message: new CosignatureSignedTransaction(
                        message.data.parentHash,
                        message.data.signature,
                        message.data.signerPublicKey,
                    ),
                });
                break;
            case ListenerChannelName.partialRemoved:
            case ListenerChannelName.unconfirmedRemoved:
                this.messageSubject.next({
                    channelName: ListenerChannelName[channelName],
                    channelParam: channelParam,
                    message: message.data.meta.hash,
                });
                break;
            case ListenerChannelName.finalizedBlock:
                this.messageSubject.next({
                    channelName: ListenerChannelName[channelName],
                    channelParam: channelParam,
                    message: new FinalizedBlock(
                        UInt64.fromNumericString(message.data.height),
                        message.data.hash,
                        message.data.finalizationPoint,
                        message.data.finalizationEpoch,
                    ),
                });
                break;
            default:
                throw new Error(`Channel: ${channelName} is not supported.`);
        }
    }

    /**
     * returns a boolean that repressents the open state
     * @returns a boolean
     */
    public isOpen(): boolean {
        if (this.webSocket) {
            return this.webSocket.readyState === this.webSocket.OPEN;
        }
        return false;
    }

    /**
     * Close web socket connection.
     * @returns void
     */
    public close(): void {
        if (
            this.webSocket &&
            (this.webSocket.readyState === this.webSocket.OPEN || this.webSocket.readyState === this.webSocket.CONNECTING)
        ) {
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
    public newBlock(): Observable<NewBlock> {
        this.subscribeTo('block');
        return this.messageSubject.asObservable().pipe(
            share(),
            filter((_) => _.channelName === ListenerChannelName.block),
            filter((_) => _.message instanceof NewBlock),
            map((_) => _.message as NewBlock),
        );
    }

    /**
     * Returns an observable stream of finalized block info.
     * Each time a new Block is finalized into the blockchain,
     * it emits a new FinalizedBlock in the event stream.
     *
     * @return an observable stream of BlockInfo
     */
    public finalizedBlock(): Observable<FinalizedBlock> {
        this.subscribeTo('finalizedBlock');
        return this.messageSubject.asObservable().pipe(
            share(),
            filter((_) => _.channelName === ListenerChannelName.finalizedBlock),
            filter((_) => _.message instanceof FinalizedBlock),
            map((_) => _.message as FinalizedBlock),
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
        return this.transactionSubscription(ListenerChannelName.confirmedAdded, address, transactionHash);
    }

    /**
     * Returns an observable stream of Transaction for a specific address.
     * Each time a transaction is in unconfirmed state an it involves the address,
     * it emits a new Transaction in the event stream.
     *
     * @param address address we listen when a transaction is in unconfirmed state
     * @param transactionHash transactionHash for filtering multiple transactions
     * @return an observable stream of Transaction with state unconfirmed
     */
    public unconfirmedAdded(address: Address, transactionHash?: string): Observable<Transaction> {
        return this.transactionSubscription(ListenerChannelName.unconfirmedAdded, address, transactionHash);
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
        return this.transactionSubscription(ListenerChannelName.partialAdded, address, transactionHash);
    }

    /**
     * Basic subscription for all the transactions status.
     * @param channel the transaction based channel
     * @param address the address
     * @param transactionHash the transaction hash filter.
     * @return an observable stream of Transactions
     */
    private transactionSubscription<T extends Transaction>(
        channel: ListenerChannelName,
        address: Address,
        transactionHash?: string,
    ): Observable<T> {
        this.subscribeTo(`${channel}/${address.plain()}`);
        return this.messageSubject.asObservable().pipe(
            filter((listenerMessage) => listenerMessage.channelName === channel),
            filter((listenerMessage) => listenerMessage.message instanceof Transaction),
            switchMap((_) => {
                const transactionObservable = of(_.message as T).pipe(
                    filter((transaction) => this.filterHash(transaction, transactionHash)),
                );
                if (_.channelParam.toUpperCase() === address.plain()) {
                    return transactionObservable;
                } else {
                    return transactionObservable.pipe(this.filterByNotifyAccount(address));
                }
            }),
        );
    }

    /**
     * Returns an observable stream of Transaction Hashes for specific address.
     * Each time a transaction with state unconfirmed changes its state,
     * it emits a new message with the transaction hash in the event stream.
     *
     * @param address address we listen when a transaction is removed from unconfirmed state
     * @param transactionHash the transaction hash filter.
     * @return an observable stream of Strings with the transaction hash
     */
    public unconfirmedRemoved(address: Address, transactionHash?: string): Observable<string> {
        return this.transactionHashSubscription(ListenerChannelName.unconfirmedRemoved, address, transactionHash);
    }

    /**
     * Returns an observable stream of Transaction Hashes for specific address.
     * Each time an aggregate bonded transaction is announced,
     * it emits a new message with the transaction hash in the event stream.
     *
     * @param address address we listen when a transaction is confirmed or rejected
     * @param transactionHash the transaction hash filter.
     * @return an observable stream of Strings with the transaction hash
     */
    public aggregateBondedRemoved(address: Address, transactionHash?: string): Observable<string> {
        return this.transactionHashSubscription(ListenerChannelName.partialRemoved, address, transactionHash);
    }

    /**
     * Generic subscription for all the transaction hash based channels.
     * @param channel the channel
     * @param address the address
     * @param transactionHash the transaction hash (optional)
     * @return an observable stream of Strings with the transaction hash
     */
    private transactionHashSubscription(
        channel: ListenerChannelName,
        address: Address,
        transactionHash: string | undefined,
    ): Observable<string> {
        this.subscribeTo(`${channel}/${address.plain()}`);
        return this.messageSubject.asObservable().pipe(
            filter((_) => _.channelName === channel),
            filter((_) => typeof _.message === 'string'),
            filter((_) => _.channelParam.toUpperCase() === address.plain()),
            map((_) => _.message as string),
            filter((_) => !transactionHash || _.toUpperCase() == transactionHash.toUpperCase()),
        );
    }

    /**
     * Returns an observable stream of {@link TransactionStatusError} for specific address.
     * Each time a transaction contains an error,
     * it emits a new message with the transaction status error in the event stream.
     *
     * @param address address we listen to be notified when some error happened
     * @param transactionHash transactionHash for filtering multiple transactions
     * @return an observable stream of {@link TransactionStatusError}
     */
    public status(address: Address, transactionHash?: string): Observable<TransactionStatusError> {
        this.subscribeTo(`status/${address.plain()}`);
        return this.messageSubject.asObservable().pipe(
            filter((_) => _.channelName === ListenerChannelName.status),
            filter((_) => _.message instanceof TransactionStatusError),
            filter((_) => _.channelParam.toUpperCase() === address.plain()),
            map((_) => _.message as TransactionStatusError),
            filter((_) => !transactionHash || _.hash.toUpperCase() == transactionHash.toUpperCase()),
        );
    }

    /**
     * Filters the transaction by hash if provided.
     * @param transaction the transaction
     * @param transactionHash the hash.
     */
    private filterHash(transaction: Transaction, transactionHash: string | undefined): boolean {
        if (transactionHash === undefined) {
            return true;
        } else {
            const metaHash = transaction.transactionInfo!.hash;
            return metaHash !== undefined ? metaHash.toUpperCase() === transactionHash.toUpperCase() : false;
        }
    }

    /**
     * It filters a transaction by address using the aliases.
     *
     * This method delegates the rest loading as much as possible. It tries to filter by signer first.
     *
     * Note: this filter performs one extra rest call and it should be down in the pipeline.
     *
     * @param address the address.
     * @return an observable filter.
     */
    private filterByNotifyAccount<T extends Transaction>(address: Address): OperatorFunction<T, T> {
        return (transactionObservable): Observable<T> => {
            return transactionObservable.pipe(
                flatMap((transaction) => {
                    if (transaction.isSigned(address)) {
                        return of(transaction);
                    }
                    const namespaceIdsObservable = this.namespaceRepository.getAccountsNames([address]).pipe(
                        map((names) => {
                            return ([] as NamespaceName[])
                                .concat(...Array.from(names.map((accountName) => accountName.names)))
                                .map((name) => name.namespaceId);
                        }),
                    );
                    return namespaceIdsObservable.pipe(
                        filter((namespaceIds) => transaction.shouldNotifyAccount(address, namespaceIds)),
                        map(() => transaction),
                    );
                }),
            );
        };
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
            filter((_) => _.channelParam.toUpperCase() === address.plain()),
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

    /**
     * This method maps a BlockInfoDTO from rest to the SDK's BlockInfo model object.
     *
     * @internal
     * @param {BlockInfoDTO} dto the dto object from rest.
     * @returns {NewBlock} a BlockInfo model
     */
    private toNewBlock(dto: BlockInfoDTO): NewBlock {
        const networkType = dto.block.network.valueOf();
        return new NewBlock(
            dto.meta.hash,
            dto.meta.generationHash,
            dto.block.signature,
            PublicAccount.createFromPublicKey(dto.block.signerPublicKey, networkType),
            networkType,
            dto.block.version,
            dto.block.type,
            UInt64.fromNumericString(dto.block.height),
            UInt64.fromNumericString(dto.block.timestamp),
            UInt64.fromNumericString(dto.block.difficulty),
            dto.block.feeMultiplier,
            dto.block.previousBlockHash,
            dto.block.transactionsHash,
            dto.block.receiptsHash,
            dto.block.stateHash,
            dto.block.proofGamma,
            dto.block.proofScalar,
            dto.block.proofVerificationHash,
            dto.block.beneficiaryAddress ? Address.createFromEncoded(dto.block.beneficiaryAddress) : undefined,
        );
    }
}
