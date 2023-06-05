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
            <a-form-item label="兑换券id">
              <a-input placeholder="请输入兑换券id" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="兑换券名称">
              <a-input placeholder="请输入兑换券名称" v-model="queryParam.name"></a-input>
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
        :scroll="{x:1500}"
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
  </a-modal>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: 'SelectCoinCerti',
    mixins:[JeecgListMixin],
    data(){
      return{
        disableMixinCreated: true,
        visible:false,
        confirmLoading:false,
        title:"选择兑换券",
        // 表头
        columns: [
          {
            title: '兑换券id',
            align:"center",
            dataIndex: 'id'
          },
          {
            title: '兑换券名称',
            align:"center",
            dataIndex: 'name'
          },
          {
            title: '用券时间',
            align:"center",
            dataIndex: 'usrTime'
          },
          {
            title: '兑换商品',
            align:"center",
            dataIndex: 'goodQuantity'
          },
          {
            title: '兑换方式',
            align:"center",
            dataIndex: 'certificateType'
          },
          {
            title: '使用人限制',
            align:"center",
            dataIndex: 'memberTypeName'
          },
          {
            title: '券剩余发行量',
            align:"center",
            dataIndex: 'discountSurplus'
          },
          {
            title: '核销门店',
            align:"center",
            dataIndex: 'storeQuantity'
          },
          {
            title: '核销奖励',
            align:"center",
            dataIndex: 'theReward'
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
        },
      }
    },
    methods:{
      showModal(record){
        console.log(record);
        this.visible=true;
        this.url.list="/marketingCertificate/marketingCertificate/findCertificateVOPage";
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
      }
    }
  }
</script>

<style scoped>

</style>