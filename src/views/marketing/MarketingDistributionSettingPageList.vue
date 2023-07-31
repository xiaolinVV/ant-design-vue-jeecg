<!--分销店铺列表-->
<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="店铺名称">
              <a-input placeholder="请输入" v-model="queryParam.year"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="联系人">
              <a-input placeholder="" v-model="queryParam.year"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="联系人手机">
              <a-input placeholder="" v-model="queryParam.year"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="分销状态">
                <a-input placeholder="" v-model="queryParam.year"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="更新时间">
                <a-input placeholder="" v-model="queryParam.year"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!--<a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('店铺分销设置')">导出</a-button>-->
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
    </div>

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
        <template slot="mlone" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square">{{ record.mlone + record.mltwo }}</span>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingStoreDistributionSetting-modal ref="modalForm"
                                             @ok="modalFormOk"></marketingStoreDistributionSetting-modal>
  </a-card>
</template>

<script>
  import MarketingStoreDistributionSettingModal from './modules/MarketingStoreDistributionSettingModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'

  export default {
    name: "MarketingDistributionSettingPageList",
    mixins: [JeecgListMixin],
    components: {
      MarketingStoreDistributionSettingModal
    },
    data () {
      return {
        description: '店铺分销记录',
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
            title: '头像',
            align: "center",
            dataIndex: 'headPortrait'
          },
          {
            title: '手机号',
            align: "center",
            dataIndex: 'phone'
          },
          {
            title: '昵称',
            align: "center",
            dataIndex: 'nickName'
          },
          {
            title: '会员类型',
            align: "center",
            dataIndex: 'memberType_text'
          },
          {
            title: '成员',
            align: "center",
            dataIndex: 'mlone',
            scopedSlots: {customRender: "mlone"}
          },
          {
            title: '累计佣金',
            align: "center",
            dataIndex: 'totalCommission'
          },
          {
            title: '可提现佣金',
            align: "center",
            dataIndex: 'accountFrozen'
          },
          {
            title: '已提现',
            align: "center",
            dataIndex: 'haveWithdrawal'
          },
          {
            title: '推荐人',
            align: "center",
            dataIndex: 'promoterName'
          },
          {
            title: '小程序推广码',
            align: "center",
            dataIndex: 'address'
          },
          {
            title: '归属店铺',
            align: "center",
            dataIndex: 'storeName'
          },
          {
            title: '注册时间',
            align: "center",
            dataIndex: 'createTime'
          },
        ],
        url: {
          list: "/marketingDistributionSetting/marketingDistributionSetting/findDistributionSetting",
          delete: "/marketingStoreDistributionSetting/marketingStoreDistributionSetting/delete",
          deleteBatch: "/marketingStoreDistributionSetting/marketingStoreDistributionSetting/deleteBatch",
          exportXlsUrl: "marketingStoreDistributionSetting/marketingStoreDistributionSetting/exportXls",
          importExcelUrl: "marketingStoreDistributionSetting/marketingStoreDistributionSetting/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {}
  }
</script>
<style scoped>

</style>