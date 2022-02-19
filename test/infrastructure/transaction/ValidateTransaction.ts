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

import { deepEqual } from 'assert';
import { expect } from 'chai';
import { Convert } from '../../..';
import { Address } from '../../../src/model/account/Address';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { TransactionType } from '../../../src/model/transaction/TransactionType';
import { UInt64 } from '../../../src/model/UInt64';

const ValidateTransaction = {
    validateStandaloneTx: (transaction: any, transactionDTO: any): void => {
        deepEqual(transaction.transactionInfo.height, UInt64.fromNumericString(transactionDTO.meta.height));
        expect(transaction.transactionInfo.hash).to.be.equal(transactionDTO.meta.hash);
        expect(transaction.transactionInfo.merkleComponentHash).to.be.equal(transactionDTO.meta.merkleComponentHash);
        expect(transaction.transactionInfo.index).to.be.equal(transactionDTO.meta.index);
        expect(transaction.transactionInfo.id).to.be.equal(transactionDTO.id);

        expect(transaction.signature).to.be.equal(transactionDTO.transaction.signature);
        expect(transaction.signer.publicKey).to.be.equal(transactionDTO.transaction.signerPublicKey);
        expect(transaction.networkType).to.be.equal(transactionDTO.transaction.network);
        expect(transaction.version).to.be.equal(transactionDTO.transaction.version);
        expect(transaction.type).to.be.equal(transactionDTO.transaction.type);
        deepEqual(transaction.maxFee, UInt64.fromNumericString(transactionDTO.transaction.maxFee));
        deepEqual(transaction.deadline.toString(), transactionDTO.transaction.deadline);

        if (transaction.type === TransactionType.TRANSFER) {
            ValidateTransaction.validateTransferTx(transaction, transactionDTO);
        } else if (transaction.type === TransactionType.NAMESPACE_REGISTRATION) {
            ValidateTransaction.validateNamespaceCreationTx(transaction, transactionDTO);
        } else if (transaction.type === TransactionType.MOSAIC_DEFINITION) {
            ValidateTransaction.validateMosaicCreationTx(transaction, transactionDTO);
        } else if (transaction.type === TransactionType.MOSAIC_SUPPLY_CHANGE) {
            ValidateTransaction.validateMosaicSupplyChangeTx(transaction, transactionDTO);
        } else if (transaction.type === TransactionType.MOSAIC_SUPPLY_REVOCATION) {
            ValidateTransaction.validateMosaicSupplyRevocationTx(transaction, transactionDTO);
        } else if (transaction.type === TransactionType.MULTISIG_ACCOUNT_MODIFICATION) {
            ValidateTransaction.validateMultisigModificationTx(transaction, transactionDTO);
        } else if (transaction.type === TransactionType.ACCOUNT_METADATA) {
            ValidateTransaction.validateMetadataTx(transaction, transactionDTO);
        } else if (transaction.type === TransactionType.MOSAIC_METADATA) {
            ValidateTransaction.validateMosaicMetadataTx(transaction, transactionDTO);
        } else if (transaction.type === TransactionType.NAMESPACE_METADATA) {
            ValidateTransaction.validateNamespaceMetadataTx(transaction, transactionDTO);
        }
    },
    validateAggregateTx: (aggregateTransaction: any, aggregateTransactionDTO: any): void => {
        deepEqual(aggregateTransaction.transactionInfo.height, UInt64.fromNumericString(aggregateTransactionDTO.meta.height));
        expect(aggregateTransaction.transactionInfo.hash).to.be.equal(aggregateTransactionDTO.meta.hash);
        expect(aggregateTransaction.transactionInfo.merkleComponentHash).to.be.equal(aggregateTransactionDTO.meta.merkleComponentHash);
        expect(aggregateTransaction.transactionInfo.index).to.be.equal(aggregateTransactionDTO.meta.index);
        expect(aggregateTransaction.transactionInfo.id).to.be.equal(aggregateTransactionDTO.id);

        expect(aggregateTransaction.signature).to.be.equal(aggregateTransactionDTO.transaction.signature);
        expect(aggregateTransaction.signer.publicKey).to.be.equal(aggregateTransactionDTO.transaction.signerPublicKey);
        expect(aggregateTransaction.networkType).to.be.equal(aggregateTransactionDTO.transaction.network);
        expect(aggregateTransaction.version).to.be.equal(aggregateTransactionDTO.transaction.version);
        expect(aggregateTransaction.type).to.be.equal(aggregateTransactionDTO.transaction.type);
        deepEqual(aggregateTransaction.maxFee, UInt64.fromNumericString(aggregateTransactionDTO.transaction.maxFee));
        deepEqual(aggregateTransaction.deadline.toString(), aggregateTransactionDTO.transaction.deadline);

        ValidateTransaction.validateStandaloneTx(
            aggregateTransaction.innerTransactions[0],
            aggregateTransactionDTO.transaction.transactions[0],
        );
    },
    validateMosaicCreationTx: (mosaicDefinitionTransaction: any, mosaicDefinitionTransactionDTO: any): void => {
        deepEqual(mosaicDefinitionTransaction.mosaicId, new MosaicId(mosaicDefinitionTransactionDTO.transaction.id));
        expect(mosaicDefinitionTransaction.divisibility).to.be.equal(mosaicDefinitionTransactionDTO.transaction.divisibility);
        deepEqual(mosaicDefinitionTransaction.duration, UInt64.fromNumericString(mosaicDefinitionTransactionDTO.transaction.duration));

        expect(mosaicDefinitionTransaction.flags.supplyMutable).to.be.equal(true);
        expect(mosaicDefinitionTransaction.flags.transferable).to.be.equal(true);
    },
    validateMosaicSupplyChangeTx: (mosaicSupplyChangeTransaction: any, mosaicSupplyChangeTransactionDTO: any): void => {
        deepEqual(mosaicSupplyChangeTransaction.mosaicId, new MosaicId(mosaicSupplyChangeTransactionDTO.transaction.mosaicId));
        expect(mosaicSupplyChangeTransaction.action).to.be.equal(mosaicSupplyChangeTransactionDTO.transaction.action);
        deepEqual(mosaicSupplyChangeTransaction.delta, UInt64.fromNumericString(mosaicSupplyChangeTransactionDTO.transaction.delta));
    },
    validateMosaicSupplyRevocationTx: (mosaicSupplyRevocationTransaction: any, mosaicSupplyRevocationTransactionDTO: any): void => {
        deepEqual(mosaicSupplyRevocationTransaction.mosaic.id, new MosaicId(mosaicSupplyRevocationTransactionDTO.transaction.mosaicId));
        expect(mosaicSupplyRevocationTransaction.sourceAddress.encoded()).to.be.equal(
            mosaicSupplyRevocationTransactionDTO.transaction.sourceAddress,
        );
    },
    validateMultisigModificationTx: (modifyMultisigAccountTransaction: any, modifyMultisigAccountTransactionDTO: any): void => {
        expect(modifyMultisigAccountTransaction.minApprovalDelta).to.be.equal(
            modifyMultisigAccountTransactionDTO.transaction.minApprovalDelta,
        );
        expect(modifyMultisigAccountTransaction.minRemovalDelta).to.be.equal(
            modifyMultisigAccountTransactionDTO.transaction.minRemovalDelta,
        );
        expect(modifyMultisigAccountTransaction.addressAdditions.length).to.be.equal(1);
        expect(modifyMultisigAccountTransaction.addressDeletions.length).to.be.equal(0);
    },
    validateNamespaceCreationTx: (registerNamespaceTransaction: any, registerNamespaceTransactionDTO: any): void => {
        expect(registerNamespaceTransaction.registrationType).to.be.equal(registerNamespaceTransactionDTO.transaction.registrationType);
        expect(registerNamespaceTransaction.namespaceName).to.be.equal(registerNamespaceTransactionDTO.transaction.name);
        deepEqual(registerNamespaceTransaction.namespaceId, NamespaceId.createFromEncoded(registerNamespaceTransactionDTO.transaction.id));

        if (registerNamespaceTransaction.registrationType === 0) {
            deepEqual(
                registerNamespaceTransaction.duration,
                UInt64.fromNumericString(registerNamespaceTransactionDTO.transaction.duration),
            );
        } else {
            deepEqual(
                registerNamespaceTransaction.parentId,
                NamespaceId.createFromEncoded(registerNamespaceTransactionDTO.transaction.parentId),
            );
        }
    },
    validateTransferTx: (transferTransaction: any, transferTransactionDTO: any): void => {
        deepEqual(transferTransaction.recipientAddress, Address.createFromEncoded(transferTransactionDTO.transaction.recipientAddress));
        expect(transferTransaction.message.payload).to.be.equal('test-message');
    },
    validateMetadataTx: (metadataTransaction: any, metadataTransactionDTO: any): void => {
        expect(metadataTransaction.targetAddress.plain()).to.be.equal(metadataTransactionDTO.transaction.targetAddress);
        expect(metadataTransaction.metadataType).to.be.equal(metadataTransactionDTO.transaction.metadataType);
        deepEqual(metadataTransaction.scopedMetadataKey, UInt64.fromHex(metadataTransactionDTO.transaction.scopedMetadataKey));
        expect(metadataTransaction.valueSizeDelta).to.be.equal(metadataTransactionDTO.transaction.valueSizeDelta);
        deepEqual(metadataTransaction.value, Convert.hexToUint8(metadataTransactionDTO.transaction.value));
    },
    validateAccountMetadataTx: (accountMetadataTransaction: any, accountMetadataTransactionDTO: any): void => {
        ValidateTransaction.validateMetadataTx(accountMetadataTransaction, accountMetadataTransactionDTO);
    },
    validateMosaicMetadataTx: (mosaicMetadataTransaction: any, mosaicMetadataTransactionDTO: any): void => {
        ValidateTransaction.validateMetadataTx(mosaicMetadataTransaction, mosaicMetadataTransactionDTO);
        expect(mosaicMetadataTransaction.targetMosaicId.toHex()).to.be.equal(mosaicMetadataTransactionDTO.transaction.targetMosaicId);
    },
    validateNamespaceMetadataTx: (namespaceMetadataTransaction: any, namespaceMetadataTransactionDTO: any): void => {
        ValidateTransaction.validateMetadataTx(namespaceMetadataTransaction, namespaceMetadataTransactionDTO);
        expect(namespaceMetadataTransaction.targetNamespaceId.toHex()).to.be.equal(
            namespaceMetadataTransactionDTO.transaction.targetNamespaceId,
        );
    },
};

export default ValidateTransaction;
