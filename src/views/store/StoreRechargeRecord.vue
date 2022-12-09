<!--店铺充值记录-->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="充值时间">
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
            <a-form-item label="店铺名称">
              <a-input placeholder="" v-model="queryParam.storeName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="店铺账号">
              <a-input placeholder="" v-model="queryParam.userName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="流水号">
                <a-input placeholder="" v-model="queryParam.orderNo"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="支付方式">
                <a-select v-model="queryParam.payment" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option value="0">微信支付</a-select-option>
                  <a-select-option value="1">支付宝支付</a-select-option>
                </a-select>
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
      <!--<a-button type="primary" icon="download" @click="handleExportXls('店铺余额记录')">导出</a-button>-->
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
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="payment" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.payment==0" >微信支付</span>
            <span shape="square" v-if="record.payment==1" >支付宝支付</span>
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

  </a-card>
</template>

<script>
  import StoreRechargeRecordModal from './modules/StoreRechargeRecordModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'

  export default {
    name: "StoreRechargeRecord",
    mixins: [JeecgListMixin],
    components: {
      StoreRechargeRecordModal
    },
    data () {
      return {
        description: '店铺充值记录管理页面',
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
            title: '充值时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '店铺账号',
            align: "center",
            dataIndex: 'userName'
          },
          {
            title: '店铺名称',
            align: "center",
            dataIndex: 'storeName'
          },
          {
            title: '交易类型',
            align: "center",
            dataIndex: 'payType_dictText'
          },
          {
            title: '流水号',
            align: "center",
            dataIndex: 'orderNo'
          },
          {
            title: '交易金额',
            align: "center",
            dataIndex: 'amount'
          },
          {
            title: '交易状态',
            align: "center",
            dataIndex: 'tradeStatus_dictText'
          },
          {
            title: '支付方式',
            align: "center",
            dataIndex: 'payment',
            scopedSlots: {customRender: "payment"}
          },
          {
            title: '操作人',
            align: "center",
            dataIndex: 'operator'
          },
          {
            title: '备注说明',
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
          list: "/storeRechargeRecord/storeRechargeRecord/findRechargeRecord",
          delete: "/storeRechargeRecord/storeRechargeRecord/delete",
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
        var param = Object.assign({}, this.queryParam,this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTime;
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        this.queryParam.createTime_begin=dateString[0];
        this.queryParam.createTime_end=dateString[1];
      },
      onDateOk(value) {
        console.log(value);
      },
    }

  }
</script>
<style scoped>
</style>