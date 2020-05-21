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

import {
    AggregateBondedTransactionBuilder,
    AggregateCompleteTransactionBuilder,
    AmountDto,
    CosignatureBuilder,
    EmbeddedTransactionBuilder,
    EmbeddedTransactionHelper,
    GeneratorUtils,
    Hash256Dto,
    KeyDto,
    SignatureDto,
    TimestampDto,
} from 'catbuffer-typescript';
import { KeyPair, MerkleHashBuilder, SHA3Hasher } from '../../core/crypto';
import { Convert } from '../../core/format';
import { DtoMapping } from '../../core/utils/DtoMapping';
import { CreateTransactionFromPayload } from '../../infrastructure/transaction/CreateTransactionFromPayload';
import { Account } from '../account/Account';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../network/NetworkType';
import { Statement } from '../receipt/Statement';
import { UInt64 } from '../UInt64';
import { AggregateTransactionCosignature } from './AggregateTransactionCosignature';
import { CosignatureSignedTransaction } from './CosignatureSignedTransaction';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { SignedTransaction } from './SignedTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';
import { Address } from '../account/Address';
import { NamespaceId } from '../namespace/NamespaceId';

/**
 * Aggregate innerTransactions contain multiple innerTransactions that can be initiated by different accounts.
 */
export class AggregateTransaction extends Transaction {
    /**
     * @param networkType
     * @param type
     * @param version
     * @param deadline
     * @param maxFee
     * @param innerTransactions
     * @param cosignatures
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(
        networkType: NetworkType,
        type: number,
        version: number,
        deadline: Deadline,
        maxFee: UInt64,
        /**
         * The array of innerTransactions included in the aggregate transaction.
         */
        public readonly innerTransactions: InnerTransaction[],
        /**
         * The array of transaction cosigners signatures.
         */
        public readonly cosignatures: AggregateTransactionCosignature[],
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo,
    ) {
        super(type, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create an aggregate complete transaction object
     * @param deadline - The deadline to include the transaction.
     * @param innerTransactions - The array of inner innerTransactions.
     * @param networkType - The network type.
     * @param cosignatures
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {AggregateTransaction}
     */
    public static createComplete(
        deadline: Deadline,
        innerTransactions: InnerTransaction[],
        networkType: NetworkType,
        cosignatures: AggregateTransactionCosignature[],
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): AggregateTransaction {
        return new AggregateTransaction(
            networkType,
            TransactionType.AGGREGATE_COMPLETE,
            TransactionVersion.AGGREGATE_COMPLETE,
            deadline,
            maxFee,
            innerTransactions,
            cosignatures,
            signature,
            signer,
        );
    }

    /**
     * Create an aggregate bonded transaction object
     * @param {Deadline} deadline
     * @param {InnerTransaction[]} innerTransactions
     * @param {NetworkType} networkType
     * @param {AggregateTransactionCosignature[]} cosignatures
     * @param {UInt64} maxFee - (Optional) Max fee defined by the sender
     * @param {string} signature - (Optional) Transaction signature
     * @param {PublicAccount} signer - (Optional) Signer public account
     * @return {AggregateTransaction}
     */
    public static createBonded(
        deadline: Deadline,
        innerTransactions: InnerTransaction[],
        networkType: NetworkType,
        cosignatures: AggregateTransactionCosignature[] = [],
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): AggregateTransaction {
        return new AggregateTransaction(
            networkType,
            TransactionType.AGGREGATE_BONDED,
            TransactionVersion.AGGREGATE_BONDED,
            deadline,
            maxFee,
            innerTransactions,
            cosignatures,
            signature,
            signer,
        );
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @returns {AggregateTransaction}
     */
    public static createFromPayload(payload: string): AggregateTransaction {
        /**
         * Get transaction type from the payload hex
         * As buffer uses separate builder class for Complete and bonded
         */
        const type = parseInt(Convert.uint8ToHex(Convert.hexToUint8(payload.substring(220, 224)).reverse()), 16);
        const builder =
            type === TransactionType.AGGREGATE_COMPLETE
                ? AggregateCompleteTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload))
                : AggregateBondedTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const innerTransactions = builder.getTransactions().map((t) => Convert.uint8ToHex(EmbeddedTransactionHelper.serialize(t)));
        const networkType = builder.getNetwork().valueOf();
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const signature = payload.substring(16, 144);
        const consignatures = builder.getCosignatures().map((cosig) => {
            return new AggregateTransactionCosignature(
                Convert.uint8ToHex(cosig.signature.signature),
                PublicAccount.createFromPublicKey(Convert.uint8ToHex(cosig.signerPublicKey.key), networkType),
            );
        });

        return type === TransactionType.AGGREGATE_COMPLETE
            ? AggregateTransaction.createComplete(
                  Deadline.createFromDTO(builder.deadline.timestamp),
                  innerTransactions.map((transactionRaw) => {
                      return CreateTransactionFromPayload(transactionRaw, true) as InnerTransaction;
                  }),
                  networkType,
                  consignatures,
                  new UInt64(builder.fee.amount),
                  signature.match(`^[0]+$`) ? undefined : signature,
                  signerPublicKey.match(`^[0]+$`) ? undefined : PublicAccount.createFromPublicKey(signerPublicKey, networkType),
              )
            : AggregateTransaction.createBonded(
                  Deadline.createFromDTO(builder.deadline.timestamp),
                  innerTransactions.map((transactionRaw) => {
                      return CreateTransactionFromPayload(transactionRaw, true) as InnerTransaction;
                  }),
                  networkType,
                  consignatures,
                  new UInt64(builder.fee.amount),
                  signature.match(`^[0]+$`) ? undefined : signature,
                  signerPublicKey.match(`^[0]+$`) ? undefined : PublicAccount.createFromPublicKey(signerPublicKey, networkType),
              );
    }

    /**
     * @description add inner transactions to current list
     * @param {InnerTransaction[]} transaction
     * @returns {AggregateTransaction}
     * @memberof AggregateTransaction
     */
    public addTransactions(transactions: InnerTransaction[]): AggregateTransaction {
        const innerTransactions = this.innerTransactions.concat(transactions);
        return DtoMapping.assign(this, { innerTransactions });
    }

    /**
     * @description add cosignatures to current list
     * @param {AggregateTransactionCosignature[]} transaction
     * @returns {AggregateTransaction}
     * @memberof AggregateTransaction
     */
    public addCosignatures(cosigs: AggregateTransactionCosignature[]): AggregateTransaction {
        const cosignatures = this.cosignatures.concat(cosigs);
        return DtoMapping.assign(this, { cosignatures });
    }

    /**
     * @internal
     * Sign transaction with cosignatories creating a new SignedTransaction
     * @param initiatorAccount - Initiator account
     * @param cosignatories - The array of accounts that will cosign the transaction
     * @param generationHash - Network generation hash hex
     * @returns {SignedTransaction}
     */
    public signTransactionWithCosignatories(
        initiatorAccount: Account,
        cosignatories: Account[],
        generationHash: string,
    ): SignedTransaction {
        const signedTransaction = this.signWith(initiatorAccount, generationHash);
        const transactionHashBytes = Convert.hexToUint8(signedTransaction.hash);
        let signedPayload = signedTransaction.payload;
        cosignatories.forEach((cosigner) => {
            const keyPairEncoded = KeyPair.createKeyPairFromPrivateKeyString(cosigner.privateKey);
            const signature = KeyPair.sign(keyPairEncoded, transactionHashBytes);
            signedPayload += cosigner.publicKey + Convert.uint8ToHex(signature);
        });

        // Calculate new size
        const size = `00000000${(signedPayload.length / 2).toString(16)}`;
        const formatedSize = size.substr(size.length - 8, size.length);
        const littleEndianSize =
            formatedSize.substr(6, 2) + formatedSize.substr(4, 2) + formatedSize.substr(2, 2) + formatedSize.substr(0, 2);

        signedPayload = littleEndianSize + signedPayload.substr(8, signedPayload.length - 8);
        return new SignedTransaction(signedPayload, signedTransaction.hash, initiatorAccount.publicKey, this.type, this.networkType);
    }

    /**
     * @internal
     * Sign transaction with cosignatories collected from cosigned transactions and creating a new SignedTransaction
     * For off chain Aggregated Complete Transaction co-signing.
     * @param initiatorAccount - Initiator account
     * @param {CosignatureSignedTransaction[]} cosignatureSignedTransactions - Array of cosigned transaction
     * @param generationHash - Network generation hash hex
     * @return {SignedTransaction}
     */
    public signTransactionGivenSignatures(
        initiatorAccount: Account,
        cosignatureSignedTransactions: CosignatureSignedTransaction[],
        generationHash: string,
    ): SignedTransaction {
        const signedTransaction = this.signWith(initiatorAccount, generationHash);
        let signedPayload = signedTransaction.payload;
        cosignatureSignedTransactions.forEach((cosignedTransaction) => {
            signedPayload += cosignedTransaction.signerPublicKey + cosignedTransaction.signature;
        });

        // Calculate new size
        const size = `00000000${(signedPayload.length / 2).toString(16)}`;
        const formatedSize = size.substr(size.length - 8, size.length);
        const littleEndianSize =
            formatedSize.substr(6, 2) + formatedSize.substr(4, 2) + formatedSize.substr(2, 2) + formatedSize.substr(0, 2);

        signedPayload = littleEndianSize + signedPayload.substr(8, signedPayload.length - 8);
        return new SignedTransaction(signedPayload, signedTransaction.hash, initiatorAccount.publicKey, this.type, this.networkType);
    }

    /**
     * Check if account has signed transaction
     * @param publicAccount - Signer public account
     * @returns {boolean}
     */
    public signedByAccount(publicAccount: PublicAccount): boolean {
        return (
            this.cosignatures.find((cosignature) => cosignature.signer.equals(publicAccount)) !== undefined ||
            (this.signer !== undefined && this.signer.equals(publicAccount))
        );
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a AggregateTransaction
     * @returns {number}
     * @memberof AggregateTransaction
     */
    public get size(): number {
        const byteSize = super.size;
        const byteTransactionHash = 32;
        // set static byte size fields
        const bytePayloadSize = 4;

        const byteHeader_Reserved1 = 4;

        // calculate each inner transaction's size
        let byteTransactions = 0;
        this.innerTransactions.forEach((transaction) => {
            const transactionByte = transaction.toAggregateTransactionBytes();
            const innerTransactionPadding = new Uint8Array(this.getInnerTransactionPaddingSize(transactionByte.length, 8));
            const paddedTransactionByte = GeneratorUtils.concatTypedArrays(transactionByte, innerTransactionPadding);
            byteTransactions += paddedTransactionByte.length;
        });

        const byteCosignatures = this.cosignatures.length * 96;
        return byteSize + byteTransactionHash + bytePayloadSize + byteHeader_Reserved1 + byteTransactions + byteCosignatures;
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = this.signer !== undefined ? Convert.hexToUint8(this.signer.publicKey) : new Uint8Array(32);
        const signatureBuffer = this.signature !== undefined ? Convert.hexToUint8(this.signature) : new Uint8Array(64);
        const transactions = this.innerTransactions.map((transaction) => (transaction as Transaction).toEmbeddedTransaction());
        const cosignatures = this.cosignatures.map((cosignature) => {
            const signerBytes = Convert.hexToUint8(cosignature.signer.publicKey);
            const signatureBytes = Convert.hexToUint8(cosignature.signature);
            return new CosignatureBuilder(new KeyDto(signerBytes), new SignatureDto(signatureBytes));
        });

        const transactionBuilder =
            this.type === TransactionType.AGGREGATE_COMPLETE
                ? new AggregateCompleteTransactionBuilder(
                      new SignatureDto(signatureBuffer),
                      new KeyDto(signerBuffer),
                      this.versionToDTO(),
                      this.networkType.valueOf(),
                      this.type.valueOf(),
                      new AmountDto(this.maxFee.toDTO()),
                      new TimestampDto(this.deadline.toDTO()),
                      new Hash256Dto(this.calculateInnerTransactionHash()),
                      transactions,
                      cosignatures,
                  )
                : new AggregateBondedTransactionBuilder(
                      new SignatureDto(signatureBuffer),
                      new KeyDto(signerBuffer),
                      this.versionToDTO(),
                      this.networkType.valueOf(),
                      this.type.valueOf(),
                      new AmountDto(this.maxFee.toDTO()),
                      new TimestampDto(this.deadline.toDTO()),
                      new Hash256Dto(this.calculateInnerTransactionHash()),
                      transactions,
                      cosignatures,
                  );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        throw new Error('Method not implemented');
    }

    /**
     * @internal
     * Generate inner transaction root hash (merkle tree)
     * @returns {Uint8Array}
     */
    private calculateInnerTransactionHash(): Uint8Array {
        // Note: Transaction hashing *always* uses SHA3
        const hasher = SHA3Hasher.createHasher(32);
        const builder = new MerkleHashBuilder(32);
        this.innerTransactions.forEach((transaction) => {
            const entityHash: Uint8Array = new Uint8Array(32);

            // for each embedded transaction hash their body
            hasher.reset();
            hasher.update(transaction.toAggregateTransactionBytes());
            hasher.finalize(entityHash);

            // update merkle tree (add transaction hash)
            builder.update(entityHash);
        });

        // calculate root hash with all transactions
        return builder.getRootHash();
    }

    /**
     * Gets the padding size that rounds up \a size to the next multiple of \a alignment.
     * @param size Inner transaction size
     * @param alignment Next multiple alignment
     */
    private getInnerTransactionPaddingSize(size: number, alignment: number): number {
        return 0 === size % alignment ? 0 : alignment - (size % alignment);
    }

    /**
     * @internal
     * @returns {AggregateTransaction}
     */
    public resolveAliases(statement: Statement): AggregateTransaction {
        const transactionInfo = this.checkTransactionHeightAndIndex();
        return DtoMapping.assign(this, {
            innerTransactions: this.innerTransactions
                .map((tx) => tx.resolveAliases(statement, transactionInfo.index))
                .sort((a, b) => a.transactionInfo!.index - b.transactionInfo!.index),
        });
    }

    /**
     * Set transaction maxFee using fee multiplier for **ONLY AGGREGATE TRANSACTIONS**
     * @param feeMultiplier The fee multiplier
     * @param requiredCosignatures Required number of cosignatures
     * @returns {AggregateTransaction}
     */
    public setMaxFeeForAggregate(feeMultiplier: number, requiredCosignatures: number): AggregateTransaction {
        if (this.type !== TransactionType.AGGREGATE_BONDED && this.type !== TransactionType.AGGREGATE_COMPLETE) {
            throw new Error('setMaxFeeForAggregate can only be used for aggregate transactions.');
        }
        // Check if current cosignature count is greater than requiredCosignatures.
        const calculatedCosignatures = requiredCosignatures > this.cosignatures.length ? requiredCosignatures : this.cosignatures.length;
        // Remove current cosignature length and use the calculated one.
        const calculatedSize = this.size - this.cosignatures.length * 96 + calculatedCosignatures * 96;
        return DtoMapping.assign(this, {
            maxFee: UInt64.fromUint(calculatedSize * feeMultiplier),
        });
    }

    /**
     * @internal
     * Check a given address should be notified in websocket channels
     * @param address address to be notified
     * @param alias address alias (names)
     * @returns {boolean}
     */
    public shouldNotifyAccount(address: Address, alias: NamespaceId[]): boolean {
        return (
            super.isSigned(address) ||
            this.cosignatures.find((_) => _.signer.address.equals(address)) !== undefined ||
            this.innerTransactions.find((innerTransaction: InnerTransaction) => innerTransaction.shouldNotifyAccount(address, alias)) !==
                undefined
        );
    }
}
