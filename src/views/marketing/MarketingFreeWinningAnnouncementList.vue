<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="场次编号">
              <a-input placeholder="请输入场次编号" v-model="queryParam.marketingFreeSessionId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="发布状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">未发布</a-select-option>
                <a-select-option :value="1">已发布</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="开始日期">
              <a-range-picker
                style="width: 100%"
                v-model="queryParams.startTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange3"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="结束日期">
              <a-range-picker
                style="width: 100%"
                v-model="queryParams.endTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange4"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="免单日">
              <a-range-picker
                style="width: 100%"
                v-model="queryParams.freeDay"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange5"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="发布时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParams.fabushijian"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange5"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset2" icon="reload" style="margin-left: 8px">重置</a-button>
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
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
      <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('免单中奖公告')">导出</a-button>
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
      </a-dropdown>
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
        :scroll="{ x: 1500 }"
      >
        <!-- <template slot="startTimeStart" slot-scope="text, record">
          {{ record.startTimeStart }} - {{ record.startTimeEnd }}
        </template>
        <template slot="endTimeStart" slot-scope="text, record">
          {{ record.endTimeStart }} - {{ record.endTimeEnd }}
        </template>
        <template slot="freeDayStart" slot-scope="text, record">
          {{ record.freeDayStart }} - {{ record.freeDayEnd }}
        </template>
        <template slot="releaseTimeStart" slot-scope="text, record">
          {{ record.releaseTimeStart }} - {{ record.releaseTimeEnd }} -->
        <!-- </template> -->
        <template slot="status" slot-scope="text, record">
          <div class="anty-img-wrap">
            <div v-if="record.status == 0">未发布</div>
            <div v-else>已发布</div>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">设置虚拟单数</a>
          <a-divider type="vertical" />
          <a @click="release(record)">发布</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingFreeWinningAnnouncement-modal ref="modalForm" @ok="modalFormOk"></marketingFreeWinningAnnouncement-modal>
  </a-card>
</template>

<script>
import MarketingFreeWinningAnnouncementModal from './modules/MarketingFreeWinningAnnouncementModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '../../api/manage'

export default {
  name: 'MarketingFreeWinningAnnouncementList',
  mixins: [JeecgListMixin],
  components: {
    MarketingFreeWinningAnnouncementModal
  },
  data() {
    return {
      description: '免单中奖公告管理页面',
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
          title: '周期天数',
          align: 'center',
          dataIndex: 'periodDays'
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'startTime'
        },
        {
          title: '结束时间',
          align: 'center',
          dataIndex: 'endTime'
        },
        {
          title: '免单日',
          align: 'center',
          dataIndex: 'freeDay'
        },
        {
          title: '实际免单数',
          align: 'center',
          dataIndex: 'practicalFreeTimes'
        },
        {
          title: '虚拟免单数',
          align: 'center',
          dataIndex: 'virtualFreeTimes'
        },
        {
          title: '前端显示',
          align: 'center',
          dataIndex: 'totalFreeTimes'
        },
        {
          // 0：未发布；1：已发布
          title: '发布状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '发布时间',
          align: 'center',
          dataIndex: 'releaseTime'
        },
        {
          title: '发布者',
          align: 'center',
          dataIndex: 'publisher'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParams: {},
      url: {
        list: 'marketing/marketingFreeWinningAnnouncement/selectMarketingFreeWinningAnnouncementList',
        delete: '/marketing/marketingFreeWinningAnnouncement/delete',
        deleteBatch: '/marketing/marketingFreeWinningAnnouncement/deleteBatch',
        exportXlsUrl: 'marketing/marketingFreeWinningAnnouncement/exportXls',
        importExcelUrl: 'marketing/marketingFreeWinningAnnouncement/importExcel',
        //修改发布状态（1）
        updateStatus: 'marketing/marketingFreeWinningAnnouncement/updateStatus'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },

  methods: {
    searchReset2() {
      this.queryParams = {}
      this.searchReset()
    },
    release(record) {
      const that = this

      this.$confirm({
        title: '将要发布免单活动中奖公告',
        content: '点击确定后免单活动中奖公告发布成功',
        onOk: () => {
          getAction(that.url.updateStatus, { id: record.id }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
            } else {
              that.$message.warning(res.message)
            }
          })
        },
        onCancel() {}
      })
    },

    onDateChange3: function(value, dateString) {
      this.queryParam.startTimeStart = dateString[0]
      this.queryParam.startTimeEnd = dateString[1]
    },
    onDateChange4: function(value, dateString) {
      this.queryParam.endTimeStart = dateString[0]
      this.queryParam.endTimeEnd = dateString[1]
    },
    onDateChange5: function(value, dateString) {
      this.queryParam.freeDayStart = dateString[0]
      this.queryParam.freeDayEnd = dateString[1]
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
