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

import WebSocket from 'ws';
import * as _ from 'lodash';

/**
 * @callback WebSocketCallback
 * @param {object} WebSocketMessage
 */

/**
 * @module listeners/Listener
 */
export default class Listener {
	/**
	 * @constructor
	 * @param domain
	 * @param port
	 * @param WebSocketDependency
	 */
	constructor(domain, port, WebSocketDependency) {
		if (WebSocketDependency)
			this.connection = new WebSocketDependency(`ws://${domain}:${port}/ws`);
		else
			this.connection = new WebSocket(`ws://${domain}:${port}/ws`);
	}

	/**
	 * open the WebSocket connection
	 */
	openConnection() {
		this.connection.onopen = () => {
			console.log('connection open');
		};

		this.connection.onerror = err => {
			console.log('WebSocket Error ');
			console.log(err);
		};
	}

	/**
	 *
	 * @param {string} channel channel to subscribe
	 * @param {WebSocketCallback} callback called when a new unconfirmed transaction is announced into the network
	 */
	subscribeToChannel(channel, callback) {
		this.openConnection();
		let duplicateObj;
		this.connection.onmessage = e => {
			const obj = JSON.parse(e.data);
			if ('uid' in obj) {
				this.connection.send(`{"uid": "${obj.uid}", "subscribe":"${channel}"}`);
			} else {
				if (!_.isEqual(obj, duplicateObj))
					callback(obj);

				duplicateObj = obj;
			}
		};
	}
}

