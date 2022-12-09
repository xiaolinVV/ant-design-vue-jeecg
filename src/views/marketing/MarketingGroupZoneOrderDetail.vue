<template>
  <a-card :bordered="false" :title="isControl ? '拼团控制' : '拼团详情'">
    <a-card :bordered="true" title="拼团信息" style="margin-bottom: 36px;">
      <detail-list :col="4">
        <detail-list-item v-for="item in cardCnt" :key="item.key" :term="item.term">
          {{ item.content }}
        </detail-list-item>
      </detail-list>
    </a-card>

    <a-card :bordered="true" title="拼团控制" style="margin-bottom: 36px;" v-if="isControl">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否成团">
          <a-radio-group v-decorator="validatorRules.isSuccess" @change="isSuccessChange">
            <a-radio :value="0">
              失败
            </a-radio>
            <a-radio :value="1">
              成团
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card :bordered="true" title="拼购信息" style="margin-bottom: 36px;">
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        style="margin-bottom: 24px"
        :scroll="{ x: 2000 }"
      >
        <template slot="mainPicture" slot-scope="text">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(text)" icon="user" />
          </div>
        </template>
        <template slot="headPortrait" slot-scope="text">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="text" icon="user" />
          </div>
        </template>

        <template slot="status" slot-scope="text">
          <div v-if="text == 1">
            已中奖
          </div>
          <div v-else>
            未中奖
          </div>
        </template>
        <template slot="memberType" slot-scope="text">
          <div v-if="text == 1">
            vip会员
          </div>
          <div v-else>
            普通会员
          </div>
        </template>
        <template slot="identity" slot-scope="text">
          <div v-if="text == 1">
            发起人
          </div>
          <div v-else>
            参与人
          </div>
        </template>
        <template slot="payPrice" slot-scope="text">
          <a>{{ text }}</a>
        </template>
      </a-table>
    </a-card>
    <div class="button-operation">
      <a-button type="primary" @click="sure" v-if="isControl">
        确认
      </a-button>
      <a-button type="default" @click="back">
        返回
      </a-button>
    </div>
  </a-card>
</template>
<script>
import DetailList from '@/components/tools/DetailList'
import { getAction, putAction, postAction } from '@/api/manage'
const DetailListItem = DetailList.Item

export default {
  name: 'MarketingGroupOrderDetail',
  data() {
    return {
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      validatorRules: {
        isSuccess: [
          'isSuccess',
          {
            rules: [
              {
                required: true,
                message: '请选择是否成团'
              }
            ]
          }
        ]
      },
      //拼团信息
      cardCnt: [
        {
          term: '场次编号',
          content: ' - - ',
          key: 'serialNumber'
        },
        {
          term: '活动名称',
          content: ' - - ',
          key: 'zoneName'
        },
        {
          term: '活动价格',
          content: ' - - ',
          key: 'price'
        },
        {
          term: '虚拟成团人数',
          content: ' - - ',
          key: 'virtualGroupMembers'
        },
        {
          term: '实际成团人数',
          content: ' - - ',
          key: 'actualGroupSize'
        },
        {
          term: '拼团开始时间',
          content: ' - - ',
          key: 'startTime'
        },
        {
          term: '拼团结束时间',
          content: ' - - ',
          key: 'endTime'
        },
        {
          term: '拼团人数',
          content: ' - - ',
          key: 'numberSum'
        },
        {
          term: '拼团状态',
          content: ' - - ',
          key: 'status'
        },
        {
          term: '成团时间',
          content: ' - - ',
          key: 'cloudsTime'
        },
        {
          term: '失败时间',
          content: ' - - ',
          key: 'failureTime'
        }
      ],

      columns: Object.freeze([
        {
          title: '拼团编号',
          align: 'center',
          dataIndex: 'marketingZoneGroupManageId'
        },
        {
          title: '拼团时间',
          align: 'center',
          dataIndex: 'tuxedoTime'
        },
        {
          title: '活动名称',
          align: 'center',
          dataIndex: 'zoneName'
        },
        {
          title: '商品编号',
          align: 'center',
          dataIndex: 'goodNo'
        },
        {
          title: '商品主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '商品名称',
          align: 'center',
          dataIndex: 'goodName'
        },
        {
          title: '商品规格',
          align: 'center',
          dataIndex: 'specification'
        },
        {
          title: '购买数量',
          align: 'center',
          dataIndex: 'quantity'
        },
        {
          title: '支付金额',
          align: 'center',
          dataIndex: 'payPrice',
          scopedSlots: { customRender: 'payPrice' }
        },
        {
          title: '会员头像',
          align: 'center',
          dataIndex: 'headPortrait',
          scopedSlots: { customRender: 'headPortrait' }
        },
        {
          title: '会员手机号',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '会员昵称',
          align: 'center',
          dataIndex: 'nickName'
        },
        {
          //  0：普通会员；1：vip会员
          title: '会员身份',
          align: 'center',
          dataIndex: 'memberType',
          scopedSlots: { customRender: 'memberType' }
        },
        {
          // 0：参与人；1：发起人
          title: '拼团身份',
          align: 'center',
          dataIndex: 'identity',
          scopedSlots: { customRender: 'identity' }
        },

        {
          // 0：未中奖；1：已中奖；2：失败
          title: '中奖状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        }
      ]),
      dataSource: [],

      url: {
        queryById: 'marketingZoneGroupRecord/marketingZoneGroupRecord/list',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        //拼团控制
        groupControl: 'marketing/marketingGroupManage/groupControl'
      },
      isControl: false,
      model: {
        isSuccess: 0
      },
      record: ''
    }
  },
  components: {
    DetailListItem,
    DetailList
  },
  created() {
    this.loadData()
  },
  mounted() {
    if (this.isControl) {
      this.form.setFieldsValue(this.model)
    }
  },
  computed: {
    showSecondTable({ isControl, model }) {
      return isControl && model.isSuccess == 1
    }
  },
  methods: {
    getAvatarView: function(mainPicture) {
      if (mainPicture) {
        return this.url.imgerver + '/' + JSON.parse(mainPicture)[0]
      }
      return ''
    },
    handleStatus(status) {
      return status == 1 ? '已成功' : status == 2 ? '已失败' : status == '0' ? '进行中' : ' - - '
    },
    loadData() {
      const result = this.$route.query.record
      this.isControl = this.$route.query.isControl
      this.record = result
      let cardCnt = this.cardCnt

      this.cardCnt = cardCnt.map(item => ({
        ...item,
        content: item.key == 'status' ? this.handleStatus(result[item.key]) : result[item.key] || ' - - '
      }))

      getAction(this.url.queryById, { marketingZoneGroupManageId: result.id }).then(res => {
        if (res.success) {
          this.dataSource = res.result.recordds
        }
      })
    },
    sure() {
      return
      this.form.validateFields((err, values) => {
        if (!err) {
          let result = this.dataSourceSecond.every(item => item.rewardNumber)
          if (!result && values.isSuccess == 1) {
            this.$message.warn('请填写完整数据')
            return
          }
          let params = {
            marketingGroupManageId: this.id,
            isSuccess: values.isSuccess
          }
          if (values.isSuccess == 1) {
            let marketingGroupJson = []
            marketingGroupJson = this.dataSourceSecond.map(item => {
              let obj = {
                marketingGroupRecordId: item.id,
                winning: item.winning ? 1 : 0,
                rewardNumber: item.rewardNumber
              }
              return obj
            })
            marketingGroupJson = encodeURIComponent(JSON.stringify(marketingGroupJson))
            params.marketingGroupJson = marketingGroupJson
          }
          console.log(params)
          getAction(this.url.groupControl, params).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              this.back()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.button-operation {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  width: 200px;

  button {
    width: 80px;
  }
}
</style>
