<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="会员手机号">
              <a-input placeholder="请输入会员手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="参团编号">
              <a-input placeholder="请输入参团编号" v-model="queryParam.groupRecordNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="商品编号">
              <a-input placeholder="请输入商品编号" v-model="queryParam.goodNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="商品名称">
              <a-input placeholder="请输入商品名称" v-model="queryParam.goodName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="开始时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParams.buyStartTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="结束时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParams.buyStartEnd"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange2"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="拼团状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">未使用</a-select-option>
                <a-select-option :value="1">已使用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="24" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset2" icon="reload" style="margin-left: 8px">重置</a-button>
              <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('拼团基础设置')">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
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
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
        :scroll="{ x: 2500 }"
      >
        <template slot="headPortrait" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="record.headPortrait != undefined"
            :preview="'headPortrait' + index"
            :src="text"
            alt=""
          />
          <a-avatar
            shape="square"
            v-if="record.headPortrait == undefined || record.headPortrait == ''"
            :src="text"
            icon="user"
          />
        </template>
        <template slot="mainPicture" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="record.mainPicture != undefined"
            :preview="'mainPicture' + index"
            :src="getAvatarView(JSON.parse(record.mainPicture)[0])"
            alt=""
          />
          <a-avatar
            shape="square"
            v-if="record.mainPicture == undefined || record.mainPicture == ''"
            :src="getAvatarView(record.mainPicture)"
            icon="user"
          />
        </template>
        <template slot="status" slot-scope="text">
          <div v-if="text == 1">
            已使用
          </div>
          <div v-else>
            未使用
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

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
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingGroupGoodSpecification-modal ref="modalForm" @ok="modalFormOk"></marketingGroupGoodSpecification-modal>
  </a-card>
</template>

<script>
import MarketingGroupGoodSpecificationModal from './modules/MarketingGroupGoodSpecificationModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: 'MarketingGroupGoodSpecificationList',
  mixins: [JeecgListMixin],
  components: {
    MarketingGroupGoodSpecificationModal
  },
  data() {
    return {
      description: '拼团基础设置管理页面',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '会员头像',
          align: 'center',
          dataIndex: 'headPortrait',
          scopedSlots: { customRender: 'headPortrait' }
        },
        {
          title: '会员头像',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '团号',
          align: 'center',
          dataIndex: 'groupNo'
        },
        {
          title: '参团编号',
          align: 'center',
          dataIndex: 'groupRecordNo'
        },

        {
          title: '商品编号',
          align: 'center',
          dataIndex: 'goodNo'
        },
        {
          title: '商品图片', //相对地址（以json的形式存储多张）
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '商品名称',
          align: 'center',
          dataIndex: 'goodName'
        },
        {
          title: '市场价',
          align: 'center',
          dataIndex: 'marketPrice'
        },
        {
          title: '销售价',
          align: 'center',
          dataIndex: 'smallPrice'
        },
        {
          title: '活动价',
          align: 'center',
          dataIndex: 'activityPrice'
        },
        {
          title: '规格',
          align: 'center',
          dataIndex: 'marketingGroupGoodSpecificationId'
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'rewardNumber'
        },
        {
          title: '有效期（小时）',
          align: 'center',
          dataIndex: 'deadline'
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'buyStartTime'
        },
        {
          title: '结束时间',
          align: 'center',
          dataIndex: 'buyEndTime'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '使用时间',
          align: 'center',
          dataIndex: 'userTime'
        },
        {
          title: '订单编号',
          align: 'center',
          dataIndex: 'orderListId'
        }
      ],
      queryParams: {},
      url: {
        list: '/marketing/marketingGroupRecord/purchaseQualification',
        delete: '/marketing/marketingGroupGoodSpecification/delete',
        deleteBatch: '/marketing/marketingGroupGoodSpecification/deleteBatch',
        exportXlsUrl: 'marketing/marketingGroupGoodSpecification/exportXls',
        importExcelUrl: 'marketing/marketingGroupGoodSpecification/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    searchReset2() {
      this.queryParams = {}
      this.searchReset()
    },
    onDateChange: function(value, dateString) {
      this.queryParam.buyStartTimeStart = dateString[0]
      this.queryParam.buyStartTimeEnd = dateString[1]
    },
    onDateChange2: function(value, dateString) {
      this.queryParam.buyEndTimeStart = dateString[0]
      this.queryParam.buyEndTimeEnd = dateString[1]
    },
    getAvatarView: function(mainPicture) {
      return this.url.imgerver + '/' + mainPicture
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
