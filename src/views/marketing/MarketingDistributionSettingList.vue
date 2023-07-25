<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="手机号">
              <a-input placeholder="请输入" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="昵称">
              <a-input placeholder="请输入" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员类型">
              <j-dict-select-tag  v-model="queryParam.memberType"  placeholder="请选择会员类型"
                                  dictCode="member_type"/>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="推荐人">
                <a-input placeholder="请输入" v-model="queryParam.promoterName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="注册时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.createTime"
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
      <!--<a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('平台分销设置')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
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
      </a-dropdown>
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
        <template slot="headPortrait" slot-scope="text, record, index">
          <img class="clickShowImage " :preview="'headPortrait' + index" :src="record.headPortrait" alt="">
        </template>
        <template slot="address" slot-scope="text, record, index">
          <img class="clickShowImage " :preview="'address' + index" :src="ssAddressView(record.address)" alt="">
        </template>
        <template slot="mlSum" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a @click="showGoodInformation(record.id)">{{ record.mlSum }}</a>
          </div>
        </template>
        <template slot="totalCommission" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a @click="showBrokerage(record.id)">{{ record.totalCommission }}</a>
          </div>
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
    <marketingDistributionSetting-modal ref="modalForm" @ok="modalFormOk"></marketingDistributionSetting-modal>
    <AppMemberDistributionModal ref="AppMemberDistributionModal"></AppMemberDistributionModal>
    <AppMemberbrokerageModal ref="AppMemberbrokerageModal"></AppMemberbrokerageModal>
  </a-card>
</template>

<script>
  import MarketingDistributionSettingModal from './modules/MarketingDistributionSettingModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util';
  import AppMemberDistributionModal from './modules/AppMemberDistributionModal'
  import AppMemberbrokerageModal from './modules/AppMemberbrokerageModal'
  export default {
    name: "MarketingDistributionSettingList",
    mixins: [JeecgListMixin],
    components: {
      MarketingDistributionSettingModal,
      AppMemberDistributionModal,
      AppMemberbrokerageModal
    },
    data () {
      return {
        description: '平台分销设置管理页面',
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
            title: '头像',
            align: "center",
            dataIndex: 'headPortrait',
            scopedSlots: {customRender: "headPortrait"}
          },
          {
            title: '手机号',
            align: "center",
            dataIndex: 'phone'
          },
          {
            title: '昵称',
            align: "center",
            dataIndex: 'nickName'
          },
          {
            title: '会员类型',
            align: "center",
            dataIndex: 'memberType_dictText'
          },
          {
            title: '成员',
            align: "center",
            dataIndex: 'mlSum',
            scopedSlots: {customRender: "mlSum"}
          },
          {
            title: '累计佣金',
            align: "center",
            dataIndex: 'totalCommission',
            scopedSlots: {customRender: "totalCommission"}
          },
          {
            title: '可提现佣金',
            align: "center",
            dataIndex: 'haveWithdrawal'
          },
          {
            title: '已提现',
            align: "center",
            dataIndex: 'haveWithdrawal'
          },
          {
            title: '推荐人',
            align: "center",
            dataIndex: 'promoterName'
          },
          {
            title: '推广码',
            align: "center",
            dataIndex: 'address',
            scopedSlots: {customRender: "address"}
          },
          {
            title: '注册时间',
            align: "center",
            dataIndex: 'createTime'
          },
        ],
        url: {
          list: "/marketingDistributionSetting/marketingDistributionSetting/findDistributionSettingList",
          delete: "/marketingDistributionSetting/marketingDistributionSetting/delete",
          deleteBatch: "/marketingDistributionSetting/marketingDistributionSetting/deleteBatch",
          exportXlsUrl: "marketingDistributionSetting/marketingDistributionSetting/exportXls",
          importExcelUrl: "marketingDistributionSetting/marketingDistributionSetting/importExcel",
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
      showGoodInformation(id){
        this.$refs.AppMemberDistributionModal.showModalVisible(id);
      },
      showBrokerage(id){
        this.$refs.AppMemberbrokerageModal.showModalVisible(id);
      },
      getQueryParams(){
        var param = Object.assign({}, this.queryParam,this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTime; // 时间参数不传递后台
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        this.queryParam.createTime_begin=dateString[0];
        this.queryParam.createTime_end=dateString[1];
      },
      getAvatarView: function (headPortrait) {
        return this.url.imgerver + "/" + headPortrait;
      },
      ssAddressView: function (address) {
        return this.url.imgerver + "/" + address;
      },
    }
  }
</script>
<style scoped>

</style>