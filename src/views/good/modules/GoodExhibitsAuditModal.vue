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
          label="审批">
          <a-radio-group v-model:value="model.status" name="radioGroup" v-decorator="['status', { rules: [{ required: true, message: '请输入审批' }] }]" >
            <a-radio value="1">通过</a-radio>
            <a-radio value="2">不通过</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="model.status==2"
          label="备注">
          <a-textarea v-decorator="['statusExplain', { rules: [{ required: true, message: '请输入备注' }] }]"></a-textarea>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import ATextarea from 'ant-design-vue/es/input/TextArea'

  export default {
    name: "GoodExhibitsAuditModal",
    components: { ATextarea },
    data () {
      return {
        title:"审核",
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
        options:[],
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          add: "/good/goodExhibits/add",
          edit: "/good/goodExhibits/edit"
        }
      }
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        console.log(record);
        this.form.resetFields();
        this.model = Object.assign({}, record);
        if(this.model.status==0){
          this.model.status='1';
        }
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'status','statusExplain'))
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