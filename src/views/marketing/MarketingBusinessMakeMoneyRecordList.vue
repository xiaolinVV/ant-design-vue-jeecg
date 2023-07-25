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
            <a-form-item label="交易类型">
              <a-select v-model="queryParam.capitalType" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">创业称号分红</a-select-option>
                <a-select-option :value="1">非称号分红</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="交易时间">
              <a-range-picker @change="onChange1" v-model="queryParam.createTime" style='width: 100%;'/>
              <!--<j-date
                placeholder="请选择开始日期"
                class="query-group-cust"
                v-model="queryParam.createTime_begin"
                date-format="YYYY-MM-DD HH:mm:ss"
              ></j-date>-->
              <!--<span class="query-group-split-cust"></span>
              <j-date
                placeholder="请选择结束日期"
                class="query-group-cust"
                v-model="queryParam.createTime_end"
                date-format="YYYY-MM-DD HH:mm:ss"
              ></j-date>-->
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
      <!--<a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('创业分红-出账资金明细')">导出</a-button>-->
      <a-button type="primary" @click = "sendCouponModel">手动出账</a-button>

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
          <a @click="showModalParticularsInformation(record.id)">查看明细</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingBusinessMakeMoneyRecord-modal ref="modalForm" @ok="modalFormOk"></marketingBusinessMakeMoneyRecord-modal>
  </a-card>
</template>

<script>
  import MarketingBusinessMakeMoneyRecordModal from './modules/MarketingBusinessMakeMoneyRecordModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import JDate from '@/components/jeecg/JDate.vue'
  import Vue from 'vue'
  import { getAction, httpAction } from '@/api/manage'
  export default {
    name: "MarketingBusinessMakeMoneyRecordList",
    mixins: [JeecgListMixin],
    components: {
        JDate,
      MarketingBusinessMakeMoneyRecordModal
    },
    data () {
      return {
        description: '出账资金管理页面',
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
            title: '出账方式',
            align: "center",
            dataIndex: 'paymentsModel',
            scopedSlots: {
              customRender: 'paymentsModel'
            },
            customRender: function (text) {
              if (text == 0) {
                return '每日分红'
              } else if (text == 1) {
                return '手动出账'
              }
            }
          },
          {
            title: '出账金额',
            align: "center",
            dataIndex: 'amount'
          },
          {
            title: '交易类型',
            align: "center",
            dataIndex: 'tradeType_dictText'
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
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        noticeAnnounceList: [],
        url: {
          list: "marketingBusinessMakeMoney/marketingBusinessMakeMoney/comeList",
          delete: "/marketingBusinessMakeMoneyRecord/marketingBusinessMakeMoneyRecord/delete",
          deleteBatch: "/marketingBusinessMakeMoneyRecord/marketingBusinessMakeMoneyRecord/deleteBatch",
          exportXlsUrl: "marketingBusinessMakeMoneyRecord/marketingBusinessMakeMoneyRecord/exportXls",
          importExcelUrl: "marketingBusinessMakeMoneyRecord/marketingBusinessMakeMoneyRecord/importExcel",
          findMarketingBusinessCapitalMaps:"marketingBusinessCapital/marketingBusinessCapital/findMarketingBusinessCapitalMaps"
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    created() {
      this.getFindEnterpriseAnnouncementTypeMap()
    },
    methods: {
      sendCouponModel(value = {}){
        value.modalTitle = '手动出账'
        this.$refs.MarketingBusinessMakeMoneyRecordList.open(value);
      },
      onChange1(date, dateString) {
        this.queryParam.createTime_begin = dateString[0]
        this.queryParam.createTime_end = dateString[1]
        console.log(date, dateString);
      },
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
      //详情信息
      showModalParticularsInformation(id) {
        this.$refs.modalForm.showModalParticularsInformation(id);
        this.$refs.modalForm.title = "查看明细";
        this.$refs.modalForm.disableSubmit = false;
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>