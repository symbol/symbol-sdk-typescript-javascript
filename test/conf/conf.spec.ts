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

import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/network/NetworkType';

export const TestingAccount = Account.createFromPrivateKey(
    '575DBB3062267EFF57C970A336EBBC8FBCFE12C5BD3ED7BC11EB0481D7704CED',
    NetworkType.TEST_NET,
);

export const MultisigAccount = Account.createFromPrivateKey(
    '5B0E3FA5D3B49A79022D7C1E121BA1CBBF4DB5821F47AB8C708EF88DEFC29BFE',
    NetworkType.TEST_NET,
);

export const CosignatoryAccount = Account.createFromPrivateKey(
    '738BA9BB9110AEA8F15CAA353ACA5653B4BDFCA1DB9F34D0EFED2CE1325AEEDA',
    NetworkType.TEST_NET,
);

export const Cosignatory2Account = Account.createFromPrivateKey(
    'E8BF9BC0F35C12D8C8BF94DD3A8B5B4034F1063948E3CC5304E55E31AA4B95A6',
    NetworkType.TEST_NET,
);

export const Cosignatory3Account = Account.createFromPrivateKey(
    'C325EA529674396DB5675939E7988883D59A5FC17A28CA977E3BA85370232A83',
    NetworkType.TEST_NET,
);

export const NIS2_URL = 'http://localhost:3000';
