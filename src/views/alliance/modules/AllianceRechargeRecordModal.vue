<template>
  <div>
    <a-modal
      :title="title"
      :width="800"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭">

      <a-spin :spinning="confirmLoading">
        <a-form :form="form">

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="创建年">
            <a-input-number v-decorator="[ 'year', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="创建月">
            <a-input-number v-decorator="[ 'month', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="创建日">
            <a-input-number v-decorator="[ 'day', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="删除状态（0，正常，1已删除）">
            <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-decorator="['delFlag', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="加盟商id">
            <a-input placeholder="请输入加盟商id" v-decorator="['sysUserId', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="交易类型：0：订单交易；1：财务结算；2：订单退款；3：开店奖励；4：礼包分成；5：福利金销售奖励；6：兑换券销售奖励；7：推荐供应商销售奖励；做成数据字典agency_deal_type">
            <a-input
              placeholder="请输入交易类型：0：订单交易；1：财务结算；2：订单退款；3：开店奖励；4：礼包分成；5：福利金销售奖励；6：兑换券销售奖励；7：推荐供应商销售奖励；做成数据字典agency_deal_type"
              v-decorator="['payType', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="支付和收入；0：收入；1：支出">
            <a-input placeholder="请输入支付和收入；0：收入；1：支出" v-decorator="['goAndCome', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="交易金额">
            <a-input-number v-decorator="[ 'amount', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="单号">
            <a-input placeholder="请输入单号" v-decorator="['orderNo', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="交易状态：0：未支付；1：进行中；2：待结算：3：待打款；4：待退款；5：交易完成；6：已退款；7：交易关闭；数据字典：trade_status">
            <a-input placeholder="请输入交易状态：0：未支付；1：进行中；2：待结算：3：待打款；4：待退款；5：交易完成；6：已退款；7：交易关闭；数据字典：trade_status"
                     v-decorator="['tradeStatus', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="支付方式；0:微信支付；1：支付宝支付">
            <a-input placeholder="请输入支付方式；0:微信支付；1：支付宝支付" v-decorator="['payment', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="交易单号">
            <a-input placeholder="请输入交易单号" v-decorator="['tradeNo', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="交易类型；0：订单；1：礼包；2：兑换券">
            <a-input placeholder="请输入交易类型；0：订单；1：礼包；2：兑换券" v-decorator="['tradeType', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="银行卡号(支付宝账号)">
            <a-input placeholder="请输入银行卡号(支付宝账号)" v-decorator="['bankCard', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="开户行名称">
            <a-input placeholder="请输入开户行名称" v-decorator="['bankName', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="持卡人姓名(真实姓名)">
            <a-input placeholder="请输入持卡人姓名(真实姓名)" v-decorator="['cardholder', {}]"/>
          </a-form-item>

        </a-form>
      </a-spin>
    </a-modal>
    <!--提现弹窗-->
    <a-modal title="提现" :width="700" v-model="visiblWithdrawDepositInformation"
             @ok="showWithdrawDeposit()" okText="确认" cancelText="取消" @cancel="closeWithDrawDeposit">
      <div>
        <a-form :form="form">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="可提现余额">
            <span v-if="balance">{{ balance }}元</span>
            <span v-else>0元</span>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="提现金额">
            <a-input placeholder="请输入" v-decorator="[ 'amount',validatorRules.money]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="提现到">
            <a-select style="width: 100%" v-decorator="[ 'sbcName', { rules: [{ required: true, message: '请选择' }] }]"
                      placeholder="请选择" @change="cashWithdrawalSelect"
                      labelInValue>
              <a-select-option v-for="(item,index) in cashWithdrawalOptionsSelect" :value="item.value"
                               :title="item.title">{{item.title}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="备注说明">
            <a-textarea
              placeholder="备注说明"
              v-decorator="[ 'remark', {}]"
              :autosize="{ minRows: 5, maxRows: 6 }"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import {httpAction,getAction,postAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  export default {

    name: "AllianceRechargeRecordModal",
    inject:['rush'],
    data () {
      return {
        title: "操作",
        visible: false,
        //**提现*/
        visiblWithdrawDepositInformation:false,
        balance:"",//余额
        sysUserId:"",//代理userId
        remark:"",//备注说明
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
//提现到  下拉框
        cashWithdrawalOptionsSelect: [{
          title: '请选择',
          value: ''
        }],
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          //规格表单验证
          money: {
            rules: [{
              required: true,
              pattern: (/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/),
              message: '最多只能输入两位小数的数字'
            }]
          },
          moneyCZ: {
            rules: [{
              required: true,
              pattern: (/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/),
              message: '最多只能输入两位小数的数字'
            }]
          },
        },
        url: {
          add: "/allianceRechargeRecord/allianceRechargeRecord/add",
          edit: "/allianceRechargeRecord/allianceRechargeRecord/edit",
          findBankCardById:"/allianceBankCard/allianceBankCard/findBankCardById",//提现银行卡信息
          cashOut:"/allianceSettleAccounts/allianceSettleAccounts/cashOut",//提现
        },
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'year', 'month', 'day', 'delFlag', 'sysUserId', 'payType', 'goAndCome', 'amount', 'orderNo', 'tradeStatus', 'payment', 'tradeNo', 'tradeType', 'bankCard', 'bankName', 'cardholder'))
          //时间格式化
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if (!this.model.id) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化

            console.log(formData)
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })


          }
        })
      },
      handleCancel () {
        this.close()
      },
      /**提现*/
      withdrawDeposit(sysUserId,balance){
        this.balance = balance;
        this.sysUserId = sysUserId;
        this.visiblWithdrawDepositInformation = true;
        getAction(this.url.findBankCardById, {sysUserId}).then(res => {
          console.log(res)
          if (res.length > 0) {
            for (let item of res) {
              this.cashWithdrawalOptionsSelect.push({
                title: item.sbcName,
                value: item.allianceBankCardId
              })
            }
          }
        })
      },
      /**提现提交*/
      showWithdrawDeposit() {
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            values.sysUserId = this.sysUserId
            values.allianceBankCardId = values.sbcName.key
            values.sbcName = values.sbcName.label
            values.carType = values.carType
            values.balance = this.balance
            let formData = Object.assign(this.model, values)
            postAction(this.url.cashOut, formData).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
              } else {
                this.$message.warn(res.message)
              }
            }).finally(() => {
              this.rush()
              this.visiblRechargeInformation = false
              this.closeWithDrawDeposit();
              this.sysUserId = ''
              this.balance = '' //余额
            })
          }
        })
      },
      closeWithDrawDeposit(){
        console.log('执行了')
        this.visiblWithdrawDepositInformation = false
        this.cashWithdrawalOptionsSelect = [{
          title: '请选择',
          value: ''
        }]
      },
    }
  }
</script>

<style lang="less" scoped>

</style>