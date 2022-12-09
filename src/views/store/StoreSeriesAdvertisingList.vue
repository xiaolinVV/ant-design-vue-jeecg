<template>
  <a-row :gutter="10" >
    <a-col :span="4">
      <a-card :defaultExpandAll="true" :bordered="false" style="min-height: 800px">

        <a-tree :showIcon="false"  :autoExpandParent="true" :treeData="treeData" @select="selectClick">
        </a-tree>

      </a-card>
    </a-col>
    <a-col :span="8">



      <a-card :bordered="false" style="min-width: 1400px;min-height: 800px">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="广告名称">
              <a-input placeholder="请输入广告名称" v-model="queryParam.advertisingTitle"></a-input>
            </a-form-item>
          </a-col>
      <!--    <a-col :md="6" :sm="8">
            <a-form-item label="创建月">
              <a-input placeholder="请输入创建月" v-model="queryParam.month"></a-input>
            </a-form-item>
          </a-col>-->
        <!--<template v-if="toggleSearchStatus">
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
            <a-form-item label="系列管理id">
              <a-input placeholder="请输入系列管理id" v-model="queryParam.storeSeriesManageId"></a-input>
            </a-form-item>
          </a-col>
          </template>-->
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
             <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
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
      <a-button @click="handleAddClick" type="primary" icon="plus">新增</a-button>
      <!--<a-button type="primary" icon="download" @click="handleExportXls('店铺-系列店铺-系列轮播图')">导出</a-button>
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


        <template slot="picture" slot-scope="text, record">
          <img :src="getImgUrl(text)" style="width: 40px;height: 40px">
        </template>

        <span slot="action" slot-scope="text, record">
           <a-popconfirm v-if="record.status==0" title="确定启用吗?" @confirm="updateStatus(record.id)">
                  <a>启用</a>
                </a-popconfirm>
          <a-popconfirm v-if="record.status==1" title="确定停用吗?" @confirm="updateStatus(record.id)">
                  <a>停用</a>
                </a-popconfirm>
           <a-divider type="vertical" />
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
    <storeSeriesAdvertising-modal ref="modalForm" @ok="modalFormOk"></storeSeriesAdvertising-modal>
      </a-card>
    </a-col>


  </a-row>
</template>

<script>
  import StoreSeriesAdvertisingModal from './modules/StoreSeriesAdvertisingModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {getAction} from '@/api/manage';

  export default {
    name: "StoreSeriesAdvertisingList",
    mixins:[JeecgListMixin],
    components: {
      StoreSeriesAdvertisingModal
    },
    data () {
      return {
        description: '店铺-系列店铺-系列轮播图管理页面',
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
            dataIndex: 'advertisingTitle'
           },
		   {
            title: '图片',
            align:"center",
            dataIndex: 'picture',
         scopedSlots:{customRender:'picture'}
           },
		   {
            title: '跳转类型',
            align:"center",
            dataIndex: 'jumpType',
         customRender(text){
              if(text==0){
                return '无';
              }
           if(text==1){
             return '店铺';
           }
         }
           },
		   {
            title: '跳转',
            align:"center",
            dataIndex: 'jumpId'
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
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/store/storeSeriesAdvertising/list",
          delete: "/store/storeSeriesAdvertising/delete",
          deleteBatch: "/store/storeSeriesAdvertising/deleteBatch",
          exportXlsUrl: "store/storeSeriesAdvertising/exportXls",
          importExcelUrl: "store/storeSeriesAdvertising/importExcel",
      getStoreSeriesManageAll:"store/storeSeriesManage/getStoreSeriesManageAll",
      updateStatus:"store/storeSeriesAdvertising/updateStatus"
       },
        treeData:[],
        storeSeriesManageId:''
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    created(){
      this.getStoreSeriesManageAll();
    },
    methods: {
      updateStatus(id){
        getAction(this.url.updateStatus, {id:id}).then((res) => {

          if (res.success) {
            this.modalFormOk();
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      getImgUrl(url){
        return window._CONFIG['imgDomainURL']+'/'+url;
      },
      handleAddClick(){
        if(!this.storeSeriesManageId){
          this.$message.warning('请先选择系列');
          return;
        }
        this.handleEdit({storeSeriesManageId:this.storeSeriesManageId});
      },
      selectClick(selectedKeys, e){
        console.log(selectedKeys,'======',e);
        this.url.list=encodeURI("/store/storeSeriesAdvertising/list?superQueryParams=[{'field':'storeSeriesManageId','rule':'eq','val':'"+selectedKeys[0]+"'}]&column=createTime&order=desc");
        this.modalFormOk();
        this.storeSeriesManageId=selectedKeys[0];
      },
      getStoreSeriesManageAll(){
        getAction(this.url.getStoreSeriesManageAll, {}).then((res) => {

          if (res.success) {
            console.log(res.result);
            this.treeData=[];
            for (let t of res.result) {
              t.key=t.id;
              t.title=t.seriesName;
             if(t.hasChild==0){
               this.treeData.push(t);
             }
            }
          } else {
            this.$message.warning(res.message);
          }
        });
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>