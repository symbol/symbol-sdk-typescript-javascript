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
export class RESTDispatcher {
  /**
   * 
   */
  protected dispatch: (
    action: string,
    payload?: any,
    options?: any
  ) => void

  /**
   * 
   */
  protected actions: {
    action: string
    payload?: any
    options?: any
    await: boolean
  }[] = []

  /**
   * 
   * @param dispatchFn 
   */
  public constructor(
    dispatchFn: (
      action: string,
      payload?: any,
      options?: any
    ) => void,
  ) {
    this.dispatch = dispatchFn
  }

  /**
   * 
   * @param action 
   * @param payload 
   * @param options 
   * @param isBlocking 
   */
  public add(
    action: string,
    payload?: any,
    options?: any,
    shouldAwait: boolean = false,
  ) {
    this.actions.push({
      action,
      payload: payload,
      options: options,
      await: shouldAwait,
    })
  }

  /**
   * Lazy store action dispatcher. This will make sure
   * that dispatching actions does not flood REST with
   * too many requests.
   */
  public throttle_dispatch() {
    // - wrap actions execution in delayed promises
    const promises: Promise<any>[] = []
    this.actions.map((action, index: number) => {
      // - every second value, delay 1000ms
      const delay = index + 1 % 2 === 0 ? 1000 : 0

      // - configure promises to include delay
      promises.push(
        new Promise((resolve, reject) => {
          return setTimeout(() => {
            try {
              const obs = this.dispatch(action.action, action.payload, action.options)
              return resolve(obs)
            }
            catch (e) {
              return reject(e)
            }
          }, delay)
        }),
      )
    })

    return new Promise(resolve => resolve(Promise.all(promises)))
  }
}
