<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="场次编号">
              <a-input placeholder="请输入场次编号" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="活动名称">
              <a-input placeholder="请输入活动名称" v-model="queryParam.anotherName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="拼团状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">进行中</a-select-option>
                <a-select-option :value="1">已成功</a-select-option>
                <a-select-option :value="2">已失败</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="拼购开始时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.startTime"
                format="YYYY-MM-DD HH:MM:SS"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange2"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="拼购结束时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.endTime"
                format="YYYY-MM-DD HH:MM:SS"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange3"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown>
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
        :columns="columns"
        :dataSource="dataSource"
        :scroll="{ x: true }"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="mainPicture" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="text != undefined"
            :preview="'mainPicture' + index"
            :src="handleImage(text)"
            alt=""
          />
          <a-avatar shape="square" v-if="text == undefined || text == ''" :src="handleImage(text)" icon="user" />
        </template>

        <template slot="payment" slot-scope="text">
          {{ text == 0 ? '产品券' : ' - ' }}
        </template>

        <template slot="rewardType" slot-scope="text">
          {{ text == 0 ? '产品券' : ' - ' }}
        </template>

        <template slot="status" slot-scope="text">
          <div class="anty-img-wrap">
            <div v-if="text == 1">已成功</div>
            <div v-else-if="text == 2">已失败</div>
            <div v-else>进行中</div>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="toDetail(record, true)">详情</a>
          <a-divider type="vertical" v-if="record.status == 0" />
          <a @click="toDetail(record, false)" v-if="record.status == 0">拼购控制</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingGroupIntegralManageList-modal ref="modalForm" @ok="modalFormOk"></marketingGroupIntegralManageList-modal>
  </a-card>
</template>

<script>
import MarketingGroupIntegralManageListModal from './modules/MarketingGroupIntegralManageListModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'

export default {
  name: 'MarketingGroupIntegralManageListList',
  mixins: [JeecgListMixin],
  components: {
    MarketingGroupIntegralManageListModal
  },
  data() {
    return {
      description: '拼购管理列表管理页面',
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
          title: '场次编号',
          align: 'center',
          dataIndex: 'serialNumber'
        },
        {
          title: '活动名称',
          align: 'center',
          dataIndex: 'anotherName'
        },
        {
          title: '主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          // ；0：产品券
          title: '支付方式',
          align: 'center',
          dataIndex: 'payment',
          scopedSlots: { customRender: 'payment' }
        },

        {
          title: '支付金额',
          align: 'center',
          dataIndex: 'paymentAmount'
        },
        {
          title: '成团人数',
          align: 'center',
          dataIndex: 'numberClusters'
        },
        {
          title: '参与人数',
          align: 'center',
          dataIndex: ''
        },
        {
          // ；0：进行中；1：已成功；2：已失败
          title: '拼购状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '拼购开始时间',
          align: 'center',
          dataIndex: 'startTime'
        },
        {
          title: '拼购结束时间',
          align: 'center',
          dataIndex: 'endTime'
        },
        {
          title: '成团时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '失败时间',
          align: 'center',
          dataIndex: 'defeatedTime'
        },

        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 200,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],

      url: {
        list: '/marketing/marketingGroupIntegralManageList/list',
        delete: '/marketing/marketingGroupIntegralManageList/delete',
        deleteBatch: '/marketing/marketingGroupIntegralManageList/deleteBatch',
        exportXlsUrl: 'marketing/marketingGroupIntegralManageList/exportXls',
        importExcelUrl: 'marketing/marketingGroupIntegralManageList/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        edit: '/marketing/marketingGroupIntegralManageList/edit'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    toDetail(item, isControl = false) {
      console.log(item)
      this.$router.push({
        path: '/marketing/MarketingGroupIntegralManageListListOrderDetail',
        query: { recordResult: JSON.stringify(item), isControl }
      })
    },
    handleImage(imgUrl) {
      if (imgUrl) {
        try {
          return this.url.imgerver + '/' + Object.values(JSON.parse(imgUrl))[0]
        } catch (error) {
          console.error(error, '图片解析出错')
        }
      }
      return ''
    },
    /**查询栏时间区间查询*/
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.startTime
      delete param.endTime
      return filterObj(param)
    },
    onDateChange2: function(value, dateString) {
      this.queryParam.startTime_begin = dateString[0]
      this.queryParam.startTime_end = dateString[1]
    },
    onDateChange3: function(value, dateString) {
      this.queryParam.endTime_begin = dateString[0]
      this.queryParam.endTime_end = dateString[1]
    }
  }
}
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>
