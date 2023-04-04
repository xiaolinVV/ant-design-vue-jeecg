<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="手机号">
              <a-input placeholder="请输入" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="昵称">
              <a-input placeholder="请输入" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="店铺名称">
              <a-input placeholder="请输入" v-model="queryParam.storeName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="关注时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.attentionTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                  @ok="onDateOk"
                />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="8" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <!--<div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('关注店铺')">导出</a-button>
    </div>-->
    <!-- table区域-begin -->
    <a-table
      ref="table"
      size="middle"
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :scroll="{ x: 2000 }"
      :loading="loading"
      bordered
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      @change="handleTableChange"
    >
      <template slot="headPortrait" slot-scope="text, record, index">
        <img
          class="clickShowImage"
          :preview="'headPortrait' + index"
          :src="getAvatarView(record.headPortrait)"
          alt=""
        />
      </template>
      <template slot="logoAddr" slot-scope="text, record, index">
        <img class="clickShowImage" :preview="'logoAddr' + index" :src="getAvatarView(record.logoAddr)" alt="" />
      </template>
      <template slot="status" slot-scope="text, record, index">
        <div class="anty-img-wrap">
          <span shape="square" v-if="record.status == 0">停用</span>
          <span shape="square" v-if="record.status == 1">启用</span>
        </div>
      </template>
    </a-table>

    <!-- table区域-end -->

    <!-- 表单区域 -->
    <memberAttentionStore-modal ref="modalForm" @ok="modalFormOk"></memberAttentionStore-modal>
  </a-card>
</template>

<script>
import MemberAttentionStoreModal from './modules/MemberAttentionStoreModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import { deleteAction, getAction, downFile } from '@/api/manage'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { putAction } from '@/api/manage'
export default {
  name: 'MemberAttentionStoreList',
  mixins: [JeecgListMixin],
  components: {
    MemberAttentionStoreModal
  },
  data() {
    return {
      description: '关注店铺管理页面',
      attentionTime: [],
      // queryParam: {
      //   phone: '',
      //   storeName: ''
      // },

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
          title: '昵称',
          align: 'center',
          dataIndex: 'nickName'
        },
        {
          title: '店铺logo',
          align: 'center',
          dataIndex: 'logoAddr',
          scopedSlots: { customRender: 'logoAddr' }
        },
        {
          title: '店铺名称',
          align: 'center',
          dataIndex: 'storeName'
        },
        {
          title: '门店位置',
          align: 'center',
          dataIndex: 'storeAddress'
        },
        {
          title: '店铺评分',
          align: 'center',
          dataIndex: 'comprehensiveEvaluation'
        },
        {
          title: '可用优惠券',
          align: 'center',
          dataIndex: '',
          customRender: function() {
            return '-'
          }
        },
        {
          title: '店铺状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '店铺当前活动',
          align: 'center',
          dataIndex: 'activitiesType_dictText',
          customRender: function(activitiesType_dictText) {
            if (activitiesType_dictText) {
              return activitiesType_dictText
            } else {
              return '-'
            }
          }
        },
        {
          title: '关注时间',
          align: 'center',
          dataIndex: 'attentionTime',
          sorter: true
        }
      ],
      url: {
        list: '/memberAttentionStore/memberAttentionStore/list',
        delete: '/memberAttentionStore/memberAttentionStore/delete',
        deleteBatch: '/memberAttentionStore/memberAttentionStore/deleteBatch',
        exportXlsUrl: 'memberAttentionStore/memberAttentionStore/exportXls',
        importExcelUrl: 'memberAttentionStore/memberAttentionStore/importExcel',
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
    getAvatarView: function(headPortrait) {
      return this.url.imgerver + '/' + headPortrait
    },
    getAvatarView: function(logoAddr) {
      return this.url.imgerver + '/' + logoAddr
    },
    getQueryParams() {
      console.log(this.queryParam.attentionTime)
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.attentionTime // 时间参数不传递后台
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      console.log(dateString[0], dateString[1])
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    onDateOk(value) {
      console.log(value)
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
