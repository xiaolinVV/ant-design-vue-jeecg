<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-row :gutter="24">
            <a-col :md="8" :sm="8">
              <a-form-item label="称号编号">
                <a-input placeholder="请输入称号编号" v-model="queryParam.serialNumber"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="称号名称">
                <a-input placeholder="请输入称号名称" v-model="queryParam.giftName"></a-input>
              </a-form-item>
            </a-col>
          </a-row>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
      <!-- <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('创业团身份')">导出</a-button> -->
      <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
    </div>

    <!-- table区域-begin -->
    <div>
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
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <!-- <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingBusinessGiftIdentity-modal ref="modalForm" @ok="modalFormOk"></marketingBusinessGiftIdentity-modal>
  </a-card>
</template>

<script>
import MarketingBusinessGiftIdentityModal from './modules/MarketingBusinessGiftIdentityModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: 'MarketingBusinessGiftIdentityList',
  mixins: [JeecgListMixin],
  components: {
    MarketingBusinessGiftIdentityModal
  },
  data() {
    return {
      description: '创业团身份管理页面',
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
          title: '称号编号',
          align: 'center',
          dataIndex: 'id'
        },

        {
          title: '称号名称',
          align: 'center',
          dataIndex: 'identityName'
        },
        {
          title: '级别',
          align: 'center',
          dataIndex: 'grade',
          scopedSlots: { customRender: 'grade' }
        },
        {
          title: '发展奖励(%)',
          align: 'center',
          dataIndex: 'developmentReward'
        },
        {
          title: '推荐奖励(%)',
          align: 'center',
          dataIndex: 'referralBonuses'
        },
        {
          title: '业绩达标奖励(%)',
          align: 'center',
          dataIndex: 'standardReward'
        },

        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/marketing/marketingBusinessGiftIdentity/list',
        delete: '/marketing/marketingBusinessGiftIdentity/delete',
        deleteBatch: '/marketing/marketingBusinessGiftIdentity/deleteBatch',
        exportXlsUrl: 'marketing/marketingBusinessGiftIdentity/exportXls',
        importExcelUrl: 'marketing/marketingBusinessGiftIdentity/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {}
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
