import {Component, Vue} from 'vue-property-decorator'

export class InputLockConstructor extends Vue {
    public lockPromptText: string = ''
    public isShowPrompt: boolean = false
    public currentText: string = ''
    public isShowClearCache: boolean = false
    public form: { password: '' } = {password: ''}

}
