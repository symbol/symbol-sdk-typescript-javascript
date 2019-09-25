<template>
  <div class="walletSwitchWrap">
    <div class="walletSwitchHead ">
      <p class="tit">{{$t('Wallet_management')}}</p>
    </div>
    <div class="walletList scroll">
      <div :class="['walletItem', item.active || walletList.length === 1 ?walletStyleSheetType.activeWallet:item.stylesheet,'radius']"
           @click="switchWallet(item.address)"
           v-for="(item, index) in walletList" :key="index">
        <Row>
          <Col span="15">
            <div>
              <p class="walletName">{{item.accountTitle}}-{{item.name}}</p>
              <p class="walletAmount overflow_ellipsis">
                {{formatNumber(getWalletBalance(item.address))}}
                &nbsp;<span class="tails">XEM</span>
              </p>
            </div>
          </Col>
          <Col span="9">
            <div @click.stop>
              <p class="walletTypeTxt">{{isMultisig(item.address) ? $t('Public_account') : ''}}</p>
              <div class="options">
                <Poptip placement="bottom">
                  <img src="@/common/img/wallet/moreActive.png">
                  <div slot="content">
                    <p
                            class="optionItem"
                            @click.stop="walletToDelete = item; showCheckPWDialog = true">
                      <i><img src="@/common/img/wallet/delete.png"></i>
                      <span>{{$t('delete')}}</span>
                    </p>
                    <p
                            class="optionItem"
                            @click.stop="walletToUpdate = item; showUpdateDialog = true">
                      <i><img src="@/common/img/setting/settingEditNodeHover.png"></i>
                      <span class="green">{{$t('update_wallet_name')}}</span>
                    </p>
                  </div>
                </Poptip>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>

    <div class="walletMethod">
      <Row>
        <Col span="12">
          <div class="createBtn pointer" @click="toCreate">{{$t('create')}}</div>
        </Col>
        <Col span="12">
          <div class="importBtn pointer" @click="toImport">{{$t('import')}}</div>
        </Col>
      </Row>
    </div>
    <TheWalletDelete
            :showCheckPWDialog="showCheckPWDialog"
            :wallet-to-delete="walletToDelete"
            @closeCheckPWDialog="closeCheckPWDialog"
            @on-cancel="showCheckPWDialog = false"
    />
    <TheWalletUpdate
            :showUpdateDialog="showUpdateDialog"
            :walletToUpdate="walletToUpdate"
            @closeUpdateDialog="closeUpdateDialog"
            @on-cancel="showUpdateDialog = false"
    />
  </div>
</template>

<script lang="ts">
    import './WalletSwitch.less'
    //@ts-ignore
    import {WalletSwitchTs} from '@/views/wallet/wallet-switch/WalletSwitchTs.ts'

    export default class WalletSwitch extends WalletSwitchTs {

    }
</script>

<style scoped>

</style>
