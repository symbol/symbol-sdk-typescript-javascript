<template>
  <div class="create_wallet radius">
    <div class="createDiv">
      <div class="createForm">
        <p class="formTit">{{$t('Create_an_account_and_password')}}</p>
        <p class="title_describe">
          {{$t('The_wallet_terminal_will_use_the_HD_WALLET_protocol_to_provide_1')}}
          <span
            class="bolder_text"
          >{{$t('The_wallet_terminal_will_use_the_HD_WALLET_protocol_to_provide_2')}}</span>
          {{$t('The_wallet_terminal_will_use_the_HD_WALLET_protocol_to_provide_3')}}
        </p>
        <form
          action="submit"
          onsubmit="event.preventDefault()"
          @keyup.enter="submit"
          class="form-style"
        >
          <ul>
            <li>
              {{$t('set_the_account_name')}}
              <ErrorTooltip fieldName="accountName">
                <div class="gray_content">
                  <input
                    v-focus
                    v-model="formItem.accountName"
                    :placeholder="$t('Please_enter_the_name_of_the_wallet')"
                    v-validate="'required'"
                    :data-vv-as="$t('account_name')"
                    data-vv-name="accountName"
                  />
                </div>
              </ErrorTooltip>
            </li>

            <li>
              {{$t('choose_network')}}
              <ErrorTooltip fieldName="networkType">
                <div class="gray_content">
                  <Select
                    v-model="formItem.networkType"
                    :data-vv-as="$t('Network_type')"
                    v-validate="'required'"
                    data-vv-name="networkType"
                    class="select-style"
                  >
                    <Option
                      :value="item.value"
                      v-for="(item,index) in networkTypeList"
                      :key="index"
                    >{{item.label}}</Option>
                  </Select>
                </div>
              </ErrorTooltip>
            </li>

            <li>
              {{$t('set_password_8_char')}}
              <ErrorTooltip fieldName="newPassword">
                <div class="gray_content">
                  <input
                    :data-vv-as="$t('password')"
                    data-vv-name="newPassword"
                    v-model="formItem.password"
                    v-validate="validation.password"
                    type="password"
                    :placeholder="$t('please_set_your_wallet_password')"
                  />
                </div>
              </ErrorTooltip>
            </li>

            <li>
              {{$t('confirm_password')}}
              <ErrorTooltip fieldName="confirmPassword">
                <div class="gray_content">
                  <input
                    :data-vv-as="$t('confirmPassword')"
                    data-vv-name="confirmPassword"
                    v-model="formItem.passwordAgain"
                    v-validate="validation.confirmPassword"
                    type="password"
                    :placeholder="$t('please_set_your_wallet_password')"
                  />
                </div>
              </ErrorTooltip>
            </li>

            <li>
              {{$t('hint')}}
              <div class="gray_content">
                <input
                  v-model="formItem.hint"
                  type="text"
                  :placeholder="$t('hint')"
                />
              </div>
            </li>
          </ul>
          <div class="button-section">
            <button class="right" type="success" @click="submit">{{$t('next')}}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
//@ts-ignore
import { CreateAccountTs } from "@/views/login/create-account/CreateAccountTs";
import "./CreateAccount.less";

export default class CreateAccount extends CreateAccountTs {}
</script>

<style scoped lang="less">
</style>
