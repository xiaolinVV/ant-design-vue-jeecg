<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="流水号">
              <a-input placeholder="请输入流水号" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员账号">
              <a-input placeholder="请输入会员账号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员昵称">
              <a-input placeholder="请输入会员昵称" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="交易类型">
              <j-dict-select-tag
                v-model="queryParam.tradeType"
                placeholder="请选择"
                dictCode="third_integral_deal_typ"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="收入支出">
              <a-select v-model="queryParam.goAndCome" placeholder="请选择" style="margin-right: 10px;">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">收入</a-select-option>
                <a-select-option :value="1">支出</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="交易单号">
              <a-input placeholder="请输入" v-model="queryParam.tradeNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="交易时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam2.createTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('积分记录')">导出</a-button> -->
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset2" icon="reload" style="margin-left: 8px">重置</a-button>
      <!-- <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
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
        :scroll="{ x: true }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="goAndCome" slot-scope="text, record, index">
          {{ text }}
          <!-- <div class="anty-img-wrap">
            <div v-if="record.goAndCome == 0">收入</div>
            <div v-if="record.goAndCome == 1">支出</div>
          </div> -->
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
    <marketingIntegralRecord-modal ref="modalForm" @ok="modalFormOk"></marketingIntegralRecord-modal>
  </a-card>
</template>

<script>
import MarketingIntegralRecordModal from './modules/MarketingIntegralRecordModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: 'MarketingIntegralRecordList',
  mixins: [JeecgListMixin],
  components: {
    MarketingIntegralRecordModal
  },
  data() {
    return {
      description: '积分记录管理页面',
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
          align: 'center',
          dataIndex: 'serialNumber'
        },
        {
          title: '会员账号',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '会员昵称',
          align: 'center',
          dataIndex: 'nickName'
        },
        // ：字典类型：0：注册成功；1：交易密码；2：连续签到；3：每日浏览；4；邀请签到；5：邀请注册'
        {
          title: '交易类型',
          align: 'center',
          dataIndex: 'tradeType'
        },
        {
          title: '积分分组',
          align: 'center',
          dataIndex: 'integralGroup'
        },
        {
          // ；0：收入；1：支出
          title: '收入/支出',
          align: 'center',
          dataIndex: 'goAndCome',
          scopedSlots: { customRender: 'goAndCome' }
        },
        {
          title: '交易积分',
          align: 'center',
          dataIndex: 'integral'
        },
        {
          title: '积分余额',
          align: 'center',
          dataIndex: 'integralBalance'
        },
        {
          title: '积分总余额',
          align: 'center',
          dataIndex: ''
        },
        {
          title: '交易单号',
          align: 'center',
          dataIndex: 'tradeNo'
        },
        {
          title: '交易时间',
          align: 'center',
          dataIndex: 'payTime'
        }
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align: 'center',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      queryParam2: {},
      url: {
        list: '/marketing/marketingThirdIntegralRecord/list',
        delete: '/marketing/marketingThirdIntegralRecord/delete',
        deleteBatch: '/marketing/marketingThirdIntegralRecord/deleteBatch',
        exportXlsUrl: 'marketing/marketingThirdIntegralRecord/exportXls',
        importExcelUrl: 'marketing/marketingThirdIntegralRecord/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    searchReset2() {
      this.queryParam2 = {}
      this.searchReset()
    },
    onDateChange: function(value, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    }
  }
}
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>
