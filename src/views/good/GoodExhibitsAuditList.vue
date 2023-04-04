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
            <a-form-item label="编号">
              <a-input placeholder="请输入编号" v-model="queryParam.serialNumber"></a-input>
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
     <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
  <!--    <a-button type="primary" icon="download" @click="handleExportXls('展品列表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
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

        <template slot="mainPicture" slot-scope="text,record">
          <img v-if="JSON.parse(text).length>0" :src="getImgUrl(JSON.parse(text)[0])" style="width: 40px;height: 40px">
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">审核</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <good-exhibits-audit-modal ref="modalForm" @ok="modalFormOk"></good-exhibits-audit-modal>
  </a-card>
</template>

<script>
  import GoodExhibitsAuditModal from './modules/GoodExhibitsAuditModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {getAction} from '@/api/manage';

  export default {
    name: "GoodExhibitsAuditList",
    mixins:[JeecgListMixin],
    components: {
      GoodExhibitsAuditModal
    },
    data () {
      return {
        description: '展品列表管理页面',
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
            title: '编号',
            align:"center",
            dataIndex: 'serialNumber'
           },
		   {
            title: '主图',
            align:"center",
            dataIndex: 'mainPicture',
         scopedSlots:{customRender:'mainPicture'}
           },
		   {
            title: '名称',
            align:"center",
            dataIndex: 'exhibitsName'
           },
		   {
            title: '描述',
            align:"center",
            dataIndex: 'exhibitsDescribe'
           },
		   {
            title: '上下架',
            align:"center",
            dataIndex: 'frameStatus',
         customRender(text){
              if(text==0){
                return '下架';
              }
              if(text==1){
                return '上架';
              }
         }
           },
          {
            title: '店铺名称',
            align:"center",
            dataIndex: 'storeName'
          },
		   {
            title: '排序',
            align:"center",
            dataIndex: 'sort'
           },
          {
            title: '状态',
            align: "center",
            dataIndex: 'status',
            customRender(text) {
              if (text == 0) {
                return '审核中';
              }
              if (text == 1) {
                return '通过';
              }
              if (text == 2) {
                return '未通过';
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
          list: encodeURI("/good/goodExhibits/list?superQueryParams=[{'field':'delFlag','rule':'eq','val':'0'},{'field':'status','rule':'eq','val':'0'}]"),
          delete: "/good/goodExhibits/delete",
          deleteBatch: "/good/goodExhibits/deleteBatch",
          exportXlsUrl: "good/goodExhibits/exportXls",
          importExcelUrl: "good/goodExhibits/importExcel"
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
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>