import i18n from '@/language';
import VeeValidate from 'vee-validate';
import en from 'vee-validate/dist/locale/en';
import zhCN from 'vee-validate/dist/locale/zh_CN';
import registerCustomValidators from './registerCustomValidators';

// @TODO: refactor dictionaries import
const customMessagesEn = {
  address: field => `${field} invalid`,
  addressOrMosaicId: field => `${field} invalid`,
};
const customMessagesZh = {
  address: field => `${field} 不正确`,
  addressOrMosaicId: field => `${field} 不正确`,
};

export const veeValidateConfig = {
 i18n,
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