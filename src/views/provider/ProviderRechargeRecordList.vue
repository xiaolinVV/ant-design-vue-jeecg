<template>
  <a-card :bordered="false">
    <!--店铺余额-->
    <div ><!--v-if="providerManage"-->
      <div class="zijin" style="display: flex;justify-content: space-between;margin-bottom: 20px;font-size: 16px">
        <div>
          <h3>
            <span v-if="providerManage.balance">{{ providerManage.balance }} </span>
            <span v-else> 0 </span>
            <a-icon title="可支取使用的账户余额" type="question-circle" /></h3>
          <div>
            <span style="margin-right: 20px">可用余额(元)</span>

            <a @click="handleEdit2(providerManage.id)">结算记录</a>
          </div>
        </div>
        <div>
          <h3>
            <span v-if="providerManage.accountFrozen">{{ providerManage.accountFrozen }} </span>
            <span v-else> 0 </span>
            <a-icon title="当前订单状态为用户已支付未结算的钱款总额（应收款），
结算时钱会从待结算中扣除进入店铺余额" type="question-circle" />
          </h3>
          <div>待结算(元)</div>
        </div>
        <div>
          <h3>
            <span v-if="providerManage.unusableFrozen">{{ providerManage.unusableFrozen }} </span>
            <span v-else> 0 </span>
            <a-icon title="待打款或者待退款的冻结店铺余额" type="question-circle" />
          </h3>
          <div>不可用余额(元)</div>
        </div>

      </div>

      <div style="margin-bottom: 40px">


      </div>


    </div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="流水号">
              <a-input placeholder="请输入" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <!--<a-col :md="8" :sm="8">
            <a-form-item label="交易单号">
              <a-input placeholder="请输入" v-model="queryParam.tradeNo"></a-input>
            </a-form-item>
          </a-col>-->
          <a-col :md="8" :sm="8">
            <a-form-item label="供应商账号">
              <a-input placeholder="请输入" v-model="queryParam.userName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="供应商">
              <a-input placeholder="请输入" v-model="queryParam.providerName"></a-input>
            </a-form-item>
          </a-col>
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
            <a-form-item label="交易类型">
              <j-dict-select-tag  v-model="queryParam.payType"  placeholder="请选择"
                                  dictCode="provide_deal_type"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="交易状态">
              <j-dict-select-tag  v-model="queryParam.tradeStatus"  placeholder="请选择"
                                  dictCode="trade_status"/>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!--<a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('供应商余额明细')">导出</a-button>-->
     <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
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

       <!-- <span slot="action" slot-scope="text, record">
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
-->
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <providerRechargeRecord-modal ref="modalForm" @ok="modalFormOk"></providerRechargeRecord-modal>
  </a-card>
</template>

<script>
  import ProviderRechargeRecordModal from './modules/ProviderRechargeRecordModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {httpAction,getAction} from '@/api/manage'
  import {filterObj} from '@/utils/util';
  export default {
    name: "ProviderRechargeRecordList",
    mixins:[JeecgListMixin],
    components: {
      ProviderRechargeRecordModal
    },
    data () {
      return {
        description: '供应商余额明细管理页面',
        providerManage:{},
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
          /*{
            title: '交易单号',
            align: "center",
            dataIndex: 'tradeNo'
          },*/
          {
            title: '供应商账号',
            align: "center",
            dataIndex: 'userName'
          },
          {
            title: '供应商',
            align: "center",
            dataIndex: 'providerName'
          },
          {
            title: '交易类型',
            align: "center",
            dataIndex: 'payType_dictText'
          },
          {
            title: '收入/支出',
            align: "center",
            dataIndex: 'goAndCome',
            scopedSlots: {customRender: "goAndCome"}
          },
          {
            title: '交易金额',
            align: "center",
            dataIndex: 'amount'
          },
          {
            title: '交易状态',
            align: "center",
            dataIndex: 'tradeStatus_dictText',
          },
          {
            title: '备注',
            align: "center",
            dataIndex: 'remark',
          },
          {
            title: '交易时间',
            align: "center",
            dataIndex: 'createTime'
          },
          /*{
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }*/
        ],
		url: {
          list: "/providerRechargeRecord/providerRechargeRecord/list",
          delete: "/providerRechargeRecord/providerRechargeRecord/delete",
          deleteBatch: "/providerRechargeRecord/providerRechargeRecord/deleteBatch",
          exportXlsUrl: "providerRechargeRecord/providerRechargeRecord/exportXls",
          importExcelUrl: "providerRechargeRecord/providerRechargeRecord/importExcel",
          queryPageListAndManage:"/providerRechargeRecord/providerRechargeRecord/queryPageListAndManage",
          findGoodProviderById:"/providerManage/providerManage/findGoodProviderById"
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    mounted() {
      this.storeManageOne();
    },
    methods: {
      PopUp(){
        this.$refs.modalForm.title = "充值";
        this.$refs.modalForm.disableSubmit = false;
      },
      //结算记录
      handleEdit2(record){
        //路由跳转
        this.$router.push({ path: '/provider/ProviderSettlementRecords',})

      },

      withdrawDeposit(id,balance){
        if(!id){
          this.$message.warning("未查到店铺信息！");
          return;
        }
        this.$refs.modalForm.withdrawDeposit(id,balance);
        this.$refs.modalForm.title = "提现";
        this.$refs.modalForm.disableSubmit = false;
      },
      /**充值**/
      Recharge(id,balance){
        if(!id){
          this.$message.warning("未查到店铺信息！");
          return;
        }
        this.$refs.modalForm.Recharge(id,balance);
        this.$refs.modalForm.title = "充值";
        this.$refs.modalForm.disableSubmit = false;
      },

      /**当前登录用户店铺信息*/
      storeManageOne(){
        getAction(this.url.queryPageListAndManage).then((res) => {
          if (res.success) {
            console.log(res.result);
            this.providerManage = res.result;
          }
        });
      },
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