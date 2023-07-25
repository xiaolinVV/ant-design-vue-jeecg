<template>
  <a-row :gutter="10" >
    <a-col :span="4">
      <a-card title="店铺列表" :bordered="false" style="min-height: 1000px">
        <store-tree @ok="getSelectStore"></store-tree>
      </a-card>
    </a-col>
    <a-col :span="4">
      <a-card title="分类列表" :bordered="false" style="min-height: 1000px">
        <div v-if="goodTypeTree.length==0&&storeInfo.key">
          该店铺没有商品分类
        </div>
        <div v-if="goodTypeTree.length==0&&!storeInfo.key">
          请选择左侧店铺信息
        </div>
        <a-tree
          v-if="goodTypeTree.length>0"
          :tree-data="goodTypeTree"
        >
          <template #title="{name,id,level}">
            <span v-if="id === ''" style="color: #1890ff"><div @click="getByGoodType(id,level)">{{ name }}</div></span>
            <template v-else ><div @click="getByGoodType(id,level)">{{ name }}</div></template>
          </template>
        </a-tree>
      </a-card>
    </a-col>
    <a-col :span="16">



      <a-card :bordered="false" style="min-height: 800px">

        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter="24">

              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="商品编号">
                  <a-input placeholder="请输入商品编号" v-model="queryParam.goodNo"></a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="商品名称">
                  <a-input placeholder="请输入商品名称" v-model="queryParam.goodName"></a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="状态">
                  <a-select v-model="queryParam.status" placeholder="请选择状态">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="0">停用</a-select-option>
                    <a-select-option value="1">启用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="上下架状态">
                  <a-select v-model="queryParam.frameStatus" placeholder="请选择状态">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="0">下架</a-select-option>
                    <a-select-option value="1">上架</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!--  <a @click="handleToggleSearch" style="margin-left: 8px">
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
          <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('平台商品列表')">导出</a-button>
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
            :scroll="{x:2000}"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            @change="handleTableChange">

            <template slot="mainPicture" slot-scope="text,record,index">
              <img  :preview="'mainPicture' + index" :src="getImg(text)" style="width: 40px;height: 40px">
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
        <good-store-list-modal ref="modalForm" @ok="modalFormOk"></good-store-list-modal>
      </a-card>
    </a-col>


  </a-row>

</template>

<script>
  import GoodStoreListModal from './modules/GoodStoreListModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {getAction} from '@/api/manage';
  import StoreTree from'../common/StoreTree/StoreTree'
  export default {
    name: "GoodStoreListList",
    mixins:[JeecgListMixin],
    components: {
      GoodStoreListModal,
      StoreTree
    },
    data () {
      return {
        description: '店铺商品列表管理页面',
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
            dataIndex: 'storeName',
          },
          {
            title: '商品类型',
            align:"center",
            dataIndex: 'goodTypeName',
          },
          {
            title: '商品主图',
            align:"center",
            dataIndex: 'mainPicture',
            scopedSlots:{customRender:'mainPicture'}
          },
          {
            title: '商品编号',
            align:"center",
            dataIndex: 'goodNo',
            customRender(text){
              if(!text){
                return '-';
              }
              return text;
            }
          },
          {
            title: '商品名称',
            align:"center",
            dataIndex: 'goodName'
          },
          {
            title: '市场价',
            align:"center",
            dataIndex: 'marketPrice'
          },
          {
            title: '成本价',
            align:"center",
            dataIndex: 'minCostPrice',
            customRender(text,record){
              if(record.minCostPrice==record.maxCostPrice){
                return text;
              }else{
                return text+"-"+record.maxCostPrice;
              }
            }
          },
          {
            title: '销售价',
            align:"center",
            dataIndex: 'minPrice',
            customRender(text,record){
              if(record.minPrice==record.maxPrice){
                return text;
              }else{
                return text+"-"+record.maxPrice;
              }
            }
          },
          {
            title: '会员价',
            align:"center",
            dataIndex: 'minVipPrice',
            customRender(text,record){
              if(record.minVipPrice==record.maxVipPrice){
                return text;
              }else{
                return text+"-"+record.maxVipPrice;
              }
            }
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
            title: '上下架状态',
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
            title: '审核状态',
            align:"center",
            dataIndex: 'auditStatus',
            customRender(text){
              if(text==0){
                return '草稿';
              }
              if(text==1){
                return '待审核';
              }
              if(text==2){
                return '审核通过';
              }
              if(text==3){
                return '审核不通过';
              }
            }
          },
          {
            title: '状态说明',
            align:"center",
            dataIndex: 'statusExplain',
            customRender(text){
              if(!text){
                return '-';
              }
              return text;
            }
          },
          {
            title: '有无规格',
            align:"center",
            dataIndex: 'isSpecification',
            customRender(text){
              if(text==0){
                return '无规格';
              }
              if(text==1){
                return '有规格';
              }
            }
          },
          {
            title: '销量',
            align:"center",
            dataIndex: 'salesVolume'
          },
          {
            title: '创建者',
            align:"center",
            dataIndex: 'createBy'
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
          list: "/goodStoreList/goodStoreList/listNew",
          delete: "/goodStoreList/goodStoreList/delete",
          deleteBatch: "/goodStoreList/goodStoreList/deleteBatch",
          exportXlsUrl: "goodStoreList/goodStoreList/exportXls",
          importExcelUrl: "goodStoreList/goodStoreList/importExcel",
          getStoreGoodTypeByTree:"GoodStoreType/goodStoreType/getStoreGoodTypeByTree"
        },
        goodTypeTree:[],
        goodTypeParam:{},
        storeInfo:{
          key:''
        }

      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    created(){

    },
    methods: {
      getSelectStore(e){
        this.storeInfo=e;
        this.getStoreGoodTypeByTree();
      },
      handleAdd(){
        if(!this.storeInfo.key){
          this.$message.warning('请先选择左侧店铺信息');
          return;
        }
        this.$refs.modalForm.add(this.goodTypeParam,this.storeInfo);
      },
      getByGoodType(id,level){
        console.log(id,'----',level);
        this.url.list="/goodStoreList/goodStoreList/listNew?typeId="+id+"&level="+level;
        this.goodTypeParam={
          id:id,
          level:level
        },
          this.modalFormOk();
      },
      getStoreGoodTypeByTree(){
        getAction(this.url.getStoreGoodTypeByTree, {
          storeManageId:this.storeInfo.key
        }).then((res) => {

          if (res.success) {
            this.goodTypeTree=res.result;
            console.log(this.goodTypeTree);
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      getImg(text){
        return window._CONFIG['imgDomainURL']+'/'+JSON.parse(text)[0];
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>