/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
/**
 * Stored POJO that holds network currency information.
 *
 * The stored data is cached from rest.
 *
 */
export class NetworkCurrencyModel {
  constructor(
    /**
     * Mosaic id of this currency. This value is optional if the user only wants to provide the
     * mosaic id. This value will be set if it's loaded by rest.
     */
    public readonly mosaicIdHex: string | undefined,
    /**
     * The Namespace id of this currency. This value is option if the user only wants to provide the
     * namespace id. This value will be set if it's loaded by rest.
     */
    public readonly namespaceIdHex: string | undefined,
    /**
     * The Namespace id of this currency. This value is option if the user only wants to provide the
     * namespace id. This value will be set if it's loaded by rest.
     */
    public readonly namespaceIdFullname: string | undefined,
    /**
     * Divisibility of this currency, required to create Mosaic from relative amounts.
     */
    public readonly divisibility: number,
    /**
     * Is this currency transferable.
     */
    public readonly transferable: boolean,
    /**
     * Is this currency supply mutable.
     */
    public readonly supplyMutable: boolean,
    /**
     * Is this currency restrictable.
     */
    public readonly restrictable: boolean,
    /**
     * The ticket name like XYM when namespace fullname is symbol.xym
     */
    public readonly ticker: string | undefined,
  ) {}
}
