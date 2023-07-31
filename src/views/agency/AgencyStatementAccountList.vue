<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <!--时间选择框-->
          <a-col :md="8" :sm="8">
            <a-form-item label="交易时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.calendarDate"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="代理账号">
              <a-input placeholder="请输入" v-model="queryParam.userName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="代理">
              <a-input placeholder="请输入" v-model="queryParam.realname"></a-input>
            </a-form-item>
          </a-col>
          <!--<a-col :md="8" :sm="8">
            <a-form-item label="交易类型">
              <j-dict-select-tag v-model="queryParam.payType" placeholder="请选择"
                                 dictCode="store_deal_type"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="单号">
              <a-input placeholder="订单编号/提现单号/退款单号/交易单号" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>-->


          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!--<a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('代理列表')">导出</a-button>-->
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
       <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('代理对账单')">导出</a-button>
       <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
         <a-button type="primary" icon="import">导入</a-button>
       </a-upload>
       <a-dropdown v-if="selectedRowKeys.length > 0">
         <a-menu slot="overlay">
           <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
         </a-menu>
         <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
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
          <a @click="showModalParticularsInformation(record.id)">查看详情</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <agencyStatementAccount-modal ref="modalForm" @ok="modalFormOk"></agencyStatementAccount-modal>
  </a-card>
</template>

<script>
  import AgencyStatementAccountModal from './modules/AgencyStatementAccountModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util';
  export default {
    name: "AgencyStatementAccountList",
    mixins: [JeecgListMixin],
    components: {
      AgencyStatementAccountModal
    },
    data () {
      return {
        description: '代理对账单管理页面',
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
            title: '日期',
            align: "center",
            dataIndex: 'calendarDate'
          },
          {
            title: '代理账号',
            align: "center",
            dataIndex: 'userName'
          },
          {
            title: '代理',
            align: "center",
            dataIndex: 'realname'
          },
          {
            title: '收入（元）',
            align: "center",
            dataIndex: 'earning'
          },
          {
            title: '收入笔数',
            align: "center",
            dataIndex: 'incomeNumber'
          },
          {
            title: '支出',
            align: "center",
            dataIndex: 'expenditure'
          },
          {
            title: '支出笔数',
            align: "center",
            dataIndex: 'expenditureNumber'
          },
          {
            title: '收益',
            align: "center",
            dataIndex: 'revenue'
          },
          {
            title: '期初余额（元）',
            align: "center",
            dataIndex: 'startBalance'
          },
          {
            title: '期末余额（元）',
            align: "center",
            dataIndex: 'endBalance'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/agencyStatementAccount/agencyStatementAccount/list",
          delete: "/agencyStatementAccount/agencyStatementAccount/delete",
          deleteBatch: "/agencyStatementAccount/agencyStatementAccount/deleteBatch",
          exportXlsUrl: "agencyStatementAccount/agencyStatementAccount/exportXls",
          importExcelUrl: "agencyStatementAccount/agencyStatementAccount/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      /**查询栏时间区间查询*/
      getQueryParams(){
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.calendarDate;

        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        this.queryParam.calendarDate_begin = dateString[0];
        this.queryParam.calendarDate_end = dateString[1];
      },
      onDateOk(value) {
        console.log(value);
      },

      //详情信息
      showModalParticularsInformation(id) {
        this.$refs.modalForm.showModalParticularsInformation(id);
        this.$refs.modalForm.title = "详情信息";
        this.$refs.modalForm.disableSubmit = false;
      },
    }
  }
</script>
<style scoped>
</style>