<!--分销店铺列表-->
<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="店铺名称">
              <a-input placeholder="请输入" v-model="queryParam.storeManage"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="联系人">
              <a-input placeholder="" v-model="queryParam.bossName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="联系人手机">
              <a-input placeholder="" v-model="queryParam.bossPhone"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="分销状态">
                <a-select v-model="queryParam.status  " placeholder="请选择状态">
                  <a-select-option :value="0">停用</a-select-option>
                  <a-select-option :value="1">启动</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="更新时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.updateTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                />
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
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!--<a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('店铺分销设置')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a
        style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <!--<a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
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
        <template slot="logoAddr" slot-scope="text, record, index">
          <img class="clickShowImage " :preview="'logoAddr' + index" :src="getLogoAddrView(record.logoAddr)" alt="">
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
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
    <marketingStoreDistributionSetting-modal ref="modalForm"
                                             @ok="modalFormOk"></marketingStoreDistributionSetting-modal>
  </a-card>
</template>

<script>
  import MarketingStoreDistributionSettingModal from './modules/MarketingStoreDistributionSettingModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util';
  export default {
    name: "MarketingStoreDistributionSettingList",
    mixins: [JeecgListMixin],
    components: {
      MarketingStoreDistributionSettingModal
    },
    data () {
      return {
        description: '店铺分销',
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
            title: '店铺logo',
            align: "center",
            dataIndex: 'logoAddr',
            scopedSlots: {customRender: "logoAddr"}
          },
          {
            title: '店铺名称',
            align: "center",
            dataIndex: 'storeName'
          },
          {
            title: '联系人',
            align: "center",
            dataIndex: 'bossName'
          },
          {
            title: '联系人手机',
            align: "center",
            dataIndex: 'bossPhone'
          },
          {
            title: '分销状态',
            align: "center",
            dataIndex: 'statusName'
          },
          {
            title: '普通一级分销比例(%)',
            align: "center",
            dataIndex: 'commonFirst'
          },
          {
            title: '普通二级分销比例(%)',
            align: "center",
            dataIndex: 'commonSecond'
          },
          {
            title: 'vip一级分销比例(%)',
            align: "center",
            dataIndex: 'vipFirst'
          },
          {
            title: 'vip二级分销比例(%)',
            align: "center",
            dataIndex: 'vipSecond'
          },
          {
            title: '更新时间',
            align: "center",
            dataIndex: 'updateTime'
          },
          /*{
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }*/
        ],
        url: {
          list: "/marketingStoreDistributionSetting/marketingStoreDistributionSetting/findGiftBagStore",
          delete: "/marketingStoreDistributionSetting/marketingStoreDistributionSetting/delete",
          deleteBatch: "/marketingStoreDistributionSetting/marketingStoreDistributionSetting/deleteBatch",
          exportXlsUrl: "marketingStoreDistributionSetting/marketingStoreDistributionSetting/exportXls",
          importExcelUrl: "marketingStoreDistributionSetting/marketingStoreDistributionSetting/importExcel",
          imgerver: window._CONFIG['domianURL'] + "/sys/common/view",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      getQueryParams(){
        var param = Object.assign({}, this.queryParam,this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.updateTime; // 时间参数不传递后台
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        this.queryParam.updateTime_begin=dateString[0];
        this.queryParam.updateTime_end=dateString[1];
      },
      getLogoAddrView: function (logoAddr) {
        return this.url.imgerver + "/" +logoAddr ;
      },

    }
  }
</script>
<style scoped>

</style>