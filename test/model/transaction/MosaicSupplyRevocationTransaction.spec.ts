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

import { expect } from 'chai';
import { Mosaic } from '../../../src/model/mosaic';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { ReceiptSource, ResolutionEntry, ResolutionStatement, ResolutionType, Statement } from '../../../src/model/receipt';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { MosaicSupplyRevocationTransaction } from '../../../src/model/transaction/MosaicSupplyRevocationTransaction';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';
describe('MosaicSupplyRevocationTransaction', () => {
    const account = TestingAccount;
    const unresolvedMosaicId = new NamespaceId('mosaic');
    const unresolvedAddress = new NamespaceId('address');
    const mosaicId = new MosaicId('0DC67FBE1CAD29E5');
    const height = UInt64.fromUint(2);
    const epochAdjustment = 1573430400;
    const statement = new Statement(
        [],
        [
            new ResolutionStatement(ResolutionType.Address, height, unresolvedAddress, [
                new ResolutionEntry(account.address, new ReceiptSource(1, 0)),
            ]),
        ],
        [
            new ResolutionStatement(ResolutionType.Mosaic, height, unresolvedMosaicId, [
                new ResolutionEntry(mosaicId, new ReceiptSource(1, 0)),
            ]),
        ],
    );

    it('should create transaction', () => {
        const transaction = MosaicSupplyRevocationTransaction.create(
            Deadline.create(epochAdjustment),
            unresolvedAddress,
            new Mosaic(unresolvedMosaicId, UInt64.fromUint(5)),
            NetworkType.TEST_NET,
        );

        expect(transaction.sourceAddress).to.deep.equal(unresolvedAddress);
        expect(transaction.mosaic.id).to.deep.equal(unresolvedMosaicId);
        expect(transaction.mosaic.amount.toString()).to.deep.equal('5');
        expect(transaction.maxFee.toString()).to.be.equal('0');
        expect(transaction.networkType).to.be.equal(NetworkType.TEST_NET);
    });

    it('should resolve aliases', () => {
        const unresolvedTransaction = MosaicSupplyRevocationTransaction.create(
            Deadline.create(epochAdjustment),
            unresolvedAddress,
            new Mosaic(unresolvedMosaicId, UInt64.fromUint(5)),
            NetworkType.TEST_NET,
        );
        (unresolvedTransaction as any).transactionInfo = {
            height: height,
            index: 0,
        };

        const transaction = unresolvedTransaction.resolveAliases(statement);

        expect(transaction.sourceAddress).to.deep.equal(account.address);
        expect(transaction.mosaic.id).to.deep.equal(mosaicId);
        expect(transaction.mosaic.amount.toString()).to.deep.equal('5');
        expect(transaction.maxFee.toString()).to.be.equal('0');
        expect(transaction.networkType).to.be.equal(NetworkType.TEST_NET);
    });
});
