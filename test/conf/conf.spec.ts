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
    '26b64cb10f005e5988a36744ca19e20d835ccc7c105aaa5f3b212da593180930',
    NetworkType.PRIVATE_TEST,
);

export const MultisigAccount = Account.createFromPrivateKey(
    '5edebfdbeb32e9146d05ffd232c8af2cf9f396caf9954289daa0362d097fff3b',
    NetworkType.PRIVATE_TEST,
);

export const CosignatoryAccount = Account.createFromPrivateKey(
    '2a2b1f5d366a5dd5dc56c3c757cf4fe6c66e2787087692cf329d7a49a594658b',
    NetworkType.PRIVATE_TEST,
);

export const Cosignatory2Account = Account.createFromPrivateKey(
    'b8afae6f4ad13a1b8aad047b488e0738a437c7389d4ff30c359ac068910c1d59',
    NetworkType.PRIVATE_TEST,
);

export const Cosignatory3Account = Account.createFromPrivateKey(
    '111602be4d36f92dd60ca6a3c68478988578f26f6a02f8c72089839515ab603e',
    NetworkType.PRIVATE_TEST,
);

export const NIS2_URL = 'http://localhost:3000';
