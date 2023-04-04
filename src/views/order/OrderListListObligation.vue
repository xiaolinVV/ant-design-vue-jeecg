<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="订单编号">
              <a-input placeholder="请输入订单编号" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="订单类型">
              <j-dict-select-tag v-model="queryParam.orderType" placeholder="请选择" dictCode="order_type" />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="买家账号">
                <a-input placeholder="请输入买家账号" v-model="queryParam.memberPhone"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="关闭类型">
                <j-dict-select-tag v-model="queryParam.closeType" placeholder="请选择" dictCode="oder_close_type" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="关闭原因">
                <a-input placeholder="请输入" v-model="queryParam.closeExplain"></a-input>
              </a-form-item>
            </a-col>
            <!--时间选择框-->
            <a-col :md="6" :sm="8">
              <a-form-item label="关闭时间">
                <a-range-picker
                  style="width: 210px"
                  v-model="queryParam.closeTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange1"
                  @ok="onDateOk1"
                />
              </a-form-item>
            </a-col>
            <!--时间选择框-->
            <a-col :md="6" :sm="8">
              <a-form-item label="创建时间">
                <a-range-picker
                  style="width: 210px"
                  v-model="queryParam.createTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                  @ok="onDateOk"
                />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!--&lt;!&ndash; 操作按钮区域 &ndash;&gt;-->
    <!--<div class="table-operator">-->
    <!--<a-button type="primary" icon="download" @click="orderListExport(0)">导出预览</a-button>-->
    <!--</div>-->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" icon="download" @click="handleExportXls('订单列表')">导出</a-button>
    </div>

    <!-- <div class="table-operator">
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
        :scroll="{ x: 2500 }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="memberPhone" slot-scope="text, record, index">
          <div>
            <a
              @click="
                showModalEmemberInformation(
                  record.memberList,
                  record.consignee,
                  record.contactNumber,
                  record.shippingAddress,
                  record.houseNumber
                )
              "
              >{{ record.memberPhone }}</a
            >
          </div>
        </template>
        <template slot="goods" slot-scope="text, record, index">
          <div>
            <a @click="showModalGoodsInformation(record.orderProviderListDTOs)">商品信息</a>
          </div>
        </template>
        <template slot="message" slot-scope="text, record, index">
          <div>
            <a v-if="record.message" @click="showModalMessageInformation(record.message)">留言</a>
            <a v-else>-</a>
          </div>
        </template>

        <template slot="coupon" slot-scope="text, record, index">
          <div>
            <a v-if="record.coupon || record.vipLowerTotal" @click="showModalCouponInformation(record)">{{
              record.coupon
            }}</a>
            <a v-else>-</a>
          </div>
        </template>

        <template slot="giveWelfarePayments" slot-scope="text, record, index">
          <div>
            <a v-if="record.giveWelfarePayments != 0" @click="showModalGivingInformation(record.giveWelfarePayments)"
              >福利金</a
            >
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
        <template slot="isUpdateAddr" slot-scope="text, record, index">
          <div>
            <div v-if="record.isUpdateAddr == 0">否</div>
            <div v-if="record.isUpdateAddr == 1">是</div>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="showModalCancelInformation(record.id)">取消</a>
          <a-divider type="vertical" />
          <a
            @click="
              showModalAddressInformation(
                record.id,
                record.memberListId,
                record.consignee,
                record.contactNumber,
                record.shippingAddress
              )
            "
            >修改地址</a
          >
          <a-divider type="vertical" />
          <a @click="particulars(record, 2)">详情</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <orderList-modal ref="modalForm" @ok="modalFormOk"></orderList-modal>
  </a-card>
</template>

<script>
import OrderListModal from './modules/OrderListModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { deleteAction, getAction, downFile } from '@/api/manage'
import Vue from 'vue'
import { putAction } from '@/api/manage'
//字典
import { filterDictText, initDictOptions } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'OrderListList',
  mixins: [JeecgListMixin],
  components: {
    OrderListModal
  },
  data() {
    return {
      description: '订单列表管理页面',
      distribution: '',
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
          title: '订单类型',
          align: 'center',
          dataIndex: 'orderType_dictText'
          // sorter: true
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
          title: '商品',
          align: 'center',
          dataIndex: 'goods',
          scopedSlots: { customRender: 'goods' }
        },
        {
          title: '商品总价',
          align: 'center',
          dataIndex: 'goodsTotal'
        },
        {
          title: '赠送',
          align: 'center',
          dataIndex: 'giveWelfarePayments',
          scopedSlots: { customRender: 'giveWelfarePayments' }
        },
        {
          title: '优惠',
          align: 'center',
          dataIndex: 'coupon',
          scopedSlots: { customRender: 'coupon' }
        },
        {
          title: '配送方式', //；对应数据字典
          align: 'center',
          dataIndex: 'oder_distribution',
          scopedSlots: { customRender: 'distribution' }
          /* sorter:true,
             customRender: (text) => {
                 //字典值替换通用方法
                 return filterDictText('distribution', text);
               }*/
        },
        {
          title: '配送费用',
          align: 'center',
          dataIndex: 'shipFee'
        },
        {
          title: '应付款',
          align: 'center',
          dataIndex: 'customaryDues'
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
          title: '有无修改地址',
          align: 'center',
          dataIndex: 'isUpdateAddr',
          scopedSlots: { customRender: 'isUpdateAddr' }
        },
        {
          title: '修改时间',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 300,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/orderList/orderList/queryPageListObligation',
        delete: '/orderList/orderList/delete',
        deleteBatch: '/orderList/orderList/deleteBatch',
        exportXlsUrl: 'orderList/orderList/exportXls',
        importExcelUrl: 'orderList/orderList/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  mounted() {
    //订单状态；0：待付款；1：待发货（已付款、部分发货）；2：待收货（已发货）；3：交易成功；4：交易失败；5：交易完成；
    this.queryParam.status = 0
    this.init()
  },
  methods: {
    /**查询栏时间区间查询*/
    getQueryParams() {
      console.log(this.queryParam.createTime)
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.createTime // 时间参数不传递后台
      delete param.closeTime
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
      this.$refs.modalForm.showModalGoodsInformation(orderProviderListDTOs)
      this.$refs.modalForm.title = '商品信息'
      this.$refs.modalForm.disableSubmit = false
    },
    //留言信息
    showModalMessageInformation(Message) {
      this.$refs.modalForm.showModalMessageInformation(Message)
      this.$refs.modalForm.title = '留言信息'
      this.$refs.modalForm.disableSubmit = false
    },
    //赠送
    showModalGivingInformation(giveWelfarePayments) {
      this.$refs.modalForm.showModalGivingInformation(giveWelfarePayments)
      this.$refs.modalForm.title = '赠送信息'
      this.$refs.modalForm.disableSubmit = false
    },
    //优惠金额
    showModalCouponInformation(record) {
      this.$refs.modalForm.showModalCouponInformation(record)
      this.$refs.modalForm.title = '优惠券'
      this.$refs.modalForm.disableSubmit = false
    },
    //配送方式信息
    showModalDistributionInformation(orderProviderListDTOs) {
      this.$refs.modalForm.showModalDistributionInformation(orderProviderListDTOs)
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
    //跳转详情
    particulars(record, reusePage) {
      //reusePage：1 已取消订单 2 待付款订单 3 待发货订单 4 待收货订单 5 交易成功订单
      localStorage.setItem('OrderDetails', JSON.stringify(record))
      this.$router.push({ path: '/order/OrderDetails', query: { record: record, reusePage: reusePage } }) //reusePage=2 为平台待付款详情
    },

    init() {
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
    orderListExport(status) {
      let urlParam = '&'
      if (this.paramsUrl) {
        urlParam = this.convertObj(this.paramsUrl)
      }
      let HOST =
        window.location.protocol +
        '//' +
        window.location.host +
        '/jeecg-boot/ureport/preview?' +
        '_u=file:%25E8%25AE%25A2%25E5%258D%2595-%25E8%25AE%25A2%25E5%258D%2595%25E5%2588%2597%25E8%25A1%25A8-%25E8%25B0%25A2.ureport.xml&status=' +
        status +
        '&' +
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
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
