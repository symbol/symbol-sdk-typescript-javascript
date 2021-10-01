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
import { expect } from 'chai';
import { Convert, RawAddress } from '../../../src/core/format';
import { UnresolvedMapping } from '../../../src/core/utils/UnresolvedMapping';
import { Address } from '../../../src/model/account/Address';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../../src/model/network/NetworkType';

describe('UnresolvedMapping', () => {
    let mosaicId: MosaicId;
    let namespacId: NamespaceId;
    let address: Address;

    before(() => {
        mosaicId = new MosaicId('11F4B1B3AC033DB5');
        namespacId = NamespaceId.createFromEncoded('9550CA3FC9B41FC5');
        address = Address.createFromRawAddress('VATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA35C4KNQ');
    });

    describe('toUnresolvedMosaic', () => {
        it('can map hex string to MosaicId', () => {
            const unresolved = UnresolvedMapping.toUnresolvedMosaic(mosaicId.toHex());
            expect(unresolved instanceof MosaicId).to.be.true;
            expect(unresolved instanceof NamespaceId).to.be.false;
        });

        it('can map hex string to NamespaceId', () => {
            const unresolved = UnresolvedMapping.toUnresolvedMosaic(namespacId.toHex());
            expect(unresolved instanceof MosaicId).to.be.false;
            expect(unresolved instanceof NamespaceId).to.be.true;
        });

        it('should throw error if id not in hex', () => {
            expect(() => {
                UnresolvedMapping.toUnresolvedMosaic('test');
            }).to.throw(Error, 'Input string is not in valid hexadecimal notation.');
        });
    });

    describe('toUnresolvedAddress', () => {
        it('can map hex string to Address', () => {
            const unresolved = UnresolvedMapping.toUnresolvedAddress(Convert.uint8ToHex(RawAddress.stringToAddress(address.plain())));
            expect(unresolved instanceof Address).to.be.true;
            expect(unresolved instanceof NamespaceId).to.be.false;
        });

        it('can map alias address', () => {
            const unresolved = UnresolvedMapping.toUnresolvedAddress('THBIMC3THGH5RUYAAAAAAAAAAAAAAAAAAAAAAAA');
            expect(unresolved instanceof Address).to.be.false;
            expect(unresolved instanceof NamespaceId).to.be.true;
            expect(Convert.uint8ToHex(unresolved.encodeUnresolvedAddress(NetworkType.TEST_NET))).eq(
                '99C2860B73398FD8D3000000000000000000000000000000',
            );
        });

        it('can map real address', () => {
            const unresolved = UnresolvedMapping.toUnresolvedAddress('NATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA35C4KNQ');
            expect(unresolved instanceof Address).to.be.true;
            expect(unresolved instanceof NamespaceId).to.be.false;
            expect(Convert.uint8ToHex(unresolved.encodeUnresolvedAddress(NetworkType.MAIN_NET))).eq(
                '6826D27E1D0A26CA4E316F901E23E55C8711DB20DF45C536',
            );
        });

        it('can map hex string to NamespaceId', () => {
            const unresolved = UnresolvedMapping.toUnresolvedMosaic(namespacId.toHex());
            expect(unresolved instanceof MosaicId).to.be.false;
            expect(unresolved instanceof NamespaceId).to.be.true;
        });

        it('should throw error if id not in hex', () => {
            expect(() => {
                UnresolvedMapping.toUnresolvedAddress('test');
            }).to.throw(Error, 'Address TEST has to be 39 characters long');
        });
    });

    describe('toUnresolvedAddressBytes', () => {
        it('can map Address to buffer', () => {
            const buffer = UnresolvedMapping.toUnresolvedAddressBytes(address, NetworkType.PRIVATE_TEST);
            expect(buffer instanceof Uint8Array).to.be.true;
            expect(Convert.uint8ToHex(buffer)).to.be.equal(Convert.uint8ToHex(RawAddress.stringToAddress(address.plain())));
        });

        it('can map hex string to NamespaceId using PRIVATE_TEST', () => {
            const buffer = UnresolvedMapping.toUnresolvedAddressBytes(namespacId, NetworkType.PRIVATE_TEST);
            expect(buffer instanceof Uint8Array).to.be.true;
            expect(buffer[0]).to.be.equal(NetworkType.PRIVATE_TEST | 1);
            expect(Convert.uint8ToHex(buffer)).to.be.equal('A9C51FB4C93FCA5095000000000000000000000000000000');
        });

        it('can map hex string to NamespaceId using MAIN_NET', () => {
            const buffer = UnresolvedMapping.toUnresolvedAddressBytes(namespacId, NetworkType.MAIN_NET);
            expect(buffer instanceof Uint8Array).to.be.true;
            expect(buffer[0]).to.be.equal(NetworkType.MAIN_NET | 1);
            expect(Convert.uint8ToHex(buffer)).to.be.equal('69C51FB4C93FCA5095000000000000000000000000000000');
        });
    });
});
