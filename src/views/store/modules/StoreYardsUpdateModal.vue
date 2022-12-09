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
          label="选择店铺">
          <a-select showSearch :options="options"  :filterOption="filterOption" v-decorator="['storeManageId', { rules: [{ required: true, message: '请选择商户' }] }]">
          </a-select>
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
    name: "StoreYardsUpdateModal",
    data () {
      return {
        title:"绑定店铺",
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
          getAllStoreList:"storeManage/storeManage/getAllStoreList"
        },
        qrCodeCount:'',
        options:[]
      }
    },
    created () {
    },
    methods: {
      getAllStoreList(){
        getAction(this.url.getAllStoreList, {}).then((res) => {

          if (res.success) {
            console.log(res.result);
            this.options=[];
            for (let r of res.result) {
              this.options.push({
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
      add () {
        this.qrCodeCount='';
        this.edit({});
      },
      edit (record) {
        this.getAllStoreList();
        this.form.resetFields();
        this.model = Object.assign({}, record);
        console.log(this.model);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'storeManageId'))
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