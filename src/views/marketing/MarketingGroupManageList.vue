<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="团号">
              <a-input placeholder="请输入团号" v-model="queryParam.groupNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="商品名称">
              <a-input placeholder="请输入商品名称" v-model="queryParam.goodName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="商品编号">
              <a-input placeholder="请输入" v-model="queryParam.goodNo"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="拼团状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">进行中</a-select-option>
                <a-select-option :value="1">已成功</a-select-option>
                <a-select-option :value="2">已失败</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="活动时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParams.createTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>
          <!-- <a-col :md="6" :sm="8">
            <a-form-item label="活动结束时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParams.updateTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange1"
              />
            </a-form-item>
          </a-col> -->
          <a-col :md="6" :sm="8">
            <a-form-item label="建团时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParams.buildTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange3"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="成团时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParams.successTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange4"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset2" icon="reload">重置</a-button>
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
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
        :scroll="{ x: 2500 }"
      >
        <template slot="mainPicture" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="record.mainPicture != undefined"
            :preview="'mainPicture' + index"
            :src="getAvatarView(JSON.parse(record.mainPicture)[0])"
            alt=""
          />
          <a-avatar
            shape="square"
            v-if="record.mainPicture == undefined || record.mainPicture == ''"
            :src="getAvatarView(record.mainPicture)"
            icon="user"
          />
        </template>
        <template slot="status" slot-scope="text">
          <div v-if="text == 1">
            已成功
          </div>
          <div v-else-if="text == 2">
            已失败
          </div>
          <div v-else>
            进行中
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="toDetail(record)">详情</a>
          <a-divider type="vertical" v-if="record.status == 0" />
          <a @click="toDetail(record, true)" v-if="record.status == 0">拼团控制</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingGroupManage-modal ref="modalForm" @ok="modalFormOk"></marketingGroupManage-modal>
  </a-card>
</template>

<script>
import MarketingGroupManageModal from './modules/MarketingGroupManageModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: 'MarketingGroupManageList',
  mixins: [JeecgListMixin],
  components: {
    MarketingGroupManageModal
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
          title: '团号',
          align: 'center',
          dataIndex: 'groupNo'
        },
        {
          title: '商品编号',
          align: 'center',
          dataIndex: 'goodNo'
        },
        {
          title: '商品主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '商品名称',
          align: 'center',
          dataIndex: 'goodName'
        },
        // {
        //   title: '拼团商品id',
        //   align: 'center',
        //   dataIndex: 'marketingGroupGoodListId'
        // },
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
          title: '成团人数',
          align: 'center',
          dataIndex: 'numberTuxedo'
        },
        {
          title: '参团积分',
          align: 'center',
          dataIndex: 'tuxedoWelfarePayments'
        },
        {
          title: '返还比例(%)',
          align: 'center',
          dataIndex: 'returnProportion'
        },
        {
          title: '活动开始时间',
          align: 'center',
          dataIndex: 'startTime'
        },
        {
          title: '活动结束时间',
          align: 'center',
          dataIndex: 'endTime'
        },
        {
          title: '参团人数',
          align: 'center',
          dataIndex: 'numberClusters'
        },
        {
          // ；0：进行中；1：已成功；2：已失败
          title: '拼团状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '建团时间',
          align: 'center',
          dataIndex: 'buildTime'
        },
        {
          title: '成团时间',
          align: 'center',
          dataIndex: 'successTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          fixed: 'right',
          width: 200
        }
      ],
      queryParams: {},
      url: {
        list: '/marketing/marketingGroupManage/list',
        delete: '/marketing/marketingGroupManage/delete',
        deleteBatch: '/marketing/marketingGroupManage/deleteBatch',
        exportXlsUrl: 'marketing/marketingGroupManage/exportXls',
        importExcelUrl: 'marketing/marketingGroupManage/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    toDetail(item, isControl = false) {
      this.$router.push({ path: '/marketing/MarketingGroupOrderDetail', query: { id: item.id, isControl } })
    },
    searchReset2() {
      this.queryParams = {}
      this.searchReset()
    },
    getAvatarView: function(mainPicture) {
      return this.url.imgerver + '/' + mainPicture
    },
    onDateChange: function(value, dateString) {
      this.queryParam.startTime = dateString[0]
      this.queryParam.endTime = dateString[1]
    },
    onDateChange1: function(value, dateString) {
      this.queryParam.updateTimeStart = dateString[0]
      this.queryParam.updateTimeEnd = dateString[1]
    },
    onDateChange3: function(value, dateString) {
      this.queryParam.buildTimetart = dateString[0]
      this.queryParam.buildTimeEnd = dateString[1]
    },
    onDateChange4: function(value, dateString) {
      this.queryParam.successTimeStart = dateString[0]
      this.queryParam.successTimeEnd = dateString[1]
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
