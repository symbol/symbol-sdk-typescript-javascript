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
import {SecretLockTransaction as SecretLockTransactionLibrary, VerifiableTransaction} from 'nem2-library';
import {Address} from '../account/Address';
import {PublicAccount} from '../account/PublicAccount';
import {NetworkType} from '../blockchain/NetworkType';
import {Mosaic} from '../mosaic/Mosaic';
import {UInt64} from '../UInt64';
import {Deadline} from './Deadline';
import {HashType, HashTypeLengthValidator} from './HashType';
import {Transaction} from './Transaction';
import {TransactionInfo} from './TransactionInfo';
import {TransactionType} from './TransactionType';

export class SecretLockTransaction extends Transaction {

    /**
     * Create a secret lock transaction object.
     *
     * @param deadline - The deadline to include the transaction.
     * @param mosaic - The locked mosaic.
     * @param duration - The funds lock duration.
     * @param hashType - The hash algorithm secret is generated with.
     * @param secret - The proof hashed.
     * @param recipient - The recipient of the funds.
     * @param networkType - The network type.
     *
     * @return a SecretLockTransaction instance
     */
    public static create(deadline: Deadline,
                         mosaic: Mosaic,
                         duration: UInt64,
                         hashType: HashType,
                         secret: string,
                         recipient: Address,
                         networkType: NetworkType): SecretLockTransaction {
        return new SecretLockTransaction(
            networkType,
            3,
            deadline,
            UInt64.fromUint(0),
            mosaic,
            duration,
            hashType,
            secret,
            recipient,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param fee
     * @param mosaic
     * @param duration
     * @param hashType
     * @param secret
     * @param recipient
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                fee: UInt64,
                /**
                 * The locked mosaic.
                 */
                public readonly mosaic: Mosaic,
                /**
                 * The duration for the funds to be released or returned.
                 */
                public readonly duration: UInt64,
                /**
                 * The hash algorithm, secret is generated with.
                 */
                public readonly hashType: HashType,
                /**
                 * The proof hashed.
                 */
                public readonly secret: string,
                /**
                 * The recipient of the funds.
                 */
                public readonly recipient: Address,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.SECRET_LOCK, networkType, version, deadline, fee, signature, signer, transactionInfo);
        if (!HashTypeLengthValidator(hashType, this.secret)) {
            throw new Error('HashType and Secret have incompatible length or not hexadecimal string');
        }
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        return new SecretLockTransactionLibrary.Builder()
            .addDeadline(this.deadline.toDTO())
            .addType(this.type)
            .addFee(this.fee.toDTO())
            .addVersion(this.versionToDTO())
            .addMosaicId(this.mosaic.id.id.toDTO())
            .addMosaicAmount(this.mosaic.amount.toDTO())
            .addDuration(this.duration.toDTO())
            .addHashAlgorithm(this.hashType)
            .addSecret(this.secret)
            .addRecipient(this.recipient.plain())
            .build();
    }
}
