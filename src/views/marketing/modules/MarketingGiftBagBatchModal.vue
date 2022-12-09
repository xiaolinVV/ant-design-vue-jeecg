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
          label="礼包名称">
          <a-input placeholder="请输入礼包名称" v-decorator="['giftName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="礼包价格">
          <a-input-number v-decorator="[ 'price', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="发货次数">
          <a-input-number v-decorator="[ 'sendTimes', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分销佣金">
          <a-input-number v-decorator="[ 'distributionCommission', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="推广奖励,不设置的话就取字典promoter_reward作为默认值">
          <a-input-number v-decorator="[ 'promoterReward', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="二级推广奖励,不设置的话就取字典promoter_reward_two作为默认值">
          <a-input-number v-decorator="[ 'promoterRewardTwo', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="归属店铺奖励,不设置的话就取字典ownership_shops_reward作为默认值">
          <a-input-number v-decorator="[ 'ownershipShopsReward', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="渠道店铺奖励,不设置的话就取字典channel_shops_reward作为默认值">
          <a-input-number v-decorator="[ 'channelShopsReward', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分配方式：0：按代理比例分配；1：按加盟商比例分配">
          <a-input placeholder="请输入分配方式：0：按代理比例分配；1：按加盟商比例分配" v-decorator="['modeDistribution', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分钱模式；0：按照代理或者加盟商的奖励；1：自定义奖励">
          <a-input placeholder="请输入分钱模式；0：按照代理或者加盟商的奖励；1：自定义奖励" v-decorator="['allocationModel', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="省代奖励">
          <a-input-number v-decorator="[ 'proviceAward', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="市代奖励">
          <a-input-number v-decorator="[ 'cityAward', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="区县代奖励">
          <a-input-number v-decorator="[ 'towmAward', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="购买人限制：会员类型：0：普通会员；1：vip会员 字典：member_type">
          <a-input placeholder="请输入购买人限制：会员类型：0：普通会员；1：vip会员 字典：member_type" v-decorator="['buyLimit', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="限制购买的会员等级，等级id逗号隔开">
          <a-input placeholder="请输入限制购买的会员等级，等级id逗号隔开" v-decorator="['buyVipMemberGradeId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="最低购买数量">
          <a-input-number v-decorator="[ 'smallBuyCount', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="礼包可见范围；0：指定门店；1：全平台">
          <a-input placeholder="请输入礼包可见范围；0：指定门店；1：全平台" v-decorator="['viewScope', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="库存（发行量）">
          <a-input-number v-decorator="[ 'repertory', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开始时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'startTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="结束时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'endTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="主图；逗号隔开">
          <a-input placeholder="请输入主图；逗号隔开" v-decorator="['mainPicture', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="详情图">
          <a-input placeholder="请输入详情图" v-decorator="['giftDeals', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分享图">
          <a-input placeholder="请输入分享图" v-decorator="['coverPlan', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="海报图">
          <a-input placeholder="请输入海报图" v-decorator="['posters', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="礼包说明">
          <a-input placeholder="请输入礼包说明" v-decorator="['giftExplain', {}]" />
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
          label="停用说明">
          <a-input placeholder="请输入停用说明" v-decorator="['closeExplain', {}]" />
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
    name: "MarketingGiftBagBatchModal",
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
          add: "/marketingGiftBagBatch/marketingGiftBagBatch/add",
          edit: "/marketingGiftBagBatch/marketingGiftBagBatch/edit",
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
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','giftName','price','sendTimes','distributionCommission','promoterReward','promoterRewardTwo','ownershipShopsReward','channelShopsReward','modeDistribution','allocationModel','proviceAward','cityAward','towmAward','buyLimit','buyVipMemberGradeId','smallBuyCount','viewScope','repertory','mainPicture','giftDeals','coverPlan','posters','giftExplain','status','closeExplain'))
		  //时间格式化
          this.form.setFieldsValue({startTime:this.model.startTime?moment(this.model.startTime):null})
          this.form.setFieldsValue({endTime:this.model.endTime?moment(this.model.endTime):null})
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
            formData.startTime = formData.startTime?formData.startTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.endTime = formData.endTime?formData.endTime.format('YYYY-MM-DD HH:mm:ss'):null;
            
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