<template>
  <div>
    <a-modal
      :title="title"
      :width="800"
      v-model="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="创建年">
            <a-input-number v-decorator="['year', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="创建月">
            <a-input-number v-decorator="['month', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="创建日">
            <a-input-number v-decorator="['day', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="删除状态（0，正常，1已删除）">
            <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-decorator="['delFlag', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开户行名称">
            <a-input placeholder="请输入开户行名称" v-decorator="['bankName', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="银行卡号（支付宝账号）">
            <a-input placeholder="请输入银行卡号（支付宝账号）" v-decorator="['bankCard', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="持卡人（真实姓名）">
            <a-input placeholder="请输入持卡人（真实姓名）" v-decorator="['cardholder', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="代理id">
            <a-input placeholder="请输入代理id" v-decorator="['sysUserId', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="卡类型；0：银行卡；1：支付宝">
            <a-input placeholder="请输入卡类型；0：银行卡；1：支付宝" v-decorator="['carType', {}]" />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <a-modal
      :title="title1"
      v-model="bankCardvisible"
      @ok="bankCardEdit()"
      @cancel="handleCancel"
      cancelText="关闭"
      :width="800"
    >
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系人手机号">
          <a-input
            placeholder="请输入联系人手机号"
            :disabled="inputDisabled"
            v-decorator="['phone', validatorRules.phone]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="验证码">
          <a-input placeholder="请输入验证码" v-decorator="['sbCode', validatorRules.sbCode]" />
          <a-button @click="getCode" :disabled="countDown != '60'">
            获取验证码
            <span style="margin-left: 5px" v-if="countDown != '60'"> ({{ countDown }}) </span>
          </a-button>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="收款人">
          <a-input placeholder="请输入收款人" v-decorator="['cardholder', validatorRules.cardholder]" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证号">
          <a-input placeholder="请输入身份证号" v-decorator="['identityNumber', validatorRules.identityNumber]" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="银行">
          <a-select placeholder="请选择银行" style="width: 120px" v-decorator="['bankName', validatorRules.bankName]">
            <a-select-option v-for="(item, index) in bankList" :key="index" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
          <!-- <a-input placeholder="请选择银行"  /> -->
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="银行卡号">
          <a-input placeholder="请输入银行卡号" v-decorator="['bankCard', validatorRules.bankCard]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开户行分支行">
          <a-input placeholder="请输入开户行分支行" v-decorator="['openingBank', validatorRules.openingBank]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开户行所在城市">
          <a-cascader
            :options="bankCitys"
            v-decorator="['citysCode', validatorRules.citysCode]"
            placeholder="请选择开户行所在城市"
            @change="citysCodeChange"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal :title="title2" v-model="alipayvisible" @ok="bankCardEdit()" @cancel="handleCancel" cancelText="关闭">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="支付宝账号">
          <a-input placeholder="请输入支付宝账号" v-model="Forminfo.bankCard" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="真实姓名">
          <a-input placeholder="请输入真实姓名" v-model="Forminfo.cardholder" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号">
          <a-input placeholder="请输入手机号" v-model="Forminfo.phone" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="验证码">
          <a-input placeholder="请输入验证码" v-model="Forminfo.sbCode" />
          <a-button @click="getCode" :disabled="countDown != '60'" :loading="qrCodeLoading">
            获取验证码
            <span style="margin-left: 5px" v-if="countDown != '60'"> ({{ countDown }}) </span>
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { httpAction, getAction, postAction } from '@/api/manage'

import pick from 'lodash.pick'
import moment from 'moment'
import dayjs from 'dayjs'
import AModal from 'ant-design-vue/es/modal/Modal'
export default {
  components: { AModal },
  name: 'AgencyBankCardModal',
  inject: ['rush'],
  data() {
    return {
      title: '操作',
      title1: '提现到银行卡',
      title2: '提现到支付宝',
      visible: false,
      bankCardvisible: false,
      alipayvisible: false,
      qrCodeLoading: false,
      Forminfo: {
        id: '',
        bankName: '',
        bankCard: '',
        cardholder: '',
        carType: '',
        phone: '',
        identityNumber: '',
        sbCode: '',
        delFlag: '0',
        citys: '',
        citysCode: ''
      },
      timer: '', //定时器
      countDown: 60, //倒计时
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
        bankName: { rules: [{ required: true, message: '请选择银行!' }] },
        bankCard: { rules: [{ required: true, message: '请输入银行卡号!' }] },
        cardholder: { rules: [{ required: true, message: '请输入收款人!' }] },
        phone: { rules: [{ required: true, message: '请输入手机号!' }] },
        sbCode: { rules: [{ required: true, message: '请输入验证码!' }] },
        identityNumber: { rules: [{ required: true, message: '请输入身份证号' }] },
        openingBank: { rules: [{ required: false, message: '请输入开户行分支行' }] },
        citysCode: { rules: [{ required: true, message: '请选择开户行所在城市' }] }
      },
      url: {
        add: '/agencyBankCard/agencyBankCard/add',
        edit: '/agencyBankCard/agencyBankCard/edit',
        verificationCode: '/storeBankCard/storeBankCard/bankCardByPhone', //获取验证码
        agencyBankCardAudit: '/agencyBankCard/agencyBankCard/agencyBankCardAudit' //设置银行卡
      }
    }
  },
  created() {},
  computed: {
    bankList() {
      return JSON.parse(localStorage.getItem('blankList')).bankNameList
    },
    bankCitys() {
      return JSON.parse(localStorage.getItem('bankBindCitysCode'))
    },
    inputDisabled({ Forminfo }) {
      return Forminfo.id ? true : false
    }
  },
  methods: {
    citysCodeChange(value, options) {
      let citys = []
      options.map(item => {
        citys.push(item.label)
      })
      this.Forminfo.citys = citys.join(',')
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
          pick(
            this.model,
            'year',
            'month',
            'day',
            'delFlag',
            'bankName',
            'bankCard',
            'cardholder',
            'sysUserId',
            'carType'
          )
        )
        //时间格式化
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.bankCardvisible = false
      this.alipayvisible = false
      this.alipayvisible = false
    },
    async cityAllDataLoad(defaultCity) {
      if (defaultCity && defaultCity.length > 0) {
        if (defaultCity.length == 1 || defaultCity.length == 2) {
          this.Forminfo.sysAreaId = defaultCity.join(',') + ','
        } else {
          this.Forminfo.sysAreaId = defaultCity.join(',')
        }
      } else {
        try {
          this.Forminfo.sysAreaId = ''
        } catch (e) {}
      }
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
    },

    close(success = false) {
      // if (!success) {
      //   this.Forminfo.phone = ''
      //   this.Forminfo.sbCode = ''
      // }
      this.$emit('close')
      this.visible = false
    },
    //获取验证码
    getCode() {
      let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      let phone = this.form.getFieldsValue(['phone']).phone
      console.log(phone)
      if (!myreg.test(phone)) {
        this.$message.warn('手机号码格式不正确！')
        return
      }
      this.qrCodeLoading = true
      getAction(this.url.verificationCode, { phone: phone }).then(res => {
        this.qrCodeLoading = false
        if (res.success) {
          this.$message.success(res.message)
          this.countDown--
          this.timer = setInterval(() => {
            if (this.countDown <= 0) {
              this.countDown = 60
              clearInterval(this.timer)
              return
            }
            this.countDown--
          }, 1000)
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    //银行卡弹窗
    showBankCard(record) {
      this.bankCardvisible = true
      this.Forminfo = Object.assign({}, this.Forminfo, record)
      this.Forminfo.carType = '0'
      try {
        this.Forminfo.citysCode = this.Forminfo.citysCode ? this.Forminfo.citysCode.split(',') : []
      } catch (error) {
        console.warning('解析地址出错citysCode！', error)
      }

      this.$nextTick(() => {
        this.form.setFieldsValue(this.Forminfo)
      })
    },
    bankCardEdit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData = Object.assign({}, this.Forminfo, values)
          formData.citysCode = formData.citysCode && formData.citysCode.length > 0 ? formData.citysCode.join(',') : ''
          console.log(formData)
          // return
          this.$nextTick(() => {
            postAction(this.url.agencyBankCardAudit, formData).then(res => {
              if (res.success || res.result) {
                this.$message.success(res.message)
                this.rush()
              } else {
                this.$message.warn(res.message)
              }
            })
          })
        }
      })
    },
    //支付宝弹窗
    showAlipay(record) {
      this.alipayvisible = true
      this.Forminfo = Object.assign({}, this.Forminfo, record)
      this.Forminfo.carType = '1'
      this.Forminfo.bankName = '支付宝'
    }
  }
}
</script>

<style lang="less" scoped></style>
