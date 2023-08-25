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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="选择会员">
          <a-select
            showSearch
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            :options="options"
            @search="handleSearch"
            placeholder="请选择会员"
            v-decorator="['memberListId', { rules: [{ required: true, message: '请选择会员' }] }]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="选择经销商类型">
          <a-select
            placeholder="请选择经销商类型"
            v-decorator="['franchiserType', { rules: [{ required: true, message: '请选择经销商类型' }] }]"
          >
            <a-select-option v-for="(item, index) in optionsSec" :key="index" :value="item.value">
              {{ item.title }}
            </a-select-option>
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
const optionsSec = [
  {
    title: '店铺专区进销商',
    value: 0
  },
  {
    title: '封坛经销商',
    value: 1
  },
  {
    title: '产品批发经销商',
    value: 2
  }
]
export default {
  name: 'StoreFranchiserModal',
  data() {
    return {
      title: '操作',
      visible: false,
      optionsSec,
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
        add: '/store/storeFranchiser/add',
        edit: '/store/storeFranchiser/edit',
        likeMemberByPhone: 'memberList/memberList/likeMemberByPhone',
        queryById: 'memberList/memberList/queryById'
      },
      storeId: '',
      options: []
    }
  },
  created() {},
  methods: {
    handleSearch(value) {
      console.log(value)
      getAction(this.url.likeMemberByPhone, { phone: value }).then(res => {
        this.options = []
        let pushData = []
        for (let m of res) {
          pushData.push({ value: m.id, label: m.NAME })
        }
        this.options = pushData
        console.log(this.options)
      })
    },
    add(param) {
      console.log(param)
      this.storeId = param.storeId
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      if (this.model.id) {
        this.storeId = ''
        if (this.model.memberListId) {
          getAction(this.url.queryById, { id: this.model.memberListId }).then(res => {
            this.handleSearch(res.result.phone)
          })
        }
      }
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'memberListId'))
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
            httpurl += this.url.edit
            method = 'put'
          }
          let formData = Object.assign(this.model, values)
          if (this.storeId) {
            formData.storeManageId = this.storeId
          }
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
