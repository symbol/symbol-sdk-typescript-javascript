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
import { Alias } from './Alias';
import { AliasType } from './AliasType';

/**
 * The EmptyAlias structure describes empty aliases (type:0)
 *
 * @since 0.10.2
 */
export class EmptyAlias extends Alias {
    /**
     * The alias type
     */
    public readonly type: number;

    /**
     * Create EmptyAlias object
     *
     * @param type
     * @param content
     */
    constructor() {
        super(AliasType.None);
    }

    /**
     * Compares EmptyAlias for equality.
     *
     * @return boolean
     */
    public equals(alias: any): boolean {
        return alias instanceof EmptyAlias || alias.type === 0;
    }

    /**
     * Generate alias buffer
     * @return {Uint8Array}
     */
    public serialize(): Uint8Array {
        return new Uint8Array(0);
    }
}
