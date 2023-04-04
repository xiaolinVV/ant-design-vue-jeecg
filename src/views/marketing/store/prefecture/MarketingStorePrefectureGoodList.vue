<template>
  <a-row :gutter="10" >
    <a-col :span="4">
      <a-card title="店铺列表" :bordered="false" style="min-height: 1000px">
        <store-tree @ok="getSelectStore"></store-tree>
      </a-card>
    </a-col>

    <a-col :span="4">
      <a-card title="专区列表" :bordered="false" style="min-height: 1000px">
        <store-prefecture-tree ref="storePrefectureTree" @ok="getSelectPrefecture"></store-prefecture-tree>
      </a-card>
    </a-col>


    <a-col :span="16">



      <a-card :bordered="false" style="min-height: 1000px">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="商品名称">
              <a-input placeholder="请输入商品名称" v-model="queryParam.goodName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select model="queryParam.status">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="0">停用</a-select-option>
                <a-select-option value="1">启用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">
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
      <a-button @click="handleAdd" type="primary" icon="plus">加入</a-button>
<!--      <a-button type="primary" icon="download" @click="handleExportXls('店铺专区商品')">导出</a-button>
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
        :scroll="{x:1400}"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="mainPicture" slot-scope="text,record,index">
          <img class="clickShowImage " :preview="'mainPicture' + index" :src="getImgView(JSON.parse(text)[0])" alt="" />
        </template>

        <template slot="status" slot-scope="text,record">
          <a-popconfirm v-if="text==0" title="确定启用吗?" @confirm="() => updateStatus(record)">
            <a>停用</a>
          </a-popconfirm>
          <a-popconfirm v-if="text==1" title="确定停用吗?" @confirm="() => updateStatus(record)">
            <a>启用</a>
          </a-popconfirm>
        </template>
        <span slot="action" slot-scope="text, record">
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>

          <!--<a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
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
    <marketingStorePrefectureGood-modal ref="modalForm" @ok="modalFormOk"></marketingStorePrefectureGood-modal>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
  import MarketingStorePrefectureGoodModal from './modules/MarketingStorePrefectureGoodModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import StoreTree from'../../../common/StoreTree/StoreTree'
  import StorePrefectureTree from'../prefecture/common/StorePrefectureTree'
  import {getAction} from '@/api/manage';
  import JDate from '@/components/jeecg/JDate'


  export default {
    name: "MarketingStorePrefectureGoodList",
    mixins:[JeecgListMixin],
    components: {
      MarketingStorePrefectureGoodModal,
      StoreTree,
      StorePrefectureTree,
      JDate
    },
    data () {
      return {
        description: '店铺专区商品管理页面',
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
            title: '店铺名称',
            align:"center",
            dataIndex: 'storeName'
           },
		   {
            title: '专区名称',
            align:"center",
            dataIndex: 'prefectureName'
           },
		   {
            title: '商品名称',
            align:"center",
            dataIndex: 'goodName'
           },
          {
            title: '商品图片',
            align:"center",
            dataIndex: 'mainPicture',
            scopedSlots:{customRender:'mainPicture'}
          },
          {
            title: '规格',
            align:"center",
            dataIndex: 'isSpecification',
            customRender(text){
              if(text==0){
                return '无';
              }
              if(text==1){
                return '有';
              }
            }
          },
          {
            title: '专区价格',
            align:"center",
            dataIndex: 'specifications',
            customRender(text){
              let minPirce=0;
              let maxPrice=0;
              for (let m of JSON.parse(text)){
                if(minPirce==0){
                  minPirce=m.activePrice;
                }
                if(minPirce>m.activePrice){
                  minPirce=m.activePrice;
                }
                if(maxPrice<m.activePrice){
                  maxPrice=m.activePrice;
                }
              }
              if(minPirce==maxPrice){
                return minPirce;
              }else{
                return minPirce+'-'+maxPrice;
              }
            }
          },
          {
            title: '库存',
            align:"center",
            dataIndex: 'repertory'
          },
          {
            title: '状态',
            align:"center",
            dataIndex: 'status',
            scopedSlots:{customRender:'status'}
          },
          {
            title: '创建时间',
            align:"center",
            dataIndex: 'createTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:"150px",
            fixed:'right',
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/marketing.store.prefecture/marketingStorePrefectureGood/list",
          delete: "/marketing.store.prefecture/marketingStorePrefectureGood/delete",
          deleteBatch: "/marketing.store.prefecture/marketingStorePrefectureGood/deleteBatch",
          exportXlsUrl: "marketing.store.prefecture/marketingStorePrefectureGood/exportXls",
          importExcelUrl: "marketing.store.prefecture/marketingStorePrefectureGood/importExcel",
      updateStatus:"marketing.store.prefecture/marketingStorePrefectureGood/updateStatus"
       },
        storeInfo:{},
        prefectureInfo:{}
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
      updateStatus(record){
        getAction(this.url.updateStatus, {marketingStorePrefectureGoodId: record.id}).then((res) => {


          if (res.success) {
            this.$message.warning(res.message);
            this.modalFormOk();
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      getSelectStore(e){
        this.storeInfo=e;
        this.prefectureInfo={};
        this.$refs.storePrefectureTree.init(this.storeInfo.key);
      },
      getSelectPrefecture(e){
        this.prefectureInfo=e;
        this.url.list="/marketing.store.prefecture/marketingStorePrefectureGood/list?marketingStorePrefectureListId="+this.prefectureInfo.key;
        this.modalFormOk();
      },
      handleAdd(){
        if(!this.prefectureInfo.key){
          this.$message.warning('请先选择左侧专区');
          return;
        }
        this.$refs.modalForm.add(this.prefectureInfo,this.storeInfo);
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>