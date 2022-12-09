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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="活动价" v-if="model.openType == 2">
          <a-input-number v-decorator="validatorRules.activityPrice" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序" v-else>
          <a-input-number v-decorator="validatorRules.sort" />
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
  name: 'MarketingCertificateGroupListModal',
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
        activityPrice: ['activityPrice', { rules: [{ required: true, message: '请输入活动价' }] }],
        sort: ['sort', { rules: [{ required: true, message: '请输入排序' }] }]
      },
      url: {
        add: '/marketingCertificateGroupList/marketingCertificateGroupList/add',
        edit: '/marketingCertificateGroupList/marketingCertificateGroupList/edit'
      }
    }
  },
  created() {},
  methods: {
    add() {
      this.edit({})
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
            'activityNumber',
            'marketingCertificateId',
            'discountActivity',
            'activityPrice',
            'numberClusters',
            'sort',
            'status',
            'statusExplain'
          )
        )
        //时间格式化
        this.form.setFieldsValue({ joinDate: this.model.joinDate ? moment(this.model.joinDate) : null })
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
            method = 'post'
          }
          let formData = Object.assign(this.model, values)
          formData.discountActivity =
            formData.activityPrice / formData.price ? (formData.activityPrice / formData.price).toFixed(4) * 100 : 0
          //时间格式化
          // formData.joinDate = formData.joinDate ? formData.joinDate.format('YYYY-MM-DD HH:mm:ss') : null
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
