<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="寄售编号">
              <a-input placeholder="请输入" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员手机号">
              <a-input placeholder="请输入会员手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员昵称">
              <a-input placeholder="请输入会员昵称" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="分类名称">
                <a-input placeholder="请输入会员昵称" v-model="queryParam.rushName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="复购状态">
                <a-select v-model="queryParam.ifPurchase" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">未复购</a-select-option>
                  <a-select-option :value="1">已复购</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="复购订单">
                <a-input placeholder="请输入会员昵称" v-model="queryParam.orderNo"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="复购时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.purchaseTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="寄售状态">
                <a-select v-model="queryParam.consignmentStatus" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">待寄售</a-select-option>
                  <a-select-option :value="1">可寄售</a-select-option>
                  <a-select-option :value="2">已寄售</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="寄售时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.consignmentTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange1"
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
    <!-- <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('抢购活动-寄售记录')">导出</a-button>
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
    </div>-->

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
        <template slot="headPortrait" slot-scope="text">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="text" icon="user" />
          </div>
        </template>
        <span slot="consignmentGoods" slot-scope="text, record">
          <a @click="showDetail(record)">{{record.consignmentGoods}}</a>
        </span>
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
    <marketingRushGroup-modal ref="modalForm" @ok="modalFormOk"></marketingRushGroup-modal>
    <MarketingRushGroupGoodsModal ref="modalForm2"></MarketingRushGroupGoodsModal>
  </a-card>
</template>

<script>
  import MarketingRushGroupModal from './modules/MarketingRushGroupModal'
  import MarketingRushGroupGoodsModal from './modules/MarketingRushGroupGoodsModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import { filterObj } from '@/utils/util'
  export default {
    name: "MarketingRushGroupList",
    mixins: [JeecgListMixin],
    components: {
      MarketingRushGroupModal,
      MarketingRushGroupGoodsModal
    },
    data () {
      return {
        description: '抢购活动-寄售记录管理页面',
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
            title: '寄售编号',
            align: "center",
            dataIndex: 'serialNumber'
          },
          {
            title: '会员头像',
            align: 'center',
            dataIndex: 'headPortrait',
            scopedSlots: { customRender: 'headPortrait' }
          },
          {
            title: '会员手机号',
            align: 'center',
            dataIndex: 'phone'
          },
          {
            title: '会员昵称',
            align: 'center',
            dataIndex: 'nickName'
          },
          {
            title: '分类名称',
            align: "center",
            dataIndex: 'rushName'
          },
          {
            title: '寄售商品',
            align: "center",
            dataIndex: 'consignmentGoods',
            scopedSlots: { customRender: 'consignmentGoods' }
          },
          {
            title: '寄售总价',
            align: "center",
            dataIndex: 'consignmentPrice'
          },
          {
            title: '复购状态',
            align: "center",
            dataIndex: 'ifPurchase',
            customRender: function (text) {
              if (text == 0) {
                return '未复购'
              }else if (text == 1){
                  return '已复购'
              }
            },
          },
          {
            title: '复购订单',
            align: "center",
            dataIndex: 'orderNo'
          },
          {
            title: '复购时间',
            align: "center",
            dataIndex: 'purchaseTime'
          },
          {
            title: '寄售状态',
            align: "center",
            dataIndex: 'consignmentStatus',
            customRender: function (text) {
              if (text == 0) {
                return '待寄售'
              }else if (text == 1){
                return '可寄售'
              }else {
                return '已寄售'
              }
            },
          },
          {
            title: '寄售时间',
            align: "center",
            dataIndex: 'consignmentTime'
          },
        ],
        url: {
          list: "/marketingRushGroup/marketingRushGroup/list",
          delete: "/marketingRushGroup/marketingRushGroup/delete",
          deleteBatch: "/marketingRushGroup/marketingRushGroup/deleteBatch",
          exportXlsUrl: "marketingRushGroup/marketingRushGroup/exportXls",
          importExcelUrl: "marketingRushGroup/marketingRushGroup/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      showDetail(record) {
        let records = Object.assign({}, record)
        this.$refs.modalForm2.showModal(records)
      },
      getQueryParams() {
        console.log(this.queryParam.createTime)
        var param = Object.assign({}, this.queryParam, this.isorter)
        param.field = this.getQueryField()
        param.pageNo = this.ipagination.current
        param.pageSize = this.ipagination.pageSize
        delete param.purchaseTime
        delete param.consignmentTime
        return filterObj(param)
      },
      onDateChange: function (value, dateString) {
        this.queryParam.purchaseTime_begin = dateString[0]
        this.queryParam.purchaseTime_end = dateString[1]
      },
      onDateChange1: function (value, dateString) {
        this.queryParam.consignmentTime_begin = dateString[0]
        this.queryParam.consignmentTime_end = dateString[1]
      },
    }

  }
</script>
<style scoped>
@import "~@assets/less/common.less"






</style>