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
      <a-form :form="form" v-if="!isEditSort">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="专区名称">
          <a-input placeholder="请输入专区名称" v-decorator="validatorRules.zoneName" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="专区价格">
          <a-input-number
            style="width:250px"
            placeholder="请输入专区价格"
            :min="0"
            :precision="2"
            v-decorator="validatorRules.price"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="虚拟成团人数">
          <a-input-number
            style="width:250px"
            placeholder="请输入虚拟成团人数"
            :min="0"
            :precision="0"
            v-decorator="validatorRules.virtualGroupMembers"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="实际成团人数">
          <a-input-number
            style="width:250px"
            placeholder="请输入实际成团人数"
            :min="0"
            :precision="0"
            v-decorator="validatorRules.actualGroupSize"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="次数上限（次/日）">
          <a-input-number
            style="width:250px"
            placeholder="请输入次数上限（次/日）"
            :min="0"
            :precision="0"
            v-decorator="validatorRules.numberCaps"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="参团奖励">
          <a-input-number
            style="width:250px"
            placeholder="请输入参团奖励"
            :min="0"
            :precision="2"
            v-decorator="validatorRules.tuxedoReward"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="参团奖励类型">
          <a-select v-decorator="validatorRules.groupAwardType" placeholder="请选择参团奖励类型">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option :value="0">福利金</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="推荐奖励">
          <a-input-number
            style="width:250px"
            placeholder="请输入推荐奖励"
            :min="0"
            :precision="2"
            v-decorator="validatorRules.referralBonuses"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="推荐奖励类型">
          <a-select v-decorator="validatorRules.recommendedRewardTypes" placeholder="请选择推荐奖励类型">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option :value="0">福利金</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="转化阀值(单)">
          <a-input-number
            style="width:250px"
            placeholder="请输入转化阀值(单)"
            :min="0"
            :precision="0"
            v-decorator="validatorRules.transformationThreshold"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="可寄售（单）">
          <a-input-number
            style="width:250px"
            placeholder="请输入可寄售（单）"
            :min="0"
            :precision="0"
            v-decorator="validatorRules.canConsignment"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="默认发货（单）">
          <a-input-number
            style="width:250px"
            placeholder="请输入默认发货（单）"
            :min="0"
            :precision="0"
            v-decorator="validatorRules.defaultShipping"
          />
        </a-form-item>
      </a-form>

      <a-form :form="form" v-else>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input-number
            style="width:250px"
            placeholder="请输入排序"
            :min="0"
            :precision="0"
            v-decorator="validatorRules.sort"
          />
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
  name: 'MarketingZoneGroupModal',
  data() {
    return {
      title: '操作',
      visible: false,
      isEditSort: false,
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
        zoneName: ['zoneName', { rules: [{ required: true, message: '请输入专区名称' }] }],
        price: ['price', { rules: [{ required: true, message: '请输入专区价格' }] }],
        virtualGroupMembers: ['virtualGroupMembers', { rules: [{ required: true, message: '请输入虚拟成团人数' }] }],
        actualGroupSize: ['actualGroupSize', { rules: [{ required: true, message: '请输入实际成团人数' }] }],
        numberCaps: ['numberCaps', { rules: [{ required: true, message: '请输入次数上限（次/日）' }] }],
        tuxedoReward: ['tuxedoReward', { rules: [{ required: true, message: '请输入参团奖励' }] }],
        groupAwardType: ['groupAwardType', { rules: [{ required: true, message: '请选择参团奖励类型' }] }],
        referralBonuses: ['referralBonuses', { rules: [{ required: true, message: '请输入推荐奖励' }] }],
        recommendedRewardTypes: [
          'recommendedRewardTypes',
          { rules: [{ required: true, message: '请选择推荐奖励类型' }] }
        ],
        transformationThreshold: [
          'transformationThreshold',
          { rules: [{ required: true, message: '请输入转化阈值（单）' }] }
        ],
        canConsignment: ['canConsignment', { rules: [{ required: true, message: '请输入可寄售（单）' }] }],
        defaultShipping: ['defaultShipping', { rules: [{ required: true, message: '请输入默认发货（单）' }] }],
        sort: ['sort', { rules: [{ required: true, message: '请输入排序' }] }]
      },
      url: {
        add: '/marketingZoneGroup/marketingZoneGroup/add',
        edit: '/marketingZoneGroup/marketingZoneGroup/edit'
      }
    }
  },
  created() {},
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      if (record.id) {
        record.recommendedRewardTypes = record.recommendedRewardTypes * 1
        record.groupAwardType = record.groupAwardType * 1
        if (record.isEditSort) {
          this.isEditSort = true
        } else {
          this.isEditSort = false
        }
      } else {
        this.isEditSort = false
      }
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
            'zoneName',
            'price',
            'virtualGroupMembers',
            'actualGroupSize',
            'numberCaps',
            'tuxedoReward',
            'groupAwardType',
            'referralBonuses',
            'recommendedRewardTypes',
            'transformationThreshold',
            'canConsignment',
            'defaultShipping',
            'sort',
            'status',
            'statusExplain'
          )
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
          let method = 'post'
          if (!this.model.id) {
            httpurl += this.url.add
            // method = 'post'
          } else {
            httpurl += this.url.edit
            // method = 'put'
          }
          let formData = Object.assign(this.model, values)
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
