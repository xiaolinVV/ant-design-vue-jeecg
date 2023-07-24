<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="会员编号">
              <a-input placeholder="请输入会员编号" v-model="queryParam.memberListId"></a-input>
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
            <a-form-item label="会员身份">
              <a-select v-model="queryParam.memberType" placeholder="请选择会员身份">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">普通会员</a-select-option>
                <a-select-option :value="1">vip会员</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>

      <!--
         <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('拼团次数')">导出</a-button>
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
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="headPortrait" slot-scope="text">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="text" icon="user" />
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
        <span
          slot="action"
          slot-scope="text, record"
          style="display: flex;align-items: center;justify-content: space-around"
        >
          <a @click="showDetail(record, 1)">建团次数明细</a>
          <a-divider type="vertical" />
          <a @click="showDetail(record, 2)">参团次数明细</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">调整参团次数</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingZoneGroupTime-modal ref="modalForm" @ok="modalFormOk"></marketingZoneGroupTime-modal>
    <MarketingZoneGroupBuildOrJoinModel ref="modalForm2"></MarketingZoneGroupBuildOrJoinModel>
  </a-card>
</template>

<script>
import MarketingZoneGroupTimeModal from './modules/MarketingZoneGroupTimeModal'
import MarketingZoneGroupBuildOrJoinModel from './modules/MarketingZoneGroupBuildOrJoinModel'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: 'MarketingZoneGroupTimeList',
  mixins: [JeecgListMixin],
  components: {
    MarketingZoneGroupTimeModal,
    MarketingZoneGroupBuildOrJoinModel
  },
  data() {
    return {
      description: '拼团次数管理页面',
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
          title: '会员编号',
          align: 'center',
          dataIndex: 'memberListId'
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
          title: '会员类型',
          align: 'center',
          dataIndex: 'memberType',
          scopedSlots: { customRender: 'memberType' }
        },
        {
          title: '建团次数',
          align: 'center',
          dataIndex: 'groupNumber'
        },
        {
          title: '拼团可用次数',
          align: 'center',
          dataIndex: 'spellGroup'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/marketingZoneGroupTime/marketingZoneGroupTime/list',
        delete: '/marketingZoneGroupTime/marketingZoneGroupTime/delete',
        deleteBatch: '/marketingZoneGroupTime/marketingZoneGroupTime/deleteBatch',
        exportXlsUrl: 'marketingZoneGroupTime/marketingZoneGroupTime/exportXls',
        importExcelUrl: 'marketingZoneGroupTime/marketingZoneGroupTime/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    showDetail(record, reqType) {
      let records = Object.assign({}, record, { reqType })
      this.$refs.modalForm2.showModal(records)
    }
  }
}
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>
