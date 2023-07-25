<!--平台福利金支付记录-->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="单号">
              <a-input placeholder="" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="交易单号">
              <a-input placeholder="" v-model="queryParam.tradeNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="身份">
              <j-dict-select-tag  v-model="queryParam.memberType"  placeholder="请选择身份"
                                  dictCode="member_type"/>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="支出账号">
                <a-input placeholder="" v-model="queryParam.phone"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="名称">
                <a-input placeholder="" v-model="queryParam.nickName"></a-input>
              </a-form-item>
            </a-col>
            <!--<a-col :md="8" :sm="8">
              <a-form-item label="类型">
                <a-select v-model="queryParam.weType" placeholder="请选择状态">
                  <a-select-option :value="0">支出</a-select-option>
                  <a-select-option :value="1">收入</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>-->
            <a-col :md="8" :sm="8">
              <a-form-item label="交易时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.bargainTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
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
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!--<a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('店铺福利金')">导出</a-button>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
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
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
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
    <marketingWelfarePayments-modal ref="modalForm" @ok="modalFormOk"></marketingWelfarePayments-modal>
  </a-card>
</template>

<script>
import MarketingWelfarePaymentsModal from './modules/MarketingWelfarePaymentsModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
export default {
  name: 'MarketingWelfarePaymentsPayRecord',
  mixins: [JeecgListMixin],
  components: {
    MarketingWelfarePaymentsModal
  },
  data() {
    return {
      description: '平台福利金支付记录',
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
          title: '单号',
          align: 'center',
          dataIndex: 'serialNumber'
        },
        {
          title: '交易单号',
          align: 'center',
          dataIndex: 'tradeNo'
        },
        {
          title: `支出${this.welfareBabelName}`,
          align: 'center',
          dataIndex: 'bargainPayments'
        },
        {
          title: '身份',
          align: 'center',
          dataIndex: 'memberType_dictText'
        },
        {
          title: '支出账号',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '名称',
          align: 'center',
          dataIndex: 'nickName'
        },
        {
          title: '交易内容',
          align: 'center',
          dataIndex: 'wpExplain'
        },
        {
          title: '交易时间',
          align: 'center',
          dataIndex: 'bargainTime'
        }
      ],
      url: {
        list: '/memberWelfarePayments/memberWelfarePayments/findMemberPayRecord',
        delete: '/marketingWelfarePayments/marketingWelfarePayments/delete',
        deleteBatch: '/marketingWelfarePayments/marketingWelfarePayments/deleteBatch',
        exportXlsUrl: 'marketingWelfarePayments/marketingWelfarePayments/exportXls',
        importExcelUrl: 'marketingWelfarePayments/marketingWelfarePayments/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.bargainTime // 时间参数不传递后台
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      this.queryParam.bargainTime_begin = dateString[0]
      this.queryParam.bargainTime_end = dateString[1]
    }
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
