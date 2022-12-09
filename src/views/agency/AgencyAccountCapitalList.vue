<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <!--时间选择框-->
          <a-col :md="8" :sm="8">
            <a-form-item label="交易时间">
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
            <a-form-item label="代理账号">
              <a-input placeholder="请输入" v-model="queryParam.userName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="代理">
              <a-input placeholder="请输入" v-model="queryParam.realname"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="交易类型">
                <j-dict-select-tag  v-model="queryParam.payType"  placeholder="请选择"
                                    dictCode="agency_deal_type"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="收入支出">
                <a-select v-model="queryParam.goAndCome"    placeholder="请选择"     style="margin-right: 10px;">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option  :value="0">收入</a-select-option>
                  <a-select-option  :value="1">支出</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="流水号">
                <a-input placeholder="请输入" v-model="queryParam.orderNo"></a-input>
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
      <!--<a-button type="primary" icon="download" @click="handleExportXls('代理资金流水')">导出</a-button>-->
   <!--   <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
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
        <template slot="goAndCome" slot-scope="text, record, index">
          <div class="anty-img-wrap" >
            <div v-if="record.goAndCome == 0">收入</div>
            <div v-if="record.goAndCome == 1">支出</div>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
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
    <agencyAccountCapital-modal ref="modalForm" @ok="modalFormOk"></agencyAccountCapital-modal>
  </a-card>
</template>

<script>
  import AgencyAccountCapitalModal from './modules/AgencyAccountCapitalModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util';
  export default {
    name: "AgencyAccountCapitalList",
    mixins:[JeecgListMixin],
    components: {
      AgencyAccountCapitalModal
    },
    data () {
      return {
        description: '代理资金流水管理页面',
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
            title: '交易时间',
            align:"center",
            dataIndex: 'createTime'
          },
          {
            title: '代理账号',
            align:"center",
            dataIndex: 'userName'
          },
          {
            title: '代理',
            align:"center",
            dataIndex: 'realname'
          },
          {
            title: '交易类型',//；0：订单交易；1：提现；2：订单退款；3：余额充值；做成数据字典
            align:"center",
            dataIndex: 'payType_dictText'
          },
          {
            title: '收入/支出',
            align:"center",
            dataIndex: 'goAndCome',
            scopedSlots: {customRender: "goAndCome"}
          },
          {
            title: '交易金额',
            align:"center",
            dataIndex: 'amount'
          },
          {
            title: '账号余额',//;0：未支付；1：进行中；2：待结算：3：待打款；4：待退款；5：交易完成；6：已退款；7：交易关闭
            align:"center",
            dataIndex: 'balance',
          },
          {
            title: '流水号',
            align:"center",
            dataIndex: 'orderNo'
          },
          {
            title: '备注',
            align:"center",
            dataIndex: 'remark'
          },

          /*   {
               title: '操作',
               dataIndex: 'action',
               align:"center",
               scopedSlots: { customRender: 'action' },
             }*/
        ],
		url: {
          list: "/agencyAccountCapital/agencyAccountCapital/list",
          delete: "/agencyAccountCapital/agencyAccountCapital/delete",
          deleteBatch: "/agencyAccountCapital/agencyAccountCapital/deleteBatch",
          exportXlsUrl: "agencyAccountCapital/agencyAccountCapital/exportXls",
          importExcelUrl: "agencyAccountCapital/agencyAccountCapital/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
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
        delete param.createTime; // 时间参数不传递后台

        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        console.log("*****************************************************",dateString[0],dateString[1]);
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
  @import '~@assets/less/common.less'
</style>