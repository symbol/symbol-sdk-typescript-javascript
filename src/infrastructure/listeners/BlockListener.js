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

import Listener from './Listener';

/**
 * Block listener model
 * @module listeners/BlockListener
 */
export default class BlockListener extends Listener {
	/**
	 * Returns blocks every time a new block is confirmed
	 * @param {WebSocketCallback} callback called when a new block is confirmed by the network
	 */
	newBlock(callback) {
		this.subscribeToChannel('block', callback);
	}
}

