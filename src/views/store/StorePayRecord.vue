<!--店铺提现-->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="单号">
              <a-input placeholder="请输入" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="店铺账号">
              <a-input placeholder="请输入" v-model="queryParam.userName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="店铺名称">
              <a-input placeholder="请输入" v-model="queryParam.storeName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="手机号">
                <a-input placeholder="请输入" v-model="queryParam.phone"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="提现方式">
                <a-select v-model="queryParam.withdrawalType"    placeholder="请选择"     style="margin-right: 10px;">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option  :value="0"   >微信</a-select-option>
                  <a-select-option  :value="1"   >支付宝</a-select-option>
                  <a-select-option  :value="2"   >银行卡</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="提现账号">
                <a-input placeholder="" v-model="queryParam.bankCard"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="收款人">
                <a-input placeholder="" v-model="queryParam.cardholder"></a-input>
              </a-form-item>
            </a-col>
            <!--时间选择框-->
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
            <a-col :md="8" :sm="8">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status"    placeholder="请选择"     style="margin-right: 10px;">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option  :value="0"   >带审核</a-select-option>
                  <a-select-option  :value="1"   >待打款</a-select-option>
                  <a-select-option  :value="2"   >已付款</a-select-option>
                  <a-select-option  :value="3"   >无效</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!--时间选择框-->
            <a-col :md="8" :sm="8">
              <a-form-item label="审核时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.auditTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange1"
                />
              </a-form-item>
            </a-col>
            <!--时间选择框-->
            <a-col :md="8" :sm="8">
              <a-form-item label="打款时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.payTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange2"
                />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8" >
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
      <!--<a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('店铺余额记录')">导出</a-button>-->
     <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
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
        bordered
        :scroll="{x:2000}"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap" >
            <div v-if="record.status == 0">待审核</div>
            <div v-if="record.status == 1">待打款</div>
            <div v-if="record.status == 2">已付款</div>
            <div v-if="record.status == 3">无效</div>
          </div>
        </template>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <storeRechargeRecord-modal ref="modalForm" @ok="modalFormOk"></storeRechargeRecord-modal>
  </a-card>
</template>

<script>
  import StoreRechargeRecordModal from './modules/StoreRechargeRecordModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util';
  export default {
    name: "StorePayRecord",
    mixins: [JeecgListMixin],
    components: {
      StoreRechargeRecordModal
    },
    data () {
      return {
        description: '店铺提现记录管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title: '单号',
            align:"center",
            dataIndex: 'orderNo'
          },
          {
            title: '店铺账号',
            align:"center",
            dataIndex: 'userName'
          },
          {
            title: '店铺名称',
            align:"center",
            dataIndex: 'storeName'
          },
          {
            title: '手机号',
            align:"center",
            dataIndex: 'phone'
          },

          {
            title: '提现金额',
            align:"center",
            dataIndex: 'money'
          },
          {
            title: '提现方式',
            align:"center",
            dataIndex: 'typeName'
          },
          {
            title: '提现账号',
            align:"center",
            dataIndex: 'bankCard'
          },
          {
            title: '收款人',
            align:"center",
            dataIndex: 'cardholder'
          },
          {
            title: '手续费',
            align:"center",
            dataIndex: 'serviceCharge'
          },
          {
            title: '实际金额',
            align:"center",
            dataIndex: 'amount'
          },
          {
            title: '申请时间',
            align:"center",
            dataIndex: 'timeApplication'
          },
          {
            title: '状态',//；0：待审核；1：待打款；2：已付款；3：无效
            align:"center",
            dataIndex: 'status',
            scopedSlots: {customRender: "status"}
          },
          {
            title: '审核时间',
            align:"center",
            dataIndex: 'auditTime'
          },
          {
            title: '打款时间',
            align:"center",
            dataIndex: 'payTime'
          },

          {
            title: '不通过原因',
            align:"center",
            dataIndex: 'closeExplain'
          },

          {
            title: '备注',
            align:"center",
            dataIndex: 'remark'
          },
        ],
        url: {
          list: "/storeWithdrawDeposit/storeWithdrawDeposit/list",
          deleteBatch: "/storeRechargeRecord/storeRechargeRecord/deleteBatch",
          exportXlsUrl: "storeRechargeRecord/storeRechargeRecord/exportXls",
          importExcelUrl: "storeRechargeRecord/storeRechargeRecord/importExcel",
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
        console.log(this.queryParam.createTime)
        var param = Object.assign({}, this.queryParam,this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTime;
        delete param.auditTime;
        delete param.payTime;
        return filterObj(param);
      },
      //申请时间
      onDateChange: function (value, dateString) {
        this.queryParam.createTime_begin=dateString[0];
        this.queryParam.createTime_end=dateString[1];
      },
      //审核时间
      onDateChange1: function (value, dateString) {
        this.queryParam.auditTime_begin=dateString[0];
        this.queryParam.auditTime_end=dateString[1];
      },
      //打款时间
      onDateChange2: function (value, dateString) {
        this.queryParam.payTime_begin=dateString[0];
        this.queryParam.payTime_end=dateString[1];
      },
    }
  }
</script>
<style scoped>
</style>