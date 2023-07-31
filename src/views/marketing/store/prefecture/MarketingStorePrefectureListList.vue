<template>
  <a-row :gutter="10" >
    <a-col :span="4">
      <a-card :bordered="false" style="min-height: 800px">
        <store-tree @ok="getSelectStore"></store-tree>
      </a-card>
    </a-col>
    <a-col :span="8">



      <a-card :bordered="false" style="min-width: 1400px;min-height: 800px">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="专区名称">
              <a-input placeholder="请输入专区名称" v-model="queryParam.prefectureName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="类型">
              <a-select model="queryParam.prefectureType">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="0">普通专区</a-select-option>
                <a-select-option value="1">限购专区</a-select-option>
                <a-select-option value="2">赠送专区</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">
        <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select model="queryParam.status">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="0">停用</a-select-option>
                <a-select-option value="1">启用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="10" :sm="12">
            <a-form-item label="创建时间" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <j-date v-model="queryParam.createTime_begin" :showTime="true" date-format="YYYY-MM-DD HH:mm:ss" style="width:45%" placeholder="请选择开始时间" ></j-date>
              <span style="width: 10px;">~</span>
              <j-date v-model="queryParam.createTime_end" :showTime="true" date-format="YYYY-MM-DD HH:mm:ss" style="width:45%" placeholder="请选择结束时间"></j-date>
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
      <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('店铺专区')">导出</a-button>
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

        <template slot="icon" slot-scope="text,record,index">
          <img class="clickShowImage " :preview="'icon' + index" :src="getImgView(JSON.parse(text)[0])" alt="" />
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
    <marketingStorePrefectureList-modal ref="modalForm" @ok="modalFormOk"></marketingStorePrefectureList-modal>
  </a-card>
    </a-col>
  </a-row>
</template>

<script>
  import MarketingStorePrefectureListModal from './modules/MarketingStorePrefectureListModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import StoreTree from'../../../common/StoreTree/StoreTree'
  import JDate from '@/components/jeecg/JDate'

  export default {
    name: "MarketingStorePrefectureListList",
    mixins:[JeecgListMixin],
    components: {
      MarketingStorePrefectureListModal,
      StoreTree,
      JDate
    },
    data () {
      return {
        description: '店铺专区管理页面',
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
            title: '专区名称',
            align:"center",
            dataIndex: 'prefectureName'
          },
		   {
            title: '图标',
            align:"center",
            dataIndex: 'icon',
         scopedSlots:{customRender:'icon'}
           },
		   {
            title: '专区类型',
            align:"center",
            dataIndex: 'prefectureType',
         customRender(text){
              if(text==0){
                return '普通专区';
              }
           if(text==1){
             return '限购专区';
           }
           if(text==2){
             return '赠送专区';
           }
         }
           },
		   {
            title: '限制',
            align:"center",
            dataIndex: 'astrict',
         customRender(text,record){

              if(record.prefectureType==1){
                let m=JSON.parse(text);
                return '每'+m.time+(m.model==0?'天':'月')+'可使用专区购买资格购买本专区商品'+'【'+(m.isBuy.length==1?'经销商不限购':'限制经销商购买')+'】';
              }
           return '--';
         }
           },
		   {
            title: '赠送',
            align:"center",
            dataIndex: 'give',
         customRender(text,record){

           if(record.prefectureType==2){
             let m=JSON.parse(text);
             return '赠送：'+m.prefectureName+'专区购买资格'+m.totalTimes+'次';
           }
           return '--';
         }
           },
		   {
            title: '店铺名称',
            align:"center",
            dataIndex: 'storeName'
           },
          {
            title: '创建时间',
            align:"center",
            dataIndex: 'createTime'
          },
          {
            title: '创建人',
            align:"center",
            dataIndex: 'createBy'
          },
		   {
            title: '状态',
            align:"center",
            dataIndex: 'status',
         customRender(text){
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
          list: "/marketing.store.prefecture/marketingStorePrefectureList/list",
          delete: "/marketing.store.prefecture/marketingStorePrefectureList/delete",
          deleteBatch: "/marketing.store.prefecture/marketingStorePrefectureList/deleteBatch",
          exportXlsUrl: "marketing.store.prefecture/marketingStorePrefectureList/exportXls",
          importExcelUrl: "marketing.store.prefecture/marketingStorePrefectureList/importExcel",
       },
        storeInfo:{}
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
      getSelectStore(e){
        this.storeInfo=e;
        this.ipagination.current = 1;
        this.url.list="/marketing.store.prefecture/marketingStorePrefectureList/list?storeManageId="+this.storeInfo.key;
        this.modalFormOk();
      },
      handleAdd(){
        if(!this.storeInfo.key){
          this.$message.warning('请先选择左侧商户');
          return;
        }
        this.$refs.modalForm.add(this.storeInfo);
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>