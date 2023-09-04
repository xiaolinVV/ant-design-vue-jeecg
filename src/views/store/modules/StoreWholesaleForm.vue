<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="是否开启" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productWholesaleStatus">
              <j-switch v-model="model.productWholesaleStatus" :options='ynOptions'  ></j-switch>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="栏目名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productWholesaleTitle">
              <a-input v-model="model.productWholesaleTitle" placeholder="请输入栏目名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="仅经销商" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productWholesaleOnlyFranchiser">
              <j-switch v-model="model.productWholesaleOnlyFranchiser" :options='ynOptions'  ></j-switch>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="仅代理商" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productWholesaleOnlyAgency">
              <j-switch v-model="model.productWholesaleOnlyAgency" :options='ynOptions' ></j-switch>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="申请海报" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productWholesaleApplyPicture">
              <j-image-upload  v-model="model.productWholesaleApplyPicture" ></j-image-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="分享海报" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productWholesaleSharePicture">
              <j-image-upload  v-model="model.productWholesaleSharePicture" ></j-image-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="代理商申请内容" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productWholesaleApplyContent">
              <JEditor v-model="model.productWholesaleApplyContent"> </JEditor>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="经销商申请内容" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productFranchiserApplyContent">
              <JEditor v-model="model.productFranchiserApplyContent"> </JEditor>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'StoreWholesaleForm',
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        ynOptions: ['1','0'],
        model:{
         },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
           productWholesaleStatus: [
              { required: true, message: '请输入是否开启!'},
           ],
           productWholesaleTitle: [
              { required: true, message: '请输入栏目名称!'},
           ],
           productWholesaleOnlyFranchiser: [
              { required: true, message: '请输入仅经销商!'},
           ],
           productWholesaleOnlyAgency: [
              { required: true, message: '请输入仅代理商!'},
           ],
           productWholesaleApplyPicture: [
              { required: true, message: '请上传申请海报!'},
           ],
          productWholesaleSharePicture: [
              { required: true, message: '请上传分享海报!'},
           ],
          productWholesaleApplyContent: [
              { required: true, message: '请输入申请内容!'},
           ],
          productFranchiserApplyContent: [
              { required: true, message: '请输入申请内容!'},
           ],
        },
        url: {
          add: "/storeManage/storeManage/add",
          edit: "/storeManage/storeManage/edit",
          queryById: "/storeManage/storeManage/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
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
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }

        })
      },
    }
  }
</script>