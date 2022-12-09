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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="当前等级">
          {{ model.levelName }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设置等级">
          <a-select v-decorator="validatorRules.levelName" placeholder="请选择分销等级">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option v-for="(item, index) in levelNameList" :key="index" :value="item.levelName">{{
              item.levelName
            }}</a-select-option>
          </a-select>
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
  name: 'MemberDistributionLevelModal',
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      levelNameList: [],
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
        levelName: ['levelName', { rules: [{ required: true, message: '请选择分销等级' }] }]
      },
      url: {
        // add: '/member/memberDistributionLevel/add',
        // edit: '/member/memberDistributionLevel/edit',
        settingLevel: 'member/memberDistributionLevel/settingLevel',
        //获取分销级别列表（1）
        getMarketingDistributionLevelList: 'member/memberDistributionLevel/getMarketingDistributionLevelList'
      }
    }
  },
  created() {
    this.getlevelNameList()
  },
  methods: {
    getlevelNameList() {
      getAction(this.url.getMarketingDistributionLevelList).then(res => {
        this.levelNameList = res.result
      })
    },
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(this.model)
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
          let httpurl = this.url.settingLevel
          // let method = 'get'
          // if (!this.model.id) {
          //   httpurl += this.url.add
          //   method = 'post'
          // } else {
          //   httpurl += this.url.edit
          //   method = 'put'
          // }
          let formData = Object.assign(this.model, values)
          //时间格式化

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
