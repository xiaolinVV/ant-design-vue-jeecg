<template>
  <a-modal
    :title="title"
    :width="1100"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >

    <!-- 查询区域 -->
   <!-- <div class="table-page-search-wrapper">
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
            <a-form-item label="礼包列表id">
              <a-input placeholder="请输入礼包列表id" v-model="queryParam.marketingGiftBagId"></a-input>
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
    </div>-->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleEdit(addparam)" type="primary" icon="plus">新增</a-button>
     <!-- <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('礼包分账')">导出</a-button>
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
      <!--  <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项-->
       <!-- <a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
        <span>如果无分账信息代表不分账</span>
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
    <marketingGiftRouting-modal ref="modalForm" @ok="modalFormOk"></marketingGiftRouting-modal>
  </a-modal>
</template>

<script>
  import MarketingGiftRoutingModal from './modules/MarketingGiftRoutingModal'
  import { JeecgListMixinTwo } from '@/mixins/JeecgListMixinTwo'

  export default {
    name: "MarketingGiftRoutingList",
    mixins:[JeecgListMixinTwo],
    components: {
      MarketingGiftRoutingModal
    },
    data () {
      return {
        description: '礼包分账管理页面',
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
            title: '账户类型',
            align:"center",
            dataIndex: 'accountType',
         customRender(text){
              if(text==0){
                return '对私';
              }
           if(text==1){
             return '对公';
           }
         }
           },
		   {
            title: '银行卡号',
            align:"center",
            dataIndex: 'bankCard'
           },
		   {
            title: '真实姓名',
            align:"center",
            dataIndex: 'realName'
           },
		   {
            title: '身份证号',
            align:"center",
            dataIndex: 'idNumber'
           },
		   {
            title: '手机号',
            align:"center",
            dataIndex: 'phone'
           },
          {
            title: '分账比例(%)',
            align:"center",
            dataIndex: 'fashionableProportion'
          },
		   {
            title: '汇付结算账户',
            align:"center",
            dataIndex: 'settleAccount'
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/marketing/marketingGiftRouting/list",
          delete: "/marketing/marketingGiftRouting/delete",
          deleteBatch: "/marketing/marketingGiftRouting/deleteBatch",
          exportXlsUrl: "marketing/marketingGiftRouting/exportXls",
          importExcelUrl: "marketing/marketingGiftRouting/importExcel",
       },
        confirmLoading:false,
        title:'礼包分账',
        visible:false,
        confirmLoading:false,
        marketingGiftBag:{},
        addparam:{}
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
      handleOk(){
        this.visible=false;
      },
      handleCancel(){
        this.visible=false;
      },
      show(record){
        this.ipagination.current = 1
        this.url.list='/marketing/marketingGiftRouting/list';
        this.visible=true;
        console.log(record);
        this.$nextTick(()=>{
          this.marketingGiftBag=record;
          this.title=record.giftName+'-分账';
          this.addparam.marketingGiftBagId=record.id;
          this.url.list=this.url.list+'?marketingGiftBagId='+record.id;
          this.modalFormOk();
        });

      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>