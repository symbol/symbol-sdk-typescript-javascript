import {Component, Vue} from 'vue-property-decorator'
import AccountImportMnemonic from '@/views/login/init-seed/account-import-mnemonic/AccountImportMnemonic.vue'
import AccountCreateMnemonic from '@/views/login/init-seed/account-create-mnemonic/AccountCreateMnemonic.vue'
import AccountImportHardware from '@/views/login/init-seed/account-import-hardware/AccountImportHardware.vue'
import SeedCreatedGuide from '@/views/login/init-seed/seed-created-guide/SeedCreatedGuide.vue'
import {mapState} from "vuex"
import {walletFnNavConfig} from '@/config/view/wallet'
import {AppAccounts, StoreAccount} from "@/core/model"
import CheckPasswordDialog from '@/components/check-password-dialog/CheckPasswordDialog.vue'
import {createMnemonic} from "@/core/utils"

@Component({
    components: {
        CheckPasswordDialog,
        AccountImportMnemonic,
        AccountCreateMnemonic,
        AccountImportHardware,
        SeedCreatedGuide
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class InitSeedTs extends Vue {
    activeAccount: StoreAccount
    pageIndex = 0
    createForm = {}
    walletCreated = false
    navList = walletFnNavConfig

    get accountName() {
        return this.activeAccount.accountName
    }

    closeCheckPWDialog() {
        this.goToPage(1)
    }

    isCreated() {
        this.walletCreated = true
        this.updatePageIndex(-1)
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

    goToPage(index) {
        const target = this.navList[index].to
        this.navList.map(item => {
            item.active = item.to == target
        })
        this.pageIndex = index
    }

    checkEnd(password) {
        if (!password) return

        const seed = createMnemonic()
        this.$store.commit('SET_MNEMONIC', AppAccounts().encryptString(seed, password))
        this.createForm = {
            password,
            seed,
        }
        this.pageIndex = -1
        this.navList[0].active = false
    }

    created() {
        if (this.$route.params.seed) {
            this.createForm = {
                seed: this.$route.params.seed,
                password: this.$route.params.password
            }
            this.isCreated()
            return
        }
        const initType = Number(this.$route.params.initType) || 0
        this.goToPage(initType)
    }
}
