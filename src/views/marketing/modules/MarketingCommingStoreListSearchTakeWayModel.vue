<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :footer="null"
    >
    <a-form :form="form">
      <a-form-item label="福利金" :labelCol="labelCol"
                   :wrapperCol="wrapperCol">
        <a-input v-decorator="[ 'sendWelfarePayments',verificationRules.sendWelfarePayments]">

        </a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
  export default {
    name: 'MarketingCommingStoreListSearchTakeWayModel',
    data(){
      return{
        title:'查看奖励',
        visible:false,
        confirmLoading:false,
        form:'',
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        verificationRules:{
          sendWelfarePayments: {rules: [{ required: true, message: '请选择新推广人类型'}]}
        },
      }
    },
    created() {
      this.form = this.$form.createForm(this)
    },
    methods:{
      show(record){
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(record)
        })
      },
      handleCancel(){
        this.visible = false;
        this.form.resetFields()
      }
    }


  }
</script>

<style scoped>

</style>