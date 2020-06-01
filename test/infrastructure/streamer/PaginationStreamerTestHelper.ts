import { SearchCriteria } from '../../../src/infrastructure/searchCriteria/SearchCriteria';
import { PaginationStreamer } from '../../../src/infrastructure/paginationStreamer/PaginationStreamer';
import { Searcher } from '../../../src/infrastructure/paginationStreamer/Searcher';
import { Observable } from 'rxjs/internal/Observable';
import { Page } from '../../../src/infrastructure/Page';
import { of } from 'rxjs';
import { mock, when, deepEqual, verify } from 'ts-mockito';
import { expect } from 'chai';
import { take, toArray } from 'rxjs/operators';

export class PaginationStreamerTestHelper<E, C extends SearchCriteria> {
    constructor(
        private readonly streamer: PaginationStreamer<E, C>,
        private readonly entityClass: E,
        private readonly repository: Searcher<E, C>,
        private readonly criteria: C,
    ) {}

    public basicMultiPageTest(): void {
        const pageSize = 20;
        const totalEntries = 110;
        this.runSearch(pageSize, totalEntries);
    }

    public multipageWithLimit(): void {
        const pageSize = 20;
        const totalEntries = 110;
        this.runSearch(pageSize, totalEntries, 30);
    }

    public limitToTwoPages(): void {
        const pageSize = 20;
        const totalEntries = 110;
        this.runSearch(pageSize, totalEntries, pageSize * 2);
    }

    public basicSinglePageTest(): void {
        const pageSize = 20;
        const totalEntries = 19;
        this.runSearch(pageSize, totalEntries);
    }

    private runSearch(pageSize: number, totalEntries: number, limit?: number): void {
        try {
            this.criteria.pageSize = pageSize;
            mock();
            const infos = [...Array(totalEntries).keys()].map(() => mock(this.entityClass) as E);
            expect(totalEntries).to.be.equal(infos.length);
            const pages = this.toPages(infos, this.criteria.pageSize);
            // when(this.repository.search(deepEqual(this.criteria))).thenReturn(pages);
            let search = this.streamer.search(this.criteria);
            if (limit != null) {
                search = search.pipe(take(limit));
            }
            //const returnedInfos = search.pipe(toArray()).toFuture().get();
            // deepEqual(infos.slice(0, limit == null ? infos.length : limit), returnedInfos);
            const totalPagesRead = limit == null ? pages.length : Math.ceil(limit / pageSize);
            // verify(this.repository, times(totalPagesRead)).search(deepEqual(this.criteria));
        } catch (e) {
            throw new Error(e);
        }
    }

    private toPages<T>(infos: T[], pageSize: number): Observable<Page<T>>[] {
        const partitions: T[][] = [];
        for (let i = 0; i < infos.length; i += pageSize) {
            partitions.push(infos.slice(0, Math.min(pageSize, infos.length)));
        }
        let pageNumber = 0;
        return partitions.map((pageData) => of(new Page<T>(pageData, ++pageNumber, pageSize, infos.length, partitions.length)));
    }
}
