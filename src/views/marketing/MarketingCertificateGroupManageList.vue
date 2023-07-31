<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="团号">
              <a-input placeholder="请输入团号" v-model="queryParam.groupNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="兑换券id">
              <a-input placeholder="请输入兑换券id" v-model="queryParam.marketingCertificateId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="兑换券名称">
              <a-input placeholder="请输入兑换券名称" v-model="queryParam.certificateName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="拼团状态">
              <a-select v-model="queryParam.status" placeholder="请选择拼团状态">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">进行中</a-select-option>
                <a-select-option :value="1">已成功</a-select-option>
                <a-select-option :value="2">已失败</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="建团时间">
              <a-range-picker
                v-model="queryParam2.startTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onStartTimeStart"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="成团时间">
              <a-range-picker
                v-model="queryParam2.cloudsTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onCloudsTimeStart"
              />
            </a-form-item>
          </a-col>

          <a-col :md="24" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset2" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <!-- <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('拼好券管理')">导出</a-button>
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
    </div> -->

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
        :scroll="{ x: 2500 }"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="status" slot-scope="text, record">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">进行中</span>
            <span shape="square" v-if="record.status == 1">已成功</span>
            <span shape="square" v-if="record.status == 2">已失败</span>
          </div>
        </template>
        <template slot="mainPicture" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="record.mainPicture != undefined"
            :preview="'mainPicture' + index"
            :src="handleImage(text)"
            alt=""
          />
          <a-avatar
            shape="square"
            v-if="record.mainPicture == undefined || record.mainPicture == ''"
            :src="handleImage(text)"
            icon="user"
          />
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="toDetail(record)">详情</a>
          <a-divider type="vertical" v-if="record.status == 0" />
          <a @click="toDetail(record, true)" v-if="record.status == 0">拼团控制</a>
        </span>
        <!-- <span slot="action" slot-scope="text, record"> -->
        <!-- <a @click="handleEdit(record)">编辑</a>

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
          </a-dropdown> -->
        <!-- </span> -->
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingCertificateGroupManage-modal ref="modalForm" @ok="modalFormOk"></marketingCertificateGroupManage-modal>
  </a-card>
</template>

<script>
import MarketingCertificateGroupManageModal from './modules/MarketingCertificateGroupManageModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
export default {
  name: 'MarketingCertificateGroupManageList',
  mixins: [JeecgListMixin],
  components: {
    MarketingCertificateGroupManageModal
  },
  data() {
    return {
      description: '拼好券管理管理页面',
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
        // {
        //   title: '创建年',
        //   align: 'center',
        //   dataIndex: 'year'
        // },
        // {
        //   title: '创建月',
        //   align: 'center',
        //   dataIndex: 'month'
        // },
        // {
        //   title: '创建日',
        //   align: 'center',
        //   dataIndex: 'day'
        // },
        // {
        //   title: '删除状态（0，正常，1已删除）',
        //   align: 'center',
        //   dataIndex: 'delFlag'
        // },
        {
          title: '团号',
          align: 'center',
          dataIndex: 'groupNo'
        },
        {
          title: '兑换券id',
          align: 'center',
          dataIndex: 'marketingCertificateId'
        },
        {
          title: '兑换券名称',
          align: 'center',
          dataIndex: 'certificateName'
        },
        {
          title: '主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '市场价',
          align: 'center',
          dataIndex: 'marketPrice'
        },
        {
          title: '销售价',
          align: 'center',
          dataIndex: 'price'
        },
        {
          title: '成本价',
          align: 'center',
          dataIndex: 'costPrice'
        },
        {
          title: '活动价',
          align: 'center',
          dataIndex: 'activityPrice'
        },
        {
          title: '成团人数',
          align: 'center',
          dataIndex: 'numberClusters'
        },
        {
          title: '参团人数',
          align: 'center',
          dataIndex: 'numberTuxedo'
        },
        {
          title: '拼团状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '建团时间',
          align: 'center',
          dataIndex: 'startTime'
        },
        {
          title: '超时时间',
          align: 'center',
          dataIndex: 'endTime'
        },
        {
          title: '成团时间',
          align: 'center',
          dataIndex: 'cloudsTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParam2: {},
      url: {
        list: '/marketingCertificateGroupManage/marketingCertificateGroupManage/list',
        delete: '/marketingCertificateGroupManage/marketingCertificateGroupManage/delete',
        deleteBatch: '/marketingCertificateGroupManage/marketingCertificateGroupManage/deleteBatch',
        exportXlsUrl: 'marketingCertificateGroupManage/marketingCertificateGroupManage/exportXls',
        importExcelUrl: 'marketingCertificateGroupManage/marketingCertificateGroupManage/importExcel',
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
    toDetail(item, isControl = false) {
      this.$router.push({ path: '/marketing/MarketingCertificateGroupOrderDetail', query: { id: item.id, isControl } })
    },
    searchReset2() {
      this.queryParam2 = {}
      this.$nextTick(() => {
        this.searchReset()
      })
    },
    onStartTimeStart: function(value, dateString) {
      this.queryParam2.startTime_begin = dateString[0]
      this.queryParam2.startTime_end = dateString[1]
    },
    onCloudsTimeStart: function(value, dateString) {
      this.queryParam2.cloudsTime_begin = dateString[0]
      this.queryParam2.cloudsTime_end = dateString[1]
    },
    handleImage(imgUrl) {
      if (imgUrl) {
        try {
          return this.url.imgerver + '/' + Object.values(JSON.parse(imgUrl))[0]
        } catch (error) {
          console.error(error, '图片解析出错')
        }
      }
      return ''
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
