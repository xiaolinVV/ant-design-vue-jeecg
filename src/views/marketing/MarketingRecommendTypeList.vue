<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="推荐分类">
              <a-input placeholder="请输入推荐分类" v-model="queryParam.goodTypeNames"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="推荐分类别名">
              <a-input placeholder="请输入分类别名" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="分类级别">
              <a-select v-model="queryParam.level" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="1">一级分类</a-select-option>
                <a-select-option :value="2">二级分类</a-select-option>
                <a-select-option :value="3">三级分类</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">
          <!--时间选择框-->
          <a-col :md="6" :sm="8">
            <a-form-item label="开始时间">
              <a-range-picker
                style="width: 210px"
                v-model="queryParam.startTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChangeStartTime"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
          <a-form-item label="结束时间">
            <a-range-picker
              style="width: 210px"
              v-model="queryParam.endTime"
              format="YYYY-MM-DD"
              :placeholder="['开始时间', '结束时间']"
              @change="onDateChangeEndTime"
              @ok="onDateOk"
            />
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
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status==0" >停用</span>
            <span shape="square" v-if="record.status==1" >启用</span>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
         <a @click="updateStatus(record.id,'0')" v-if="record.status==1" updateStatus>停用</a>
          <a @click="updateStatus(record.id,'1')" v-if="record.status==0">启用</a>
           <a-divider type="vertical" />
          <a @click="handleDelete(record.id)">删除</a>

        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingRecommendType-modal ref="modalForm" @ok="modalFormOk"></marketingRecommendType-modal>
  </a-card>
</template>

<script>
  import MarketingRecommendTypeModal from './modules/MarketingRecommendTypeModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction } from '@/api/manage'
  import JDate from '@/components/jeecg/JDate'
  import {filterObj} from '@/utils/util';
  export default {
    name: "MarketingRecommendTypeList",
    mixins:[JeecgListMixin],
    components: {
      MarketingRecommendTypeModal,
      JDate
    },
    data () {
      return {
        description: '推荐分类管理页面',
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
            title: '推荐分类',
            align:"center",
            dataIndex: 'goodTypeNames'
          },{
            title: '推荐分类别名',
            align:"center",
            dataIndex: 'nickName'
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
           },{
            title: '结束时间',
            align:"center",
            dataIndex: 'endTime'
           },{
            title: '状态',
            align:"center",
            dataIndex: 'status',
            scopedSlots: {customRender: "status"}
           },{
            title: '创建者',
            align:"center",
            dataIndex: 'createBy'
          },{
            title: '创建时间',
            align:"center",
            dataIndex: 'createTime'
          },{
            title: '更新者',
            align:"center",
            dataIndex: 'updateBy'
          },{
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
          list: "/marketingRecommendType/marketingRecommendType/list",
          delete: "/marketingRecommendType/marketingRecommendType/delete",
          deleteBatch: "/marketingRecommendType/marketingRecommendType/deleteBatch",
          exportXlsUrl: "marketingRecommendType/marketingRecommendType/exportXls",
          importExcelUrl: "marketingRecommendType/marketingRecommendType/importExcel",
          updateStatus:"/marketingRecommendType/marketingRecommendType/updateStatus",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {

      //启用
      updateStatus: function (id,status) {
        //this.stopRemark="";
        if(!this.url.updateStatus){
          this.$message.error("请设置url.updateFrameStatus属性!")
          return
        }
        var that = this;
        if(status == '0'){
          this.$confirm({
            title: "停用后广告将无法访问。",
            content: "您确定要停用吗？",
            onOk: function () {

              getAction(that.url.updateStatus, {id: id}).then((res) => {
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
        }else{
          this.$confirm({
            title: "启动后广告，该广告将可以访问。",
            content: "您确定要启用吗？",
            onOk: function () {

              getAction(that.url.updateStatus, {id: id}).then((res) => {
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

      /**查询栏时间区间查询*/
      getQueryParams(){
        console.log(this.queryParam.createTime)
        var param = Object.assign({}, this.queryParam,this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTime; // 时间参数不传递后台
        delete param.startTime; // 时间参数不传递后台
        delete param.endTime; // 时间参数不传递后台
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        console.log("*****************************************************",dateString[0],dateString[1]);
        this.queryParam.createTime_begin=dateString[0];
        this.queryParam.createTime_end=dateString[1];
      },

      onDateChangeStartTime: function (value, dateString) {
        console.log("*****************************************************",dateString[0],dateString[1]);
        this.queryParam.startTime_begin=dateString[0];
        this.queryParam.startTime_end=dateString[1];
      },
      onDateChangeEndTime: function (value, dateString) {
        console.log("*****************************************************",dateString[0],dateString[1]);
        this.queryParam.endTime_begin=dateString[0];
        this.queryParam.endTime_end=dateString[1];
      },
      onDateOk(value) {
        console.log(value);
      },

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>