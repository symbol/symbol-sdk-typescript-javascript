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
import {
    VerifiableTransaction
} from './VerifiableTransaction';

const {
    flatbuffers
} = require('flatbuffers');

/**
 * @module transactions/VerifiableTransactionBuilder
 */

/**
 * @callback LambdaBuilder
 * @param {flatbuffers.Builder} builder
 * @return {void}
 */

export default class VerifiableTransactionBuilder {
    bytes: any;
    schema: any
    /**
     * @param {LambdaBuilder} lambda Callback
     * @returns {VerifiableTransactionBuilder} Returns self instance
     */
    addTransaction(lambda) {
        const builder = new flatbuffers.Builder(1);

        lambda(builder);

        this.bytes = builder.asUint8Array();
        return this;
    }

    /**
     * @param {module:schema/Schema} schema Schema corresponding with flatbuffers Schema used on addTransaction
     * @returns {VerifiableTransactionBuilder} Returns self instance
     */
    addSchema(schema) {
        this.schema = schema;
        return this;
    }

    /**
     * @returns {VerifiableTransaction} Returns VerifiableTransaction instance
     */
    build() {
        return new VerifiableTransaction(this.bytes, this.schema);
    }
}
