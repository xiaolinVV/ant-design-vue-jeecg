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
            <a-form-item label="拼购编号">
              <a-input placeholder="请输入拼购编号" v-model="queryParam.groupSerialNumber"></a-input>
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
          <a-col :md="8" :sm="8">
            <a-form-item label="中奖状态">
              <a-select v-model="queryParam.winningState" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">进行中</a-select-option>
                <a-select-option :value="1">已中奖</a-select-option>
                <a-select-option :value="2">未中奖</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="参与时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.participationTime"
                format="YYYY-MM-DD HH:MM:SS"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange2"
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
      <!-- <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('拼购记录')">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
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
        :pagination="ipagination"
        :loading="loading"
        :scroll="{ x: true }"
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
        <template slot="headPortrait" slot-scope="text, record, index">
          <img class="clickShowImage" v-if="text != undefined" :preview="'headPortrait' + index" :src="text" alt="" />
          <a-avatar shape="square" v-if="text == undefined || text == ''" :src="text" icon="user" />
        </template>

        <template slot="payment" slot-scope="text">
          {{ text == 0 ? '产品券' : ' - ' }}
        </template>
        <template slot="identity" slot-scope="text">
          {{ text == 0 ? '参与人' : '发起人' }}
        </template>
        <template slot="winningState" slot-scope="text">
          <div v-if="text == 1">已中奖</div>
          <div v-else-if="text == 2">未中奖</div>
          <div v-else>进行中</div>
        </template>
        <template slot="rewardType" slot-scope="text">
          {{ text == 0 ? '产品券' : ' - ' }}
        </template>
        <!-- <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
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
        </span> -->
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingGroupIntegralManageRecord-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></marketingGroupIntegralManageRecord-modal>
  </a-card>
</template>

<script>
import MarketingGroupIntegralManageRecordModal from './modules/MarketingGroupIntegralManageRecordModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
export default {
  name: 'MarketingGroupIntegralManageRecordList',
  mixins: [JeecgListMixin],
  components: {
    MarketingGroupIntegralManageRecordModal
  },
  data() {
    return {
      description: '拼购记录管理页面',
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
          title: '拼购编号',
          align: 'center',
          dataIndex: 'groupSerialNumber'
        },
        {
          title: '参与时间',
          align: 'center',
          dataIndex: 'participationTime'
        },
        {
          title: '拼购主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },

        {
          title: '活动名称',
          align: 'center',
          dataIndex: 'anotherName'
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
          title: '购买数量',
          align: 'center',
          dataIndex: 'purchaseQuantity'
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
          // ；0：参与人；1：发起人
          title: '拼购身份',
          align: 'center',
          dataIndex: 'identity',
          scopedSlots: { customRender: 'identity' }
        },
        {
          // ；0：进行中；1：已中奖；2：未中奖
          title: '中奖状态',
          align: 'center',
          dataIndex: 'winningState',
          scopedSlots: { customRender: 'winningState' }
        },
        {
          // ；0：产品券
          title: '奖励类型',
          align: 'center',
          dataIndex: 'rewardType',
          scopedSlots: { customRender: 'rewardType' }
        },
        {
          title: '奖励数量',
          align: 'center',
          dataIndex: 'missedRewards'
        }

        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align: 'center',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      url: {
        list: '/marketing/marketingGroupIntegralManageRecord/list',
        delete: '/marketing/marketingGroupIntegralManageRecord/delete',
        deleteBatch: '/marketing/marketingGroupIntegralManageRecord/deleteBatch',
        exportXlsUrl: 'marketing/marketingGroupIntegralManageRecord/exportXls',
        importExcelUrl: 'marketing/marketingGroupIntegralManageRecord/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    onDateChange2: function(value, dateString) {
      this.queryParam.participationTimeStart = dateString[0]
      this.queryParam.participationTimeEnd = dateString[1]
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
      delete param.participationTime
      return filterObj(param)
    }
  }
}
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>
