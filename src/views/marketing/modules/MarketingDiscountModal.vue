<template>
  <a-card :bordered="false">
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
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
            <a-input-number
              :min="0"
              :precision="0"
              v-decorator="[
                'sort',
                {
                  rules: [{ required: true, message: '请输入排序默认为0' }]
                }
              ]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

    <!---->
    <a-modal> </a-modal>
  </a-card>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import AModal from 'ant-design-vue/es/modal/Modal'

export default {
  components: { AModal },
  name: 'MarketingDiscountModal',
  data() {
    return {
      title: '操作',
      visible: false,
      visiblChannelInfo: false,
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
      validatorRules: {},
      url: {
        add: '/marketingDiscount/marketingDiscount/add',
        // edit: '/marketingDiscount/marketingDiscount/edit'
        edit: 'marketingDiscount/marketingDiscount/updateById'
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
            'sort',
            'year',
            'month',
            'day',
            'delFlag',
            'name',
            'sysUserId',
            'isThreshold',
            'completely',
            'subtract',
            'vouchersWay',
            'disData',
            'monad',
            'shopTotal',
            'total',
            'userRestrict',
            'isGive',
            'isWarn',
            'warnDays',
            'isGetThe',
            'discountExplain',
            'releasedQuantity',
            'status',
            'stopExplain',
            'delExplain',
            'againGet',
            'isPlatform'
          )
        )
        //时间格式化
        this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
        this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
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
          //时间格式化
          formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null

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
