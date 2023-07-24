<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="评论编号">
              <a-input placeholder="请输入" v-model="queryParam.marketingMaterialList"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="被评论编号">
              <a-input placeholder="请输入" v-model="queryParam.parentIdS"></a-input>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">
        <a-col :md="6" :sm="8">
            <a-form-item label="标题">
              <a-input placeholder="请输入" v-model="queryParam.title"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="作者">
              <a-input placeholder="请输入" v-model="queryParam.author"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="评论人">
              <a-input placeholder="请输入" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="被评论人">
              <a-input placeholder="请输入" v-model="queryParam.parentNickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="被回复人">
              <a-input placeholder="请输入" v-model="queryParam.byReplyName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">待审核</a-select-option>
                <a-select-option :value="1">审核通过</a-select-option>
                <a-select-option :value="2">审核不通过</a-select-option>

              </a-select> </a-form-item>
          </a-col>
          <!--时间选择框-->
          <a-col :md="6" :sm="8">
            <a-form-item label="评论时间">
              <a-range-picker
                style="width: 210px"
                v-model="queryParam.commentTime"
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
    <!--<div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('素材评论表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>-->

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
        :scroll="{x:2500}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="headPortrait" slot-scope="text, record">
          <img class="clickShowImage" v-if="record.headPortrait != undefined " :preview="'headPortrait' + index" :src="getAvatarView(record.headPortrait)" alt=""/>
        </template>

        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status==0" >待审核</span>
            <span shape="square" v-if="record.status==1" >审核通过</span>
            <span shape="square" v-if="record.status==2" >审核不通过</span>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
           <a @click="showModal(record.id)" v-if="record.status != 1">审核</a>
           <a @click="replyModal(record)" v-if="record.status == 1 && record.userType == '0'">回复</a>
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
    <marketingMaterialComment-modal ref="modalForm" @ok="modalFormOk"></marketingMaterialComment-modal>
  </a-card>
</template>

<script>
  import MarketingMaterialCommentModal from './modules/MarketingMaterialCommentModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction  } from '@/api/manage'
  import JDate from '@/components/jeecg/JDate'
  import { filterObj } from '@/utils/util'
  export default {
    name: "MarketingMaterialCommentList",
    mixins:[JeecgListMixin],
    components: {
      MarketingMaterialCommentModal
    },
    data () {
      return {
        description: '素材评论表管理页面',
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
            title: '评论编号',
            align:"center",
            dataIndex: 'id'
           },
		   {
            title: '被评论编号',
            align:"center",
            dataIndex: 'parentIdS'
           },
          {
            title: '标题',
            align:"center",
            dataIndex: 'title'
          },

		   {
            title: '作者',
            align:"center",
            dataIndex: 'author'
           },
          {
            title: '头像',
            align:"center",
            dataIndex: 'headPortrait',
            scopedSlots: {customRender: "headPortrait"}
          },
		   {
            title: '评论人',
            align:"center",
            dataIndex: 'nickName'
           },
		   {
            title: '被评论人',
            align:"center",
            dataIndex: 'parentNickName'
           },
          {
            title: '被回复人',
            align:"center",
            dataIndex: 'byReplyName'
          },
		   {
            title: '评论内容',
            align:"center",
            dataIndex: 'content'
           },
		   {
            title: '评论时间',
            align:"center",
            dataIndex: 'commentTime'
           },
		   {
            title: '状态',//；0：待审核；1：审核通过；2：审核不通过
            align:"center",
            dataIndex: 'status',
            scopedSlots: {customRender: "status"}
           },
          {
            title: '不通过原因',
            align:"center",
            dataIndex: 'closeExplain'
          },
		   {
            title: '审核时间',
            align:"center",
            dataIndex: 'auditTime'
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/marketingMaterialComment/marketingMaterialComment/list",
          delete: "/marketingMaterialComment/marketingMaterialComment/delete",
          deleteBatch: "/marketingMaterialComment/marketingMaterialComment/deleteBatch",
          exportXlsUrl: "marketingMaterialComment/marketingMaterialComment/exportXls",
          importExcelUrl: "marketingMaterialComment/marketingMaterialComment/importExcel",
      imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
      getAvatarView: function (mainPicture) {
        if(mainPicture){
          if (mainPicture.indexOf('http')!= -1 ){
            return mainPicture
          }
          return this.url.imgerver + "/" +  mainPicture;
        }else{
          return ''
        }

      },
      /**查询栏时间区间查询*/
      getQueryParams() {
        console.log(this.queryParam.commentTime)
        var param = Object.assign({}, this.queryParam, this.isorter)
        param.field = this.getQueryField()
        param.pageNo = this.ipagination.current
        param.pageSize = this.ipagination.pageSize
        delete param.commentTime // 时间参数不传递后台
        return filterObj(param)
      },
      onDateChange: function(value, dateString) {
        console.log('*****************************************************', dateString[0], dateString[1])
        this.queryParam.commentTime_begin = dateString[0]
        this.queryParam.commentTime_end = dateString[1]
      },
      onDateOk(value) {
        console.log(value)
      },


      //审核
      showModal(id) {
        this.$refs.modalForm.showModal(id);
        this.$refs.modalForm.title = "审核";
        this.$refs.modalForm.disableSubmit = false;
      },
      //回复
      replyModal(record){
        this.$refs.modalForm.replyModal(record);
        this.$refs.modalForm.title = "回复评论";
        this.$refs.modalForm.disableSubmit = false;
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>