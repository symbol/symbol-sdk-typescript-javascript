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
/**
 * Vuex Store mutation descriptor
 * @type {MutationPayloadType}
 */
type MutationPayloadType = {type: string, payload?: any}

export class StoreTester {

  /**
   * Inject an action callback with pre-defined response
   * @param cb 
   * @param response 
   */
  public static INJECT_ACTION(response) {
    return (cb) => {
      setTimeout(() => {
        cb([response])
      }, 100)
    }
  }

  /**
   * Test a Vuex Store action named \a action.
   * @param action 
   * @param payload 
   * @param state 
   * @param expectedMutations 
   * @param done 
   */
  public static TEST_ACTION_MUTATES(
    action: any,
    payload: any,
    state: any,
    expectedMutations: MutationPayloadType[],
    done: any
  ) {
    let count = 0

    // mock commit
    const commit = (type, payload) => {
      const mutation = expectedMutations[count]

      try {
        expect(type).toBe(mutation.type)
        if (payload) {
          expect(payload).toMatchObject(mutation.payload)
        }
      } catch (error) {
        done(error)
      }

      count++
      if (count >= expectedMutations.length) {
        done()
      }
    }

    // call the action with mocked store and arguments
    action({ commit, state }, payload)

    // check if no mutations should have been dispatched
    if (expectedMutations.length === 0) {
      expect(count).toBe(0)
      done()
    }
  }

}
