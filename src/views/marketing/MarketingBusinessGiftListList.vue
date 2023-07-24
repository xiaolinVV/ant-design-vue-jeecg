<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="创业礼包编号">
              <a-input placeholder="请输入创业礼包编号" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="礼包名称">
              <a-input placeholder="请输入礼包名称" v-model="queryParam.giftName"></a-input>
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
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
      <!-- <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('创业礼包列表')">导出</a-button>
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
        :scroll="{ x: 2000 }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="mainPicture" slot-scope="text, record, index">
          <img class="clickShowImage " :preview="'mainPicture' + index" :src="handleImage(text)" alt="" />
        </template>

        <template slot="status" slot-scope="text, record">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">停用</span>
            <span shape="square" v-if="record.status == 1">启用</span>
            <span shape="square" v-if="record.status == 3">失效</span>
          </div>
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
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingBusinessGiftList-modal ref="modalForm" @ok="modalFormOk"></marketingBusinessGiftList-modal>
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></textAreaModal>
  </a-card>
</template>

<script>
import MarketingBusinessGiftListModal from './modules/MarketingBusinessGiftListModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import textAreaModal from '@/components/popUp/textAreaModal'
import { postAction, deleteAction } from '@/api/manage'
export default {
  name: 'MarketingBusinessGiftListList',
  mixins: [JeecgListMixin],
  components: {
    MarketingBusinessGiftListModal,
    textAreaModal
  },
  data() {
    return {
      description: '创业礼包列表管理页面',
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
          title: '创业礼包编号',
          align: 'center',
          dataIndex: 'serialNumber'
        },

        {
          title: '礼包名称',
          align: 'center',
          dataIndex: 'giftName'
        },
        {
          title: '礼包图片',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '销售价',
          align: 'center',
          dataIndex: 'salesPrice'
        },
        {
          title: '成本价',
          align: 'center',
          dataIndex: 'costPrice'
        },
        {
          title: '库存',
          align: 'center',
          dataIndex: 'repertory'
        },
        {
          title: '推荐奖励',
          align: 'center',
          dataIndex: 'referralBonuses'
        },
        {
          title: '分红资金',
          align: 'center',
          dataIndex: 'bonusMoney'
        },
        // {
        //   title: '分享标题',
        //   align: 'center',
        //   dataIndex: 'shareTitle'
        // },
        // {
        //   title: '主图',
        //   align: 'center',
        //   dataIndex: 'mainPicture'
        // },
        // {
        //   title: '详情图',
        //   align: 'center',
        //   dataIndex: 'detailsFigure'
        // },
        // {
        //   title: '分享图',
        //   align: 'center',
        //   dataIndex: 'coverPlan'
        // },
        // {
        //   title: '海报图',
        //   align: 'center',
        //   dataIndex: 'posters'
        // },
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
        // {
        //   title: '删除说明',
        //   align: 'center',
        //   dataIndex: 'delExplain'
        // },

        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          width: 250,
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/marketingBusinessGiftList/marketingBusinessGiftList/list',
        delete: '/marketingBusinessGiftList/marketingBusinessGiftList/delete',
        deleteBatch: '/marketingBusinessGiftList/marketingBusinessGiftList/deleteBatch',
        exportXlsUrl: 'marketingBusinessGiftList/marketingBusinessGiftList/exportXls',
        importExcelUrl: 'marketingBusinessGiftList/marketingBusinessGiftList/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        edit: 'marketingBusinessGiftList/marketingBusinessGiftList/edit'
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
          mainText: '停用后该礼包将不在展示',
          explainSureText: '您确定要停用吗'
        },
        {
          title: '启用',
          mainText: '启动后该礼包将展示。',
          explainSureText: '您确定要启用吗'
        },
        {
          title: '删除',
          mainText: '删除后该礼包将无法恢复',
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
    handleImage(img) {
      if (img) {
        return this.url.imgerver + '/' + Object.values(JSON.parse(img))[0]
      }
      return ''
    },
    // /**查询栏时间区间查询*/
    getQueryParams() {
      console.log(this.queryParam.createTime)
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.createTime
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    }
  }
}
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>
