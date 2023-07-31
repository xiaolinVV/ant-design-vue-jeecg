<!--会员福利金-->
<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="流水号">
              <a-input placeholder="" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员账号">
              <a-input placeholder="" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员昵称">
              <a-input placeholder="" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="交易类型">
                <j-dict-select-tag v-model="queryParam.tradeType" placeholder="请选择"
                                   dictCode="member_welfare_deal_type"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="交易状态">
                <j-dict-select-tag v-model="queryParam.tradeStatus" placeholder="请选择"
                                   dictCode="trade_status"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="收入支出">
                <a-select v-model="queryParam.weType"    placeholder="请选择"     style="margin-right: 10px;">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option  :value="0">支出</a-select-option>
                  <a-select-option  :value="1">收入</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="来源/去向">
                <a-input placeholder="" v-model="queryParam.goAndCome"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="交易时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.bargainTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange1"
                />
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
<!--      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!--<a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('会员福利金')">导出</a-button>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a
        style="font-weight: 600">{{ selectedRowKeys.length }}</a>项

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
    <memberWelfarePayments-modal ref="modalForm" @ok="modalFormOk"></memberWelfarePayments-modal>
  </a-card>
</template>

<script>
  import MemberWelfarePaymentsModal from './modules/MemberWelfarePaymentsModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util';
  export default {
    name: "MemberWelfarePaymentsList",
    mixins: [JeecgListMixin],
    components: {
      MemberWelfarePaymentsModal
    },
    data () {
      return {
        description: '会员福利金管理页面',
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
            title: '会员账号',
            align: "center",
            dataIndex: 'phone'
          },
          {
            title: '会员昵称',
            align: "center",
            dataIndex: 'nickName'
          },
          {
            title: '交易类型',
            align: "center",
            dataIndex: 'tradeType_dictText'
          },
          {
            title: '收入/支出',
            align: "center",
            dataIndex: 'typeName'
          },
          {
            title: `交易${this.welfareBabelName}`,
            align: "center",
            dataIndex: 'bargainPayments'
          },
          {
            title: '交易状态',
            align: "center",
            dataIndex: 'tradeStatus_dictText'
      },
          {
            title: '来源/去向',
            align: "center",
            dataIndex: 'goAndCome'
          },
          {
            title: '交易时间',
            align: "center",
            dataIndex: 'bargainTime'
          },
          {
            title: '说明',
            align: "center",
            dataIndex: 'wpExplain'
          },
        ],
        url: {
          list: "/memberWelfarePayments/memberWelfarePayments/findMemberWelfarePayments",
          delete: "/memberWelfarePayments/memberWelfarePayments/delete",
          deleteBatch: "/memberWelfarePayments/memberWelfarePayments/deleteBatch",
          exportXlsUrl: "memberWelfarePayments/memberWelfarePayments/exportXls",
          importExcelUrl: "memberWelfarePayments/memberWelfarePayments/importExcel",
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
        var param = Object.assign({}, this.queryParam,this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.bargainTime; //合作时间
        return filterObj(param);
      },
      onDateChange1: function (value, dateString) {
        this.queryParam.bargainTime_begin=dateString[0];
        this.queryParam.bargainTime_end=dateString[1];
      },
      onDateOk(value) {
        console.log(value);
      },
    }
  }
</script>
<style scoped lang="less">
  .table-operator {
    margin-bottom: 10px;
    button {
      margin-right: 8px;
    }
  }
</style>