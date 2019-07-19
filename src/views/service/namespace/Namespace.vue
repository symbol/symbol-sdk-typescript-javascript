<template>
  <div class="namespaceWrap clear">
    <div class="left createDiv">
      <Tabs type="card" :animated="false" :value="currentTab">
        <TabPane :label="$t('ordinary_account')" name="ordinary">
          <hr>
          <Form :model="formItem">
            <FormItem :label="$t('parent_namespace')">
              <Select v-model="formItem.rootName" required>
                <Option :value="item.value" v-for="(item,index) in rootNameList" :key="index">{{item.label}}</Option>
              </Select>
              <Input v-model="formItem.rootName" style="visibility: hidden;width:0;height: 0;overflow: hidden" required
                     :placeholder="$t('new_root_namespace')"></Input>
            </FormItem>
            <FormItem :label="$t('subspace')">
              <Input v-model="formItem.subName" required :placeholder="$t('input_space_name')"></Input>
            </FormItem>
            <FormItem :label="$t('duration')">
              <Input v-model="formItem.duration" required :placeholder="$t('enter_the_number_of_blocks_integer')"></Input>
              <p class="remindTxt">{{$t('the_duration_is_calculated_in_blocks_one_block_is_12_seconds')}}</p>
              <p class="tails">{{$t('validity_period')}}：0{{$t('time_day')}}</p>
            </FormItem>
            <FormItem :label="$t('fe')">
              <Input v-model="formItem.fee" required placeholder="0.05"></Input>
              <p class="remindTxt">{{$t('the_default_is')}}：0.05000XEM，{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</p>
              <p class="tails">XEM</p>
            </FormItem>
            <FormItem>
              <Button type="success" @click="createNamespace">{{$t('create')}}</Button>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane :label="$t('multi_sign_account')" name="multiple">
          <hr>
          <Form :model="formItem">
            <FormItem :label="$t('parent_namespace')">
              <Select v-model="formItem.rootName" required>
                <Option :value="item.value" v-for="(item,index) in rootNameList" :key="index">{{item.label}}</Option>
              </Select>
              <Input v-model="formItem.rootName" style="visibility: hidden;width:0;height: 0;overflow: hidden" required
                     :placeholder="$t('new_root_namespace')"></Input>
            </FormItem>
            <FormItem :label="$t('subspace')">
              <Input v-model="formItem.subName" required :placeholder="$t('input_space_name')"></Input>
            </FormItem>
            <FormItem :label="$t('duration')">
              <Input v-model="formItem.duration" required :placeholder="$t('enter_the_number_of_blocks_integer')"></Input>
              <p class="remindTxt">{{$t('the_duration_is_calculated_in_blocks_one_block_is_12_seconds')}}</p>
              <p class="tails">{{$t('validity_period')}}：0{{$t('time_day')}}</p>
            </FormItem>
            <FormItem :label="$t('fee')">
              <Input v-model="formItem.fee" type="number" required placeholder="0.05"></Input>
              <p class="remindTxt">{{$t('the_default_is')}}：0.05000XEM，{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</p>
              <p class="tails">XEM</p>
            </FormItem>
            <FormItem>
              <Button type="success" @click="createNamespace">{{$t('create')}}</Button>
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
    </div>
    <div class="left namespaceList">
      <div class="namespaceListHeader">{{$t('space_list')}}</div>
      <div class="namespaceListBody">
        <div class="listTit">
          <Row>
            <Col span="12">{{$t('space_name')}}</Col>
            <Col span="6">{{$t('validity_period')}}</Col>
            <Col span="6"></Col>
          </Row>
        </div>
        <div class="listItem">
          <Row>
            <Col span="12">asgad</Col>
            <Col span="6">21515</Col>
            <Col span="6">
              <div class="listFnDiv">
                <Poptip placement="bottom">
                  <i class="moreFn"></i>
                  <div slot="content" class="updateFn">
                    <p class="fnItem" @click="showEditDialog">
                      <i><img src="../../../assets/images/service/updateNamespace.png"></i><span>更新</span>
                    </p>
                  </div>
                </Poptip>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <CheckPWDialog :showCheckPWDialog="showCheckPWDialog" @closeCheckPWDialog="closeCheckPWDialog"
                   @checkEnd="checkEnd"></CheckPWDialog>
    <EditDialog :showNamespaceEditDialog="showNamespaceEditDialog"
                @closeNamespaceEditDialog="closeNamespaceEditDialog"></EditDialog>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import CheckPWDialog from '../../../components/checkPW-dialog/CheckPWDialog.vue'
    import EditDialog from '../namespaceEdit-dialog/NamespaceEditDialog.vue'
    import './Namespace.less';

    @Component({
        components: {
            EditDialog,
            CheckPWDialog
        }
    })
    export default class Namespace extends Vue {
        formItem: any = {
            rootName: '',
            subName: '',
            duration: 0,
            fee: 0.05
        }
        currentTab: number = 0
        rootNameList: any[] = []
        showCheckPWDialog = false
        showNamespaceEditDialog = false

        showCheckDialog() {
            this.showCheckPWDialog = true
        }

        closeCheckPWDialog() {
            this.showCheckPWDialog = false
        }

        showEditDialog() {
            document.body.click()
            setTimeout(() => {
                this.showNamespaceEditDialog = true
            })
        }

        closeNamespaceEditDialog() {
            this.showNamespaceEditDialog = false
        }

        checkEnd() {

        }

        createNamespace() {
            this.showCheckDialog()
        }

    }
</script>

<style scoped>

</style>
