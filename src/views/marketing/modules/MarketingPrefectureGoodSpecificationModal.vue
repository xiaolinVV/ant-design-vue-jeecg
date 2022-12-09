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
          label="专区商品id">
          <a-input placeholder="请输入专区商品id" v-decorator="['marketingPrefectureGoodId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="商品规格id">
          <a-input placeholder="请输入商品规格id" v-decorator="['goodSpecificationId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="专区价">
          <a-input-number v-decorator="[ 'prefecturePrice', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="专区折扣">
          <a-input-number v-decorator="[ 'prefecturePriceProportion', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="福利金抵扣；0：不支持福利金抵扣；1：福利金全额抵扣；2：福利金限额抵扣">
          <a-input placeholder="请输入福利金抵扣；0：不支持福利金抵扣；1：福利金全额抵扣；2：福利金限额抵扣" v-decorator="['isWelfare', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="福利金限额抵扣比例">
          <a-input-number v-decorator="[ 'welfareProportion', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="赠送福利金；0：不支持；1：支持">
          <a-input placeholder="请输入赠送福利金；0：不支持；1：支持" v-decorator="['isGiveWelfare', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="赠送福利金比例">
          <a-input-number v-decorator="[ 'giveWelfareProportion', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="购买天数;-1：不限制；其他代表天数">
          <a-input-number v-decorator="[ 'buyProportionDay', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="可购买件数；-1：不限制；其他代表件数">
          <a-input-number v-decorator="[ 'buyProportionLetter', {}]" />
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
    name: "MarketingPrefectureGoodSpecificationModal",
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
          add: "/marketingPrefectureGoodSpecification/marketingPrefectureGoodSpecification/add",
          edit: "/marketingPrefectureGoodSpecification/marketingPrefectureGoodSpecification/edit",
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
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','marketingPrefectureGoodId','goodSpecificationId','prefecturePrice','prefecturePriceProportion','isWelfare','welfareProportion','isGiveWelfare','giveWelfareProportion','buyProportionDay','buyProportionLetter'))
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

</style>