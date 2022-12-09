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
          label="兑换券id">
          <a-input placeholder="请输入兑换券id"
                   v-decorator="['marketingCertificateId', validatorRules.marketingCertificateId]" @click="openModel"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="兑换券名称">
          <span v-if="exchangeCouponName">
            {{exchangeCouponName}}
          </span>
          <span v-else>
            - -
          </span>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="兑换券主图">
          <span v-if="!exchangeMainPicture">
            - -
          </span>
          <img preview="1" :src="exchangeMainPicture" alt="" style="width: 100px;height: 100px;" v-else>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="推荐位">
          <!--          ：0：无；1：首页；2:还知道；字典维护-->
          <a-select style="width: 120px" v-decorator="['recommendLocal', validatorRules.recommendLocal]">
            <a-select-option value="">
              请选择
            </a-select-option>
            <a-select-option value="1">
              首页
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="推荐位排序">
          <a-input-number v-decorator="[ 'sort', validatorRules.sort]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开始时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'startTime', validatorRules.startTime]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="结束时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'endTime', validatorRules.endTime]"/>
        </a-form-item>
      </a-form>
      <AddMarketingSelectExchangeCouponModel ref="AddMarketingSelectExchangeCouponModel"
                                             @handleOk="couponModelHandleOk">

      </AddMarketingSelectExchangeCouponModel>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import AddMarketingSelectExchangeCouponModel from './AddMarketingSelectExchangeCouponModel'
  import pick from 'lodash.pick'
  import moment from 'moment'

  export default {
    name: 'MarketingRecommendCertificateModal',
    inject: ['rush'],
    data() {
      return {
        title: '操作',
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        exchangeCouponName: '',
        exchangeMainPicture: '',
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          marketingCertificateId: { rules: [{ required: true, message: '请输入兑换券id!' }] },
          recommendLocal: { rules: [{ required: true, message: '请选择推荐位!' }] },
          sort: { rules: [{ required: true, message: '请输入推荐位排序!' }] },
          startTime: { rules: [{ required: true, message: '请输入开始时间!' }] },
          endTime: { rules: [{ required: true, message: '请输入结束时间' }] }
        },
        url: {
          add: '/marketingRecommendCertificate/marketingRecommendCertificate/add',
          edit: '/marketingRecommendCertificate/marketingRecommendCertificate/edit',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view'

        }
      }
    },
    components: {
      AddMarketingSelectExchangeCouponModel
    },
    created() {
    },
    methods: {
      add() {
        this.edit({})
      },
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        console.log(record);
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'year', 'month', 'day', 'delFlag', 'marketingCertificateId', 'recommendLocal', 'sort', 'status', 'closeExplain'))
          //时间格式化
          this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
          this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
          let allData = this.model
          if (allData.name) {
            this.exchangeCouponName = allData.name
          } else {
            this.exchangeCouponName = ''
          }
          if (allData.mainPicture) {
            this.exchangeMainPicture = this.url.imgerver + '/' + allData.mainPicture
          } else {
            this.exchangeMainPicture = ''
          }
        })
      },
      couponModelHandleOk(allData) {
        allData = allData[0]
        this.form.setFieldsValue({
          marketingCertificateId: allData.id
        })
        if (allData.name) {
          this.exchangeCouponName = allData.name
        } else {
          this.exchangeCouponName = ''
        }
        if (allData.mainPicture) {
          this.exchangeMainPicture =  this.url.imgerver + '/' + allData.mainPicture
        } else {
          this.exchangeMainPicture = ''
        }
        // this.allData = marketingCertificateId
      },
      openModel() {
        let id = this.form.getFieldValue('marketingCertificateId')
        this.$refs.AddMarketingSelectExchangeCouponModel.open(id)
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = ''
            let method = ''
            if (!this.model.id) {
              httpurl += this.url.add
              method = 'post'
            } else {
              httpurl += this.url.edit
              method = 'put'
            }
            let formData = Object.assign(this.model, values)
            //时间格式化
            formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null
            formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null
            console.log(formData)
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
              } else {
                that.$message.warning(res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
              that.close()
              that.rush()
            })
          }
        })
      },
      handleCancel() {
        this.close()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>