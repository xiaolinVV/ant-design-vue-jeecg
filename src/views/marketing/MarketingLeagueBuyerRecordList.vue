<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="订单编号">
              <a-input placeholder="请输入订单编号" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="会员手机号">
              <a-input placeholder="请输入会员手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
<!--        <template v-if="toggleSearchStatus">
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
            <a-form-item label="会员列表id">
              <a-input placeholder="请输入会员列表id" v-model="queryParam.memberListId"></a-input>
            </a-form-item>
          </a-col>
          </template>-->
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            <!--  <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>-->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
     <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('加盟专区-购买记录')">导出</a-button>
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
        :scroll="{x:true}"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <template slot="mainPicture" slot-scope="text, record">
          <img style="width: 40px;height: 40px;" :src="getImgShop(text)">
        </template>
        <template slot="headPortrait" slot-scope="text, record">
          <img style="width: 40px;height: 40px;" :src="text">
        </template>

        <template slot="awardTotal" slot-scope="text, record">
          <a @click="marketingLeagueBuyerRecordAwardModalClick(record)">{{text}}</a>
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
    <marketing-league-buyer-record-award-modal ref="marketingLeagueBuyerRecordAwardModal"></marketing-league-buyer-record-award-modal>
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MarketingLeagueBuyerRecordAwardModal from'./modules/MarketingLeagueBuyerRecordAwardModal'

  export default {
    name: "MarketingLeagueBuyerRecordList",
    mixins:[JeecgListMixin],
    components: {
      MarketingLeagueBuyerRecordAwardModal
    },
    data () {
      return {
        description: '加盟专区-购买记录管理页面',
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
            title: '订单编号',
            align:"center",
            dataIndex: 'orderNo'
           },
		   {
            title: '商品主图',
            align:"center",
            dataIndex: 'mainPicture',
          scopedSlots:{customRender:'mainPicture'}
           },
		   {
            title: '商品名称',
            align:"center",
            dataIndex: 'goodName'
           },
		   {
            title: '专区分类',
            align:"center",
            dataIndex: 'typeName'
           },
		   {
            title: '订单金额',
            align:"center",
            dataIndex: 'actualPayment'
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
            scopedSlots:{customRender:'headPortrait'}
          },
          {
            title: '会员手机号',
            align:"center",
            dataIndex: 'phone'
          },
          {
            title: '会员昵称',
            align:"center",
            dataIndex: 'nickName'
          },
          {
            title: '收货地址',
            align:"center",
            dataIndex: 'shippingAddress'
          },
          {
            title: '奖励小计',
            align:"center",
            dataIndex: 'awardTotal',
            scopedSlots:{customRender:'awardTotal'}
          },
          {
            title: '付款时间',
            align:"center",
            dataIndex: 'createTime'
          }
        ],
		url: {
          list: "/marketing/marketingLeagueBuyerRecord/list",
          delete: "/marketing/marketingLeagueBuyerRecord/delete",
          deleteBatch: "/marketing/marketingLeagueBuyerRecord/deleteBatch",
          exportXlsUrl: "marketing/marketingLeagueBuyerRecord/exportXls",
          importExcelUrl: "marketing/marketingLeagueBuyerRecord/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
     getImgShop(text){
       return window._CONFIG['imgDomainURL']+'/'+JSON.parse(text)[0];
     },
      marketingLeagueBuyerRecordAwardModalClick(record){
       this.$refs.marketingLeagueBuyerRecordAwardModal.showModal(record);
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>