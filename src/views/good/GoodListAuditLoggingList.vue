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

              <a-select v-model="queryParam.goodTypeIdOne"    placeholder="请选择"  @change="chooseMedicine"   style="width:100px;margin-right: 10px;">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in listGoodType" :value="item.id"   >{{ item.name }}</a-select-option>
              </a-select>

              <a-select v-model="queryParam.goodTypeIdTwo"  placeholder="请选择" @change="chooseMedicine1"  style="width:100px;margin-right: 10px;" ><!--v-model="id"-->
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in listGoodType1"   :value="item.id">{{ item.name }}</a-select-option><!--:defaultValue="listGoodType1.length>0?listGoodType1[0].name : ''"-->
              </a-select>
              <a-select v-model="queryParam.goodTypeIdThree"   placeholder="请选择"   style="width:100px;margin-right: 10px;">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in listGoodType2"   :value="item.id" >{{ item.name }}</a-select-option><!--:defaultValue="listGoodType2.length>0?listGoodType2[0].name : ''"-->
              </a-select>
            </a-form-item>
            <a-col :md="6" :sm="8">
              <a-form-item label="供应商">
                <a-input placeholder="请输入" v-model="queryParam.realname"></a-input>
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
                <a-select v-model="queryParam.status" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">停用</a-select-option>
                  <a-select-option :value="1">启用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">

              <a-form-item label="活动">
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
      <!-- <a-button @click="batchAudit()" type="primary" icon="plus">批量审批</a-button>
         <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>

         <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('商品列表')">导出</a-button>
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
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status==0" >停用</span>
            <span shape="square" v-if="record.status==1" >启用</span>
          </div>
        </template>
        <template slot="auditStatus" slot-scope="text, record, index">
          <div v-if="record.goodAudit == 1">
            <span shape="square"  >免审</span>
          </div>
          <div v-else class="anty-img-wrap">
            <span shape="square" v-if="record.auditStatus==0" >草稿</span>
            <span shape="square" v-if="record.auditStatus==1" >待审核</span>
            <span shape="square" v-if="record.auditStatus==2" >审核通过</span>
            <span shape="square" v-if="record.auditStatus==3" >审核不通过</span>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">

          <a @click="showModal(record.id)" v-if="record.goodAudit != 1" >审核</a>
          <!--      <a-divider type="vertical" />
                 <a @click="showModalRepertory(record.id)">改库存</a>
                <a-divider type="vertical" />
                <a @click="handleEdit(record)">编辑</a>
                <a-divider type="vertical" />
                <a v-if="record.status==1" @click="showModalStopStatus(record.id,'0')" >停用</a>
                <a v-if="record.status==0" @click="updateStatus(record.id,'1')">启用</a>
                <a-divider type="vertical" />
                 <a v-if="record.frameStatus==0" @click="updateFrameStatus(record.id,'1')">上架</a>
                 <a v-if="record.frameStatus==1" @click="showModalFrameStatus(record.id,'0')">下架</a>
                <a-divider type="vertical" />
                 <a @click="showModalDelete(record.id)">删除</a>-->
          <!--<a-divider type="vertical" />
          <a @click="handleEdit(record)">预览</a>-->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <goodList-modal ref="modalForm" @ok="modalFormOk"></goodList-modal>



    <a-modal
      title="审核" v-model="visibleAudi" @ok="hideModal()" okText="确认" cancelText="取消">
      <input style="display: none"  :value="goodId"  placeholder="id"/>
      <a-radio-group @change="" v-model="auditStatus">
        <a-radio style="float:left;margin-left: 20px" :style="radioStyle"  v-model="auditStatus" value='2' >通过</a-radio>
        <a-radio style="left: 20px" :style="radioStyle"  v-model="auditStatus" value='3' >
          不通过
        </a-radio>
      </a-radio-group>
      <a-textarea style="width: 100%;margin-top: 20px" placeholder="请输入" :rows="4" v-if="auditStatus==3" v-model="auditExplain" />

    </a-modal>


  </a-card>
</template>

<script>
  import GoodListModal from './modules/GoodListModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {getAction} from '@/api/manage';
  import JDate from '@/components/jeecg/JDate'
  import { putAction } from '../../api/manage'
  import {filterObj} from '@/utils/util';
  export default {
    name: "GoodListList",
    mixins:[JeecgListMixin],
    components: {
      GoodListModal,
      JDate
    },
    data () {

      return {
        description: '商品列表管理页面',
        value: 1,
        radioStyle: {
          display: 'block',
          height: '30px',
          lineHeight: '30px',
        },
        goodId:"",
        isChecked:true,
        isChecked1:false,
        auditStatus:"",
        auditExplain:"",
        showPrise:false,
        visibleAudi:false,
        goodListId2:"",
        statusExplain:"",
        frameExplain:"",
        createTime:[],
        visibleStopStatus:false,
        visibleFrameStatus:false,
        listGoodType:[],
        parentId:"",
        listGoodType1:[],
        listGoodType2:[],
        goodTypeId:"",
        goodTypeId1:"",
        queryParam:{
          goodTypeIdOne:"",
          goodTypeIdTwo:"",
          goodTypeIdThree:"",
        },

        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            fixed: 'left',
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
            dataIndex: 'goodTypeNames'
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
            title: '供应商',
            align:"center",
            dataIndex: 'realname'
          },
          {
            title: '审核',
            align:"center",
            dataIndex: 'auditStatus',
            scopedSlots: {customRender: "auditStatus"}
          },
          {
            title: '审核说明',
            align:"center",
            dataIndex: 'auditExplain'
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
          list: "/goodList/goodList/list",
          delete: "/goodList/goodList/delete",
          deleteBatch: "/goodList/goodList/deleteBatch",
          exportXlsUrl: "goodList/goodList/exportXls",
          importExcelUrl: "goodList/goodList/importExcel",
          imgerver: window._CONFIG['domianURL'] + "/sys/common/view",
          updateAuditStatusPL:"goodList/goodList/updateAuditStatusPL",
          getgoodTypeListcascade:"/goodType/goodType/getgoodTypeListcascade",
          updateAuditStatus:"goodList/goodList/updateAuditStatus",
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
      getRadioVal (event) {
        let radioVal = event.target.value;
        console.log(radioVal);
      },
      getAvatarView: function (mainPicture) {
        return this.url.imgerver + "/" + mainPicture;
      },

      showModal(id) {
        this.goodId=id;
        this.visibleAudi = true;
        this.auditStatus = "2";
        this.auditExplain='';
      },
      //审核
      hideModal() {
        this.visibleAudi = false;
        // console.log("this.stopRemark=",this.stopRemark)
        var that = this;
        getAction(that.url.updateAuditStatus, {id: this.goodId,auditExplain:this.auditExplain,auditStatus:this.auditStatus}).then((res) => {
          if (res.code==200) {
            that.$message.success(res.message);
            that.loadData();
          } else {

            that.$message.warning("修改失败");
          }
        });
      },

      check(e) {
        // 先取消所有选中项

        this.isChecked = false;
        this.isChecked1 = false
        this.showPrise=false
        //再设置当前点击项选中
        //  this.radio = this.radios.value;
        // 设置值，以供传递
        if(e==2){
          this.isChecked = true;
          this.auditExplain="";
        }else{
          this.isChecked1 = true;
          this.showPrise=true;
        }
      },
      goodTypeListcascade (parentId){

        let that = this;
        that.listGoodType1=[];
        that.listGoodType2=[];
        getAction(that.url.getgoodTypeListcascade, {parentId: parentId}).then((res) => {

          if (res.success) {
            that.listGoodType=res.result.listGoodType
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
        that.listGoodType1=[];
        that.listGoodType2=[];
        this.queryParam.goodTypeIdTwo ="";
        this.queryParam.goodTypeIdThree = "";
        getAction(that.url.getgoodTypeListcascade, {parentId:value}).then((res) => {
          if (res.success) {
            that.listGoodType1=res.result.listGoodType

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
        this.queryParam.goodTypeIdThree = "";
        getAction(that.url.getgoodTypeListcascade, { parentId: value}).then((res) => {
          if (res.success) {
            that.listGoodType2=res.result.listGoodType

            console.log(that.listGoodType2)
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      /**查询栏时间区间查询*/
      getQueryParams(){
        console.log(this.queryParam.createTime)
        var param = Object.assign({}, this.queryParam,this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTime; // 时间参数不传递后台
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        console.log("*****************************************************",dateString[0],dateString[1]);
        this.queryParam.createTime_begin=dateString[0];
        this.queryParam.createTime_end=dateString[1];
      },
      onDateOk(value) {
        console.log(value);
      },
      //分类搜索
      goodTypeListcascade (parentId){
        let that = this;
        that.listGoodType1=[];
        that.listGoodType2=[];
        getAction(that.url.getgoodTypeListcascade, {parentId: parentId}).then((res) => {

          if (res.success) {
            that.listGoodType=res.result.listGoodType
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
            that.listGoodType1=res.result.listGoodType

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
            that.listGoodType2=res.result.listGoodType

            console.log(that.listGoodType2)
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      handleAdd(){
        //路由跳转
        localStorage.removeItem('GoodListListInfo')
        this.$router.push({ path: '/good/modules/GoodListadd',query:{reusePage:1}})
      },


      //批量审核
      batchAudit: function (FrameStatus) {
        if(!this.url.updateAuditStatusPL){
          this.$message.error("请设置url.updateAuditStatusPL属性!")
          return
        }
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return;
        } else {
          var ids = "";
          for (var a = 0; a < this.selectedRowKeys.length; a++) {
            ids += this.selectedRowKeys[a] + ",";
          }
          this.goodId=ids;
          this.visibleAudi = true;
          var that = this
          this.$confirm({
            title: '批量启审核',
            content: '您确定要批量审核吗？',
            onOk: function() {
              getAction(that.url.updateAuditStatusPL, { id: that.goodId, auditStatus:  that.auditStatus , auditExplain: that.auditExplain }).then((res) => {
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