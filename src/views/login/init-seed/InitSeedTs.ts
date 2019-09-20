import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {networkTypeList, walletFnNavList} from "@/config/view"
import AccountImportMnemonic from '@/views/login/init-seed/account-import-mnemonic/AccountImportMnemonic.vue'
import AccountCreateMnemonic from '@/views/login/init-seed/account-create-mnemonic/AccountCreateMnemonic.vue'
import SeedCreatedGuide from '@/views/login/init-seed/seed-created-guide/SeedCreatedGuide.vue'
import {mapState} from "vuex"

@Component({
    components: {
        AccountImportMnemonic,
        AccountCreateMnemonic,
        SeedCreatedGuide
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class InitSeedTs extends Vue {
    pageIndex = 0
    createForm = {}
    activeAccount: any
    walletCreated = false
    navList = walletFnNavList

    get accountName() {
        return this.activeAccount.accountName
    }

    isCreated(form) {
        this.createForm = form
        this.walletCreated = true
        this.updatePageIndex(2)
    }

    updatePageIndex(index) {
        this.pageIndex = index
    }

    closeCreated() {
        this.walletCreated = false
    }

    toWalletDetails() {
        this.$router.push('dashBoard')
    }

    goToPage(item, index) {
        for (let i in this.navList) {
            if (this.navList[i].to == item.to) {
                this.navList[i].active = true
            } else {
                this.navList[i].active = false
            }
        }
        this.pageIndex = index
    }

    created() {
        const initType = Number(this.$route.params.initType) || 0
        this.goToPage(this.navList[initType], initType)
    }

}
