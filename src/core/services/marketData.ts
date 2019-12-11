import {localSave} from '@/core/utils'
import {KlineQuery} from "@/core/query"
import {market} from "@/core/api"


export const setMarketOpeningPrice = async (that: any) => {
  try {
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
  } catch (error) {
      console.error("setMarketOpeningPrice -> error", error)
  }
}
