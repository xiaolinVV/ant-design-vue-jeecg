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
            label="店铺管理id">
            <a-input placeholder="请输入店铺管理id" v-decorator="['storeManageId', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="交易类型；0：订单交易；1：余额提现；2：订单退款；3：福利金赠送；4：余额充值；5：归属店铺奖励；6：渠道销售奖励；做成数据字典">
            <a-input placeholder="请输入交易类型；0：订单交易；1：余额提现；2：订单退款；3：福利金赠送；4：余额充值；5：归属店铺奖励；6：渠道销售奖励；做成数据字典"
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
            label="交易状态;0：未支付；1：进行中；2：待结算：3：待打款；4：待退款；5：交易完成；6：已退款；7：交易关闭">
            <a-input placeholder="请输入交易状态;0：未支付；1：进行中；2：待结算：3：待打款；4：待退款；5：交易完成；6：已退款；7：交易关闭"
                     v-decorator="['tradeStatus', {}]"/>
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
            label="店铺银行卡id">
            <a-input placeholder="请输入店铺银行卡id" v-decorator="['storeBankCardId', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="操作人">
            <a-input placeholder="请输入操作人" v-decorator="['operator', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="备注">
            <a-input placeholder="请输入备注" v-decorator="['remark', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="支付方式；0:微信支付；1：支付宝支付">
            <a-input placeholder="请输入支付方式；0:微信支付；1：支付宝支付" v-decorator="['payment', {}]"/>
          </a-form-item>

        </a-form>
      </a-spin>
    </a-modal>

    <!--提现弹窗-->
    <a-modal title="提现" :width="800" v-model="visiblWithdrawDepositInformation"
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
            <a-select style="width: 100%"
                      v-decorator="[ 'sbcName', { rules: [{ required: true, message: '请选择' }] }]"
                      placeholder="请选择"
                      @change="cashWithdrawalSelect"
                      labelInValue
            >
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


    <!--充值弹窗-->
    <a-modal title="余额充值" :width="700" v-model="visiblRechargeInformation"
             @ok="showRecharge()" okText="确认" cancelText="取消">
      <div>
        <a-form :form="form">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="账户余额">
            <span v-if="balance">{{ balance }}元</span>
            <span v-else>0元</span>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="充值金额">
            <a-input placeholder="请输入" min="0.01" v-decorator="[ 'amount',validatorRules.money]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="支付方式">
            <span>微信支付</span>
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


    <!--    二维码-->
    <!--    okButtonProps: {-->
    <!--    props: { disabled: true },-->
    <!--    },-->
    <a-modal v-model="codePay" title="请使用微信扫描二维码以完成支付"
             style="display: flex;flex-direction: column;justify-content: center" class="qrCode"
             @cancel="closeQrCodePop">
      <img :src="codeUrl" alt="">
      <div>
        请使用微信扫描二维码以完成支付
      </div>
      <div class="datasCheck">
        充值完成后请刷新界面！
      </div>
    </a-modal>


    <!--查看详情-->
    <a-modal title="查看详情" :width="700" v-model="visiblViewDetailsInformation"
             @ok="showViewDetails()" okText="确认" cancelText="取消">

      <div v-if="agencyAccountCapital">
        <div style="width: 100%;background-color: #f2f2f2;padding: 20px;line-height: 30px">
          <h3>{{ agencyAccountCapital.tradeStatus_dictText }}</h3>
          <div>提现申请{{ agencyAccountCapital.tradeStatus_dictText }}，请等待...</div>
        </div>
        <div>
          <div class="tixianTime">
            <div class="tixianTimeFirst"><span>提现时间：</span><span>{{ agencyAccountCapital.createTime}} </span></div>
            <div><span>交易类型：</span><span>{{ agencyAccountCapital.payType_dictText }}</span></div>
          </div>
          <div class="tixianTime">
            <div class="tixianTimeFirst"><span>提现到：</span><span>({{ agencyAccountCapital.bankCard }})</span></div>
            <div><span>操作人：</span><span>{{ agencyAccountCapital.operator }}</span></div>
          </div>
          <div class="tixianTime">
            <div class="tixianTimeFirst"><span>单号：</span><span>{{ agencyAccountCapital.orderNo}}</span></div>
            <div><span>交易金额：</span><span>{{ agencyAccountCapital.amount}}</span></div>
          </div>
          <div class="tixianTime">
            <div><span>备注：</span><span v-if="agencyAccountCapital.remark">{{ agencyAccountCapital.remark}}</span><span
              v-else>-</span></div>
          </div>
        </div>


      </div>

    </a-modal>

  </div>
</template>

<script>
  import {httpAction, getAction, postAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from 'moment'

  let timeCount = 0

  export default {
    name: 'StoreRechargeRecordModal',
    inject: ['rush'],
    data() {
      return {
        dataAll: {},
        title: '操作',
        visible: false,
        visiblwelfarePaymentsInformation: false,
        //**提现*/
        visiblWithdrawDepositInformation: false,
        StoreManageId: '',
        balance: '',//余额
        //充值
        visiblRechargeInformation: false,

        /**详情*/
        visiblViewDetailsInformation: false,
        agencyAccountCapital: {},
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16}
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
            rules: [
              {
                required: true, message: '请输入'
              },
              {
                pattern: /^[1-9](\d+)?(\.\d{1,2})?$|(^\d\.\d{1,2}$)/,
                message: '最多只能输入两位小数的数字'
              }
            ]
          }
        },
        url: {
          add: '/storeRechargeRecord/storeRechargeRecord/add',
          edit: '/storeRechargeRecord/storeRechargeRecord/edit',
          // addStoreRechargeRecord: '/storeRechargeRecord/storeRechargeRecord/addStoreRechargeRecord',//提现
          //二维码
          payBalance: 'front/storeManage/payBalance',//生成支付二维码(需店铺id和付款金额)
          //  balance: "front/pay/balance",//充值回调
          prepaidPhoneCallback: '/storeRechargeRecord/storeRechargeRecord/prepaidPhoneCallback',//回调地址
          findBankCardById: "/storeBankCard/storeBankCard/findBankCardById", //提现银行卡信息
          cashOut: "/storeRechargeRecord/storeRechargeRecord/cashOut"  //提现

          /**end*/
        },
        //"https://gk.kaoqinwangluo.com/jeecg-boot"    测试版
        // window._CONFIG['domianURL'] 正式版
        codeUrl: window._CONFIG['domianURL'] + '/sys/common/view/',//二维码地址
        // codeUrl: "https://gk.kaoqinwangluo.com/jeecg-boot" + "/sys/common/view/",//二维码地址
        codePay: false,//二维码弹窗
        timer: ''//定时器容器
      }
    },
    created() {
    },
    //页面销毁前
    beforeDestroy() {
      clearInterval(this.timer)
      timeCount = 0
    },
    watch: {
      dataAll: {
        //总校验
        handler(afterValue, beforeValue) {
          //福利金格式判断
          if (!this.dataAll.welfarePayments) return;
          let welfarePaymentsIsFault = /^[1-9]\d*$/.test(this.dataAll.welfarePayments)
          this.welfarePaymentsIsFault = welfarePaymentsIsFault
          //总校验
        },
        immediate: true,  //刷新加载 立马触发一次handler
        deep: true  // 可以深度检测到 person 对象的属性值的变化
      }
    },

    methods: {
      //提现到下拉框
      cashWithdrawalSelect(value){
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
        this.StoreManageId = ''
        this.balance = '' //余额
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
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
              that.close()
            })
          }
        })
      }
      ,
      handleCancel() {
        this.close()

      }
      ,
      //店铺赠送福利金
      showModalPopUp(res) {
        this.visiblwelfarePaymentsInformation = true
        if (res.result) {
          this.ReappearanceData = res.result
        }
      },
      //店铺确认赠送福利金 提交
      hideModalPopUpInformation() {
        if (!this.dataAll.canSure) {
          this.$message.warn('请检查信息输入的内容或格式是否输入或正确')
          return
        }
      },
      //余额充值
      RechargePopUp() {
        // console.log()
        this.codeUrl = window._CONFIG['domianURL'] + '/sys/common/view/'//正式版
        // this.codeUrl =  "https://gk.kaoqinwangluo.com/jeecg-boot" + "/sys/common/view/", //测试版
        if (!this.welfarePaymentsIsFault) {
          this.$message.warn('福利金额必须是正整数！')
          return
        }
        let info = {
          price: this.shouldPay,
          storeManageId: this.ReappearanceData.id
        }
        // this.url.payBalance  正式版
        // 'https://gk.kaoqinwangluo.com/jeecg-boot/front/storeManage/payBalance' 测试版
        getAction(this.url.payBalance, info).then(res => {
          this.codePay = true
          this.codeUrl = this.codeUrl + res.result
          console.log('22222', this.codeUrl)
          console.log(res)
        })
      },
      /**提现*/
      withdrawDeposit(id, balance) {
        // this.model = Object.assign({}, {});
        this.balance = balance
        this.StoreManageId = id
        this.visiblWithdrawDepositInformation = true
        getAction(this.url.findBankCardById, {id}).then(res => {
          console.log(res)
          if (res.length > 0) {
            for (let item of res) {
              this.cashWithdrawalOptionsSelect.push({
                title: item.sbcName,
                value: item.storeBankCardId
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
            values.id = this.StoreManageId
            values.storeBankCardId = values.sbcName.key
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
              this.StoreManageId = ''
              this.balance = '' //余额
            })
          }
        })

        /* getAction(this.url.getAgencyAccountCapitalListList,{id: id}).then((res) => {
         if (res.success) {
         this.dataSource = res.result.records;
         this.ipagination.total = res.result.total;
         } else {
         this.$message.warning(res.message);
         }
         })*/
      },
      closeWithDrawDeposit(){
        console.log('执行了')
        this.visiblWithdrawDepositInformation = false
        this.cashWithdrawalOptionsSelect = [{
          title: '请选择',
          value: ''
        }]
      },

      /**充值**/
      Recharge(id, balance) {
        this.form.resetFields()
        this.model = Object.assign({}, {})

        this.balance = balance
        this.StoreManageId = id
        this.visiblRechargeInformation = true
      },
      //关闭二维码弹窗
      closeQrCodePop() {
        clearInterval(this.timer)
        timeCount = 0
      },
      //开启二维码弹窗
      showRecharge() {
        // 触发表单验证
        this.form.validateFields((err, values) => {
          const that = this
          if (!err) {
            console.log(values)
            let formData = Object.assign(this.model, values)
            //时间格式化
            console.log(formData)
            this.amount = values.amount
            //余额充值
            let info = {
              price: values.amount,
              storeManageId: this.StoreManageId
            }
            // this.url.payBalance  正式版
            // 'https://gk.kaoqinwangluo.com/jeecg-boot/front/storeManage/payBalance' 测试版
            let that = this
            that.codeUrl = window._CONFIG['domianURL'] + '/sys/common/view/'
            //this.codeUrl =  "https://gk.kaoqinwangluo.com/jeecg-boot" + "/sys/common/view/",//测试版
            getAction(that.url.payBalance, info).then(res => {
              that.codePay = true
              that.timer = setInterval(() => {
                timeCount++
                //
                let success = false
                //调用是否充值的状态接口（回调）
                //that.prepaidPhoneCallback(that.balance,that.StoreManageId,that.amount);
                //  console.log("success",success)
                getAction(that.url.prepaidPhoneCallback,
                  {oldBalance: that.balance, storeManageId: that.StoreManageId, amount: that.amount}).then(res => {
                  console.log(res.success)
                  if (res.success) {
                    //如果充值成功   清除定时器
                    clearInterval(that.timer)
                    that.$message.success(res.message)
                    timeCount = 0
                    that.rush()
                  }
                })
                if (timeCount > 60000 * 5) {
                  //如果五分钟内没有充值成功 清除定时器
                  timeCount = 0
                  clearInterval(that.timer)
                }
                //
              }, 1000)
              that.codeUrl = that.codeUrl + res.result
              console.log(res)
            })

          }
        })

      },
      //查看详情
      viewDetails(record) {
        this.visiblViewDetailsInformation = true
        console.log('record', record)
        if (record) {
          this.agencyAccountCapital = record

        }

      },

      /**充值回调*/
      prepaidPhoneCallback(oldBalance, storeManageId, amount) {


        return

      }


    }
  }
</script>

<style lang="less" scoped>
  .tixianTime {
    display: flex;
    justify-content: left;
    line-height: 30px;
    padding: 20px;
  }

  .tixianTimeFirst {
    width: 60%;
  }
</style>