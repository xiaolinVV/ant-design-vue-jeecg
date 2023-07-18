<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="会员账号">
              <a-input placeholder="请输入" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员昵称">
              <a-input placeholder="请输入" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="礼品卡编号">
              <a-input placeholder="请输入礼品卡编号" v-model="queryParam.cardSerialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="礼品卡号">
              <a-input placeholder="请输入礼品卡号" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8" v-if="!isMerchant">
            <a-form-item label="发行店铺">
              <a-input placeholder="请输入发行店铺" v-model="queryParam.storeName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="卡名称">
              <a-input placeholder="请输入卡名称" v-model="queryParam.carName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择状态">
                <!-- ；0：已失效；1：可使用；2：已赠送 -->
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">已失效</a-select-option>
                <a-select-option :value="1">可使用</a-select-option>
                <a-select-option :value="2">已赠送</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item label="获得方式">
              <a-select v-model="queryParam.waysObtain" placeholder="请选择获得方式">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">礼包赠送</a-select-option>
                <a-select-option :value="1">好友赠送</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item label="获得时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.getTime"
                format="YYYY-MM-DD HH:MM:SS"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange2"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="有效期开始">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.effectTime"
                format="YYYY-MM-DD HH:MM:SS"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange3"
              />
            </a-form-item>
          </a-col>
          <!-- <a-col :md="8" :sm="8">
            <a-form-item label="有效期结束">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.endTime"
                format="YYYY-MM-DD HH:MM:SS"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange4"
              />
            </a-form-item>
          </a-col> -->
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
      <a-button type="primary" icon="download" @click="handleExportXls('店铺营销-店铺礼品卡-会员礼品卡')"
        >导出</a-button
      >
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
      <!-- <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> 
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown> -->
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :scroll="{ x: 2000 }"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="headPortrait" slot-scope="text, record, index">
          <img class="clickShowImage" v-if="text != undefined" :preview="'headPortrait' + index" :src="text" alt="" />
        </template>
        <template slot="waysObtain" slot-scope="text, record, index">
          <div v-if="text == 0">礼包赠送</div>
          <div v-if="text == 1">好友赠送</div>
        </template>
        <template slot="goodCount" slot-scope="text, record">
          <a @click="showModal(record)">{{ text }}</a>
        </template>
        <template slot="status" slot-scope="text">
          <div v-if="text == 0">已失效</div>
          <div v-if="text == 1">可使用</div>
          <div v-if="text == 2">已赠送</div>
        </template>

        <!-- <span slot="action" slot-scope="text, record">
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
        </span> -->
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingStoreGiftCardMemberList-modal ref="modalForm" @ok="modalFormOk"></marketingStoreGiftCardMemberList-modal>
    <MarketingStoreGiftCardCanSelectGoods ref="modalForm3"></MarketingStoreGiftCardCanSelectGoods>
  </a-card>
</template>

<script>
import MarketingStoreGiftCardMemberListModal from './modules/MarketingStoreGiftCardMemberListModal'
import MarketingStoreGiftCardCanSelectGoods from './modules/MarketingStoreGiftCardCanSelectGoods'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
export default {
  name: 'MarketingStoreGiftCardMemberListList',
  mixins: [JeecgListMixin],
  components: {
    MarketingStoreGiftCardMemberListModal,
    MarketingStoreGiftCardCanSelectGoods,
  },
  data() {
    return {
      description: '店铺会员礼品卡管理页面',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '会员账号',
          align: 'center',
          dataIndex: 'phone',
        },
        {
          title: '会员头像',
          align: 'center',
          dataIndex: 'headPortrait',
          scopedSlots: { customRender: 'headPortrait' },
        },
        {
          title: '会员昵称',
          align: 'center',
          dataIndex: 'nickName',
        },
        {
          title: '获得方式',
          align: 'center',
          dataIndex: 'waysObtain',
          scopedSlots: { customRender: 'waysObtain' },
        },
        {
          title: '获得时间',
          align: 'center',
          dataIndex: 'getTime',
        },
        {
          title: '礼品卡编号',
          align: 'center',
          dataIndex: 'cardSerialNumber',
        },
        {
          title: '礼品卡号',
          align: 'center',
          dataIndex: 'serialNumber',
        },
        {
          title: '发行店铺',
          align: 'center',
          dataIndex: 'storeName',
        },
        {
          title: '卡名称',
          align: 'center',
          dataIndex: 'carName',
        },
        {
          title: '可用面额',
          align: 'center',
          dataIndex: 'denomination',
        },
        {
          title: '可选商品',
          align: 'center',
          dataIndex: 'goodCount',
          scopedSlots: { customRender: 'goodCount' },
        },
        {
          title: '有效期开始',
          align: 'center',
          dataIndex: 'startTime',
        },
        {
          title: '有效期结束',
          align: 'center',
          dataIndex: 'endTime',
        },
        {
          // ；0：已失效；1：可使用；2：已赠送
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
      ],
      url: {
        list: '/marketing/marketingStoreGiftCardMemberList/list',
        delete: '/marketing/marketingStoreGiftCardMemberList/delete',
        deleteBatch: '/marketing/marketingStoreGiftCardMemberList/deleteBatch',
        exportXlsUrl: 'marketing/marketingStoreGiftCardMemberList/exportXls',
        importExcelUrl: 'marketing/marketingStoreGiftCardMemberList/importExcel',
      },
      isMerchant: false,
    }
  },
  created() {
    let userInfo = localStorage.getItem('pro__Login_Userinfo')
    if (userInfo) {
      userInfo = JSON.parse(userInfo)
      if (userInfo.value.userRole && userInfo.value.userRole.indexOf('Merchant') != -1) {
        delete this.columns[8]
        this.isMerchant = true
      }
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    showModal(record) {
      this.$refs.modalForm3.showModal(record)
    },
    /**查询栏时间区间查询*/
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.getTime
      delete param.effectTime

      return filterObj(param)
    },
    onDateChange2: function (value, dateString) {
      this.queryParam.getTime_begin = dateString[0]
      this.queryParam.getTime_end = dateString[1]
    },
    onDateChange3: function (value, dateString) {
      this.queryParam.startTime = dateString[0]
      this.queryParam.endTime = dateString[1]
    },
    onDateChange4: function (value, dateString) {
      this.queryParam.endTime_begin = dateString[0]
      this.queryParam.endTime_end = dateString[1]
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
