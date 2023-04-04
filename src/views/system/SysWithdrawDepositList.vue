<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="提现单号">
              <a-input placeholder="请输入提现单号" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>

          <!-- <a-col :md="6" :sm="8">
            <a-form-item label="交易单号">
              <a-input placeholder="请输入交易单号" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col> -->
          <a-col :md="6" :sm="8">
            <a-form-item label="提现单号">
              <a-input placeholder="请输入提现单号" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="申请时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.createTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">提现</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('总账提现')">导出</a-button>
      <!-- <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown> -->
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
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="status" slot-scope="text">
          <div v-if="text == 0">
            处理中
          </div>
          <div v-else-if="text == 1">
            成功
          </div>
          <div v-else>
            失败
          </div>
        </template>
        <!-- <span slot="action" slot-scope="text, record">
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
        </span> -->
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <sysWithdrawDeposit-modal ref="modalForm" @ok="modalFormOk"></sysWithdrawDeposit-modal>
  </a-card>
</template>

<script>
import SysWithdrawDepositModal from './modules/SysWithdrawDepositModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
export default {
  name: 'SysWithdrawDepositList',
  mixins: [JeecgListMixin],
  components: {
    SysWithdrawDepositModal
  },
  data() {
    return {
      description: '总账提现管理页面',
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
          title: '提现单号',
          align: 'center',
          dataIndex: 'orderNo'
        },
        {
          title: '提现金额',
          align: 'center',
          dataIndex: 'cashAmt'
        },

        {
          //取现类型：T1-T+1取现；D1-D+1取现；D0-即时取现。
          title: '结算服务',
          align: 'center',
          dataIndex: 'cashType'
        },
        {
          title: '手续费',
          align: 'center',
          dataIndex: 'feeAmt'
        },
        {
          title: '到账金额',
          align: 'center',
          dataIndex: 'realAmt'
        },
        {
          title: '银行卡号',
          align: 'center',
          dataIndex: ''
        },

        {
          // ；0：交易处理中；1：交易成功；2：交易失败
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '说明',
          align: 'center',
          dataIndex: 'statusExplain'
        },
        {
          title: '创建者',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '申请时间',
          align: 'center',
          dataIndex: 'createTime'
        }
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align: 'center',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      url: {
        list: '/system/sysWithdrawDeposit/list',
        delete: '/system/sysWithdrawDeposit/delete',
        deleteBatch: '/system/sysWithdrawDeposit/deleteBatch',
        exportXlsUrl: 'system/sysWithdrawDeposit/exportXls',
        importExcelUrl: 'system/sysWithdrawDeposit/importExcel'
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
      console.log(this.queryParam.createTime)
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.createTime
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
