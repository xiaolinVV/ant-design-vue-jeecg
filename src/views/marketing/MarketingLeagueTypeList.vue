<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="分类名称">
              <a-input placeholder="请输入创建年" v-model="queryParam.typeName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status">
                <a-select-option value="">
                  请选择
                </a-select-option>
                <a-select-option value="0">
                  停用
                </a-select-option>
                <a-select-option value="1">
                  启用
                </a-select-option>
              </a-select>
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
      <a-button @click="handleAdd" type="primary" icon="plus">添加</a-button>
     <!-- <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('加盟专区-专区类型')">导出</a-button>
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
        :scroll="{x:2000}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">

               <a-menu-item>
                <a @click="sortClick(record)">排序</a>
              </a-menu-item>
               <a-menu-item>
                <a v-if="record.status==1" @click="statusClick(record)">停用</a>
                 <a v-if="record.status==0" @click="statusClick(record)">启用</a>
              </a-menu-item>
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
    <marketingLeagueType-modal ref="modalForm" @ok="modalFormOk"></marketingLeagueType-modal>
    <!--排序-->
    <a-modal
      v-model="sortvisible"
      title="排序"
      @ok="sortHandleOk"
    >
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="排序：">
        <a-input-number v-model="newSort" style="width: 95%" />
      </a-form-item>
    </a-modal>

    <!--状态修改-->
    <a-modal
      v-model="statusvisible"
      :title="statusTitle"
      @ok="statusHandleOk"
    >
      <a-form-item
        :label="statusLabel">
        <a-textarea  v-model="statusExplain" style="width: 95%" />
      </a-form-item>
    </a-modal>
  </a-card>
</template>

<script>
  import MarketingLeagueTypeModal from './modules/MarketingLeagueTypeModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {getAction} from '@/api/manage';
  import ATextarea from 'ant-design-vue/es/input/TextArea'

  export default {
    name: "MarketingLeagueTypeList",
    mixins:[JeecgListMixin],
    components: {
      ATextarea,
      MarketingLeagueTypeModal
    },
    data () {
      return {
        description: '加盟专区-专区类型管理页面',
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
            title: '分类名称',
            align:"center",
            dataIndex: 'typeName'
           },
		   {
            title: '活动价格',
            align:"center",
            dataIndex: 'price'
           },
		   {
            title: '直推奖励',
            align:"center",
            dataIndex: 'pushStraightReward'
           },
		   {
            title: '店长奖励',
            align:"center",
            dataIndex: 'managerReward'
           },
          {
            title: '城市服务商奖励',
            align:"center",
            dataIndex: 'cityServiceProvider'
          },
		   {
            title: '店长管理奖励比例',
            align:"center",
            dataIndex: 'storeManagerReward',
         customRender:function(text) {
           if(!text){
             return '--';
           }
           return text+'%';
         }
           },
          {
            title: '合伙人管理奖励比例',
            align:"center",
            dataIndex: 'partnerStoreReward',
            customRender:function(text) {
              if(!text){
                return '--';
              }
              return text+'%';
            }
          },
		   {
            title: '店长扶植奖励',
            align:"center",
            dataIndex: 'storeManagerSupportAward',
         customRender:function(text) {
           if(!text){
             return '--';
           }
           return text+'%';
         }
           },
		   {
            title: '超级合伙人管理奖励',
            align:"center",
            dataIndex: 'superPartnerAward',
         customRender:function(text) {
           if(!text){
             return '--';
           }
           return text+'%';
         }
           },

		   {
            title: '复购专区',
            align:"center",
            dataIndex: 'afterPurchase',
         customRender:function(text) {
           if(text==0){
             return '不支持';
           }
           if(text==1){
             return '支持';
           }
         }
           },
		   {
            title: '复购直推奖励比例',
            align:"center",
            dataIndex: 'afterPushStraightReward',
         customRender:function(text) {
           if(!text){
             return '--';
           }
           return text+'%';
         }
           },
		   {
            title: '复购间推奖励比例',
            align:"center",
            dataIndex: 'betweenPush',
         customRender:function(text) {
              if(!text){
                return '--';
              }
           return text+'%';
         }
           },
		   {
            title: '积分数量',
            align:"center",
            dataIndex: 'welfarePayments'
           },
		   {
            title: '级别',
            align:"center",
            dataIndex: 'grade'
           },
          {
            title: '排序',
            align:"center",
            dataIndex: 'sort'
          },
          {
            title: '状态',
            align:"center",
            dataIndex: 'status',
            customRender:function(text) {
              if(text==0){
                return '停用';
              }
              if(text==1){
                return '启用';
              }
            }
          },
          {
            title: '状态说明',
            align:"center",
            dataIndex: 'statusExplain'
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
          list: "/marketing/marketingLeagueType/list",
          delete: "/marketing/marketingLeagueType/delete",
          deleteBatch: "/marketing/marketingLeagueType/deleteBatch",
          exportXlsUrl: "marketing/marketingLeagueType/exportXls",
          importExcelUrl: "marketing/marketingLeagueType/importExcel",
          settingSort:"/marketing/marketingLeagueType/settingSort",
      settingStatus:"/marketing/marketingLeagueType/settingStatus"
       },
        sortvisible:false,
        soertRecord:{},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        newSort:0,
        statusvisible:false,
        statusTitle:"",
        statusLabel:"",
        statusRecord:{},
        statusExplain:""
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
      sortClick(record){
        this.sortvisible=true;
        this.newSort=record.sort;
        this.soertRecord=record;
      },
      sortHandleOk(){
        getAction(this.url.settingSort, {id: this.soertRecord.id,sort:this.newSort}).then((res) => {

          if (res.success) {
            this.$message.success(res.message);
            this.modalFormOk();
          } else {
            this.$message.warning(res.message);
          }
        });
        this.sortvisible=false;

      },
      statusClick(record){
        this.statusvisible=true;
        this.statusExplain="";
        this.statusRecord=record;
        if(record.status==0){
          this.statusTitle="启用后该分类将可以使用。";
          this.statusLabel="您确定要启用";
        }
        if(record.status==1){
          this.statusTitle="停用后该分类将无法使用。";
          this.statusLabel="您确定要停用";
        }
      },
      statusHandleOk(){
        getAction(this.url.settingStatus, {id: this.statusRecord.id,explainStatus:this.statusExplain}).then((res) => {

          if (res.success) {
            this.$message.success(res.message);
            this.modalFormOk();
          } else {
            this.$message.warning(res.message);
          }
        });
        this.statusvisible=false;
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>