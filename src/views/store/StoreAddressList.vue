<!--地址库-->
<template>
  <a-card :bordered="false">
    <div>
      <span>管理店铺的退货地址和发货地址</span>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">添加</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
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

        <span slot="isDeliver" slot-scope="text, record">
          <a-checkbox @change="onChange(record.id,record.isDeliver,'updataIsDeliverById')" :checked="record.isDeliver == 1">默认</a-checkbox>
        </span>
        <span slot="isReturn" slot-scope="text, record">
          <a-checkbox @change="onChange(record.id,record.isReturn,'updataIsReturnById')" :checked="record.isReturn == 1">默认</a-checkbox>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>

                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <storeAddress-modal ref="modalForm" @ok="modalFormOk"></storeAddress-modal>

  </a-card>
</template>

<script>
  import StoreAddressModal from './modules/StoreAddressModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {post} from '@/api/manage'
  import { getAction } from '@/api/manage'
  export default {
    name: "StoreAddressList",
    //定义公共部分方法
    mixins: [JeecgListMixin],
    inject:['rush'],
    components: {
      StoreAddressModal
    },
    data () {
      return {
        description: '店铺地址库管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '联系人',
            align: "center",
            dataIndex: 'contactName'
          },
          {
            title: '手机号',
            align: "center",
            dataIndex: 'contactPhone'
          },
          {
            title: '电话号',
            align: "center",
            dataIndex: 'contactTelephone'
          },
          {
            title: '所在城市',
            align: "center",
            dataIndex: 'areaAddress'
          },
          {
            title: '详细地址',
            align: "center",
            dataIndex: 'detailedAddress'
          },
          {
            title: '是否默认发货地址',
            align: "center",
            dataIndex: 'isDeliver',
            scopedSlots: {customRender: 'isDeliver'},
          },
          {
            title: '是否默认退货地址',
            align: "center",
            dataIndex: 'isReturn',
            scopedSlots: {customRender: 'isReturn'},
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/storeAddress/storeAddress/list",
          delete: "/storeAddress/storeAddress/delete",
          deleteBatch: "/storeAddress/storeAddress/deleteBatch",
          exportXlsUrl: "storeAddress/storeAddress/exportXls",
          importExcelUrl: "storeAddress/storeAddress/importExcel",
          updataIsDeliverById: "storeAddress/storeAddress/updataIsDeliverById",
          updataIsReturnById:"storeAddress/storeAddress/updataIsReturnById"
        },
        addressId: "",
        isReturn :"",
        isDeliver: "",
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      //id  原判断值  请求地址字段
      onChange(id,pd,url) {
          let result = pd == 0?1:0
          for(let a = 0;a<this.dataSource.length;a++){
            if(this.dataSource[a].id == id && url == 'updataIsDeliverById'){
               this.dataSource[a].isDeliver = result
               break;
            }
            if(this.dataSource[a].id == id && url == 'updataIsReturnById'){
              this.dataSource[a].isReturn = result
              break;
            }
          }
          this.$nextTick(()=>{
            let obj;
            if(url == 'updataIsDeliverById'){
              obj = {
                id,
                isDeliver:result,
              }
            }else{
              obj = {
                id,
                isReturn:result,
              }
            }
            //接口接入
            getAction(this.url[url], obj).then((res) => {
              if (res.success) {
                this.$message.success(res.message);
                this.rush();
              } else {
                this.$message.warning(res.message);
                this.rush();
              }
            });
          })

      }
    }
  }
</script>
<style scoped lang="less">
  .table-operator{
    margin: 10px 0;
  }

</style>