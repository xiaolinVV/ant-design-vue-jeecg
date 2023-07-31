<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="场次编号">
              <a-input placeholder="请输入场次编号" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="活动名称">
              <a-input placeholder="请输入活动名称" v-model="queryParam.zoneName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="拼团状态">
              <a-select v-model="queryParam.status" placeholder="请选择拼团状态">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">进行中</a-select-option>
                <a-select-option :value="1">已成功</a-select-option>
                <a-select-option :value="2">已失败</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="拼团开始时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.startTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="拼团结束时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.endTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange2"
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
      <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('拼团管理')">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
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
        <template slot="status" slot-scope="text">
          <span shape="square" v-if="text == 0">进行中</span>
          <span shape="square" v-if="text == 1">已成功</span>
          <span shape="square" v-if="text == 2">已失败</span>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="toDetail(record, false)">详情</a>
          <a-divider type="vertical" v-if="record.status == 0" />
          <a @click="toDetail(record, true)" v-if="record.status == 0">拼团控制</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingZoneGroupManage-modal ref="modalForm" @ok="modalFormOk"></marketingZoneGroupManage-modal>
  </a-card>
</template>

<script>
import MarketingZoneGroupManageModal from './modules/MarketingZoneGroupManageModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
export default {
  name: 'MarketingZoneGroupManageList',
  mixins: [JeecgListMixin],
  components: {
    MarketingZoneGroupManageModal
  },
  data() {
    return {
      description: '拼团管理管理页面',
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
          title: '场次编号',
          align: 'center',
          dataIndex: 'serialNumber'
        },
        {
          title: '活动名称',
          align: 'center',
          dataIndex: 'zoneName'
        },
        {
          title: '活动价格',
          align: 'center',
          dataIndex: 'price'
        },
        {
          title: '虚拟成团人数',
          align: 'center',
          dataIndex: 'virtualGroupMembers'
        },
        {
          title: '实际成团人数',
          align: 'center',
          dataIndex: 'actualGroupSize'
        },
        {
          title: '拼团人数',
          align: 'center',
          dataIndex: 'numberSum'
        },
        {
          // ；0：进行中；1：已成功；2：失败
          title: '拼团状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '拼团开始时间',
          align: 'center',
          dataIndex: 'startTime'
        },
        {
          title: '拼团结束时间',
          align: 'center',
          dataIndex: 'endTime'
        },
        {
          title: '成团时间',
          align: 'center',
          dataIndex: 'cloudsTime'
        },
        {
          title: '失败时间',
          align: 'center',
          dataIndex: 'failureTime'
        },

        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      memberList: [],
      url: {
        list: '/marketingZoneGroupManage/marketingZoneGroupManage/list',
        delete: '/marketingZoneGroupManage/marketingZoneGroupManage/delete',
        deleteBatch: '/marketingZoneGroupManage/marketingZoneGroupManage/deleteBatch',
        exportXlsUrl: 'marketingZoneGroupManage/marketingZoneGroupManage/exportXls',
        importExcelUrl: 'marketingZoneGroupManage/marketingZoneGroupManage/importExcel',
        //获取该专区团管理全部会员
        getZoneGroupManageMemberList: '/marketingZoneGroupManage/marketingZoneGroupManage/getZoneGroupManageMemberList'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  created() {
    // setTimeout(() => {
    //   this.dataSource = [
    //     {
    //       id: '1234',
    //       status: 0
    //     }
    //   ]
    // }, 1000)
  },
  methods: {
    toDetail(item, isControl = false) {
      this.$router.push({
        path: '/marketing/MarketingZoneGroupOrderDetail',
        query: { record: item, isControl }
      })
    },
    onDateChange: function(value, dateString) {
      this.queryParam.startTimeStart = dateString[0]
      this.queryParam.startTimeEnd = dateString[1]
    },
    onDateChange2: function(value, dateString) {
      this.queryParam.endTimeStart = dateString[0]
      this.queryParam.endTimeEnd = dateString[1]
    },
    // /**查询栏时间区间查询*/
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.startTime
      delete param.endTime
      return filterObj(param)
    }
  }
}
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>
