import {Component, Vue} from 'vue-property-decorator';

@Component
export class GuideIntoTs extends Vue {
    jumpToOtherPage(name) {
        this.$store.state.app.isInLoginPage = false
        if(name === 'walletImportKeystore'){
            this.$emit('toImport')
        }else if(name === 'walletCreate'){
            this.$emit('toCreate')
        }
    }
}
