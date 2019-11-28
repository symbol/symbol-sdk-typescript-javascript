import Vue from "vue"
import Component from 'vue-class-component'
import {importInfoList} from '@/config/view'

@Component
export default class WelcomeTs extends Vue {
    importInfoList = importInfoList

    goTo(link) {
        if (!link) {
            this.$Notice.warning({
                title: this.$t('not_yet_open') + ''
            })
            return
        }

        this.$router.push(link)
    }
}
