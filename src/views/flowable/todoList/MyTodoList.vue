<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="关键字">
              <a-input placeholder="请输入关键字" v-model="queryParam.itemName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="申请时间">
              <j-date class="query-group-cust" v-model="queryParam.applyTimeBegin" placeholder="请选择开始日期" />
              <span class="query-group-split-cust"></span>
              <j-date class="query-group-cust" v-model="queryParam.applyTimeEnd" placeholder="请选择结束日期" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="申请人">
              <a-input placeholder="请输入申请人" v-model="queryParam.applyPeople"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="taskId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
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
          <a @click="handleProcess(record)">审批受理</a>

          <act-historic-detail-btn :data-id='record.dataId'></act-historic-detail-btn>
        </span>
      </a-table>
      <act-handle-modal ref="actHandleModal" @ok="modalFormOk" :form-component-url='formComponentUrl'></act-handle-modal>
    </div>

  </a-card>
</template>

<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {FlowableMixin} from "@views/flowable/mixin/FlowableMixin";
  import ActHandleModal from '@views/flowable/components/ActHandleModal'
  import ActHistoricDetailBtn from '@views/flowable/components/btn/ActHistoricDetailBtn'

  export default {
    name: 'MyTodoList',
    mixins:[JeecgListMixin, mixinDevice,FlowableMixin],
    components: {
      ActHandleModal,
      ActHistoricDetailBtn
    },
    data () {
      return {
        description: '待办任务',
        // 表头
        columns: [
          {
            title: '编号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'业务类型',
            align:"center",
            dataIndex: 'category_dictText'
          },
          {
            title:'标题',
            align:"center",
            dataIndex: 'title'
          },
          {
            title:'提交人',
            align:"center",
            dataIndex: 'startUserName'
          },
          {
            title:'提交时间',
            align:"center",
            dataIndex: 'createTime'
          },
          // {
          //   title:'流程编号',
          //   align:"center",
          //   dataIndex: 'procDefId'
          // },
          // {
          //   title:'任务id',
          //   align:"center",
          //   dataIndex: 'taskId'
          // },
          {
            title:'当前环节',
            align:"center",
            dataIndex: 'taskName'
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
          list: "/flowable/task/todoList"
        },
        candidateUsers: [],
        formComponentUrl: ""  // pc 表单组件地址
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
      initDictConfig(){
      },
      getSuperFieldList(){
      },
      goToJimuReport(record){
        let jimuReportId = record.jimuReportId
        let reportUrl = window._CONFIG['domianURL'] + '/jmreport/view/' + jimuReportId + '?token=' + Vue.ls.get(ACCESS_TOKEN)
        window.open(reportUrl)
      },
      handleProcess(record) {
        record.id = record.dataId
        this.formComponentUrl = record.pcFormUrl
        this.$refs.actHandleModal.show(record);
        this.$refs.actHandleModal.title=record.title
        this.$refs.actHandleModal.formBpm = true;
        this.$refs.actHandleModal.disableSubmit = false;
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>