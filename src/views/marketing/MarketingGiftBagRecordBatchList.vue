<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="流水号">
              <a-input placeholder="请输入" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="手机号">
              <a-input placeholder="请输入" v-model="queryParam.mlPhone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="昵称">
              <a-input placeholder="请输入" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="联系人">
                <a-input placeholder="请输入" v-model="queryParam.linkman"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="联系人手机">
                <a-input placeholder="请输入" v-model="queryParam.phone"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="采购礼包编号">
                <a-input placeholder="请输入" v-model="queryParam.marketingGiftBagBatch"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="采购礼包名称">
                <a-input placeholder="请输入" v-model="queryParam.giftName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="购买时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.payTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                  @ok="onDateOk"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="推广人">
                <a-input placeholder="请输入" v-model="queryParam.promoterName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="二级推广人">
                <a-input placeholder="请输入" v-model="queryParam.promoterTwoName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="归属店铺">
                <a-input placeholder="请输入" v-model="queryParam.affiliationStoreName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="销售渠道">
                <a-input placeholder="请输入" v-model="queryParam.distributionChannelName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="省代">
                <a-input placeholder="请输入" v-model="queryParam.proviceName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="市代">
                <a-input placeholder="请输入" v-model="queryParam.cityName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="县代">
                <a-input placeholder="请输入" v-model="queryParam.towmName"></a-input>
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
<!--      add-->
<!--      toDistributionInformation-->
      <a-button @click="add" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('采购礼包记录')">导出</a-button>
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
      </a-dropdown>
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
        :scroll="{x:3000}"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="headPortrait" slot-scope="text, record,index">
          <img class="clickShowImage " :preview="'headPortrait' + index" :src="text" alt="">
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="toDistributionInformation(record)">
            配送信息
          </a>

<!--          <a @click="add(record)">编辑</a>-->
<!--          <a-divider type="vertical"/>-->
<!--          <a-dropdown>-->
<!--            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>-->
<!--            <a-menu slot="overlay">-->
<!--              <a-menu-item>-->
<!--                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">-->
<!--                  <a>删除</a>-->
<!--                </a-popconfirm>-->
<!--              </a-menu-item>-->
<!--            </a-menu>-->
<!--          </a-dropdown>-->
        </span>
        <span slot="actualPayment" slot-scope="text,record">
          <a @click="showModal(record,'0')">
            {{text}}
          </a>
        </span>
        <span slot="message" slot-scope="text,record">
          <a @click="showModal(record,'1')">
            留言
          </a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingGiftBagRecordBatch-modal ref="modalFormShow" ></marketingGiftBagRecordBatch-modal>
  </a-card>
</template>

<script>
  import MarketingGiftBagRecordBatchModal from './modules/MarketingGiftBagRecordBatchModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import { filterObj } from '@/utils/util'

  export default {
    name: "MarketingGiftBagRecordBatchList",
    mixins: [JeecgListMixin],
    components: {
      MarketingGiftBagRecordBatchModal
    },
    data () {
      return {
        description: '采购礼包记录管理页面',
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
            title: '头像',
            align: "center",
            dataIndex: 'headPortrait',
            scopedSlots: {customRender: 'headPortrait'},
          },
          {
            title: '手机号',
            align: "center",
            dataIndex: 'mlPhone'
          },
          {
            title: '昵称',
            align: "center",
            dataIndex: 'nickName'
          },
          {
            title: '联系人',
            align: "center",
            dataIndex: 'linkman'
          },
          {
            title: '联系人手机',
            align: "center",
            dataIndex: 'phone'
          },
          {
            title: '所在城市',
            align: "center",
            dataIndex: 'areaExplan'
          },
          {
            title: '详细地址',
            align: "center",
            dataIndex: 'areaAddress'
          },
          {
            title: '采购礼包编号',
            align: "center",
            dataIndex: 'marketingGiftBagBatchId'
          },
          {
            title: '采购礼包名称',
            align: "center",
            dataIndex: 'giftName'
          },
          {
            title: '发货次数',
            align: "center",
            dataIndex: 'sendTimes'
          },
          {
            title: '购买数量',
            align: "center",
            dataIndex: 'buyCount'
          },
          {
            title: '运费',
            align: "center",
            dataIndex: 'shipFee'
          },
          {
            title: '应收金额',
            align: "center",
            dataIndex: 'customaryDues'
          },
          {
            title: '实收金额',
            align: "center",
            dataIndex: 'actualPayment',
            scopedSlots: {customRender: 'actualPayment'},
          },
          {
            title: '留言',
            align: "center",
            dataIndex: 'message',
            scopedSlots: {customRender: 'message'},
          },
          {
            title: '购买时间',
            align: "center",
            dataIndex: 'payTime'
          },
          {
            title: '推广人',
            align: "center",
            dataIndex: 'promoterName'
          },
          {
            title: '二级推广人',
            align: "center",
            dataIndex: 'promoterTwoName'
          },
          {
            title: '归属店铺',
            align: "center",
            dataIndex: 'affiliationStoreName'
          },
          {
            title: '销售渠道',
            align: "center",
            dataIndex: 'distributionChannelName'
          },
          {
            title: '省代',
            align: "center",
            dataIndex: 'proviceName'
          },
          {
            title: '市代',
            align: "center",
            dataIndex: 'cityName'
          },
          {
            title: '县代',
            align: "center",
            dataIndex: 'towmName'
          },
          {
            title: '加盟商',
            align: "center",
            dataIndex: 'allianceName'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
            fixed:'right',
            width:100
          }
        ],
        url: {
          list: "/marketingGiftBagRecordBatch/marketingGiftBagRecordBatch/list",
          delete: "/marketingGiftBagRecordBatch/marketingGiftBagRecordBatch/delete",
          deleteBatch: "/marketingGiftBagRecordBatch/marketingGiftBagRecordBatch/deleteBatch",
          exportXlsUrl: "marketingGiftBagRecordBatch/marketingGiftBagRecordBatch/exportXls",
          importExcelUrl: "marketingGiftBagRecordBatch/marketingGiftBagRecordBatch/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      showModal(record,type = 0){
        record.type = type;
        this.$refs.modalFormShow.edit(record);
      },
      toDistributionInformation(record = {}){
        localStorage.setItem('purchasingGiftBagDistributionInformation',JSON.stringify(record))
        this.$router.push({path: '/marketing/modules/purchasingGiftBagDistributionInformation'})
      },
      add(){
        this.$router.push({path: '/marketing/modules/AddMarketingGiftbagPurchaseRecord'})
      },
      getQueryParams(){
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.payTime;
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        this.queryParam.payTime_begin = dateString[0];
        this.queryParam.payTime_end = dateString[1];
      },
    }
  }
</script>
<style scoped>

</style>