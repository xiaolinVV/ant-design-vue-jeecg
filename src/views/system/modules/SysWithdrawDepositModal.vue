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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="可提现金额">
          {{ model.avlBalance }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="提现金额">
          <a-input-number
            :min="0"
            :precision="2"
            v-decorator="['balance', { rules: [{ required: true, message: '请输入提现金额' }] }]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结算服务">
          {{ model.cashType }}
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
  name: 'SysWithdrawDepositModal',
  data() {
    return {
      title: '操作',
      visible: false,
      model: {
        cashType: '',
        avlBalance: '',
        balance: ''
      },
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
      validatorRules: {},
      url: {
        // add: '/system/sysWithdrawDeposit/add',
        // edit: '/system/sysWithdrawDeposit/edit'
        add: '/system/sysWithdrawDeposit/withdrawDeposit',
        getPublicParam: 'system/sysWithdrawDeposit/getPublicParam'
      }
    }
  },
  created() {},
  methods: {
    add() {
      this.confirmLoading = true
      getAction(this.url.getPublicParam).then(res => {
        if (res.success) {
          this.confirmLoading = false
          this.model = Object.assign({}, res.result)
        }
      })
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'balance'))
        //时间格式化
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
          // that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'get'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          // let formData = Object.assign(this.model, values)
          //时间格式化

          console.log(values)
          getAction(httpurl, values)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              // that.confirmLoading = false
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
