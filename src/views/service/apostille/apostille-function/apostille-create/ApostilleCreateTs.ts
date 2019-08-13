import {Component, Vue} from 'vue-property-decorator';

@Component
export class ApostilleCreateTs extends Vue {
    tag = ''
    hashAlgorithm = ''
    transationList = []
    isImportFile = true
    hashAlgorithmList = [
        {
            value: 'SHA-256',
            label: 'SHA-256'
        }
    ]

}
