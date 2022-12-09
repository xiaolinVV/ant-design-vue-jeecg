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
          label="优惠券名称">
          <a-input placeholder="请输入优惠券名称" v-decorator="['name', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="店铺id">
          <a-input placeholder="请输入店铺id" v-decorator="['sysUserId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="有无门槛；0：无；1：有">
          <a-input placeholder="请输入有无门槛；0：无；1：有" v-decorator="['isThreshold', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="满多少钱">
          <a-input-number v-decorator="[ 'completely', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="减多少钱">
          <a-input-number v-decorator="[ 'subtract', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用券时间方式；0：标准方式；1：领券当日起；2：领券次日起">
          <a-input placeholder="请输入用券时间方式；0：标准方式；1：领券当日起；2：领券次日起" v-decorator="['vouchersWay', {}]" />
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
          label="多少天、周、月">
          <a-input-number v-decorator="[ 'disData', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="单位；天、周、月">
          <a-input placeholder="请输入单位；天、周、月" v-decorator="['monad', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="商品数量">
          <a-input-number v-decorator="[ 'shopTotal', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="发放总量">
          <a-input-number v-decorator="[ 'total', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="使用人限制；会员类型数据字典">
          <a-input placeholder="请输入使用人限制；会员类型数据字典" v-decorator="['restrict', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="赠送设置；0：不支持；1：支持">
          <a-input placeholder="请输入赠送设置；0：不支持；1：支持" v-decorator="['isGive', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否过期提醒；0：不提醒；1：提醒">
          <a-input placeholder="请输入是否过期提醒；0：不提醒；1：提醒" v-decorator="['isWarn', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="过期前多少天提醒">
          <a-input-number v-decorator="[ 'warnDays', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="无券可再领取；0:不支持；1：支持">
          <a-input placeholder="请输入无券可再领取；0:不支持；1：支持" v-decorator="['isGetThe', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="券说明">
          <a-input placeholder="请输入券说明" v-decorator="['explain', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="已发放数量">
          <a-input-number v-decorator="[ 'releasedQuantity', {}]" />
        </a-form-item>
		
      </a-form>
    </a-spin>
  </a-modal>


  <!--适用商品弹出-->
 <!-- <a-modal title="商品信息" :footer="null" :width="1000" v-model="goodInformation" @ok="hideModalGoodInformation()" okText="确认" cancelText="取消">
    <div v-for="item in formList" style="margin-bottom: 20px">
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :pagination="false"
        :dataSource="item.orderProviderGoodRecords"
      >
        &lt;!&ndash; :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"&ndash;&gt;
        <template slot="mainPicture" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" v-if="record.mainPicture != undefined " :src="getAvatarView(JSON.parse(record.mainPicture)[0])" icon="user"/>
            <a-avatar shape="square" v-if="record.mainPicture == undefined || record.mainPicture ==''  " :src="getAvatarView(record.mainPicture)" icon="user"/>
          </div>
        </template>
      </a-table>
    </div>
  </a-modal>-->
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "MarketingDiscountStoreModal",
    data () {
      return {
        title:"操作",
        visible: false,
        goodInformation:false,
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
          add: "/marketingDiscountStore/marketingDiscountStore/add",
          edit: "/marketingDiscountStore/marketingDiscountStore/edit",
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
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','name','sysUserId','isThreshold','completely','subtract','vouchersWay','disData','monad','shopTotal','total','userRestrict','isGive','isWarn','warnDays','isGetThe','discountExplain','releasedQuantity'))
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
      //适用商品信息弹窗
      showGoodInformation() {
        this.goodInformation = true;
        this.orderNo = orderProviderListDTOs[0].orderNo
        this.formList = orderProviderListDTOs;
      },
      hideModalGoodInformation(){
        this.goodInformation = false;
      },
    }
  }
</script>

<style lang="less" scoped>

</style>