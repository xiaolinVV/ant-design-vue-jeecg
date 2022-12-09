<template>
  <a-drawer
      :title="title"
      :width="800"
      placement="right"
      :closable="false"
      @close="close"
      :visible="visible"
  >

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
      
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建年">
          <a-input-number v-decorator="[ 'year', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建月">
          <a-input-number v-decorator="[ 'month', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建日">
          <a-input-number v-decorator="[ 'day', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="删除状态（0，正常，1已删除）">
          <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-decorator="['delFlag', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="任务编号">
          <a-input placeholder="请输入任务编号" v-decorator="['serialNumber', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="任务类型；字典类型：0：注册成功；1：交易密码；2：连续签到；3：每日浏览；4；邀请签到；5：邀请注册">
          <a-input placeholder="请输入任务类型；字典类型：0：注册成功；1：交易密码；2：连续签到；3：每日浏览；4；邀请签到；5：邀请注册" v-decorator="['taskType', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="任务标题">
          <a-input placeholder="请输入任务标题" v-decorator="['taskTitle', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="任务方式；0：连续签到；1：每日任务；2：唯一任务">
          <a-input placeholder="请输入任务方式；0：连续签到；1：每日任务；2：唯一任务" v-decorator="['taskeMode', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="显示位置；0：签到栏；1：任务栏；2：奖励栏">
          <a-input placeholder="请输入显示位置；0：签到栏；1：任务栏；2：奖励栏" v-decorator="['displayPosition', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="图标">
          <a-input placeholder="请输入图标" v-decorator="['taskImg', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="奖励">
          <a-input-number v-decorator="[ 'award', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态；0：停用；1：启用">
          <a-input placeholder="请输入状态；0：停用；1：启用" v-decorator="['status', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态说明">
          <a-input placeholder="请输入状态说明" v-decorator="['statusExplain', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="奖励类型；0：积分">
          <a-input placeholder="请输入奖励类型；0：积分" v-decorator="['awardType', {}]" />
        </a-form-item>
		
      </a-form>
    </a-spin>
    <a-button type="primary" @click="handleOk">确定</a-button>
    <a-button type="primary" @click="handleCancel">取消</a-button>
  </a-drawer>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "MarketingIntegralTaskModal",
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
          add: "/marketing/marketingIntegralTask/add",
          edit: "/marketing/marketingIntegralTask/edit",
        },
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','serialNumber','taskType','taskTitle','taskeMode','displayPosition','taskImg','award','status','statusExplain','awardType'))
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
/** Button按钮间距 */
  .ant-btn {
    margin-left: 30px;
    margin-bottom: 30px;
    float: right;
  }
</style>