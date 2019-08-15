export interface MarketTradeQuery {
    data: TradeQuery[];
    ch: string;
    status: string;
    ts: number;

}

export interface TradeQuery {
    data: TradeDataQuery[];
    id:number;
    ts:number;
}
export interface TradeDataQuery {
    amount: number;
    id:number;
    price:number;
    ts:number;
    direction: string;
}

