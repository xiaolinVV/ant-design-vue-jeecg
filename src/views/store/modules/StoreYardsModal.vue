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
          label="生成数量">
          <a-input-number :min="0" v-model="qrCodeCount" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {getAction} from '@/api/manage';

  export default {
    name: "StoreYardsModal",
    data () {
      return {
        title:"批量生成",
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
          add: "/store/storeYards/add",
          edit: "/store/storeYards/edit",
        },
        qrCodeCount:''
      }
    },
    created () {
    },
    methods: {
      add () {
        this.qrCodeCount='';
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','serialNumber','qrCode','storeManageId'))
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

            if(!this.qrCodeCount){
              this.$message.warning('请填写生成数量');
              return;
            }
        getAction(this.url.add, {qrCodeCount: this.qrCodeCount}).then((res) => {

          if (res.success) {
            that.$message.success(res.message);
            that.$emit('ok');
            that.confirmLoading = false;
            that.close();
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      handleCancel () {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>