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
          label="归属店铺">
          {{storeInfo.storeName}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="二维码名称">
          <a-input placeholder="请输入二维码名称" v-decorator="['qrCodeName', {}]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态">
          <a-radio-group name="radioGroup" v-decorator="['status', {}]">
            <a-radio value="0">停用</a-radio>
            <a-radio value="1">启用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态说明">
          <a-input placeholder="请输入状态说明" v-decorator="['statusExplain', {}]" />
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
    name: "StoreTablesModal",
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
          add: "/store/storeTables/add",
          edit: "/store/storeTables/edit",
        },
        storeInfo:{}
      }
    },
    created () {
    },
    methods: {
      add (record) {
        console.log('新增信息',record);
        this.storeInfo=record;
        this.visible = true;
        this.model.status="0";
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'qrCodeName','status','statusExplain'))
          //时间格式化
        });
      },
      edit (record,storeList) {

        this.$nextTick(()=>{
          for (let r of JSON.parse(JSON.stringify(storeList))) {
            console.log(r);
            if(r.id==record.storeManageId){
              this.storeInfo=r;
            }
          }
        });

        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'qrCodeName','status','statusExplain'))
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
            formData.storeManageId=this.storeInfo.id;
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