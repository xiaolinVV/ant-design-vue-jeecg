<template>
  <a-modal :title="title" :width="1200" :visible="visible" cancelText="关闭" :footer="null" @cancel="handleCancel">
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="8" :sm="8">
              <a-form-item label="流水号">
                <a-input placeholder="请输入流水号" v-model="queryParam.orderNo"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="交易单号">
                <a-input placeholder="请输入交易单号" v-model="queryParam.orderNo"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="交易类型">
                <j-dict-select-tag v-model="queryParam.payType" placeholder="请选择" dictCode="member_deal_type" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="收入支出">
                <a-select v-model="queryParam.goAndCome" placeholder="请选择" style="margin-right: 10px;">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">收入</a-select-option>
                  <a-select-option :value="1">支出</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="交易时间">
                <a-range-picker
                  style="min-width: 210px"
                  v-model="queryParam.createTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                />
              </a-form-item>
            </a-col>

            <a-col :md="24" :sm="8">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <!--      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
        <!--<a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('收货地址')">导出</a-button>-->
      </div>
      <!-- table区域-begin -->
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        bordered
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="goAndCome" slot-scope="text, record, index">
          <div v-if="record.goAndCome == 0">收入</div>
          <div v-if="record.goAndCome == 1">支出</div>
        </template>
      </a-table>

      <!-- table区域-end -->

      <!-- 表单区域 -->
    </a-card>
  </a-modal>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import JInput from '@/components/jeecg/JInput.vue'
export default {
  name: 'MemberBalanceDetailModal',
  mixins: [JeecgListMixin],
  components: {
    JInput
  },
  data() {
    return {
      model: {},
      visible: false,
      title: '余额明细',
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
          dataIndex: 'orderNo'
        },
        {
          title: '交易类型',
          align: 'center',
          dataIndex: 'payType_dictText'
        },
        {
          title: '收入/支出',
          align: 'center',
          dataIndex: 'goAndCome',
          scopedSlots: { customRender: 'goAndCome' }
        },
        {
          title: '交易金额',
          align: 'center',
          dataIndex: 'amount'
        },
        {
          title: '可用余额',
          align: 'center',
          dataIndex: 'balance'
        },
        {
          title: '交易时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '交易单号',
          align: 'center',
          dataIndex: 'orderNo'
        }
      ],
      isSetPageNo: false,
      url: {
        list: '/memberAccountCapital/memberAccountCapital/queryPageListByMemberId'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    onDateChange: function(value, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter, { memberListId: this.model.id })
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.createTime // 时间参数不传递后台
      return filterObj(param)
    },
    async showModal(record) {
      this.model = Object.assign({}, record)
      this.visible = true
      await this.$nextTick()
      this.loadData()
    },
    handleCancel() {
      this.visible = false
      this.ipagination.current = 1
    }
  }
}
</script>
<style lang="sass" scoped></style>
