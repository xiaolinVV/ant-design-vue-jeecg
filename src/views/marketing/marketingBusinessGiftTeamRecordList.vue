<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="创业团编号">
              <a-input placeholder="请输入创业团编号" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员编号">
              <a-input placeholder="请输入会员编号" v-model="queryParam.mid"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员手机号">
              <a-input placeholder="请输入会员手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item label="晋升时间">
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
            <a-form-item label="业绩考核">
              <a-select v-model="queryParam.performance" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">未达标</a-select-option>
                <a-select-option :value="1">已达标</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">进行中</a-select-option>
                <a-select-option :value="1">已完成</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
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
          <img
            class="clickShowImage"
            v-if="record.headPortrait != undefined"
            :preview="'headPortrait' + index"
            :src="record.headPortrait"
            alt=""
            height="25px" style="max-width:80px;font-size: 12px;font-style: italic;"
          />
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="showDetail(record, 4)">查看成员</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingBusinessGiftRecord-modal ref="modalForm" @ok="modalFormOk"></marketingBusinessGiftRecord-modal>
    <MarketingViewMembersModal ref="MarketingViewMembersModal"></MarketingViewMembersModal>
  </a-card>
</template>

<script>
import MarketingBusinessGiftRecordModal from './modules/MarketingBusinessGiftRecordModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import JInput from '@/components/jeecg/JInput.vue'
import MarketingViewMembersModal from './modules/MarketingViewMembersModal'
export default {
  name: 'MarketingBusinessGiftRecordList',
  mixins: [JeecgListMixin],
  components: {
    JInput,
    MarketingBusinessGiftRecordModal,
    MarketingViewMembersModal
  },
  data() {
    return {
      description: '创业礼包团队记录管理页面',
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
          title: '创业团编号',
          align: 'center',
          dataIndex: 'serialNumber'
        },
        {
          title: '会员编号',
          align: 'center',
          dataIndex: 'mid'
        },
        {
          title: '会员头像',
          align: 'center',
          dataIndex: 'headPortrait',
          scopedSlots: { customRender: 'headPortrait' }
        },
        {
          title: '会员手机号',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '会员昵称',
          align: 'center',
          dataIndex: 'nickName'
        },

        {
          title: '晋升时间',
          align: 'center',
          dataIndex: 'createTime'
        },

        {
          title: '成员数量',
          align: 'center',
          dataIndex: 'memberNumber'
        },
        {
          title: '业绩考核',
          align: 'center',
          dataIndex: 'performance',
          customRender: function(performance) {
            if (performance == 0) {
              return '未达标'
            } else if (performance == 1) {
              return '已达标'
            }
          }
        },

        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          customRender: function(status) {
            if (status == 0) {
              return '进行中'
            } else if (status == 1) {
              return '已完成'
            }
          }
        },
        {
          title: '完成时间',
          align: 'center',
          dataIndex: 'funishTime',
          customRender: function(funishTime) {
            if (funishTime) {
              return funishTime
            } else {
              return '-'
            }
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/marketing/marketingBusinessGiftTeamRecord/list',
        delete: '/marketingBusinessGiftRecord/marketingBusinessGiftRecord/delete',
        deleteBatch: '/marketingBusinessGiftRecord/marketingBusinessGiftRecord/deleteBatch',
        exportXlsUrl: 'marketingBusinessGiftRecord/marketingBusinessGiftRecord/exportXls',
        importExcelUrl: 'marketingBusinessGiftRecord/marketingBusinessGiftRecord/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  // created() {
  //   this.loadData()
  // },
  methods: {
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
      this.queryParam.createTimeStart = dateString[0]
      this.queryParam.createTimeEnd = dateString[1]
    },
    showDetail(record, type) {
      this.$refs.MarketingViewMembersModal.show(record, type)
    }
    //loadData() {
    // getAction(this.url.queryById, { }).then(res => {
    //   if (res.success) {
    //     this.dataSource = res.result.records
    //   }
    // })
    //}
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
