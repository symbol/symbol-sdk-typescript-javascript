import {mapState} from "vuex"
import {market} from "@/core/api"
import {KlineQuery} from "@/core/query"
import {Component, Vue, Watch} from 'vue-property-decorator'
import {isRefreshData, localSave, localRead, formatNumber} from '@/core/utils'
import numberGrow from '@/components/number-grow/NumberGrow.vue'
import LineChart from '@/components/line-chart/LineChart.vue'
import TransactionList from '@/components/transaction-list/TransactionList.vue'
import {networkStatusConfig} from '@/config/view/setting'
import {AppInfo, StoreAccount} from "@/core/model"

@Component({
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
    components: {
        LineChart,
        numberGrow,
        TransactionList,
    }
})
export class MonitorDashBoardTs extends Vue {
    app: AppInfo
    activeAccount: StoreAccount
    pageSize: number = 10
    highestPrice = 0
    riseRange: any = 0
    lowestPrice: any = 0
    averagePrice: any = 0
    updateAnimation = ''
    networkStatusList = networkStatusConfig
    page: number = 1
    formatNumber = formatNumber

    get wallet() {
        return this.activeAccount.wallet
    }

    get xemUsdPrice() {
        return this.app.xemUsdPrice
    }

    get chainStatus() {
        return this.app.chainStatus
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    // @TODO: review
    async getMarketPrice() {
      try {
          if (!isRefreshData('oneWeekPrice', 1000 * 60 * 60 * 24, new Date().getHours())) {
              const oneWeekPrice = JSON.parse(localRead('oneWeekPrice'))
              this.highestPrice = oneWeekPrice.highestPrice
              this.lowestPrice = oneWeekPrice.lowestPrice
              this.averagePrice = oneWeekPrice.averagePrice
              this.riseRange = oneWeekPrice.riseRange
              return
          }
          const that = this
          const rstStr = await market.kline({period: "1day", symbol: "xemusdt", size: "14"})
          if (!rstStr.rst) {
              return
          }
          const rstQuery: KlineQuery = JSON.parse(rstStr.rst)
          const result = rstQuery.data
          const currentWeek = result.slice(0, 7)
          const preWeek = result.slice(7, 14)

          currentWeek.sort((a, b) => {
              return a.high < b.high ? 1 : -1
          })
          that.highestPrice = currentWeek[0].high

          currentWeek.sort((a, b) => {
              return a.low < b.low ? -1 : 1
          })
          that.lowestPrice = currentWeek[0].low

          let average = 0
          currentWeek.forEach((item) => {
              average += (item.high + item.low) / 2
          })
          that.averagePrice = (average / 7).toFixed(4)

          let preAverage: any = 0
          preWeek.forEach((item) => {
              preAverage += (item.high + item.low) / 2
          })
          preAverage = (preAverage / 7).toFixed(4)
          that.riseRange = (((that.averagePrice - preAverage) / preAverage) * 100).toFixed(2)
          const oneWeekPrice = {
              averagePrice: that.averagePrice,
              riseRange: that.riseRange,
              lowestPrice: that.lowestPrice,
              highestPrice: that.highestPrice,
              timestamp: new Date().getTime()
          }
          localSave('oneWeekPrice', JSON.stringify(oneWeekPrice))
      } catch (error) {
          console.error("MonitorDashBoardTs -> getMarketPrice -> error", error)
      }
    }

    // @TODO: isn't it doable in pure CSS?
    @Watch('currentHeight')
    onChainStatus() {
        this.updateAnimation = 'appear'
        setTimeout(() => {
            this.updateAnimation = 'appear'
        }, 500)
    }

    mounted() {
        this.getMarketPrice() // @TODO: review
    }
}
