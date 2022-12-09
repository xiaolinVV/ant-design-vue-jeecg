<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :footer="null"
    cancelText="关闭">
<!--    @ok="handleOk"-->
    
    <a-spin :spinning="confirmLoading">





      <a-form :form="form">
<!--      -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="实收金额" v-if="model.type == '0'">
          {{model.actualPayment}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="收款说明" v-if="model.type == '0'">
          {{model.gatheringExplain || ' -'}}
          
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="收款凭证" v-if="model.type == '0'">
          <div v-if="!model.gatheringProof">
            -
          </div>
          <div v-else>
            <img preview="1" :src="item" alt="" v-for="(item,index) in handleImg(model.gatheringProof)" :key="index" style="width: 100px;height: 100px;">
          </div>
        </a-form-item>

          <a-textarea v-model="model.message" v-else>

          </a-textarea>
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="创建月">-->
<!--          <a-input-number v-decorator="[ 'month', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="创建日">-->
<!--          <a-input-number v-decorator="[ 'day', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="删除状态（0，正常，1已删除）">-->
<!--          <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-decorator="['delFlag', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="礼包名称">-->
<!--          <a-input placeholder="请输入礼包名称" v-decorator="['giftName', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="礼包价格">-->
<!--          <a-input-number v-decorator="[ 'price', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="发货次数">-->
<!--          <a-input-number v-decorator="[ 'sendTimes', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="省代">-->
<!--          <a-input placeholder="请输入省代" v-decorator="['proviceId', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="市代">-->
<!--          <a-input placeholder="请输入市代" v-decorator="['cityId', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="区县代">-->
<!--          <a-input placeholder="请输入区县代" v-decorator="['towmId', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="购买人限制：会员类型：0：普通会员；1：vip会员 字典：member_type">-->
<!--          <a-input placeholder="请输入购买人限制：会员类型：0：普通会员；1：vip会员 字典：member_type" v-decorator="['buyLimit', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="限制购买的会员等级，等级id逗号隔开">-->
<!--          <a-input placeholder="请输入限制购买的会员等级，等级id逗号隔开" v-decorator="['buyVipMemberGradeId', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="购买数量">-->
<!--          <a-input-number v-decorator="[ 'buyCount', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="礼包可见范围；0：指定门店；1：全平台">-->
<!--          <a-input placeholder="请输入礼包可见范围；0：指定门店；1：全平台" v-decorator="['viewScope', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="开始时间">-->
<!--          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'startTime', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="结束时间">-->
<!--          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'endTime', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="主图；逗号隔开">-->
<!--          <a-input placeholder="请输入主图；逗号隔开" v-decorator="['mainPicture', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="详情图">-->
<!--          <a-input placeholder="请输入详情图" v-decorator="['giftDeals', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="分享图">-->
<!--          <a-input placeholder="请输入分享图" v-decorator="['coverPlan', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="海报图">-->
<!--          <a-input placeholder="请输入海报图" v-decorator="['posters', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="礼包说明">-->
<!--          <a-input placeholder="请输入礼包说明" v-decorator="['giftExplain', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="采购礼包id">-->
<!--          <a-input placeholder="请输入采购礼包id" v-decorator="['marketingGiftBagBatch', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="礼包编号">-->
<!--          <a-input placeholder="请输入礼包编号" v-decorator="['giftNo', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="会员列表id">-->
<!--          <a-input placeholder="请输入会员列表id" v-decorator="['memberListId', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="应付款（支付前标准金额）">-->
<!--          <a-input-number v-decorator="[ 'customaryDues', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="实付款（支付后标准金额）">-->
<!--          <a-input-number v-decorator="[ 'actualPayment', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="支付状态;0:未支付；1：已支付">-->
<!--          <a-input placeholder="请输入支付状态;0:未支付；1：已支付" v-decorator="['payStatus', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="购买时间">-->
<!--          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'payTime', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="归属店铺">-->
<!--          <a-input placeholder="请输入归属店铺" v-decorator="['affiliationStore', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="归属渠道">-->
<!--          <a-input placeholder="请输入归属渠道" v-decorator="['distributionChannel', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="推广人">-->
<!--          <a-input placeholder="请输入推广人" v-decorator="['promoter', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="推广人类型;0:店铺；1：会员；2：平台">-->
<!--          <a-input placeholder="请输入推广人类型;0:店铺；1：会员；2：平台" v-decorator="['promoterType', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="回调状态；0：未回调；1：已回调">-->
<!--          <a-input placeholder="请输入回调状态；0：未回调；1：已回调" v-decorator="['backStatus', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="回调次数">-->
<!--          <a-input-number v-decorator="[ 'backTimes', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="支付日志">-->
<!--          <a-input placeholder="请输入支付日志" v-decorator="['payParam', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="经度">-->
<!--          <a-input-number v-decorator="[ 'longitude', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="纬度">-->
<!--          <a-input-number v-decorator="[ 'latitude', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="联系人">-->
<!--          <a-input placeholder="请输入联系人" v-decorator="['linkman', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="手机号">-->
<!--          <a-input placeholder="请输入手机号" v-decorator="['phone', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="详细地址">-->
<!--          <a-input placeholder="请输入详细地址" v-decorator="['areaAddress', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="区域描述，逗号隔开">-->
<!--          <a-input placeholder="请输入区域描述，逗号隔开" v-decorator="['areaExplan', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="二级推广人">-->
<!--          <a-input placeholder="请输入二级推广人" v-decorator="['promoterTwo', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="二级推广人类型;0:店铺；1：会员；2：平台">-->
<!--          <a-input placeholder="请输入二级推广人类型;0:店铺；1：会员；2：平台" v-decorator="['promoterTypeTwo', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="加盟商id">-->
<!--          <a-input placeholder="请输入加盟商id" v-decorator="['allianceId', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="收款说明">-->
<!--          <a-input placeholder="请输入收款说明" v-decorator="['gatheringExplain', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="收款凭证">-->
<!--          <a-input placeholder="请输入收款凭证" v-decorator="['gatheringProof', {}]" />-->
<!--        </a-form-item>-->
<!--		-->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "MarketingGiftBagRecordBatchModal",
    data () {
      return {
        title:"线下收款",
        visible: false,
        model: {
          type:'0'  //0 实收金额 1 留言
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
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          add: "/marketingGiftBagRecordBatch/marketingGiftBagRecordBatch/add",
          edit: "/marketingGiftBagRecordBatch/marketingGiftBagRecordBatch/edit",
          imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
        },
      }
    },
    watch:{
      "model.type"(newVal){
        if(newVal == 1){
          this.title = '留言信息'
        }else{
          this.title = '线下收款'
        }
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      handleImg(img){
        let result = []
        if(img){
          try {
            result = Object.values(JSON.parse(img))
          }catch (e) {

          }
        }
        if(result.length > 0){
          result = result.map(item=>{
            return this.url.imgErver + item
          })
        }
        return result
      },
      edit (record) {
        // this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
      //   this.$nextTick(() => {
      //     this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','giftName','price','sendTimes','proviceId','cityId','towmId','buyLimit','buyVipMemberGradeId','buyCount','viewScope','mainPicture','giftDeals','coverPlan','posters','giftExplain','marketingGiftBagBatch','giftNo','memberListId','customaryDues','actualPayment','payStatus','affiliationStore','distributionChannel','promoter','promoterType','backStatus','backTimes','payParam','longitude','latitude','linkman','phone','areaAddress','areaExplan','promoterTwo','promoterTypeTwo','allianceId','gatheringExplain','gatheringProof'))
		  // //时间格式化
      //     this.form.setFieldsValue({startTime:this.model.startTime?moment(this.model.startTime):null})
      //     this.form.setFieldsValue({endTime:this.model.endTime?moment(this.model.endTime):null})
      //     this.form.setFieldsValue({payTime:this.model.payTime?moment(this.model.payTime):null})
      //   });

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
            formData.payTime = formData.payTime?formData.payTime.format('YYYY-MM-DD HH:mm:ss'):null;
            
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