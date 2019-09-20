import {localSave} from '@/core/utils/utils.ts'
import {Component, Vue} from 'vue-property-decorator'
import GetStart from './login-view/get-start/GetStart.vue'
import InputLock from './login-view/input-lock/InputLock.vue'
import {mapState} from "vuex"
import {languageConfig} from "@/config/view/language";

@Component({
    components: {
        GetStart,
        InputLock
    },
    computed: {
        ...mapState({
            app: 'app',
        })
    }
})
export class LoginTs extends Vue {
    app: any
    languageList = languageConfig
    isShowDialog = true
    indexShowList = [true, false]

    switchLanguage(language) {
        // @ts-ignore
        this.$i18n.locale = language
        localSave('locale', language)
    }

    get getWalletList() {
        return this.app.walletList || []
    }

    get language() {
        return this.$i18n.locale
    }

    set language(lang) {
        this.$i18n.locale = lang
        localSave('locale', lang)
    }

    showIndexView(index) {
        let list = [false, false]
        list[index] = true
        this.indexShowList = list
    }

    isCallShowIndexView() {
        if (this.$route.params.index) {
            this.showIndexView(this.$route.params.index)
            return
        }
    }

    mounted() {
        this.isCallShowIndexView()
    }
}
