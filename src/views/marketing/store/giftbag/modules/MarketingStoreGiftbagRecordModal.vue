<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading">

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
    </a-spin>
  </a-modal>
</template>

<script>
  import { JeecgListMixinTwo } from '@/mixins/JeecgListMixinTwo'

  export default {
    name: "MarketingStoreGiftbagRecordModal",
    mixins:[JeecgListMixinTwo],
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
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
            title: '分红人员',
            align:"center",
            dataIndex: 'memebrListId',
            customRender(text,record){

              if(record.memebrListId){
                return record.memberList.phone;
              }
              if(record.storeManageId){
                return record.storeManage.storeName+"("+record.storeManage.subStoreName+")";
              }

              if(record.memberDesignationId){
                return '团队多名成员'
              }

            }
          },
          {
            title: '分红角色',
            align:"center",
            dataIndex: 'roleName'
          },
          {
            title: '交易类型',
            align:"center",
            dataIndex: 'payType'
          },
          {
            title: '分红金额',
            align:"center",
            dataIndex: 'shareBonus'
          },
        ],
        confirmLoading: false,
        url: {
          list: "",
        },
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.url.list=encodeURI("/marketing.store.giftbag/marketingStoreGiftbagDividend/list?superQueryParams=[{'field':'marketingStoreGiftbagRecordId','rule':'eq','val':'"+this.model.id+"'}]&column=createTime&order=desc");
        this.visible = true;
        this.modalFormOk();
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.close();
      },
      handleCancel () {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>