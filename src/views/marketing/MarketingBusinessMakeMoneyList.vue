<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="流水号">
              <a-input placeholder="请输入" v-model="queryParam.year"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="资金池编号">
              <a-input placeholder="请输入" v-model="queryParam.month"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="资金池名称">
              <a-select
                v-model="queryParam.marketingBusinessCapitalId"
                show-search
                option-filter-prop="children"
                :filter-option="filterOption"
                placeholder="请选择"
              >
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="(item, index) in noticeAnnounceList" :key="index" :value="item.id">
                  {{ item.capitalName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="交易时间">
              <j-date
                placeholder="请选择开始日期"
                class="query-group-cust"
                v-model="queryParam.createTime_begin"
              ></j-date>
              <span class="query-group-split-cust"></span>
              <j-date
                placeholder="请选择结束日期"
                class="query-group-cust"
                v-model="queryParam.createTime_end"
              ></j-date>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="交易单号">
              <a-input placeholder="请输入" v-model="queryParam.month"></a-input>
            </a-form-item>
          </a-col>
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
      <!--<a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('进出账资金')">导出</a-button>-->
      <!--<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a
        style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
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
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingBusinessMakeMoney-modal ref="modalForm" @ok="modalFormOk"></marketingBusinessMakeMoney-modal>
  </a-card>
</template>

<script>
  import MarketingBusinessMakeMoneyModal from './modules/MarketingBusinessMakeMoneyModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import JDate from '@/components/jeecg/JDate.vue'
  import { getAction, httpAction } from '@/api/manage'
  export default {
    name: "MarketingBusinessMakeMoneyList",
    mixins: [JeecgListMixin],
    components: {
      JDate,
      MarketingBusinessMakeMoneyModal
    },
    data () {
      return {
        description: '进账资金管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '流水号',
            align: "center",
            dataIndex: 'serialNumber'
          },
          {
            title: '资金池编号',
            align: "center",
            dataIndex: 'marketingBusinessCapitalId'
          },
          {
            title: '资金池名称',
            align: "center",
            dataIndex: 'capitalName'
          },
          {
            title: '交易类型',
            align: "center",
            dataIndex: 'tradeType_dictText'
          },
          {
            title: '分红资金',
            align: "center",
            dataIndex: 'bonusMoney'
          },
          {
            title: '进账比例',
            align: "center",
            dataIndex: 'makeProportion'
          },
          {
            title: '进账金额',
            align: "center",
            dataIndex: 'amount'
          },
          {
            title: '资金池余额',
            align: "center",
            dataIndex: 'totalBalance'
          },
          {
            title: '交易时间',
            align: "center",
            dataIndex: 'payTime'
          },
          {
            title: '交易单号',
            align: "center",
            dataIndex: 'tradeNo'
          },
        ],
        noticeAnnounceList: [],
        url: {
          list: "/marketingBusinessMakeMoney/marketingBusinessMakeMoney/list",
          delete: "/marketingBusinessMakeMoney/marketingBusinessMakeMoney/delete",
          deleteBatch: "/marketingBusinessMakeMoney/marketingBusinessMakeMoney/deleteBatch",
          exportXlsUrl: "marketingBusinessMakeMoney/marketingBusinessMakeMoney/exportXls",
          importExcelUrl: "marketingBusinessMakeMoney/marketingBusinessMakeMoney/importExcel",
          findMarketingBusinessCapitalMaps:"marketingBusinessCapital/marketingBusinessCapital/findMarketingBusinessCapitalMaps"
        },
      }
    },
    created() {
      this.getFindEnterpriseAnnouncementTypeMap()
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      getFindEnterpriseAnnouncementTypeMap() {
        getAction(this.url.findMarketingBusinessCapitalMaps, {}).then(res => {
          if (res.success) {
            this.noticeAnnounceList = res.result
          }
        })
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>