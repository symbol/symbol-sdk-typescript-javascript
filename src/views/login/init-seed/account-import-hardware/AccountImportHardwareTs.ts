import {mapState} from 'vuex'
import {Component, Vue} from 'vue-property-decorator'
import {formDataConfig} from "@/config/view/form";
import {networkTypeConfig} from '@/config/view/setting'
import trezor from '@/core/utils/trezor';
import { RawAddress } from "nem2-sdk";

import { AppWallet } from '@/core/model/AppWallet';

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class AccountImportHardwareTs extends Vue {
    activeAccount: any
    app: any
    NetworkTypeList = networkTypeConfig
    account = {}
    showCheckPWDialog = false
    // TODO: prefill values (account Index and wallet name)
    // based on number of existing trezor accounts
    trezorForm = formDataConfig.trezorImportForm

    get getNode() {
        return this.activeAccount.node
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
    }

    get walletList() {
        return this.app.walletList
    }

    toWalletDetails() {
        this.$Notice.success({
            title: this['$t']('Imported_wallet_successfully') + ''
        })
        this.$store.commit('SET_HAS_WALLET', true)
        this.$router.push('dashBoard')
    }

    toBack() {
        this.$router.push('initAccount')
    }

    async importAccountFromTrezor() {
        const { accountIndex, networkType, walletName } = this.trezorForm

        // TODO: disable the wallet UI and prompt user to interact with the trezor device

        const publicKeyResult = await trezor.getPublicKey({
            path: `m/44'/43'/${accountIndex}'`,
            coin: "NEM"
        })


        if(publicKeyResult.success) {
            const { publicKey, serializedPath } = publicKeyResult.payload;

            const addressArray = RawAddress.publicKeyToAddress(publicKey, networkType);

            const addressString = addressArray
            .reduce((accumulated, chunk) => `${accumulated}${chunk.toString(16)}`, "");

            new AppWallet().createFromTrezor(
                walletName,
                networkType,
                serializedPath,
                publicKey,
                addressString,
                this.$store
            );
        } else {
            console.log('AUTHENTICATION FAILED: ', publicKeyResult);
        }
    }
}
