import i18n from '../locale/index'
import Vue from 'vue'

const vueInstance = new Vue({i18n})

export default {
    COPY_SUCCESS: vueInstance.$t('successful_copy'),
    SUCCESS: vueInstance.$t('success'),
    OPERATION_SUCCESS: vueInstance.$t('successful_operation'),
    UPDATE_SUCCESS: vueInstance.$t('update_completed'),


    PLEASE_SET_WALLET_PASSWORD_INFO: vueInstance.$t('please_set_your_wallet_password'),
    PLEASE_ENTER_MNEMONIC_INFO: vueInstance.$t('Please_enter_a_mnemonic_to_ensure_that_the_mnemonic_is_correct'),
    PLEASE_SWITCH_NETWORK: vueInstance.$t('walletCreateNetTypeRemind'),
    NO_MNEMONIC_INFO: vueInstance.$t('no_mnemonic'),

    WALLET_NAME_INPUT_ERROR: vueInstance.$t('walletCreateWalletNameRemind'),
    PASSWORD_CREATE_ERROR: vueInstance.$t('createLockPWRemind'),
    INCONSISTENT_PASSWORD_ERROR: vueInstance.$t('createLockCheckPWRemind'),
    PASSWORD_HIT_SETTING_ERROR: vueInstance.$t('createLockPWTxtRemind'),
    WRONG_PASSWORD_ERROR: vueInstance.$t('password_error'),
    MOSAIC_NAME_NULL_ERROR: vueInstance.$t('mosaic_name_can_not_be_null'),
    QR_GENERATION_ERROR: vueInstance.$t('QR_code_generation_failed'),
    ADDRESS_FORMAT_ERROR: vueInstance.$t('address_format_error'),
    AMOUNT_LESS_THAN_0_ERROR: vueInstance.$t('amount_can_not_be_less_than_0'),
    FEE_LESS_THAN_0_ERROR: vueInstance.$t('fee_can_not_be_less_than_0'),
    SUPPLY_LESS_THAN_0_ERROR: vueInstance.$t('supply_can_not_less_than_0'),
    DIVISIBILITY_LESS_THAN_0_ERROR: vueInstance.$t('divisibility_can_not_less_than_0'),
    DURATION_LESS_THAN_0_ERROR: vueInstance.$t('duration_can_not_less_than_0'),
    DURATION_MORE_THAN_1_YEARS_ERROR: vueInstance.$t('duration_can_not_more_than_1_years'),
    DURATION_MORE_THAN_10_YEARS_ERROR: vueInstance.$t('duration_can_not_more_than_10_years'),
    MNEMONIC_INCONSISTENCY_ERROR: vueInstance.$t('Mnemonic_inconsistency'),
    PASSWORD_SETTING_INPUT_ERROR: vueInstance.$t('walletCreatePasswordRemind'),
    MNENOMIC_INPUT_ERROR: vueInstance.$t('Mnemonic_input_error'),
    OPERATION_FAILED_ERROR: vueInstance.$t('operation_failed'),

}
