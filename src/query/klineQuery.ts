
export interface KlineQuery {
  ch: string;
  data: KlineDataQuery[];
  status: string;
  ts: number;
}
export interface KlineDataQuery {
  id: number;
  amount: number;
  count: number;
  open: number;
  close: number;
  low: number;
  high: number;
  vol: number;
}
