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
            <a-radio :value="0">对私</a-radio>
            <a-radio :value="2">余额</a-radio>
          </a-radio-group>对公开发中。。。
          <div v-if="fashionableType==1" style="color: #cf1322">*如果是对公或者对私分账，订单收银台请关闭余额支付</div>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否店铺">
          <a-radio-group v-model="model.isStore" v-decorator="['isStore', {}]">
            <a-radio :value="0">否</a-radio>
            <a-radio :value="1">是</a-radio>
          </a-radio-group>
          <div style="color: #cf1322">*如果选择是店铺，代表分配给本商户</div>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分账方式">
          <a-radio-group v-model="model.isStore" v-decorator="['fashionableWay', {}]">
            <a-radio :value="0">交易百分比</a-radio>
            <a-radio v-if="fashionableType==0" :value="1">积分百分比</a-radio>
            <a-radio v-if="fashionableType==0" :value="2">扣除积分价值</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="标签">
          <a-input placeholder="添加标签备注" v-decorator="['label', {}]" />
        </a-form-item>
        <a-form-item
          v-if="model.accountType==2&&model.isStore==0"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="请选择会员">
          <a-select showSearch
                    :default-active-first-option="false"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="null"
                    :options="options" @search="handleSearch"
                    v-decorator="['memberListId', {}]"/>
        </a-form-item>
        <div v-if="model.accountType!=2">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="银行卡号">
          <a-input placeholder="请输入银行卡号" v-decorator="['bankCard', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="真实姓名">
          <a-input style="width: 60%" placeholder="请输入真实姓名" v-decorator="['realName', {}]" :disabled="model.realName"/><div style="color: #cf1322">*设置后，不可修改</div>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="身份证号">
          <a-input style="width: 60%" placeholder="请输入身份证号" v-decorator="['idNumber', {}]" :disabled="model.idNumber" /><div style="color: #cf1322">*设置后，不可修改</div>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="手机号">
          <a-input placeholder="请输入手机号" v-decorator="['phone', {}]" />
        </a-form-item>
        </div>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分账比例">
          <a-input-number style="width: 95%"  :min="0" :max="100" placeholder="分账比例" v-decorator="['fashionableProportion', {}]" />%
        </a-form-item>

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
          queryById:"memberList/memberList/queryById"
        },
        options:[],
        memberListId:'',
        fashionableType:''
      }
    },
    created () {
    },
    methods: {
      edit (record) {
        console.log(record);
        this.fashionableType=record.fashionableType;
        this.options=[];
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        if(this.model.accountType){
          this.model.accountType=parseInt(this.model.accountType);
          this.model.isStore=parseInt(this.model.isStore);
          this.model.fashionableWay=parseInt(this.model.fashionableWay);
          if(this.model.memberListId){
            getAction(this.url.queryById, {id: this.model.memberListId}).then((res) => {
            this.handleSearch(res.result.phone);
            });
          }
        }else{
          this.model.accountType=0;
          this.model.isStore=0;
          this.model.fashionableWay=0;
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'label','isStore','accountType','bankCard','realName','idNumber','phone','settleAccount','fashionableProportion','fashionableWay','memberListId'))
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

</style>