<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="公告标题">
              <a-input placeholder="请输入公告标题" v-model="queryParam.announcementTitle"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="是否强推">
              <!--下拉框-->
              <a-select v-model="queryParam.strongPush" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option value="0">否</a-select-option>
                <a-select-option value="1">是</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="创建时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.createTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="更新时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.updateTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange1"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!--              <a @click="handleToggleSearch" style="margin-left: 8px">-->
              <!--                {{ toggleSearchStatus ? '收起' : '展开' }}-->
              <!--                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
              <!--              </a>-->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('免单公告')">导出</a-button>
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
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
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
      >
        <template slot="strongPush" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.strongPush == 0">否</span>
            <span shape="square" v-if="record.strongPush == 1">是</span>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a v-if="record.strongPush == 0" @click="showSetStrongPush(record)">设置强推</a>
          <a v-else @click="showSetStrongPush(record)">取消强推</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingFreeAnnouncement-modal ref="modalForm" @ok="modalFormOk"></marketingFreeAnnouncement-modal>
    <a-modal v-model="visible" @ok="hideModal()" okText="确认" cancelText="取消">
      <i style="color: #faad14;font-size: 22px;margin-right: 16px;float: left;">
        <svg
          viewBox="64 64 896 896"
          data-icon="question-circle"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
          class=""
        >
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
          ></path>
          <path
            d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0 1 30.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"
          ></path>
        </svg>
      </i>
      <h3>{{ strongPushTitle }}</h3>
      <p>您确定要{{ strongPush == 1 ? '取消' : '设置' }}吗？</p>
      <a-textarea placeholder="停用原因" v-model="explain" :autosize="{ minRows: 3, maxRows: 6 }" />
    </a-modal>
  </a-card>
</template>

<script>
import MarketingFreeAnnouncementModal from './modules/MarketingFreeAnnouncementModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { deleteAction, getAction, downFile, putAction } from '@/api/manage'
export default {
  name: 'MarketingFreeAnnouncementList',
  mixins: [JeecgListMixin],
  components: {
    MarketingFreeAnnouncementModal
  },
  data() {
    return {
      description: '免单公告管理页面',
      explain: '',
      strongPush: '',
      hasStrongPush: false,
      // strongPushId: '',
      visible: false,
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
          title: '公告标题',
          align: 'center',
          dataIndex: 'announcementTitle'
        },
        {
          // ；0：否；1：是
          title: '是否强推',
          align: 'center',
          dataIndex: 'strongPush',
          scopedSlots: { customRender: 'strongPush' }
        },
        {
          title: '创建者',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '更新者',
          align: 'center',
          dataIndex: 'updateBy'
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/marketing/marketingFreeAnnouncement/list',
        delete: '/marketing/marketingFreeAnnouncement/delete',
        deleteBatch: '/marketing/marketingFreeAnnouncement/deleteBatch',
        exportXlsUrl: 'marketing/marketingFreeAnnouncement/exportXls',
        importExcelUrl: 'marketing/marketingFreeAnnouncement/importExcel',
        updateStatusById: 'marketing/marketingFreeAnnouncement/edit',
        hasStrongPushCount: 'marketing/marketingFreeAnnouncement/hasStrongPushCount'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    strongPushTitle({ strongPush, hasStrongPush }) {
      if (strongPush == 1) {
        return '取消强推后，该公告内容将不再弹出，用户可在公告列表查看'
      } else {
        return hasStrongPush
          ? '当前已存在一个强推公告，是否替换强推广告，替换后，新的公告除了在公告列表展示之外也将在用户进入免单活动页面后弹窗展示'
          : '设置强推后，该公告除了在公告列表展示之外也将在用户进入免单活动页面后弹窗展示'
      }
    }
  },
  watch: {
    loading(newVal) {
      if (newVal) {
        getAction(this.url.hasStrongPushCount).then(res => {
          if (res.success) {
            this.hasStrongPush = res.result > 0 ? true : false
          }
        })
      }
    }
  },
  methods: {
    onDateChange: function(value, dateString) {
      this.queryParam.createTimeStart = dateString[0]
      this.queryParam.createTimeEnd = dateString[1]
    },
    onDateChange1: function(value, dateString) {
      this.queryParam.updateTimeStart = dateString[0]
      this.queryParam.updateTimeEnd = dateString[1]
    },
    showSetStrongPush(record) {
      this.strongPush = record.strongPush
      // this.strongPushId = record.id
      this.StrongPushRecord = record
      this.explain = ''
      this.visible = true
    },
    hideModal() {
      this.visible = false
      var that = this
      putAction(that.url.updateStatusById, {
        ...this.StrongPushRecord,
        explain: this.explain,
        strongPush: this.strongPush == 1 ? 0 : 1
      }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.success('修改失败')
        }
      })
    }
  }
}
</script>
<style scoped></style>
