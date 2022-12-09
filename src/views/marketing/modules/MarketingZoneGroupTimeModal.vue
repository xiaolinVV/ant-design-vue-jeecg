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
          {{ model.memberListId || '' }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="会员手机号">
          {{ model.phone || '' }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="会员昵称">
          {{ model.nickName || '' }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="会员类型">
          <div v-if="model.memberType == 1">
            vip会员
          </div>
          <div v-else>
            普通会员
          </div>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="增减类型">
          <j-dict-select-tag
            :triggerChange="true"
            @change="handleChangeTradeType"
            :limitShowValList="['0', '1']"
            v-decorator="validatorRules.tradeType"
            placeholder="请选择增减类型"
            dictCode="join_group_add_lessen_type"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="增加/减少">
          {{ model.goAndCome == 1 ? '减少' : model.goAndCome == '0' ? '增加' : '请选择' }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="参团次数">
          <a-input-number :min="0" :precision="0" v-decorator="validatorRules.spellGroupNow"> </a-input-number>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'

export default {
  name: 'MarketingZoneGroupTimeModal',
  data() {
    return {
      title: '调整参团次数',
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
        tradeType: [
          'tradeType',
          {
            rules: [
              {
                required: true,
                message: '请选择增减类型!'
              }
            ]
          }
        ],
        spellGroupNow: [
          'spellGroupNow',
          {
            rules: [
              {
                required: true,
                message: '请输入参团次数!'
              }
            ]
          }
        ]
      },

      url: {
        add: '/marketingZoneGroupTime/marketingZoneGroupTime/add',
        edit: '/marketingZoneGroupTime/marketingZoneGroupTime/edit',
        //调整参团次数
        marketingZoneSpellGroupRecordAdd: '/marketingZoneSpellGroupRecord/marketingZoneSpellGroupRecord/add'
      }
    }
  },
  created() {},
  methods: {
    handleChangeTradeType(val) {
      this.model.goAndCome = val
    },
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, 'year', 'month', 'day', 'delFlag', 'memberListId', 'groupNumber', 'spellGroup')
        )
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
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.marketingZoneSpellGroupRecordAdd
            method = 'post'
          }
          let formData = Object.assign(this.model, values)
          formData.marketingZoneGroupTimeId = formData.id
          formData.spellGroup = formData.spellGroupNow
          //时间格式化

          console.log(formData)
          httpAction(httpurl, formData, method)
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
