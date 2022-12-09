<template>
  <div>
    <a-modal
      :title="title"
      :width="800"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="submit"
      @cancel="handleCancel"
      cancelText="关闭">

      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
              支付宝账号
          </span>
            <a-input placeholder="请输入支付宝账号"  v-model="Forminfo.bankCard"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
              真实姓名
          </span>
            <a-input placeholder="请输入真实姓名" v-model="Forminfo.cardholder"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
              手机号
          </span>
            <a-input placeholder="请输入手机号" v-model="Forminfo.phone"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
              验证码
          </span>
            <a-input placeholder="请输入验证码" v-model="Forminfo.sbCode"/>
            <a-button @click="getCode" :disabled="countDown != '60'">
              获取验证码
              <span style="margin-left: 5px" v-if="countDown != '60'">
              ({{countDown}})
            </span>
            </a-button>

          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

  </div>

</template>

<script>
  import {httpAction, getAction, postAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import dayjs from 'dayjs'

  export default {
    name: "AlipayModal",
    inject: ['rush'],
    data () {
      return {
        //表单提交信息暂时保存
        Forminfo: {
          id: '',
          bankName: '支付宝',
          bankCard: '',
          cardholder: '',
          carType:'1',
          phone: '',
          sbCode: '',
          delFlag: '0',
        },
        title: "提现到支付宝",
        visible: false,
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {},
        url: {
          add: "/storeBankCard/storeBankCard/add",
          edit: "/storeBankCard/storeBankCard/edit",
          verificationCode: "/storeBankCard/storeBankCard/bankCardByPhone", //获取验证码
          setBankCard: "/storeBankCard/storeBankCard/setBankCard",//设置银行卡
        },
        timer: '',//定时器
        countDown: 60,//倒计时
      }
    },
    created () {

    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
//        this.form.resetFields();
//        this.model = Object.assign({}, record);
        this.visible = true;
//        this.model.delFlag = 0;
//        this.$nextTick(() => {
//          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','bankName','bankCard','cardholder',))
//		  //时间格式化
//        });
        this.Forminfo = Object.assign({},this.Forminfo,record)
//        this.Forminfo = ''

      },
      submit(){
        if(!this.dataCheck()) return;
        postAction(this.url.setBankCard, this.Forminfo).then(res => {
          if (res.success || res.result) {
            this.$message.success(res.message)
            this.rush();
            this.close(true)
          } else {
            this.$message.warn(res.message)
            this.close();
          }
        })
      },
      close (success = false) {
        if(!success){
          this.Forminfo.phone = ''
          this.Forminfo.sbCode = ''
        }
        this.$emit('close');
        this.visible = false;
      },
      //获取验证码
      getCode(){
        let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(this.Forminfo.phone)) {
          this.$message.warn('手机号码格式不正确！')
          return
        }
        getAction(this.url.verificationCode, {phone: this.Forminfo.phone}).then(res => {
          if (res.success) {
            this.$message.success(res.message);
            this.countDown--
            this.timer = setInterval(() => {
              if (this.countDown <= 0) {
                this.countDown = 60
                clearInterval(this.timer)
                return;
              }
              this.countDown--
            }, 1000)
          } else {
            this.$message.warn(res.message)
          }
        })
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
                that.$emit('ok');StoreBankCardList
              } else {
                that.$message.warn(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
        })
        this.$emit('keep', this.Forminfo)
      },
      handleCancel () {
        this.close()
      },
      //校验
      dataCheck(){
        let formInfo = this.Forminfo,
          phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;

        // if(!formInfo.cardholder){
        //   this.$message.warn('请输入真实姓名')
        //   return false
        // }
        // if(!formInfo.cardholder){
        //   this.$message.warn('请输入支付宝账号')
        //   return false
        // }

        if(!formInfo.phone){
          this.$message.warn('请输入手机号')
          return false
        }
        if(!phoneReg.test(formInfo.phone)){
          this.$message.warn('请输入正确的手机号')
          return false
        }
        if(!formInfo.sbCode){
          this.$message.warn('请输入验证码')
          return false
        }
        return true

      },
    }
  }
</script>

<style lang="less" scoped>

</style>