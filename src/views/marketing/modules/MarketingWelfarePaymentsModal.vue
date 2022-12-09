<template>
  <div>
    <a-modal
      :title="title"
      :width="1000"
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
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="店铺福利金id">
            <a-input placeholder="请输入店铺福利金id" v-decorator="['sysUserId', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="会员列表，如果没有赠送就为空">
            <a-input placeholder="请输入会员列表，如果没有赠送就为空" v-decorator="['memberListId', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="流水号">
            <a-input placeholder="请输入流水号" v-decorator="['serialNumber', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="交易福利金">
            <a-input-number v-decorator="['bargainPayments', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="账户福利金">
            <a-input-number v-decorator="['welfarePayments', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="类型；0：支出；1：收入">
            <a-input placeholder="请输入类型；0：支出；1：收入" v-decorator="['weType', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="说明">
            <a-input placeholder="请输入说明" v-decorator="['giveExplain', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="来源或者去向">
            <a-input placeholder="请输入来源或者去向" v-decorator="['goAndCome', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="交易时间">
            <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['bargainTime', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="操作人">
            <a-input placeholder="请输入操作人" v-decorator="['operator', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="店铺账户余额">
            <a-input-number v-decorator="['balance', {}]" />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

    <!--店铺赠送福利金弹窗-->
    <a-modal
      title="送福利金"
      :width="1000"
      v-model="visiblwelfarePaymentsInformation"
      @ok="hideModalPopUpInformation()"
      okText="确认"
      cancelText="取消"
    >
      <div>
        <div class="Address">
          重要提示：福利金赠送出去后无法退回，赠送时请确保所填写信息无误
        </div>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="获赠账号">
          <!--          <a-input placeholder="请输入" v-model="dataAll.phone" @change="phoneChange"/>-->
          <!--          :default-active-first-option="false"-->
          <!--          :show-arrow="false"-->
          <a-select
            show-search
            v-model="dataAll.phone"
            placeholder="请输入"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            @search="fetchPhone"
            @change="phoneChange"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in phoneList" :key="d.id">
              {{ d.NAME }}
            </a-select-option>
          </a-select>

          <div class="datasCheck">
            <span v-if="!phoneIsStandard">
              手机号格式有误！请重新输入
            </span>
            <span v-if="phoneIsStandard && !phoneIsExistence">
              不存在此手机号！
            </span>
          </div>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="福利金">
          <a-input placeholder="请输入" userType="number" v-model="dataAll.welfarePayments" />
          <div>账户福利金{{ ReappearanceData.welfarePayments }}</div>
          <div class="datasCheck" v-if="!welfarePaymentsIsFault">
            福利金额必须是正整数
          </div>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="需付款">
          <span> ￥{{ shouldPay }} </span>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="账户余额">
          <span>余额支付(账户可用余额 ￥{{ ReappearanceData.balance || '0.00' }}）</span>
          <a style="float: right" @click="RechargePopUp">余额充值</a>
          <div class="datasCheck" v-if="!hasPrice">
            账户余额不足，请充值
          </div>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="赠送说明">
          <a-textarea
            placeholder="请填写赠送原因"
            :autosize="{ minRows: 3, maxRows: 6 }"
            v-model="dataAll.giveExplain"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-checkbox style="margin-left: 30%" @change="onChange" :checked="checked">我确认以上信息无误</a-checkbox>
        </a-form-item>
      </div>
    </a-modal>

    <!--平台赠送福利金弹窗-->
    <a-modal
      title="送福利金"
      :width="1000"
      v-model="visiblwelfarePaymentsProInformation"
      @ok="hideModalPopUpProInformation()"
      okText="确认"
      cancelText="取消"
    >
      <div>
        <div class="Address">
          重要提示：福利金赠送出去后无法退回，赠送时请确保所填写信息无误
        </div>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户类型">
          <a-select style="width: 100%" v-model="tarrace.userType" placeholder="请选择">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option value="1">店铺管理员</a-select-option>
            <a-select-option value="0">会员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="获赠账号">
          <a-select
            show-search
            v-model="tarrace.bossPhone"
            placeholder="请输入"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            @search="fetchPhone"
            @change="phoneChange"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in phoneList" :key="d.id">
              {{ d.NAME }}
            </a-select-option>
          </a-select>

          <!--          <a-input placeholder="请输入" v-model="tarrace.bossPhone"/>-->
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="福利金">
          <a-input placeholder="请输入" v-model="tarrace.welfarePayments" />
          <!-- <div class="datasCheck" v-if="!affirmWelfarePaymentsIsFault">
            福利金额必须是正整数
          </div> -->
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="赠送说明">
          <a-textarea
            placeholder="请填写赠送原因"
            v-model="tarrace.giveExplain"
            :autosize="{ minRows: 3, maxRows: 6 }"
          />
        </a-form-item>
        <!--<a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="方式">
          <a-select style="width: 100%" v-decorator="['memberListId', {}]" placeholder="请选择">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option :value="0">平台补发</a-select-option>
          </a-select>
        </a-form-item>-->
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-checkbox style="margin-left: 30%" @change="onChange1" :checked="affirm">我确认以上信息无误</a-checkbox>
        </a-form-item>
      </div>
    </a-modal>

    <!--    二维码-->
    <!--    okButtonProps: {-->
    <!--    props: { disabled: true },-->
    <!--    },-->
    <a-modal
      v-model="codePay"
      title="请使用微信扫描二维码以完成支付"
      style="display: flex;flex-direction: column;justify-content: center"
      class="qrCode"
      @cancel="closeQrCodePop"
    >
      <img :src="codeUrl" alt="" />
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
import { httpAction, getAction, postAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
let timeCount = 0

import debounce from 'lodash/debounce'

export default {
  name: 'MarketingWelfarePaymentsModal',
  inject: ['rush'],
  data() {
    this.lastFetchId = 0
    this.fetchPhone = debounce(this.fetchPhone, 800)
    return {
      title: '操作',
      visible: false,
      ss: '0',
      model: {},
      fetching: false,
      ReappearanceData: '', //返显数据
      visiblwelfarePaymentsInformation: false,
      visiblwelfarePaymentsProInformation: false,
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
      dataAll: {
        id: '',
        giveExplain: '',
        phone: '',
        welfarePayments: '',
        canSure: '' //是否可以点击确定
      },
      tarrace: {
        id: '',
        bossPhone: '',
        welfarePayments: '',
        giveExplain: '',
        userType: '',
        canSure: '' //是否可以点击确定
      },
      phoneList: [], //手机号模糊查询
      url: {
        add: '/marketingWelfarePayments/marketingWelfarePayments/add',
        edit: '/marketingWelfarePayments/marketingWelfarePayments/edit',
        likeMemberByPhone: '/memberList/memberList/likeMemberByPhone', //校验手机号码接口 (通过手机号码获取会员信息)
        findByPhoneAndType: '/marketingWelfarePayments/marketingWelfarePayments/findByPhoneAndType', //通过赠送类型和手机号码获取信息
        payBalance: 'front/storeManage/payBalance', //生成支付二维码(需店铺id和付款金额)
        updateWelfarePaymentsById: '/marketingWelfarePayments/marketingWelfarePayments/updateWelfarePaymentsById', //店铺赠送福利金接口
        updateStoreWelfarePayments: '/marketingWelfarePayments/marketingWelfarePayments/updateStoreWelfarePayments', //平台赠送福利金接口
        prepaidPhoneCallback: '/marketingWelfarePayments/marketingWelfarePayments/prepaidPhoneCallback' //后端充值回调
      },
      //"https://gk.kaoqinwangluo.com/jeecg-boot"    测试版
      // window._CONFIG['domianURL'] 正式版
      codeUrl: window._CONFIG['domianURL'] + '/sys/common/view/', //二维码地址
      phoneIsStandard: true, //手机格式是否标准(作废)
      phoneIsExistence: true, //是否存在此手机号(作废)
      hasPrice: false, //账户余额是否充足
      codePay: false, //二维码弹窗
      checked: false, //是否确认信息无误
      welfarePaymentsIsFault: false, //福利金格式是否正确
      affirm: false, //平台确认信息
      // affirmWelfarePaymentsIsFault: false, //福利金格式是否正确
      timer: '' //定时器容器
    }
  },
  created() {},
  //页面销毁前
  beforeDestroy() {
    clearInterval(this.timer)
    timeCount = 0
  },
  watch: {
    dataAll: {
      //总校验
      handler(afterValue, beforeValue) {
        //           console.log("jksd;flkja;sldjf;lkaj;ogawehghsdoihgnsadoghwal;ehwshgnwsdhg;sh"+afterValue,beforeValue)
        //余额判断
        if (
          this.ReappearanceData.welfarePayments * (this.ReappearanceData.proportion / 100) +
            this.ReappearanceData.balance <
          this.shouldPay
        ) {
          this.hasPrice = false
        } else {
          this.hasPrice = true
        }
        //福利金格式判断
        let welfarePaymentsIsFault = /^[1-9]\d*$/.test(this.dataAll.welfarePayments)
        this.welfarePaymentsIsFault = welfarePaymentsIsFault
        //总校验
        // console.log(this.hasPrice , this.phoneIsStandard , this.welfarePaymentsIsFault , this.phoneIsExistence , this.checked)
        if (
          this.hasPrice &&
          this.phoneIsStandard &&
          this.welfarePaymentsIsFault &&
          this.phoneIsExistence &&
          this.checked
        ) {
          this.dataAll.canSure = true
        } else {
          this.dataAll.canSure = false
        }
      },
      immediate: true, //刷新加载 立马触发一次handler
      deep: true // 可以深度检测到 person 对象的属性值的变化
    },
    tarrace: {
      handler(afterValue, beforeValue) {
        //福利金格式判断
        // let welfarePaymentsIsFault = /^[1-9]\d*$/.test(this.tarrace.welfarePayments)
        // this.affirmWelfarePaymentsIsFault = welfarePaymentsIsFault
        if (this.affirm) {
          // this.affirm && this.affirmWelfarePaymentsIsFault
          this.tarrace.canSure = true
        } else {
          this.tarrace.canSure = false
        }
      },
      immediate: true, //刷新加载 立马触发一次handler
      deep: true // 可以深度检测到 person 对象的属性值的变化
    }
  },
  computed: {
    shouldPay() {
      // 账户福利金 ReappearanceData.welfarePayments
      // 账户余额 ReappearanceData.balance
      let money = '0.00'
      console.log('---shouldPay---', this.dataAll, this.ReappearanceData)
      //18%
      let welfarePaymentsToMoney = this.dataAll.welfarePayments * (this.ReappearanceData.proportion / 100)
      if (welfarePaymentsToMoney) {
        if (this.ReappearanceData.welfarePayments - this.dataAll.welfarePayments >= 0) {
          money = 0
          //  if(this.ReappearanceData.welfarePayments - this.dataAll.welfarePayments < 0)
        } else {
          if (
            this.ReappearanceData.balance -
              (this.dataAll.welfarePayments - this.ReappearanceData.welfarePayments) *
                (this.ReappearanceData.proportion / 100) >
            0
          ) {
            money = 0
          } else {
            money = (
              (this.dataAll.welfarePayments - this.ReappearanceData.welfarePayments) *
                (this.ReappearanceData.proportion / 100) -
              this.ReappearanceData.balance
            ).toFixed(2)
          }
        }
      }
      return money
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
            'sysUserId',
            'memberListId',
            'serialNumber',
            'bargainPayments',
            'welfarePayments',
            'weType',
            'giveExplain',
            'goAndCome',
            'operator',
            'balance'
          )
        )
        //时间格式化
        this.form.setFieldsValue({ bargainTime: this.model.bargainTime ? moment(this.model.bargainTime) : null })
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    fetchPhone(phone) {
      console.log('fetching phone', phone)
      let apiName
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.data = []
      this.fetching = true
      let formData = {
        phone,
        userType: this.tarrace.userType
      }
      if (this.visiblwelfarePaymentsProInformation) {
        apiName = this.url.findByPhoneAndType
        if (!formData.userType) {
          this.$message.warn('请选择用户类型！')
          return
        }
      }
      if (this.visiblwelfarePaymentsInformation) {
        apiName = this.url.likeMemberByPhone
      }
      getAction(apiName, formData).then(res => {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return
        }
        // this.phoneIsExistence = res
        this.phoneList = res
        this.fetching = false
      })

      // fetch('https://randomuser.me/api/?results=5')
      //   .then(response => response.json())
      //   .then(body => {
      //     if (fetchId !== this.lastFetchId) {
      //       // for fetch callback order
      //       return;
      //     }
      //     const data = body.results.map(user => ({
      //       text: `${user.name.first} ${user.name.last}`,
      //       value: user.login.username,
      //     }));
      //     this.data = data;
      //     this.fetching = false;
      //   });
    },
    handleOk() {
      console.log('提交')
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
          formData.bargainTime = formData.bargainTime ? formData.bargainTime.format('YYYY-MM-DD HH:mm:ss') : null
          console.log(formData)
          getAction(httpurl, formData, method)
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
    //店铺赠送福利金
    showModalPopUp(res) {
      this.visiblwelfarePaymentsInformation = true
      if (res.result) {
        this.ReappearanceData = res.result
      }
    },
    //平台赠送福利金
    showModalPopUpPro(res) {
      this.visiblwelfarePaymentsProInformation = true
    },
    //店铺确认赠送福利金 提交
    hideModalPopUpInformation() {
      if (!this.dataAll.canSure) {
        this.$message.warn('请检查信息输入的内容或格式是否输入或正确')
        return
      }
      postAction(this.url.updateWelfarePaymentsById, this.dataAll).then(res => {
        console.log(res)
        if (res.success) {
          this.$message.success(res.message)
          this.rush()
        } else {
          this.$message.warn(res.message)
        }
        this.visiblwelfarePaymentsInformation = false
      })
    },

    //关闭二维码弹窗
    closeQrCodePop() {
      clearInterval(this.timer)
      timeCount = 0
    },
    //余额充值
    RechargePopUp() {
      this.codeUrl = window._CONFIG['domianURL'] + '/sys/common/view/'
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
      let that = this
      getAction(this.url.payBalance, info).then(res => {
        that.codePay = true
        that.timer = setInterval(() => {
          timeCount++
          getAction(that.url.prepaidPhoneCallback, {
            oldBalance: that.ReappearanceData.balance,
            storeManageId: that.ReappearanceData.id,
            amount: that.shouldPay
          }).then(res => {
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
        }, 1000)
        that.codeUrl = that.codeUrl + res.result
      })
    },

    //获取手机号
    phoneChange(id) {
      if (id) {
        if (this.visiblwelfarePaymentsProInformation) {
          this.tarrace.id = id
        }
        if (this.visiblwelfarePaymentsInformation) {
          this.dataAll.id = id
        }
      }

      //手机号校验
      // let value = e.target.value
      // let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      // if (!phoneReg.test(value)) {
      //   this.phoneIsStandard = false;
      // } else {
      //   this.phoneIsStandard = true;
      //   let formData = {
      //     phone: value
      //   }
      //   getAction(this.url.likeMemberByPhone, formData).then((res) => {
      //     this.phoneIsExistence = res
      //   })
      // }
    },
    //平台赠送福利金
    hideModalPopUpProInformation() {
      console.log(this.tarrace.userType)
      if (this.tarrace.userType.toString() == '') {
        this.$message.warn('请选择用戶类型')
        return
      }
      if (!this.tarrace.canSure) {
        this.$message.warn('请认真阅读')
        return
      }
      postAction(this.url.updateStoreWelfarePayments, this.tarrace).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.rush()
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    onChange1(e) {
      this.affirm = e.target.checked
      // console.log(this.affirmWelfarePaymentsIsFault, this.affirm)
      this.$nextTick(() => {
        if (this.affirm) {
          // && this.affirmWelfarePaymentsIsFault
          this.tarrace.canSure = true
        } else {
          this.tarrace.canSure = false
        }
      })
    },
    onChange(e) {
      this.checked = e.target.checked
      this.$nextTick(() => {
        if (
          this.hasPrice &&
          this.phoneIsStandard &&
          this.welfarePaymentsIsFault &&
          this.phoneIsExistence &&
          this.welfarePaymentsIsFault &&
          this.checked
        ) {
          this.dataAll.canSure = true
        } else {
          this.dataAll.canSure = false
        }
      })

      console.log(`checked = ${e.target.checked}`)
    }
  }
}
</script>

<style lang="less" scoped>
.qrCode {
  img {
    display: block;
    margin: 0 auto;
  }
  div {
    text-align: center;
    margin: 0 auto;
    margin-top: 30px;
  }
}

.datasCheck {
  color: red;
}

.Address {
  width: 100%;
  height: 30px;
  text-align: center;
  background-color: #ccebff;
  border-radius: 4px;
  border: 1px solid #0099ff;
  line-height: 30px;
  margin-bottom: 10px;
}
</style>
