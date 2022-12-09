<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="场次编号">
              <a-input placeholder="请输入场次编号" v-model="queryParam.manageSerialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="拼购编号">
              <a-input placeholder="请输入拼购编号" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="活动名称">
              <a-input placeholder="请输入活动名称" v-model="queryParam.zoneName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="商品编号">
              <a-input placeholder="请输入商品编号" v-model="queryParam.goodNo"></a-input>
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
            <a-form-item label="商品名称">
              <a-input placeholder="请输入商品名称" v-model="queryParam.goodName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员身份">
              <a-select v-model="queryParam.memberType" placeholder="请选择会员身份">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">普通会员</a-select-option>
                <a-select-option :value="1">vip会员</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="拼团身份">
              <a-select v-model="queryParam.identity" placeholder="请选择拼团身份">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">参与人</a-select-option>
                <a-select-option :value="1">发起人</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="中奖状态">
              <a-select v-model="queryParam.status" placeholder="请选择中奖状态">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">未中奖</a-select-option>
                <a-select-option :value="1">已中奖</a-select-option>
                <a-select-option :value="2">已失败</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="拼团时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.tuxedoTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('拼团记录')">导出</a-button>
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
      <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown> -->
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
        :scroll="{ x: 2000 }"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="mainPicture" slot-scope="text">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(text)" icon="user" />
          </div>
        </template>
        <template slot="headPortrait" slot-scope="text">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="text" icon="user" />
          </div>
        </template>

        <template slot="status" slot-scope="text">
          <div v-if="text == 1">
            已中奖
          </div>
          <div v-else>
            未中奖
          </div>
        </template>
        <template slot="memberType" slot-scope="text">
          <div v-if="text == 1">
            vip会员
          </div>
          <div v-else>
            普通会员
          </div>
        </template>
        <template slot="identity" slot-scope="text">
          <div v-if="text == 1">
            发起人
          </div>
          <div v-else>
            参与人
          </div>
        </template>
        <template slot="payPrice" slot-scope="text, record">
          <a @click="showModalForm2(record)">{{ text }}</a>
        </template>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingZoneGroupRecord-modal ref="modalForm" @ok="modalFormOk"></marketingZoneGroupRecord-modal>
    <MarketingZoneGroupPayDetail ref="modalForm2"></MarketingZoneGroupPayDetail>
  </a-card>
</template>

<script>
import MarketingZoneGroupRecordModal from './modules/MarketingZoneGroupRecordModal'
import MarketingZoneGroupPayDetail from './modules/MarketingZoneGroupPayDetail'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
export default {
  name: 'MarketingZoneGroupRecordList',
  mixins: [JeecgListMixin],
  components: {
    MarketingZoneGroupRecordModal,
    MarketingZoneGroupPayDetail
  },
  data() {
    return {
      description: '拼团记录管理页面',
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
          title: '拼团编号',
          align: 'center',
          dataIndex: 'serialNumber'
        },
        {
          title: '拼团时间',
          align: 'center',
          dataIndex: 'tuxedoTime'
        },
        {
          title: '活动名称',
          align: 'center',
          dataIndex: 'zoneName'
        },
        {
          title: '商品编号',
          align: 'center',
          dataIndex: 'goodNo'
        },
        {
          title: '商品主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '商品名称',
          align: 'center',
          dataIndex: 'goodName'
        },
        {
          title: '商品规格',
          align: 'center',
          dataIndex: 'specification'
        },
        {
          title: '购买数量',
          align: 'center',
          dataIndex: 'quantity'
        },
        {
          title: '支付金额',
          align: 'center',
          dataIndex: 'payPrice',
          scopedSlots: { customRender: 'payPrice' }
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
          //  0：普通会员；1：vip会员
          title: '会员身份',
          align: 'center',
          dataIndex: 'memberType',
          scopedSlots: { customRender: 'memberType' }
        },
        {
          // 0：参与人；1：发起人
          title: '拼团身份',
          align: 'center',
          dataIndex: 'identity',
          scopedSlots: { customRender: 'identity' }
        },

        {
          // 0：未中奖；1：已中奖；2：失败
          title: '中奖状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        }
      ],
      url: {
        list: '/marketingZoneGroupRecord/marketingZoneGroupRecord/list',
        delete: '/marketingZoneGroupRecord/marketingZoneGroupRecord/delete',
        deleteBatch: '/marketingZoneGroupRecord/marketingZoneGroupRecord/deleteBatch',
        exportXlsUrl: 'marketingZoneGroupRecord/marketingZoneGroupRecord/exportXls',
        importExcelUrl: 'marketingZoneGroupRecord/marketingZoneGroupRecord/importExcel',
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
    showModalForm2(record) {
      this.$refs.modalForm2.show(record)
    },
    onDateChange: function(value, dateString) {
      this.queryParam.tuxedoTimeStart = dateString[0]
      this.queryParam.tuxedoTimeEnd = dateString[1]
    },
    getAvatarView: function(mainPicture) {
      if (mainPicture) {
        return this.url.imgerver + '/' + JSON.parse(mainPicture)[0]
      }
      return ''
    },
    // /**查询栏时间区间查询*/
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.tuxedoTime
      return filterObj(param)
    }
  }
}
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>
