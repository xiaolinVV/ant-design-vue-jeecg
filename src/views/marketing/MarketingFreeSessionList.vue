<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="场次编号">
              <a-input placeholder="请输入场次编号" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="场次状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">未开始</a-select-option>
                <a-select-option :value="1">进行中</a-select-option>
                <a-select-option :value="2">已结束</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="免单日设置">
              <a-select v-model="queryParam.freeDaySetting" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">未设置</a-select-option>
                <a-select-option :value="1">已设置</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="创建方式">
              <a-select v-model="queryParam.createMode" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">手动创建</a-select-option>
                <a-select-option :value="1">自动创建</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="创建时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParams.createTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="更新时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParams.updateTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange1"
              />
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
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset2" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('免单场次')">导出</a-button>
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
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
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
        :scroll="{ x: 1500 }"
      >
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">未开始</span>
            <span shape="square" v-if="record.status == 1">进行中</span>
            <span shape="square" v-if="record.status == 2">已结束</span>
          </div>
        </template>
        <template slot="freeDaySetting" slot-scope="text, record, index">
          <span shape="square" v-if="text == 1">已设置</span>
          <span shape="square" v-else>未设置</span>
        </template>
        <template slot="createMode" slot-scope="text, record, index">
          <span shape="square" v-if="record.createMode == 0">手动创建</span>
          <span shape="square" v-if="record.createMode == 1">自动创建</span>
        </template>
        <span slot="action" slot-scope="text, record">
          <!-- <a @click="handleEdit(record)">编辑</a> -->
          <a @click="acriveOrderTo(record)">活动订单</a>
          <a-divider type="vertical" />
          <a @click="dayFreeTo(record)">免单日订单</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)" v-if="record.status != 1">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingFreeSession-modal ref="modalForm" @ok="modalFormOk"></marketingFreeSession-modal>
  </a-card>
</template>

<script>
import MarketingFreeSessionModal from './modules/MarketingFreeSessionModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: 'MarketingFreeSessionList',
  mixins: [JeecgListMixin],
  components: {
    MarketingFreeSessionModal
  },
  data() {
    return {
      description: '免单场次管理页面',
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
        // {
        //      title: '创建年',
        //      align:"center",
        //      dataIndex: 'year'
        //     },
        // {
        //      title: '创建月',
        //      align:"center",
        //      dataIndex: 'month'
        //     },
        // {
        //      title: '创建日',
        //      align:"center",
        //      dataIndex: 'day'
        //     },
        // {
        //      title: '删除状态（0，正常，1已删除）',
        //      align:"center",
        //      dataIndex: 'delFlag'
        //     },
        // {
        //      title: '场次编号',
        //      align:"center",
        //      dataIndex: 'marketingFreeBaseSettingId'
        //     },
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
          title: '开始日期',
          align: 'center',
          dataIndex: 'startTime'
        },
        {
          title: '结束日期',
          align: 'center',
          dataIndex: 'endTime'
        },
        // ；0：未开始；1：进行中；2：已结束
        {
          title: '场次状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          // ；0：未设置；1：已设置
          title: '免单日设置',
          align: 'center',
          dataIndex: 'freeDaySetting',
          scopedSlots: { customRender: 'freeDaySetting' }
        },

        {
          title: '免单日',
          align: 'center',
          dataIndex: 'freeDay'
        },
        {
          // ；0：手动创建；1：自动创建
          title: '创建方式',
          align: 'center',
          dataIndex: 'createMode',
          scopedSlots: { customRender: 'createMode' }
        },
        {
          title: '创建者',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '更新者',
          align: 'center',
          dataIndex: 'updateBy'
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime'
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
        list: '/marketing/marketingFreeSession/list',
        delete: '/marketing/marketingFreeSession/delete',
        deleteBatch: '/marketing/marketingFreeSession/deleteBatch',
        exportXlsUrl: 'marketing/marketingFreeSession/exportXls',
        importExcelUrl: 'marketing/marketingFreeSession/importExcel'
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
    acriveOrderTo(record) {
      this.$router.push({ path: '/marketing/modules/MarketingActivityOrder', query: record })
    },
    dayFreeTo(record) {
      this.$router.push({ path: '/marketing/modules/MarketingFreeDayDetail', query: record })
    },

    onDateChange: function(value, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    onDateChange1: function(value, dateString) {
      this.queryParam.updateTime_begin = dateString[0]
      this.queryParam.updateTime_end = dateString[1]
    },
    onDateChange3: function(value, dateString) {
      this.queryParam.startTime_begin = dateString[0]
      this.queryParam.startTime_end = dateString[1]
    },
    onDateChange4: function(value, dateString) {
      this.queryParam.endTime_begin = dateString[0]
      this.queryParam.endTime_end = dateString[1]
    },
    onDateChange5: function(value, dateString) {
      this.queryParam.freeDay_begin = dateString[0]
      this.queryParam.freeDay_end = dateString[1]
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
