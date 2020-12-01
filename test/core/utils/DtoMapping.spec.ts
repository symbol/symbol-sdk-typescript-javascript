/*
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
import { expect } from 'chai';
import {
    AccountRestrictionDTO,
    AccountRestrictionFlagsEnum,
    AccountRestrictionsDTO,
    AccountRestrictionsInfoDTO,
} from 'symbol-openapi-typescript-fetch-client';
import { DtoMapping } from '../../../src/core/utils/DtoMapping';
import { PublicAccount } from '../../../src/model/account/PublicAccount';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { NetworkType } from '../../../src/model/network/NetworkType';

describe('DtoMapping', () => {
    const publicAccount = PublicAccount.createFromPublicKey(
        '9801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6',
        NetworkType.PRIVATE_TEST,
    );
    const address = publicAccount.address;
    const mosaicId = new MosaicId('11F4B1B3AC033DB5');

    it('extractRestrictionInfo - Operation', () => {
        const restrictionInfo = {} as AccountRestrictionsInfoDTO;
        const restrictionsDto = {} as AccountRestrictionsDTO;
        const restriction = {} as AccountRestrictionDTO;
        restriction.restrictionFlags = AccountRestrictionFlagsEnum.NUMBER_16388;
        restriction.values = [16724];
        restrictionsDto.restrictions = [restriction];
        restrictionsDto.address = address.encoded();

        restrictionInfo.accountRestrictions = restrictionsDto;
        const result = DtoMapping.extractAccountRestrictionFromDto(restrictionInfo);
        expect(result).not.to.be.undefined;
        expect(result.restrictions[0].values[0]).to.be.equal(16724);
    });

    it('extractRestrictionInfo - Mosaic', () => {
        const address = publicAccount.address;
        const restrictionInfo = {} as AccountRestrictionsInfoDTO;
        const restrictionsDto = {} as AccountRestrictionsDTO;
        const restriction = {} as AccountRestrictionDTO;
        restriction.restrictionFlags = AccountRestrictionFlagsEnum.NUMBER_2;
        restriction.values = [mosaicId.toHex()];
        restrictionsDto.restrictions = [restriction];
        restrictionsDto.address = address.encoded();

        restrictionInfo.accountRestrictions = restrictionsDto;
        const result = DtoMapping.extractAccountRestrictionFromDto(restrictionInfo);
        expect(result).not.to.be.undefined;
        expect((result.restrictions[0].values[0] as MosaicId).toHex()).to.be.equal(mosaicId.toHex());
    });

    it('parseServerDuration', () => {
        expect(DtoMapping.parseServerDuration('15s').toString()).to.be.equal('PT15S');
        expect(DtoMapping.parseServerDuration('10m:15s').toString()).to.be.equal('PT10M15S');
        expect(DtoMapping.parseServerDuration('10m').toString()).to.be.equal('PT10M');
        expect(DtoMapping.parseServerDuration('5h3m1s').toString()).to.be.equal('PT5H3M1S');
        expect(DtoMapping.parseServerDuration('10d:5m1s').toString()).to.be.equal('PT240H5M1S');
        expect(DtoMapping.parseServerDuration('10d 5m1s').toString()).to.be.equal('PT240H5M1S');
        expect(DtoMapping.parseServerDuration('10d:5m100ms').toString()).to.be.equal('PT240H5M0.1S');
        expect(DtoMapping.parseServerDuration('10d:5m1ms').toString()).to.be.equal('PT240H5M0.001S');
        expect(DtoMapping.parseServerDuration(`1'200ms`).toString()).to.be.equal('PT1.2S');
        expect(DtoMapping.parseServerDuration(`1d 2h`).toString()).to.be.equal('PT26H');
    });

    it('parseServerDuration - exception', () => {
        expect(() => {
            DtoMapping.parseServerDuration('5sss');
        }).to.throw();
        expect(() => {
            DtoMapping.parseServerDuration('10h:10h');
        }).to.throw();
        expect(() => {
            DtoMapping.parseServerDuration('abc');
        }).to.throw();
        expect(() => {
            DtoMapping.parseServerDuration('abc 2s 1234');
        }).to.throw();
        expect(() => {
            DtoMapping.parseServerDuration('5s10x');
        }).to.throw();
        expect(() => {
            DtoMapping.parseServerDuration('10d 5m1s 1m');
        }).to.throw();
        expect(() => {
            DtoMapping.parseServerDuration('5m   10d');
        }).to.throw();
        expect(() => {
            DtoMapping.parseServerDuration('abc 10d');
        }).to.throw();
    });

    it('toSimpleHex', () => {
        expect(DtoMapping.toSimpleHex("0x017D'1694'0477'B3F5")).to.be.equal('017D16940477B3F5');
        expect(DtoMapping.toSimpleHex('017D16940477B3F5')).to.be.equal('017D16940477B3F5');
        expect(DtoMapping.toSimpleHex("0x29C6'42F2'F432'8612")).to.be.equal('29C642F2F4328612');
    });
});
