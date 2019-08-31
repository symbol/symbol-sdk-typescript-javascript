import {Component, Vue} from 'vue-property-decorator'

@Component
export class GuideIntoTs extends Vue {
    jumpToOtherPage(name) {
        if (name === 'walletImportKeystore') {
            this.$emit('toImport')
        } else if (name === 'walletCreate') {
            this.$emit('toCreate')
        }
    }
}
