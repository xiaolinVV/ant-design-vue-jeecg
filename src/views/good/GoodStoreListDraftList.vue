<template>
  <a-card :bordered="false">

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
            <a-form-item label="商品编号">
              <a-input placeholder="请输入" v-model="queryParam.goodNo"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-form-item
              style="display: flex;"
              label="商品分类">

              <a-select v-model="queryParam.goodStoreTypeIdOne"    placeholder="请选择"  @change="chooseMedicine"   style="width:100px;margin-right: 10px;">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in listGoodType" :value="item.id"   >{{ item.name }}</a-select-option>
              </a-select>

              <a-select v-model="queryParam.goodStoreTypeIdTwo"  placeholder="请选择"   style="width:100px;margin-right: 10px;" ><!--v-model="id"-->
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in listGoodType1"   :value="item.id">{{ item.name }}</a-select-option><!--:defaultValue="listGoodType1.length>0?listGoodType1[0].name : ''"-->
              </a-select><!--@change="chooseMedicine1"-->
              <!-- <a-select v-model="queryParam.goodTypeIdThreeLevel"   placeholder="请选择"   style="width:100px;margin-right: 10px;">
                 <a-select-option v-for="item in listGoodType2"   :value="item.id" >{{ item.name }}</a-select-option>&lt;!&ndash;:defaultValue="listGoodType2.length>0?listGoodType2[0].name : ''"&ndash;&gt;
               </a-select>-->
            </a-form-item>
            <a-col :md="6" :sm="8">
              <a-form-item label="供应商">
                <a-input placeholder="请输入" v-model="queryParam.sysUserId"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="上下架">
                <a-select v-model="queryParam.frameStatus" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">下架</a-select-option>
                  <a-select-option :value="1">上架</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="审核状态">
                <a-select v-model="queryParam.auditStatus" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">草稿</a-select-option>
                  <a-select-option :value="1">待审核</a-select-option>
                  <a-select-option :value="2">审核通过</a-select-option>
                  <a-select-option :value="3">审核不通过</a-select-option>
                </a-select>

              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="状态">
                <a-select v-model="queryParam.Status" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">停用</a-select-option>
                  <a-select-option :value="1">启用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">

              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="活动">
                <j-dict-select-tag v-model="queryParam.activitiesType" placeholder="请选择" dictCode="activities_type"/>
              </a-form-item>
            </a-col>
            <!--时间选择框-->
            <a-col :md="6" :sm="8">
              <a-form-item label="创建时间">
                <a-range-picker
                  style="width: 210px"
                  v-model="queryParam.createTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                  @ok="onDateOk"
                />
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
     <!-- <a-button type="primary" icon="download" @click="handleExportXls('商品列表')">导出</a-button>
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
    <div style="">
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{x:2500}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="mainPicture" slot-scope="text, record, index">
          <img class="clickShowImage" v-if="record.mainPicture != undefined " :preview="'mainPicture' + index" :src="getAvatarView(JSON.parse(record.mainPicture)[0])" alt=""/>
          <a-avatar shape="square" v-if="record.mainPicture == undefined || record.mainPicture ==''  " :src="getAvatarView(record.mainPicture)" icon="user"/>
        </template>
        <template slot="frameStatus" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.frameStatus==0" >下架</span>
            <span shape="square" v-if="record.frameStatus==1" >上架</span>
          </div>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status==0" >停用</span>
            <span shape="square" v-if="record.status==1" >启用</span>
          </div>
        </template>
        <template slot="storeName" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square"  >{{ record.storeName }}</span>
            <span shape="square" v-if="record.subStoreName"> ( {{ record.subStoreName }} )</span>
          </div>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status==0" >停用</span>
            <span shape="square" v-if="record.status==1" >启用</span>
          </div>
        </template>
        <template slot="auditStatus" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.auditStatus==0" >草稿</span>
            <span shape="square" v-if="record.auditStatus==1" >待审核</span>
            <span shape="square" v-if="record.auditStatus==2" >审核通过</span>
            <span shape="square" v-if="record.auditStatus==3" >审核不通过</span>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
        <a @click="handleDelete(record.id)" >删除</a>

        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <goodStoreList-modal ref="modalForm" @ok="modalFormOk"></goodStoreList-modal>
  </a-card>
</template>

<script>
  import GoodStoreListModal from './modules/GoodStoreListModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction } from '@/api/manage'
  import {deleteAction} from '@/api/manage';
  import JDate from '@/components/jeecg/JDate'

  export default {
    name: "GoodStoreListList",
    mixins:[JeecgListMixin],
    components: {
      GoodStoreListModal,
      JDate
    },
    data () {
      return {
        description: '店铺商品列表管理页面',
        listGoodType:[],
        parentId:"",
        listGoodType1:[],
        listGoodType2:[],

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
            title: '商品图片',//相对地址（以json的形式存储多张）
            align:"center",
            dataIndex: 'mainPicture',
            scopedSlots: {customRender: "mainPicture"}
          },
          {
            title: '商品编号',
            align:"center",
            dataIndex: 'goodNo'
          },
          {
            title: '商品名称',
            align:"center",
            dataIndex: 'goodName'
          },
          {
            title: '商品分类',
            align:"center",
            dataIndex: 'goodStoreTypeNames'
          },
          {
            title: '市场价',
            align:"center",
            dataIndex: 'marketPrice'
          },
          {
            title: '销售价',
            align:"center",
            dataIndex: 'price'
          },
          {
            title: '会员价',//，按照利润比例，根据数据字段设置的比例自动填入
            align:"center",
            dataIndex: 'vipPrice'
          },
          {
            title: '成本价',
            align:"center",
            dataIndex: 'costPrice'
          },

          {
            title: '库存',
            align:"center",
            dataIndex: 'repertory'
          },
          {
            title: '店铺',
            align:"center",
            dataIndex: 'storeName',
            scopedSlots: {customRender: "storeName"}
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
            title: '更新者',
            align:"center",
            dataIndex: 'updateBy'
          },
          {
            title: '更新时间',
            align:"center",
            dataIndex: 'updateTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed: 'right',
            width:300,
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
      list: "/goodStoreList/goodStoreList/GoodStoreDraftListList",
      delete: "/goodStoreList/goodStoreList/delete",
      deleteBatch: "/goodStoreList/goodStoreList/deleteBatch",
      imgerver: window._CONFIG['domianURL'] + "/sys/common/view",
      exportXlsUrl: "/goodStoreList/goodStoreList/exportXls",
      importExcelUrl: "/goodStoreList/goodStoreList/importExcel",
      getgoodTypeListcascade:"/GoodStoreType/goodStoreType/getgoodStorTypeListcascade",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    mounted() {
      this.goodTypeListcascade('0')
      console.log('zhixingle')
      // console.log("this.dataSource",this.dataSource)
      if(this.$route.query.isrush){
        console.log('zhixingle')
        // location.reload()

        // this.Rush2()
      }
    },
    methods: {
      getAvatarView: function (mainPicture) {
        return this.url.imgerver + "/" + mainPicture;
      },
      handleEdit(record){

        //路由跳转
        localStorage.setItem('GoodListListInfo',JSON.stringify(record))
        this.$router.push({ path: '/good/modules/GoodListadd2' ,query:{reusePage:3}})
      },
      handleAdd(){
        //路由跳转
        localStorage.removeItem('GoodListListInfo')
        this.$router.push({ path: '/good/modules/GoodStoreListadd',query:{reusePage:3}})
      },
      handleDelete: function (id) {
        if (!this.url.delete) {
          this.$message.error("请设置url.delete属性!")
          return
        }
        var that = this;
        this.$confirm({
          title: "删除商品后，该商品用户将无法搜索、浏览、购买，可以在回收站找回",
          content: "您确定要删除吗？",
          onOk: function() {
            deleteAction(that.url.delete, { id: id }).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.loadData();
              } else {
                that.$message.warning(res.message);
              }
            });
          }
        });

      },
      //分类搜索
      goodTypeListcascade (parentId){
        let that = this;
        that.listGoodType1=[];
        that.listGoodType2=[];
        getAction(that.url.getgoodTypeListcascade, {parentId: parentId}).then((res) => {

          if (res.success) {
            that.listGoodType=res.result.listGoodStorType
            //that.$message.success(res.message);
            //  console.log("res.message===="+res.result.listGoodType[0].id)

          } else {
            that.$message.warning(res.message);
          }
        });
      },
      chooseMedicine:function(value){
        console.log("parentId1111111111"+value)
        let that = this;
        //console.log("parentId1111111111"+value)
        that.listGoodType1="";
        that.listGoodType2="";
        getAction(that.url.getgoodTypeListcascade, {parentId:value}).then((res) => {
          if (res.success) {
            that.listGoodType1=res.result.listGoodStorType

            console.log(that.listGoodType1)
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      chooseMedicine1:function (value) {

        console.log("parentId2222"+value)
        let that = this;
        that.listGoodType2=[];
        getAction(that.url.getgoodTypeListcascade, { parentId: value}).then((res) => {
          if (res.success) {
            that.listGoodType2=res.result.listGoodStorType

            console.log(that.listGoodType2)
          } else {
            that.$message.warning(res.message);
          }
        });
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
 /* .ant-table-wrapper {
    width: 3000px;
    !*overflow-x: scroll !important;*!
  }*/
</style>