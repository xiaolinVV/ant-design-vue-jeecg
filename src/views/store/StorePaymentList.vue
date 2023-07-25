<!--店铺缴费记录-->
<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item
              label="联系人">
              <a-input placeholder="请输入联系人" v-model="queryParam.bossName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="联系人手机">
              <a-input placeholder="请输入联系人手机" v-model="queryParam.bossPhone"></a-input>
            </a-form-item>
          </a-col>
          <!--设置为下拉框-->
          <a-col :md="8" :sm="8">
            <a-form-item label="开通类型">
              <a-select v-model="queryParam.openType" placeholder="请输入开通类型">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option value="0">包年</a-select-option>
                <a-select-option value="1">终生</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
          <!--时间选择框-->
          <a-col :md="8" :sm="8">
            <a-form-item label="开通时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.startTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>

          <!--时间选择框-->
          <a-col :md="8" :sm="8">
            <a-form-item label="到期时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.endTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange1"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>
          <!--时间选择框-->
          <a-col :md="8" :sm="8">
            <a-form-item label="支付时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.payTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange2"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item
                label="流水号">
                <a-input placeholder="请输入" v-model="queryParam.id"></a-input>
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
      <!--<a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('店铺缴费记录')">导出</a-button>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        bordered
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="openType" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.openType==0">包年</span>
            <span shape="square" v-if="record.openType==1">终生</span>
          </div>
        </template>
        <template slot="payStatus" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.payStatus==0">未支付</span>
            <span shape="square" v-if="record.payStatus==1">已支付</span>
          </div>
        </template>
        <template slot="payType" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.payType==0">微信</span>
            <span shape="square" v-if="record.payType==1">支付宝</span>
          </div>
        </template>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <storePayment-modal ref="modalForm" @ok="modalFormOk"></storePayment-modal>
  </a-card>
</template>

<script>
  import StorePaymentModal from './modules/StorePaymentModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import Vue from 'vue'
  import {filterObj} from '@/utils/util';
  import {deleteAction, getAction, downFile} from '@/api/manage'
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import {putAction} from '@/api/manage'
  export default {
    name: "StorePaymentList",
    mixins: [JeecgListMixin],
    components: {
      StorePaymentModal
    },
    data () {
      return {
        description: '店铺消费记录管理页面',
        queryParam: {
          startTime: [],
          endTime: [],
          payTime: [],
        },
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
            dataIndex: 'id'
          },
          {
            title: '联系人',
            align: "center",
            dataIndex: 'bossName'
          },
          {
            title: '联系人手机号',
            align: "center",
            dataIndex: 'bossPhone'
          },
          {
            title: '开通类型',
            align: "center",
            dataIndex: 'openType',
            scopedSlots: {customRender: "openType"}
          },
          {
            title: '费用(元)',
            align: "center",
            dataIndex: 'money'
          },
          {
            title: '开通时间',
            align: "center",
            dataIndex: 'startTime'
          },
          {
            title: '到期时间',
            align: "center",
            dataIndex: 'endTime',
          },
          /*{
            title: '支付状态',
            align: "center",
            dataIndex: 'payStatus',
            scopedSlots: {customRender: "payStatus"}
          },*/
          {
            title: '支付方式',
            align: "center",
            dataIndex: 'payType',
            scopedSlots: {customRender: "payType"}
          },
          {
            title: '支付时间',
            align: "center",
            dataIndex: 'payTime'
          },
        ],
        url: {
          list: "/storePayment/storePayment/list",
          delete: "/storePayment/storePayment/delete",
          deleteBatch: "/storePayment/storePayment/deleteBatch",
          exportXlsUrl: "storePayment/storePayment/exportXls",
          importExcelUrl: "storePayment/storePayment/importExcel",
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
        delete param.startTime; // 时间参数不传递后台
        delete param.endTime; // 时间参数不传递后台
        delete param.payTime; // 时间参数不传递后台
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        console.log(dateString[0],dateString[1]);
        this.queryParam.startTime_begin=dateString[0];
        this.queryParam.startTime_end=dateString[1];
      },
      onDateChange1: function (value, dateString) {
        console.log(dateString[0],dateString[1]);
        this.queryParam.endTime_begin=dateString[0];
        this.queryParam.endTime_end=dateString[1];
      },
      onDateChange2: function (value, dateString) {
        console.log(dateString[0],dateString[1]);
        this.queryParam.payTime_begin=dateString[0];
        this.queryParam.payTime_end=dateString[1];
      },
      onDateOk(value) {
        console.log(value);
      },
    }
  }
</script>
<style scoped>
</style>