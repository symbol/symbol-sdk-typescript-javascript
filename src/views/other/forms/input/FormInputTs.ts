import {Component, Vue, Prop, Watch, Inject} from 'vue-property-decorator'
import {formFields} from '@/core/validation'

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
    this.hint1 = formFields[this.fieldName].hint[0] || ''
    this.hint2 = formFields[this.fieldName].hint[1] || ''
    this.label = formFields[this.fieldName].label || ''
    this.placeholder = formFields[this.fieldName].placeholder || ''
    this.validation = formFields[this.fieldName].validation || ''
    this.fieldType = formFields[this.fieldName].type || ''
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
