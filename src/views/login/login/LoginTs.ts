import {localesMap, languageList} from "@/config/index.ts"
import {localSave, localRead} from '@/core/utils/utils.ts'
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
    languageList = languageList
    isShowDialog = true
    indexShowList = [true, false, false]

    switchLanguage(language) {
        // @ts-ignore
        this.$i18n.locale = language
        localSave('locale', language)
    }

    get getWalletList() {
        return this.$store.state.app.walletList || []
    }

    get language() { return this.$i18n.locale }
    set language(lang) { 
        this.$i18n.locale = lang
        localSave('locale', lang)
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

    isCallShowIndexView() {
        if (this.$route.params.index) {
            this.showIndexView(this.$route.params.index)
            return
        }
        const wallets = localRead('wallets')
        const walletList = wallets ? JSON.parse(wallets) : []
        if (walletList.length >= 1) {
            this.showIndexView(2)
        }
    }

    created() {
        this.isCallShowIndexView()
    }
}
