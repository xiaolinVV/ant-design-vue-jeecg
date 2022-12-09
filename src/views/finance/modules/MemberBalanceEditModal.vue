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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="会员编号">
          {{ model.id }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="会员账号">
          {{ model.phone }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="会员昵称">
          {{ model.nickName }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="交易类型">
          <!-- <j-dict-select-tag
            v-decorator="validatorRules.amountType"
            :triggerChange="true"
            placeholder="请选择交易类型"
            dictCode="balance_amount_type"
            @change="amountTypeChange"
          /> -->
          <a-select v-decorator="validatorRules.amountType" @change="amountTypeChange" placeholder="请选择交易类型">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option v-for="(item, index) in amountTypeList" :key="index" :value="item.value">{{
              item.text
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="收入/支出">
          <!-- <a-select placeholder="请选择收入/支出" v-decorator="validatorRules.goAndCome">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option :value="0">收入</a-select-option>
            <a-select-option :value="1">支出</a-select-option>
          </a-select> -->
          <div v-if="amountType == 24">
            收入
          </div>
          <div v-else-if="amountType == 25">
            支出
          </div>
          <div v-else>
            请选择
          </div>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="交易额">
          <a-input-number
            :min="0"
            :precision="2"
            style="width:250px"
            placeholder="请输入交易额"
            v-decorator="validatorRules.balance"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
export default {
  name: 'MemberBalanceEditModal',
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
        amountType: ['amountType', { rules: [{ required: true, message: '请选择交易类型' }] }],
        goAndCome: ['goAndCome', { rules: [{ required: true, message: '请选择收入/支出' }] }],
        balance: ['balance', { rules: [{ required: true, message: '请输入交易额' }] }]
      },
      url: {
        add: '/memberList/memberList/add',
        edit: '/memberList/memberList/edit',
        //系统补发余额（1）
        systemTopUp: 'memberList/memberList/systemTopUp',
        //系统扣减
        systemDeduction: 'memberList/memberList/systemDeduction'
      },
      amountType: 0,
      amountTypeList: []
    }
  },
  created() {
    initDictOptions('member_deal_type').then(res => {
      if (res.success && res.result && res.result.length > 0) {
        this.amountTypeList = res.result.filter(item => item.value == 24 || item.value == 25)
      }
    })
  },
  methods: {
    amountTypeChange(value) {
      this.amountType = value
    },
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()

      this.model = Object.assign({}, record)
      this.model.balance = ''
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(this.model)
        this.amountTypeChange(this.model.amountTypeChange || 0)
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
          that.confirmLoading = true
          let httpurl = ''
          if (this.amountType == 24) {
            httpurl = this.url.systemTopUp
          } else if (this.amountType == 25) {
            httpurl = this.url.systemDeduction
          }
          let formData = Object.assign(this.model, values, { memberId: this.model.id })
          //时间格式化
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
