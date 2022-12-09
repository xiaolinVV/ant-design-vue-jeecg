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
            <a-input-number v-decorator="[ 'year', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="创建月">
            <a-input-number v-decorator="[ 'month', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="创建日">
            <a-input-number v-decorator="[ 'day', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="删除状态（0，正常，1已删除）">
            <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-decorator="['delFlag', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="代理id">
            <a-input placeholder="请输入代理id" v-decorator="['sysUserId', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="交易类型；0：订单交易；1：提现；2：订单退款；3：余额充值；做成数据字典">
            <a-input placeholder="请输入交易类型；0：订单交易；1：提现；2：订单退款；3：余额充值；做成数据字典" v-decorator="['payType', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="支付和收入；0：收入；1：支出">
            <a-input placeholder="请输入支付和收入；0：收入；1：支出" v-decorator="['goAndCome', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="交易金额">
            <a-input-number v-decorator="[ 'amount', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="单号">
            <a-input placeholder="请输入单号" v-decorator="['orderNo', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="交易状态;0：未支付；1：进行中；2：待结算：3：待打款；4：待退款；5：交易完成；6：已退款；7：交易关闭">
            <a-input placeholder="请输入交易状态;0：未支付；1：进行中；2：待结算：3：待打款；4：待退款；5：交易完成；6：已退款；7：交易关闭" v-decorator="['tradeStatus', {}]" />
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
            <a-input placeholder="请输入" v-decorator="[ 'amount',validatorRules.money]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="提现到">
            <a-select style="width: 100%" v-decorator="[ 'sbcName', { rules: [{ required: true, message: '请选择' }] }]"  placeholder="请选择"@change="cashWithdrawalSelect"
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


    <!--充值弹窗-->
    <!--<a-modal title="余额充值" :width="700" v-model="visiblRechargeInformation"
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
            <a-input placeholder="请输入" v-decorator="[ 'amount',{ rules: [{ required: true, message: '请输入' }] },validatorRules.moneyCZ]" />
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
    </a-modal>-->


    <!--    二维码-->
    <!--    okButtonProps: {-->
    <!--    props: { disabled: true },-->
    <!--    },-->
    <a-modal v-model="codePay" title="请使用微信扫描二维码以完成支付"
             style="display: flex;flex-direction: column;justify-content: center" class="qrCode" @cancel="closeQrCodePop">
      <img preview="1" :src="codeUrl" alt="">
      <div>
        请使用微信扫描二维码以完成支付
      </div>
      <div class="datasCheck">
        充值完成后请刷新界面！
      </div>
    </a-modal>

  </div>


</template>

<script>
  import {httpAction,getAction,postAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  let timeCount = 0;
  export default {
    name: "AgencyRechargeRecordModal",
    inject:['rush'],
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        //**提现*/
        visiblWithdrawDepositInformation:false,
        //充值
        visiblRechargeInformation:false,
        agencyManageId:"",
        balance:"",//余额
        sysUserId:"",//代理userId
        remark:"",//备注说明
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        //提现到  下拉框
        cashWithdrawalOptionsSelect: [{
          title: '请选择',
          value: ''
        }],
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
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
          add: "/agencyRechargeRecord/agencyRechargeRecord/add",
          edit: "/agencyRechargeRecord/agencyRechargeRecord/edit",
          addAgencyRechargeRecord:"/agencyRechargeRecord/agencyRechargeRecord/addAgencyRechargeRecord",
          //二维码
          payBalance:"/agencyRechargeRecord/agencyRechargeRecord/payBalance",
          prepaidPhoneCallback:"/agencyRechargeRecord/agencyRechargeRecord/prepaidPhoneCallback",//后端充值回调
          findBankCardById:"/agencyBankCard/agencyBankCard/findBankCardById",//提现银行卡信息
          cashOut:"/agencyRechargeRecord/agencyRechargeRecord/cashOut",//提现
          /**end*/
        },
        //"https://gk.kaoqinwangluo.com/jeecg-boot"    测试版
        // window._CONFIG['domianURL'] 正式版
        codeUrl: window._CONFIG['domianURL'] + "/sys/common/view/",//二维码地址
        // codeUrl: "https://gk.kaoqinwangluo.com/jeecg-boot" + "/sys/common/view/",//二维码地址
        codePay: false,//二维码弹窗
        timer:'',//定时器容器
      }
    },
    created () {
    },
    //页面销毁前
    beforeDestroy(){
      clearInterval(this.timer)
      timeCount = 0
    },
    methods: {
      cashWithdrawalSelect(value){
      },
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','sysUserId','payType','goAndCome','amount','orderNo','tradeStatus'))
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
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            
            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
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
                value: item.agencyBankCardId
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
            values.agencyBankCardId = values.sbcName.key
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
      /*...mapGetters(["nickname", "typePicture", "userInfo"]),
      showWithdrawDeposit(){
        // 触发表单验证
        this.form.validateFields((err, values) => {
          const that = this;
          if(!err){
            console.log(values);
            values.sysUserId =   this.userInfo().id

            let formData = Object.assign(this.model, values);
            httpAction(that.url.addAgencyRechargeRecord, formData, "post").then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.rush();
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              this.visiblRechargeInformation = false;
              that.rush();
              that.close();
              this.agencyManageId = "";
              this.balance = ""; //余额
            })

          }
          this.visiblWithdrawDepositInformation = false;
        })
      },*/
      closeWithDrawDeposit(){
        console.log('执行了')
        this.visiblWithdrawDepositInformation = false
        this.cashWithdrawalOptionsSelect = [{
          title: '请选择',
          value: ''
        }]
      },
      /**充值**/
      Recharge(id,balance){
        this.form.resetFields();
        this.model = Object.assign({}, {});

        this.balance = balance;
        this.agencyManageId =  id
        this.visiblRechargeInformation = true;
      },
      //关闭二维码弹窗
      closeQrCodePop(){
        clearInterval(this.timer)
        timeCount = 0
      },
      //开启二维码弹窗
      showRecharge() {
        // 触发表单验证
        this.form.validateFields((err, values) => {
          const that = this;
          if (!err) {
            console.log(values);
            let formData = Object.assign(this.model, values);
            //时间格式化
            console.log(formData)
            this.amount = values.amount;
            //余额充值
            let info = {
              price: values.amount,
              agencyManageId: this.agencyManageId,
            }
            // this.url.payBalance  正式版
            // 'https://gk.kaoqinwangluo.com/jeecg-boot/front/storeManage/payBalance' 测试版
            let that = this;
            that.codeUrl = window._CONFIG['domianURL'] + "/sys/common/view/";
            //this.codeUrl =  "https://gk.kaoqinwangluo.com/jeecg-boot" + "/sys/common/view/",//测试版
            getAction(that.url.payBalance, info).then(res => {
              that.codePay = true;
              that.timer = setInterval(() => {
                timeCount++;
                //
                let success = false;
                //调用是否充值的状态接口（回调）
                //that.prepaidPhoneCallback(that.balance,that.prepaidPhoneCallback,that.amount);
                //  console.log("success",success)
                getAction(that.url.prepaidPhoneCallback,
                  { oldBalance: that.balance, agencyManageId: that.agencyManageId, amount: that.amount }).then(res => {

                  console.log(res.success)
                  if (res.success) {
                    //如果充值成功   清除定时器
                    clearInterval(that.timer);
                    that.$message.success(res.message);
                    timeCount = 0
                    that.rush();
                  }
                })

                //

                if (timeCount > 60000 * 5) {
                  //如果五分钟内没有充值成功 清除定时器
                  timeCount = 0;
                  clearInterval(that.timer);
                }
                //
              }, 1000)
              that.codeUrl = that.codeUrl + res.result;
              console.log(res);
            })

          }
        })
      },

    }
  }
</script>

<style lang="less" scoped>

</style>