<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="会员编号">
              <a-input placeholder="请输入会员编号" v-model="queryParam.memberListId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员手机号">
              <a-input placeholder="请输入会员手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员昵称">
              <a-input placeholder="请输入会员昵称" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="礼包编号">
              <a-input placeholder="请输入礼包编号" v-model="queryParam.serialNumbers"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="礼包名称">
              <a-input placeholder="请输入礼包名称" v-model="queryParam.giftName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="推荐人">
              <a-input placeholder="请输入推荐人" v-model="queryParam.tMemberPhone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="推荐人昵称">
              <a-input placeholder="请输入推荐人昵称" v-model="queryParam.tMemberNickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="交易单号">
              <a-input placeholder="请输入交易单号" v-model="queryParam.tradeNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="购买时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.payTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
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
      <a-button type="primary" icon="download" @click="handleExportXls('创业礼包购买记录')">导出</a-button>
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
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="headPortrait" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="record.headPortrait != undefined"
            :preview="'headPortrait' + index"
            :src="record.headPortrait"
            alt=""
          />
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="showDetail(record, 4)">发货信息</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingBusinessGiftRecord-modal ref="modalForm" @ok="modalFormOk"></marketingBusinessGiftRecord-modal>
    <MarketingZoneGroupOrderListDetail ref="MarketingZoneGroupOrderListDetail"></MarketingZoneGroupOrderListDetail>
  </a-card>
</template>

<script>
import MarketingBusinessGiftRecordModal from './modules/MarketingBusinessGiftRecordModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import JInput from '@/components/jeecg/JInput.vue'
import MarketingZoneGroupOrderListDetail from './modules/MarketingZoneGroupOrderListDetail'
export default {
  name: 'MarketingBusinessGiftRecordList',
  mixins: [JeecgListMixin],
  components: {
    JInput,
    MarketingBusinessGiftRecordModal,
    MarketingZoneGroupOrderListDetail
  },
  data() {
    return {
      description: '创业礼包购买记录管理页面',
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
          title: '会员编号',
          align: 'center',
          dataIndex: 'memberListId'
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
          title: '礼包编号',
          align: 'center',
          dataIndex: 'serialNumber'
        },
        {
          title: '礼包名称',
          align: 'center',
          dataIndex: 'giftName'
        },
        {
          title: '销售价',
          align: 'center',
          dataIndex: 'salesPrice'
        },
        {
          title: '推荐人手机号',
          align: 'center',
          dataIndex: 'tMemberPhone'
        },
        {
          title: '推荐人昵称',
          align: 'center',
          dataIndex: 'tMemberNickName'
        },
        {
          title: '推荐奖励',
          align: 'center',
          dataIndex: 'referralBonuses'
        },

        {
          title: '购买时间',
          align: 'center',
          dataIndex: 'payTime'
        },
        {
          title: '交易单号',
          align: 'center',
          dataIndex: 'tradeNo'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/marketingBusinessGiftRecord/marketingBusinessGiftRecord/list',
        delete: '/marketingBusinessGiftRecord/marketingBusinessGiftRecord/delete',
        deleteBatch: '/marketingBusinessGiftRecord/marketingBusinessGiftRecord/deleteBatch',
        exportXlsUrl: 'marketingBusinessGiftRecord/marketingBusinessGiftRecord/exportXls',
        importExcelUrl: 'marketingBusinessGiftRecord/marketingBusinessGiftRecord/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    // /**查询栏时间区间查询*/
    getQueryParams() {
      console.log(this.queryParam.createTime)
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.payTime
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      this.queryParam.payTime_begin = dateString[0]
      this.queryParam.payTime_end = dateString[1]
    },
    showDetail(record, type) {
      this.$refs.MarketingZoneGroupOrderListDetail.show(record, type)
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
