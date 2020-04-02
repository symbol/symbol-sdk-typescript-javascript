// /*
//  * Copyright 2018 NEM
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

// import { expect } from 'chai';
// import {Convert} from '../../../src/core/format';
// import { CreateTransactionFromPayload } from '../../../src/infrastructure/transaction/CreateTransactionFromPayload';
// import { Account } from '../../../src/model/account/Account';
// import { Address } from '../../../src/model/account/Address';
// import { MessageMarker } from '../../../src/model/message/MessageMarker';
// import { MessageType } from '../../../src/model/message/MessageType';
// import { PersistentHarvestingDelegationMessage } from '../../../src/model/message/PersistentHarvestingDelegationMessage';
// import { PlainMessage } from '../../../src/model/message/PlainMessage';
// import { ReceiptSource, ResolutionEntry, ResolutionType, TransactionInfo } from '../../../src/model/model';
// import { Mosaic } from '../../../src/model/mosaic/Mosaic';
// import { MosaicId } from '../../../src/model/mosaic/MosaicId';
// import { NetworkCurrencyLocal } from '../../../src/model/mosaic/NetworkCurrencyLocal';
// import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
// import { NetworkType } from '../../../src/model/network/NetworkType';
// import { ResolutionStatement } from '../../../src/model/receipt/ResolutionStatement';
// import { Statement } from '../../../src/model/receipt/Statement';
// import { Deadline } from '../../../src/model/transaction/Deadline';
// import { TransferTransaction } from '../../../src/model/transaction/TransferTransaction';
// import {UInt64} from '../../../src/model/UInt64';
// import { TestingAccount } from '../../conf/conf.spec';
// import { TransferTransactionBigInt } from '../../../src/model/transaction/BigInt/TransferTransactionBigInt';
// import { BigIntConvertUtil } from '../../../src/core/format/BigIntUtilities';
// import { TransactionMapping } from '../../../src/core/utils/TransactionMapping';

// describe('TransferTransaction', () => {
//     let account: Account;
//     const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
//     const delegatedPrivateKey = '8A78C9E9B0E59D0F74C0D47AB29FBD523C706293A3FA9CD9FE0EEB2C10EA924A';
//     const recipientPublicKey = '9DBF67474D6E1F8B131B4EB1F5BA0595AFFAE1123607BC1048F342193D7E669F';
//     const messageMarker = MessageMarker.PersistentDelegationUnlock;
//     let statement: Statement;
//     const unresolvedAddress = new NamespaceId('address');
//     const unresolvedMosaicId = new NamespaceId('mosaic');
//     const mosaicId = new MosaicId('0DC67FBE1CAD29E5');
//     before(() => {
//         account = TestingAccount;
//     });
//     before(() => {
//         account = TestingAccount;
//         statement = new Statement([],
//             [new ResolutionStatement(ResolutionType.Address, BigInt(2), unresolvedAddress,
//                 [new ResolutionEntry(account.address, new ReceiptSource(1, 0))])],
//             [new ResolutionStatement(ResolutionType.Mosaic, BigInt(2), unresolvedMosaicId,
//                 [new ResolutionEntry(mosaicId, new ReceiptSource(1, 0))])],
//         );
//     });

//     it('should createComplete an TransferTransaction object and sign it with mosaics', () => {
//         const transferTransaction = TransferTransaction.create(
//             Deadline.create(),
//             Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
//             [
//                 NetworkCurrencyLocal.createRelative(100),
//             ],
//             PlainMessage.create('test-message'),
//             NetworkType.MIJIN_TEST,
//             BigInt(1),
//         );

//         const transferTransactionBigInt = TransferTransactionBigInt.create(
//             Deadline.create(),
//             Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
//             [
//                 NetworkCurrencyLocal.createRelative(100),
//             ],
//             PlainMessage.create('test-message'),
//             NetworkType.MIJIN_TEST,
//             BigInt(1),
//         );

//         Object.assign(transferTransactionBigInt.deadline, transferTransaction.deadline);

//         const signedTransaction = transferTransaction.signWith(account, generationHash);
//         const signedTransactionBigInt = transferTransactionBigInt.signWith(account, generationHash);

//         expect(signedTransaction.payload).to.be.equal(signedTransactionBigInt.payload);
//         expect(signedTransaction.hash).to.be.equal(signedTransactionBigInt.hash);

//         const tx = TransactionMapping.createFromPayload(signedTransaction.payload);
//         const txBigInt = TransactionMapping.createFromPayloadBigInt(signedTransactionBigInt.payload);

//         console.log(BigInt(1).toString());
//         console.log(BigInt(txBigInt.maxFee).toString());

//         console.log(tx);
//         console.log(txBigInt);
//     });
// });
