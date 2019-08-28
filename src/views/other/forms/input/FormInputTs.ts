import {Component, Vue, Prop, Watch, Inject} from 'vue-property-decorator'
import {standardFields} from '@/core/validation'

@Component
export class FormInputTs extends Vue {
  @Prop() fieldName!: string
  @Prop() formModel!: object

  @Inject('$validator') public $validator!: any;
  @Inject() validator!: any

  errors: any
  displayedError: string
  hint1: string
  hint2: string
  label: string
  placeholder: string
  validation: any
  fieldType: string

  constructor() {
    super()
    this.displayedError = ''
    this.hint1 = standardFields[this.fieldName].hint[0] || ''
    this.hint2 = standardFields[this.fieldName].hint[1] || ''
    this.label = standardFields[this.fieldName].label || ''
    this.placeholder = standardFields[this.fieldName].placeholder || ''
    this.validation = standardFields[this.fieldName].validation || ''
    this.fieldType = standardFields[this.fieldName].type || ''
  }

  created() { this.$validator = this.validator }

  get errored() {
    if(!this.errors) return false
    return this.errors.collect(this.fieldName).length > 0
  }

  get fieldError() {
    if(!this.errors) return ''
    return this.errors.first(this.fieldName)
  }

  @Watch('fieldError')
  onFieldErrorChanged(newValue: string) {
    // Avoid flashing when the error Tooltip gets cleared
    if(newValue !== undefined) this.displayedError = newValue
  }
}
