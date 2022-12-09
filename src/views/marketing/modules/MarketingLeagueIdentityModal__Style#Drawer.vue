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
          label="身份名称">
          <a-input placeholder="请输入身份名称" v-decorator="['identityName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否默认；（0：否；1：是）">
          <a-input placeholder="请输入是否默认；（0：否；1：是）" v-decorator="['isDefault', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="获得方式；（0：注册；1：加盟区下单；2：晋升；3：缴费；4：后台开通）">
          <a-input placeholder="请输入获得方式；（0：注册；1：加盟区下单；2：晋升；3：缴费；4：后台开通）" v-decorator="['getWay', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="前置身份id">
          <a-input placeholder="请输入前置身份id" v-decorator="['frontMarketingLeagueIdentityId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="后置身份id">
          <a-input placeholder="请输入后置身份id" v-decorator="['afterMarketingLeagueIdentityId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="缴交金额">
          <a-input-number v-decorator="[ 'payPrice', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否直推奖励；0：否；1：是">
          <a-input placeholder="请输入是否直推奖励；0：否；1：是" v-decorator="['pushStraightReward', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否店长奖励；0：否；1：是">
          <a-input placeholder="请输入是否店长奖励；0：否；1：是" v-decorator="['managerReward', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否店长管理奖励；0：否；1：是">
          <a-input placeholder="请输入是否店长管理奖励；0：否；1：是" v-decorator="['storeManagerReward', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="城市服务商奖励；0：否；1：是">
          <a-input placeholder="请输入城市服务商奖励；0：否；1：是" v-decorator="['cityServiceProviderAward', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="超级合伙人奖励；0：否；1：是">
          <a-input placeholder="请输入超级合伙人奖励；0：否；1：是" v-decorator="['superPartnerAward', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="店长扶持奖励；0：否；1：是">
          <a-input placeholder="请输入店长扶持奖励；0：否；1：是" v-decorator="['storeManagerSupportAward', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否附加身份；0：否；1：是">
          <a-input placeholder="请输入是否附加身份；0：否；1：是" v-decorator="['additionalIdentity', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否支持附加身份；0：否；1：是">
          <a-input placeholder="请输入是否支持附加身份；0：否；1：是" v-decorator="['supportAdditionalIdentity', {}]" />
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
    name: "MarketingLeagueIdentityModal",
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
          add: "/marketing/marketingLeagueIdentity/add",
          edit: "/marketing/marketingLeagueIdentity/edit",
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
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','identityName','isDefault','getWay','frontMarketingLeagueIdentityId','afterMarketingLeagueIdentityId','payPrice','pushStraightReward','managerReward','storeManagerReward','cityServiceProviderAward','superPartnerAward','storeManagerSupportAward','additionalIdentity','supportAdditionalIdentity'))
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