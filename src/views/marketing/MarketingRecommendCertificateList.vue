<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="兑换券id">
              <a-input placeholder="请输入" v-model="queryParam.marketingCertificateId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="兑换券名称">
              <a-input placeholder="请输入" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <!--时间选择框-->
          <a-col :md="8" :sm="8">
            <a-form-item label="开始时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.startTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <!--时间选择框-->
            <a-col :md="8" :sm="8">
              <a-form-item label="结束时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.endTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange1"
                  @ok="onDateOk"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">停用</a-select-option>
                  <a-select-option :value="1">启用</a-select-option>
                </a-select>
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

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!--<a-button type="primary" icon="download" @click="handleExportXls('推荐兑换券')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
      <a-dropdown v-if="selectedRowKeys.length > 0">
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
        :scroll="{ x: true }"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="mainPicture" slot-scope="text, record, index">
          <span v-if="!record.mainPicture">
            - -
          </span>
          <img
            v-else
            class="clickShowImage "
            :preview="'mainPicture' + index"
            :src="url.imgerver + '/' + record.mainPicture"
            alt=""
          />
        </template>
        <template slot="status" slot-scope="text, record">
          <span v-if="record.status == 0">停用</span>
          <span v-if="record.status == 1">启用</span>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="showActionModel(record, '删除')">删除</a>
          <a-divider type="vertical" />
          <a v-if="record.status == 1" @click="showActionModel(record, '停用')">停用</a>
          <a v-else @click="showActionModel(record, '启用')">启用</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <marketingRecommendCertificate-modal ref="modalForm" @ok="modalFormOk"></marketingRecommendCertificate-modal>
    <marketingRecommendCertificateModalAction-model ref="modalForm2"> </marketingRecommendCertificateModalAction-model>
  </a-card>
</template>

<script>
import MarketingRecommendCertificateModal from './modules/MarketingRecommendCertificateModal'
import MarketingRecommendCertificateModalActionModel from './modules/MarketingRecommendCertificateModalActionModel'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'

export default {
  name: 'MarketingRecommendCertificateList',
  mixins: [JeecgListMixin],
  components: {
    MarketingRecommendCertificateModal,
    MarketingRecommendCertificateModalActionModel
  },
  data() {
    return {
      description: '推荐兑换券管理页面',
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
          title: '兑换券id',
          align: 'center',
          dataIndex: 'marketingCertificateId'
        },
        {
          title: '兑换券名称',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '推荐位置',
          align: 'center',
          dataIndex: 'recommendLocal_dictText'
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
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
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '停用说明',
          align: 'center',
          dataIndex: 'closeExplain'
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
          fixed: 'right',
          width: 180,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/marketingRecommendCertificate/marketingRecommendCertificate/list',
        delete: '/marketingRecommendCertificate/marketingRecommendCertificate/delete',
        deleteBatch: '/marketingRecommendCertificate/marketingRecommendCertificate/deleteBatch',
        exportXlsUrl: 'marketingRecommendCertificate/marketingRecommendCertificate/exportXls',
        importExcelUrl: 'marketingRecommendCertificate/marketingRecommendCertificate/importExcel',
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
    /**查询栏时间区间查询*/
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.startTime
      delete param.endTime
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      this.queryParam.startTime_begin = dateString[0]
      this.queryParam.startTime_end = dateString[1]
    },
    onDateChange1: function(value, dateString) {
      this.queryParam.endTime_begin = dateString[0]
      this.queryParam.endTime_end = dateString[1]
    },
    showActionModel(record, title = '') {
      let result = Object.assign({}, record, { modelTitle: title })
      this.$refs.modalForm2.open(result)
    }
  }
}
</script>
<style scoped></style>
