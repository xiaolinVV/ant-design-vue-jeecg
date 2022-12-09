<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭"
    :footer="null"
  >
    <a-form>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="合计金额" style="font-weight:600">
        ￥{{ formData.totalPrice }}
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="余额支付">
        ￥{{ formData.balance }}
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="福利金支付">
        {{ formData.welfarePayments }}
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="微信支付">
        ￥{{ formData.wxPayPrice }}
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="支付宝支付">
        ￥{{ formData.alPayPrice }}
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { getAction } from '@/api/manage'
export default {
  name: 'MarketingZoneGroupPayDetail',
  data() {
    return {
      title: '支付信息',
      visible: false,
      confirmLoading: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      formData: {},
      url: {
        getPayInfo: 'marketingZoneGroupRecord/marketingZoneGroupRecord/getPayInfo'
      }
    }
  },
  methods: {
    handleCancel() {
      this.visible = false
      this.model = {}
      this.formData = {}
    },
    show(record) {
      this.visible = true
      this.confirmLoading = true
      this.model = Object.assign({}, record)
      getAction(this.url.getPayInfo, { payZoneGroupLogId: record.payZoneGroupLogId }).then(res => {
        this.confirmLoading = false
        if (res.success) {
          this.formData = res.result
        } else {
          this.$message.warn(res.message)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
