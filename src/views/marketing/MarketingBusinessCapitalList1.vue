<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="资金池编号">
              <a-input placeholder="请输入" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="资金池名称">
              <a-input placeholder="请输入" v-model="queryParam.capitalName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->


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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingBusinessCapital-modal ref="modalForm" @ok="modalFormOk"></marketingBusinessCapital-modal>
  </a-card>
</template>

<script>
  import MarketingBusinessCapitalModal from './modules/MarketingBusinessCapitalModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "MarketingBusinessCapitalList1",
    mixins:[JeecgListMixin],
    components: {
      MarketingBusinessCapitalModal
    },
    data () {
      return {
        description: '资金配置管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title: '资金池编号',
            align: "center",
            dataIndex: 'id'
          },
          {
            title: '资金池名称',
            align: "center",
            dataIndex: 'capitalName',
          },
          {
            title: '资金池余额',
            align: "center",
            dataIndex: 'balance',
          },
          {
            title: '累计入账金额',
            align: "center",
            dataIndex: 'recordedAmount',
          },
          {
            title: '累计出账金额',
            align: "center",
            dataIndex: 'accountsAmount',
          },
        ],
        url: {
          list: "/marketingBusinessCapital/marketingBusinessCapital/list",
          delete: "/marketingBusinessCapital/marketingBusinessCapital/delete",
          deleteBatch: "/marketingBusinessCapital/marketingBusinessCapital/deleteBatch",
          exportXlsUrl: "marketingBusinessCapital/marketingBusinessCapital/exportXls",
          importExcelUrl: "marketingBusinessCapital/marketingBusinessCapital/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>