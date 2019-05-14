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
 * Partial transactions listener
 * @module listeners/PartialTransactionsListener
 */
export default class PartialTransactionsListener extends Listener {
	/**
	 * Returns partial transactions for a given address when they are created
	 * @param {string} address address to subscribe
	 * @param {WebSocketCallback} callback called when a new partial transaction is announced into the network
	 */
	addedToAccount(address, callback) {
		this.subscribeToChannel(`partialAdded/${address}`, callback);
	}

	/**
	 * Returns partial transactions hashes for a given address when they are confirmed
	 * @param {string} address address to subscribe
	 * @param {WebSocketCallback} callback called when a new partial transaction is announced into the network
	 */
	removedFromAccount(address, callback) {
		this.subscribeToChannel(`partialRemoved/${address}`, callback);
	}
}

