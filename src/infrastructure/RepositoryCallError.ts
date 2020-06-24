/*
 * Copyright 2020 NEM
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
 * When the repository raises an error, the Error's message would be a json string of this format:
 */
export interface RepositoryCallError {
    /**
     * The http status code if know, other wise 0.
     */
    readonly statusCode: number;

    /**
     * The status message if known;
     */
    readonly statusMessage: string;

    /**
     * The rest response body as text.
     */
    readonly body: string;
}
