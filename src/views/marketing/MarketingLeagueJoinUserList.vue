<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="会员编号">
              <a-input placeholder="请输入会员编号" v-model="queryParam.mid"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="会员手机号">
              <a-input placeholder="请输入会员手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="会员昵称">
              <a-input placeholder="请输入会员昵称 " v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
    <!--  <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('加盟专区-加盟用户')">导出</a-button>
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

        <template slot="headPortrait" slot-scope="text, record">
          <img :src="text" style="width: 40px">
        </template>

 <!--       <span slot="action" slot-scope="text, record">
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
        </span>-->

      </a-table>
    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "marketingLeagueMemberList",
    mixins:[JeecgListMixin],
    components: {
    },
    data () {
      return {
        description: '加盟专区-加盟用户管理页面',
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
            title: '会员编号',
            align:"center",
            dataIndex: 'mid'
           },
		   {
            title: '会员头像',
            align:"center",
            dataIndex: 'headPortrait',
         scopedSlots:{customRender:"headPortrait"}
           },
		   {
            title: '手机号',
            align:"center",
            dataIndex: 'phone'
           },
		   {
            title: '昵称',
            align:"center",
            dataIndex: 'nickName'
           },
		   {
            title: '用户身份',
            align:"center",
            dataIndex: 'identityName'
           },
		   {
            title: '附加身份',
            align:"center",
            dataIndex: 'identityNames'
           },
          {
            title: '加盟时间',
            align:"center",
            dataIndex: 'createTime'
          }
        ],
		url: {
          list: "/marketing/marketingLeagueMember/list",
          delete: "/marketing/marketingLeagueMember/delete",
          deleteBatch: "/marketing/marketingLeagueMember/deleteBatch",
          exportXlsUrl: "marketing/marketingLeagueMember/exportXls",
          importExcelUrl: "marketing/marketingLeagueMember/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
     
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>