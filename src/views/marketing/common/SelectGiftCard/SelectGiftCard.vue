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
            <a-form-item label="编号">
              <a-input placeholder="请输入编号" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="店铺名称">
              <a-input placeholder="请输入店铺名称" v-model="queryParam.storeName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="卡名称">
              <a-input placeholder="请输入店铺名称" v-model="queryParam.carName"></a-input>
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

        <template slot="timeWay" slot-scope="text, record">
          {{ handleTimeWay(record) }}
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
    name: 'SelectGiftCard',
    mixins:[JeecgListMixin],
    data(){
      return{
        visible:false,
        confirmLoading:false,
        title:"选择礼品卡",
        // 表头
        columns: [
          {
            title: '礼品卡编号',
            align:"center",
            dataIndex: 'serialNumber'
          },
          {
            title: '发行店铺',
            align:"center",
            dataIndex: 'storeName'
          },
          {
            title: '卡名称',
            align:"center",
            dataIndex: 'carName'
          },
          {
            title: '面额',
            align:"center",
            dataIndex: 'denomination'
          },
          {
            title: '可选商品',
            align:"center",
            dataIndex: 'goodCount'
          },
          {
            title: '有效期',
            align:"center",
            dataIndex: 'timeWay',
            scopedSlots:{customRender:'timeWay'}
          }
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
      handleTimeWay(record) {
        let timeWay = record.timeWay
        let result = ''
        if (timeWay == 1 || timeWay == 2) {
          if (timeWay == 1) {
            result += '当日起'
          } else {
            result += '次日起'
          }
          result += record.timeDigital
          if (record.timeUnit == 1) {
            result += '周'
          } else if (record.timeUnit == 2) {
            result += '月'
          } else {
            result += '天'
          }
          result += '内可用'
        } else {
          result = `${record.startTime}~${record.endTime}`
        }
        return result
      },
      showModal(record){
        console.log(record);
        this.visible=true;
        this.url.list="/marketing/marketingStoreGiftCardList/list";
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