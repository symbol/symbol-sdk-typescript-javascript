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

import {deepEqual} from 'assert';
import {expect} from 'chai';
import {Address} from '../../../src/model/account/Address';
import {Recipient} from '../../../src/model/account/Recipient';
import {Id} from '../../../src/model/Id';
import {NamespaceId} from '../../../src/model/namespace/NamespaceId';

describe('Recipient', () => {
    it('should be created with address given Address value', () => {
        const recipient = new Recipient(Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'));
        expect(recipient.value).to.be.instanceof(Address);
        expect((recipient.value as Address).plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
    });

    it('should be created with namespaceId given NamespaceId value', () => {
        const recipient = new Recipient(new NamespaceId('nem'));
        expect(recipient.value).to.be.instanceof(NamespaceId);
        expect((recipient.value as NamespaceId).toHex()).to.be.equal('84b3552d375ffa4b');
    });

    it('should be created with address given encoded address recipient', () => {
        const recipient = Recipient.createFromEncoded('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142');
        const expectAddress = 'SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC';

        expect(recipient.value).to.be.instanceof(Address);
        expect((recipient.value as Address).plain()).to.be.equal(expectAddress);
    });

    const ns_vectors = [
        {name: 'nem', encoded: '914BFA5F372D55B38400000000000000000000000000000000'},
        {name: 'nem.owner', encoded: '9151776168D24257D800000000000000000000000000000000'},
    ];

    it('should be created with namespaceId given encoded namespaceId recipient', () => {
        ns_vectors.map(({name, encoded}) => {
            const recipient = Recipient.createFromEncoded(encoded);
            const expectNamespaceId = new NamespaceId(name);

            expect(recipient.value).to.be.instanceof(NamespaceId);
            expect((recipient.value as NamespaceId).toHex()).to.be.equal(expectNamespaceId.toHex());
        });
    });

    const addr_vectors = [
        {
            address: 'SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC',
            encoded: '9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142',
        },
        {
            address: 'NAR3W7B4BCOZSZMFIZRYB3N5YGOUSWIYJCJ6HDFG',
            encoded: '6823BB7C3C089D996585466380EDBDC19D4959184893E38CA6',
        },
    ];

    it('should be created with namespaceId given encoded namespaceId recipient', () => {
        addr_vectors.map(({address, encoded}) => {
            const recipient = Recipient.createFromEncoded(encoded);
            const expectAddress = Address.createFromRawAddress(address);

            expect(recipient.value).to.be.instanceof(Address);
            expect((recipient.value as Address).plain()).to.be.equal(expectAddress.plain());
        });
    });

    it('should compare and return false for equals with different types', () => {
        const recipient1 = Recipient.createFromEncoded('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142');
        const recipient2 = Recipient.createFromEncoded('914BFA5F372D55B38400000000000000000000000000000000');
        expect(recipient1.equals(recipient2)).to.be.equal(false);
    });

    it('should compare and return false for equals with different values of type address', () => {
        const recipient1 = Recipient.createFromEncoded('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142');
        const recipient2 = Recipient.createFromEncoded('6823BB7C3C089D996585466380EDBDC19D4959184893E38CA6');
        expect(recipient1.value).to.be.instanceof(Address);
        expect(recipient2.value).to.be.instanceof(Address);
        expect(recipient1.equals(recipient2)).to.be.equal(false);
    });

    it('should compare and return false for equals with different values of type namespaceId', () => {
        const recipient1 = Recipient.createFromEncoded('914BFA5F372D55B38400000000000000000000000000000000');
        const recipient2 = Recipient.createFromEncoded('9151776168D24257D800000000000000000000000000000000');
        expect(recipient1.value).to.be.instanceof(NamespaceId);
        expect(recipient2.value).to.be.instanceof(NamespaceId);
        expect(recipient1.equals(recipient2)).to.be.equal(false);
    });
});
