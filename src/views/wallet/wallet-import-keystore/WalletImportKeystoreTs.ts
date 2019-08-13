import {Component, Vue} from 'vue-property-decorator';

@Component
export class WalletImportKeystoreTs extends Vue {

    file = ''
    fileList = [{
        value: 'no data',
        label: 'no data'
    }]


    checkForm() {
        // TODO
    }

    toBack() {
        this.$emit('closeImport')
    }
}
