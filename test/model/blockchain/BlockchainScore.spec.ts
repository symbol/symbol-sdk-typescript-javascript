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

import {deepEqual} from 'assert';
import {BlockchainScore} from '../../../src/model/blockchain/BlockchainScore';

describe('BlockchainScore', () => {

    it('should createComplete an BlockchainScore object', () => {
        const blockchainScoreDTO = {
            scoreHigh: BigInt(0),
            scoreLow: BigInt(0),
        };

        const blockchainScore = new BlockchainScore(
            blockchainScoreDTO.scoreLow,
            blockchainScoreDTO.scoreHigh,
        );

        deepEqual(blockchainScore.scoreLow, blockchainScoreDTO.scoreLow);
        deepEqual(blockchainScore.scoreHigh, blockchainScoreDTO.scoreHigh);
    });
});
