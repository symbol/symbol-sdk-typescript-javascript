import {Vue, Component} from 'vue-property-decorator'

@Component
export default class GenerateMnemonicTs extends Vue {
    percent: number = 0;
    isSlidable: boolean = true;

    jumpToCreateMnemonic(positionX: number, positionY: number) {
        this.$Notice.success({
            title: this.$t('Generate_entropy_increase_success') + '',
        })
        setTimeout(() => {
            this.$router.push("/showMnemonic");
        }, 2000);
    }

    handleMousemove(event: any) {
        if (this.percent < 100) {
            this.percent++;
        } else {
            this.isSlidable = false;
            this.jumpToCreateMnemonic(event.x, event.y);
        }
    }
}
