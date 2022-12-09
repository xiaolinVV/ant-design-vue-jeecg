<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <!--<a-col :md="8" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status"    placeholder="请选择"     style="margin-right: 10px;">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option  :value="0">停用</a-select-option>
                <a-select-option  :value="1">启用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>-->
          <a-col :md="8" :sm="8">
            <a-form-item label="团队名称">
              <a-input placeholder="请输入" v-model="queryParam.groupName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="称号名称">
              <a-select v-model="queryParam.memberDesignationId" style="width: 100%" >
                <a-select-option value="">
                  全部
                </a-select-option>
                <a-select-option :value="item.memberDesignationId" v-for="(item,index) in titleList" :key="index">
                  {{item.name}}
                </a-select-option>
              </a-select>
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



    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a
        style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
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
        <template slot="chtq" slot-scope="text, record">
          均分当前称号分红资金
        </template>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
  </a-card>
</template>

<script>
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import { getAction } from '@/api/manage'
  import {filterObj} from '@/utils/util';
  export default {
    name: "MemberDesignationList",
    mixins: [JeecgListMixin],
    components: {
    },
    data () {
      return {
        description: '称号资金',
        titleList:[],
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
            title: '团队名称',
            align: "center",
            dataIndex: 'groupName'
          },
          {
            title: '称号名称',
            align: "center",
            dataIndex: 'name'
          },
          {
            title: '称号余额',
            align: "center",
            dataIndex: 'balance'
          },
          {
            title: '累计入账金额',
            align: "center",
            dataIndex: 'recordedMoney'
          },
          {
            title: '累计出账金额',
            align: "center",
            dataIndex: 'enterMoney'
          },
          /*
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }*/
        ],
        url: {
          list: "/memberDesignation/memberDesignation/list",
          delete: "/memberDesignation/memberDesignation/delete",
          deleteBatch: "/memberDesignation/memberDesignation/deleteBatch",
          exportXlsUrl: "memberDesignation/memberDesignation/exportXls",
          importExcelUrl: "memberDesignation/memberDesignation/importExcel",
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          memberDesignationNameList:"memberDesignation/memberDesignation/memberDesignationNameList"
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    created(){
      this.getTitleList();
    },
    methods: {
      getTitleList(){
        getAction(this.url.memberDesignationNameList).then(res=>{
          if(res.success){
            this.titleList = res.result
          }else{
            this.$message.warn(res.message)
          }

        })
      },
    }
  }
</script>
<style scoped>

</style>