<!--供应商余额-->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="账号">
              <a-input placeholder="请输入" v-model="queryParam.userName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="联系人">
              <a-input placeholder="请输入" v-model="queryParam.linkman"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="联系人手机号">
              <a-input placeholder="请输入" v-model="queryParam.linkphone"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="供应商名称">
                <a-input placeholder="请输入" v-model="queryParam.name"></a-input>
              </a-form-item>
            </a-col>
          </template>
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
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!--<a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('供应商余额')">导出</a-button>-->
      <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
         <a-button type="primary" icon="import">导入</a-button>
       </a-upload>
       <a-dropdown v-if="selectedRowKeys.length > 0">
         <a-menu slot="overlay">
           <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
         </a-menu>
         <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
       </a-dropdown>-->
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
        :scroll="{x:1000}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util';
  import {getAction, postAction} from '@/api/manage'
  import Vue from 'vue'
  export default {
    name: "ProviderBalanceList",
    mixins: [JeecgListMixin],
    components: {
    },
    data () {
      return {
        description: '供应商余额',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            fixed: 'left',
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '账号',
            align: "center",
            dataIndex: 'userName'
          },
          {
            title: '供应商名称',
            align: "center",
            dataIndex: 'name'
          },
          {
            title: '所在城市',
            align: "center",
            dataIndex: 'areaAddress'
          },
          {
            title: '联系人',
            align: "center",
            dataIndex: 'linkman'
          },
          {
            title: '联系人手机号',
            align: "center",
            dataIndex: 'linkphone'
          },
          {
            title: '余额',
            align: "center",
            dataIndex: 'balance'
          },
        ],
        url: {
          list: "/providerManage/providerManage/findProviderBalance",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      getAvatarView: function (mainPicture) {
        return this.url.imgerver + "/" + mainPicture;
      },
    }
  }
</script>
<style scoped>
</style>