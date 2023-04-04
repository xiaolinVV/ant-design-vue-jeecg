<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="账户类型">
          <a-radio-group v-model="model.accountType" v-decorator="['accountType', {}]">
            <a-radio value="0">对私</a-radio>
            <a-radio value="2">余额</a-radio>
          </a-radio-group>对公开发中。。。
          <div v-if="fashionableType==1" style="color: #cf1322">*如果是对公或者对私分账，订单收银台请关闭余额支付</div>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色">
          <a-radio-group v-model="model.roleType" v-decorator="['roleType', {}]">
            <a-radio value="0">会员</a-radio>
            <a-radio value="1">商户</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-show="model.roleType==1"
          label="是否本商户">
          <a-radio-group v-model="model.isStore" v-decorator="['isStore', {}]" @change="changeIsStore">
            <a-radio value="0">否</a-radio>
            <a-radio value="1">是</a-radio>
          </a-radio-group>
          <div style="color: #cf1322">*如果选择是本商户，代表分配给本商户（这个作为商户收银记录，这个记录信息会进入收银记录中）</div>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分账方式">
          <a-radio-group v-model="model.fashionableWay" v-decorator="['fashionableWay', {}]">
            <a-radio class="radioStyle" value="0">交易百分比（实付款*分账比例）</a-radio>
            <a-radio class="radioStyle"  value="1">积分百分比（实付款*积分比例*分账比例）</a-radio>
            <a-radio class="radioStyle"  value="2">扣除积分价值（实付款-扣除积分成本）*分账比例</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="标签">
          <a-input placeholder="添加标签" v-decorator="['label', {rules: [{ required: true, message: '添加标签' }]}]" />
        </a-form-item>
        <a-form-item
          v-if="model.roleType==1&&model.isStore==0"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="请选择商户">
          <a-select showSearch :options="optionsStore" :filterOption="filterOption" v-decorator="['affiliationStoreManageId', { rules: [{ required: true, message: '请选择商户' }] }]" @change="changeAffiliationStoreManageId"></a-select>
        </a-form-item>
        <a-form-item
          v-if="model.roleType==0"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="请选择会员">
          <a-select showSearch
                    :default-active-first-option="false"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="null"
                    :options="options" @search="handleSearch"
                    v-decorator="['memberListId', {rules: [{ required: true, message: '请选择会员' }]}]" @change="changeMemberList"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分账比例">
          <a-input-number style="width: 95%"  :min="0" :max="100" placeholder="分账比例" v-decorator="['fashionableProportion', {}]" />%
        </a-form-item>
        <a-card v-if="model.accountType!=2">
          <div v-if="bankCard">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="银行卡号">
            {{bankCard.bankCard}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="真实姓名">
            {{bankCard.cardholder}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="身份证号">
            {{bankCard.identityNumber}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="手机号">
          {{bankCard.phone}}
        </a-form-item>
          </div>
          <div v-else>
            银行卡信息未找到
          </div>
        </a-card>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import {getAction} from '@/api/manage';

  export default {
    name: "MarketingGiftRoutingModal",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          add: "/store/storeCashierRouting/add",
          edit: "/store/storeCashierRouting/edit",
          likeMemberByPhone:"memberList/memberList/likeMemberByPhone",
          queryById:"memberList/memberList/queryById",
          getAllStoreList:"storeManage/storeManage/getAllStoreList",
          bankCardQueryById:"storeBankCard/storeBankCard/queryById",
          getStoreBankCardByStoreManageId:"storeBankCard/storeBankCard/getStoreBankCardByStoreManageId",
          getMemberBankCardByMemberId:"memberBankCard/memberBankCard/getMemberBankCardByMemberId",
          memberQueryById:"memberBankCard/memberBankCard/queryById",
        },
        options:[],
        memberListId:'',
        fashionableType:'',
        optionsStore:[],
        bankCard:{}
      }
    },
    created () {
    },
    methods: {
      changeMemberList(e){
        console.log(e);
        this.bankCard={};
        if(this.model.accountType!=2){
          getAction(this.url.getMemberBankCardByMemberId, {
            memberId:e
          }).then((res) => {

            if (res.success) {
              console.log(res.result);
              this.bankCard=res.result;
            } else {
              this.$message.warning(res.message);
            }
          });
        }
      },
      changeAffiliationStoreManageId(e){
        console.log(e);
        this.bankCard={};
        if(this.model.accountType!=2){
          getAction(this.url.getStoreBankCardByStoreManageId, {
            storeManageId:e
          }).then((res) => {

            if (res.success) {
              console.log(res.result);
              this.bankCard=res.result;
            } else {
              this.$message.warning(res.message);
            }
          });
        }
      },
      changeIsStore(e){
        console.log(e);
        if(e.target.value==1&&this.model.accountType!=2){
          getAction(this.url.getStoreBankCardByStoreManageId, {
            storeManageId:this.model.storeManageId
          }).then((res) => {

            if (res.success) {
              console.log(res.result);
              this.bankCard=res.result;
            } else {
              this.$message.warning(res.message);
            }
          });
        }else{
          this.bankCard={};
        }
      },
      bankCardQueryById(id){
        getAction(this.url.bankCardQueryById, {
          id:id
        }).then((res) => {

          if (res.success) {
            console.log(res.result);
           this.bankCard=res.result;
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      memberQueryById(id){
        getAction(this.url.memberQueryById, {
          id:id
        }).then((res) => {

          if (res.success) {
            console.log(res.result);
            this.bankCard=res.result;
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      getAllStoreList(){
        getAction(this.url.getAllStoreList, {}).then((res) => {

          if (res.success) {
            console.log(res.result);
            this.optionsStore=[];
            for (let r of res.result) {
              this.optionsStore.push({
                value:r.id,
                label:r.storeName+"("+r.bossPhone+")"
              });
            }
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      filterOption(inputValue, option){
        return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
      },
      edit (record) {
        console.log(record);
        this.fashionableType=record.fashionableType;
        this.options=[];
        this.bankCard={};
        this.getAllStoreList();
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        if(this.model.accountType){
          if(this.model.memberListId){
            getAction(this.url.queryById, {id: this.model.memberListId}).then((res) => {
            this.handleSearch(res.result.phone);
            });
          }
          if(this.model.bankCardId&&this.model.roleType==1){
            this.bankCardQueryById(this.model.bankCardId);
          }
          if(this.model.bankCardId&&this.model.roleType==0){
            this.memberQueryById(this.model.bankCardId);
          }
        }else{
          this.model.accountType='0';
          this.model.isStore='0';
          this.model.roleType='0';
          this.model.fashionableWay='0';
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'label','isStore','roleType','accountType','affiliationStoreManageId','fashionableProportion','fashionableWay','memberListId'))
		  //时间格式化
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleSearch(value){
        console.log(value);
        getAction(this.url.likeMemberByPhone, {phone: value}).then((res) => {
          this.options=[];
          let pushData=[];
            for (let m of res) {
              pushData.push({value:m.id,label:m.NAME});
            }
            this.options=pushData;
          console.log(this.options);
        });

      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化

            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })



          }
        })
      },
      handleCancel () {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>
  .radioStyle{
    display: flex;
    height: 30px;
    lineHeight:30px;
  }
</style>