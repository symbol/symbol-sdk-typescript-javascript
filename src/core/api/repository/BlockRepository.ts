import { Observable } from "rxjs";


export interface BlockRepository {
    /**
     *  getBlockByHeight
     * @param node
     * @param height
     */
    getBlockByHeight(node: string, height: number): Observable<any>;

    /**
     *  getBlocksByHeightWithLimit
     * @param node
     * @param height
     * @param limit
     */
    getBlocksByHeightWithLimit(node: string, height: number, limit: number): Observable<any>;

    /**
     *  getBlockTransactions
     * @param node
     * @param height
     * @param queryParams
     */
    getBlockTransactions(node: string, height: number, queryParams: any): Observable<any>;

    /**
     *  getBlockTransactions
     * @param node
     */
    getBlockchainHeight(node: string): Observable<any>;
}
