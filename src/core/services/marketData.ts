import {localSave} from '@/core/utils/utils.ts'
import {KlineQuery} from "@/core/query/klineQuery.ts"
import {market} from "@/core/api/logicApi.ts"


export const getMarketOpenPrice = async (that: any) => {
  const rstStr = await market.kline({period: "1min", symbol: "xemusdt", size: "1"})
  if (!rstStr.rst) return
  const rstQuery: KlineQuery = JSON.parse(rstStr.rst)
  const result = rstQuery.data ? rstQuery.data[0].close : 0
  that.$store.commit('SET_XEM_USD_PRICE', result)
  const openPriceOneMinute = {
    timestamp: new Date().getTime(),
    openPrice: result
  }
  localSave('openPriceOneMinute', JSON.stringify(openPriceOneMinute))
}