<template>
  <div>
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
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="店铺管理id">
            <a-input placeholder="请输入店铺管理id" v-decorator="['storeManageId', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="单号">
            <a-input placeholder="请输入单号" v-decorator="['orderNo', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号">
            <a-input placeholder="请输入手机号" v-decorator="['phone', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="提现金额">
            <a-input-number v-decorator="['money', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="提现类型；0：微信；1：支付宝">
            <a-input placeholder="请输入提现类型；0：微信；1：支付宝" v-decorator="['withdrawalType', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手续费">
            <a-input-number v-decorator="['serviceCharge', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="实际金额">
            <a-input-number v-decorator="['amount', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="申请时间">
            <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['timeApplication', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="状态；0：待审核；1：待打款；2：已付款；3：无效"
          >
            <a-input placeholder="请输入状态；0：待审核；1：待打款；2：已付款；3：无效" v-decorator="['status', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="打款时间">
            <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['payTime', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
            <a-input placeholder="请输入备注" v-decorator="['remark', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="无效原因">
            <a-input placeholder="请输入无效原因" v-decorator="['closeExplain', {}]" />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

    <!--审批弹窗-->
    <div>
      <a-modal title="审批" v-model="visibleAudi" @ok="hideAudiModal()" okText="确认" cancelText="取消">
        <input style="display: none" :value="MemberWithdrawDepositId" placeholder="id" />

        <div style="margin-bottom: 20px">
          <span style="margin-right: 20px">审批</span>
          <a-radio-group @change="onChange" v-model="auditData.status">
            <a-radio :value="1">通过</a-radio>
            <a-radio :value="3">不通过</a-radio>
          </a-radio-group>
        </div>
        <a v-if="showPrise">
          <a-textarea
            placeholder="请输入审核不通过说明"
            v-model="auditData.closeExplain"
            :autosize="{ minRows: 5, maxRows: 6 }"
          />
        </a>
      </a-modal>
      <br />
      <br />
    </div>
    <!--打款弹窗-->
    <div>
      <a-modal title="打款确认" v-model="visibleEemit" @ok="hideEemitModal()" okText="确认" cancelText="取消">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="实际金额">
            ￥{{ model.amount }}
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="分账账户支出">
            <div style="display:flex;align-items:center">
              <a-input-number
                v-model="remitData.money"
                :min="0"
                :precision="2"
                :max="remitDataMoney"
                style="margin-right:10px"
              />
              <div>账户余额￥{{ userBalance }}</div>
            </div>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="线下转账金额">
            ￥{{ model.amount >= remitData.money ? model.amount - remitData.money : 0.0 }}
          </a-form-item>
          <a-textarea placeholder="请输入打款备注" v-model="remitData.remark" :autosize="{ minRows: 5, maxRows: 6 }" />
        </a-form>

        <!-- <div style="margin-bottom: 20px">
          <span style="margin-right: 20px">状态</span>
          <a-radio-group @change="onChangeEemit" v-model="remitData.status">
            <a-radio :value="1">待打款</a-radio>
            <a-radio :value="2">已打款</a-radio>
          </a-radio-group>
        </div>
        <a v-if="showEemit">
          <a-textarea placeholder="请输入打款备注" v-model="remitData.remark" :autosize="{ minRows: 5, maxRows: 6 }" />
        </a> -->
      </a-modal>
      <br />
      <br />
    </div>
  </div>
</template>

<script>
import { httpAction, getAction, postAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'

export default {
  inject: ['rush'],
  name: 'StoreWithdrawDepositModal',
  data() {
    return {
      title: '操作',
      visible: false,
      /**审核数据*/
      auditData: {
        status: '',
        closeExplain: ''
      },
      //打款数据
      remitData: {
        status: '',
        remark: '',
        money: ''
      },
      //账户余额
      userBalance: 0.0,
      visibleAudi: false,
      showPrise: false,
      MemberWithdrawDepositId: '',
      orderNo: '',
      storeManageId: '',
      /**打款弹窗*/
      visibleEemit: false,
      showEemit: false,

      /**end打款弹窗*/
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
        add: '/storeWithdrawDeposit/storeWithdrawDeposit/add',
        edit: '/storeWithdrawDeposit/storeWithdrawDeposit/edit',
        updateAuditStatus: '/storeWithdrawDeposit/storeWithdrawDeposit/updateAuditStatus', //弃用
        updateStatusRemit: '/storeWithdrawDeposit/storeWithdrawDeposit/updateStatusRemit', //弃用
        audit: '/storeWithdrawDeposit/storeWithdrawDeposit/audit', //审批
        remit: '/storeWithdrawDeposit/storeWithdrawDeposit/remit' //汇款
      }
    }
  },
  created() {},
  computed: {
    remitDataMoney({ model, userBalance }) {
      return Math.min(model.amount, userBalance)
    }
  },
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
            'storeManageId',
            'orderNo',
            'phone',
            'money',
            'withdrawalType',
            'serviceCharge',
            'amount',
            'status',
            'remark',
            'closeExplain'
          )
        )
        //时间格式化
        this.form.setFieldsValue({
          timeApplication: this.model.timeApplication ? moment(this.model.timeApplication) : null
        })
        this.form.setFieldsValue({ payTime: this.model.payTime ? moment(this.model.payTime) : null })
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
          //时间格式化
          formData.timeApplication = formData.timeApplication
            ? formData.timeApplication.format('YYYY-MM-DD HH:mm:ss')
            : null
          formData.payTime = formData.payTime ? formData.payTime.format('YYYY-MM-DD HH:mm:ss') : null

          console.log(formData)
          httpAction(httpurl, formData, method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.rush()
                /*that.$emit('ok');*/
              } else {
                that.$message.success(res.message)
                that.rush()
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
    //审核弹窗
    showAudiModal(id, orderNo, storeManageId) {
      this.MemberWithdrawDepositId = id
      this.orderNo = orderNo
      this.visibleAudi = true
      this.auditData.closeExplain = ''
      this.storeManageId = storeManageId
    },
    //审核确认弹窗
    hideAudiModal() {
      this.visibleAudi = false
      var that = this
      postAction(that.url.audit, {
        id: that.MemberWithdrawDepositId,
        closeExplain: that.auditData.closeExplain,
        status: that.auditData.status,
        orderNo: that.orderNo,
        storeManageId: that.storeManageId
      }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.rush()
        } else {
          that.$message.error(res.message)
        }
      })
    },
    onChange(e) {
      if (e.target.value == 1) {
        this.showPrise = false
        this.auditData.closeExplain = ''
      } else {
        this.showPrise = true
      }
    },
    /**打款弹窗*/
    showEemitModal(id, orderNo, storeManageId, model) {
      this.model = Object.assign({}, this.model, model)
      this.MemberWithdrawDepositId = id
      this.orderNo = orderNo
      this.visibleEemit = true
      this.remitData.remark = ''
      this.storeManageId = storeManageId
    },
    hideEemitModal() {
      this.visibleEemit = false
      var that = this
      postAction(that.url.remit, {
        id: that.MemberWithdrawDepositId,
        remark: that.remitData.remark,
        status: 2,
        orderNo: that.orderNo,
        storeManageId: that.storeManageId
      }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.rush()
        } else {
          that.$message.error(res.message)
        }
      })
    },
    onChangeEemit(e) {
      if (e.target.value == 1) {
        this.showEemit = false
        this.remitData.remark = ''
      } else {
        this.showEemit = true
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
