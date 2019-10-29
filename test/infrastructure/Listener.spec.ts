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
import {Listener} from '../../src/infrastructure/Listener';
import {Address} from "../../src/model/account/Address";
import {deepEqual} from "assert";
import {UInt64} from "../../src/model/UInt64";
import {timeout} from "rxjs/operators";

describe('Listener', () => {
    it('should createComplete a WebSocket instance given url parameter', () => {
        const listener = new Listener('ws://localhost:3000');
        expect('ws://localhost:3000/ws').to.be.equal(listener.url);
        listener.close();
    });

    describe('isOpen', () => {
        it('should return false when listener is created and not opened', () => {
            const listener = new Listener('ws://localhost:3000');
            expect(listener.isOpen()).to.be.false;
            listener.close();
        });
    });

    describe('onStatusWhenAddressIsTheSame', () => {
        it('Should forward status', (done) => {


            const errorEncodedAddress = '906415867F121D037AF447E711B0F5E4D52EBBF066D96860EB';

            const errorAddress = Address.createFromEncoded(errorEncodedAddress);

            class WebSocketMock {
                constructor(public readonly  url: string) {
                }

                send(payload: string) {
                    expect(payload).to.be.eq(`{"subscribe":"status/${errorAddress.plain()}"}`);
                }
            }

            const statusInfoErrorDTO = {
                address: errorEncodedAddress,
                deadline: '1010',
                hash: 'transaction-hash',
                status: 'error-message',
            };

            const listener = new Listener('ws://localhost:3000', WebSocketMock);

            listener.open();

            listener.status(errorAddress).pipe(timeout(2000)).subscribe((transactionStatusError) => {
                expect(transactionStatusError.address).to.deep.equal(errorAddress);
                expect(transactionStatusError.hash).to.be.equal(statusInfoErrorDTO.hash);
                expect(transactionStatusError.status).to.be.equal(statusInfoErrorDTO.status);
                deepEqual(transactionStatusError.deadline.toDTO(), UInt64.fromNumericString(statusInfoErrorDTO.deadline).toDTO());
                done();
            }, err => {
                done('Should have not timed out!');
            });

            listener.handleMessage(statusInfoErrorDTO, null);


        });
    });

    describe('onStatusWhenAddressIsDifferentAddress', () => {
        it('Should not forward status', (done) => {


            const errorEncodedAddress = '906415867F121D037AF447E711B0F5E4D52EBBF066D96860EB';

            const subscribedEncodedAddress = '906415867F121D037AF447E711B0F5E4D52EBBF066D96AAAAA';
            const subscribedAddress = Address.createFromEncoded(subscribedEncodedAddress);

            class WebSocketMock {

                constructor(public readonly  url: string) {
                }

                send(payload: string) {
                    expect(payload).to.be.eq(`{"subscribe":"status/${subscribedAddress.plain()}"}`);
                }
            }

            const statusInfoErrorDTO = {
                address: errorEncodedAddress,
                deadline: '1010',
                hash: 'transaction-hash',
                status: 'error-message',
            };

            const listener = new Listener('ws://localhost:3000', WebSocketMock);

            listener.open();

            listener.status(subscribedAddress).pipe(timeout(100)).subscribe(status => {
                done('Should have timed out!');
            }, err => {
                expect(err.name).to.be.eq('TimeoutError');
                done();
            });

            listener.handleMessage(statusInfoErrorDTO, null);


        });
    });

    describe('onerror', () => {
        it('should reject because of wrong server url', async () => {
            const listener = new Listener('https://notcorrecturl:0000');
            await listener.open()
                .then((result) => {
                    throw new Error('This should not be called when expecting error');
                })
                .catch((error) => {
                    expect(error.message.toString()).not.to.be.equal('');
                });
        });
    });
});
