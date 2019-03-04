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

import { PropertyModificationType } from '../account/PropertyModificationType';

export class AccountPropertyModification<T> {

    /**
     * Constructor
     * @param modificationType
     * @param value
     */
    constructor(
                /**
                 * Modification type.
                 */
                public readonly modificationType: PropertyModificationType,
                /**
                 * Modification value (Address, Mosaic or Transaction Type).
                 */
                public readonly value: T) {

    }

    /**
     * @internal
     */
    toDTO() {
        return {
            value: this.value,
            modificationType: this.modificationType,
        };
    }
}
