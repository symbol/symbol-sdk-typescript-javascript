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

import { PropertyType } from './PropertyType';
/**
 * Account property structure describes property information.
 */
export class AccountProperty {

    /**
     * Constructor
     * @param propertyType
     * @param values
     */
    constructor(
            /**
             * Account property type
             */
            public readonly propertyType: PropertyType,
            /**
             * Property values.
             */
            public readonly values: object[]) {

    }

}
