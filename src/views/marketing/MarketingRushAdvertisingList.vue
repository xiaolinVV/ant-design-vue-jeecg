<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="广告标题">
              <a-input placeholder="请输入广告标题" v-model="queryParam.title"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-radio-group v-model="queryParam.status" name="radioGroup">
                <a-radio value="">全部</a-radio>
                <a-radio value="0">停用</a-radio>
                <a-radio value="1">启用</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
<!--        <template v-if="toggleSearchStatus">
        <a-col :md="6" :sm="8">
            <a-form-item label="结束时间">
              <a-input placeholder="请输入结束时间" v-model="queryParam.endTime"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="创建月">
              <a-input placeholder="请输入创建月" v-model="queryParam.month"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="图片地址">
              <a-input placeholder="请输入图片地址" v-model="queryParam.pictureAddr"></a-input>
            </a-form-item>
          </a-col>
          </template>-->
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
       <!--       <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>-->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('抢购-活动广告')">导出</a-button>
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


        <template slot="pictureAddr" slot-scope="text,record">
          <img :src="getImgUrl(JSON.parse(text)[0])" style="width: 40px;height: 40px">
        </template>

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
    <marketingRushAdvertising-modal ref="modalForm" @ok="modalFormOk"></marketingRushAdvertising-modal>
  </a-card>
</template>

<script>
  import MarketingRushAdvertisingModal from './modules/MarketingRushAdvertisingModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "MarketingRushAdvertisingList",
    mixins:[JeecgListMixin],
    components: {
      MarketingRushAdvertisingModal
    },
    data () {
      return {
        description: '抢购-活动广告管理页面',
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
            title: '广告标题',
            align:"center",
            dataIndex: 'title'
          },
          {
            title: '图片',
            align:"center",
            dataIndex: 'pictureAddr',
            scopedSlots:{customRender:'pictureAddr'}
          },
          {
            title: '排序',
            align:"center",
            dataIndex: 'sort'
          },
          {
            title: '开始时间',
            align:"center",
            dataIndex: 'startTime'
          },
		   {
            title: '结束时间',
            align:"center",
            dataIndex: 'endTime'
           },
		   {
            title: '状态',
            align:"center",
            dataIndex: 'status',
         customRender(text,record){
              if(text==0){
                return '停用';
              }
           if(text==1){
             return '启用';
           }
         }
           },

          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/marketing/marketingRushAdvertising/list",
          delete: "/marketing/marketingRushAdvertising/delete",
          deleteBatch: "/marketing/marketingRushAdvertising/deleteBatch",
          exportXlsUrl: "marketing/marketingRushAdvertising/exportXls",
          importExcelUrl: "marketing/marketingRushAdvertising/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
      getImgUrl(url){
        return window._CONFIG['imgDomainURL']+'/'+url;
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>