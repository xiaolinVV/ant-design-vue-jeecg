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
          label="专区团id">
          <a-input placeholder="请输入专区团id" v-decorator="['marketingZoneGroupId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="专区团分组编号id">
          <a-input placeholder="请输入专区团分组编号id" v-decorator="['marketingZoneGroupGroupingId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="参团编号">
          <a-input placeholder="请输入参团编号" v-decorator="['marketingZoneGroupRecordId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="订单编号">
          <a-input placeholder="请输入订单编号" v-decorator="['serialNumber', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="会员列表id">
          <a-input placeholder="请输入会员列表id" v-decorator="['memberListId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="订单id">
          <a-input placeholder="请输入订单id" v-decorator="['orderListId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="留言">
          <a-input placeholder="请输入留言" v-decorator="['message', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="专区商品id">
          <a-input placeholder="请输入专区商品id" v-decorator="['marketingGroupGoodSpecificationId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="收货人">
          <a-input placeholder="请输入收货人" v-decorator="['consignee', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="联系电话">
          <a-input placeholder="请输入联系电话" v-decorator="['contactNumber', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="收货地址">
          <a-input placeholder="请输入收货地址" v-decorator="['shippingAddress', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="区域id">
          <a-input placeholder="请输入区域id" v-decorator="['sysAreaId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="商品总价">
          <a-input-number v-decorator="[ 'goodsTotal', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="配送金额">
          <a-input-number v-decorator="[ 'shipFee', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="应付款（支付前标准金额）">
          <a-input-number v-decorator="[ 'customaryDues', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="实付款（支付后标准金额）">
          <a-input-number v-decorator="[ 'actualPayment', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态；1：已付款；2：待发货；3：已寄售；4：已完成">
          <a-input placeholder="请输入状态；1：已付款；2：待发货；3：已寄售；4：已完成" v-decorator="['status', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="付款时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'payTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="寄售时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'consignmentTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="寄售完成时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'consignmentEndTime', {}]" />
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
    name: "MarketingZoneGroupOrderModal",
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
          add: "/marketingZoneGroupOrder/marketingZoneGroupOrder/add",
          edit: "/marketingZoneGroupOrder/marketingZoneGroupOrder/edit",
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
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','marketingZoneGroupId','marketingZoneGroupGroupingId','marketingZoneGroupRecordId','serialNumber','memberListId','orderListId','message','marketingGroupGoodSpecificationId','consignee','contactNumber','shippingAddress','sysAreaId','goodsTotal','shipFee','customaryDues','actualPayment','status'))
		  //时间格式化
          this.form.setFieldsValue({payTime:this.model.payTime?moment(this.model.payTime):null})
          this.form.setFieldsValue({consignmentTime:this.model.consignmentTime?moment(this.model.consignmentTime):null})
          this.form.setFieldsValue({consignmentEndTime:this.model.consignmentEndTime?moment(this.model.consignmentEndTime):null})
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
            formData.payTime = formData.payTime?formData.payTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.consignmentTime = formData.consignmentTime?formData.consignmentTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.consignmentEndTime = formData.consignmentEndTime?formData.consignmentEndTime.format('YYYY-MM-DD HH:mm:ss'):null;
            
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