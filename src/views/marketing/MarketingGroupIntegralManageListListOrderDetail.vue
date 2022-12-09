<template>
  <a-card :bordered="false" :title="isControl ? '拼购控制' : '拼购详情'">
    <a-card :bordered="true" title="拼团信息" style="margin-bottom: 36px;">
      <detail-list :col="4">
        <detail-list-item v-for="item in cardCnt" :key="item.key" :term="item.term">
          {{ item.content }}
        </detail-list-item>
      </detail-list>
    </a-card>

    <a-card :bordered="true" title="拼团控制" style="margin-bottom: 36px;" v-if="isControl">
      <a-form :form="form" layout="inline">
        <!-- :labelCol="labelCol" :wrapperCol="wrapperCol" -->
        <a-form-item label="是否成团">
          <a-radio-group v-decorator="validatorRules.isSuccess">
            <a-radio :value="0">
              失败
            </a-radio>
            <a-radio :value="1">
              成团
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="设置中奖人">
          <a-select v-decorator="validatorRules.winner" placeholder="请设置中奖人" style="width:250px">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option :value="0">待结算</a-select-option>
            <a-select-option :value="1">待打款</a-select-option>
            <a-select-option :value="2">已付款</a-select-option>
            <a-select-option :value="3">无效</a-select-option>
          </a-select>
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
        :pagination="ipagination"
        :loading="loading"
        :scroll="{ x: 2000 }"
        @change="handleTableChange"
      >
        <template slot="mainPicture" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="text != undefined"
            :preview="'mainPicture' + index"
            :src="handleImage(text)"
            alt=""
          />
          <a-avatar shape="square" v-if="text == undefined || text == ''" :src="handleImage(text)" icon="user" />
        </template>
        <template slot="payment" slot-scope="text">
          {{ text == 0 ? '产品券' : ' - ' }}
        </template>
        <template slot="headPortrait" slot-scope="text, record, index">
          <img class="clickShowImage" v-if="text != undefined" :preview="'headPortrait' + index" :src="text" alt="" />
          <a-avatar shape="square" v-if="text == undefined || text == ''" :src="text" icon="user" />
        </template>

        <template slot="identity" slot-scope="text">
          {{ text == 0 ? '参与人' : '发起人' }}
        </template>
        <template slot="winningState" slot-scope="text">
          <div v-if="text == 1">已中奖</div>
          <div v-else-if="text == 2">未中奖</div>
          <div v-else>进行中</div>
        </template>
        <template slot="rewardType" slot-scope="text">
          {{ text == 0 ? '产品券' : ' - ' }}
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
  name: 'MarketingGroupIntegralManageListListOrderDetail',
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
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false,
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
        ],
        winner: [
          'winner',
          {
            rules: [
              {
                required: true,
                message: '请设置中奖人'
              }
            ]
          }
        ]
      },
      cardCnt: [
        {
          term: '场次编号',
          content: ' - - ',
          key: 'serialNumber'
        },
        {
          term: '活动名称',
          content: ' - - ',
          key: 'anotherName'
        },
        {
          term: '支付方式',
          content: ' - - ',
          key: 'payment'
        },
        {
          term: '支付金额',
          content: ' - - ',
          key: 'paymentAmount'
        },
        {
          term: '成团人数',
          content: ' - - ',
          key: 'numberClusters'
        },
        {
          term: '拼购开始时间',
          content: ' - - ',
          key: 'startTime'
        },
        {
          term: '参团人数',
          content: ' - - ',
          key: ''
        },
        {
          term: '拼购状态',
          content: ' - - ',
          key: 'status'
        },
        {
          term: '拼购结束时间',
          content: ' - - ',
          key: 'endTime'
        },
        {
          term: '成团时间',
          content: ' - - ',
          key: 'createTime'
        },
        {
          term: '失败时间',
          content: ' - - ',
          key: 'defeatedTime'
        }
      ],
      columns: [
        {
          title: '拼购编号',
          align: 'center',
          dataIndex: 'groupSerialNumber'
        },
        {
          title: '参与时间',
          align: 'center',
          dataIndex: 'participationTime'
        },
        {
          title: '主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '活动名称',
          align: 'center',
          dataIndex: 'anotherName'
        },
        {
          // ；0：产品券
          title: '支付方式',
          align: 'center',
          dataIndex: 'payment',
          scopedSlots: { customRender: 'payment' }
        },
        {
          title: '支付金额',
          align: 'center',
          dataIndex: 'paymentAmount'
        },
        {
          title: '购买数量',
          align: 'center',
          dataIndex: 'purchaseQuantity'
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
          // ；0：参与人；1：发起人
          title: '拼购身份',
          align: 'center',
          dataIndex: 'identity',
          scopedSlots: { customRender: 'identity' }
        },
        {
          // ；0：进行中；1：已中奖；2：未中奖
          title: '中奖状态',
          align: 'center',
          dataIndex: 'winningState',
          scopedSlots: { customRender: 'winningState' }
        },
        {
          // ；0：产品券
          title: '奖励类型',
          align: 'center',
          dataIndex: 'rewardType',
          scopedSlots: { customRender: 'rewardType' }
        },
        {
          title: '奖励数量',
          align: 'center',
          dataIndex: 'missedRewards'
        }
      ],
      isControl: false,
      recordResult: {},
      dataSource: [],
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        hideOnSinglePage: true,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      url: {
        queryById: 'marketing/marketingGroupIntegralManageRecord/getByMarketingGroupIntegralManageListId',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        //拼团控制
        groupControl: 'marketing/marketingGroupManage/groupControl'
      }
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    sure() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let params = {
            id: this.recordResult.id,
            ...values
          }
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
    handleImage(imgUrl) {
      if (imgUrl) {
        try {
          return this.url.imgerver + '/' + Object.values(JSON.parse(imgUrl))[0]
        } catch (error) {
          console.error(error, '图片解析出错')
        }
      }
      return ''
    },
    loadData() {
      this.isControl = !this.$route.query.isControl
      try {
        this.recordResult = JSON.parse(this.$route.query.recordResult)
      } catch (error) {
        console.warn(error)
      }

      let result = this.recordResult
      console.log(result)
      let cardCnt = this.cardCnt
      this.cardCnt = cardCnt.map(item => ({
        ...item,
        content:
          item.key == 'status'
            ? this.handleStatus(result[item.key])
            : item.key == 'payment'
            ? this.handlePayment(result[item.key])
            : result[item.key] || ' - - '
      }))
      this.getDataSource()
    },
    handleStatus(status) {
      return status == 1 ? '已成功' : status == 2 ? '已失败' : '进行中'
    },
    handlePayment(payment) {
      return payment == 0 ? '产品券' : ' - '
    },
    getDataSource() {
      var params = {
        marketingGroupIntegralManageListId: this.recordResult.id || '',
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize
      } //查询条件

      this.loading = true
      getAction(this.url.queryById, params).then(res => {
        if (res.success) {
          const dataSource = res.result && res.result.records ? res.result.records || [] : []
          this.dataSource = dataSource
          if (this.isControl) {
          }
          this.ipagination.total = res.result ? res.result.total || 0 : 0
        } else {
          this.$message.warning(res.message)
        }

        this.loading = false
      })
    },
    async handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      this.ipagination = pagination
      await this.$nextTick()
      this.loadData()
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
