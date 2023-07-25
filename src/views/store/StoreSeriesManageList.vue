<template>
  <a-row :gutter="10" >
    <a-col :span="11">
      <a-card :bordered="false" style="min-width: 600px;min-height: 800px">
        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="handleEdit({type:0})" type="primary" icon="plus">新增</a-button>
          <!--      <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('店铺-系列店铺-系列管理')">导出</a-button>
                <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
                  <a-button type="primary" icon="import">导入</a-button>
                </a-upload>-->
<!--          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
          </a-dropdown>-->
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
            :rowSelection="{type:'radio',selectedRowKeys: selectedRowKeys, onChange: selectclick}"
            @change="handleTableChange">
        <template slot="picture" slot-scope="text, record">
          <img :src="getImgUrl(text)" style="width: 40px;height: 40px">
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="record.type=0; handleEdit(record);">编辑</a>

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


      </a-card>
    </a-col>
    <a-col :span="8">



      <a-card :bordered="false" style="min-width: 900px;min-height: 800px">

    <!-- 查询区域 -->
    <!--<div class="table-page-search-wrapper">
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
            <a-form-item label="系列编号">
              <a-input placeholder="请输入系列编号" v-model="queryParam.serialNumber"></a-input>
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
    </div>-->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleEditClick({type:1})" type="primary" icon="plus">新增</a-button>
<!--      <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('店铺-系列店铺-系列管理')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
<!--      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
 <!--     <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>-->

      <a-table
        size="middle"
        bordered
        rowKey="id"
        :columns="twocolumns"
        :dataSource="twodataSource"
        :pagination="twoipagination"
        :loading="twoloading"
        @change="handleTableChange">
        <template slot="picture" slot-scope="text, record">
          <img :src="getImgUrl(text)" style="width: 40px;height: 40px">
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEditClick(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDeleteClick(record.id)">
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
    <storeSeriesManage-modal ref="modalForm" @ok="modalFormOk" @myOk="twoLoadData"></storeSeriesManage-modal>
  </a-card>
    </a-col>
  </a-row>
</template>

<script>
  import StoreSeriesManageModal from './modules/StoreSeriesManageModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {getAction,deleteAction} from '@/api/manage';

  export default {
    name: "StoreSeriesManageList",
    mixins:[JeecgListMixin],
    components: {
      StoreSeriesManageModal
    },
    data () {
      return {
        description: '店铺-系列店铺-系列管理管理页面',
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
            title: '系列编号',
            align:"center",
            dataIndex: 'serialNumber'
           },
		   {
            title: '系列名称',
            align:"center",
            dataIndex: 'seriesName'
           },
		   {
            title: '是否支持子级',
            align:"center",
            dataIndex: 'hasChild',
         customRender(text){
              if(text==0){
                return '否';
              }
           if(text==1){
             return '是';
           }
         }
           },
		   {
            title: '标签',
            align:"center",
            dataIndex: 'label'
           },
		   {
            title: '图片',
            align:"center",
            dataIndex: 'picture',
         scopedSlots:{customRender:'picture'}
           },
          {
            title: '排序',
            align:"center",
            dataIndex: 'sort'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],

        twodataSource:[],
        twoipagination: {
          current: 1,
          pageSize: 10,
          hideOnSinglePage: true,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        twoloading:false,
        twocolumns: [
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
            title: '系列编号',
            align:"center",
            dataIndex: 'serialNumber'
          },
          {
            title: '系列名称',
            align:"center",
            dataIndex: 'seriesName'
          },
          {
            title: '图片',
            align:"center",
            dataIndex: 'picture',
            scopedSlots:{customRender:'picture'}
          },
          {
            title: '排序',
            align:"center",
            dataIndex: 'sort'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: encodeURI("/store/storeSeriesManage/list?superQueryParams=[{\'field\':\'parentId\',\'rule\':\'eq\',\'val\':\'0\'}]"),
          delete: "/store/storeSeriesManage/delete",
          deleteBatch: "/store/storeSeriesManage/deleteBatch",
          exportXlsUrl: "store/storeSeriesManage/exportXls",
          importExcelUrl: "store/storeSeriesManage/importExcel",
       },
        parentSeries:{}
    }
  },
    watch: {
      'twoipagination.current': {
        handler(newVal) {
          this.twoLoadMore();
        },
        deep: true
      }
    },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
      handleDeleteClick(id){
        deleteAction(this.url.delete, {id:id}).then((res) => {
          if (res.success) {
           this.twoLoadData();
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      handleEditClick(record){
        record.type='1';
        console.log('parentSeries:',this.parentSeries);
        if(!this.parentSeries.id){
          this.$message.warning('请先选择父系列');
          return;
        }
        if(this.parentSeries.hasChild==0){
          this.$message.warning('该系列不支持子级');
          return;
        }
        this.$refs.modalForm.edit(record,this.parentSeries);
      },
      selectclick(selectedRowKeys, selectedRows){
        console.log(selectedRowKeys,'======',selectedRows);
        this.parentSeries={};
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectedRows;
        this.parentSeries=selectedRows[0];
        this.twoLoadData();
      },
      twoLoadData(){
        console.log('加载数据......')
        let url=encodeURI("store/storeSeriesManage/list?superQueryParams=[{\'field\':\'parentId\',\'rule\':\'eq\',\'val\':\'"+this.parentSeries.id+"\'}]&column=createTime&order=desc");
        this.twoloading=true;
        this.twoipagination.current=1;
        getAction(url, {pageNo:  this.twoipagination.current,pageSize:  this.twoipagination.pageSize}).then((res) => {
          if (res.success) {
            this.twodataSource=res.result.records;
            this.twoloading=false;
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      twoLoadMore(){
        let url=encodeURI("store/storeSeriesManage/list?superQueryParams=[{\'field\':\'parentId\',\'rule\':\'eq\',\'val\':\'"+this.parentSeries.id+"\'}]&column=createTime&order=desc");
        this.twoloading=true;
        getAction(url, {pageNo:  this.twoipagination.current,pageSize:this.twoipagination.pageSize}).then((res) => {
          if (res.success) {
            this.twodataSource=res.result.records;
            this.twoloading=false;
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      getImgUrl(url){
        return window._CONFIG['imgDomainURL']+'/'+url;
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>