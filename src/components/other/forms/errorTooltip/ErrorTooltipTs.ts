import {Component, Vue, Prop, Watch, Inject} from 'vue-property-decorator'

@Component
export class ErrorTooltipTs extends Vue {
    @Prop() fieldName!: string
    @Prop() formModel!: object
    @Prop() placementOverride!: string

    @Inject('$validator') public $validator!: any
    @Inject() validator!: any

    errors: any
    displayedError: string = ''

    get errored() {
        if (!this.errors) return false
        return this.errors.collect(this.fieldName).length > 0
    }

    get fieldError() {
        if (!this.errors) return ''
        return this.errors.first(this.fieldName)
    }

    get placement() {
        return this.placementOverride || 'bottom-start'
    }

    @Watch('fieldError')
    onFieldErrorChanged(newValue: string) {
        // Avoid flashing when the error Tooltip gets cleared
        if (newValue !== undefined) this.displayedError = newValue
    }
}
