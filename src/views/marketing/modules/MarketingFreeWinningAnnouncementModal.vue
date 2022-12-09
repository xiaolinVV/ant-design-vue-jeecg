<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="实际免单数">
          {{ model.practicalFreeTimes }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="虚拟免单数">
          <a-input-number v-decorator="validatorRules.virtualFreeTimes" @change="virtualFreeTimesChange" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="前端显示免单数">
          {{ model.totalFreeTimes }}
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'

export default {
  name: 'MarketingFreeWinningAnnouncementModal',
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

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        virtualFreeTimes: ['virtualFreeTimes', { rules: [{ required: true, message: '请设置虚拟免单数' }] }]
      },
      url: {
        add: '/marketing/marketingFreeWinningAnnouncement/add',
        edit: 'marketing/marketingFreeWinningAnnouncement/updateVirtualFreeTimes'
      }
    }
  },
  created() {},
  methods: {
    add() {
      this.edit({})
    },
    virtualFreeTimesChange(value) {
      const practicalFreeTimes = this.model.practicalFreeTimes
      this.$set(this.model, 'totalFreeTimes', value + practicalFreeTimes)
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'year',
            'month',
            'day',
            'delFlag',
            'marketingFreeSessionId',
            'practicalFreeTimes',
            'virtualFreeTimes',
            'totalFreeTimes',
            'status'
          )
        )
        //时间格式化
        // this.form.setFieldsValue({
        //   virtualFreeTimes: this.model.virtualFreeTimes ? moment(this.model.virtualFreeTimes) : null
        // })
      })
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
            method = 'get'
          }
          let obj = Object.assign(this.model, values)
          let formData = { virtualFreeTimes: obj.virtualFreeTimes, id: obj.id }
          console.log(formData)
          getAction(httpurl, formData)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
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

<style lang="less" scoped></style>
