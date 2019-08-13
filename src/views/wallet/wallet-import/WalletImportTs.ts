
import {NetworkType} from "nem2-sdk"
import { Component, Vue } from 'vue-property-decorator'
import WalletImportKeystore from '@/views/wallet/wallet-import-keystore/WalletImportKeystore.vue'
import WalletImportMnemonic from '@/views/wallet/wallet-import-mnemonic/WalletImportMnemonic.vue'
import WalletImportPrivatekey from '@/views/wallet/wallet-import-privatekey/WalletImportPrivatekey.vue'

@Component({
    components: {
        WalletImportKeystore,
        WalletImportMnemonic,
        WalletImportPrivatekey
    },
})
export class WalletImportTs extends Vue{
    tabIndex = 0
    currentTab = 'mnemonic'
    mnemonic = {
        mnemonic:'',
        password: '',
    }
    privateKey = {
        privateKey:'',
        password: '',
        checkPW: '',
    }
    keystore = {
        keystore:'',
        password: '',
    }
    netType = [
        {
            value:NetworkType.MIJIN_TEST,
            label:'MIJIN_TEST'
        },{
            value:NetworkType.MAIN_NET,
            label:'MAIN_NET'
        },{
            value:NetworkType.TEST_NET,
            label:'TEST_NET'
        },{
            value:NetworkType.MIJIN,
            label:'MIJIN'
        },
    ]

    navagatorList = [
        {
            title: 'mnemonic',
            name: 'walletImportMnemonic',
            isSelected: true
        }, {
            title: 'privatekey',
            name: 'walletImportPrivatekey',
            isSelected: false
        }, {
            title: 'keystore',
            name: 'walletImportKeystore',
            isSelected: false
        }
    ]
    currentHeadText = ''

    jumpToView(n, index) {
        let list = this.navagatorList
        list.map((item) => {
            item.isSelected = false
            return item
        })
        list[index].isSelected = true
        this.navagatorList = list
        this.currentHeadText = n.title
        this.tabIndex = index
    }

    changeTab (name) {
        this.currentTab = name
    }
    success (title,desc) {
        this.$Notice.success({
            title: title,
            desc:  desc?desc:''
        });
    }

    toWalletDetails () {
        this.$emit('toWalletDetails')
    }

    closeImport () {
        this.$emit('closeImport')
    }

    importWallet () {
        switch (this.currentTab) {
            case 'mnemonic':
                this.$store.commit('SET_WALLET_LIST',[{name:'a'}])
                this.$store.commit('SET_HAS_WALLET',true)
                this.success(this['$t']('Successfully_imported_wallet'),'')
                this.mnemonic = {
                    mnemonic:'',
                    password: '',
                }
                break;
            case 'privateKey':
                this.$store.commit('SET_WALLET_LIST',[{name:'a'}])
                this.$store.commit('SET_HAS_WALLET',true)
                this.success(this['$t']('Successfully_imported_wallet'),'')
                this.privateKey = {
                    privateKey:'',
                    password: '',
                    checkPW: '',
                }
                break;
            case 'keystore':
                this.$store.commit('SET_WALLET_LIST',[{name:'a'}])
                this.$store.commit('SET_HAS_WALLET',true)
                this.success(this['$t']('Successfully_imported_wallet'),'')
                this.keystore = {
                    keystore:'',
                    password: '',
                }
                break;
        }
    }
    created () {
        this.jumpToView(this.navagatorList[0], 0)
        this.currentHeadText = this.navagatorList[0].title
    }
}
