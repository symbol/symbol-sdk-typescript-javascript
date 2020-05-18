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

import { BlockInfoModelStorage } from '@/core/database/storage/BlockInfoModelStorage'
import { RepositoryFactory, UInt64 } from 'symbol-sdk'
import { BlockInfoModel } from '@/core/database/entities/BlockInfoModel'
import { Observable, of } from 'rxjs'
import { flatMap, map, tap } from 'rxjs/operators'
import * as _ from 'lodash'
import { ObservableHelpers } from '@/core/utils/ObservableHelpers'

export class BlockService {
  /**
   * The namespace information local cache.
   */
  private readonly blockInfoModelStorage = BlockInfoModelStorage.INSTANCE

  public getKnownBlockInfos(generationHash: string): BlockInfoModel[] {
    return this.blockInfoModelStorage.get(generationHash) || []
  }

  public getBlockInfo(
    repositoryFactory: RepositoryFactory,
    height: UInt64,
    alreadyLoadedBlocks: BlockInfoModel[],
  ): Observable<BlockInfoModel> {
    return repositoryFactory.getGenerationHash().pipe(
      flatMap((generationHash) => {
        const blockInfoModels = this.getKnownBlockInfos(generationHash)
        const cachedModel = blockInfoModels.find((m) => m.height === height.toString())
        const alreadyLoadedBlock = alreadyLoadedBlocks.find((m) => m.height === height.toString())
        //Only load from rest the first time in the app session (but using the stored cache for quick user feedback).
        if (cachedModel && alreadyLoadedBlock && cachedModel.generationHash === alreadyLoadedBlock.generationHash) {
          return of(cachedModel)
        }
        return repositoryFactory
          .createBlockRepository()
          .getBlockByHeight(height)
          .pipe(
            map((dto) => new BlockInfoModel(dto)),
            tap((model) => {
              const blockInfoModels = _.uniqBy([model, ...this.getKnownBlockInfos(generationHash)], 'height')
              this.blockInfoModelStorage.set(generationHash, blockInfoModels)
            }),
            ObservableHelpers.defaultFirst(cachedModel),
          )
      }),
    )
  }
}
