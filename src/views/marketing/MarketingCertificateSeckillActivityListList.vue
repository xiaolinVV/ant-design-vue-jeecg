<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="活动编号">
              <a-input placeholder="请输入活动编号" v-model="queryParam.activityNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="活动状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">未开始</a-select-option>
                <a-select-option :value="1">进行中</a-select-option>
                <a-select-option :value="2">已结束</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.onOffState" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">停用</a-select-option>
                <a-select-option :value="1">启用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="开始时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.startTime"
                format="YYYY-MM-DD HH:mm:ss"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="结束时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.endTime"
                format="YYYY-MM-DD HH:mm:ss"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange2"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="创建时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.createTime"
                format="YYYY-MM-DD HH:mm:ss"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange3"
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
        <template slot="onOffState" slot-scope="text, record">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.onOffState == 0">停用</span>
            <span shape="square" v-if="record.onOffState == 1">启用</span>
          </div>
        </template>
        <template slot="status" slot-scope="text">
          <div v-if="text == 1">
            进行中
          </div>
          <div v-else-if="text == 2">
            已结束
          </div>
          <div v-else>
            未开始
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a v-if="record.onOffState == 1" @click="showTextareaModal(record, 1)">停用</a>
          <a v-else @click="showTextareaModal(record, 2)">启用</a>
          <a-divider v-if="record.status == 0" type="vertical" />
          <a v-if="record.status == 0" @click="showTextareaModal(record, 3)">删除</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <MarketingCertificateSeckillActivityListModal
      ref="modalForm"
      @ok="modalFormOk"
    ></MarketingCertificateSeckillActivityListModal>
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></textAreaModal>
  </a-card>
</template>

<script>
import MarketingCertificateSeckillActivityListModal from './modules/MarketingCertificateSeckillActivityListModal'
import { httpAction, getAction, postAction, putAction, deleteAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import textAreaModal from '@/components/popUp/textAreaModal'
export default {
  name: 'MarketingCertificateSeckillListList',
  mixins: [JeecgListMixin],
  components: {
    MarketingCertificateSeckillActivityListModal,
    textAreaModal
  },
  data() {
    return {
      description: '限时抢券列表管理页面',
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
          title: '活动状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'onOffState',
          scopedSlots: { customRender: 'onOffState' }
        },
        {
          title: '状态说明',
          align: 'center',
          dataIndex: 'stateExplain'
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
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/marketingCertificateSeckillActivityList/marketingCertificateSeckillActivityList/list',
        edit: '/marketingCertificateSeckillActivityList/marketingCertificateSeckillActivityList/edit',
        // delete: '/marketingCertificateSeckillList/marketingCertificateSeckillList/delete',
        delete:
          '/marketingCertificateSeckillActivityList/marketingCertificateSeckillActivityList/deleteMarketingCertificateSeckillActivityList',
        deleteBatch: '/marketingCertificateSeckillList/marketingCertificateSeckillList/deleteBatch',
        exportXlsUrl: 'marketingCertificateSeckillList/marketingCertificateSeckillList/exportXls',
        importExcelUrl: 'marketingCertificateSeckillList/marketingCertificateSeckillList/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    toDetail() {},
    async showTextareaModal(record, type) {
      const allInfos = [
        {
          title: '停用',
          mainText: '停用后，该商品将不在活动中展示',
          explainSureText: '您确定要停用吗'
        },
        {
          title: '启用',
          mainText: '启用后，该商品将会在活动中展示',
          explainSureText: '您确定要启用吗'
        },
        {
          title: '删除',
          mainText: '删除后，该券将不在活动中展示',
          explainSureText: '您确定要删除吗'
        }
      ]
      this.modalForm2Record = record
      this.modalForm2Infos = allInfos[type - 1]
      await this.$nextTick()
      this.$refs.modalForm2.show()
    },
    modalForm2Ok(infos) {
      const title = this.modalForm2Infos.title
      let url = this.url.edit
      let method = postAction
      if (title == '停用') {
        infos.onOffState = 0
      } else if (title == '启用') {
        infos.onOffState = 1
      }
      if (title == '删除') {
        url = this.url.delete
        method = postAction
      }
      infos.stateExplain = infos.modalExplain
      method(url, infos).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.error(res.message)
        }
      })
      console.log(infos)
    },
    onDateChange: function(value, dateString) {
      this.queryParam.startTime_begin = dateString[0]
      this.queryParam.startTime_end = dateString[1]
    },
    onDateChange2: function(value, dateString) {
      this.queryParam.endTime_begin = dateString[0]
      this.queryParam.endTime_end = dateString[1]
    },
    onDateChange3: function(value, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    /**查询栏时间区间查询*/
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.startTime
      delete param.endTime
      delete param.createTime
      return filterObj(param)
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
