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
          label="免单场次id">
          <a-input placeholder="请输入免单场次id" v-decorator="['marketingFreeSessionId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="实际免单数">
          <a-input-number v-decorator="[ 'practicalFreeTimes', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="虚拟免单数">
          <a-input-number v-decorator="[ 'virtualFreeTimes', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="总免单数">
          <a-input-number v-decorator="[ 'totalFreeTimes', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态；0：未发布；1：已发布">
          <a-input placeholder="请输入状态；0：未发布；1：已发布" v-decorator="['status', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="发布时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'releaseTime', {}]" />
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
    name: "MarketingFreeWinningAnnouncementModal",
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
          add: "/marketing/marketingFreeWinningAnnouncement/add",
          edit: "/marketing/marketingFreeWinningAnnouncement/edit",
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
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','marketingFreeSessionId','practicalFreeTimes','virtualFreeTimes','totalFreeTimes','status'))
		  //时间格式化
          this.form.setFieldsValue({releaseTime:this.model.releaseTime?moment(this.model.releaseTime):null})
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
            formData.releaseTime = formData.releaseTime?formData.releaseTime.format('YYYY-MM-DD HH:mm:ss'):null;
            
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