export interface MarketDetailQuery {
  ch: string;
  tick: TickQuery;
  status: string;
  ts: number;

}
export interface TickQuery {
  amount: number;
  id:number;
  high:number;
  count:number;
  open: number;
  close: number;
  low: number;
  vol: number;
  version: number;
}
