<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="手机号">
              <j-input placeholder="请输入手机号" v-model="queryParam.phone"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员昵称">
              <j-input placeholder="请输入会员昵称" v-model="queryParam.nickName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员编号">
              <j-input placeholder="请输入会员编号" v-model="queryParam.id"></j-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
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
      <!--<a-button type="primary" icon="download" @click="handleExportXls('收货地址')">导出</a-button>-->
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
      <template slot="headPortrait" slot-scope="text, record, index">
        <img class="clickShowImage" :preview="'headPortrait' + index" :src="record.headPortrait" alt="" height="25px" style="max-width:80px;font-size: 12px;font-style: italic;" />
      </template>
      <span slot="action" slot-scope="text, record">
        <a @click="showModal(record)">余额明细</a>
        <!--<a-divider type="vertical" />
        <a @click="handleEdit(record)">调整</a>-->
      </span>
    </a-table>

    <!-- table区域-end -->

    <!-- 表单区域 -->
    <MemberBalanceDetailModal ref="modal2"></MemberBalanceDetailModal>
    <MemberBalanceEditModal ref="modalForm" @ok="modalFormOk"></MemberBalanceEditModal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import JInput from '@/components/jeecg/JInput.vue'
import MemberBalanceDetailModal from './modules/MemberBalanceDetailModal'
import MemberBalanceEditModal from './modules/MemberBalanceEditModal'
import { deleteAction, getAction, downFile, putAction } from '@/api/manage'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  name: 'MemberShippingAddressList',
  mixins: [JeecgListMixin],
  components: { JInput, MemberBalanceDetailModal, MemberBalanceEditModal },
  data() {
    return {
      description: '余额明细页面',
      createTime: [],
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
          dataIndex: 'id'
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
          title: '会员昵称',
          align: 'center',
          dataIndex: 'nickName'
        },
        {
          title: '余额',
          align: 'center',
          dataIndex: 'balance'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/memberList/memberList/list',
        delete: '/memberList/memberList/delete',
        deleteBatch: '/memberList/memberList/deleteBatch',
        exportXlsUrl: 'memberList/memberList/exportXls',
        importExcelUrl: 'memberList/memberList/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    getQueryParams() {
      console.log(this.queryParam.createTime)
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.createTime // 时间参数不传递后台
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      console.log(dateString[0], dateString[1])
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    onDateOk(value) {
      console.log(value)
    },
    showModal(record) {
      this.$refs.modal2.showModal(record)
    }
  }
}
</script>
<style scoped lang="less">
.table-operator {
  margin-bottom: 10px;
  button {
    margin-right: 8px;
  }
}
</style>
