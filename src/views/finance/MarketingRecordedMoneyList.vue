<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="流水号">
              <a-input placeholder="请输入" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="团队名称">
              <a-input placeholder="请输入" v-model="queryParam.groupName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="称号名称">
              <a-select v-model="queryParam.memberDesignationId" style="width: 100%" >
                <a-select-option value="">
                  全部
                </a-select-option>
                <a-select-option :value="item.memberDesignationId" v-for="(item,index) in titleList" :key="index">
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="交易类型">
                <a-select v-model="queryParam.tradeType"    placeholder="请选择"     style="margin-right: 10px;">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option  :value="0">订单分红</a-select-option>
                  <a-select-option  :value="1">礼包分红</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="交易时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.tradeTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                  @ok="onDateOk"
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
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('称号入账资金')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
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
        <template slot="tradeType" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.tradeType==0">订单分红</span>
            <span shape="square" v-if="record.tradeType==1">礼包分红</span>
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
    <marketingRecordedMoney-modal ref="modalForm" @ok="modalFormOk"></marketingRecordedMoney-modal>
  </a-card>
</template>

<script>
  import MarketingRecordedMoneyModal from './modules/MarketingRecordedMoneyModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import { getAction } from '@/api/manage'
  import {filterObj} from '@/utils/util';
  export default {
    name: "MarketingRecordedMoneyList",
    mixins: [JeecgListMixin],
    components: {
      MarketingRecordedMoneyModal
    },
    data () {
      return {
        description: '称号入账资金管理页面',
        titleList:[],
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
            dataIndex: 'orderNo'
          },
          {
            title: '团队名称',
            align: "center",
            dataIndex: 'groupName'
          },
          {
            title: '称号名称',
            align: "center",
            dataIndex: 'name'
          },
          {
            title: '交易类型',
            align: "center",
            dataIndex: 'tradeType',
            scopedSlots: {customRender: "tradeType"}
          },
          {
            title: '分红资金',
            align: "center",
            dataIndex: 'participationMoney'
          },
          {
            title: '分红资金占比%',
            align: "center",
            dataIndex: 'participation'
          },
          {
            title: '进账金额',
            align: "center",
            dataIndex: 'recordedMoney'
          },
          {
            title: '称号余额',
            align: "center",
            dataIndex: 'balance'
          },
          {
            title: '交易时间',
            align: "center",
            dataIndex: 'tradeTime'
          },
          {
            title: '备注',
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
          list: "/marketingRecordedMoney/marketingRecordedMoney/list",
          delete: "/marketingRecordedMoney/marketingRecordedMoney/delete",
          deleteBatch: "/marketingRecordedMoney/marketingRecordedMoney/deleteBatch",
          exportXlsUrl: "marketingRecordedMoney/marketingRecordedMoney/exportXls",
          importExcelUrl: "marketingRecordedMoney/marketingRecordedMoney/importExcel",
          memberDesignationNameList:"memberDesignation/memberDesignation/memberDesignationNameList"
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    created(){
      this.getTitleList();
    },
    methods: {
      getTitleList(){
        getAction(this.url.memberDesignationNameList).then(res=>{
          if(res.success){
            this.titleList = res.result
          }else{
            this.$message.warn(res.message)
          }

        })
      },
      getQueryParams(){
        console.log(this.queryParam.createTime)
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.tradeTime; // 时间参数不传递后台
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        this.queryParam.tradeTime_begin = dateString[0];
        this.queryParam.tradeTime_end = dateString[1];
      },
    }
  }
</script>
<style scoped>

</style>