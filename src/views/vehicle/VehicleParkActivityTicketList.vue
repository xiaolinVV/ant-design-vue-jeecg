<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="活动编号">
              <a-input placeholder="请输入活动编号" v-model="queryParam.activityNumber"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="活动名称">
              <a-input placeholder="请输入活动名称" v-model="queryParam.activityName"></a-input>
            </a-form-item>
          </a-col>

          <!-- <a-col :md="6" :sm="8">
            <a-form-item label="停车场">
              <a-input placeholder="请输入停车场" v-model="queryParam.activityNumber"></a-input>
            </a-form-item>
          </a-col> -->

          <a-col :md="6" :sm="8">
            <a-form-item label="活动状态">
              <a-select v-model="queryParam.activityStatus" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">未开始</a-select-option>
                <a-select-option :value="1">进行中</a-select-option>
                <a-select-option :value="2">已结束</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">停用</a-select-option>
                <a-select-option :value="1">启用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="开始时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.startTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="结束时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.endTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange2"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="创建时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.createTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange3"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="停车券编号">
              <a-input placeholder="请输入停车券编号" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="券名称">
              <a-input placeholder="请输入券名称" v-model="queryParam.ticketName"></a-input>
            </a-form-item>
          </a-col>

          <!-- <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col> -->
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('送券活动')">导出</a-button>
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
        :scroll="{ x: 2000 }"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="status" slot-scope="text">
          <div class="anty-img-wrap">
            <div v-if="text == 0">停用</div>
            <div v-if="text == 1">启用</div>
          </div>
        </template>

        <template slot="activityStatus" slot-scope="text">
          <div class="anty-img-wrap">
            <div v-if="text == 0">未开始</div>
            <div v-if="text == 1">进行中</div>
            <div v-if="text == 2">已结束</div>
          </div>
        </template>
        <template slot="activityConditions" slot-scope="text">
          <div class="anty-img-wrap">
            <div v-if="text == 0">累计消费满</div>
            <div v-if="text == 1">单笔消费满</div>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a v-if="record.status == 1" @click="showTextareaModal(record, 1)">停用</a>
          <a v-else @click="showTextareaModal(record, 2)">启用</a>
          <a-divider type="vertical" />
          <a @click="showTextareaModal(record, 3)">删除</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <vehicleParkActivityTicket-modal ref="modalForm" @ok="modalFormOk"></vehicleParkActivityTicket-modal>
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></textAreaModal>
  </a-card>
</template>

<script>
import VehicleParkActivityTicketModal from './modules/VehicleParkActivityTicketModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { putAction, deleteAction } from '@/api/manage'
import textAreaModal from '@/components/popUp/textAreaModal'
import { filterObj } from '@/utils/util'
export default {
  name: 'VehicleParkActivityTicketList',
  mixins: [JeecgListMixin],
  components: {
    VehicleParkActivityTicketModal,
    textAreaModal
  },
  data() {
    return {
      description: '送券活动管理页面',
      modalForm2Record: {},
      modalForm2Infos: {},
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
          title: '活动编号',
          align: 'center',
          dataIndex: 'activityNumber'
        },
        {
          title: '活动名称',
          align: 'center',
          dataIndex: 'activityName'
        },
        {
          // ；0：累计消费满，1：单笔消费满
          title: '活动条件',
          align: 'center',
          dataIndex: 'activityConditions',
          scopedSlots: { customRender: 'activityConditions' }
        },
        {
          // ；0：未开始；1：进行中；2：已结束
          title: '活动状态',
          align: 'center',
          dataIndex: 'activityStatus',
          scopedSlots: { customRender: 'activityStatus' }
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'startTime'
        },
        {
          title: '结束时间',
          align: 'center',
          dataIndex: 'endTime'
        },
        {
          title: '停车券编号',
          align: 'center',
          dataIndex: 'serialNumber'
        },
        {
          title: '券名称',
          align: 'center',
          dataIndex: 'ticketName'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },

        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '状态说明',
          align: 'center',
          dataIndex: 'statusExplain'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/vehicle/vehicleParkActivityTicket/list',
        delete: '/vehicle/vehicleParkActivityTicket/delete',
        deleteBatch: '/vehicle/vehicleParkActivityTicket/deleteBatch',
        exportXlsUrl: 'vehicle/vehicleParkActivityTicket/exportXls',
        importExcelUrl: 'vehicle/vehicleParkActivityTicket/importExcel',
        edit: '/vehicle/vehicleParkActivityTicket/edit'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    async showTextareaModal(record, type) {
      const allInfos = [
        {
          title: '停用',
          mainText: '点击确定将停用该活动',
          explainSureText: '您确定要停用吗'
        },
        {
          title: '启用',
          mainText: '点击确定将启用该活动',
          explainSureText: '您确定要启用吗'
        },
        {
          title: '删除',
          mainText: '删除活动将无法恢复',
          explainSureText: '您确定要删除吗'
        }
      ]
      this.modalForm2Record = record
      this.modalForm2Infos = allInfos[type - 1]
      await this.$nextTick()
      this.$refs.modalForm2.show()
    },
    async modalForm2Ok(infos) {
      const title = this.modalForm2Infos.title
      if (title == '停用') {
        infos.status = 0
      } else if (title == '启用') {
        infos.status = 1
      }
      let result
      infos.statusExplain = infos.modalExplain
      if (title == '删除') {
        result = await deleteAction(this.url.delete, infos)
      } else {
        result = await putAction(this.url.edit, infos)
      }
      if (result.success) {
        this.$message.success(result.message)
        this.loadData()
      } else {
        this.$message.error(result.message)
      }

      console.log(infos)
    },
    /**查询栏时间区间查询*/
    getQueryParams() {
      console.log(this.queryParam.createTime)
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.startTime
      delete param.endTime
      delete param.createTime
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      this.queryParam.startTimeStart = dateString[0]
      this.queryParam.startTimeEnd = dateString[1]
    },
    onDateChange2: function(value, dateString) {
      this.queryParam.endTimeStart = dateString[0]
      this.queryParam.endTimeEnd = dateString[1]
    },
    onDateChange3: function(value, dateString) {
      this.queryParam.createTimeStart = dateString[0]
      this.queryParam.createTimeEnd = dateString[1]
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
