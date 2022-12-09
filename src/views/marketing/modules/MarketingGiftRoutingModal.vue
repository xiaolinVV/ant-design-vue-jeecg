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
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="账户类型">
          <a-radio-group v-model="model.accountType" v-decorator="['accountType', {}]">
            <a-radio :value="0">对私</a-radio>
          </a-radio-group>对公开发中。。。
        </a-form-item>
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
          <a-input style="width: 60%" placeholder="请输入真实姓名" v-decorator="['realName', {}]" :disabled="model.realName"/>设置后，不可修改
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="身份证号">
          <a-input style="width: 60%" placeholder="请输入身份证号" v-decorator="['idNumber', {}]" :disabled="model.idNumber" />设置后，不可修改
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="手机号">
          <a-input placeholder="请输入手机号" v-decorator="['phone', {}]" />
        </a-form-item>

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
  import moment from "moment"

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
          add: "/marketing/marketingGiftRouting/add",
          edit: "/marketing/marketingGiftRouting/edit",
        },
      }
    },
    created () {
    },
    methods: {
      edit (record) {
        console.log(record);
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        if(this.model.accountType){
          this.model.accountType=parseInt(this.model.accountType);
        }else{
          this.model.accountType=0;
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'accountType','bankCard','realName','idNumber','phone','settleAccount','fashionableProportion'))
		  //时间格式化
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