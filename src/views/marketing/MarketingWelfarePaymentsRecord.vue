<!--福利金赠送记录表-->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="流水号">
              <a-input placeholder="请输入" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="店铺名称">
              <a-input placeholder="请输入" v-model="queryParam.storeName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="店铺账号">
              <a-input placeholder="请输入" v-model="queryParam.username"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="获赠账号">
              <a-input placeholder="请输入" v-model="queryParam.goAndCome"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="增送时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.bargainTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="操作人">
              <a-input placeholder="请输入" v-model="queryParam.operator"></a-input>
            </a-form-item>
          </a-col>
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
      <a-button @click="PopUp" type="primary" icon="plus">送福利金</a-button>
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!--<a-button type="primary" icon="download" @click="handleExportXls('店铺福利金')">导出</a-button>-->
      <!--<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
      <!--<a-dropdown v-if="selectedRowKeys.length > 0">
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
        :scroll="{x:true}"
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

    <!-- 表单区域 -->
    <marketingWelfarePayments-modal ref="modalForm"></marketingWelfarePayments-modal>
  </a-card>
</template>

<script>
  import MarketingWelfarePaymentsModal from './modules/MarketingWelfarePaymentsModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { filterObj } from '@/utils/util'
  import { getAction, putAction } from '@/api/manage'
  import Vue from 'vue'
  export default {
    name: 'MarketingWelfarePaymentsRecord',
    mixins: [JeecgListMixin],
    components: {
      MarketingWelfarePaymentsModal
    },
    data() {
      return {
        description: '店铺福利金管理页面',
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
            title: '流水号',
            align: "center",
            dataIndex: 'serialNumber'
          },
          {
            title: '店铺名称',
            align: "center",
            dataIndex: 'storeName'
          },
          {
            title: '店铺账号',
            align: "center",
            dataIndex: 'username'
          },
          {
            title: '获赠用户类型',
            align: "center",
            dataIndex: 'userType'
          },
          {
            title: '获赠账号',
            align: "center",
            dataIndex: 'goAndCome'
          },
          {
            title: '交易方式',
            align: "center",
            dataIndex: 'tradeType'
          },
          {
            title: '赠送福利金',
            align: "center",
            dataIndex: 'bargainPayments'
          },
          {
            title: '福利金支付',
            align: "center",
            dataIndex: 'welfarePay'
          },
          {
            title: '账户余额支付',
            align: "center",
            dataIndex: 'balancePay'
          },
          {
            title: '赠送时间',
            align: "center",
            dataIndex: 'bargainTime'
          },
          {
            title: '操作人',
            align: "center",
            dataIndex: 'operator'
          },
          {
            title: '说明',
            align: "center",
            dataIndex: 'giveExplain'
          },
        ],
        url: {
          list: '/marketingWelfarePayments/marketingWelfarePayments/findStoreWelfarePayments',
          delete: '/marketingWelfarePayments/marketingWelfarePayments/delete',
          deleteBatch: '/marketingWelfarePayments/marketingWelfarePayments/deleteBatch',
          exportXlsUrl: 'marketingWelfarePayments/marketingWelfarePayments/exportXls',
          importExcelUrl: 'marketingWelfarePayments/marketingWelfarePayments/importExcel',
          findBalanceByWelfarePayments: '/storeManage/storeManage/findBalanceByWelfarePayments'//店铺福利金接口
        },
        ShowPopUp: false,
        AllData: {
          phone: '',
          welfarePayments: '',
          explain: ''
        },
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
      },

      //送福利金
      PopUp() {
        this.$refs.modalForm.title = '送福利金'
        this.$refs.modalForm.disableSubmit = false
        getAction(this.url.findBalanceByWelfarePayments).then(res => {
          this.$refs.modalForm.showModalPopUp(res)
          console.log(res)
        })
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