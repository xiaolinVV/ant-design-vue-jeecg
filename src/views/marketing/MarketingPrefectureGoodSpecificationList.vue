<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="创建年">
              <a-input placeholder="请输入创建年" v-model="queryParam.year"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="创建月">
              <a-input placeholder="请输入创建月" v-model="queryParam.month"></a-input>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">
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
            <a-form-item label="专区商品id">
              <a-input placeholder="请输入专区商品id" v-model="queryParam.marketingPrefectureGoodId"></a-input>
            </a-form-item>
          </a-col>
          </template>
          <a-col :md="6" :sm="8" >
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
      <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('专区商品规格')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
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

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
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
    <marketingPrefectureGoodSpecification-modal ref="modalForm" @ok="modalFormOk"></marketingPrefectureGoodSpecification-modal>
  </a-card>
</template>

<script>
  import MarketingPrefectureGoodSpecificationModal from './modules/MarketingPrefectureGoodSpecificationModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "MarketingPrefectureGoodSpecificationList",
    mixins:[JeecgListMixin],
    components: {
      MarketingPrefectureGoodSpecificationModal
    },
    data () {
      return {
        description: '专区商品规格管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
           },
		   {
            title: '创建年',
            align:"center",
            dataIndex: 'year'
           },
		   {
            title: '创建月',
            align:"center",
            dataIndex: 'month'
           },
		   {
            title: '创建日',
            align:"center",
            dataIndex: 'day'
           },
		   {
            title: '删除状态（0，正常，1已删除）',
            align:"center",
            dataIndex: 'delFlag'
           },
		   {
            title: '专区商品id',
            align:"center",
            dataIndex: 'marketingPrefectureGoodId'
           },
		   {
            title: '商品规格id',
            align:"center",
            dataIndex: 'goodSpecificationId'
           },
		   {
            title: '专区价',
            align:"center",
            dataIndex: 'prefecturePrice'
           },
		   {
            title: '专区折扣',
            align:"center",
            dataIndex: 'prefecturePriceProportion'
           },
		   {
            title: '福利金抵扣；0：不支持福利金抵扣；1：福利金全额抵扣；2：福利金限额抵扣',
            align:"center",
            dataIndex: 'isWelfare'
           },
		   {
            title: '福利金限额抵扣比例',
            align:"center",
            dataIndex: 'welfareProportion'
           },
		   {
            title: '赠送福利金；0：不支持；1：支持',
            align:"center",
            dataIndex: 'isGiveWelfare'
           },
		   {
            title: '赠送福利金比例',
            align:"center",
            dataIndex: 'giveWelfareProportion'
           },
		   {
            title: '购买天数;-1：不限制；其他代表天数',
            align:"center",
            dataIndex: 'buyProportionDay'
           },
		   {
            title: '可购买件数；-1：不限制；其他代表件数',
            align:"center",
            dataIndex: 'buyProportionLetter'
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/marketingPrefectureGoodSpecification/marketingPrefectureGoodSpecification/list",
          delete: "/marketingPrefectureGoodSpecification/marketingPrefectureGoodSpecification/delete",
          deleteBatch: "/marketingPrefectureGoodSpecification/marketingPrefectureGoodSpecification/deleteBatch",
          exportXlsUrl: "marketingPrefectureGoodSpecification/marketingPrefectureGoodSpecification/exportXls",
          importExcelUrl: "marketingPrefectureGoodSpecification/marketingPrefectureGoodSpecification/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
     
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>