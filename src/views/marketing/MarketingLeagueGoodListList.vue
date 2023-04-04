<template>

  <div style="width: 100%">
    <a-row :gutter="10" >
      <a-col :span="4">
        <a-card :bordered="false" style="min-height: 700px">
          <a-row>
            <a-col style="margin-bottom: 10px">
          <a-input-search placeholder="请输入" @search="onSearch" enterButton />
            </a-col>
            <a-col style="margin-bottom: 10px" :key="item.id" v-for="item in marketingLeagueTypeList">
              <a v-if="indexId==item.id" style="font-weight:bold;color: #1890ff" >{{item.typeName}}</a>
              <a v-else style="font-weight:bold;color:#000000" @click="marketingLeagueTypeClick(item)">{{item.typeName}}</a>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :bordered="false" style="min-width: 1400px;min-height: 700px">

          <!-- 查询区域 -->
          <div class="table-page-search-wrapper" >
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
                    <a-form-item label="商品id">
                      <a-input placeholder="请输入商品id" v-model="queryParam.goodListId"></a-input>
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
            <a-button @click="toAdd" type="primary" icon="plus">新增</a-button>
        <!--    <a-button type="primary" icon="download" @click="handleExportXls('加盟专区-商品列表')">导出</a-button>
            <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
              <a-button type="primary" icon="import">导入</a-button>
            </a-upload>
            <a-dropdown v-if="selectedRowKeys.length > 0">
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
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
              :scroll="{x:2000}"
              @change="handleTableChange">

              <template slot="picture" slot-scope="text, record, index">
                <img
                  preview="1"
                  :src="getImgShop(text)"
                  alt=""
                  style="width: 50px;height: 50px;display: inline-block;vertical-align: middle"
                />
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
          <marketingLeagueGoodList-modal ref="modalForm" @ok="modalFormOk"></marketingLeagueGoodList-modal>
        </a-card>
      </a-col>
    </a-row>
  </div>




</template>

<script>
  import MarketingLeagueGoodListModal from './modules/MarketingLeagueGoodListModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ARow from 'ant-design-vue/es/grid/Row'
  import ACol from 'ant-design-vue/es/grid/Col'
  import {getAction} from '@/api/manage';

  export default {
    name: "MarketingLeagueGoodListList",
    mixins:[JeecgListMixin],
    components: {
      ACol,
      ARow,
      MarketingLeagueGoodListModal
    },
    data () {
      return {
        description: '加盟专区-商品列表管理页面',
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
            title: '商品编号',
            align:"center",
            dataIndex: 'goodNo'
           },
          {
            title: '商品图片',
            dataIndex: 'mainPicture',
            align: 'center',
            key: 'picture',
            scopedSlots: { customRender: 'picture' }
          },
          {
            title: '商品名称',
            dataIndex: 'goodName',
            key: 'goodName',
            align: 'center',
            width: 220
          },
          {
            title: '商品分类',
            dataIndex: 'goodTypeName',
            key: 'goodTypeName',
            align: 'center',
            width: 150
          },
          {
            title: '库存',
            dataIndex: 'repertory',
            align: 'center',
            key: 'repertory'
          },
          {
            title: '市场价',
            dataIndex: 'marketPrice',
            align: 'center',
            key: 'marketPrice'
          },
          {
            title: '销售价',
            dataIndex: 'price',
            key: 'price',
            align: 'center'
          },
          {
            title: '活动价',
            dataIndex: 'leaguePriceEnd',
            key: 'leaguePriceEnd',
            align: 'center'
          },
          {
            title: '加入时间',
            dataIndex: 'createTime',
            key: 'createTime',
            align: 'center'
          },
		   {
            title: '排序',
            align:"center",
            dataIndex: 'sort'
           },
		   {
            title: '状态',
            align:"center",
            dataIndex: 'status',
         customRender:function(text) {
           if(text==0){
             return "停用";
           }
           if(text==1){
             return "启用";
           }
         }
           },
		   {
            title: '状态说明',
            align:"center",
            dataIndex: 'statusExplain'
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
          list: "/marketing/marketingLeagueGoodList/list",
          delete: "/marketing/marketingLeagueGoodList/delete",
          deleteBatch: "/marketing/marketingLeagueGoodList/deleteBatch",
          exportXlsUrl: "marketing/marketingLeagueGoodList/exportXls",
          importExcelUrl: "marketing/marketingLeagueGoodList/importExcel",
          getMarketingLeagueTypeAll:"/marketing/marketingLeagueType/getMarketingLeagueTypeAll",
          getMarketingLeagueTypeByTypeName:"/marketing/marketingLeagueType/getMarketingLeagueTypeByTypeName"
       },
        marketingLeagueTypeList:[],
        indexId:""
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    created(){
      this.getMarketingLeagueTypeAll();
    },
    methods: {
      getMarketingLeagueTypeAll(){
        getAction(this.url.getMarketingLeagueTypeAll, {}).then((res) => {

          if (res.success) {
            this.marketingLeagueTypeList=res.result;
            console.log(this.marketingLeagueTypeList);
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      onSearch(e){
        getAction(this.url.getMarketingLeagueTypeByTypeName, {typeName:e}).then((res) => {

          if (res.success) {
            this.marketingLeagueTypeList=res.result;
            console.log(this.marketingLeagueTypeList);
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      marketingLeagueTypeClick(record){
        this.url.list="/marketing/marketingLeagueGoodList/list?marketingLeagueTypeId="+record.id;
        this.indexId=record.id;
        this.modalFormOk();
      },
      toAdd() {
        if(!this.indexId){
          this.$message.warn("请先选择一个专区");
          return;
        }
        this.$router.push({
          path: '/marketing/modules/AddMarketingLeagueChargeModel?marketingLeagueTypeId='+this.indexId
        })
      },
      getImgShop(text){
        return window._CONFIG['imgDomainURL']+'/'+JSON.parse(text)[0];
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>