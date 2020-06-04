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
import * as http from 'http';
import { MultisigAccountGraphInfoDTO, MultisigAccountInfoDTO, MultisigDTO, MultisigRoutesApi } from 'symbol-openapi-typescript-node-client';
import { instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { MultisigHttp } from '../../src/infrastructure/MultisigHttp';
import { MultisigRepository } from '../../src/infrastructure/MultisigRepository';
import { Account } from '../../src/model/account/Account';
import { MultisigAccountInfo } from '../../src/model/account/MultisigAccountInfo';
import { NetworkType } from '../../src/model/network/NetworkType';
import { deepEqual } from 'assert';

describe('MultisigHttp', () => {
    const networkType = NetworkType.MIJIN_TEST;
    const account = Account.generateNewAccount(networkType);
    const address = account.address;
    const accountInfoDto = new MultisigAccountInfoDTO();
    const multisigDTO = new MultisigDTO();

    const account1 = Account.generateNewAccount(networkType);
    const account2 = Account.generateNewAccount(networkType);
    const account3 = Account.generateNewAccount(networkType);
    const account4 = Account.generateNewAccount(networkType);

    multisigDTO.accountAddress = account.address.encoded();
    multisigDTO.accountAddress = account.address.encoded();
    multisigDTO.cosignatoryAddresses = [account1.address.encoded(), account2.address.encoded()];
    multisigDTO.minApproval = 2;
    multisigDTO.minRemoval = 3;
    multisigDTO.multisigAddresses = [account3.address.encoded(), account4.address.encoded()];

    accountInfoDto.multisig = multisigDTO;

    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const multisigRoutesApi: MultisigRoutesApi = mock();
    const accountRepository: MultisigRepository = DtoMapping.assign(new MultisigHttp(url), {
        multisigRoutesApi: instance(multisigRoutesApi),
    });

    before(() => {
        reset(response);
        reset(multisigRoutesApi);
    });

    function assertMultisigInfo(accountInfo: MultisigAccountInfo): void {
        expect(accountInfo).to.be.not.null;
        expect(accountInfo.isMultisig()).to.be.equals(true);
        deepEqual(accountInfo.accountAddress, account.address);
        expect(accountInfo.cosignatoryAddresses).to.deep.equals([account1.address, account2.address]);
        expect(accountInfo.minApproval).to.be.equals(multisigDTO.minApproval);
        expect(accountInfo.minRemoval).to.be.equals(multisigDTO.minRemoval);
        expect(accountInfo.multisigAddresses).to.deep.equals([account3.address, account4.address]);
    }

    it('getMultisigAccountInfo', async () => {
        when(multisigRoutesApi.getAccountMultisig(address.plain())).thenReturn(Promise.resolve({ response, body: accountInfoDto }));
        const accountInfo = await accountRepository.getMultisigAccountInfo(address).toPromise();
        assertMultisigInfo(accountInfo);
    });

    it('getMultisigAccountGraphInfo', async () => {
        const body = new MultisigAccountGraphInfoDTO();
        body.level = 10;
        body.multisigEntries = [accountInfoDto, accountInfoDto, accountInfoDto];

        const body2 = new MultisigAccountGraphInfoDTO();
        body2.level = 20;
        body2.multisigEntries = [accountInfoDto, accountInfoDto];
        when(multisigRoutesApi.getAccountMultisigGraph(address.plain())).thenReturn(Promise.resolve({ response, body: [body, body2] }));
        const graphInfo = await accountRepository.getMultisigAccountGraphInfo(address).toPromise();
        expect(graphInfo.multisigEntries.size).to.be.eq(2);
        const list10: MultisigAccountInfo[] = graphInfo.multisigEntries.get(10) as MultisigAccountInfo[];
        expect(list10.length).to.be.eq(3);
        assertMultisigInfo(list10[0]);
        assertMultisigInfo(list10[1]);
        assertMultisigInfo(list10[2]);

        const list20: MultisigAccountInfo[] = graphInfo.multisigEntries.get(20) as MultisigAccountInfo[];
        expect(list20.length).to.be.eq(2);
        assertMultisigInfo(list20[0]);
        assertMultisigInfo(list20[1]);
    });
});
