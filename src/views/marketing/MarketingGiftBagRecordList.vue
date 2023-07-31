<!--礼包购买记录-->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="流水号">
              <a-input placeholder="请输入" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
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
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="礼包编号">
                <a-input placeholder="" v-model="queryParam.giftNo"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="礼包名称">
                <a-input placeholder="" v-model="queryParam.giftName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="购买时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.payTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                  @ok="onDateOk"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="推广人">
                <a-input placeholder="" v-model="queryParam.giftName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="二级推广人">
                <a-input placeholder="" v-model="queryParam.promoterTwoName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="归属店铺">
                <a-input placeholder="" v-model="queryParam.storeName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="销售渠道">
                <a-input placeholder="" v-model="queryParam.channelName"></a-input>
              </a-form-item>
            </a-col>
            <!-- <a-col :md="8" :sm="8">
              <a-form-item label="省代">
                <a-input placeholder="" v-model="queryParam.giftName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="市代">
                <a-input placeholder="" v-model="queryParam.giftName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="县代">
                <a-input placeholder="" v-model="queryParam.giftName"></a-input>
              </a-form-item>
            </a-col>-->
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
      <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('平台营销-礼包管理-礼包购买记录')"
        >导出</a-button
      >
      <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
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
      </a-dropdown> -->
    </div>

    <!-- table区域-begin -->
    <div>
      <!--<div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a
        style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>-->

      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        :columns="columns"
        :scroll="{ x: 2500 }"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="headPortrait" slot-scope="text, record, index">
          <img class="clickShowImage" :preview="'headPortrait' + index" :src="record.headPortrait" alt="" />
        </template>
        <template slot="giftContent" slot-scope="text, record, index">
          <a href="javascript:;" @click="showContentModal(record)">{{ record.giftName }}</a>
        </template>
        <template slot="promoterName" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.promoterName == null">~</span>
            <span v-if="record.promoterName != null">{{ record.promoterName }}</span>
          </div>
        </template>
        <template slot="storeName" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.storeName == null">-</span>
            <span v-if="record.storeName != null">{{ record.storeName }}</span>
          </div>
        </template>
        <template slot="channelName" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.channelName == null"
              ><a @click="marketingGiftBagRecordChannelModelClick(record)">-</a></span
            >
            <span v-if="record.channelName != null"
              ><a @click="marketingGiftBagRecordChannelModelClick(record)">{{ record.channelName }}</a></span
            >
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="marketingGiftRecordQrcodeClick(record)">礼包二维码</a>
          <!--<a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>-->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingGiftBagRecord-modal ref="modalForm" @ok="modalFormOk"></marketingGiftBagRecord-modal>
    <MarketingGiftPackageModal ref="MarketingGiftPackageModal"></MarketingGiftPackageModal>
    <marketing-gift-record-qrcode ref="marketingGiftRecordQrcodeModal" @ok="modalFormOk"></marketing-gift-record-qrcode>
    <!--销售渠道的修改-->
    <marketing-gift-bag-record-channel-model
      ref="marketingGiftBagRecordChannelModel"
      @ok="modalFormOk"
    ></marketing-gift-bag-record-channel-model>
  </a-card>
</template>

<script>
import MarketingGiftBagRecordModal from './modules/MarketingGiftBagRecordModal'
import MarketingGiftPackageModal from './modules/MarketingGiftPackageModal'
import MarketingGiftRecordQrcode from './modules/MarketingGiftRecordQrcode'
import MarketingGiftBagRecordChannelModel from './modules/MarketingGiftBagRecordChannelModel'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
export default {
  name: 'MarketingGiftBagRecordList',
  mixins: [JeecgListMixin],
  components: {
    MarketingGiftBagRecordModal,
    MarketingGiftPackageModal,
    MarketingGiftRecordQrcode,
    MarketingGiftBagRecordChannelModel,
  },
  data() {
    return {
      description: '礼包购买记录',
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
          title: '流水号',
          align: 'center',
          dataIndex: 'id',
        },
        {
          title: '头像',
          align: 'center',
          dataIndex: 'headPortrait',
          scopedSlots: { customRender: 'headPortrait' },
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'phone',
        },
        {
          title: '昵称',
          align: 'center',
          dataIndex: 'nickName',
        },
        {
          title: '礼包编号',
          align: 'center',
          dataIndex: 'giftNo',
        },
        {
          title: '礼包名称',
          align: 'center',
          dataIndex: 'giftName',
        },
        {
          title: '礼包价格',
          align: 'center',
          dataIndex: 'price',
        },
        {
          title: '礼包内容',
          align: 'center',
          dataIndex: 'giftContent',
          scopedSlots: { customRender: 'giftContent' },
        },
        {
          title: '礼包发行时间',
          align: 'center',
          dataIndex: 'bagTime',
        },
        {
          title: '购买时间',
          align: 'center',
          dataIndex: 'createTime',
        },
        {
          title: '推广人',
          align: 'center',
          dataIndex: 'promoterName',
          scopedSlots: { customRender: 'promoterName' },
        },
        {
          title: '二级推广人',
          align: 'center',
          dataIndex: 'promoterTwoName',
          scopedSlots: { customRender: 'promoterTwoName' },
        },
        {
          title: '归属店铺',
          align: 'center',
          dataIndex: 'storeName',
          scopedSlots: { customRender: 'storeName' },
        },
        {
          title: '销售渠道',
          align: 'center',
          dataIndex: 'channelName',
          scopedSlots: { customRender: 'channelName' },
        },
        {
          title: '分享人',
          align: 'center',
          dataIndex: 'shareName',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          fixed: 'right',
        },
      ],
      url: {
        list: '/marketingGiftBagRecord/marketingGiftBagRecord/findGiftBagRecord',
        delete: '/marketingGiftBagRecord/marketingGiftBagRecord/delete',
        deleteBatch: '/marketingGiftBagRecord/marketingGiftBagRecord/deleteBatch',
        exportXlsUrl: 'marketingGiftBagRecord/marketingGiftBagRecord/exportXls',
        importExcelUrl: 'marketingGiftBagRecord/marketingGiftBagRecord/importExcel',
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    marketingGiftBagRecordChannelModelClick(record) {
      this.$refs.marketingGiftBagRecordChannelModel.showModal(record)
    },
    showContentModal(record) {
      this.$refs.MarketingGiftPackageModal.totalModal(record)
    },
    /**查询栏时间区间查询*/
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.payTime // 时间参数不传递后台
      delete param.bagTime // 时间参数不传递后台
      return filterObj(param)
    },
    onDateChange: function (value, dateString) {
      this.queryParam.payTime_begin = dateString[0]
      this.queryParam.payTime_end = dateString[1]
    },
    onDateChange1: function (value, dateString) {
      this.queryParam.startTime_begin = dateString[0]
      this.queryParam.endTime_end = dateString[1]
    },
    getAvatarView: function (headPortrait) {
      return this.url.imgerver + '/' + headPortrait
    },
    marketingGiftRecordQrcodeClick(record) {
      this.$refs.marketingGiftRecordQrcodeModal.showMarketingGiftRecordQrcodeModal(record)
    },
  },
}
</script>
<style scoped></style>
