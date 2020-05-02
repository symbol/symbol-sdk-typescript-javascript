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

import { EMPTY, merge, MonoTypeOperatorFunction, of, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

/**
 * Custom observable pipe style operations.
 */
export class ObservableHelpers {
  /**
   * This pipe operation concatenates the default values first when provided on top what the
   * current observable resolves. if the defaultValue is provided and the current observable fails,
   * the error is logged and ignored. If default is not provided, the error is propagated.
   *
   *  The idea is that clients will get a cached version of the data first, then the data will be
   * upgraded when returned simulating a faster response.
   *
   *  This observable may send one extra data to the observable.
   *
   * @param defaultValue the default value to be piped first before the observable.
   */
  public static defaultFirst<T>(defaultValue: T | undefined): MonoTypeOperatorFunction<T> {
    return (observable) =>
      merge(
        defaultValue ? of(defaultValue) : EMPTY,
        observable.pipe(
          catchError((e) => {
            if (defaultValue) {
              return EMPTY
            } else {
              return throwError(e)
            }
          }),
        ),
      )
  }

  /**
   * This pipe operation appends the default data to the observable if this one fails.
   *
   * If the default data is not provided, the observable error is propagated. If the observable
   * succeeds, the default value is ignored.
   *
   * The idea is that if the response cannot be obtained from rest, the cached data will be used.
   *
   * @param defaultValue the default value to be provided if the current observable fails.
   */

  public static defaultLast<T>(defaultValue: T | undefined = undefined): MonoTypeOperatorFunction<T> {
    return (observable) =>
      observable.pipe(
        catchError((e) => {
          if (defaultValue) {
            return of(defaultValue)
          } else {
            return throwError(e)
          }
        }),
      )
  }
}
