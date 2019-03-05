/*
 * Copyright 2019 NEM
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

import { MosaicSupplyChangeTransaction as MosaicSupplyChangeTransactionLibrary, VerifiableTransaction } from 'nem2-library';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { MosaicId } from '../mosaic/MosaicId';
import { AliasActionType } from '../namespace/AliasActionType';
import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { AddressAliasTransaction } from './AddressAliasTransaction';
import { Deadline } from './Deadline';
import { MosaicAliasTransaction } from './MosaicAliasTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

export abstract class AliasTransaction extends Transaction {

    /**
     * Create an address alias transaction object
     * @param deadline - The deadline to include the transaction.
     * @param maxFee - Max fee defined by the sender
     * @param aliasAction - The namespace id.
     * @param namespaceId - The namespace id.
     * @param address - The address.
     * @param networkType - The network type.
     * @returns {AddressAliasTransaction}
     */
    public static createForAddress(deadline: Deadline,
                                   maxFee: UInt64,
                                   aliasAction: AliasActionType,
                                   namespaceId: NamespaceId,
                                   address: Address,
                                   networkType: NetworkType): AliasTransaction {
        return AddressAliasTransaction.create(deadline, maxFee, aliasAction, namespaceId, address, networkType);
    }

    /**
     * Create a mosaic alias transaction object
     * @param deadline - The deadline to include the transaction.
     * @param maxFee - Max fee defined by the sender
     * @param aliasAction - The namespace id.
     * @param namespaceId - The namespace id.
     * @param mosaicId - The mosaic id.
     * @param networkType - The network type.
     * @returns {MosaicAliasTransaction}
     */
    public static createForMosaic(deadline: Deadline,
                                  maxFee: UInt64,
                                  aliasAction: AliasActionType,
                                  namespaceId: NamespaceId,
                                  mosaicId: MosaicId,
                                  networkType: NetworkType): AliasTransaction {
        return MosaicAliasTransaction.create(deadline, maxFee, aliasAction, namespaceId, mosaicId, networkType);
    }

}
