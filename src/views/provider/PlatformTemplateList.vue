<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="模板名称">
              <a-input placeholder="请输入" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="供应商">
              <a-input placeholder="请输入" v-model="queryParam.realname"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
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
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="addTemplate(1)" type="primary" icon="plus">添加</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-alert message="可设定默认运费模版，注意：仅未被使用的模板可以删除" type="info"  style="margin-bottom: 10px;"/>
      <a-table
        ref="table"
        size="middle"
        :columns="columns"
        bordered
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="rowSelection"
        @change="handleTableChange">
        <template slot="templateType" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.templateType==0">包邮</span>
            <span shape="square" v-if="record.templateType==1">自定义</span>
          </div>
        </template>
        <template slot="isTemplate" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.isTemplate==0">否</span>
            <span shape="square" v-if="record.isTemplate==1">是</span>
          </div>
        </template>
        <template slot="updateTime" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.updateTime==null">{{record.createTime}}</span>
            <span shape="square" v-if="record.updateTime!=null">{{record.updateTime}}</span>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="addTemplate(2,record)">编辑</a>

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
    <providerTemplate-modal ref="modalForm" @ok="modalFormOk"></providerTemplate-modal>
  </a-card>
</template>

<script>
  import ProviderTemplateModal from './modules/ProviderTemplateModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "PlatformTemplateList",
    mixins:[JeecgListMixin],
    components: {
      ProviderTemplateModal
    },
    data () {
      return {
        description: '供应商运费模板管理页面',
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
            title: '模板名称',
            align:"center",
            dataIndex: 'name'
          },
          {
            title: '发货地描述',
            align:"center",
            dataIndex: 'placeDispatch'
          },
          {
            title: '模板类型',
            align:"center",
            dataIndex: 'templateType',
            scopedSlots: {customRender: "templateType"}
          },
          {
            title: '最后编辑时间',
            align:"center",
            dataIndex: 'updateTime',
            scopedSlots: {customRender: "updateTime"}
          },
          {
            title: '供应商',
            align:"center",
            dataIndex: 'realname'
          },
          {
            title: '是否默认',
            align:"center",
            dataIndex: 'isTemplate',
            scopedSlots: {customRender: "isTemplate"}
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/providerTemplate/providerTemplate/Test",
          delete: "/providerTemplate/providerTemplate/deleteTemplate",
          deleteBatch: "/providerTemplate/providerTemplate/deleteBatch",
          exportXlsUrl: "providerTemplate/providerTemplate/exportXls",
          importExcelUrl: "providerTemplate/providerTemplate/importExcel",
          getUserByRoleName:"sys/user/getUserByRoleName"
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
      rowSelection() {
        const {selectedRowKeys} = this;
        return {
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          },
          getCheckboxProps: record => ({
            props: {
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            },
          }),
        };
      },
    },
    methods: {
      addTemplate(part,item){
        if(part == 1){
          localStorage.removeItem('supplierFreightTemplate')
        }
        if(part == 2){
          localStorage.setItem('supplierFreightTemplate',JSON.stringify(item))
        }
        this.$router.push({path:'/provider/modules/PlatformTemplateModel',query:{part}})
      },
    }
  }
</script>
<style scoped lang="less">
.table-operator{
  margin-bottom:10px
}
</style>