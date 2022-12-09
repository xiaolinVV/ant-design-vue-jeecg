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
          label="分类名称">
          <a-input placeholder="请输入分类名称" v-decorator="['typeName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="活动价格">
          <a-input-number style="width: 95%" v-decorator="[ 'price', {}]" />元
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="直推奖励">
          <a-input-number style="width: 95%" v-decorator="[ 'pushStraightReward', {}]" />元
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="店长奖励">
          <a-input-number style="width: 95%" v-decorator="[ 'managerReward', {}]" />元
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="城市服务商奖励">
          <a-input-number style="width: 95%" v-decorator="[ 'cityServiceProvider', {}]" />元
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="店长管理奖励比例">
          <a-input-number style="width: 95%" :min="0" :max="100"  v-decorator="[ 'storeManagerReward', {}]" />%
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="合伙人管理奖励比例">
          <a-input-number style="width: 95%" :min="0" :max="100" v-decorator="[ 'partnerStoreReward', {}]" />%
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="店长扶植奖励">
          <a-input-number style="width: 95%" :min="0" :max="100" v-decorator="[ 'storeManagerSupportAward', {}]" />%
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="超级合伙人管理奖励">
          <a-input-number style="width: 95%" :min="0" :max="100" v-decorator="[ 'superPartnerAward', {}]" />%
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否支持复购">
          <a-radio-group v-decorator="['afterPurchase']" @change="radioChange">
            <a-radio value="0">
              不支持
            </a-radio>
            <a-radio value="1">
              支持
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="复购直推奖励比例">
          <a-input-number :disabled="inputDisable" style="width: 95%" :min="0" :max="100" v-decorator="[ 'afterPushStraightReward', {}]" />%
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="复购间推奖励比例">
          <a-input-number :disabled="inputDisable" style="width: 95%" :min="0" :max="100" v-decorator="[ 'betweenPush', {}]" />%
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="赠送礼品券">
          <a-input-number style="width: 100%" v-decorator="[ 'welfarePayments', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="级别">
          <a-input-number style="width: 100%" v-decorator="[ 'grade', {}]" />
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
    name: "MarketingLeagueTypeModal",
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
          add: "/marketing/marketingLeagueType/add",
          edit: "/marketing/marketingLeagueType/edit",
        },
        inputDisable:true
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
        if(record.afterPurchase==1){
          this.inputDisable=false;
        }
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','typeName','price','pushStraightReward','managerReward','storeManagerReward','cityServiceProvider','storeManagerSupportAward','superPartnerAward','partnerStoreReward','afterPurchase','afterPushStraightReward','betweenPush','welfarePayments','grade'))
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
      radioChange(value){
        console.log(value);
        if(value.target.value==0){
            this.inputDisable=true;
        }
        if(value.target.value==1){
          this.inputDisable=false;
        }
      }

    }
  }
</script>

<style lang="less" scoped>

</style>