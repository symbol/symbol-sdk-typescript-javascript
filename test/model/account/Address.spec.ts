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

import {expect} from 'chai';
import {Address} from '../../../src/model/account/Address';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';

describe('Address', () => {
    const publicKey = 'c2f93346e27ce6ad1a9f8f5e3066f8326593a406bdf357acb041e2f9ab402efe'.toUpperCase();

    it('createComplete an address given publicKey + NetworkType.MIJIN_TEST', () => {
        const address = Address.createFromPublicKey(publicKey, NetworkType.MIJIN_TEST);
        expect(address.plain()).to.be.equal('SCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRLIKCF2');
        expect(address.networkType).to.be.equal(NetworkType.MIJIN_TEST);
    });

    it('print the address in pretty format', () => {
        const address = Address.createFromPublicKey(publicKey, NetworkType.MIJIN_TEST);
        expect(address.pretty()).to.be.equal('SCTVW2-3D2MN5-VE4AQ4-TZIDZE-NGNOZX-PRPRLI-KCF2');
    });

    it('createComplete an address given publicKey + NetworkType.MIJIN', () => {
        const address = Address.createFromPublicKey(publicKey, NetworkType.MIJIN);
        expect(address.plain()).to.be.equal('MCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPR72DYSX');
        expect(address.networkType).to.be.equal(NetworkType.MIJIN);
    });

    it('createComplete an address given publicKey + NetworkType.MAIN_NET', () => {
        const address = Address.createFromPublicKey(publicKey, NetworkType.MAIN_NET);
        expect(address.plain()).to.be.equal('NCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPQUJ2ZML');
        expect(address.networkType).to.be.equal(NetworkType.MAIN_NET);
    });

    it('createComplete an address given publicKey + NetworkType.TEST_NET', () => {
        const address = Address.createFromPublicKey(publicKey, NetworkType.TEST_NET);
        expect(address.plain()).to.be.equal('TCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPSDRSFRF');
        expect(address.networkType).to.be.equal(NetworkType.TEST_NET);
    });

    it('createComplete an address given publicKey using Keccak', () => {
        const address = Address.createFromPublicKey(publicKey, NetworkType.MIJIN_TEST, true);
        expect(address.plain()).not.to.be.equal('SCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRLIKCF2');
        expect(address.plain()).to.be.equal('SB3AIJASMUZQK2X5LXISBMCCC6SC5PAURPSFZPCG');
        expect(address.networkType).to.be.equal(NetworkType.MIJIN_TEST);
    });

    it('createComplete an address given SCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRLIKCF2', () => {
        const address = Address.createFromRawAddress('SCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPRLIKCF2');
        expect(address.networkType).to.be.equal(NetworkType.MIJIN_TEST);
    });

    it('createComplete an address given MCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPR72DYSX', () => {
        const address = Address.createFromRawAddress('MCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPR72DYSX');
        expect(address.networkType).to.be.equal(NetworkType.MIJIN);
    });

    it('createComplete an address given TCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPSDRSFRF', () => {
        const address = Address.createFromRawAddress('NCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPQUJ2ZML');
        expect(address.networkType).to.be.equal(NetworkType.MAIN_NET);
    });

    it('createComplete an address given TCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPSDRSFRF', () => {
        const address = Address.createFromRawAddress('TCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPSDRSFRF');
        expect(address.networkType).to.be.equal(NetworkType.TEST_NET);
    });

    it('createComplete an address given SDRDGF-TDLLCB-67D4HP-GIMIHP-NSRYRJ-RT7DOB-GWZY', () => {
        const address = Address.createFromRawAddress('SDRDGF-TDLLCB-67D4HP-GIMIHP-NSRYRJ-RT7DOB-GWZY');
        expect(address.networkType).to.be.equal(NetworkType.MIJIN_TEST);
        expect(address.pretty()).to.be.equal('SDRDGF-TDLLCB-67D4HP-GIMIHP-NSRYRJ-RT7DOB-GWZY');
    });

    it('should throw Error when the address contain an invalid network identifier', () => {
        expect(() => {
            Address.createFromRawAddress('ZCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPSDRSFRF');
        }).to.throw('Address Network unsupported');
    });

    it('should throw Error when the address is not valid in length', () => {
        expect(() => {
            Address.createFromRawAddress('ZCTVW234AQ4TZIDZENGNOZXPRPSDRSFRF');
        }).to.throw('Address ZCTVW234AQ4TZIDZENGNOZXPRPSDRSFRF has to be 40 characters long');
    });

    it('should turn a lowercase address to uppercase', () => {
        const address = Address.createFromRawAddress('tctvw23d2mn5ve4aq4tzidzengnozxprpsdrsfrf');
        expect(address.plain()).to.be.equal('TCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPSDRSFRF');
    });

    it('should equal addresses', () => {
        const address = Address.createFromRawAddress('TCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPSDRSFRF');
        const compareAddress = Address.createFromRawAddress('TCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPSDRSFRF');
        expect(address.equals(compareAddress)).to.be.equal(true);
    });

    it('should not equal addresses', () => {
        const address = Address.createFromRawAddress('TCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPSDRSFRF');
        const compareAddress = Address.createFromRawAddress('TCTMW23D2MN5VE4AQ4TZIDZENGNOZXPRPSDRSFRF');
        expect(address.equals(compareAddress)).to.be.equal(false);
    });
});
