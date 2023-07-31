<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="流水号">
              <a-input placeholder="请输入" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="福利金收款时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.createTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="店铺账号">
              <a-input placeholder="请输入" v-model="queryParam.username"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="店铺名称">
                <a-input placeholder="请输入" v-model="queryParam.storeName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="用户名称">
                <a-input placeholder="请输入" v-model="queryParam.nickName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="用户账号">
                <a-input placeholder="请输入" v-model="queryParam.phone"></a-input>
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
    <div class="table-operator">
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!--<a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('福利金收款记录')">导出</a-button>
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
        rowKey="id"
        :columns="columns"
        bordered
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status==0">停用</span>
            <span shape="square" v-if="record.status==1">启用</span>
          </div>
        </template>
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
    <storeWelfarePaymentsRecord-modal ref="modalForm" @ok="modalFormOk"></storeWelfarePaymentsRecord-modal>
  </a-card>
</template>

<script>
  import StoreWelfarePaymentsRecordModal from './modules/StoreWelfarePaymentsRecordModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util';
  import {httpAction, getAction} from '@/api/manage'
  export default {
    name: "StoreWelfarePaymentsRecordList",
    mixins: [JeecgListMixin],
    components: {
      StoreWelfarePaymentsRecordModal
    },
    data () {
      return {
        description: '福利金收款记录管理页面',
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
            dataIndex: 'orderNo'
          },
          {
            title: '福利金收款时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '店铺账号',
            align: "center",
            dataIndex: 'username'
          },
          {
            title: '店铺名称',
            align: "center",
            dataIndex: 'storeName'
          },
          {
            title: '用户名称',
            align: "center",
            dataIndex: 'nickName'
          },
          {
            title: '用户账号',
            align: "center",
            dataIndex: 'phone'
          },
          {
            title: '福利金金额',
            align: "center",
            dataIndex: 'welfarePayments'
          },
          {
            title: '收款金额',
            align: "center",
            dataIndex: 'gatheringMoney'
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'status',
            scopedSlots: {customRender: 'status'},
          },
          {
            title: '收款说明',
            align: "center",
            dataIndex: 'gatheringExplain'
          },
          {
            title: '备注',
            align: "center",
            dataIndex: 'remark'
          },
          /*{
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }*/
        ],
        url: {
          list: "/storeWelfarePaymentsRecord/storeWelfarePaymentsRecord/list",
          delete: "/storeWelfarePaymentsRecord/storeWelfarePaymentsRecord/delete",
          deleteBatch: "/storeWelfarePaymentsRecord/storeWelfarePaymentsRecord/deleteBatch",
          exportXlsUrl: "storeWelfarePaymentsRecord/storeWelfarePaymentsRecord/exportXls",
          importExcelUrl: "storeWelfarePaymentsRecord/storeWelfarePaymentsRecord/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      getQueryParams(){
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTime;
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        this.queryParam.createTime_begin = dateString[0];
        this.queryParam.createTime_end = dateString[1];
      },
    }
  }
</script>
<style scoped>
</style>