/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {Component, Vue, Prop} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

@Component({computed: {...mapGetters({
  currentLanguage: 'app/currentLanguage',
  languageList: 'app/languages',
})}})
export class LanguageSelectorTs extends Vue {
  @Prop({
    default: '',
  }) value: string

  @Prop({
    default: false,
  }) defaultFormStyle: boolean

  @Prop({
    default: true,
  }) autoSubmit: boolean

  /**
   * Currently active language
   * @see {Store.AppInfo}
   * @var {string}
   */
  public currentLanguage: string

  /**
   * List of available languages
   * @see {Store.AppInfo}
   * @var {any[]}
   */
  public languageList: {value: string, label: string}[]

  /**
   * Currently active language
   */
  get language() {
    return this.value && this.value.length ? this.value : this.currentLanguage
  }

  /**
   * Sets the new language
   */
  set language(language: string) {
    if (this.autoSubmit) {
      this.$store.dispatch('app/SET_LANGUAGE', language)
    }

    this.$emit('input', language)
  }
}
