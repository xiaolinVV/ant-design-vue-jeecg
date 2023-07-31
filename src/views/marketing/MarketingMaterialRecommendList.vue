<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="编号">
              <a-input placeholder="请输入" v-model="queryParam.marketingMaterialListId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="标题">
              <a-input placeholder="请输入" v-model="queryParam.title"></a-input>
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
                @change="onDateChange1"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>
          <!--时间选择框-->
          <a-col :md="6" :sm="8">
            <a-form-item label="结束时间">
              <a-range-picker
                style="width: 210px"
                v-model="queryParam.endTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange2"
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
     <!-- <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('素材推荐表')">导出</a-button>
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

          <a v-if="record.status==1" @click="updateStatus(record.id,'0')">停用</a>
          <a v-if="record.status==0" @click="updateStatus(record.id,'1')">启用</a>
          <a-divider type="vertical"/>

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
    <marketingMaterialRecommend-modal ref="modalForm" @ok="modalFormOk"></marketingMaterialRecommend-modal>
  </a-card>
</template>

<script>
  import MarketingMaterialRecommendModal from './modules/MarketingMaterialRecommendModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction,getAction } from '@/api/manage'
  import { filterObj } from '@/utils/util'
  export default {
    name: "MarketingMaterialRecommendList",
    mixins:[JeecgListMixin],
    components: {
      MarketingMaterialRecommendModal
    },
    data () {
      return {
        description: '素材推荐表管理页面',
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
            dataIndex: 'marketingMaterialListId'
           },
		   {
            title: '标题',
            align:"center",
            dataIndex: 'title'
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
          },
          {
            title: '结束时间',
            align:"center",
            dataIndex: 'endTime'
          },

		   {
            title: '状态',//；0：停用；1：启用
            align:"center",
            dataIndex: 'status',
            scopedSlots: {customRender: "status"}
           },
          {
            title: '创建者',//；0：停用；1：启用
            align:"center",
            dataIndex: 'createBy'
          },
          {
            title: '创建时间',//；0：停用；1：启用
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
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/marketingMaterialRecommend/marketingMaterialRecommend/list",
          delete: "/marketingMaterialRecommend/marketingMaterialRecommend/delete",
          deleteBatch: "/marketingMaterialRecommend/marketingMaterialRecommend/deleteBatch",
          exportXlsUrl: "marketingMaterialRecommend/marketingMaterialRecommend/exportXls",
          importExcelUrl: "marketingMaterialRecommend/marketingMaterialRecommend/importExcel",
          marketingMaterialList:"/marketingMaterialList/marketingMaterialList/list",
          updateStatus:"/marketingMaterialRecommend/marketingMaterialRecommend/updateStatus"
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
      updateStatus: function(id, status) {
        //this.stopRemark="";
        if (!this.url.updateStatus) {
          this.$message.error('请设置url.updateStatus属性!')
          return
        }
        var that = this

        this.$confirm({

          title: status == 1 ? '启用后该推荐素材将会展示出来':'停用后该推荐素材后，将不再展示',
          content: status == 1 ? '您确定要启用吗？':'您确定要停用吗？',
          onOk: function() {

            getAction(that.url.updateStatus, { ids: id, status: status }).then((res) => {
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

      /**查询栏时间区间查询*/
      getQueryParams() {
        console.log(this.queryParam.createTime)
        var param = Object.assign({}, this.queryParam, this.isorter)
        param.field = this.getQueryField()
        param.pageNo = this.ipagination.current
        param.pageSize = this.ipagination.pageSize
        delete param.createTime // 时间参数不传递后台
        delete param.startTime
        delete param.endTime
        return filterObj(param)
      },
      onDateChange: function(value, dateString) {
        console.log('*****************************************************', dateString[0], dateString[1])
        this.queryParam.createTime_begin = dateString[0]
        this.queryParam.createTime_end = dateString[1]
      },
      onDateChange1: function (value, dateString) {
        console.log("*****************************************************",dateString[0],dateString[1]);
        this.queryParam.startTime_begin=dateString[0];
        this.queryParam.startTime_end=dateString[1];
      },
      onDateChange2: function (value, dateString) {
        console.log("*****************************************************",dateString[0],dateString[1]);
        this.queryParam.endTime_begin=dateString[0];
        this.queryParam.endTime_end=dateString[1];
      },
      onDateOk(value) {
        console.log(value)
      },

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>