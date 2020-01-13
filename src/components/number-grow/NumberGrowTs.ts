import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {formatNumber} from '@/core/utils'

@Component
export class NumberGrowTs extends Vue {

  @Prop({default: 2})
  time

  @Prop({default: 0})
  value

  numValue = 0
  isAdd = true

  formatNumber = formatNumber

  numberGrow(ele) {
    const step = (this.value * 10) / (this.time * 1000)
    let current = 0
    let start = 0
    let t = setInterval(function () {
      start += step
      if (start > this.value) {
        clearInterval(t)
        start = this.value
        t = null
      }
      if (current === start) {
        return
      }
      current = Number(Number(start).toFixed(0))
      ele.innerHTML = current.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,')
    }, 10)
  }

  mounted() {
    if (this.value === 0) {
      this.isAdd = false
      return
    }
    if (this.isAdd) {
      this.numberGrow(this.$refs.numberGrow)
    }
  }

  @Watch('value')
  onValueChange() {
    this.numValue = this.value
    this.isAdd = false
  }
}
