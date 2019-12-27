import {Vue, Component} from 'vue-property-decorator'
import {mapState} from 'vuex'
import {StoreAccount, Notice, NoticeType} from '@/core/model';
import {MnemonicPassPhrase} from 'nem2-hd-wallets';
import CryptoJS from 'crypto-js';
import {Message} from '@/config';

@Component({computed: {...mapState({activeAccount: 'account'})}})
export default class GenerateMnemonicTs extends Vue {
    activeAccount: StoreAccount
    entropy: string = ''
    percent: number = 0;
    isSlidable: boolean = true;

    handleMousemove({x, y}) {
        if (this.percent < 100) {
            this.entropy += `${x}${y}`;
            this.percent++;
            return
        }

        this.isSlidable = false
        this.saveMnemonicAndGoToNextPage()
    }

    saveMnemonicAndGoToNextPage() {
        try {
            const seed = this.createSeedFromMouseEntropy()
            this.$store.commit('SET_TEMPORARY_MNEMONIC', seed)
            this.goToShowMnemonic()
        } catch (error) {
            Notice.trigger(
                Message.MNEMONIC_GENERATION_ERROR, NoticeType.error, this.$store,
            )
        }
    }

    createSeedFromMouseEntropy(): string {
        if (!this.entropy || !this.entropy.length) {
            throw new Error('Something went wrong when creating entropy')
        }

        const entropy = CryptoJS.SHA256(this.entropy).toString()

        Notice.trigger(
            'Generate_entropy_increase_success', NoticeType.success, this.$store,
        )

        return MnemonicPassPhrase.createFromEntropy(entropy).plain
    }

    goToShowMnemonic(): void {
        setTimeout(() => {
            this.$router.push("/showMnemonic");
        }, 2000);
    }
}
