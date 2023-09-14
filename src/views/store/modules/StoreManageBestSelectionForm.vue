<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="是否开启栏目" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productsSelectedStatus">
              <j-switch v-model="model.productsSelectedStatus" :options='ynOptions' ></j-switch>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="栏目名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productsSelectedTitle">
              <a-input v-model="model.productsSelectedTitle" placeholder="请输入栏目名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="海报图" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productsSelectedPostsPicture">
              <j-image-upload  v-model="model.productsSelectedPostsPicture" ></j-image-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="分享海报" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productsSelectedSharePicture">
              <j-image-upload  v-model="model.productsSelectedSharePicture" ></j-image-upload>
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
    name: 'StoreManageBestSelectionForm',
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
           productsSelectedStatus: [
              { required: true, message: '请输入是否开启栏目!'},
           ],
           productsSelectedTitle: [
              { required: true, message: '请输入栏目名称!'},
           ],
           productsSelectedSharePicture: [
              { required: true, message: '请上传分享海报!'},
           ],
          productsSelectedPostsPicture: [
              { required: true, message: '请上传海报图!'},
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