
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import WalletCreate from '@/views/wallet/wallet-create/WalletCreate.vue'
import WalletCreated from '@/views/wallet/wallet-created/WalletCreated.vue'
import WalletImport from '@/views/wallet/wallet-import/WalletImport.vue'

@Component({
    components: {
        WalletCreate,
        WalletCreated,
        WalletImport
    },
})
export class WalletFnTs extends Vue{
    Index = 0
    createForm = {}
    walletCreated = false
    navList = [
        {name:'create',to:'/walletCreate',active:true},
        {name:'import',to:'/walletImportKeystore',active:false},
    ]

    @Prop()
    tabIndex:any

    get tabIndexNumber () {
        return this.tabIndex
    }

    isCreated (form) {
        this.createForm = form
        this.walletCreated = true
    }

    closeCreated () {
        this.walletCreated = false
    }

    closeCreate () {
        this.$emit('backToGuideInto')
    }

    closeImport () {
        this.$emit('backToGuideInto')
    }

    toWalletDetails () {
        this.$emit('toWalletDetails')
    }

    goToPage (item,index) {
        for(let i in this.navList){
            if(this.navList[i].to == item.to){
                this.navList[i].active = true
            }else {
                this.navList[i].active = false
            }
        }
        this.Index = index
    }
    @Watch('tabIndexNumber')
    onTabIndexNumberChange() {
        this.Index = this.tabIndexNumber
        this.goToPage(this.navList[this.tabIndexNumber], this.Index)
    }
}
