<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleOrderCancel"
    @ok="submitOrderCancel"
    cancelText="关闭"
    :destroyOnClose=true>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="商品名称">
              <a-input placeholder="请输入商品名称" v-model="queryParam.goodName"></a-input>
            </a-form-item>
          </a-col>
<!--          <a-col :md="6" :sm="8">
            <a-form-item label="店铺名称">
              <a-input placeholder="请输入店铺名称" v-model="queryParam.storeName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="卡名称">
              <a-input placeholder="请输入店铺名称" v-model="queryParam.carName"></a-input>
            </a-form-item>
          </a-col>-->
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
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

        <template slot="mainPicture" slot-scope="text,record,index">
          <img class="clickShowImage " :preview="'mainPicture' + index" :src="getImgUrl(JSON.parse(text)[0])" alt="" />
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
  </a-modal>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: 'StoreGoodModal',
    mixins:[JeecgListMixin],
    data(){
      return{
        visible:false,
        confirmLoading:false,
        title:"选择商品",
        // 表头
        columns: [
          {
            title: '商品图片',
            align:"center",
            dataIndex: 'mainPicture',
            scopedSlots:{customRender:'mainPicture'}
          },
          {
            title: '商品名称',
            align:"center",
            dataIndex: 'goodName',

          },
          {
            title: '商品分类',
            align:"center",
            dataIndex: 'typeName'
          },
          {
            title: '市场价',
            align:"center",
            dataIndex: 'marketPrice'
          },
          /*    {
                title: '操作',
                dataIndex: 'action',
                align:"center",
                scopedSlots: { customRender: 'action' },
              }*/
        ],
        url: {
          list: "",
        }
      }
    },
    methods:{
      showModal(storeManageId){
        this.visible=true;
        this.url.list='/goodStoreList/goodStoreList/selectGood?storeManageId='+storeManageId;
        this.modalFormOk();
      },
      handleOrderCancel(){
        this.visible=false;
      },
      submitOrderCancel(){
        this.confirmLoading = true;
        this.$emit('ok',this.selectionRows);
        this.confirmLoading = false;
        this.visible=false;
      },
      getImgUrl(url){
        return window._CONFIG['imgDomainURL']+'/'+url;
      },
    }
  }
</script>

<style scoped>

</style>