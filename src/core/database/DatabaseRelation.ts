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
// internal dependencies
export enum DatabaseRelationType {
  ONE_TO_ONE = 1,
  ONE_TO_MANY = 2,
  MANY_TO_MANY = 3,
}

export class DatabaseRelation {
  /**
   * Relation type
   * @var {DatabaseRelationType}
   */
  public type: DatabaseRelationType

  /**
   * Construct a database model instance
   * @param tableName 
   * @param columns 
   * @param types 
   */
  public constructor(
    type: DatabaseRelationType,
  ) {
    this.type = type
  }
}
