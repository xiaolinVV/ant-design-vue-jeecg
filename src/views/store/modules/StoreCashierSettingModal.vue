<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          v-if="storeInfo"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="店铺名称">
         {{storeInfo.storeName}}({{storeInfo.subStoreName}})
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否开启收银">
          <a-radio-group v-model="model.isCashier" v-decorator="['isCashier', {}]">
            <a-radio :value="0">关闭</a-radio>
            <a-radio :value="1">启用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否必须登录">
          <a-radio-group v-model="model.isLogin" v-decorator="['isLogin', {}]">
            <a-radio :value="0">否</a-radio>
            <a-radio :value="1">是</a-radio>
          </a-radio-group>
        </a-form-item>
          <a-card title="送积分" style="width: 80%;margin-left: 60px;background-color: #f0f0f0" :bordered="false">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="是否送积分">
              <a-radio-group v-model="model.isIntegral"  v-decorator="['isIntegral', {}]" @change="isIntegralChange">
                <a-radio :value="0">关闭</a-radio>
                <a-radio :value="1">启用</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="价值比例">
              <a-input-number :disabled="model.isIntegral==0" style="width: 90%" placeholder="价值比例" v-decorator="['integratedWorth', {}]" />%
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="最小赠送比例">
              <a-input-number :disabled="model.isIntegral==0" style="width: 90%" placeholder="最小赠送比例" v-decorator="['minPresentProportion', {}]" />%
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="赠送比例">
              <a-input-number :disabled="model.isIntegral==0" style="width: 90%" placeholder="赠送比例" v-decorator="['presentProportion', {}]" />%
            </a-form-item>
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label=" "
                :colon="false">
              注意：开启送积分功能后，通过店铺收款码付款时将赠送相应比例的积分。
            </a-form-item>
          </a-card>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "StoreCashierSettingModal",
    data () {
      return {
        title:"收银设置",
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
          addOrEdit: "/store/storeCashierSetting/addOrEdit",
          queryById:"/store/storeCashierSetting/queryById"
        },
        storeInfo:{}
      }
    },
    created () {
    },
    methods: {
      async showSettting(record){
        this.form.resetFields();
        console.log(record);
        this.storeInfo=record;
        await this.loadData();
      },
      loadData(){
        getAction(this.url.queryById, {id: this.storeInfo.id}).then((res) => {

          if (res.success) {
            this.model=res.result;
            console.log(this.model);
            this.visible=true;
            this.model.isCashier=parseInt(this.model.isCashier);
            this.model.isIntegral=parseInt(this.model.isIntegral);
            this.model.isLogin=parseInt(this.model.isLogin);
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model,'isLogin','isCashier','isIntegral','presentProportion','minPresentProportion','integratedWorth'))
              //时间格式化
            });
          } else {
            this.visible=true;
            this.model={
              isCashier:0,
              isIntegral:0,
              isLogin:0
            };
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model,'isLogin','isCashier','isIntegral','presentProportion','minPresentProportion','integratedWorth'))
              //时间格式化
            });
          }
        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            httpurl+=this.url.addOrEdit;
            method = 'post';
            let formData = Object.assign(this.model, values);
            formData.storeManageId=this.storeInfo.id;
            //时间格式化

            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
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
      isIntegralChange(e){
        this.model.isIntegral=e.target.value+0;
      }

    }
  }
</script>

<style lang="less" scoped>

</style>