<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
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
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text,record">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
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

    <flow-my-business-config-modal ref="modalForm" @ok="modalFormOk"></flow-my-business-config-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import FlowMyBusinessConfigModal from './modules/FlowMyBusinessConfigModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'FlowMyBusinessConfigList',
    props: {
      processDefinitionKey: String,
    },
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      FlowMyBusinessConfigModal
    },
    data () {
      return {
        description: ' 流程配置表管理页面',
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
            title:'唯一编码',
            align:"center",
            dataIndex: 'code'
          },
          {
            title:'表名/自定义表单 CODE',
            align:"center",
            dataIndex: 'tableName'
          },
          {
            title:'表单类型',
            align:"center",
            dataIndex: 'formType_dictText'
          },
          {
            title:'业务标题表达式',
            align:"center",
            dataIndex: 'titleExpression'
          },
          {
            title:'流程状态列名',
            align:"center",
            dataIndex: 'bpmStatusColumnName'
          },
          {
            title:'积木报表',
            align:"center",
            dataIndex: 'jimuReportId_dictText'
          },
          {
            title:'PC表单组件地址',
            align:"center",
            dataIndex: 'pcFormUrl'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/flowMyBusinessConfig/flowMyBusinessConfig/list",
          delete: "/flowMyBusinessConfig/flowMyBusinessConfig/delete",
          deleteBatch: "/flowMyBusinessConfig/flowMyBusinessConfig/deleteBatch",
          exportXlsUrl: "/flowMyBusinessConfig/flowMyBusinessConfig/exportXls",
          importExcelUrl: "flowMyBusinessConfig/flowMyBusinessConfig/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
    this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      // 搜索之前执行 应用场景：对 queryParam 对象内的数据，做一些数据转换工作等
      beforeSearch(params){
        params.processDefinitionKey = this.processDefinitionKey
      },
      handleAdd: function () {
        this.$refs.modalForm.add(this.processDefinitionKey);
        this.$refs.modalForm.title = "新增";
        this.$refs.modalForm.disableSubmit = false;
      },
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'formType',text:'表单类型',dictCode:'ext_flow_form_type'})
        fieldList.push({type:'string',value:'tableName',text:'表名/自定义表单 CODE',dictCode:''})
        fieldList.push({type:'string',value:'code',text:'唯一编码',dictCode:''})
        fieldList.push({type:'string',value:'bpmStatusColumnName',text:'流程状态列名',dictCode:''})
        fieldList.push({type:'string',value:'titleExpression',text:'标题表达式',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>