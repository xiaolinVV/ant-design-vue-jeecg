<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="商品名称">
              <a-input placeholder="请输入商品名称" v-model="queryParam.goodName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="商品编号">
              <a-input placeholder="请输入" v-model="queryParam.goodNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item
              label="商品分类">
              <div  style="display: flex;align-items: center;justify-content: space-between">
                <a-select v-model="queryParam.goodTypeIdOne"    placeholder="请选择"  @change="chooseMedicine"   style="width:33%;">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option v-for="item in listGoodType" :value="item.id"   >{{ item.name }}</a-select-option>
                </a-select>
                <a-select v-model="queryParam.goodTypeIdTwo"  placeholder="请选择" @change="chooseMedicine1"  style="width:33%;" ><!--v-model="id"-->
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option v-for="item in listGoodType1"   :value="item.id">{{ item.name }}</a-select-option><!--:defaultValue="listGoodType1.length>0?listGoodType1[0].name : ''"-->
                </a-select>
                <a-select v-model="queryParam.goodTypeIdThree"   placeholder="请选择"   style="width:33%;">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option v-for="item in listGoodType2"   :value="item.id" >{{ item.name }}</a-select-option><!--:defaultValue="listGoodType2.length>0?listGoodType2[0].name : ''"-->
                </a-select>
              </div>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="供应商">
              <a-input placeholder="请输入" v-model="queryParam.sysUserId"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="删除时间">
              <a-range-picker
                style="width: 210px"
                v-model="queryParam.delTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>

<!--          <template v-if="toggleSearchStatus">-->
<!--            <a-col :md="6" :sm="8">-->
<!--              <a-form-item label="上下架">-->
<!--                <a-select v-model="queryParam.frameStatus" placeholder="请选择">-->
<!--                  <a-select-option value="">请选择</a-select-option>-->
<!--                  <a-select-option :value="0">下架</a-select-option>-->
<!--                  <a-select-option :value="1">上架</a-select-option>-->
<!--                </a-select>-->
<!--              </a-form-item>-->
<!--            </a-col>-->
<!--            <a-col :md="6" :sm="8">-->
<!--              <a-form-item label="审核状态">-->
<!--                <a-select v-model="queryParam.auditStatus" placeholder="请选择">-->
<!--                  <a-select-option value="">请选择</a-select-option>-->
<!--                  <a-select-option :value="0">草稿</a-select-option>-->
<!--                  <a-select-option :value="1">待审核</a-select-option>-->
<!--                  <a-select-option :value="2">审核通过</a-select-option>-->
<!--                  <a-select-option :value="3">审核不通过</a-select-option>-->
<!--                </a-select>-->

<!--              </a-form-item>-->
<!--            </a-col>-->
<!--            <a-col :md="6" :sm="8">-->
<!--              <a-form-item label="状态">-->
<!--                <a-select v-model="queryParam.status" placeholder="请选择">-->
<!--                  <a-select-option value="">请选择</a-select-option>-->
<!--                  <a-select-option :value="0">停用</a-select-option>-->
<!--                  <a-select-option :value="1">启用</a-select-option>-->
<!--                </a-select>-->
<!--              </a-form-item>-->
<!--            </a-col>-->
<!--            <a-col :md="6" :sm="8">-->

<!--              <a-form-item label="活动">-->
<!--                <j-dict-select-tag v-model="queryParam.activitiesType" placeholder="请选择" dictCode="activities_type"/>-->
<!--              </a-form-item>-->
<!--            </a-col>-->
<!--            &lt;!&ndash;时间选择框&ndash;&gt;-->
<!--          </template>-->
<!--          <a-col :md="6" :sm="8" >-->
<!--            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">-->
<!--              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>-->
<!--              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>-->
<!--              <a @click="handleToggleSearch" style="margin-left: 8px">-->
<!--                {{ toggleSearchStatus ? '收起' : '展开' }}-->
<!--                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
<!--              </a>-->
<!--            </span>-->
<!--          </a-col>-->

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">

      <a-button @click="BatchDelFlags()" type="primary" icon="plus">批量放回</a-button>
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
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
        :scroll="{x:true}"
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
        <template slot="goodForm" slot-scope="text, record, index">
          <div class="anty-img-wrap">

            <span shape="square" v-if="record.goodForm==0" >普通商品</span>
            <span shape="square" v-if="record.goodForm==1" >特价商品</span>
          </div>
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
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.auditStatus==0" >草稿</span>
            <span shape="square" v-if="record.auditStatus==1" >待审核</span>
            <span shape="square" v-if="record.auditStatus==2" >审核通过</span>
            <span shape="square" v-if="record.auditStatus==3" >审核不通过</span>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleDelFlag(record.id)">回到商品列表</a>
         <!-- <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>彻底删除</a>
                </a-popconfirm>-->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <goodList-modal ref="modalForm" @ok="modalFormOk"></goodList-modal>
  </a-card>
</template>

<script>
  import GoodListModal from './modules/GoodListModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {getAction} from '@/api/manage';
  import JDate from '@/components/jeecg/JDate'
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
        listGoodType:[],
        parentId:"",
        listGoodType1:[],
        listGoodType2:[],
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
            title: '供货价',
            align:"center",
            dataIndex: 'supplyPrice'
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
            title: '删除者',
            align:"center",
            dataIndex: 'updateBy'
          },
          {
            title: '删除时间',//状态说明，
            align:"center",
            dataIndex: 'delTime'
          },
          {
            title: '删除原因',//状态说明，
            align:"center",
            dataIndex: 'delExplain'
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
          list: "/goodList/goodList/GoodRecycleListList",
          delete: "/goodList/goodList/delete",
          deleteBatch: "/goodList/goodList/deleteBatch",
          exportXlsUrl: "goodList/goodList/exportXls",
          importExcelUrl: "goodList/goodList/importExcel",
      updateDelFlag:"/goodList/goodList/updateDelFlag",
      updateDelFlags:"/goodList/goodList/updateDelFlags",
      imgerver: window._CONFIG['domianURL'] + "/sys/common/view",
      getgoodTypeListcascade:"/goodType/goodType/getgoodTypeListcascade",
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
      handleDelFlag: function (id) {
        if(!this.url.updateDelFlag){
          this.$message.error("请设置url.updateDelFlag属性!")
          return
        }
        var that = this;
        this.$confirm({
          title: "回到商品列表后，该商品可以上架再销售。",
          content: "您确定要回到商品列表吗？",
          onOk: function () {

            getAction(that.url.updateDelFlag, {id: id}).then((res) => {
              if (res.code==200) {
                that.$message.success(res.message);
                that.loadData();
              } else {

                that.$message.error("修改失败");
              }
            });
          }
        });

      },
      //批量放回
      BatchDelFlags: function () {
        if(!this.url.updateDelFlags){
          this.$message.error("请设置url.updateDelFlags!")
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
          var that = this;
          this.$confirm({
            title: "批量回到商品列表后，该商品可以上架再销售。",
            content: "确定要回到商品列表吗？",
            onOk: function () {
              getAction(that.url.updateDelFlags, {ids: ids}).then((res) => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.loadData();
                  that.onClearSelected();
                } else {
                  that.$message.warning(res.message);
                }
              });
            }
          });
        }
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
        that.queryParam.goodTypeIdTwo = "";
        that.queryParam.goodTypeIdThree = "";
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
        that.queryParam.goodTypeIdThree = "";
        getAction(that.url.getgoodTypeListcascade, { parentId: value}).then((res) => {
          if (res.success) {
            that.listGoodType2=res.result.listGoodType

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