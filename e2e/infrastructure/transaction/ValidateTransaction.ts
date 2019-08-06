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

import {deepEqual} from 'assert';
import {expect} from 'chai';
import {MultisigCosignatoryModification} from '../../../src/model/transaction/MultisigCosignatoryModification';
import {TransactionType} from '../../../src/model/transaction/TransactionType';
import {UInt64} from '../../../src/model/UInt64';
import {Address} from '../../../src/model/account/Address';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { PublicAccount } from '../../../src/model/account/PublicAccount';
import { NetworkType } from '../../../src/model/blockchain/NetworkType';

const ValidateTransaction = {
    validateStandaloneTx: (transaction, transactionDTO) => {
        deepEqual(transaction.transactionInfo.height,
            new UInt64(transactionDTO.meta.height));
        expect(transaction.transactionInfo.hash)
            .to.be.equal(transactionDTO.meta.hash);
        expect(transaction.transactionInfo.merkleComponentHash)
            .to.be.equal(transactionDTO.meta.merkleComponentHash);
        expect(transaction.transactionInfo.index)
            .to.be.equal(transactionDTO.meta.index);
        expect(transaction.transactionInfo.id)
            .to.be.equal(transactionDTO.meta.id);

        expect(transaction.signature)
            .to.be.equal(transactionDTO.transaction.signature);
        expect(transaction.signer.publicKey)
            .to.be.equal(transactionDTO.transaction.signer);
        expect(transaction.networkType)
            .to.be.equal(parseInt(transactionDTO.transaction.version.toString(16).substr(0, 2), 16));
        expect(transaction.version)
            .to.be.equal(parseInt(transactionDTO.transaction.version.toString(16).substr(2, 2), 16));
        expect(transaction.type)
            .to.be.equal(transactionDTO.transaction.type);
        deepEqual(transaction.maxFee,
            new UInt64(transactionDTO.transaction.maxFee));
        deepEqual(transaction.deadline.toDTO(),
            transactionDTO.transaction.deadline);

        if (transaction.type === TransactionType.TRANSFER) {
            ValidateTransaction.validateTransferTx(transaction, transactionDTO);
        } else if (transaction.type === TransactionType.REGISTER_NAMESPACE) {
            ValidateTransaction.validateNamespaceCreationTx(transaction, transactionDTO);
        } else if (transaction.type === TransactionType.MOSAIC_DEFINITION) {
            ValidateTransaction.validateMosaicCreationTx(transaction, transactionDTO);
        } else if (transaction.type === TransactionType.MOSAIC_SUPPLY_CHANGE) {
            ValidateTransaction.validateMosaicSupplyChangeTx(transaction, transactionDTO);
        } else if (transaction.type === TransactionType.MODIFY_MULTISIG_ACCOUNT) {
            ValidateTransaction.validateMultisigModificationTx(transaction, transactionDTO);
        }
    },
    validateAggregateTx: (aggregateTransaction, aggregateTransactionDTO) => {
        deepEqual(aggregateTransaction.transactionInfo.height,
            new UInt64(aggregateTransactionDTO.meta.height));
        expect(aggregateTransaction.transactionInfo.hash)
            .to.be.equal(aggregateTransactionDTO.meta.hash);
        expect(aggregateTransaction.transactionInfo.merkleComponentHash)
            .to.be.equal(aggregateTransactionDTO.meta.merkleComponentHash);
        expect(aggregateTransaction.transactionInfo.index)
            .to.be.equal(aggregateTransactionDTO.meta.index);
        expect(aggregateTransaction.transactionInfo.id)
            .to.be.equal(aggregateTransactionDTO.meta.id);

        expect(aggregateTransaction.signature)
            .to.be.equal(aggregateTransactionDTO.transaction.signature);
        expect(aggregateTransaction.signer.publicKey)
            .to.be.equal(aggregateTransactionDTO.transaction.signer);
        expect(aggregateTransaction.networkType)
            .to.be.equal(parseInt(aggregateTransactionDTO.transaction.version.toString(16).substr(0, 2), 16));
        expect(aggregateTransaction.version)
            .to.be.equal(parseInt(aggregateTransactionDTO.transaction.version.toString(16).substr(2, 2), 16));
        expect(aggregateTransaction.type)
            .to.be.equal(aggregateTransactionDTO.transaction.type);
        deepEqual(aggregateTransaction.maxFee,
            new UInt64(aggregateTransactionDTO.transaction.maxFee));
        deepEqual(aggregateTransaction.deadline.toDTO(),
            aggregateTransactionDTO.transaction.deadline);

        ValidateTransaction.validateStandaloneTx(aggregateTransaction.innerTransactions[0],
            aggregateTransactionDTO.transaction.transactions[0]);
    },
    validateMosaicCreationTx: (mosaicDefinitionTransaction, mosaicDefinitionTransactionDTO) => {

        deepEqual(mosaicDefinitionTransaction.mosaicId,
            new MosaicId(mosaicDefinitionTransactionDTO.transaction.mosaicId));
        expect(mosaicDefinitionTransaction.mosaicProperties.divisibility)
            .to.be.equal(mosaicDefinitionTransactionDTO.transaction.properties[1].value[0]);
        deepEqual(mosaicDefinitionTransaction.mosaicProperties.duration,
            new UInt64(mosaicDefinitionTransactionDTO.transaction.properties[2].value));

        expect(mosaicDefinitionTransaction.mosaicProperties.supplyMutable)
            .to.be.equal(true);
        expect(mosaicDefinitionTransaction.mosaicProperties.transferable)
            .to.be.equal(true);
    },
    validateMosaicSupplyChangeTx: (mosaicSupplyChangeTransaction, mosaicSupplyChangeTransactionDTO) => {
        deepEqual(mosaicSupplyChangeTransaction.mosaicId,
            new MosaicId(mosaicSupplyChangeTransactionDTO.transaction.mosaicId));
        expect(mosaicSupplyChangeTransaction.direction)
            .to.be.equal(mosaicSupplyChangeTransactionDTO.transaction.direction);
        deepEqual(mosaicSupplyChangeTransaction.delta,
            new UInt64(mosaicSupplyChangeTransactionDTO.transaction.delta));
    },
    validateMultisigModificationTx: (modifyMultisigAccountTransaction, modifyMultisigAccountTransactionDTO) => {
        expect(modifyMultisigAccountTransaction.minApprovalDelta)
            .to.be.equal(modifyMultisigAccountTransactionDTO.transaction.minApprovalDelta);
        expect(modifyMultisigAccountTransaction.minRemovalDelta)
            .to.be.equal(modifyMultisigAccountTransactionDTO.transaction.minRemovalDelta);

        deepEqual(modifyMultisigAccountTransaction.modifications[0], new MultisigCosignatoryModification(
            modifyMultisigAccountTransactionDTO.transaction.modifications[0].modificiationType,
            PublicAccount.createFromPublicKey(modifyMultisigAccountTransactionDTO.transaction.modifications[0].cosignatoryPublicKey,
                                              NetworkType.MIJIN_TEST),
            ),
        );
    },
    validateNamespaceCreationTx: (registerNamespaceTransaction, registerNamespaceTransactionDTO) => {
        expect(registerNamespaceTransaction.namespaceType)
            .to.be.equal(registerNamespaceTransactionDTO.transaction.namespaceType);
        expect(registerNamespaceTransaction.namespaceName)
            .to.be.equal(registerNamespaceTransactionDTO.transaction.name);
        deepEqual(registerNamespaceTransaction.namespaceId,
            new NamespaceId(registerNamespaceTransactionDTO.transaction.namespaceId));

        if (registerNamespaceTransaction.namespaceType === 0) {
            deepEqual(registerNamespaceTransaction.duration,
                new UInt64(registerNamespaceTransactionDTO.transaction.duration));
        } else {
            deepEqual(registerNamespaceTransaction.parentId,
                new NamespaceId(registerNamespaceTransactionDTO.transaction.parentId));
        }
    },
    validateTransferTx: (transferTransaction, transferTransactionDTO) => {
        deepEqual(transferTransaction.recipient,
            Address.createFromEncoded(transferTransactionDTO.transaction.recipient));
        expect(transferTransaction.message.payload)
            .to.be.equal('test-message');
    },
};

export default ValidateTransaction;
