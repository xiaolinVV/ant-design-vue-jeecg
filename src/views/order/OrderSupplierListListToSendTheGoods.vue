<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="供应商订单编号">
              <a-input placeholder="请输入供应商订单编号" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <!--<a-col :md="6" :sm="8">-->
          <!--<a-form-item label="订单类型">-->
          <!--<j-dict-select-tag v-model="queryParam.orderType" placeholder="请选择"-->
          <!--dictCode="order_type"/>-->
          <!--</a-form-item>-->
          <!--</a-col>-->

          <a-col :md="6" :sm="8">
            <a-form-item label="买家账号">
              <a-input placeholder="请输入买家账号" v-model="queryParam.memberPhone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="部分发货">
              <a-select v-model="queryParam.isSender" placeholder="请选择部分发货">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">否</a-select-option>
                <a-select-option :value="1">是</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="6" :sm="8"> -->
          <!-- <a-form-item label="订单状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">待付款</a-select-option>
                <a-select-option :value="1">待发货</a-select-option>
                <a-select-option :value="2">待收货</a-select-option>
                <a-select-option :value="3">交易成功</a-select-option>
                <a-select-option :value="4">交易关闭</a-select-option>
                <a-select-option :value="5">交易完成</a-select-option>
              </a-select>
            </a-form-item> -->
          <!-- </a-col> -->
          <!-- <a-col :md="6" :sm="8" v-if="is1688GYS">
            <a-form-item label="下单状态">
              <a-select v-model="queryParam.orderStatus" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">未下单</a-select-option>
                <a-select-option :value="1">部分下单</a-select-option>
                <a-select-option :value="2">全部下单</a-select-option>
              </a-select>
            </a-form-item>
          </a-col> -->

          <!--时间选择框-->
          <!-- <a-col :md="6" :sm="8">
            <a-form-item label="关闭时间">
              <a-range-picker
                v-model="queryParam.closeTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange1"
                @ok="onDateOk1"
              />
            </a-form-item>
          </a-col> -->
          <!--时间选择框-->
          <!-- <a-col :md="6" :sm="8">
            <a-form-item label="创建时间">
              <a-range-picker
                v-model="queryParam.createTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col> -->
          <!--付款时间选择框-->
          <a-col :md="6" :sm="8">
            <a-form-item label="付款时间">
              <a-range-picker
                v-model="queryParam.payTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange2"
              />
            </a-form-item>
          </a-col>
          <!--发货时间选择框-->
          <!-- <a-col :md="6" :sm="8">
            <a-form-item label="发货时间">
              <a-range-picker
                v-model="queryParam.shipmentsTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange3"
              />
            </a-form-item>
          </a-col> -->
          <!--收货时间选择框-->
          <!-- <a-col :md="6" :sm="8">
            <a-form-item label="收货时间">
              <a-range-picker
                v-model="queryParam.deliveryTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange4"
              />
            </a-form-item>
          </a-col> -->

          <a-col :md="24" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" icon="download" @click="orderListExport()">导出预览</a-button>
      <a-button type="primary" v-if="is1688GYS" @click="showDownOrder">批量下单</a-button>
    </div>
    <!--<div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('订单列表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>-->

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{ x: true }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="rowSelection"
        @change="handleTableChange"
      >
        <template slot="memberPhone" slot-scope="text, record, index">
          <div>
            <a
              @click="
                showModalEmemberInformation(
                  record.orderList.memberList,
                  record.orderList.consignee,
                  record.orderList.contactNumber,
                  record.orderList.shippingAddress,
                  record.orderList.houseNumber
                )
              "
              >{{ record.orderList.memberList.phone }}</a
            >
          </div>
        </template>
        <template slot="goods" slot-scope="text, record, index">
          <div>
            <a @click="showModalGoodsInformation(record)">商品信息</a>
          </div>
        </template>
        <!-- <template slot="memberPhone" slot-scope="text">
          <a>{{ text }}</a>
        </template> -->

        <template slot="message" slot-scope="text, record, index">
          <div>
            <a v-if="record.message" @click="showModalMessageInformation(record.message)">留言</a>
            <a v-else>-</a>
          </div>
        </template>
        <template slot="distribution" slot-scope="text, record, index">
          <a @click="showModalDistributionInformation(record.providerTemplateMaps)">
            <div v-for="item of distribution">
              <div v-if="record.distribution == item.value">{{ item.text }}</div>
            </div>
          </a>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">待付款</span>
            <span shape="square" v-if="record.status == 1">待发货</span>
            <span shape="square" v-if="record.status == 2">待收货</span>
            <span shape="square" v-if="record.status == 3">交易成功</span>
            <span shape="square" v-if="record.status == 4">交易关闭</span>
            <span shape="square" v-if="record.status == 5">交易完成</span>
          </div>
        </template>
        <!--<template slot="coupon" slot-scope="text, record, index">-->
        <!--<div>-->
        <!--<a v-if="record.coupon"-->
        <!--@click="showModalCouponInformation(record.marketingDiscountCoupon,record.welfarePayments,record.vipLowerTotal,record.memberList)">{{-->
        <!--record.coupon }}</a>-->
        <!--<a v-else>-</a>-->
        <!--</div>-->
        <!--</template>-->

        <template slot="isUpdateAddr" slot-scope="text, record, index">
          <div>
            {{ record.orderList.isUpdateAddr == 0 ? '有' : '无' }}
          </div>
        </template>
        <template slot="orderStatus" slot-scope="text">
          <a v-if="text == 0">未下单</a>
          <a v-if="text == 1">部分下单</a>
          <a v-if="text == 2">全部下单</a>
        </template>
        <template slot="isSender" slot-scope="text">
          <div v-if="text == 0">否</div>
          <div v-if="text == 1">是</div>
        </template>
        <!--操作部分-->
        <template slot="action" slot-scope="text, record">
          <!--待付款订单操作-->
          <div v-if="record.status == '0'">
            <!--<a @click="showModalCancelInformation(record.orderList.id)">取消</a>-->
            <a-divider type="vertical" />
            <a
              @click="
                showModalAddressInformation(
                  record.orderList.id,
                  record.orderList.memberListId,
                  record.orderList.consignee,
                  record.orderList.contactNumber,
                  record.orderList.shippingAddress
                )
              "
              >修改地址</a
            >
            <a-divider type="vertical" />
            <a @click="particulars(record, 2)">详情</a>
          </div>
          <!--待发货订单操作-->
          <div v-if="record.status == '1'">
            <a @click="to1688Goods(record)" v-if="is1688GYS">下单结果</a>
            <a-divider type="vertical" v-if="is1688GYS" />
            <a @click="deliverGoods(record)" v-if="!is1688GYS">下单</a>
            <a-divider type="vertical" v-if="!is1688GYS" />
            <a @click="deliverGoods(record)">发货</a>
            <a-divider type="vertical" />
            <a @click="particulars(record, 3)">详情</a>

            <a-divider v-if="record.isSender == 1" type="vertical" />
            <a v-if="record.isSender == 1" @click="checkLogistics(record, 3)">查看物流</a>
          </div>
          <!--待收货订单操作-->
          <div v-if="record.status == '2'">
            <a @click="checkLogistics(record, 4)">查看物流</a>
            <a-divider type="vertical" />
            <a @click="particulars(record, 4)">详情</a>
          </div>
          <!--交易成功订单操作-->
          <div v-if="record.status == '3'">
            <!--<a @click="showAudiModal(record.id)" v-if="record.isEvaluate == 1">审批</a>-->
            <!--v-if="record.isEvaluate == 1"-->
            <a-divider
              type="vertical"
              v-if="record.orderEvaluateDTOList.length > 0"
            /><!--v-if="record.isEvaluate == 1"-->
            <a @click="showEvaluateModal(record.id)" v-if="record.orderEvaluateDTOList.length > 0">查看评价</a>
            <!--v-if="record.isEvaluate == '1'"-->
            <a-divider type="vertical" />
            <a @click="checkLogistics(record, 5)">查看物流</a>
            <a-divider type="vertical" />
            <a @click="particulars(record, 5)">详情</a>
          </div>
          <!--已取消订单操作-->
          <div v-if="record.status == '4'">
            <a @click="particulars(record, 1)">详情</a>
            <!--<a-divider type="vertical"/>-->
            <!--<a @click="showModalDeletess(record.id)">删除</a>-->
          </div>
          <!--交易成功订单操作-->
          <div v-if="record.status == '5'">
            <!--<a @click="showAudiModal(record.id)" v-if="record.isEvaluate == 1">审批</a>-->
            <!--v-if="record.isEvaluate == 1"-->
            <a-divider
              type="vertical"
              v-if="record.orderEvaluateDTOList.length > 0"
            /><!--v-if="record.isEvaluate == 1"-->
            <a @click="showEvaluateModal(record)" v-if="record.orderEvaluateDTOList.length > 0">查看评价</a>
            <!--v-if="record.isEvaluate == '1'"-->
            <a-divider type="vertical" />
            <a @click="checkLogistics(record, 5)">查看物流</a>
            <a-divider type="vertical" />
            <a @click="particulars(record, 5)">详情</a>
          </div>
        </template>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <!--<orderList-modal ref="modalForm" @ok="modalFormOk"></orderList-modal>-->
    <order-provider-list-modal ref="modalForm" @ok="modalFormOk"></order-provider-list-modal>
  </a-card>
</template>

<script>
import OrderProviderListModal from './modules/OrderProviderListModal.vue'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { deleteAction, getAction, downFile, putAction } from '@/api/manage'
//字典
import { filterDictText, initDictOptions } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'OrderListList',
  mixins: [JeecgListMixin],
  components: {
    OrderProviderListModal
  },
  data() {
    return {
      // visiblGoodsInformation: false,
      //  formList: [],

      description: '订单列表管理页面',
      distribution: '',
      roleCode: '', //角色信息 ：roleCode ：1.台平 2.供应商，3店铺

      queryParam: {
        //初始查询条件
        status: 1 //订单状态；0：待付款；1：待发货（已付款、部分发货）；2：待收货（已发货）；3：交易成功；4：交易失败；5：交易完成；
      },
      is1688GYS: false,
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '订单编号',
          align: 'center',
          dataIndex: 'orderNo'
        },

        {
          title: '商品',
          align: 'center',
          dataIndex: 'goods',
          scopedSlots: { customRender: 'goods' }
        },
        {
          title: '买家',
          align: 'center',
          dataIndex: 'memberPhone',
          scopedSlots: { customRender: 'memberPhone' }
        },
        {
          title: '留言',
          align: 'center',
          dataIndex: 'message',
          scopedSlots: { customRender: 'message' }
        },
        {
          title: '订单状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },

        {
          title: '商品总价',
          align: 'center',
          dataIndex: 'goodsTotal'
        },
        {
          title: '配送方式', //；对应数据字典
          align: 'center',
          dataIndex: 'oder_distribution',
          scopedSlots: { customRender: 'distribution' }
        },
        {
          title: '配送费用',
          align: 'center',
          dataIndex: 'shipFee'
        },
        {
          title: '实付款',
          align: 'center',
          dataIndex: 'actualPayment'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '修改时间',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '有无修改地址',
          align: 'center',
          dataIndex: 'isUpdateAddr',
          scopedSlots: { customRender: 'isUpdateAddr' }
        },
        {
          title: '下单状态',
          align: 'center',
          dataIndex: 'orderStatus',
          scopedSlots: { customRender: 'orderStatus' }
        },
        {
          title: '部分发货',
          align: 'center',
          dataIndex: 'isSender',
          scopedSlots: { customRender: 'isSender' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/orderProviderList/orderProviderList/list',
        //list: '/orderList/orderList/list',
        delete: '/orderList/orderList/delete',
        deleteBatch: '/orderList/orderList/deleteBatch',
        exportXlsUrl: 'orderList/orderList/exportXls',
        importExcelUrl: 'orderList/orderList/importExcel',
        getUserRoleCodeAndGoodAudit: '/sys/user/getUserRoleCodeAndGoodAudit',
        //1688下单接口
        placeOrder: 'orderProviderList/orderProviderList/placeOrder',
        //获取供应商类型（1）
        getSupplierType: 'orderProviderList/orderProviderList/getSupplierType'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: record => ({
          props: {
            disabled: record.orderStatus != 0, // Column configuration not to be checked
            name: record.name
          }
        })
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    showDownOrder() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warn('请选择至少一个订单')
        return
      }
      const that = this
      // goodsTotal
      let totalPrice = 0
      this.selectionRows.forEach(item => {
        totalPrice += item.goodsTotal * 1
      })
      let title = `总共要下单数量为${
        this.selectedRowKeys.length
      }，合计 ￥${totalPrice}（含运费） 。为避免下单失败，请确保代扣账户金额大于此数值`
      this.$confirm({
        title,
        content: '您确定要提交吗？',
        onOk: function() {
          that.downOrder()
        }
      })
    },
    downOrder() {
      const that = this
      this.loading = true
      getAction(this.url.placeOrder, {
        orderProviderListIds: this.selectedRowKeys.join(',')
      }).then(res => {
        this.loading = false
        if (res.success) {
          this.$success({
            title: `本次下单的数量为${this.selectedRowKeys.length}，${res.result.successCount}个下单成功，${
              res.result.errorCount
            }个下单失败`,
            content: `具体原因请查看列表下单结果进行处理。`,
            onOk() {
              that.selectedRowKeys = []
              that.selectionRows = []
              that.loadData()
            }
          })
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**查询栏时间区间查询*/
    getQueryParams() {
      console.log(this.queryParam.createTime)
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.createTime // 时间参数不传递后台
      delete param.closeTime
      delete param.payTime
      delete param.shipmentsTime
      delete param.deliveryTime
      param.status = 1
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    onDateChange1: function(value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.closeTime_begin = dateString[0]
      this.queryParam.closeTime_end = dateString[1]
    },
    onDateChange2: function(value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.payTime_begin = dateString[0]
      this.queryParam.payTime_end = dateString[1]
    },
    onDateChange3: function(value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.shipmentsTime_begin = dateString[0]
      this.queryParam.shipmentsTime_end = dateString[1]
    },
    onDateChange4: function(value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.deliveryTime_begin = dateString[0]
      this.queryParam.deliveryTime_end = dateString[1]
    },
    onDateOk(value) {
      console.log(value)
    },
    onDateOk1(value) {
      console.log(value)
    },
    /*****弹窗*****/
    //会员信息
    showModalEmemberInformation(memberList, consignee, contactNumber, shippingAddress, houseNumber) {
      this.$refs.modalForm.showModalEmemberInformation(
        memberList,
        consignee,
        contactNumber,
        shippingAddress,
        houseNumber
      )
      this.$refs.modalForm.title = '会员信息'
      this.$refs.modalForm.disableSubmit = false
    },
    //商品信息
    showModalGoodsInformation(orderProviderListDTOs) {
      let goodList = []
      orderProviderListDTOs.orderProviderGoodRecordDTOList.forEach(v => {
        goodList.push(v)
      })

      orderProviderListDTOs.orderProviderListDTOs.forEach(v => {
        v.orderProviderGoodRecordDTOList.forEach(i => {
          goodList.push(i)
        })
      })
      console.log(goodList)
      this.$refs.modalForm.showModalGoodsInformation(goodList)
      this.$refs.modalForm.title = '商品信息'
      this.$refs.modalForm.disableSubmit = false
    },

    //发货
    deliverGoods(record) {
      localStorage.setItem('deliverGoods', JSON.stringify(record))
      this.$router.push({ path: '/order/modules/SupplierOrderDeliverGoods', query: { record: record } }) //reusePage=3
    },
    //1688跳转
    to1688Goods(record) {
      this.$router.push({ path: '/order/modules/Supplier1688OrderDeliverGoods', query: { record: record } })
    },

    //留言信息
    showModalMessageInformation(Message) {
      this.$refs.modalForm.showModalMessageInformation(Message)
      this.$refs.modalForm.title = '留言信息'
      this.$refs.modalForm.disableSubmit = false
    },
    // //优惠金额
    // showModalCouponInformation(marketingDiscountCoupon, welfarePayments, vipLowerTotal, memberList) {
    //   this.$refs.modalForm.showModalCouponInformation(marketingDiscountCoupon, welfarePayments, vipLowerTotal, memberList)
    //   this.$refs.modalForm.title = '优惠券'
    //   this.$refs.modalForm.disableSubmit = false
    // },

    //配送方式信息
    showModalDistributionInformation(providerTemplateMaps) {
      this.$refs.modalForm.showModalDistributionInformation(providerTemplateMaps)
      this.$refs.modalForm.title = '配送方式'
      this.$refs.modalForm.disableSubmit = false
    },
    //取消按钮
    showModalCancelInformation(orderListId) {
      this.$refs.modalForm.showModalCancelInformation(orderListId)
      this.$refs.modalForm.title = '取消按钮'
      this.$refs.modalForm.disableSubmit = false
    },
    //修改地址
    showModalAddressInformation(goodListId, memberListId, consignee, contactNumber, shippingAddress) {
      this.$refs.modalForm.showModalAddressInformation(
        goodListId,
        memberListId,
        consignee,
        contactNumber,
        shippingAddress
      )
      this.$refs.modalForm.title = '修改地址'
      this.$refs.modalForm.disableSubmit = false
    },
    //删除
    showModalDeletess: function(id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')

        return
      }
      var that = this
      this.$confirm({
        title: '确定要删除订单吗，删除后不可恢复。',
        content: '确定要删除吗？',
        onOk: function() {
          deleteAction(that.url.delete, { id: id }).then(res => {
            console.log(res)
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    //跳转详情
    particulars(record, reusePage) {
      //reusePage：1 已取消订单 2 待付款订单 3 待发货订单 4 待收货订单 5 交易成功订单
      localStorage.setItem('OrderDetails', JSON.stringify(record))
      this.$router.push({ path: '/order/OrderSupplierDetails', query: { record: record, reusePage: reusePage } }) //reusePage=1
    },

    init() {
      getAction(this.url.getSupplierType).then(async res => {
        if (res.success && res.result.providerType == 1) {
          this.is1688GYS = true
        } else {
          this.is1688GYS = false
        }
        await this.$nextTick()
        if (!this.is1688GYS) {
          this.columns.splice(11, 1)
        }
      })

      this.initIndex()
    },
    initIndex() {
      initDictOptions('oder_distribution').then(res => {
        if (res.success) {
          /*for(let item of res.result){
              if(item.value == this.distribution  ){
                this.distribution = item.title
              }
            }*/
          this.distribution = res.result
        }
      })
    },
    //评论内容
    showEvaluateModal(record) {
      this.$refs.modalForm.showEvaluateModal(record)
      this.$refs.modalForm.title = '评论弹窗'
      this.$refs.modalForm.disableSubmit = false
    },
    //审批弹窗
    showAudiModal(id) {
      this.$refs.modalForm.showAudiModal(id)
      this.$refs.modalForm.title = '审批弹窗'
      this.$refs.modalForm.disableSubmit = false
    },
    //查看物流
    checkLogistics(record, reusePage) {
      localStorage.setItem('deliverGoods', JSON.stringify(record))
      this.$router.push({
        path: '/order/OrderSupplierLogisticsGoods',
        query: { record: record, reusePage: reusePage }
      }) //reusePage=5
    },

    orderListExport(status) {
      let urlParam = '&'
      if (this.paramsUrl) {
        urlParam = this.convertObj(this.paramsUrl)
      }
      if (this.roleCode == 2) {
        //供应商登录
        urlParam = 'sysUserId=' + this.userInfo().id + '&' + urlParam
      }
      let HOST =
        window.location.protocol +
        '//' +
        window.location.host +
        '/jeecg-boot/ureport/preview?' +
        '_u=file:%25E8%25AE%25A2%25E5%258D%2595-%25E8%25AE%25A2%25E5%258D%2595%25E5%2588%2597%25E8%25A1%25A8-%25E4%25BE%259B%25E5%25BA%2594%25E5%2595%2586-%25E8%25B0%25A2.ureport.xml&' +
        urlParam
      window.open(HOST)
    },
    //转url参数
    convertObj(data) {
      var _result = []
      for (var key in data) {
        var value = data[key]
        if (value.constructor == Array) {
          value.forEach(function(_value) {
            _result.push(key + '=' + _value)
          })
        } else {
          _result.push(key + '=' + value)
        }
      }
      return _result.join('&')
    },
    //登录人角色判断,是否审核判断
    getUserRoleCodeAndGoodAudit() {
      getAction(this.url.getUserRoleCodeAndGoodAudit, { sysUserId: this.userInfo().id }).then(res => {
        if (res.success) {
          let userRoleCodeAndGoodAudit = res.result
          if (userRoleCodeAndGoodAudit) {
            //角色信息 ：roleCode ：1.台平 2.供应商，3店铺
            this.roleCode = userRoleCodeAndGoodAudit.roleCode
          }
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
