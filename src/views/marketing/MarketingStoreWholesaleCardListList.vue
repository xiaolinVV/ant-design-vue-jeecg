<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="批发卡编号">
              <a-input placeholder="请输入批发卡编号" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="发行店铺">
              <a-input placeholder="请输入发行店铺" v-model="queryParam.storeName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="卡名称">
              <a-input placeholder="请输入卡名称" v-model="queryParam.carName"></a-input>
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
      <a-button @click="toOperation()" type="primary" icon="plus">新增</a-button>

      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
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
        :scroll="{ x: 2000 }"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="status" slot-scope="text">
          <div v-if="text == 1">启用</div>
          <div v-else>停用</div>
        </template>
        <template slot="timeWay" slot-scope="text, record">
          {{ handleTimeWay(record) }}
        </template>

        <template slot="goodCount" slot-scope="text, record">
          <a @click="showModal(record)">{{ text }}</a>
        </template>

        <span slot="action" slot-scope="text, record">
          <!-- handleEdit -->
          <!-- <a @click="toOperation(record)">编辑</a>
          <a-divider type="vertical" />
          <a v-if="record.status == 1" @click="showTextareaModal(record, 1)">停用</a>
          <a v-else @click="showTextareaModal(record, 2)">启用</a>
          <a-divider type="vertical" />
          <a @click="showTextareaModal(record, 3)">删除</a> -->

          <a @click="toOperation(record)">编辑</a>
          <a-divider type="vertical" />
          <a v-if="record.status == 1" @click="showTextareaModal(record, 1)">停用</a>
          <a v-else @click="showTextareaModal(record, 2)">启用</a>
          <a-divider type="vertical" />
          <a @click="showTextareaModal(record, 3)">删除</a>

          <!-- <a-dropdown>
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
    <marketingStoreGiftCardList-modal ref="modalForm" @ok="modalFormOk"></marketingStoreGiftCardList-modal>
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></textAreaModal>
    <MarketingStoreGiftCardCanSelectGoods ref="modalForm3"></MarketingStoreGiftCardCanSelectGoods>
  </a-card>
</template>

<script>
import MarketingStoreGiftCardListModal from './modules/MarketingStoreWholesaleCardListModal'
import MarketingStoreGiftCardCanSelectGoods from './modules/MarketingStoreGiftCardCanSelectGoods'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import textAreaModal from '@/components/popUp/textAreaModal'
import { putAction, deleteAction } from '@/api/manage'
import JInput from '@/components/jeecg/JInput.vue'
export default {
  name: 'MarketingStoreWholesaleCardListList',
  mixins: [JeecgListMixin],
  components: {
    MarketingStoreGiftCardListModal,
    textAreaModal,
    MarketingStoreGiftCardCanSelectGoods,
    JInput
  },
  data() {
    return {
      description: '店铺批发卡列表管理页面',
      cardType:"1",
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
          title: '批发卡编号',
          align: 'center',
          dataIndex: 'serialNumber'
        },

        {
          title: '发行店铺',
          align: 'center',
          dataIndex: 'storeName'
        },
        {
          title: '卡名称',
          align: 'center',
          dataIndex: 'carName'
        },
        {
          title: '面额',
          align: 'center',
          dataIndex: 'denomination'
        },
        // {
        //   title: '可选商品',
        //   align: 'center',
        //   dataIndex: 'goodCount',
        //   scopedSlots: { customRender: 'goodCount' }
        // },
        {
          // ；0：有效期；1：当日起；2：次日起
          title: '有效期',
          align: 'center',
          dataIndex: 'timeWay',
          scopedSlots: { customRender: 'timeWay' }
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
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 250,
          scopedSlots: { customRender: 'action' }
        }
      ],
      modalForm2Record: {},
      modalForm2Infos: {},
      url: {
        list: '/marketing/marketingStoreGiftCardList/list',
        delete: '/marketing/marketingStoreGiftCardList/delete',
        deleteBatch: '/marketing/marketingStoreGiftCardList/deleteBatch',
        exportXlsUrl: 'marketing/marketingStoreGiftCardList/exportXls',
        importExcelUrl: 'marketing/marketingStoreGiftCardList/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        edit: 'marketing/marketingStoreGiftCardList/edit'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    showModal(record) {
      this.$refs.modalForm3.showModal(record)
    },
    toOperation(record = {}) {
      this.$router.push({ path: '/marketing/modules/MarketingStoreWholesaleCardListListAdd', query: { record } })
    },
    async showTextareaModal(record, type) {
      const allInfos = [
        {
          title: '停用',
          mainText: '停用后，该批发卡将不再发行。',
          explainSureText: '您确定要停用吗'
        },
        {
          title: '启用',
          mainText: '启用后，该批发卡将可以发行。',
          explainSureText: '您确定要启用吗'
        },
        {
          title: '删除',
          mainText: '删除批发卡，将无法恢复。',
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
      infos.cardType = this.cardType
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
    handleTimeWay(record) {
      let timeWay = record.timeWay
      let result = ''
      if (timeWay == 1 || timeWay == 2) {
        if (timeWay == 1) {
          result += '当日起'
        } else {
          result += '次日起'
        }
        result += record.timeDigital
        if (record.timeUnit == 1) {
          result += '周'
        } else if (record.timeUnit == 2) {
          result += '月'
        } else {
          result += '天'
        }
        result += '内可用'
      } else {
        result = `${record.startTime}~${record.endTime}`
      }
      return result
    },
    /**查询栏时间区间查询*/
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      param.cardType = this.cardType
      delete param.createTime
      return filterObj(param)
    },
    onDateChange2: function(value, dateString) {
      this.queryParam.createTimeStart = dateString[0]
      this.queryParam.createTimeEnd = dateString[1]
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
