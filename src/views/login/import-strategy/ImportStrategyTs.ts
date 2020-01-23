import Vue from 'vue'
import Component from 'vue-class-component'
import {importInfoList} from '@/config/view'

@Component
export default class ImportStrategyTs extends Vue {
  importInfoList = importInfoList

  goTo(link) {
    if (!link) {
      this.$Notice.warning({
        title: `${this.$t('not_yet_open')}`,
      })
      return
    }
    this.$router.push({
      name: link,
      params: {
        nextPage:'login.importAccount.importMnemonic',
      },
    })
  }
}
