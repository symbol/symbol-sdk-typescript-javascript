import {localSave, localRead} from '@/core/utils/utils'
import {Component, Vue} from 'vue-property-decorator'
import GetStart from './login-view/get-start/GetStart.vue'
import InputLock from './login-view/input-lock/InputLock.vue'
import CreateLock from './login-view/create-lock/CreateLock.vue'

@Component({
    components: {
        GetStart,
        CreateLock,
        InputLock
    }
})
export class LoginTs extends Vue {
    languageList = []
    isShowDialog = true
    currentLanguage: any = false
    indexShowList = [true, false, false]

    switchLanguage(language) {
        this.$store.state.app.local = {
            abbr: language,
            language: this.$store.state.app.localMap[language]
        }
        // @ts-ignore
        this.$i18n.locale = language
        localSave('local', language)
    }

    get getWalletList() {
        return this.$store.state.app.walletList || []
    }


    initData() {
        this.languageList = this.$store.state.app.languageList
        this.currentLanguage = localRead('local')
        this.$store.state.app.local = {
            abbr: this.currentLanguage,
            language: this.$store.state.app.localMap[this.currentLanguage]
        }
    }

    showIndexView(index) {
        let list = [false, false, false]
        if (index != 0 && localRead('lock')) {
            list[2] = true
        } else {
            list[index] = true
        }
        this.indexShowList = list
    }

    created() {
        this.$store.state.app.isInLoginPage = true
        this.initData()

        if (this.$route.params.index) {
            this.showIndexView(this.$route.params.index)
            return
        }

        const wallets = localRead('wallets')
        const walletList = wallets ? JSON.parse(wallets) : []
        const local = localRead('local') ? localRead('local') :''
        if (walletList.length >= 1) {
            this.showIndexView(2)
            return
        }
    }
}
