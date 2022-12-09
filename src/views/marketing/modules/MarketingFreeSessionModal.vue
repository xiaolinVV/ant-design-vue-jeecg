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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="周期天数">
          <a-input-number v-decorator="validatorRules.periodDays" :min="1" @change="periodDaysChange" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开始时间">
          <a-date-picker
            showTime
            :disabled-date="disabledDate"
            format="YYYY-MM-DD"
            v-decorator="validatorRules.startTime"
            @change="startTimeChange"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结束时间">
          <a-date-picker showTime :disabled="true" format="YYYY-MM-DD" v-decorator="validatorRules.endTime" />
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
  name: 'MarketingFreeSessionModal',
  data() {
    return {
      title: '操作',
      visible: false,
      model: {
        periodDays: 2,
        startTime: '',
        endTime: ''
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      disabledDateResult: '',
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        startTime: ['startTime', { rules: [{ required: true, message: '请选择开始时间!' }] }],
        endTime: ['endTime', { rules: [{ required: true, message: '请选择结束时间!' }] }],
        periodDays: ['periodDays', { rules: [{ required: true, message: '请输入周期天数' }] }]
      },
      url: {
        add: '/marketing/marketingFreeSession/add',
        edit: '/marketing/marketingFreeSession/edit',
        lastExeTime: 'marketing/marketingFreeSession/lastExeTime' //获取场次开始的时间（1）
      }
    }
  },
  created() {
    getAction(this.url.lastExeTime).then(res => {
      this.disabledDateResult = res.result
    })
  },
  methods: {
    moment,
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment(this.disabledDateResult)
    },
    add() {
      this.edit({})
    },
    async periodDaysChange(value) {
      this.model.periodDays = value
      await this.$nextTick()
      this.endTimeResult()
    },
    async startTimeChange(fir, sec) {
      this.model.startTime = sec
      await this.$nextTick()
      this.endTimeResult()
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign(this.model, record)
      this.visible = true
      if (record.id) {
        this.title = '编辑'
      } else {
        this.title = '新增'
      }
      this.$nextTick(() => {
        this.setFieldsValue()
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.confirmLoading = false
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
          console.log('格式化')
          if (formData.startTime) formData.startTime = formData.startTime.format('YYYY-MM-DD')
          if (formData.endTime) formData.endTime = formData.endTime.format('YYYY-MM-DD')
          if (formData.freeDay) formData.freeDay = formData.freeDay.format('YYYY-MM-DD')
          formData.freeDaySetting = 0
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
    },
    dateAddDays(dataStr, dayCount) {
      var strdate = dataStr // 2017年03月01日，该日期增加dayCount天
      strdate = strdate.replace('-', '/')
      var isdate = new Date(strdate)
      isdate = new Date((isdate / 1000 + 86400 * dayCount) * 1000) // dayCount=1
      var year = isdate.getFullYear() // yyyy
      var month = isdate.getMonth() + 1 // M
      var day = isdate.getDate() // d
      if (month >= 1 && month <= 9) {
        // MM
        month = '0' + month
      }
      if (day >= 0 && day <= 9) {
        // dd
        day = '0' + day
      }

      var pdate = year + '-' + month + '-' + day // pdate=2017年03月02日
      return pdate
    },
    async endTimeResult() {
      if (this.model.startTime && this.model.periodDays) {
        this.model.endTime = this.dateAddDays(this.model.startTime, this.model.periodDays - 1)
        console.log(this.model)
        await this.$nextTick()
        this.setFieldsValue()
      }
    },
    setFieldsValue() {
      this.form.setFieldsValue(this.model)
      //时间格式化
      this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
      this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
      this.form.setFieldsValue({ freeDay: this.model.freeDay ? moment(this.model.freeDay) : null })
    }
  }
}
</script>

<style lang="less" scoped></style>
