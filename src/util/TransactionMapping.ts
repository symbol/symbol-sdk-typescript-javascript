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

import { convert } from 'nem2-library';
import { CreateTransactionFromDTO } from '../infrastructure/transaction/CreateTransactionFromDTO';
import { PublicAccount } from '../model/account/PublicAccount';
import { NetworkType } from '../model/blockchain/NetworkType';
import { AccountPropertyModification } from '../model/transaction/AccountPropertyModification';
import { Deadline } from '../model/transaction/Deadline';
import { ModifyAccountPropertyAddressTransaction } from '../model/transaction/ModifyAccountPropertyAddressTransaction';
import { ModifyAccountPropertyEntityTypeTransaction } from '../model/transaction/ModifyAccountPropertyEntityTypeTransaction';
import { ModifyAccountPropertyMosaicTransaction } from '../model/transaction/ModifyAccountPropertyMosaicTransaction';
import { Transaction } from '../model/transaction/Transaction';
import { TransactionInfo } from '../model/transaction/TransactionInfo';
import { TransactionType } from '../model/transaction/TransactionType';
import { UInt64 } from '../model/UInt64';
import { CreateTransactionFromBinary } from './CreateTransactionFromBinary';

export class TransactionMapping {

    public static createFromJson(dataJson: object): Transaction {
        return CreateTransactionFromDTO(dataJson);
    }

    public static createFromBinary(dataBytes: string): Transaction  | undefined {
        return CreateTransactionFromBinary(dataBytes);
    }

    public static serialize(): string {
        throw new Error();
    }

    public static serializeJson(): object {
        throw new Error();
    }
}
