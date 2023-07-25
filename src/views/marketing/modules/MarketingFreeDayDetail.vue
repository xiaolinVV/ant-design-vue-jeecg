<template>
  <a-card :loading="cardLoading" title="免单订单" class="MarketingFreeDayDetail">
    <h5 class="sml-title">
      {{ dailySalesStatistics.serialNumber }}期，免单日{{ dailySalesStatistics.freeDay }}，免单金额统计
    </h5>
    <a-table
      bordered
      :data-source="dailySalesStatistics.marketingFreeOrderGroupByPayTime"
      :columns="dailyStatisticsColumns"
      :pagination="{
        pageSize: 5,
        hideOnSinglePage: true
      }"
    >
      <template slot="isFree" slot-scope="text">
        {{ text == 1 ? '是' : '否' }}
      </template>
    </a-table>
    <div class="table-page-search-wrapper" style="margin-top:20px">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="24">
            <a-form-item label="订单号">
              <a-input placeholder="请输入订单号" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="买家账号">
              <a-input placeholder="请输入买家账号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <!-- v-model="queryParam.createTime" -->
            <a-form-item label="付款时间">
              <a-range-picker
                style="width: 100%"
                format="YYYY-MM-DD"
                v-model="createTime"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="免单状态">
              <a-select placeholder="请选择免单状态" v-model="queryParam.freeStatus">
                <a-select-option :value="0">未免单</a-select-option>
                <a-select-option :value="1">已免单</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="24" :sm="24" style="margin-bottom:10px">
            <span class="table-operator">
              <a-button type="primary" @click="searchQuery" icon="search" style="margin-bottom:10px">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
              <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('订单列表')">导出</a-button>
              <a-button type="primary" @click="forFree()">批量免单</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table
      :columns="orderColumns"
      :loading="loading"
      :row-selection="rowSelection"
      rowKey="id"
      :data-source="orderDataSource"
      :pagination="secondPagination"
      @change="handleTableChange"
      :scroll="{ x: 2000 }"
    >
      <template slot="operation" slot-scope="text, record">
        <a href="javascript:;" @click="particulars(record)">详情</a>
        <a-divider type="vertical" />
        <a href="javascript:;" v-if="record.freeStatus != 1" @click="forFree(record)">免单</a>
      </template>
      <template slot="modePayment" slot-scope="text">
        <!-- 支付方式；0：微信；1：支付宝 -->
        <div v-if="text == 0">微信</div>
        <div v-else-if="text == 1">支付宝</div>
        <div v-else>- -</div>
      </template>
      <template slot="freeStatus" slot-scope="text">
        <!-- 免单状态；0：未免单；1：已免单-->
        <div v-if="text == 0">未免单</div>
        <div v-else-if="text == 1">已免单</div>
        <div v-else>- -</div>
      </template>
      <template slot="phone" slot-scope="text, record">
        <a href="javascript:;" @click="showModalEmemberInformation(record)">{{ text }}</a>
      </template>

      <template slot="distribution" slot-scope="text, record, index">
        <a @click="showModalDistributionInformation(record)">
          <div v-for="(item, index) of distribution" :key="index">
            <div v-if="record.distribution == item.value">{{ item.text }}</div>
          </div>
        </a>
      </template>

      <template slot="shopsDetail" slot-scope="text, record">
        <a href="javascript:;" @click="showModalGoodsInformation(record)">商品详情</a>
      </template>
    </a-table>
    <MarketingActivityOrderListModal ref="modalForm"></MarketingActivityOrderListModal>
  </a-card>
</template>
<script>
import MarketingActivityOrderListModal from './MarketingActivityOrderListModal'
import { httpAction, getAction, postAction } from '@/api/manage'
//字典
import { filterDictText, initDictOptions } from '@/components/dict/JDictSelectUtil'
export default {
  name: 'MarketingFreeDayDetail',
  components: {
    MarketingActivityOrderListModal
  },
  data() {
    return {
      marketingFreeSessionId: '',
      createTime: '',
      //日销售额统计
      dailySalesStatistics: {},
      dailyStatisticsColumns: Object.freeze([
        {
          title: '日期',
          dataIndex: 'payTime',
          align: 'center'
        },
        {
          title: '交易数量（笔）',
          dataIndex: 'times',
          align: 'center'
        },
        {
          title: '交易金额',
          dataIndex: 'actualPayment',
          align: 'center'
        },
        {
          title: '交易余额',
          dataIndex: 'balance',
          align: 'center'
        },
        {
          title: '总交易金额(元)',
          dataIndex: 'total',
          align: 'center'
        },
        {
          title: '是否免单日',
          dataIndex: 'isFree',
          scopedSlots: { customRender: 'isFree' },
          align: 'center'
        }
      ]),
      queryParam: {},
      loading: false,
      orderColumns: Object.freeze([
        {
          title: '订单编号',
          dataIndex: 'orderNo',
          align: 'center'
        },
        {
          title: '买家',
          dataIndex: 'phone',
          align: 'center',
          scopedSlots: { customRender: 'phone' }
        },
        {
          title: '商品',
          dataIndex: 'shopsDetail',
          align: 'center',
          scopedSlots: { customRender: 'shopsDetail' }
        },
        {
          title: '商品总价',
          dataIndex: 'goodsTotal',
          align: 'center'
        },
        {
          title: '配送方式',
          dataIndex: 'distribution',
          align: 'center',
          scopedSlots: { customRender: 'distribution' }
        },
        {
          title: '配送费用',
          dataIndex: 'shipFee',
          align: 'center'
        },
        {
          title: '应付款',
          dataIndex: 'customaryDues',
          align: 'center'
        },
        {
          title: '实付款',
          dataIndex: 'actualPayment',
          align: 'center'
        },
        {
          title: '支付方式',
          dataIndex: 'modePayment',
          align: 'center',
          scopedSlots: { customRender: 'modePayment' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center'
        },
        {
          title: '付款时间',
          dataIndex: 'payTime',
          align: 'center'
        },
        {
          title: '免单状态',
          dataIndex: 'freeStatus',
          align: 'center',
          scopedSlots: { customRender: 'freeStatus' }
        },
        {
          title: '免单日',
          dataIndex: 'freeDay',
          align: 'center',
          scopedSlots: { customRender: 'freeDay' }
        },

        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          width: 200,
          fixed: 'right',
          scopedSlots: { customRender: 'operation' }
        }
      ]),
      orderDataSource: [],
      selectedRowKeys: [],
      distribution: [],
      secondPagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: false,
        showSizeChanger: false,
        total: 0
      },
      url: Object.freeze({
        //场次分组订单信息(1) marketingFreeSessionId
        selectMarketingFreeOrderGroupByPayTime: 'marketing/marketingFreeOrder/selectMarketingFreeOrderGroupByPayTime',
        //免单场次订单列表 marketingFreeSessionId
        selectMarketingFreeOrderByMarketingFreeSessionId:
          'marketing/marketingFreeOrder/selectMarketingFreeOrderByMarketingFreeSessionId',
        // 设置场次免单日（1）
        settingMarketingFreeSessionByFreeDay: 'marketing/marketingFreeSession/settingMarketingFreeSessionByFreeDay',
        //将免单的订单进行免单处理(1)
        freeChargeOrder: 'marketing/marketingFreeOrder/freeChargeOrder'
      })
    }
  },
  created() {
    this.marketingFreeSessionId = this.$route.query.id
    this.initIndex()
    this.loadData()
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: record => ({
          props: {
            disabled: record.freeStatus === '1' // Column configuration not to be checked
            // name: record.name,
          }
        })
      }
    }
  },
  methods: {
    async handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      // if (Object.keys(sorter).length > 0) {
      //   this.isorter.column = sorter.field
      //   this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      // }
      this.secondPagination = { ...this.secondPagination, ...pagination }
      await this.$nextTick()
      this.loadData()
    },
    loadData(type = 'all') {
      if (type == 'all') {
        this.cardLoading = true
      } else {
        this.loading = true
      }

      const marketingFreeSessionId = this.marketingFreeSessionId
      if (type == 'all') {
        getAction(this.url.selectMarketingFreeOrderGroupByPayTime, { marketingFreeSessionId, isFree: 1 }).then(res => {
          if (res.success) {
            this.dailySalesStatistics = Object.freeze(res.result || {})
          } else {
            this.$message.error(res.message)
          }
        })
      }

      getAction(this.url.selectMarketingFreeOrderByMarketingFreeSessionId, {
        marketingFreeSessionId,
        isFree: 1,
        ...this.queryParam,
        pageNo: this.secondPagination.current,
        pageSize: this.secondPagination.pageSize
      }).then(res => {
        if (type == 'all') {
          this.cardLoading = false
        } else {
          this.loading = false
        }
        if (res.success) {
          console.log(res)
          this.secondPagination.total = res.result.total
          this.orderDataSource = res.result.records
        } else {
          this.$message.error(res.message)
        }
      })
    },

    //免单
    forFree(record = '') {
      let marketingFreeOrderIds = '',
        that = this
      // if (!this.url.delete) {
      //   this.$message.error('请设置url.delete属性!')
      //   return
      // }
      console.log(record)
      if (record) {
        marketingFreeOrderIds = record.id
      } else {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！')
          return
        }
        marketingFreeOrderIds = this.selectedRowKeys.join(',')
      }
      that.$confirm({
        title: `将要这 ${record ? 1 : that.selectedRowKeys.length} 个订单设置为免单吗。`,
        content: '点击确定后订单的免单状态将生效，订单所支付金额将退回到用户的余额中',
        onOk: function() {
          getAction(that.url.freeChargeOrder, { marketingFreeOrderIds }).then(res => {
            console.log(res)
            if (res.success) {
              that.$message.success(res.message)
              that.loadData('part')
              that.selectedRowKeys = []
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    onDateChange: function(value, dateString) {
      this.queryParam.payTimeStart = dateString[0]
      this.queryParam.payTimeEnd = dateString[1]
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    searchQuery() {
      this.loadData('part')
    },
    async searchReset() {
      this.queryParam = {}
      this.createTime = ''
      await this.$nextTick()
      this.loadData('part')
    },
    handleExportXls() {},
    //会员信息
    showModalEmemberInformation(record) {
      console.log(record)
      this.$refs.modalForm.showModalEmemberInformation(
        record, //memberList
        record.consignee,
        record.contactNumber,
        record.shippingAddress,
        '' //houseNumber
      )
      this.$refs.modalForm.title = '会员信息'
      this.$refs.modalForm.disableSubmit = false
    },
    //商品信息
    showModalGoodsInformation(record) {
      this.$refs.modalForm.showModalGoodsInformation(record)
      this.$refs.modalForm.title = '商品信息'
      this.$refs.modalForm.disableSubmit = false
    },
    //配送方式信息
    showModalDistributionInformation(record) {
      this.$refs.modalForm.showModalDistributionInformation(record)
      this.$refs.modalForm.title = '配送方式'
      this.$refs.modalForm.disableSubmit = false
    },
    //跳转详情
    particulars(record) {
      //reusePage：1 已取消订单 2 待付款订单 3 待发货订单 4 待收货订单 5 交易成功订单
      localStorage.setItem('OrderDetails', JSON.stringify(record))
      this.$router.push({ path: '/order/OrderDetails', query: { record: record, reusePage: record.status } }) //reusePage=1
    },
    initIndex() {
      initDictOptions('oder_distribution').then(res => {
        if (res.success) {
          this.distribution = res.result
        }
      })
    }
  }
}
</script>
<style lang="scss">
.MarketingFreeDayDetail {
  .sml-title {
    font-weight: 700;
    margin-bottom: 20px;
  }
}
</style>
