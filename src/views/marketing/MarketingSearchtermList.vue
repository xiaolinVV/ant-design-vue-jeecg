<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="搜索词">
              <a-input placeholder="请输入搜索词" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择状态">
                <a-select-option :value="0">停用</a-select-option>
                <a-select-option :value="1">启用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="10" :sm="12">
            <a-form-item label="创建时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <j-date
                v-model="queryParam.createTime_begin"
                :showTime="true"
                date-format="YYYY-MM-DD HH:mm:ss"
                style="width:45%"
                placeholder="请选择开始时间"
              ></j-date>
              <span style="width: 10px;">~</span>
              <j-date
                v-model="queryParam.createTime_end"
                :showTime="true"
                date-format="YYYY-MM-DD HH:mm:ss"
                style="width:45%"
                placeholder="请选择结束时间"
              ></j-date>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="10" :sm="12">
              <a-form-item label="更新时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <j-date
                  v-model="queryParam.updateTime_begin"
                  :showTime="true"
                  date-format="YYYY-MM-DD HH:mm:ss"
                  style="width:45%"
                  placeholder="请选择开始时间"
                ></j-date>
                <span style="width: 10px;">~</span>
                <j-date
                  v-model="queryParam.updateTime_end"
                  :showTime="true"
                  date-format="YYYY-MM-DD HH:mm:ss"
                  style="width:45%"
                  placeholder="请选择结束时间"
                ></j-date>
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
      <a-button type="primary" icon="download" @click="handleExportXls('推荐搜词')">导出</a-button>
      <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;width: 100%">
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
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">停用</span>
            <span shape="square" v-if="record.status == 1">启用</span>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleStatus(record.id)" v-if="record.status == 1">停用</a>
          <a @click="handleStatus(record.id)" v-if="record.status == 0">启用</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)"> <a>删除</a> </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingSearchterm-modal ref="modalForm" @ok="modalFormOk"></marketingSearchterm-modal>
  </a-card>
</template>

<script>
import MarketingSearchtermModal from './modules/MarketingSearchtermModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'
import JDate from '@/components/jeecg/JDate'
export default {
  name: 'MarketingSearchtermList',
  mixins: [JeecgListMixin],
  components: {
    MarketingSearchtermModal,
    JDate
  },
  data() {
    return {
      description: '推荐搜词管理页面',
      queryParam: { marketingSearchtermName: '' },
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
          title: '搜词名称',
          align: 'center',
          dataIndex: 'name'
        },

        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
        },
        {
          title: '搜索次数',
          align: 'center',
          dataIndex: 'times'
        },
        {
          title: '状态', //（0：停用；1：启用）
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        /* {
            title: '删除状态（0，正常，1已删除）',
            align:"center",
            dataIndex: 'delFlag'
           },*/

        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '创建者',
          align: 'center',
          dataIndex: 'createBy'
        },

        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '更新者',
          align: 'center',
          dataIndex: 'updateBy'
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
        list: '/marketingSearchterm/marketingSearchterm/list',
        delete: '/marketingSearchterm/marketingSearchterm/delete',
        deleteBatch: '/marketingSearchterm/marketingSearchterm/deleteBatch',
        updateStatus: '/marketingSearchterm/marketingSearchterm/updateStatus',
        exportXlsUrl: 'marketingSearchterm/marketingSearchterm/exportXls',
        importExcelUrl: 'marketingSearchterm/marketingSearchterm/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    handleStatus: function(id) {
      var that = this
      getAction(that.url.updateStatus, { id: id }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.success('修改失败')
        }
      })
    },
    onChangeDate(date, dateString) {
      console.log(date, dateString)
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
/*.ant-table-wrapper {
    width: 2000px;
    !*overflow-x: scroll !important;*!
  }*/
</style>
