<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="称号名称">
              <a-input placeholder="请输入称号名称" v-model="queryParam.designationName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="称号编号">
              <a-input placeholder="请输入称号编号" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="是否默认">
              <a-select v-model="queryParam.isDefault" placeholder="请选择是否默认">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">否</a-select-option>
                <a-select-option :value="1">是</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择状态">
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
      <!-- <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('创业团队称号管理')">导出</a-button>
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
        :scroll="{ x: 2000 }"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="isDefault" slot-scope="text">
          <span shape="square" v-if="text == 0">否</span>
          <span shape="square" v-if="text == 1">是</span>
        </template>
        <template slot="status" slot-scope="text">
          <span shape="square" v-if="text == 0">停用</span>
          <span shape="square" v-if="text == 1">启用</span>
        </template>
        <template slot="getWay" slot-scope="text, record">
          <span shape="square" v-if="text == 0">无</span>
          <span shape="square" v-if="text == 1">自购金额满{{ record.money }}</span>
          <span shape="square" v-if="text == 2"
            >直推{{ record.pushingNumber }}个{{
              handlemarketingBusinessDesignationName(record.marketingBusinessDesignationId)
            }}</span
          >
          <span shape="square" v-if="text == 3">业绩完成次数满{{ record.completionTimes }}次</span>
        </template>
        <template slot="icon" slot-scope="text, record, index">
          <img class="clickShowImage " :preview="'icon' + index" :src="handleImage(text)" alt="" />
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
    <marketingBusinessDesignation-modal ref="modalForm" @ok="modalFormOk"></marketingBusinessDesignation-modal>
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></textAreaModal>
  </a-card>
</template>

<script>
import MarketingBusinessDesignationModal from './modules/MarketingBusinessDesignationModal'
import textAreaModal from '@/components/popUp/textAreaModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import { postAction, getAction } from '@/api/manage'
export default {
  name: 'MarketingBusinessDesignationList',
  mixins: [JeecgListMixin],
  components: {
    textAreaModal,
    MarketingBusinessDesignationModal
  },
  data() {
    return {
      description: '创业团队称号管理管理页面',
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
          title: '称号编号',
          align: 'center',
          dataIndex: 'id'
        },

        {
          title: '称号名称',
          align: 'center',
          dataIndex: 'designationName'
        },
        {
          title: '图标',
          align: 'center',
          dataIndex: 'icon',
          scopedSlots: { customRender: 'icon' }
        },
        {
          // ；0：否；1：是
          title: '是否默认',
          align: 'center',
          dataIndex: 'isDefault',
          scopedSlots: { customRender: 'isDefault' }
        },
        {
          title: '级别',
          align: 'center',
          dataIndex: 'grade'
        },
        {
          // ；0：无；1：自购金额满；2：直推
          title: '获得方式',
          align: 'center',
          dataIndex: 'getWay',
          scopedSlots: { customRender: 'getWay' }
        },
        // {
        //   title: '自购金额',
        //   align: 'center',
        //   dataIndex: 'money'
        // },
        // {
        //   title: '直推人数',
        //   align: 'center',
        //   dataIndex: 'pushingNumber'
        // },
        // {
        //   title: '直推称号id',
        //   align: 'center',
        //   dataIndex: 'marketingBusinessDesignationId'
        // },
        // {
        //   title: '规则描述',
        //   align: 'center',
        //   dataIndex: 'ruleDescription'
        // },
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
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '创建者',
          align: 'center',
          dataIndex: 'createBy'
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
          fixed: 'right',
          width: 200,
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      marketingBusinessDesignationList: [],
      url: {
        list: '/marketingBusinessDesignation/marketingBusinessDesignation/list',
        delete: '/marketingBusinessDesignation/marketingBusinessDesignation/delete',
        deleteBatch: '/marketingBusinessDesignation/marketingBusinessDesignation/deleteBatch',
        exportXlsUrl: 'marketingBusinessDesignation/marketingBusinessDesignation/exportXls',
        importExcelUrl: 'marketingBusinessDesignation/marketingBusinessDesignation/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        edit: '/marketingBusinessDesignation/marketingBusinessDesignation/edit',
        findMarketingBusinessDesignationMaps:
          'marketingBusinessDesignation/marketingBusinessDesignation/findMarketingBusinessDesignationMaps'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  created() {
    this.findMarketingBusinessDesignationMaps()
  },
  methods: {
    async showTextareaModal(record, type) {
      const allInfos = [
        {
          title: '停用',
          mainText: '停用该称号后，该称号失效',
          explainSureText: '您确定要停用吗'
        },
        {
          title: '启用',
          mainText: '启用该称号后，该称号生效。',
          explainSureText: '您确定要启用吗'
        },
        {
          title: '删除',
          mainText: '删除该称号后，该称号失效，删除后不可恢复',
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
      if (title == '删除') {
        infos.delExplain = infos.modalExplain
        result = await postAction(this.url.delete, infos)
      } else {
        infos.statusExplain = infos.modalExplain
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
    findMarketingBusinessDesignationMaps() {
      return new Promise(resolve => {
        getAction(this.url.findMarketingBusinessDesignationMaps).then(res => {
          if (res.success) {
            this.marketingBusinessDesignationList = res.result
          } else {
            this.$message.warn(res.message)
          }
          resolve()
        })
      })
    },
    handlemarketingBusinessDesignationName(marketingBusinessDesignationId) {
      if (this.marketingBusinessDesignationList.length > 0) {
        let result = this.marketingBusinessDesignationList.filter(item => item.id == marketingBusinessDesignationId)
        if (result.length > 0) {
          return result[0].designationName
        } else {
          return ''
        }
      }
      return ''
    },
    handleImage(img) {
      if (img) {
        return this.url.imgerver + '/' + Object.values(JSON.parse(img))[0]
      }
      return ''
    },
    /**查询栏时间区间查询*/
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
@import '~@assets/less/common.less';
</style>
