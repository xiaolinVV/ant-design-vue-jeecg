<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="手机号">
              <a-input placeholder="" v-model="queryParam.mlPhone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="昵称">
              <a-input placeholder="" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="联系人手机号">
              <a-input placeholder="" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="开户行">
                <a-input placeholder="" v-model="queryParam.bankName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="银行卡号">
                <a-input placeholder="" v-model="queryParam.bankCard"></a-input>
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
              <a-form-item label="修改时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.updateTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange1"
                />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
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
    <div class="table-operator">
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('会员银行卡')">导出</a-button>
      <!--<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
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
      </a-dropdown>-->
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
        :scroll="{ x: 2500 }"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        bordered
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="headPortrait" slot-scope="text, record, index">
          <img class="clickShowImage" :preview="'headPortrait' + index" :src="record.headPortrait" />
        </template>
        <template slot="updateCertificateOne" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            :preview="'updateCertificateOne' + index"
            :src="ssAddressView1(record.updateCertificateOne)"
          />
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <!--<a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>-->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <publicCorrespondentCardsEditModal
      ref="modalForm"
      @ok="modalFormOk"
      urlEditName="memberBankCard/memberBankCard/edit"
    ></publicCorrespondentCardsEditModal>
    <!--    <memberBankCard-modal ref="modalForm" @ok="modalFormOk"></memberBankCard-modal>-->
  </a-card>
</template>

<script>
// import MemberBankCardModal from './modules/MemberBankCardModal'
import publicCorrespondentCardsEditModal from '@/components/popUp/publicCorrespondentCardsEditModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import { httpAction, getAction, postAction, putAction, deleteAction } from '@/api/manage'
export default {
  name: 'MemberBankCardList',
  mixins: [JeecgListMixin],
  components: {
    // MemberBankCardModal,
    publicCorrespondentCardsEditModal
  },
  data() {
    return {
      description: '会员银行卡管理页面',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          fixed: 'left',
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
          title: '联系人手机号',
          align: 'center',
          dataIndex: 'mlPhone'
        },
        {
          title: '收款人',
          align: 'center',
          dataIndex: 'cardholder'
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'identityNumber'
        },
        {
          title: '开户行所在城市',
          align: 'center',
          dataIndex: 'citys'
        },
        {
          title: '开户行',
          align: 'center',
          dataIndex: 'bankName'
        },
        {
          title: '开户行分支行',
          align: 'center',
          dataIndex: 'openingBank'
        },
        {
          title: '银行卡号',
          align: 'center',
          dataIndex: 'bankCard'
        },

        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '变更说明',
          align: 'center',
          dataIndex: 'updateExplain'
        },
        {
          title: '变更凭证',
          align: 'center',
          dataIndex: 'updateCertificateOne',
          scopedSlots: { customRender: 'updateCertificateOne' }
        },
        {
          title: '修改人',
          align: 'center',
          dataIndex: 'updateBy'
        },
        {
          title: '修改时间',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/memberBankCard/memberBankCard/findMemberBankCard',
        delete: '/memberBankCard/memberBankCard/delete',
        deleteBatch: '/memberBankCard/memberBankCard/deleteBatch',
        exportXlsUrl: 'memberBankCard/memberBankCard/exportXls',
        importExcelUrl: 'memberBankCard/memberBankCard/importExcel',
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
    ssAddressView1: function(updateCertificateOne) {
      return this.url.imgerver + '/' + updateCertificateOne
    },
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.createTime // 时间参数不传递后台
      delete param.updateTime // 时间参数不传递后台
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
<style scoped></style>
