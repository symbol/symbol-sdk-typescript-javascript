// @VEEVALIDATE: move from here when doing vee-validate implementation
import {RECIPIENT_TYPES} from '@/core/model'
import {networkConfig} from '@/config'
import {validateAddress, validatePublicKey, validateAlias} from './validators'
const {NAMESPACE_MAX_LENGTH, PUBLIC_KEY_LENGTH} = networkConfig

export const determineRecipientType = (str: string): RECIPIENT_TYPES => {
      if (str === null || str === undefined || !str.length) {
            throw new Error('Input is not a valid string')
      }
      if (str.length > NAMESPACE_MAX_LENGTH) throw new Error('Input string is too long')
      if (str.length === PUBLIC_KEY_LENGTH && validatePublicKey(str)) return RECIPIENT_TYPES.PUBLIC_KEY
      if (validateAddress(str).valid) return RECIPIENT_TYPES.ADDRESS
      if (validateAlias(str).valid) return RECIPIENT_TYPES.ALIAS
      throw new Error('Input is not a valid recipient')
}
