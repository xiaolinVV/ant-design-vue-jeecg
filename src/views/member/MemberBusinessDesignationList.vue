<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="会员编号">
              <a-input placeholder="请输入会员编号" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="手机号">
              <a-input placeholder="请输入手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="上级手机号">
              <a-input placeholder="请输入手机号" v-model="queryParam.tPhone"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchResetSpecial" icon="reload" style="margin-left: 8px">重置</a-button>
      <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown> -->
    </div>

    <!-- table区域-begin -->
    <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;width: 100%">
      <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
      <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
      >项
      <a style="margin-left: 24px" @click="onClearSelected">清空</a>
    </div>
    <div>
      <a-table
        ref="table"
        size="middle"
        rowKey="onlyKey"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :expandedRowKeys="expandedRowKeys"
        @change="handleTableChange"
        @expand="handleExpand"
        v-bind="tableProps"
      >
        <template slot="headPortrait" slot-scope="text, record, index">
          <img class="clickShowImage" :preview="'headPortrait' + index" :src="record.headPortrait" alt="" height="25px" style="max-width:80px;font-size: 12px;font-style: italic;" />
        </template>
      </a-table>
    </div>
    <member-my-team-list-modal ref="modalForm"></member-my-team-list-modal>
  </a-card>
</template>

<script>
import { getAction, deleteAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import MemberMyTeamListModal from './modules/MemberMyTeamListModal'
export default {
  name: 'MemberMyTeamList',
  mixins: [JeecgListMixin],
  inject: ['rush'],
  data() {
    return {
      visible: false,
      description: '商品分类管理页面',
      // 表头
      columns: [
        {
          title: '会员编号',
          align: 'center',
          dataIndex: 'memberListId'
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
          //无限级
          title: '昵称',
          align: 'center',
          dataIndex: 'nickName'
        },
        {
          title: '团队邀请码',
          align: 'center',
          dataIndex: 'promotionCode'
        },
        {
          title: '上级',
          align: 'center',
          dataIndex: 'tMemberName'
        },
        {
          title: '称号',
          align: 'center',
          dataIndex: 'designationName'
        },
        {
          title: '加入团队时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '团队总人数',
          align: 'center',
          dataIndex: 'totalTeam'
        }
      ],
      url: {
        list: 'memberBusinessDesignation/memberBusinessDesignation/list',
        childList: 'memberBusinessDesignation/memberBusinessDesignation/getLevelDown',
        requestList: 'memberBusinessDesignation/memberBusinessDesignation/list'
      },

    }
  },


  methods: {

  }
}
</script>
<style scoped></style>
