<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="流水号">
              <a-input placeholder="请输入流水号" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员账号">
              <a-input placeholder="请输入会员账号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员昵称">
              <a-input placeholder="请输入会员昵称" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item label="任务类型">
              <j-dict-select-tag v-model="queryParam.taskType" placeholder="请选择" dictCode="task_type" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="任务标题">
              <a-input placeholder="请输入任务标题" v-model="queryParam.taskTitle"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item label="奖励类型">
              <a-select v-model="queryParam.awardType" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">积分</a-select-option>
                <a-select-option :value="1">专区团参团次数</a-select-option>
                <a-select-option :value="2">平台优惠券</a-select-option>
                <a-select-option :value="3">店铺优惠券</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">未领取</a-select-option>
                <a-select-option :value="1">已领取</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item label="创建时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam2.createTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="领取时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam2.drawTime"
                format="YYYY-MM-DD"
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
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset2" icon="reload" style="margin-left: 8px">重置</a-button>
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('积分任务记录')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
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
        <template slot="awardType" slot-scope="text">
          <div class="anty-img-wrap">
            <span shape="square" v-if="text == 0">水滴</span>
            <span shape="square" v-else-if="text == 1">专区团参团次数</span>
            <span shape="square" v-else-if="text == 2">平台优惠券</span>
            <span shape="square" v-else-if="text == 3">店铺优惠券</span>
            <span shape="square" v-else>- -</span>
          </div>
        </template>
        <template slot="status" slot-scope="text, record">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">未领取</span>
            <span shape="square" v-if="record.status == 1">已领取</span>
          </div>
        </template>
        <a slot="award" slot-scope="text, record" v-if="record.awardType == 2 || record.awardType == 3">{{ text }}</a>
        <span slot="award" v-else>{{ text }}</span>
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
    <marketingIntegralTaskRecord-modal ref="modalForm" @ok="modalFormOk"></marketingIntegralTaskRecord-modal>
  </a-card>
</template>

<script>
import MarketingIntegralTaskRecordModal from './modules/MarketingIntegralTaskRecordModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: 'MarketingIntegralTaskSecondRecordList',
  mixins: [JeecgListMixin],
  components: {
    MarketingIntegralTaskRecordModal
  },
  data() {
    return {
      description: '积分任务记录管理页面',
      queryParam2: {},
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
          title: '流水号',
          align: 'center',
          dataIndex: 'serialNumber'
        },
        {
          title: '会员账号',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '会员昵称',
          align: 'center',
          dataIndex: 'nickName'
        },
        {
          // ；字典类型：0：注册成功；1：交易密码；2：连续签到；3：每日浏览；4；邀请签到；5：邀请注册
          title: '任务类型',
          align: 'center',
          dataIndex: 'taskType_dictText'
        },
        {
          title: '任务标题',
          align: 'center',
          dataIndex: 'taskTitle'
        },
        {
          title: '任务描述',
          align: 'center',
          dataIndex: 'taskDescription'
        },
        {
          title: '奖励',
          align: 'center',
          dataIndex: 'award',
          scopedSlots: { customRender: 'award' }
        },
        {
          title: '奖励类型',
          align: 'center',
          dataIndex: 'awardType',
          scopedSlots: { customRender: 'awardType' }
        },
        {
          // ：0：未领取；1：已领取
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '领取时间',
          align: 'center',
          dataIndex: 'drawTime'
        }
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align: 'center',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      url: {
        list: '/marketing/marketingIntegralTaskRecord/list',
        delete: '/marketing/marketingIntegralTaskRecord/delete',
        deleteBatch: '/marketing/marketingIntegralTaskRecord/deleteBatch',
        exportXlsUrl: 'marketing/marketingIntegralTaskRecord/exportXls',
        importExcelUrl: 'marketing/marketingIntegralTaskRecord/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    searchReset2() {
      this.queryParam2 = {}
      this.searchReset()
    },
    onDateChange(value, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    onDateChange2(value, dateString) {
      this.queryParam.drawTime_begin = dateString[0]
      this.queryParam.drawTime_end = dateString[1]
    }
  }
}
</script>
<style scoped>
@import "~@assets/less/common.less";

</style>
