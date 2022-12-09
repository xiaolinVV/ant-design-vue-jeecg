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
          label="模板名称">
          <a-input placeholder="请输入模板名称" v-decorator="['name', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="发货地id">
          <a-input placeholder="请输入发货地id" v-decorator="['sysAreaId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="发货地描述">
          <a-input placeholder="请输入发货地描述" v-decorator="['placeDispatch', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="包邮配送区域json存储，存储区域id">
          <a-input placeholder="请输入包邮配送区域json存储，存储区域id" v-decorator="['exemptionPostage', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="计费方式；0：按件数计费；1：按重量计费">
          <a-input placeholder="请输入计费方式；0：按件数计费；1：按重量计费" v-decorator="['chargeMode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="付邮费区域json描述，制作人过来问我，需要实体配合">
          <a-input placeholder="请输入付邮费区域json描述，制作人过来问我，需要实体配合" v-decorator="['mailDelivery', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="模板类型；0：包邮；1：自定义">
          <a-input placeholder="请输入模板类型；0：包邮；1：自定义" v-decorator="['templateType', {}]" />
        </a-form-item>
        <a-checkbox @change="onChange">是否为默认模板</a-checkbox>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "StoreTemplateModal",
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
          add: "/storeTemplate/storeTemplate/add",
          edit: "/storeTemplate/storeTemplate/edit",
        },
      }
    },
    created () {
    },
    methods: {
      onChange(e) {
        console.log(`checked = ${e.target.checked}`);
      },
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.model.delFlag = 0;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','sysUserId','name','sysAreaId','placeDispatch','exemptionPostage','chargeMode','mailDelivery','templateType','isTemplate'))
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