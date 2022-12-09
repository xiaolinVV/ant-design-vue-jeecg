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
           label="供应商id">
           <a-input placeholder="请输入供应商id" v-decorator="['sysAreaId', {}]" />
         </a-form-item>
         <a-form-item
           :labelCol="labelCol"
           :wrapperCol="wrapperCol"
           label="交易类型；0：订单交易；1：余额提现；2：订单退款；3：余额充值；对应数据字典">
           <a-input placeholder="请输入交易类型；0：订单交易；1：余额提现；2：订单退款；3：余额充值；对应数据字典" v-decorator="['payType', {}]" />
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
           label="交易状态;0：未支付；1：进行中；2：待结算：3：待打款；4：待退款；5：交易完成；6：已退款；7：交易关闭">
           <a-input placeholder="请输入交易状态;0：未支付；1：进行中；2：待结算：3：待打款；4：待退款；5：交易完成；6：已退款；7：交易关闭" v-decorator="['tradeStatus', {}]" />
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
           label="供应商银行卡id">
           <a-input placeholder="请输入供应商银行卡id" v-decorator="['providerBankCardId', {}]" />
         </a-form-item>
         <a-form-item
           :labelCol="labelCol"
           :wrapperCol="wrapperCol"
           label="操作人">
           <a-input placeholder="请输入操作人" v-decorator="['operator', {}]" />
         </a-form-item>
         <a-form-item
           :labelCol="labelCol"
           :wrapperCol="wrapperCol"
           label="备注">
           <a-input placeholder="请输入备注" v-decorator="['remark', {}]" />
         </a-form-item>
         <a-form-item
           :labelCol="labelCol"
           :wrapperCol="wrapperCol"
           label="支付方式；0:微信支付；1：支付宝支付">
           <a-input placeholder="请输入支付方式；0:微信支付；1：支付宝支付" v-decorator="['payment', {}]" />
         </a-form-item>

       </a-form>
     </a-spin>
   </a-modal>
   <!--提现弹窗-->
   <a-modal title="提现" :width="700" v-model="visiblWithdrawDepositInformation"
            @ok="showWithdrawDeposit()" okText="确认" cancelText="取消">
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
           <a-select style="width: 100%" v-decorator="[ 'withdrawalType', { rules: [{ required: true, message: '请选择' }] }]"  placeholder="请选择">
             <a-select-option value="">请选择</a-select-option>
             <a-select-option :value="1">微信</a-select-option>
             <a-select-option :value="0">支付宝</a-select-option>
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
   </a-modal>


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


   <!--查看详情-->
   <a-modal title="查看详情"  :width="700" v-model="visiblViewDetailsInformation"
            @ok="showViewDetails()" okText="确认" cancelText="取消">

     <div v-if="agencyAccountCapital">
       <div style="width: 100%;background-color: #f2f2f2;padding: 20px;line-height: 30px">
         <h3>{{ agencyAccountCapital.tradeStatus_dictText }}</h3>
         <div>提现申请{{ agencyAccountCapital.tradeStatus_dictText }}，请等待...</div>
       </div>
       <div>
         <div class="tixianTime" >
           <div class="tixianTimeFirst"><span>提现时间：</span><span>{{ agencyAccountCapital.createTime}} </span></div>
           <div><span>交易类型：</span><span>{{ agencyAccountCapital.payType_dictText }}</span></div>
         </div>
         <div class="tixianTime" >
           <div class="tixianTimeFirst"><span>提现到：</span><span>({{ agencyAccountCapital.bankCard }})</span></div>
           <div><span>操作人：</span><span>{{ agencyAccountCapital.operator }}</span></div>
         </div>
         <div class="tixianTime" >
           <div class="tixianTimeFirst"><span>单号：</span><span>{{ agencyAccountCapital.orderNo}}</span></div>
           <div><span>交易金额：</span><span>{{ agencyAccountCapital.amount}}</span></div>
         </div>
         <div class="tixianTime" >
           <div><span>备注：</span><span v-if="agencyAccountCapital.remark">{{ agencyAccountCapital.remark}}</span><span v-else>-</span></div>

         </div>
       </div>


     </div>

   </a-modal>

 </div>

</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  let timeCount = 0;
  export default {
    name: "ProviderRechargeRecordModal",
    inject:['rush'],
    data () {
      return {
        title:"操作",
        visible: false,
        visiblwelfarePaymentsInformation: false,
        //**提现*/
        visiblWithdrawDepositInformation:false,
        sysUserId:"",
        balance:"",//余额
        //充值
        visiblRechargeInformation:false,

        /**详情*/
        visiblViewDetailsInformation:false,
        agencyAccountCapital:{},
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

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
          add: "/providerRechargeRecord/providerRechargeRecord/add",
          edit: "/providerRechargeRecord/providerRechargeRecord/edit",
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
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','sysAreaId','payType','goAndCome','amount','tradeStatus','orderNo','providerBankCardId','operator','remark','payment'))
		  //时间格式化
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.sysUserId = "";
        this.balance = ""; //余额
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
      //余额充值
      RechargePopUp(){
        // console.log()
        this.codeUrl = window._CONFIG['domianURL'] + "/sys/common/view/";//正式版
        // this.codeUrl =  "https://gk.kaoqinwangluo.com/jeecg-boot" + "/sys/common/view/", //测试版
        if (!this.welfarePaymentsIsFault) {
          this.$message.warn('福利金额必须是正整数！')
          return
        }
        let info = {
          price: this.shouldPay,
          sysUserId: this.ReappearanceData.id,
        }
        // this.url.payBalance  正式版
        // 'https://gk.kaoqinwangluo.com/jeecg-boot/front/storeManage/payBalance' 测试版
        getAction(this.url.payBalance, info).then(res => {
          this.codePay = true;
          this.codeUrl = this.codeUrl + res.result
          console.log( "22222",this.codeUrl );
          console.log(res);
        })
      },
      /**提现*/
      withdrawDeposit(id,balance){
        this.form.resetFields();
        this.model = Object.assign({}, {});
        this.model ={};
        this.balance = balance;
        this.sysUserId =  id
        this.visiblWithdrawDepositInformation = true;

      },
      /**提现提交*/
      showWithdrawDeposit(){
        // 触发表单验证
        this.form.validateFields((err, values) => {
          const that = this;
          if(!err){
            console.log(values);
            values.sysUserId =  that.sysUserId;

            let formData = Object.assign(this.model, values);
            httpAction(that.url.addStoreRechargeRecord, formData, "post").then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.rush();
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              this.visiblRechargeInformation = false;
              that.close();
              this.sysUserId = "";
              this.balance = ""; //余额
            })

          }
          this.visiblWithdrawDepositInformation = false;
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
      /**充值**/
      Recharge(id,balance){
        this.form.resetFields();
        this.model = Object.assign({}, {});

        this.balance = balance;
        this.sysUserId =  id
        this.visiblRechargeInformation = true;
      },
      //关闭二维码弹窗
      closeQrCodePop(){
        clearInterval(this.timer)
        timeCount = 0
      },
      //开启二维码弹窗
      showRecharge(){
        // 触发表单验证
        this.form.validateFields((err, values) => {
          const that = this;
          if(!err){
            console.log(values);
            let formData = Object.assign(this.model, values);
            //时间格式化
            console.log(formData)
            this.amount = values.amount;
            //余额充值
            let info = {
              price: values.amount,
              sysUserId: this.sysUserId,
            }
            // this.url.payBalance  正式版
            // 'https://gk.kaoqinwangluo.com/jeecg-boot/front/storeManage/payBalance' 测试版
            let that = this;
            that.codeUrl = window._CONFIG['domianURL'] + "/sys/common/view/";
            //this.codeUrl =  "https://gk.kaoqinwangluo.com/jeecg-boot" + "/sys/common/view/",//测试版
            getAction(that.url.payBalance, info).then(res => {
              that.codePay = true;
              that.timer = setInterval(()=>{
                timeCount ++;
                //
                let success = false;
                //调用是否充值的状态接口（回调）
                //that.prepaidPhoneCallback(that.balance,that.sysUserId,that.amount);
                //  console.log("success",success)
                getAction(that.url.prepaidPhoneCallback,
                  {oldBalance:that.balance,sysUserId:that.id,amount:that.amount}).then(res => {

                  console.log(res.success)
                  if(res.success){
                    //如果充值成功   清除定时器
                    clearInterval(that.timer);
                    that.$message.success(res.message);
                    timeCount = 0
                    that.rush();
                  }
                })

                //

                if(timeCount > 60000 * 5){
                  //如果五分钟内没有充值成功 清除定时器
                  timeCount= 0;
                  clearInterval(that.timer);
                }
                //
              },1000)
              that.codeUrl = that.codeUrl + res.result;
              console.log(res);
            })

          }
        })

      },
      //查看详情
      viewDetails(record){
        this.visiblViewDetailsInformation = true;
        console.log("record",record)
        if(record){
          this.agencyAccountCapital =   record;

        }

      },


    }
  }
</script>

<style lang="less" scoped>
  .tixianTime{display: flex;justify-content: left;line-height: 30px;padding: 20px;}
  .tixianTimeFirst{
    width: 60%;
  }
</style>