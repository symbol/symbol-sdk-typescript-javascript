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
import { PublicAccount } from '../../../src/model/account/PublicAccount';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { CosignatoryModificationAction } from '../../../src/model/transaction/CosignatoryModificationAction';
import { MultisigCosignatoryModification } from '../../../src/model/transaction/MultisigCosignatoryModification';

describe('MultisigCosignatoryModification', () => {
    it('should create Add MultisigCosignatoryModification', () => {
        const multisigCosignatoryModification = new MultisigCosignatoryModification(
            CosignatoryModificationAction.Add,
            PublicAccount.createFromPublicKey('C52C211CF935C61D65F26B253AA260416F018C3D21E4D184A7671F403C849BBB', NetworkType.MIJIN_TEST),
        );
        expect(multisigCosignatoryModification.cosignatoryPublicAccount.publicKey).to.be.equal(
            'C52C211CF935C61D65F26B253AA260416F018C3D21E4D184A7671F403C849BBB',
        );
        expect(multisigCosignatoryModification.modificationAction).to.be.equal(CosignatoryModificationAction.Add);
    });

    it('should create Add MultisigCosignatoryModification and get toDTO correctly', () => {
        const multisigCosignatoryModification = new MultisigCosignatoryModification(
            CosignatoryModificationAction.Add,
            PublicAccount.createFromPublicKey('C52C211CF935C61D65F26B253AA260416F018C3D21E4D184A7671F403C849BBB', NetworkType.MIJIN_TEST),
        ).toDTO();
        expect(multisigCosignatoryModification.cosignatoryPublicKey).to.be.equal(
            'C52C211CF935C61D65F26B253AA260416F018C3D21E4D184A7671F403C849BBB',
        );
        expect(multisigCosignatoryModification.modificationAction).to.be.equal(CosignatoryModificationAction.Add);
    });

    it('should create Remove MultisigCosignatoryModification', () => {
        const multisigCosignatoryModification = new MultisigCosignatoryModification(
            CosignatoryModificationAction.Remove,
            PublicAccount.createFromPublicKey('C52C211CF935C61D65F26B253AA260416F018C3D21E4D184A7671F403C849BBB', NetworkType.MIJIN_TEST),
        );
        expect(multisigCosignatoryModification.cosignatoryPublicAccount.publicKey).to.be.equal(
            'C52C211CF935C61D65F26B253AA260416F018C3D21E4D184A7671F403C849BBB',
        );
        expect(multisigCosignatoryModification.modificationAction).to.be.equal(CosignatoryModificationAction.Remove);
    });

    it('should create Remove MultisigCosignatoryModification and get toDTO correctly', () => {
        const multisigCosignatoryModification = new MultisigCosignatoryModification(
            CosignatoryModificationAction.Remove,
            PublicAccount.createFromPublicKey('C52C211CF935C61D65F26B253AA260416F018C3D21E4D184A7671F403C849BBB', NetworkType.MIJIN_TEST),
        ).toDTO();
        expect(multisigCosignatoryModification.cosignatoryPublicKey).to.be.equal(
            'C52C211CF935C61D65F26B253AA260416F018C3D21E4D184A7671F403C849BBB',
        );
        expect(multisigCosignatoryModification.modificationAction).to.be.equal(CosignatoryModificationAction.Remove);
    });
});
