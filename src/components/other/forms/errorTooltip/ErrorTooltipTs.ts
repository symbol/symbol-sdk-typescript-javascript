import {Component, Vue, Prop, Watch, Inject} from 'vue-property-decorator'

@Component
export class ErrorTooltipTs extends Vue {
    @Prop() fieldName!: string
    @Prop() formModel!: object
    @Prop() placementOverride!: string

    @Inject('$validator') public $validator!: any
    @Inject() validator!: any

    displayedError: string = ''
    
    get errors() {
        return this.$validator.errors
    }

    get errorItem(): string {
        const {items} = this.errors
        if (!items.length) return null
        const item = items.find(({field}) => field === this.fieldName)
        if (item === undefined) return null
        return item.msg
    }

    get errored() {
        if (!this.errors.items.length) return false
        if (!this.errors) return false
        return this.errorItem !== null
    }

    get fieldError() {
        return this.errorItem || ''
    }

    get placement() {
        return this.placementOverride || 'bottom-start'
    }

    @Watch('fieldError')
    onFieldErrorChanged(newValue: string) {
        // Avoid flashing when the error Tooltip gets cleared
        if (newValue !== '') this.displayedError = newValue
    }
}
