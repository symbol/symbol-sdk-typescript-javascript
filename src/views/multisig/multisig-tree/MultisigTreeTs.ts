import {PublicAccount, MultisigAccountInfo} from 'nem2-sdk'
import {mapState} from "vuex"
import {Component, Vue} from 'vue-property-decorator'
import {Message, MULTISIG_INFO} from "@/config/index.ts"
import {StoreAccount, AppWallet} from "@/core/model"
import {formatAddress} from "@/core/utils"
import {setMultisigAccountMultisigAccountInfo} from '@/core/services'

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class MultisigTreeTs extends Vue {
    activeAccount: StoreAccount
    formatAddress = formatAddress

    get wallet(): AppWallet {
        return this.activeAccount.wallet
    }

    get currentAccountMultisigInfo(): MultisigAccountInfo {
        const {address} = this.wallet
        return this.activeAccount.multisigAccountInfo[address]
    }

    get multisigInfo() {
        return this.activeAccount.multisigAccountInfo
    }

    treeClicked(nodeKey: any) {
        const [node] = nodeKey
        if (!node || !node.publicKey) return
        setMultisigAccountMultisigAccountInfo(node.publicKey, this.$store)
    }

    get multisigTreeData() {
        const {multisigInfo, currentAccountMultisigInfo} = this
        if (typeof (currentAccountMultisigInfo) == 'string' || !currentAccountMultisigInfo || !currentAccountMultisigInfo.multisigAccounts) return false
        const {multisigAccounts} = currentAccountMultisigInfo
        return [{
            title: MULTISIG_INFO.MULTISIG_ACCOUNTS,
            expand: true,
            children: multisigAccounts.map((item: PublicAccount) => {
                return {
                    title: item.address.pretty(),
                    children: [
                        {title: MULTISIG_INFO.PUBLIC_KEY + item.publicKey},
                        {
                            title: MULTISIG_INFO.MIN_APPROVAL + (multisigInfo[item.address.plain()] ? multisigInfo[item.address.plain()].minApproval : this.$t(Message.CLICK_TO_LOAD)),
                            publicKey: item.publicKey,
                        },
                        {
                            title: MULTISIG_INFO.MIN_REMOVAL + (multisigInfo[item.address.plain()] ? multisigInfo[item.address.plain()].minRemoval : this.$t(Message.CLICK_TO_LOAD)),
                            publicKey: item.publicKey,
                        },
                    ]
                }
            })
        }]
    }

    get cosignatoryTreeData() {
        const {multisigInfo, currentAccountMultisigInfo} = this
        if (typeof (currentAccountMultisigInfo) == 'string' || !currentAccountMultisigInfo || !currentAccountMultisigInfo.multisigAccounts) return false
        const {cosignatories} = currentAccountMultisigInfo
        return [{
            title: MULTISIG_INFO.COSIGNATORIES,
            expand: true,
            children: cosignatories.map((item: PublicAccount) => {
                return {
                    title: item.address.pretty(),
                    publicKey: item.publicKey,
                    children: [
                        {title: MULTISIG_INFO.PUBLIC_KEY + item.publicKey},
                        {
                            title: MULTISIG_INFO.MIN_APPROVAL + (multisigInfo[item.address.plain()] ? multisigInfo[item.address.plain()].minApproval : this.$t(Message.CLICK_TO_LOAD)),
                            publicKey: item.publicKey,
                        },
                        {
                            title: MULTISIG_INFO.MIN_REMOVAL + (multisigInfo[item.address.plain()] ? multisigInfo[item.address.plain()].minRemoval : this.$t(Message.CLICK_TO_LOAD)),
                            publicKey: item.publicKey,
                        },
                    ]
                }
            })
        }]
    }
}
