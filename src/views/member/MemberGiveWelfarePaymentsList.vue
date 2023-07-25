<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="会员编号">
              <a-input placeholder="请输入" v-model="queryParam.memberListId"></a-input>
            </a-form-item>
          </a-col>
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
         <!-- <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="创建日">
                <a-input placeholder="请输入创建日" v-model="queryParam.day"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="删除状态（0，正常，1已删除）">
                <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-model="queryParam.delFlag"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="会员列表id">
                <a-input placeholder="请输入会员列表id" v-model="queryParam.memberListId"></a-input>
              </a-form-item>
            </a-col>
          </template>-->
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!--<a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>-->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <!--<div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('会员福利金可获赠数量')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>-->

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a
        style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="headPortrait" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="record.headPortrait != undefined"
            :preview="'headPortrait' + index"
            :src="record.headPortrait"
            alt=""
          />
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="showMemberGiveWelfarePaymentsRecord(record)">明细</a>
          <a-divider type="vertical"/>
          <a @click="handleEdit(record)">调整</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <memberGiveWelfarePayments-modal ref="modalForm" @ok="modalFormOk"></memberGiveWelfarePayments-modal>
    <MemberGiveWelfarePaymentsRecord ref="modalForm2"></MemberGiveWelfarePaymentsRecord>
  </a-card>
</template>

<script>
  import MemberGiveWelfarePaymentsModal from './modules/MemberGiveWelfarePaymentsModal'
  import MemberGiveWelfarePaymentsRecord from './modules/MemberGiveWelfarePaymentsRecord'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import { filterObj } from '@/utils/util'
  export default {
    name: "MemberGiveWelfarePaymentsList",
    mixins: [JeecgListMixin],
    components: {
      MemberGiveWelfarePaymentsRecord,
      MemberGiveWelfarePaymentsModal
    },
    data () {
      return {
        description: '会员福利金可获赠数量管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '会员编号',
            align: 'center',
            dataIndex: 'memberListId'
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
            title: '可获赠数量',
            align: "center",
            dataIndex: 'giveWelfarePayments'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/memberGiveWelfarePayments/memberGiveWelfarePayments/list",
          delete: "/memberGiveWelfarePayments/memberGiveWelfarePayments/delete",
          deleteBatch: "/memberGiveWelfarePayments/memberGiveWelfarePayments/deleteBatch",
          exportXlsUrl: "memberGiveWelfarePayments/memberGiveWelfarePayments/exportXls",
          importExcelUrl: "memberGiveWelfarePayments/memberGiveWelfarePayments/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      showMemberGiveWelfarePaymentsRecord(record){
          let records =Object.assign({},record)
        this.$refs.modalForm2.showModal(records)
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>