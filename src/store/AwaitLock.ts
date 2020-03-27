/**
 * Copyright 2020 NEM Foundation (https://nem.io)
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
import AwaitLockImpl from 'await-lock'

export class AwaitLock {
  /**
   * Create a lock instance
   * @access private
   * @param lock 
   */
  private constructor(
    /**
     * The lock specialization
     * @var {AwaitLockImpl}
     */
    protected readonly lock: AwaitLockImpl) {}

  /**
   * Create a lock
   * @return {AwaitLock}
   */
  static create() {
    return new AwaitLock(new AwaitLockImpl())
  }

  /**
   * Helper method for the initialize callback.
   * @param callback 
   * @param store
   */
  async initialize(callback, {getters}) {
    await this.lock.acquireAsync()
    try {
      if (!getters.getInitialized) {
        await callback()
      }
    }
    finally {
      this.lock.release()
    }
  }

  /**
   * Helper method for the unitialize callback
   * @param callback 
   * @param store
   */
  async uninitialize(callback, {getters}) {
    await this.lock.acquireAsync()
    try {
      if (getters.getInitialized) {
        await callback()
      }
    } finally {
      this.lock.release()
    }
  }
}
