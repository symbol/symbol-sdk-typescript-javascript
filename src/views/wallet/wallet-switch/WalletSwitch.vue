<template>
  <div class="walletSwitchWrap">
    <div class="walletSwitchHead ">
      <p class="tit">{{$t('Wallet_management')}}</p>
    </div>
      
    <div class="walletList scroll" ref="walletScroll">
      <div v-for="(item, index) in walletList" :key="index">
        <div
          :class="['walletItem', getWalletStyle(item), 'radius']"
          @click="switchWallet(item.address)"
        >
          <Row>
            <Col span="15">
              <div>
                <p class="walletName">{{item.name}}</p>
                <p class="walletAmount overflow_ellipsis">
                  {{formatNumber(item.balance)}}
                  &nbsp;<span class="tails">{{ networkCurrency.ticker }}</span>
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
                              @click.stop="walletToDelete = item; showDeleteDialog = true">
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
    </div>

    <div class="walletMethod">
      <Row>
        <Col span="12">
          <div class="createBtn pointer" @click="toCreate">{{$t('create_sub_wallet')}}</div>
        </Col>
        <Col span="12">
          <div class="importBtn pointer" @click="toImport">{{$t('Import_private_key')}}</div>
        </Col>
      </Row>
    </div>
    <TheWalletDelete
            :showCheckPWDialog="showDeleteDialog"
            :wallet-to-delete="walletToDelete"
            @closeCheckPWDialog="closeDeleteDialog"
            @on-cancel="showCheckPWDialog = false"
    />
    <TheWalletUpdate
            :showUpdateDialog="showUpdateDialog"
            :walletToUpdate="walletToUpdate"
            @closeUpdateDialog="closeUpdateDialog"
            @on-cancel="showUpdateDialog = false"
    />
    <CheckPasswordDialog
            :showCheckPWDialog="showCheckPWDialog"
            :isOnlyCheckPassword="true"
            @closeCheckPWDialog="closeCheckPWDialog"
            @checkEnd="checkEnd"
    ></CheckPasswordDialog>
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
