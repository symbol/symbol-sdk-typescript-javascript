import {Component, Vue, Prop, Watch, Inject} from 'vue-property-decorator'

@Component
export class FormInputTs extends Vue {
    @Prop() fieldName!: string
    @Prop() formModel!: object
    @Prop({default: ''}) hint1: string
    @Prop({default: ''}) hint2: string
    @Prop({default: ''}) label: string
    @Prop({default: ''}) placeholder: string
    @Prop({default: ''}) validation: any
    @Prop({default: 'text'}) fieldType: string

    @Inject('$validator') public $validator!: any
    @Inject() validator!: any

    errors: any
    displayedError: string

    constructor() {
        super()
        this.displayedError = ''
    }

    created() {
        this.$validator = this.validator
    }

    get errored() {
        if (!this.errors) return false
        return this.errors.collect(this.fieldName).length > 0
    }

    get fieldError() {
        if (!this.errors) return ''
        return this.$t(this.errors.first(this.fieldName))
    }

    @Watch('fieldError')
    onFieldErrorChanged(newValue: string) {
        // Avoid flashing when the error Tooltip gets cleared
        if (newValue !== undefined) this.displayedError = newValue
    }
}
