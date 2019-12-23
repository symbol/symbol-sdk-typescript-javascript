<template>
  <div class="walletSwitchWrap">
    <div class="walletSwitchHead">
      <p class="tit">{{$t('Wallet_management')}}</p>
      <p class="back-up pointer" @click="changeMnemonicDialog">{{$t('backup_mnemonic')}}</p>
    </div>

    <div class="walletList scroll" ref="walletScroll">
      <div class="wallet_scroll_item" v-for="(item, index) in walletList" :key="index">
        <div :class="['walletItem', getWalletStyle(item), 'radius']"
                @click="switchWallet(item.address)"
                ref="walletsDiv" >
          <Row>
            <Col span="15">
              <div>
                <p class="walletName">{{item.name}}</p>
                <p class="walletAmount overflow_ellipsis">
                  <NumberFormatting :numberOfFormatting="item.balance ? formatNumber(item.balance) : '0' "></NumberFormatting>
                  <span class="tails">{{ networkCurrency.ticker }}</span>
                </p>
              </div>
            </Col>
            <Col span="9">

              <div @click.stop>
                <div class="walletTypeTxt">{{isMultisig(item.address) ? $t('Public_account') : ''}}</div>
                <div class="options">
                  <span class="mosaics">
                    <Icon type="logo-buffer"/>
                    <NumberFormatting :numberOfFormatting="item.numberOfMosaics  ? formatNumber(item.numberOfMosaics ) : 0"></NumberFormatting>
                  </span>
                  <span @click="deleteWallet(item)" class="delete">
                    <Icon type="md-trash"/>
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>

    <div class="walletMethod">
      <Row>
        <Col span="12">
          <div class="createBtn pointer" @click="toCreate">{{$t('from_seed')}}</div>
        </Col>
        <Col span="12">
          <div class="importBtn pointer" @click="toImport">{{$t('from_privatekey')}}</div>
        </Col>
      </Row>
    </div>

    <CheckPasswordDialog
            v-if="showCheckPWDialog"
            :visible="showCheckPWDialog"
            :returnPassword="true"
            @close="showCheckPWDialog = false"
            @passwordValidated="passwordValidated"></CheckPasswordDialog>

    <MnemonicDialog v-if="isShowMnemonicDialog"
                    :showMnemonicDialog="isShowMnemonicDialog"
                    @closeMnemonicDialog="isShowMnemonicDialog = false"></MnemonicDialog>
    <TheWalletDelete
            :showCheckPWDialog="showDeleteDialog"
            :wallet-to-delete="walletToDelete"
            @closeCheckPWDialog="showDeleteDialog=false"
            @on-cancel="showDeleteDialog = false"></TheWalletDelete>
  </div>
</template>

<script lang="ts">
    import "./WalletSwitch.less";
    //@ts-ignore
    import {WalletSwitchTs} from "@/views/wallet/wallet-switch/WalletSwitchTs.ts";

    export default class WalletSwitch extends WalletSwitchTs {
    }
</script>

<style scoped>
</style>
