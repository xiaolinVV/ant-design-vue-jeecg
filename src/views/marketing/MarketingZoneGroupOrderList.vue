<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="专区名称">
              <a-input placeholder="请输入专区名称" v-model="queryParam.zoneName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="分组编号">
              <a-input placeholder="请输入分组编号" v-model="queryParam.groupingSerialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="拼团编号">
              <a-input placeholder="请输入拼团编号" v-model="queryParam.recordSerialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="拼团订单编号">
              <a-input placeholder="请输入拼团订单编号" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="平台订单编号">
              <a-input placeholder="请输入平台订单编号" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员手机号">
              <a-input placeholder="请输入会员手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择状态">
                <a-select-option value="">请选择</a-select-option>

                <a-select-option :value="1">已付款</a-select-option>
                <a-select-option :value="2">待发货</a-select-option>
                <a-select-option :value="3">已寄售</a-select-option>
                <a-select-option :value="4">已完成</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('拼中商品')">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown> -->
    </div>

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
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{ x: 2500 }"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <a slot="phone" slot-scope="text, record" @click="showDetail(record, 1)">{{ text }}</a>
        <a slot="message" slot-scope="text, record" @click="showDetail(record, 2)">留言内容</a>
        <a slot="goodsMessage" slot-scope="text, record" @click="showDetail(record, 3)">商品信息</a>
        <a slot="action" slot-scope="text, record" v-if="record.status == 1" @click="deliverGoods(record)">直接发货</a>
        <template slot="status" slot-scope="text">
          <!-- 1：已付款；2：待发货；3：已寄售；4：已完成 -->
          <div v-if="text == 1">
            已付款
          </div>
          <div v-else-if="text == 2">
            待发货
          </div>
          <div v-else-if="text == 3">
            已寄售
          </div>
          <div v-else-if="text == 4">
            已完成
          </div>
        </template>
        <!-- <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span> -->
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingZoneGroupOrder-modal ref="modalForm" @ok="modalFormOk"></marketingZoneGroupOrder-modal>
    <MarketingZoneGroupOrderListDetail ref="MarketingZoneGroupOrderListDetail"></MarketingZoneGroupOrderListDetail>
  </a-card>
</template>

<script>
import MarketingZoneGroupOrderModal from './modules/MarketingZoneGroupOrderModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import MarketingZoneGroupOrderListDetail from './modules/MarketingZoneGroupOrderListDetail'
import { getAction } from '@/api/manage'
export default {
  name: 'MarketingZoneGroupOrderList',
  mixins: [JeecgListMixin],
  components: {
    MarketingZoneGroupOrderModal,
    MarketingZoneGroupOrderListDetail
  },
  data() {
    return {
      description: '拼中商品管理页面',
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
          title: '专区名称',
          align: 'center',
          dataIndex: 'zoneName'
        },
        {
          title: '分组编号',
          align: 'center',
          dataIndex: 'groupingSerialNumber'
        },
        {
          title: '拼团编号',
          align: 'center',
          dataIndex: 'recordSerialNumber'
        },
        {
          title: '拼团订单编号',
          align: 'center',
          dataIndex: 'serialNumber'
        },
        {
          title: '平台订单编号',
          align: 'center',
          dataIndex: 'orderNo'
        },
        {
          title: '会员手机号',
          align: 'center',
          dataIndex: 'phone',
          scopedSlots: { customRender: 'phone' }
        },
        {
          title: '留言信息',
          align: 'center',
          dataIndex: 'message',
          scopedSlots: { customRender: 'message' }
        },
        {
          title: '商品信息',
          align: 'center',
          dataIndex: 'goodsMessage',
          scopedSlots: { customRender: 'goodsMessage' }
        },
        {
          title: '商品总价',
          align: 'center',
          dataIndex: 'goodsTotal'
        },
        {
          title: '运费',
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
          // 1：已付款；2：待发货；3：已寄售；4：已完成
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '付款时间',
          align: 'center',
          dataIndex: 'payTime'
        },
        {
          title: '寄售时间',
          align: 'center',
          dataIndex: 'consignmentTime'
        },
        {
          title: '发货时间',
          align: 'center',
          dataIndex: 'shipmentsTime'
        },
        {
          title: '收货时间',
          align: 'center',
          dataIndex: 'deliveryTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/marketingZoneGroupOrder/marketingZoneGroupOrder/list',
        delete: '/marketingZoneGroupOrder/marketingZoneGroupOrder/delete',
        deleteBatch: '/marketingZoneGroupOrder/marketingZoneGroupOrder/deleteBatch',
        exportXlsUrl: 'marketingZoneGroupOrder/marketingZoneGroupOrder/exportXls',
        importExcelUrl: 'marketingZoneGroupOrder/marketingZoneGroupOrder/importExcel',
        //直接发货
        shipments: 'marketingZoneGroupOrder/marketingZoneGroupOrder/shipments'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    showDetail(record, type) {
      this.$refs.MarketingZoneGroupOrderListDetail.show(record, type)
    },
    deliverGoods(record) {
      const that = this
      this.$confirm({
        title: '直接发货用户将无法再寄售。',
        content: '您确定要直接发货吗？',
        onOk() {
          return new Promise(resolve => {
            let id = record.id
            getAction(that.url.shipments, { id }).then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.modalFormOk()
              } else {
                that.$message.error(res.message)
              }
              resolve()
            })
          })
        },
        onCancel() {}
      })
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
