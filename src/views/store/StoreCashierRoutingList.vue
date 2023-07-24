<template>
  <a-modal
    :title="title"
    :width="1200"
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
    <store-cashier-routing-modal ref="modalForm" @ok="modalFormOk"></store-cashier-routing-modal>
  </a-modal>
</template>

<script>
  import StoreCashierRoutingModal from './modules/StoreCashierRoutingModal'
  import { JeecgListMixinTwo } from '@/mixins/JeecgListMixinTwo'
  export default {
    name: "StoreCashierRoutingList",
    mixins:[JeecgListMixinTwo],
    components: {
      StoreCashierRoutingModal
    },
    data () {
      return {
        description: '收银分账设置',
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
           if(text==2){
             return '余额';
           }
         }
           },
          {
            title: '会员昵称',
            align:"center",
            dataIndex: 'nickName',
            customRender(text){
              if(text){
                return text;
              }else{
                return '-';
              }
            }
          },
          {
            title: '商户名称',
            align:"center",
            dataIndex: 'storeName',
            customRender(text){
              if(text){
                return text;
              }else{
                return '-';
              }
            }
          },
          {
            title: '角色',
            align:"center",
            dataIndex: 'roleType',
            customRender(text){
              if(text==0){
                return '会员';
              }
              if(text==1){
                return '商户';
              }
            }
          },
          {
            title: '是否本商户',
            align:"center",
            dataIndex: 'isStore',
            customRender(text){
              if(text==0){
                return '否';
              }
              if(text==1){
                return '是';
              }
            }
          },
          {
            title: '标签',
            align:"center",
            dataIndex: 'label'
          },
          {
            title: '分账方式',
            align:"center",
            dataIndex: 'fashionableWay',
            customRender(text) {
              if (text == 0) {
                return '交易百分比';
              }
              if (text == 1) {
                return '积分百分比';
              }
              if (text == 2) {
                return '扣除积分价值';
              }
            }
          },
          {
            title: '分账比例(%)',
            align:"center",
            dataIndex: 'fashionableProportion'
          },
		   {
            title: '汇付结算账户',
            align:"center",
            dataIndex: 'storeSettleAccount',
         customRender(text,record){
           if(record.storeSettleAccount){
             return record.storeSettleAccount;
           }
           if(record.memberSettleAccount){
             return record.memberSettleAccount;
           }
         }
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/store/storeCashierRouting/list",
          delete: "/store/storeCashierRouting/delete",
          deleteBatch: "/store/storeCashierRouting/deleteBatch",
          exportXlsUrl: "store/storeCashierRouting/exportXls",
          importExcelUrl: "store/storeCashierRouting/importExcel"
       },
        confirmLoading:false,
        title:'礼包分账',
        visible:false,
        confirmLoading:false,
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
        this.dataSource=[];
        this.visible=true;
        console.log(record);
        this.$nextTick(()=>{
          this.url.list=encodeURI("/store/storeCashierRouting/list?superQueryParams=[{'field':'storeManageId','rule':'eq','val':'"+record.id+"'},{'field':'fashionableType','rule':'eq','val':'"+record.fashionableType+"'},{'field':'delFlag','rule':'eq','val':'0'}]&column=createTime&order=desc");
          let fenzhang='';
          if(record.fashionableType==0){
            fenzhang='-收银分账';
          }
          if(record.fashionableType==1){
            fenzhang='-订单分账';
          }
          this.title=record.storeName+'('+record.subStoreName+')'+fenzhang;
          this.addparam.storeManageId=record.id;
          this.addparam.fashionableType=record.fashionableType;
          this.modalFormOk();
        });

      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>