<template>
  <a-row :gutter="10" >
    <a-col :span="4" v-if="isOpenGoodtype">
      <a-card :bordered="false" style="min-height: 1000px">
        <a-tree
          v-if="goodTypeTree.length>1"
          :tree-data="goodTypeTree"
        >
          <template #title="{name,id,level}">
            <span v-if="id === ''" style="color: #1890ff"><div @click="getByGoodType(id,level)">{{ name }}</div></span>
            <template v-else ><div @click="getByGoodType(id,level)">{{ name }}</div></template>
          </template>
        </a-tree>
      </a-card>
    </a-col>
    <a-col :span="isOpenGoodtype?20:30">



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
                  <j-input placeholder="请输入商品名称" v-model="queryParam.goodName"></j-input>
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
          <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('平台商品列表')">导出</a-button>
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
              <a @click='changeSort(record)'>排序</a>
              <a-divider type="vertical" />
              <a @click="showModal(record.id)">改价格</a>
              <a-divider type="vertical"/>
               <a @click="showModalRepertory(record.id)">改库存</a>
              <a-divider type="vertical"/>
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical"/>
              <a v-if="record.status==1" @click="showModalStopStatus(record.id,'0')">停用</a>
              <a v-if="record.status==0" @click="updateStatus(record.id,'1')">启用</a>
              <a-divider type="vertical"/>
               <a v-if="record.frameStatus==0" @click="updateFrameStatus(record.id,'1')">上架</a>
               <a v-if="record.frameStatus==1" @click="showModalFrameStatus(record.id,'0')">下架</a>
              <a-divider type="vertical"/>
               <a @click="copyAddress(record.id)">复制地址</a>
              <a-divider type="vertical"/>
               <a @click="showModalDelete(record.id)">删除</a>
              <!-- <a-divider type="vertical" />
               <a @click="handleEdit(record)">预览</a>-->
        </span>

          </a-table>
        </div>
        <!-- table区域-end -->
        <!-- 表单区域 -->
        <goodList-modal ref="modalForm" @ok="modalFormOk"></goodList-modal>
        <good-list-price-modal ref="modalForm1" @ok="modalFormOk"></good-list-price-modal>
        <clientModal ref='clientModal' @ok="clientModalOk"></clientModal>
        <!--复制内容-->
        <input id="duplicateContent" style="display: none"></input>


        <!--批量下架提示框弹出-->
        <a-modal :title="title" v-model="allVisibleFrameStatus" @ok="allHideModalFrameStatus()" @cancel="handleCancel()"
                 okText="确认" cancelText="取消">
          <!--<input style="display: none"  :value="goodListId2"  placeholder="id"/>-->
          <!--<h3>下架商品后，该商品用户将无法搜索、浏览、购买</h3>-->
          <!--<p>您确定要下架吗？</p>-->
          <div v-html="explain"></div>
          <a-textarea
            :placeholder="hint"
            v-model="allFrameExplain"
            :autosize="{ minRows: 3, maxRows: 6 }"
          />
        </a-modal>
      </a-card>
    </a-col>


  </a-row>

</template>

<script>
  import GoodListModal from './modules/GoodListModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import GoodListPriceModal from './modules/GoodListPriceModal'
  import {getAction} from '@/api/manage';
  import JDate from '@/components/jeecg/JDate'
  import { filterObj } from '@/utils/util'
  import clientModal from '@/components/popUp/clientChangeModal'

  export default {
    name: "GoodListList",
    mixins:[JeecgListMixin],
    components: {
      GoodListModal,
      GoodListPriceModal,
      JDate,
      clientModal
    },
    data () {
      return {
        description: '平台商品列表管理页面',
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
            title: '供货价',
            align:"center",
            dataIndex: 'minSupplyPrice',
            customRender(text,record){
              if(record.minSupplyPrice==record.maxSupplyPrice){
                return text;
              }else{
                return text+"-"+record.maxSupplyPrice;
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
            width:"380px",
            fixed:'right',
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          updateFrameStatus:"goodList/goodList/updateFrameStatus",
          list: "/goodList/goodList/list",
          delete: "/goodList/goodList/delete",
          deleteBatch: "/goodList/goodList/deleteBatch",
          exportXlsUrl: "goodList/goodList/exportXls",
          importExcelUrl: "goodList/goodList/importExcel",
          getGoodTypeByTree:"goodType/goodType/getGoodTypeByTree",
          queryByOne:"good/goodSetting/queryByOne",
        },
        goodTypeTree:[],
        goodTypeParam:{},
        /*是否开启分类*/
        isOpenGoodtype:false,
        goodSetting:{}
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    created(){
     this.queryByOne();
    },
    methods: {
      handleAdd(){
        this.$refs.modalForm.add(this.goodTypeParam,this.goodSetting);
      },
      handleEdit(record){
        this.$refs.modalForm.edit(record,this.goodSetting);
      },
      queryByOne(){
        getAction(this.url.queryByOne, {}).then((res) => {

          if (res.success) {
            this.goodSetting=res.result;
            if(this.goodSetting.openGoodType==0){
              this.isOpenGoodtype=false;
              /*去除表格商品类型头部*/
              this.columns=this.columns.filter(item=>{
                if(item.dataIndex=='goodTypeName'){
                  return false;
                }
                  return true;
              });
            }else{
              this.isOpenGoodtype=true;
              this.getGoodTypeByTree();
            }
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      getByGoodType(id,level){
        console.log(id,'----',level);
        this.url.list="/goodList/goodList/list?typeId="+id+"&level="+level;
        this.goodTypeParam={
          id:id,
          level:level
        },
          this.modalFormOk();
      },
      getGoodTypeByTree(){
        getAction(this.url.getGoodTypeByTree, {}).then((res) => {

          if (res.success) {
            this.goodTypeTree.push({name:'全部分类',id:'',level:-1});
            this.goodTypeTree=this.goodTypeTree.concat(res.result);
            console.log(this.goodTypeTree);
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      //复制地址
      copyAddress(id) {
        let that = this
        that.goodUrl = ''
        let clipBoardContent = ''
        that.getGoodUrlss(id)
      },
      //下架
      showModalFrameStatus(id) {
        this.$refs.modalForm1.showModalFrameStatus(id)
        this.$refs.modalForm1.title = '下架'
        this.$refs.modalForm1.disableSubmit = false
      },
      //删除
      showModalDelete(id) {
        this.$refs.modalForm1.showModalDelete(id)
        this.$refs.modalForm1.title = '删除'
        this.$refs.modalForm1.disableSubmit = false
      },
      getImg(text){
        return window._CONFIG['imgDomainURL']+'/'+JSON.parse(text)[0];
      },
      //批量启用
      BatchStatus: function(status) {
        if (!this.url.updateStatus) {
          this.$message.error('请设置url.updateStatus属性!')
          return
        }
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！')
          return
        } else {
          var ids = ''
          for (var a = 0; a < this.selectedRowKeys.length; a++) {
            ids += this.selectedRowKeys[a] + ','
          }
          var that = this
          this.$confirm({
            title: '批量启用商品后，这些商品用户将可以搜索、浏览、购买，供应商可以上下架',
            content: '您确定要批量启用吗？',
            onOk: function() {
              getAction(that.url.updateStatus, { ids: ids, status: status, statusExplain: '' }).then((res) => {
                if (res.success) {
                  that.$message.success(res.message)
                  that.loadData()
                  that.onClearSelected()
                } else {
                  that.$message.warning(res.message)
                }
              })
            }
          })
        }
      },
      //启用
      updateStatus: function(id, status) {
        //this.stopRemark="";
        if (!this.url.updateStatus) {
          this.$message.error('请设置url.updateFrameStatus属性!')
          return
        }
        var that = this
        this.$confirm({
          title: '启用商品后，该商品用户将可以搜索、浏览、购买，供应商可以上下架',
          content: '您确定要启用吗？',
          onOk: function() {

            getAction(that.url.updateStatus, { ids: id, statusExplain: '', status: status }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })
      },
      //上架
      updateFrameStatus: function(id, FrameStatus) {
        if (!this.url.updateFrameStatus) {
          this.$message.error('请设置url.updateFrameStatus属性!')
          return
        }
        var that = this
        this.$confirm({
          title: '上架商品后，该商品用户将可以搜索、浏览、购买',
          content: '您确定要上架吗？',
          onOk: function() {
            getAction(that.url.updateFrameStatus, {
              ids: id,
              frameStatus: FrameStatus,
              frameExplain: ''
            }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })
      },
      //价格
      showModal(id) {
        this.$refs.modalForm1.showModal(id)
        this.$refs.modalForm1.title = '价格'
        this.$refs.modalForm1.disableSubmit = false
      },
      //对比价链接
      showModalComparisonURL(id, skuUrl) {
        this.$refs.modalForm1.showModalComparisonURL(id, skuUrl)
        this.$refs.modalForm1.title = '对比价链接'
        this.$refs.modalForm1.disableSubmit = false
      },
      //排序
      changeSort(record){
        this.$refs.modalForm1.showModalSort(record)
        this.$refs.modalForm1.title = '排序'
        this.$refs.modalForm1.disableSubmit = false
      },
      //库存
      showModalRepertory(id) {
        this.$refs.modalForm1.showModalRepertory(id)
        this.$refs.modalForm1.title = '库存'
        this.$refs.modalForm1.disableSubmit = false
      },
      //停用
      showModalStopStatus(id) {
        this.$refs.modalForm1.showModalStopStatus(id)
        this.$refs.modalForm1.title = '停用'
        this.$refs.modalForm1.disableSubmit = false
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>