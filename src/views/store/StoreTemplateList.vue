<!--运费模板-->
<template>
  <a-card :bordered="false">
    <div>
      <a-form style="max-width: 100%; margin: 40px auto 0;">
        <a-alert
        message="可设定默认运费模版，注意：仅未被使用的模板可以删除"
        />
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!--<router-link :to="{ name: 'store-StoreManagePickUp' }">-->
      <!--<router-link :to="{ name: 'store-module-AddTemplate' }">-->
        <a-button  type="primary" icon="plus" @click="addTemplate(1)">添加</a-button>
      <!--</router-link>-->


      <!--</router-link>-->

    </div>
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
        <template slot="templateType" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.templateType==1">自定义</span>
            <span shape="square" v-else="record.templateType==0">包邮</span>
          </div>
        </template>
        <template slot="updateTime" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.updateTime==null">{{record.createTime}}</span>
            <span shape="square" v-if="record.updateTime!=null">{{record.updateTime}}</span>
          </div>
        </template>
        <template slot="isTemplate" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.isTemplate==1">是</span>
            <span shape="square" v-else>否</span>

          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="addTemplate(2,record)">编辑</a>
          <a-divider type="vertical"/>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <storeTemplate-modal ref="modalForm" @ok="modalFormOk"></storeTemplate-modal>
  </a-card>
</template>

<script>
  import StoreTemplateModal from './modules/StoreTemplateModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'

  export default {
    name: "StoreTemplateList",
    mixins: [JeecgListMixin],
    components: {
      StoreTemplateModal
    },
    data () {
      return {
        description: '运费模板管理页面',
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
            title: '模板名称',
            align: "center",
            dataIndex: 'name'
          },
          {
            title: '发货地描述',
            align: "center",
            dataIndex: 'placeDispatch'
          },
          {
            title: '模板类型',
            align: "center",
            dataIndex: 'templateType',
            scopedSlots: {customRender: "templateType"}
          },
          {
            title: '最后修改时间',
            align: "center",
            dataIndex: 'updateTime',
            scopedSlots: {customRender: "updateTime"}
          },{
            title: '是否默认',
            align: "center",
            dataIndex: 'isTemplate',
            scopedSlots: {customRender: "isTemplate"}
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/storeTemplate/storeTemplate/list",
          delete: "/storeTemplate/storeTemplate/delete",
          deleteBatch: "/storeTemplate/storeTemplate/deleteBatch",
          exportXlsUrl: "storeTemplate/storeTemplate/exportXls",
          importExcelUrl: "storeTemplate/storeTemplate/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      addTemplate(part,item){
          if(part == 2){
            localStorage.setItem('FreightTemplate',JSON.stringify(item));
          }else{
            localStorage.removeItem('FreightTemplate')
          }
        this.$router.push({path:'/store/modules/AddTemplate',query:{part}})
      },

    }
  }
</script>
<style scoped lang="less">

  .table-operator{
    margin: 10px 0;
  }
</style>