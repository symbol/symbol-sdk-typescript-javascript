import {Component, Vue} from 'vue-property-decorator'
import AccountImportMnemonic from '@/views/login/init-seed/account-import-mnemonic/AccountImportMnemonic.vue'
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
    navList = walletFnNavConfig

    get accountName() {
        return this.activeAccount.currentAccount.name
    }

    updatePageIndex(index) {
        this.pageIndex = index
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

    passwordValidated(password) {
        if (!password) {
            this.pageIndex = 1
            return
        } 

        const seed = createMnemonic()
        this.$store.commit('SET_MNEMONIC', AppAccounts().encryptString(seed, password))
        this.createForm = {
            password,
            seed,
        }
        this.pageIndex = -1
        this.navList[0].active = false
    }

    mounted() {
        if (this.$route.params.seed) {
            this.createForm = {
                seed: this.$route.params.seed,
                password: this.$route.params.password
            }
            this.updatePageIndex(-1)
            return
        }
        const initType = Number(this.$route.params.initType) || 0
        this.goToPage(initType)
    }
}
