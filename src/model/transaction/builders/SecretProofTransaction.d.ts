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

import {VerifiableTransaction} from "./VerifiableTransaction";

export declare class SecretProofTransaction extends VerifiableTransaction {
}

export declare module SecretProofTransaction {
    class Builder {

        addFee(fee): Builder;

        addVersion(version): Builder;

        addType(type): Builder;

        addDeadline(deadline): Builder;

        addHashAlgorithm(hashAlgorithm): Builder;

        addSecret(secret): Builder;

        addProof(proof): Builder;

        build(): SecretProofTransaction;
    }
}