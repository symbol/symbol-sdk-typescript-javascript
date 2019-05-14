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
 * Confirmed transactions listener
 * @module listeners/ConfirmedTransactionsListener
 */
export default class ConfirmedTransactionsListener extends Listener {
	/**
	 * Returns confirmed transactions for a given address
	 * @param {string} address address to subscribe
	 * @param {WebSocketCallback} callback called when a transaction is included into the chain
	 */
	given(address, callback) {
		this.subscribeToChannel(`confirmedAdded/${address}`, callback);
	}
}
