import { expect } from 'chai';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { take, toArray } from 'rxjs/operators';
import { deepEqual, instance, verify, when } from 'ts-mockito';
import { Page } from '../../../src/infrastructure/Page';
import { PaginationStreamer } from '../../../src/infrastructure/paginationStreamer/PaginationStreamer';
import { Searcher } from '../../../src/infrastructure/paginationStreamer/Searcher';
import { SearchCriteria } from '../../../src/infrastructure/searchCriteria/SearchCriteria';

export class PaginationStreamerTestHelper<E, C extends SearchCriteria> {
    constructor(
        private readonly streamer: PaginationStreamer<E, C>,
        private readonly entityClass: E,
        private readonly repository: Searcher<E, C>,
        private readonly criteria: C,
    ) {}

    public basicMultiPageTest(): Promise<void> {
        const pageSize = 20;
        const totalEntries = 110;
        return this.runSearch(pageSize, totalEntries);
    }

    public multipageWithLimit(): Promise<void> {
        const pageSize = 20;
        const totalEntries = 110;
        return this.runSearch(pageSize, totalEntries, 30);
    }

    public limitToTwoPages(): Promise<void> {
        const pageSize = 20;
        const totalEntries = 110;
        return this.runSearch(pageSize, totalEntries, pageSize * 2);
    }

    public limitToThreePages(): Promise<void> {
        const pageSize = 20;
        const totalEntries = 110;
        return this.runSearch(pageSize, totalEntries, pageSize * 2 + 5);
    }

    public basicSinglePageTest(): Promise<void> {
        const pageSize = 20;
        const totalEntries = 19;
        return this.runSearch(pageSize, totalEntries);
    }

    private async runSearch(pageSize: number, totalEntries: number, limit?: number): Promise<void> {
        this.criteria.pageSize = pageSize;
        const infos = [...Array(totalEntries).keys()].map(() => instance(this.entityClass));
        expect(totalEntries).to.be.equal(infos.length);
        const pages = this.toPages(infos, this.criteria.pageSize);
        when(this.repository.search(deepEqual(this.criteria))).thenReturn(...pages);
        let search = this.streamer.search(this.criteria);
        if (limit) {
            search = search.pipe(take(limit));
        }
        const returnedInfos = await search.pipe(toArray()).toPromise();
        expect(returnedInfos).to.be.eql(infos.slice(0, !limit ? infos.length : limit));
        const totalPagesRead = limit == null ? pages.length : Math.ceil(limit / pageSize);
        verify(this.repository.search(deepEqual(this.criteria))).times(totalPagesRead);
    }

    private toPages<T>(infos: T[], pageSize: number): Observable<Page<T>>[] {
        const partitions: T[][] = [];
        for (let i = 0; i < infos.length; i += pageSize) {
            partitions.push(infos.slice(i, i + pageSize));
        }
        let pageNumber = 0;
        return partitions.map((pageData) => of(new Page<T>(pageData, ++pageNumber, pageSize, infos.length, partitions.length)));
    }
}
