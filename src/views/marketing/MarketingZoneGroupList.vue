<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="专区名称">
              <a-input placeholder="请输入专区名称" v-model="queryParam.zoneName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="专区编号">
              <a-input placeholder="请输入专区编号" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">停用</a-select-option>
                <a-select-option :value="1">启用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="创建时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.createTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
      <!-- <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('拼团专区')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
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
        :scroll="{ x: 2500 }"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="status" slot-scope="text">
          <span shape="square" v-if="text == 0">停用</span>
          <span shape="square" v-if="text == 1">启用</span>
        </template>
        <template slot="groupAwardType" slot-scope="text">
          <span shape="square" v-if="text == 0">福利金</span>
          <span v-else>
            - -
          </span>
        </template>
        <template slot="recommendedRewardTypes" slot-scope="text">
          <span shape="square" v-if="text == 0">福利金</span>
          <span v-else>
            - -
          </span>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="editSort(record)">排序</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a v-if="record.status == 1" @click="showTextareaModal(record, 1)">停用</a>
          <a v-else @click="showTextareaModal(record, 2)">启用</a>
          <a-divider type="vertical" />
          <a @click="showTextareaModal(record, 3)">删除</a>
          <!-- <a @click="handleEdit(record)">编辑</a>

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
          </a-dropdown> -->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingZoneGroup-modal ref="modalForm" @ok="modalFormOk"></marketingZoneGroup-modal>
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></textAreaModal>
  </a-card>
</template>

<script>
import MarketingZoneGroupModal from './modules/MarketingZoneGroupModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import textAreaModal from '@/components/popUp/textAreaModal'
import { postAction, deleteAction } from '@/api/manage'
export default {
  name: 'MarketingZoneGroupList',
  mixins: [JeecgListMixin],
  components: {
    MarketingZoneGroupModal,
    textAreaModal
  },
  data() {
    return {
      description: '拼团专区管理页面',
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
          title: '专区编号',
          align: 'center',
          dataIndex: 'id'
        },

        {
          title: '专区名称',
          align: 'center',
          dataIndex: 'zoneName'
        },
        {
          // 专区价格
          title: '活动价格',
          align: 'center',
          dataIndex: 'price'
        },
        {
          title: '虚拟成团人数',
          align: 'center',
          dataIndex: 'virtualGroupMembers'
        },
        {
          title: '实际成团人数',
          align: 'center',
          dataIndex: 'actualGroupSize'
        },
        {
          title: '次数上限（次/日）',
          align: 'center',
          dataIndex: 'numberCaps'
        },
        {
          title: '参团奖励',
          align: 'center',
          dataIndex: 'tuxedoReward'
        },
        {
          // ；0：福利金
          title: '参团奖励类型',
          align: 'center',
          dataIndex: 'groupAwardType',
          scopedSlots: { customRender: 'groupAwardType' }
        },
        {
          title: '推荐奖励',
          align: 'center',
          dataIndex: 'referralBonuses'
        },
        {
          // ；0：福利金
          title: '推荐奖励类型',
          align: 'center',
          dataIndex: 'recommendedRewardTypes',
          scopedSlots: { customRender: 'recommendedRewardTypes' }
        },
        {
          title: '转化阀值(单)',
          align: 'center',
          dataIndex: 'transformationThreshold'
        },
        {
          title: '寄售（单）',
          align: 'center',
          dataIndex: 'canConsignment'
        },
        {
          title: '默认发货（单）',
          align: 'center',
          dataIndex: 'defaultShipping'
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
        },
        {
          // ；0：停用；1：启用
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
          title: '创建者',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '更新者',
          align: 'center',
          dataIndex: 'updateBy'
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 250,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      isorter: {
        column: 'sort',
        order: 'asc'
      },
      url: {
        list: '/marketingZoneGroup/marketingZoneGroup/list',
        delete: '/marketingZoneGroup/marketingZoneGroup/delete',
        edit: '/marketingZoneGroup/marketingZoneGroup/edit',
        deleteBatch: '/marketingZoneGroup/marketingZoneGroup/deleteBatch',
        exportXlsUrl: 'marketingZoneGroup/marketingZoneGroup/exportXls',
        importExcelUrl: 'marketingZoneGroup/marketingZoneGroup/importExcel'
      }
    }
  },

  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    editSort(record) {
      let obj = Object.assign({}, record)
      obj.isEditSort = true
      console.log(obj)
      this.handleEdit(obj)
    },
    async showTextareaModal(record, type) {
      const allInfos = [
        {
          title: '停用',
          mainText: '停用后该专区将无法使用',
          explainSureText: '您确定要停用吗'
        },
        {
          title: '启用',
          mainText: '启用后该专区将可以使用。',
          explainSureText: '您确定要启用吗'
        },
        {
          title: '删除',
          mainText: '删除专区将无法恢复',
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
        result = await postAction(this.url.delete, infos)
      } else {
        result = await postAction(this.url.edit, infos)
      }
      if (result.success) {
        this.$message.success(result.message)
        this.loadData()
      } else {
        this.$message.error(result.message)
      }

      console.log(infos)
    },
    // /**查询栏时间区间查询*/
    getQueryParams() {
      console.log(this.queryParam.createTime)
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.createTime
      delete param.updateTime
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    onDateChange1: function(value, dateString) {
      this.queryParam.updateTime_begin = dateString[0]
      this.queryParam.updateTime_end = dateString[1]
    }
  }
}
</script>
<style scoped>
@import "~@assets/less/common.less";

</style>
