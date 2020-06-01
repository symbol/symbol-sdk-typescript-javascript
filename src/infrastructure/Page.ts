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
 * It represents a page of results after a repository search call.
 *
 * @param <T> then model type.
 */
export class Page<T> {
    /**
     * The page's entities.
     */
    private readonly data: T[];

    /**
     * The current page number. 1 means first page
     */
    private readonly pageNumber: number;

    /**
     * The page size.
     */
    private readonly pageSize: number;

    /**
     * The total entries.
     */
    private readonly totalEntries: number;

    /**
     * The total pages.
     */
    private readonly totalPages: number;

    /**
     * Constructor.
     *
     * @param data the page data
     * @param pageNumber the current page number starting from 1.
     * @param pageSize the page size.
     * @param totalEntries the total entries.
     * @param totalPages the total pages for the given criteria.
     */
    constructor(data: T[], pageNumber = 0, pageSize = 0, totalEntries = 0, totalPages = 0) {
        this.data = data;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.totalEntries = totalEntries;
        this.totalPages = totalPages;
    }

    /**
     * @return The page data.
     */
    public getData(): T[] {
        return this.data;
    }

    /**
     * @return the current page number starting from 1.
     */
    public getPageNumber(): number {
        return this.pageNumber;
    }

    /**
     * @return the page size.
     */
    public getPageSize(): number {
        return this.pageSize;
    }

    /**
     * @return the total entries.
     */
    public getTotalEntries(): number {
        return this.totalEntries;
    }

    /**
     * @return the total pages.
     */
    public getTotalPages(): number {
        return this.totalPages;
    }

    /**
     * @return if this page is the last one.
     */
    public isLast(): boolean {
        return this.getPageNumber() >= this.getTotalPages();
    }
}
