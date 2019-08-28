import i18n from '@/language';
import VeeValidate from 'vee-validate';
import en from 'vee-validate/dist/locale/en';
import zhCN from 'vee-validate/dist/locale/zh_CN';
import registerCustomValidators from './registerCustomValidators';

// @TODO: refactor dictionaries import
const customMessagesEn = {
  address: () => `this address is invalid`,
  confirmLock: () => `this password is incorrect`,
  confirmPassword: () => 'passwords do not match',
};
const customMessagesZh = {
  address: () => `this address is invalid`,
  confirmLock: () => `this password is incorrect`,
  confirmPassword: () => 'passwords do not match',
};

export const veeValidateConfig = {
 i18n,
 fieldsBagName: 'fieldBags',
 dictionary: {
   'en-US': {
     messages: { ...en.messages, ...customMessagesEn },
   },
   'zh-CN': {
     messages: { ...zhCN.messages, ...customMessagesZh },
   },
 },
 inject: {
   $validator: '$validator',
 },
}

registerCustomValidators(VeeValidate.Validator);