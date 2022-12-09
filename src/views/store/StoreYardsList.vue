<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="编号">
              <a-input placeholder="请输入编号" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
<!--          <a-col :md="6" :sm="8">
            <a-form-item label="创建月">
              <a-input placeholder="请输入创建月" v-model="queryParam.month"></a-input>
            </a-form-item>
          </a-col>-->
  <!--      <template v-if="toggleSearchStatus">
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
          </template>-->
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
<!--              <a @click="handleToggleSearch" style="margin-left: 8px">
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
      <a-button @click="handleAdd" type="primary" icon="plus">批量生成</a-button>
    <!--  <a-button type="primary" icon="download" @click="handleExportXls('店铺码')">导出</a-button>
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

        <template slot="qrCode" slot-scope="text,record,index">
          <img :src="getImgUrl(text)" style="height: 40px;width: 40px" @click="viewQrcode(index)">
        </template>

        <span slot="action" slot-scope="text, record">
           <a @click="storeYardsUpdateModalClick(record)">编辑</a>

          <a-divider type="vertical" />
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <storeYards-modal ref="modalForm" @ok="modalFormOk"></storeYards-modal>

    <!--修改二维码和店铺关联-->
    <store-yards-update-modal ref="storeYardsUpdateModal" @ok="modalFormOk"></store-yards-update-modal>


    <a-modal :visible="previewVisible" :footer="null" @cancel="previewhandleCancel">
      <img  v-if="dataSource.length>0" alt="example" style="width: 100%" :src="getImgUrl(dataSource[viewIndex].qrCode)" />
    </a-modal>

  </a-card>
</template>

<script>
  import StoreYardsModal from './modules/StoreYardsModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import StoreYardsUpdateModal from'./modules/StoreYardsUpdateModal'

  export default {
    name: "StoreYardsList",
    mixins:[JeecgListMixin],
    components: {
      StoreYardsModal,
      StoreYardsUpdateModal
    },
    data () {
      return {
        description: '店铺码管理页面',
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
            title: '二维码',
            align:"center",
            dataIndex: 'qrCode',
         scopedSlots:{customRender:'qrCode'}
           },
		   {
            title: '绑定店铺',
            align:"center",
            dataIndex: 'storeName',
         customRender(text){
              if(text){
                return text;
              }else{
                return '-';
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
          list: "/store/storeYards/list",
          delete: "/store/storeYards/delete",
          deleteBatch: "/store/storeYards/deleteBatch",
          exportXlsUrl: "store/storeYards/exportXls",
          importExcelUrl: "store/storeYards/importExcel",
       },
        previewVisible:false,
        viewIndex:0
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
      previewhandleCancel() {
        this.previewVisible = false;
      },
      viewQrcode(index){
        this.previewVisible = true;
        this.viewIndex=index;
      },
      storeYardsUpdateModalClick(record){
        this.$refs.storeYardsUpdateModal.edit(record);
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>