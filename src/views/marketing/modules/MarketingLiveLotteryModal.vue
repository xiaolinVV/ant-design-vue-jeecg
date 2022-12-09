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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="直播编号">
          <a-input
            placeholder="请输入直播编号"
            v-decorator="['streamingStreamNumber', { rules: [{ required: true, message: '请输入直播编号' }] }]"
            @change="streamingStreamNumberChange"
            v-model="streamingStreamNumber"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="直播间名称">
          <span v-if="roomName"> {{ roomName }} </span>
          <span v-else>请输入直播编号</span>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="轮次名称">
          <a-input
            placeholder="请输入轮次名称"
            v-decorator="['lotteryName', { rules: [{ required: true, message: '请输入轮次名称' }] }]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="抽奖轮次">
          <a-input
            placeholder="请输入抽奖轮次"
            v-decorator="['lotteryNumber', { rules: [{ required: true, message: '请输入抽奖轮次' }] }]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开奖时间">
          <a-date-picker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            v-decorator="['lotteryTime', { rules: [{ required: true, message: '请输入开奖时间' }] }]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="抽奖资格">
          <span>累计在线观看时长达到</span>
          <a-input
            placeholder="请输入时间"
            style="width:170px;margin:0 10px;"
            v-decorator="['lotteryQualification', { rules: [{ required: true, message: '请输入时间' }] }]"
          />
          <span>分钟</span>
        </a-form-item>

        <div style="background: #f2f2f2;padding:20px;margin-bottom:20px;">
          <div class="title">中奖奖品</div>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="奖品类型">
            <a-radio-group v-decorator="['lotteryPrizeType', {}]" @change="lotteryPrizeTypeRadio">
              <a-radio :value="0">
                礼品
              </a-radio>
              <a-radio :value="1">
                优惠券
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="奖品信息">
            <a-select
              style="width:250px"
              placeholder="请选择"
              v-decorator="['lotteryPrizeId', {}]"
              v-if="lotteryPrizeType == 0"
            >
              <a-select-option :value="0">请选择</a-select-option>
              <a-select-option v-for="(item, index) in findMarketingLivePrizeList" :value="item.id" :key="index">
                {{ item.name }}
              </a-select-option>
            </a-select>

            <!-- v-decorator="['lotteryPrizeId1', {}]" -->
            <a-select style="width:250px" placeholder="请选择" v-model="lotteryPrizeId1" v-else>
              <a-select-option :value="0">请选择</a-select-option>
              <a-select-option v-for="(item, index) in findMarketingLivePrizeList" :value="item.id" :key="index">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="奖励数量">
            <a-input
              placeholder="请输入奖励数量"
              v-decorator="['lotteryPrizeQuantity', { initialValue: 1 }]"
              disabled
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="奖励总量">
            <a-input placeholder="请输入奖励总量" v-decorator="['lotteryPrizeTotal', {}]" />
          </a-form-item>
        </div>
        <div style="background: #f2f2f2;padding:20px;margin-bottom:20px;">
          <div class="title">未中奖奖品</div>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="奖品类型">
            <a-radio-group v-decorator="['losingLotteryPrizeType', {}]" @change="losingLotteryPrizeTypeRadio">
              <a-radio :value="1">
                优惠券
              </a-radio>
              <a-radio :value="0">
                无
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="奖品信息">
            <a-select
              style="width:250px"
              placeholder="请选择"
              v-decorator="['losingLotteryPrizeId', {}]"
              v-if="losingLotteryPrizeType == 1"
            >
              <a-select-option value="">请选择</a-select-option>
              <a-select-option v-for="(item, index) in findMarketingLivePrizeLists" :value="item.id" :key="index">
                {{ item.name }}
              </a-select-option>
            </a-select>
            <span v-else>无</span>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="奖励数量">
            <a-input
              placeholder="请输入奖励"
              v-decorator="['losingLotteryPrizeQuantity', { initialValue: 1 }]"
              v-if="losingLotteryPrizeType == 1"
              disabled
            />
            <span v-else>-</span>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="奖品总量">
            <!-- <a-input placeholder="无限制" v-decorator="['losingLotteryPrizeTotal', {}]" /> -->
            无限制
          </a-form-item>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
export default {
  name: 'MarketingLivePrizeModal',
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      lotteryPrizeId1: '',
      streamingStreamNumber: '', //直播编号
      marketingLiveStreamingId: '', //直播间id
      roomName: '', //直播间名称
      lotteryPrizeTypeValue: 0,
      lotteryPrizeType: 0, //中奖奖品类型
      losingLotteryPrizeType: '', //未中奖奖品类型
      findMarketingLivePrizeList: '', //中奖奖品信息
      findMarketingLivePrizeLists: '', //未中奖奖品信息
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        prizeType: [
          'prizeType',
          {
            rules: [
              {
                required: true,
                message: '请选择是否显示!'
              }
            ]
          }
        ],
        superInventory: [
          'superInventory',
          {
            rules: [
              {
                required: true,
                message: '请选择是否显示!'
              }
            ]
          }
        ]
      },

      url: Object.freeze({
        add: '/marketingLiveLottery/marketingLiveLottery/add',
        edit: '/marketingLiveLottery/marketingLiveLottery/edit',
        information: '/marketing/marketingLiveStreaming/getMarketingLiveStreamingByStreamingStreamNumber', //通过直播间编号获取直播信息
        discountQueryById: 'marketingDiscount/marketingDiscount/queryById', //通过优惠券id获取优惠券信息
        livePrizeQueryById: 'marketingLivePrize/marketingLivePrize/queryById', //通过奖品id获取奖品信息
        findMarketingLivePrizeList: 'marketingLivePrize/marketingLivePrize/findMarketingLivePrizeList' //奖品下拉列表
      })
    }
  },

  created() {},

  methods: {
    // 第一次进入获取礼品的奖品信息
    // setFindMarketingLivePrizeList() {
    //   let that = this
    //   getAction(that.url.findMarketingLivePrizeList, { prizeType: 0 }).then(res => {
    //     if (res.success) {
    //       that.findMarketingLivePrizeList = res.result
    //     } else {
    //       that.$message.warning(res.message)
    //     }
    //   })
    // },
    //获取直播间名称和id
    streamingStreamNumberChange() {
      console.log(this.streamingStreamNumber)
      if (this.streamingStreamNumber) {
        this.roomName == ''
      }
      let that = this
      if (this.streamingStreamNumber != '') {
        getAction(that.url.information, { streamingStreamNumber: this.streamingStreamNumber }).then(res => {
          if (res.success) {
            that.roomName = res.result.roomName
            console.log(that.roomName)
            that.marketingLiveStreamingId = res.result.id
          } else {
            that.$message.warning(res.message)
          }
        })
      }
    },
    // 中奖奖品类型
    lotteryPrizeTypeRadio(e) {
      //切换的时候清除
      if (this.lotteryPrizeId1) {
        this.lotteryPrizeId1 = ''
      }

      this.lotteryPrizeType = e.target.value
      let that = this

      getAction(that.url.findMarketingLivePrizeList, { prizeType: this.lotteryPrizeType }).then(res => {
        if (res.success) {
          that.findMarketingLivePrizeList = res.result
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    // 未中奖奖品类型
    losingLotteryPrizeTypeRadio(e) {
      console.log(e.target.value)
      // this.findMarketingLivePrizeLists = ''
      this.losingLotteryPrizeType = e.target.value
      let that = this
      if (this.losingLotteryPrizeType == 1) {
        getAction(that.url.findMarketingLivePrizeList, { prizeType: 1, superInventory: 1 }).then(res => {
          if (res.success) {
            that.findMarketingLivePrizeLists = res.result
          } else {
            that.$message.warning(res.message)
          }
        })
      }
    },

    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()

      if (record.id) {
        record.lotteryPrizeType = record.lotteryPrizeType * 1
        record.losingLotteryPrizeType = record.losingLotteryPrizeType * 1
      }
      let that = this
      //获取直播间名称和id
      if (record.streamingStreamNumber) {
        getAction(that.url.information, { streamingStreamNumber: record.streamingStreamNumber }).then(res => {
          if (res.success) {
            that.roomName = res.result.roomName
            that.marketingLiveStreamingId = res.result.id
          } else {
            that.$message.warning(res.message)
          }
        })
      }
      //获取中奖信息
      // 奖品反显
      if (record.lotteryPrizeType == 0) {
        this.lotteryPrizeId1 = ''
        this.lotteryPrizeType = record.lotteryPrizeType
        getAction(that.url.findMarketingLivePrizeList, { prizeType: record.lotteryPrizeType }).then(res => {
          if (res.success) {
            that.findMarketingLivePrizeList = res.result
          } else {
            that.$message.warning(res.message)
          }
        })
      }

      console.log(record, 'record')
      // 优惠券反显
      if (record.lotteryPrizeType == 1) {
        this.lotteryPrizeType = record.lotteryPrizeType
        getAction(that.url.findMarketingLivePrizeList, { prizeType: record.lotteryPrizeType }).then(res => {
          if (res.success) {
            that.findMarketingLivePrizeList = res.result
          } else {
            that.$message.warning(res.message)
          }
        })
        this.lotteryPrizeId1 = record.lotteryPrizeId
      }

      //未中奖优惠券/无反显
      that.losingLotteryPrizeType = record.losingLotteryPrizeType
      if (record.losingLotteryPrizeType == 1) {
        getAction(that.url.findMarketingLivePrizeList, { prizeType: 1, superInventory: 1 }).then(res => {
          if (res.success) {
            that.findMarketingLivePrizeLists = res.result
          } else {
            that.$message.warning(res.message)
          }
        })
      }

      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'streamingStreamNumber',
            'marketingLiveStreamingId',
            'roomName',
            'lotteryName',
            'lotteryNumber',
            'lotteryTime',
            'lotteryQualification',
            'lotteryPrizeType',
            'lotteryPrizeId',
            'lotteryPrizeQuantity',
            'lotteryPrizeTotal',
            'losingLotteryPrizeType',
            'losingLotteryPrizeId',
            'losingLotteryPrizeQuantity',
            'losingLotteryPrizeTotal'
          )
        )
        //时间格式化

        this.form.setFieldsValue({ lotteryTime: this.model.lotteryTime ? moment(this.model.lotteryTime) : null })
        that.roomName = ''
        console.log(that.roomName, ' that.roomName')
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
          formData.lotteryTime = formData.lotteryTime ? formData.lotteryTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.marketingLiveStreamingId = this.marketingLiveStreamingId //直播间id

          console.log(this.lotteryPrizeId1, 'l1111111')
          if (this.lotteryPrizeId1) {
            formData.lotteryPrizeId = this.lotteryPrizeId1
            console.log(formData.lotteryPrizeId, '优惠券id')

            // delete formData.lotteryPrizeId1
          }
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

<style lang="less" scoped>
.title {
  font-weight: bold;
}
</style>
