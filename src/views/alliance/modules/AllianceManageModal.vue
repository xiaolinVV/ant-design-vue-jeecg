<template>
  <div>
    <a-modal
      :title="title"
      :width="1000"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      ok-text="保存"
      cancel-text="取消"
    >
      <a-spin :spinning="confirmLoading">
        <!--      新增 编辑-->
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户账号">
            {{ model.username }}
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号">
            {{ model.phone }}
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="公司名称">
            <a-input placeholder="请输入名称" v-decorator="['name', validatorRules.name]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户名字">
            {{ model.realname }}
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="{
              xs: { span: 24 },
              sm: { span: 19 }
            }"
            label="利润分配"
          >
            <a-radio-group
              name="radioGroup"
              v-decorator="['profitType', validatorRules.profitType]"
              @change="profitTypeChange"
            >
              <a-radio :value="0">
                独享
              </a-radio>
              <a-radio :value="1">
                共享
              </a-radio>
            </a-radio-group>
            <div>
              <div>
                共享：店铺产生的分润将分配给代理，请注意分配比例
              </div>
              <div>
                独享：店铺产生的分润将不分配给代理；
              </div>
            </div>
            <div v-if="showSecondLevel">
              <a-radio-group v-model="model.mutualAdvantages" @change="showSelectAddressChange">
                <a-radio :value="0">
                  与交易区域县级代理共享
                </a-radio>
                <a-radio :value="1">
                  与指定区域县级代理共享
                </a-radio>
              </a-radio-group>
              <div style="display: flex;align-items: center;">
                <selectAddress
                  ref="selectAddress"
                  :info="model"
                  v-if="showSelectAddress && visible"
                  style="margin: 0 10px;"
                >
                </selectAddress>
                加盟商比例
                <a-input-number :min="0" :precision="2" v-model="model.franchiseeRatio" style="margin: 0 10px;">
                </a-input-number
                >%, 县级代理比例
                <a-input-number :min="0" :precision="2" v-model="model.agencyRatio" style="margin: 0 10px;">
                </a-input-number
                >%
              </div>
              <div>
                省代市代按照原有比例分成
              </div>
            </div>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="订单佣金比例">
            <a-input-number
              :min="numberMin"
              v-decorator="['orderCommissionRate', validatorRules.orderCommissionRate]"
            />
            %
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="礼包佣金比例">
            <a-input-number :min="numberMin" v-decorator="['giftCommissionRate', validatorRules.giftCommissionRate]" />
            %
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开店佣金比例">
            <a-input-number
              :min="numberMin"
              v-decorator="['storeCommissionRate', validatorRules.storeCommissionRate]"
            />
            %
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="福利金销售奖励">
            <a-input-number
              :min="numberMin"
              v-decorator="['welfareCommissionRate', validatorRules.welfareCommissionRate]"
            />
            %
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="推荐供应商销售奖励">
            <a-input-number
              :min="numberMin"
              v-decorator="['supplierSalesCommissionRate', validatorRules.supplierSalesCommissionRate]"
            />
            %
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="兑换券销售奖励">
            <a-input-number
              :min="numberMin"
              v-decorator="['cashCouponSalesIncentives', validatorRules.cashCouponSalesIncentives]"
            />
            %
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="加盟时间">
            <a-range-picker
              style="width: 100%"
              v-decorator="['startEndTime', validatorRules.startEndTime]"
              :format="dateFormat"
              :placeholder="['开始时间', '结束时间']"
            />
            <!--            @change="onDateChangeStart"-->
            <!--            @ok="onDateOk"-->
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注说明">
            <a-textarea
              placeholder="请输入备注说明"
              v-decorator="['remark', validatorRules.remark]"
              :autosize="{ minRows: 3, maxRows: 6 }"
            />
            <!--            @change="onDateChangeStart"-->
            <!--            @ok="onDateOk"-->
          </a-form-item>
        </a-form>
        <!--      停用-->
      </a-spin>
    </a-modal>
    <a-modal title="停用" v-model="visibleStopStatus" @ok="hideModalStopStatus()" okText="确认" cancelText="取消">
      <i style="color: #faad14;font-size: 22px;margin-right: 16px;float: left;">
        <svg
          viewBox="64 64 896 896"
          data-icon="question-circle"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
          class=""
        >
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
          ></path>
          <path
            d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0 1 30.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"
          ></path>
        </svg>
      </i>
      <h3>停用用户后，用户将无法登录、无法提现</h3>
      <p>您确定要停用吗？</p>
      <a-textarea placeholder="请输入停用说明" v-model="closeExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
    </a-modal>
  </div>
</template>

<script>
import { httpAction, getAction, putAction } from '@/api/manage'
import selectAddress from '@/components/selectAddress/selectAddress'
import pick from 'lodash.pick'
import moment from 'moment'

export default {
  name: 'AllianceManageModal',
  components: {
    selectAddress
  },
  data() {
    return {
      title: '操作',
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      numberMin: 0,
      visible: false,
      visibleStopStatus: false,
      model: {
        mutualAdvantages: 0,
        franchiseeRatio: 0,
        agencyRatio: 0
      },
      // startEndTime:['',''],
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
      showSecondLevel: false,
      showSelectAddress: false,
      validatorRules: {
        name: { rules: [{ required: true, message: '请输入名称!' }] },
        profitType: { rules: [{ required: true, message: '请选择利润分配!' }] },
        orderCommissionRate: { rules: [{ required: true, message: '请输入订单佣金比例!' }] },
        giftCommissionRate: { rules: [{ required: true, message: '请输入礼包佣金比例!' }] },
        storeCommissionRate: { rules: [{ required: true, message: '请输入开店佣金比例!' }] },
        welfareCommissionRate: { rules: [{ required: true, message: '请输入福利金销售奖励!' }] },
        supplierSalesCommissionRate: { rules: [{ required: true, message: '请输入推荐供应商销售奖励!' }] },
        cashCouponSalesIncentives: { rules: [{ required: true, message: '请输入兑换券销售奖励!' }] },
        startEndTime: { rules: [{ required: true, message: '请选择加盟时间!' }] },
        remark: { rules: [{ required: false, message: '请输入备注说明!' }] }
      },
      closeExplain: '',
      url: {
        add: '/allianceManage/allianceManage/add',
        edit: '/allianceManage/allianceManage/edit'
      }
    }
  },
  created() {},
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.confirmLoading = true
      record.startEndTime = null
      record.mutualAdvantages = record.mutualAdvantages * 1
      if (record.profitType) record.profitType = record.profitType * 1
      if (record.startTime) {
        record.startEndTime = [moment(record.startTime, this.dateFormat), '']
      }
      if (record.endTime && record.startTime) {
        record.startEndTime[1] = moment(record.endTime, this.dateFormat)
      } else if (record.endTime && !record.startTime) {
        record.startEndTime = ['', moment(record.endTime, this.dateFormat)]
      }
      this.profitTypeChange({
        target: {
          value:
            record.profitType === undefined || record.profitType === null ? this.model.profitType : record.profitType
        }
      })
      this.showSelectAddressChange({
        target: {
          value: record.mutualAdvantages || this.model.mutualAdvantages
        }
      })
      this.model = Object.assign({}, this.model, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.resetFields()
        setTimeout(() => {
          this.form.setFieldsValue(this.model)
          this.confirmLoading = false
          //时间格式化
          // this.form.setFieldsValue({startTime: this.model.startTime ? moment(this.model.startTime) : null })
          // this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
        }, 1000)
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      let selectAddressId = this.$refs.selectAddress && this.$refs.selectAddress.defaultCity
      if (selectAddressId && (selectAddressId.length <= 2 || !selectAddressId[0])) {
        this.$message.warn('请选择省市县代城市并选择完整！')
        return
      }
      // 触发表单验证
      this.form.validateFields((err, values) => {
        console.log(err)
        // return;
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
          formData.startTime = formData.startEndTime[0] ? formData.startEndTime[0].format(this.dateFormat) : null
          formData.endTime = formData.startEndTime[1] ? formData.startEndTime[1].format(this.dateFormat) : null
          delete formData.startEndTime
          if (selectAddressId) {
            try {
              formData.provinceId = selectAddressId[0]
              formData.cityId = selectAddressId[1]
              formData.countyId = selectAddressId[2]
            } catch (e) {
              console.warn('省市县代理赋值提交时出错！！！')
            }
          }
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
    //停用
    hideModalStopStatus() {
      let that = this
      this.visibleStopStatus = false
      putAction(that.url.edit, { id: this.model.id, closeExplain: this.closeExplain, status: '0' }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.$emit('ok') //发送父级主键刷新
        } else {
          that.$message.success('修改失败')
        }
      })
    },
    showModalStopStatus(record) {
      this.visibleStopStatus = true
      this.model = Object.assign({}, this.model, record)
    },
    profitTypeChange(e) {
      let value = e.target.value
      console.log('profitTypeChange', value)
      if (value == 1) {
        this.showSecondLevel = true
      } else {
        this.showSecondLevel = false
      }
    },
    showSelectAddressChange(e) {
      let value = e.target.value
      if (value == 1) {
        this.showSelectAddress = true
      } else {
        this.showSelectAddress = false
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
