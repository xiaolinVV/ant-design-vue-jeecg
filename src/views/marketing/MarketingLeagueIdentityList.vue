<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="身份名称">
              <a-input placeholder="请输入身份名称" v-model="queryParam.identityName"></a-input>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!--<a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('身份设置')">导出</a-button>
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

        <template slot="interests" slot-scope="text,record">
            <span>{{getInterests(record)}}</span>
        </template>

        <template slot="getWay" slot-scope="text,record">
          <span v-if="text==0">注册</span>
          <span v-if="text==1">加盟专区下单</span>
          <span v-if="text==2">{{getMarketingLeagueIdentity(record.frontMarketingLeagueIdentityId)}}身份，直推3个{{getMarketingLeagueIdentity(record.afterMarketingLeagueIdentityId)}}</span>
          <span v-if="text==3">缴交{{record.payPrice}}</span>
          <span v-if="text==4">后台开通</span>
        </template>


        <template slot="poster" slot-scope="text, record">
          <img v-if="text" style="width: 50px" :src="getImgUrl(text)">
          <span v-else>--</span>
        </template>

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
    <marketingLeagueIdentity-modal ref="modalForm" @ok="modalFormOk"></marketingLeagueIdentity-modal>
  </a-card>
</template>

<script>
  import MarketingLeagueIdentityModal from './modules/MarketingLeagueIdentityModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {getAction } from '@/api/manage'

  export default {
    name: "MarketingLeagueIdentityList",
    mixins:[JeecgListMixin],
    components: {
      MarketingLeagueIdentityModal
    },
    data () {
      return {
        description: '身份设置管理页面',
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
            title: '身份名称',
            align:"center",
            dataIndex: 'identityName'
           },
		   {
            title: '是否默认',
            align:"center",
            dataIndex: 'isDefault',
            customRender:function(text) {
            if(text==1){
              return '是';
            }else{
              return '否';
            }
          }
           },
		   {
            title: '获得方式',
            align:"center",
            dataIndex: 'getWay',
         scopedSlots:{customRender:'getWay'}
           },
          {
            title: '权益',
            align:"center",
            dataIndex: 'interests',
            scopedSlots:{customRender:'interests'}
          },
		   {
            title: '是否附加身份',
            align:"center",
            dataIndex: 'additionalIdentity',
         customRender:function(text) {
           if(text==1){
             return '是';
           }else{
             return '否';
           }
         }
           },
		   {
            title: '是否支持附加身份',
            align:"center",
            dataIndex: 'supportAdditionalIdentity',
         customRender:function(text) {
           if(text==1){
             return '支持';
           }else{
             return '不支持';
           }
         }
           },
          {
            title: '宣传海报',
            align:"center",
            dataIndex: 'poster',
            scopedSlots:{customRender:'poster'}
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
              list: "/marketing/marketingLeagueIdentity/list",
              delete: "/marketing/marketingLeagueIdentity/delete",
              deleteBatch: "/marketing/marketingLeagueIdentity/deleteBatch",
              exportXlsUrl: "marketing/marketingLeagueIdentity/exportXls",
              importExcelUrl: "marketing/marketingLeagueIdentity/importExcel",
              getAll:"/marketing/marketingLeagueIdentity/getAll"
           },
        marketingLeagueIdentityData:[]
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    created(){
      this.getAll();
    },
    methods: {
      getImgUrl(url){
        return window._CONFIG['imgDomainURL']+"/"+url;
      },
      getAll() {
        console.log("方法进来了");
        this.$nextTick(() => {
          getAction(this.url.getAll, {}).then((res) => {
            if (res.success) {
              this.marketingLeagueIdentityData = res.result;
            } else {
              that.$message.warning(res.message);
            }
          });
        });
      },
        getMarketingLeagueIdentity(id){
       for (let item in this.marketingLeagueIdentityData){
         console.log(this.marketingLeagueIdentityData[item].id,"====",id);
         if(this.marketingLeagueIdentityData[item].id==id){
           return this.marketingLeagueIdentityData[item].identityName;
         }
       }
       return "";

      },
      getInterests(record){
        let interests=[];
        if(record.pushStraightReward==1){
          interests.push("直推奖励");
        }
        if(record.managerReward==1){
          interests.push("店长奖励");
        }
        if(record.storeManagerReward==1){
          interests.push("店长管理奖励");
        }
        if(record.cityServiceProviderAward==1){
          interests.push("城市服务商奖励");
        }

        if(record.superPartnerAward==1){
          interests.push("超级合伙人奖励");
        }

        if(record.storeManagerSupportAward==1){
          interests.push("店长扶持奖励");
        }
        if(record.partnerStoreReward==1){
          interests.push("合伙人店长奖励");
        }
        if(interests.length>0){
          return interests.join("、");
        }else{
          return "无";
        }
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>