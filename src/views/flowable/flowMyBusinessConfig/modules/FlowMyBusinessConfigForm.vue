<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="表单类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="formType">
              <j-dict-select-tag type="list" v-model="model.formType" dictCode="ext_flow_form_type" placeholder="请选择表单类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="表名/自定义表单 CODE" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tableName">
              <a-input v-model="model.tableName" placeholder="请输入表名/自定义表单 CODE" @change='handleTableNameChange' ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="唯一编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="code">
              <a-input v-model="model.code" placeholder="请输入唯一编码"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="流程状态列名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bpmStatusColumnName">
              <a-input v-model="model.bpmStatusColumnName" placeholder="请输入流程状态列名" disabled ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="标题表达式" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="titleExpression">
              <a-input v-model="model.titleExpression" placeholder="请输入标题表达式"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="积木报表" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="jimuReportId">
              <j-dict-select-tag type="list" v-model="model.jimuReportId" dictCode="jimu_report,name,id" placeholder="请选择积木报表" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="PC表单组件地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="pcFormUrl">
              <a-input v-model="model.pcFormUrl" placeholder="请输入PC表单组件地址"  ></a-input>
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
    name: 'FlowMyBusinessConfigForm',
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
            formType:"3",
            bpmStatusColumnName:"bpm_status",
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
           formType: [
              { required: true, message: '请输入表单类型!'},
           ],
           tableName: [
              { required: true, message: '请输入表名/自定义表单 CODE!'},
              { validator: (rule, value, callback) => validateDuplicateValue('flow_my_business_config', 'table_name', value, this.model.id, callback)},
           ],
           code: [
              { required: true, message: '请输入唯一编码!'},
              { validator: (rule, value, callback) => validateDuplicateValue('flow_my_business_config', 'code', value, this.model.id, callback)},
           ],
           bpmStatusColumnName: [
              { required: true, message: '请输入流程状态列名!'},
           ],
           titleExpression: [
              { required: true, message: '请输入标题表达式!'},
           ],
        },
        url: {
          add: "/flowMyBusinessConfig/flowMyBusinessConfig/add",
          edit: "/flowMyBusinessConfig/flowMyBusinessConfig/edit",
          queryById: "/flowMyBusinessConfig/flowMyBusinessConfig/queryById"
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
      add (processDefinitionKey) {
        if (processDefinitionKey){
          this.modelDefault.processDefinitionKey = processDefinitionKey
        }
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      handleTableNameChange(e){
        let tableName = e.target.value
        this.model.code = "dev_" + tableName
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