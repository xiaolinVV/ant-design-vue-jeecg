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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="资金池类型">
          <a-select
            v-decorator="['capitalType', validatorRules.capitalType]"
            placeholder="请选择资金池类型"
            @change="capitalTypeChange"
          >
            <a-select-option value="">请选择</a-select-option>
            <a-select-option value="0">非称号</a-select-option>
            <a-select-option value="1">称号</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="资金池名称" v-if="capitalType == '0'">
          <a-input placeholder="请输入资金池名称" v-decorator="['capitalName', validatorRules.capitalName]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="资金池名称" v-else-if="capitalType == '1'">
          <a-select
            v-decorator="['marketingBusinessDesignationId', validatorRules.marketingBusinessDesignationId]"
            placeholder="请选择资金池名称"
            @change="marketingBusinessDesignationIdChange"
          >
            <a-select-option value="">请选择</a-select-option>
            <a-select-option :value="item.id" v-for="item in capitalNameList" :key="item.id">{{
              item.designationName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="资金池名称" v-else>
          请先设置资金池类型
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="进账比例">
          <a-input-number
            style="width:250px"
            :min="0"
            :precision="2"
            v-decorator="['makeProportion', validatorRules.makeProportion]"
            placeholder="请输入进账比例"
          />
          %
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="进账控制">
          <a-radio-group v-decorator="['sessionControl', validatorRules.sessionControl]" @change="sessionControlChange">
            <a-radio value="0">
              关闭
            </a-radio>
            <a-radio value="1">
              开启
            </a-radio>
          </a-radio-group>
          <a-checkbox-group v-model="model.weeks" :disabled="sessionControl != 1">
            <a-checkbox v-for="(item, key) in weeksList" :key="key" :value="item">{{ item }}</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="出账方式">
          <a-radio-group v-decorator="['paymentsModel', validatorRules.paymentsModel]">
            <a-radio value="0">
              无
            </a-radio>
            <a-radio value="1">
              每日分红（次日凌晨均分当日资金）
            </a-radio>
            <a-radio value="2">
              手动出账（不定期出账)
            </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="分红限额">
          <a-input-number
            style="width:250px;margin-right:10px"
            :min="0"
            :precision="2"
            v-decorator="['amountShare', validatorRules.amountShare]"
            placeholder="请输入分红限额"
            :disabled="!model.whetherDividend"
          />
          <a-checkbox v-model="model.whetherDividend" @change="whetherDividendChange"> </a-checkbox>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="复投金额">
          <a-input-number
            style="width:250px;margin-right:10px"
            :min="0"
            :precision="2"
            v-decorator="['investmentAmount', validatorRules.investmentAmount]"
            placeholder="请输入复投金额"
            :disabled="!model.whetherComplex"
          />
          <a-checkbox v-model="model.whetherComplex" @change="whetherComplexChange"> </a-checkbox>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import { getAction } from '../../../api/manage'
let defaultModel = {
  whetherDividend: false,
  weeks: [],
  whetherComplex: false
}
export default {
  name: 'MarketingBusinessCapitalModal',
  data() {
    return {
      title: '操作',
      visible: false,
      model: Object.assign({}, defaultModel),
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
        capitalType: {
          rules: [
            {
              required: true,
              message: '请输入资金池类型!'
            }
          ]
        },
        marketingBusinessDesignationId: {
          rules: [
            {
              required: true,
              message: '请选择资金池名称!'
            }
          ]
        },
        capitalName: {
          rules: [
            {
              required: true,
              message: '请输入资金池名称!'
            }
          ]
        },
        makeProportion: {
          rules: [
            {
              required: true,
              message: '请输入进账比例!'
            }
          ]
        },
        sessionControl: {
          rules: [
            {
              required: true,
              message: '请选择进账控制!'
            }
          ]
        },
        paymentsModel: {
          rules: [
            {
              required: true,
              message: '请选择出账方式!'
            }
          ]
        },
        amountShare: {
          rules: [
            {
              required: true,
              message: '请输入分红限额!'
            }
          ]
        },
        investmentAmount: {
          rules: [
            {
              required: true,
              message: '请输入复投金额!'
            }
          ]
        }
      },
      url: {
        add: '/marketingBusinessCapital/marketingBusinessCapital/add',
        edit: '/marketingBusinessCapital/marketingBusinessCapital/edit',
        findMarketingBusinessDesignationMaps:
          '/marketingBusinessDesignation/marketingBusinessDesignation/findMarketingBusinessDesignationMaps'
      },
      capitalNameList: [],
      weeksList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      //仅限交互使用
      capitalType: '',
      sessionControl: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getAction(this.url.findMarketingBusinessDesignationMaps).then(res => {
        if (res.success) {
          this.capitalNameList = res.result
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    marketingBusinessDesignationIdChange(e) {
      let capitalName = this.capitalNameList.filter(item => item.id == e)
      console.log(capitalName[0])
      this.form.setFieldsValue({ capitalName: capitalName[0].designationName })
    },
    whetherDividendChange(e) {
      let checked = e.target.checked
      this.$set(this.validatorRules.amountShare.rules[0], 'required', checked)
    },
    whetherComplexChange(e) {
      let checked = e.target.checked
      this.$set(this.validatorRules.investmentAmount.rules[0], 'required', checked)
    },
    sessionControlChange(e) {
      let value = e.target.value
      console.log(e.target.value)
      this.sessionControl = value
      if (value != 1) {
        this.weeks = []
      }
    },
    capitalTypeChange(e) {
      console.log(e)
      this.capitalType = e
      if (e != 1) {
        this.form.setFieldsValue({ marketingBusinessDesignationId: '' })
      }
    },
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      let model = Object.assign({}, record)
      if (model.weeks) {
        model.weeks = model.weeks.split(',')
      } else {
        model.weeks = []
      }
      model.whetherComplex = model.whetherComplex == 1 ? true : false
      model.whetherDividend = model.whetherDividend == 1 ? true : false
      this.capitalTypeChange(model.capitalType)
      this.sessionControlChange({ target: { value: model.sessionControl } })
      this.whetherDividendChange({ target: { checked: model.whetherDividend } })
      this.whetherComplexChange({ target: { checked: model.whetherComplex } })
      this.model = model
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'year',
            'month',
            'day',
            'delFlag',
            'capitalType',
            'capitalName',
            'marketingBusinessDesignationId',
            'makeProportion',
            'sessionControl',
            'weeks',
            'paymentsModel',
            'whetherDividend',
            'amountShare',
            'whetherComplex',
            'investmentAmount',
            'balance',
            'recordedAmount',
            'accountsAmount',
            'sessionControlExplain',
            'version'
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
          if (formData.weeks && formData.weeks.length > 0) {
            formData.weeks = formData.weeks.join(',')
          }
          formData.whetherComplex = formData.whetherComplex ? '1 ' : '0'
          formData.whetherDividend = formData.whetherDividend ? '1 ' : '0'
          formData.isView = formData.isView ? '1 ' : '0'
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
