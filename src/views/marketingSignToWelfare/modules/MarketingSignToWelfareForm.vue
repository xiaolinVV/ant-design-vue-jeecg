<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="活动名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="activityName">
              <a-input v-model="model.activityName" placeholder="请输入活动名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="福利金赠送金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="giveWelfare">
              <a-input-number v-model="model.giveWelfare" placeholder="请输入福利金赠送金额" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="海报图" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="postersPicture">
              <j-image-upload isMultiple  v-model="model.postersPicture" ></j-image-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="活动状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="activityStatus">
              <j-switch v-model="model.activityStatus"  ></j-switch>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="签到二维码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="signQrrAddr">
              <j-image-upload isMultiple  v-model="model.signQrrAddr" ></j-image-upload>
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
    name: 'MarketingSignToWelfareForm',
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
           activityName: [
              { required: true, message: '请输入活动名称!'},
           ],
           giveWelfare: [
              { required: true, message: '请输入福利金赠送金额!'},
           ],
           postersPicture: [
              { required: true, message: '请输入海报图!'},
           ],
           activityStatus: [
              { required: true, message: '请输入活动状态!'},
           ],
        },
        url: {
          add: "/marketingSignToWelfare/marketingSignToWelfare/add",
          edit: "/marketingSignToWelfare/marketingSignToWelfare/edit",
          queryById: "/marketingSignToWelfare/marketingSignToWelfare/queryById"
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