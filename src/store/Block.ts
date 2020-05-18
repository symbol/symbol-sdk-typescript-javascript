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

// internal dependencies
import { BlockInfoModel } from '@/core/database/entities/BlockInfoModel'
import { RepositoryFactory, UInt64 } from 'symbol-sdk'
import { BlockService } from '@/services/BlockService'
import { first } from 'rxjs/operators'

interface BlockState {
  blocks: BlockInfoModel[]
}

const blocksState: BlockState = {
  blocks: [],
}

export default {
  namespaced: true,
  state: blocksState,
  getters: {
    blocks: (state: BlockState) => state.blocks,
  },
  mutations: {
    blocks: (state: BlockState, blocks: BlockInfoModel[]) => {
      state.blocks = blocks
    },
  },
  actions: {
    async GET_BLOCK({ commit, rootGetters, getters }, height: UInt64): Promise<BlockInfoModel> {
      const generationHash: string = rootGetters['network/generationHash']
      const repositoryFactory: RepositoryFactory = rootGetters['network/repositoryFactory']
      const alreadyLoadedBlocks: BlockInfoModel[] = getters.blocks
      const blockInfoModel = await new BlockService()
        .getBlockInfo(repositoryFactory, height, alreadyLoadedBlocks)
        .pipe(first())
        .toPromise()
      commit('blocks', new BlockService().getKnownBlockInfos(generationHash))
      return blockInfoModel
    },
  },
}
