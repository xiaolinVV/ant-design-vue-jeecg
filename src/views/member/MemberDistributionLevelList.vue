<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="会员账号">
              <a-input placeholder="请输入会员账号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="昵称">
              <a-input placeholder="请输入昵称" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="分销等级">
              <a-select v-model="queryParam.levelName" placeholder="请选择分销等级">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="(item, index) in levelNameList" :key="index" :value="item.levelName">{{
                  item.levelName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="更新时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.updateTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange1"
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
      <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
      <!-- <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('会员和分销级别关系')">导出</a-button> -->
      <!-- <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
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
        <template slot="headPortrait" slot-scope="text, record, index">
          <img class="clickShowImage" :preview="'headPortrait' + index" :src="record.headPortrait" />
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">设置</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <memberDistributionLevel-modal ref="modalForm" @ok="modalFormOk"></memberDistributionLevel-modal>
  </a-card>
</template>

<script>
import MemberDistributionLevelModal from './modules/MemberDistributionLevelModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'
import { filterObj } from '@/utils/util'
export default {
  name: 'MemberDistributionLevelList',
  mixins: [JeecgListMixin],
  components: {
    MemberDistributionLevelModal
  },
  data() {
    return {
      description: '会员和分销级别关系管理页面',
      levelNameList: [],
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
          title: '头像',
          align: 'center',
          dataIndex: 'headPortrait',
          scopedSlots: { customRender: 'headPortrait' }
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '昵称',
          align: 'center',
          dataIndex: 'nickName'
        },
        {
          title: '分销等级',
          align: 'center',
          dataIndex: 'levelName'
        },
        {
          title: '分销升级直推',
          align: 'center',
          dataIndex: 'upgradeDirect'
        },
        {
          title: '分销升级团队',
          align: 'center',
          dataIndex: 'upgradeTeamNumber'
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '更新者',
          align: 'center',
          dataIndex: 'updateBy'
        },

        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/member/memberDistributionLevel/list',
        delete: '/member/memberDistributionLevel/delete',
        deleteBatch: '/member/memberDistributionLevel/deleteBatch',
        exportXlsUrl: 'member/memberDistributionLevel/exportXls',
        importExcelUrl: 'member/memberDistributionLevel/importExcel',
        //获取分销级别列表（1）
        getMarketingDistributionLevelList: 'member/memberDistributionLevel/getMarketingDistributionLevelList'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  created() {
    this.getlevelNameList()
  },
  methods: {
    getlevelNameList() {
      getAction(this.url.getMarketingDistributionLevelList).then(res => {
        this.levelNameList = res.result
      })
    },
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.updateTime // 时间参数不传递后台
      return filterObj(param)
    },
    onDateChange1: function(value, dateString) {
      this.queryParam.updateTimeStart = dateString[0]
      this.queryParam.updateTimeEnd = dateString[1]
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
