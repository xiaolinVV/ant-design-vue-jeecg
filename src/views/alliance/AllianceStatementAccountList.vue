<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
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
            <a-form-item label="用户账号">
              <a-input placeholder="请输入" v-model="queryParam.username"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="用户名字">
              <a-input placeholder="请输入" v-model="queryParam.realname"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="公司名称">
                <a-input placeholder="请输入" v-model="queryParam.name"></a-input>
              </a-form-item>
            </a-col>
          </template>
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
    <!--<div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('加盟商对账单')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
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
      </a-dropdown>
    </div>-->

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
          <!--<a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>-->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
<!--    @ok="modalFormOk"-->
    <allianceStatementAccount-modal ref="modalForm" ></allianceStatementAccount-modal>
  </a-card>
</template>

<script>
  import AllianceStatementAccountModal from './modules/AllianceStatementAccountModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import { httpAction , getAction ,putAction} from '@/api/manage'
  import { filterObj } from '@/utils/util';
  export default {
    name: "AllianceStatementAccountList",
    mixins: [JeecgListMixin],
    components: {
      AllianceStatementAccountModal
    },
    data () {
      return {
        description: '加盟商对账单管理页面',
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
            title: '用户账号',
            align: "center",
            dataIndex: 'username'
          },
          {
            title: '用户名字',
            align: "center",
            dataIndex: 'realname'
          },
          {
            title: '公司名称',
            align: "center",
            dataIndex: 'name'
          },
          {
            title: '收入(元)',
            align: "center",
            dataIndex: 'earning'
          },
          {
            title: '收入笔数',
            align: "center",
            dataIndex: 'incomeNumber'
          },
          {
            title: '支出(元)',
            align: "center",
            dataIndex: 'expenditure'
          },
          {
            title: '支出笔数',
            align: "center",
            dataIndex: 'expenditureNumber'
          },
          {
            title: '收益(元)',
            align: "center",
            dataIndex: 'revenue'
          },
          {
            title: '期初余额(元)',
            align: "center",
            dataIndex: 'startBalance'
          },
          {
            title: '期末余额(元)',
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
          list: "/allianceStatementAccount/allianceStatementAccount/list",
          delete: "/allianceStatementAccount/allianceStatementAccount/delete",
          deleteBatch: "/allianceStatementAccount/allianceStatementAccount/deleteBatch",
          exportXlsUrl: "allianceStatementAccount/allianceStatementAccount/exportXls",
          importExcelUrl: "allianceStatementAccount/allianceStatementAccount/importExcel",
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
      },//详情信息
      showModalParticularsInformation(id) {
        this.$refs.modalForm.showModalParticularsInformation(id);
        this.$refs.modalForm.title = "详情信息";
        // this.$refs.modalForm.disableSubmit = false;
      },

    }
  }
</script>
<style scoped>

</style>