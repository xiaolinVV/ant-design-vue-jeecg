<template>
  <a-card :bordered="false" :title="isControl ? '拼团控制' : '拼团详情'">
    <a-card :bordered="true" title="拼团信息" style="margin-bottom: 36px;">
      <detail-list :col="4">
        <detail-list-item v-for="item in cardCnt" :key="item.key" :term="item.term">
          {{ item.content }}
        </detail-list-item>
      </detail-list>
    </a-card>
    <a-card :bordered="true" title="拼团商品" style="margin-bottom: 36px;">
      <detail-list :col="4">
        <detail-list-item v-for="item in card2Cnt" :key="item.key" :term="item.term">
          <img :src="item.content" style="width:100px;height:100px" v-if="item.key == 'mainPicture'" />
          <div style="height:100px;display:flex;align-items:center" v-else>
            {{ item.content }}
          </div>
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
    <a-card :bordered="true" title="参团信息" style="margin-bottom: 36px;">
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        style="margin-bottom: 24px"
        :scroll="{ x: true }"
        v-if="!showSecondTable"
      >
        <!-- :pagination="false" -->
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

        <template slot="rewardStatus" slot-scope="text">
          <div v-if="text == 1">
            已中奖
          </div>
          <div v-else>
            未中奖
          </div>
        </template>
        <template slot="rewardType" slot-scope="text">
          <div v-if="text == 1">
            购买资格
          </div>
          <div v-else>
            {{ welfareBabelName }}
          </div>
        </template>
        <template slot="deadline" slot-scope="text">
          <div v-if="text == 0">
            不限
          </div>
          <div v-else>{{ text / 24 }}天</div>
        </template>
      </a-table>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columnsSecond"
        :dataSource="dataSourceSecond"
        style="margin-bottom: 24px"
        :scroll="{ x: true }"
        v-else
      >
        <!-- :pagination="false" -->
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

        <template slot="winning" slot-scope="text, record">
          <a-radio :checked="record.winning" @focus="selectFocus(record)">设为中奖</a-radio>
        </template>

        <template slot="rewardNumber" slot-scope="text, record">
          <a-input-number
            :min="0"
            :precision="0"
            v-model="record.rewardNumber"
            style="margin: 0 10px;"
            :disabled="record.winning"
          >
          </a-input-number>
        </template>
        <template slot="rewardType" slot-scope="text">
          <div v-if="text == 1">
            购买资格
          </div>
          <div v-else>
            {{ welfareBabelName }}
          </div>
        </template>
        <template slot="deadline" slot-scope="text">
          <div v-if="text == 0">
            不限
          </div>
          <div v-else>{{ text / 24 }}天</div>
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
          term: '团号',
          content: ' - - ',
          key: 'groupNo'
        },
        {
          term: '建团时间',
          content: ' - - ',
          key: 'buildTime'
        },
        {
          term: '拼团状态',
          content: ' - - ',
          key: 'status'
        },
        {
          term: '成团时间',
          content: ' - - ',
          key: 'successTime'
        }
      ],
      //拼团商品
      card2Cnt: [
        {
          term: '商品编号',
          content: ' - - ',
          key: 'goodNo'
        },
        {
          term: '商品图片',
          content: ' - - ',
          key: 'mainPicture'
        },
        {
          term: '商品名称',
          content: ' - - ',
          key: 'goodName'
        },
        {
          term: '市场价',
          content: ' - - ',
          key: 'marketPrice'
        },
        {
          term: '销售价',
          content: ' - - ',
          key: 'smallPrice'
        },
        {
          term: '活动价',
          content: ' - - ',
          key: 'activityPrice'
        },
        {
          term: '支付方式',
          content: ' - - ',
          key: ''
        },
        {
          term: '支付数量',
          content: ' - - ',
          key: ''
        },
        {
          term: '成团人数',
          content: ' - - ',
          key: 'numberTuxedo'
        },
        {
          term: '返回比例(%)',
          content: ' - - ',
          key: 'returnProportion'
        },
        {
          term: '活动时间',
          content: ' - - ',
          key: 'startTime'
        }
      ],
      columns: Object.freeze([
        {
          title: '参团编号',
          align: 'center',
          dataIndex: 'groupRecordNo'
        },
        {
          title: '参团时间',
          align: 'center',
          dataIndex: 'tuxedoTime'
        },
        {
          title: '商品编号',
          align: 'center',
          dataIndex: 'goodNo'
        },
        {
          title: '商品图',
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
          title: '规格',
          align: 'center',
          dataIndex: 'specification'
        },
        {
          title: '市场价',
          align: 'center',
          dataIndex: 'marketPrice'
        },
        {
          title: '销售价',
          align: 'center',
          dataIndex: 'smallPrice'
        },
        {
          title: '活动价',
          align: 'center',
          dataIndex: 'activityPrice'
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
          title: '中奖状态',
          align: 'center',
          dataIndex: 'rewardStatus',
          scopedSlots: { customRender: 'rewardStatus' }
        },
        {
          title: '奖励类型',
          align: 'center',
          dataIndex: 'rewardType',
          scopedSlots: { customRender: 'rewardType' }
        },
        {
          title: '奖励数量',
          align: 'center',
          dataIndex: 'rewardNumber'
        },
        {
          title: '期限',
          align: 'center',
          dataIndex: 'deadline',
          scopedSlots: { customRender: 'deadline' }
        }
      ]),
      dataSource: [],
      columnsSecond: Object.freeze([
        {
          title: '参团编号',
          align: 'center',
          dataIndex: 'groupRecordNo'
        },
        {
          title: '参团时间',
          align: 'center',
          dataIndex: 'tuxedoTime'
        },
        {
          title: '商品编号',
          align: 'center',
          dataIndex: 'goodNo'
        },
        {
          title: '商品图',
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
          title: '规格',
          align: 'center',
          dataIndex: 'specification'
        },
        {
          title: '市场价',
          align: 'center',
          dataIndex: 'marketPrice'
        },
        {
          title: '销售价',
          align: 'center',
          dataIndex: 'smallPrice'
        },
        {
          title: '活动价',
          align: 'center',
          dataIndex: 'activityPrice'
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
          title: '中奖状态',
          align: 'center',
          dataIndex: 'winning',
          scopedSlots: { customRender: 'winning' }
        },
        {
          title: '奖励类型',
          align: 'center',
          dataIndex: 'rewardType',
          scopedSlots: { customRender: 'rewardType' }
        },
        {
          title: '奖励数量',
          align: 'center',
          dataIndex: 'rewardNumber',
          scopedSlots: { customRender: 'rewardNumber' }
        },
        {
          title: '期限',
          align: 'center',
          dataIndex: 'deadline',
          scopedSlots: { customRender: 'deadline' }
        }
      ]),
      dataSourceSecond: [],
      url: {
        queryById: 'marketing/marketingGroupManage/queryById',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        //拼团控制
        groupControl: 'marketing/marketingGroupManage/groupControl'
      },
      isControl: false,
      model: {
        isSuccess: 0
      },
      id: ''
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
    isSuccessChange(e) {
      const value = e.target.value
      this.model.isSuccess = value
      if (value == 1) {
        console.log('执行了', this.dataSourceSecond[0])
        this.selectFocus(this.dataSourceSecond[0])
      }
    },
    getAvatarView: function(mainPicture) {
      if (mainPicture) {
        return this.url.imgerver + '/' + JSON.parse(mainPicture)[0]
      }
      return ''
    },
    handleStatus(status) {
      return status == 1 ? '已成功' : status == 2 ? '已失败' : '进行中'
    },
    loadData() {
      this.isControl = this.$route.query.isControl
      this.id = this.$route.query.id
      getAction(this.url.queryById, { id: this.$route.query.id }).then(res => {
        if (res.success) {
          const result = res.result
          let cardCnt = this.cardCnt
          let card2Cnt = this.card2Cnt
          this.cardCnt = cardCnt.map(item => ({
            ...item,
            content:
              item.key == 'status'
                ? this.handleStatus(result.marketingGroupManage[item.key])
                : result.marketingGroupManage[item.key] || ' - - '
          }))
          this.card2Cnt = card2Cnt.map(item => ({
            ...item,
            content:
              item.key == 'mainPicture'
                ? this.getAvatarView(result.marketingGroupManage[item.key])
                : result.marketingGroupManage[item.key] || ' - - '
          }))
          this.dataSource = result.iMarketingGroupRecords
          if (this.isControl) {
            let dataSourceSecond = JSON.parse(JSON.stringify(result.iMarketingGroupRecords))
            dataSourceSecond = dataSourceSecond.map((item, indexs) => {
              item.beforeRewardNumber = item.rewardNumber
              if (indexs == 0) {
                item.winning = true
                item.rewardNumber = 1
              } else {
                item.winning = false
                item.rewardNumber = item.beforeRewardNumber
              }
              return item
            })
            this.dataSourceSecond = dataSourceSecond
          }
        }
      })
    },
    sure() {
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
    },
    selectFocus(record) {
      // if (!record.winning) {
      this.dataSourceSecond = this.dataSourceSecond.map((item, index) => {
        if (item.winning) {
          item.winning = false
          item.rewardNumber = item.beforeRewardNumber
          item.rewardType = 0
        }
        return item
      })
      this.$set(record, 'winning', true)
      this.$set(record, 'rewardNumber', 1)
      this.$set(record, 'rewardType', 1)
      // }
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
