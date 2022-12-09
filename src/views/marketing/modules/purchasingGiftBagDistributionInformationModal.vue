<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="收件人">
          <a-input v-decorator="[ 'addressee', validatorRules.addressee]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="手机号">
          <a-input-number style="width: 100%" v-decorator="[ 'phone', validatorRules.phone]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="所在城市">
          <!--        <a-input-number v-decorator="[ 'phone', validatorRules.phone]"/>-->
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="详细收货地址">
          <a-textarea placeholder="请输入详细收货地址" v-decorator="[ 'detailedDeliveryAddress',validatorRules.detailedDeliveryAddress]"/>
          <!--        <a-input-number v-decorator="[ 'phone', validatorRules.phone]"/>-->
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注">
          <a-textarea placeholder="请输入备注" v-decorator="[ 'remarks',validatorRules.remarks]"/>
          <!--        <a-input-number v-decorator="[ 'phone', validatorRules.phone]"/>-->
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="快递公司">
          <a-textarea placeholder="请选择快递公司" v-decorator="[ 'courierServicesCompany',validatorRules.courierServicesCompany]"/>
          <!--        <a-input-number v-decorator="[ 'phone', validatorRules.phone]"/>-->
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="快递单号">
          <a-input placeholder="请输入快递单号" v-decorator="[ 'courierNumber',validatorRules.courierNumber]"/>
          <!--        <a-input-number v-decorator="[ 'phone', validatorRules.phone]"/>-->
        </a-form-item>

      </a-form>
    </a-spin>


    </a-modal>
</template>

<script>
  export default {
    name: 'purchasingGiftBagDistributionInformationModal',
    data(){
      return{
        title:'修改',
        confirmLoading:false,
        visible:false,
        form: this.$form.createForm(this),
        model:{},
        validatorRules: {
          addressee:{
            rules: [{ required: true, message: '请输入收件人!', }],
          },
          phone:{
            rules: [{ required: true, message: '请输入手机号!', }],
          },
          detailedDeliveryAddress:{
            rules: [{ required: true, message: '请输入详细收货地址'}]
          },
          remarks:{
            rules: [{ required: false, message: '请输入备注'}]
          },
          courierServicesCompany:{
            rules: [{ required: true, message: '请选择快递公司'}]
          },
          courierNumber:{
            rules: [{ required: true, message: '请输入快递单号'}]
          },
        },
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
      }
    },
    methods:{
      handleOk(){
        this.form.validateFields((err, values)=>{
          if (!err){
            this.confirmLoading = true
            values = Object.assign({},this.model,values)
            this.$emit('handleOk',values)
            this.confirmLoading = false
            this.visible = false
          }
        })
      },
      handleCancel(){
        this.visible = false
      },
      edit(record = {}){
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.confirmLoading = true
        this.visible = true;
        this.$nextTick(()=>{
          this.form.setFieldsValue(this.model)
          this.confirmLoading = false
        })
      }
    }
  }
</script>

<style scoped>

</style>