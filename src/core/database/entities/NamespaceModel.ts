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

import { NamespaceInfo } from 'symbol-sdk'

/**
 * Stored POJO that holds namespace information.
 *
 * The stored data is cached from rest.
 *
 * The object is serialized and deserialized to/from JSON. no method or complex attributes can be
 * fined.
 *
 */
export class NamespaceModel {
  public readonly namespaceIdHex: string
  public readonly name: string
  public readonly isRoot: boolean
  public readonly ownerAddressRawPlain: string | undefined
  public readonly aliasType: number
  public readonly aliasTargetAddressRawPlain: string | undefined
  public readonly aliasTargetMosaicIdHex: string | undefined
  public readonly parentNamespaceIdHex: string | undefined
  public readonly startHeight: number
  public readonly endHeight: number
  public readonly depth: number

  constructor(namespaceInfo: NamespaceInfo, name: string) {
    this.namespaceIdHex = namespaceInfo.id.toHex()
    this.name = name
    this.isRoot = namespaceInfo.isRoot()
    this.aliasType = namespaceInfo.alias.type
    this.ownerAddressRawPlain = namespaceInfo.owner.address.plain()
    this.aliasTargetAddressRawPlain =
      (namespaceInfo.alias && namespaceInfo.alias.address && namespaceInfo.alias.address.plain()) || undefined
    this.aliasTargetMosaicIdHex =
      (namespaceInfo.alias && namespaceInfo.alias.mosaicId && namespaceInfo.alias.mosaicId.toHex()) || undefined
    this.parentNamespaceIdHex = this.isRoot ? undefined : namespaceInfo.parentNamespaceId().toHex()
    this.startHeight = namespaceInfo.startHeight.compact()
    this.endHeight = namespaceInfo.endHeight.compact()
    this.depth = namespaceInfo.depth
  }
}
