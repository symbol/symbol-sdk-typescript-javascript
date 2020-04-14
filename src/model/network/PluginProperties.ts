/*
import { AccountLinkNetworkProperties } from './AccountLinkNetworkProperties';
 * Copyright 2020 NEM
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

import { AccountLinkNetworkProperties } from './AccountLinkNetworkProperties';
import { AccountRestrictionNetworkProperties } from './AccountRestrictionNetworkProperties';
import { AggregateNetworkProperties } from './AggregateNetworkProperties';
import { HashLockNetworkProperties } from './HashLockNetworkProperties';
import { MetadataNetworkProperties } from './MetadataNetworkProperties';
import { MosaicNetworkProperties } from './MosaicNetworkProperties';
import { MosaicRestrictionNetworkProperties } from './MosaicRestrictionNetworkProperties';
import { MultisigNetworkProperties } from './MultisigNetworkProperties';
import { NamespaceNetworkProperties } from './NamespaceNetworkProperties';
import { SecretLockNetworkProperties } from './SecretLockNetworkProperties';
import { TransferNetworkProperties } from './TransferNetworkProperties';

/**
 * Network related configuration properties.
 */
export class PluginProperties {
    /**
     * @param accountlink - Network identifier.
     * @param aggregate - Nemesis public key.
     * @param lockhash - Nemesis generation hash.
     * @param locksecret - Nemesis epoch time adjustment.
     * @param metadata -
     * @param mosaic -
     * @param multisig -
     * @param namespace -
     * @param restrictionaccount -
     * @param restrictionmosaic -
     * @param transfer -
     */
    constructor(
        public readonly accountlink?: AccountLinkNetworkProperties,
        public readonly aggregate?: AggregateNetworkProperties,
        public readonly lockhash?: HashLockNetworkProperties,
        public readonly locksecret?: SecretLockNetworkProperties,
        public readonly metadata?: MetadataNetworkProperties,
        public readonly mosaic?: MosaicNetworkProperties,
        public readonly multisig?: MultisigNetworkProperties,
        public readonly namespace?: NamespaceNetworkProperties,
        public readonly restrictionaccount?: AccountRestrictionNetworkProperties,
        public readonly restrictionmosaic?: MosaicRestrictionNetworkProperties,
        public readonly transfer?: TransferNetworkProperties,
    ) {}
}
