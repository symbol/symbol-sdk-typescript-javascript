/*
 * Copyright 2019 NEM
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

import { Searcher } from './paginationStreamer/Searcher';
import { ReceiptSearchCriteria } from './searchCriteria/ReceiptSearchCriteria';
import { TransactionStatement } from '../model/receipt/TransactionStatement';
import { ResolutionStatement } from '../model/receipt/ResolutionStatement';

/**
 * Receipt interface repository.
 *
 * @since 1.0
 */
export type ReceiptRepository = Searcher<ResolutionStatement | TransactionStatement, ReceiptSearchCriteria>;
