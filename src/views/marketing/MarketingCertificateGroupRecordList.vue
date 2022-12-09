<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="团号">
              <a-input placeholder="请输入团号" v-model="queryParam.marketingCertificateGroupManageId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="参团编号">
              <a-input placeholder="请输入参团编号" v-model="queryParam.tuxedoNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="兑换券id">
              <a-input placeholder="请输入兑换券id" v-model="queryParam.marketingCertificateGroupListId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="券号">
              <a-input placeholder="请输入券号" v-model="queryParam.qh"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="兑换券名称">
              <a-input placeholder="请输入兑换券名称" v-model="queryParam.certificateName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="会员手机号">
              <a-input placeholder="请输入会员手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="会员手机号">
              <a-input placeholder="请输入会员手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="拼团身份">
              <a-select v-model="queryParam.groupIdentity" placeholder="请选择拼团身份">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">参与人</a-select-option>
                <a-select-option :value="1">发起人</a-select-option>
              </a-select>
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
            <a-form-item label="加入时间">
              <a-range-picker
                v-model="queryParam2.joinDate"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
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
      <a-button type="primary" icon="download" @click="handleExportXls('拼好券记录')">导出</a-button>
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
        <template slot="headPortrait" slot-scope="text">
          <a-avatar preview="1" :src="text" alt="" style="width: 40px;height: 40px;" />
        </template>
        <template slot="groupIdentity" slot-scope="text">
          <div v-if="text == 1">
            发起人
          </div>
          <div v-else>
            参与人
          </div>
        </template>
        <template slot="status" slot-scope="text, record">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">进行中</span>
            <span shape="square" v-if="record.status == 1">已成功</span>
            <span shape="square" v-if="record.status == 2">已失败</span>
          </div>
        </template>

        <!-- <span slot="action" slot-scope="text, record">
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
        </span> -->
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingCertificateGroupRecord-modal ref="modalForm" @ok="modalFormOk"></marketingCertificateGroupRecord-modal>
  </a-card>
</template>

<script>
import MarketingCertificateGroupRecordModal from './modules/MarketingCertificateGroupRecordModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
export default {
  name: 'MarketingCertificateGroupRecordList',
  mixins: [JeecgListMixin],
  components: {
    MarketingCertificateGroupRecordModal
  },
  data() {
    return {
      description: '拼好券记录管理页面',
      queryParam2: {},
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
          // 拼好券团管理id
          title: '团号',
          align: 'center',
          dataIndex: 'marketingCertificateGroupManageId'
        },
        {
          title: '参团编号',
          align: 'center',
          dataIndex: 'tuxedoNumber'
        },
        {
          title: '参团时间',
          align: 'center',
          dataIndex: 'startTime'
        },
        {
          // 拼好券id
          title: '兑换券id',
          align: 'center',
          dataIndex: 'marketingCertificateGroupListId'
        },
        {
          title: '券号',
          align: 'center',
          dataIndex: 'qqzixuangu'
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
          title: '会员头像',
          align: 'center',
          dataIndex: 'headPortrait',
          scopedSlots: { customRender: 'headPortrait' }
        },
        {
          title: '会员手机号',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          // ；0：参与人；1：发起人
          title: '拼团身份',
          align: 'center',
          dataIndex: 'groupIdentity',
          scopedSlots: { customRender: 'groupIdentity' }
        },
        {
          // ；0：进行中；1：已成功；2：已失败
          title: '拼团状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        // {
        //   title: '开始时间、建团时间',
        //   align: 'center',
        //   dataIndex: 'startTime'
        // },

        {
          title: '成团时间',
          align: 'center',
          dataIndex: 'cloudsTime'
        },
        {
          title: '超时时间',
          align: 'center',
          dataIndex: 'endTime'
        }
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align: 'center',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      url: {
        list: '/marketingCertificateGroupRecord/marketingCertificateGroupRecord/list',
        delete: '/marketingCertificateGroupRecord/marketingCertificateGroupRecord/delete',
        deleteBatch: '/marketingCertificateGroupRecord/marketingCertificateGroupRecord/deleteBatch',
        exportXlsUrl: 'marketingCertificateGroupRecord/marketingCertificateGroupRecord/exportXls',
        importExcelUrl: 'marketingCertificateGroupRecord/marketingCertificateGroupRecord/importExcel',
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
    async searchReset2() {
      this.queryParam2 = {}
      await this.$nextTick()
      this.searchReset()
    },
    onDateChange: function(value, dateString) {
      this.queryParam.joinDate_begin = dateString[0]
      this.queryParam.joinDate_end = dateString[1]
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
