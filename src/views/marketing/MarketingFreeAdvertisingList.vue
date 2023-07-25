<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="广告标题">
              <a-input placeholder="请输入广告标题" v-model="queryParam.advertisingTitle"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="跳转类型">
              <a-select v-model="queryParam.jumpType" placeholder="请选择">
                <a-select-option value="0">无</a-select-option>
                <a-select-option value="1">商品</a-select-option>
                <a-select-option value="2">大图</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option value="0">停用</a-select-option>
                <a-select-option value="1">启动</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="创建时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam2.createTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="更新时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam2.updateTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange1"
              />
            </a-form-item>
          </a-col>

          <!--          </template>-->
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset2" icon="reload" style="margin-left: 8px">重置</a-button>
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
      <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('免单广告')">导出</a-button>
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
        <template slot="image" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="record.image != undefined"
            :preview="'image' + index"
            :src="getAvatarView(JSON.parse(record.image)[0])"
            alt=""
          />
          <a-avatar
            shape="square"
            v-if="record.image == undefined || record.image == ''"
            :src="getAvatarView(record.image)"
            icon="user"
          />
        </template>
        <template slot="jumpType" slot-scope="text">
          <div class="anty-img-wrap">
            <span shape="square" v-if="text == 0">无</span>
            <span shape="square" v-if="text == 1">商品详情</span>
            <span shape="square" v-if="text == 2">详情图</span>
            <span shape="square" v-if="text == 3">素材</span>
          </div>
        </template>

        <div class="anty-img-wrap" slot="status" slot-scope="text, record, index">
          <span shape="square" v-if="record.status == 0">停用</span>
          <span shape="square" v-if="record.status == 1">启用</span>
        </div>
        <span slot="action" slot-scope="text, record">
          <a v-if="record.status == 1" @click="showModal(record.id, 0)">停用</a>
          <a v-if="record.status == 0" @click="updateStatus(record.id)">启用</a>
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
    <marketingFreeAdvertising-modal ref="modalForm" @ok="modalFormOk"></marketingFreeAdvertising-modal>
    <a-modal :title="statusChangeInfo.title" v-model="visible" @ok="hideModal()" okText="确认" cancelText="取消">
      <p>{{ statusChangeInfo.content }}</p>
      <a-textarea placeholder="原因" v-model="statusExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
    </a-modal>
  </a-card>
</template>

<script>
import MarketingFreeAdvertisingModal from './modules/MarketingFreeAdvertisingModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction, getAction, postAction, putAction } from '@/api/manage'

export default {
  name: 'MarketingFreeAdvertisingList',
  mixins: [JeecgListMixin],
  components: {
    MarketingFreeAdvertisingModal
  },
  data() {
    return {
      description: '免单广告管理页面',
      statusExplain: '',
      visible: false,
      cahngeId: '',
      queryParam2: {},
      operationStatus: 0,
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
          title: '广告标题',
          align: 'center',
          dataIndex: 'advertisingTitle'
        },
        {
          title: '图片',
          align: 'center',
          dataIndex: 'image',
          scopedSlots: { customRender: 'image' }
        },
        {
          // ；0：无；1：商品；2：大图
          title: '跳转类型',
          align: 'center',
          dataIndex: 'jumpType',
          scopedSlots: { customRender: 'jumpType' }
        },
        {
          title: '地址',
          align: 'center',
          dataIndex: 'address'
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'startTime'
        },
        {
          title: '结束时间',
          align: 'center',
          dataIndex: 'endTime'
        },
        {
          // ；0：停用；1：启用
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '状态说明',
          align: 'center',
          dataIndex: 'statusExplain'
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
        list: '/marketing/marketingFreeAdvertising/list',
        delete: '/marketing/marketingFreeAdvertising/delete',
        deleteBatch: '/marketing/marketingFreeAdvertising/deleteBatch',
        exportXlsUrl: 'marketing/marketingFreeAdvertising/exportXls',
        importExcelUrl: 'marketing/marketingFreeAdvertising/importExcel',
        edit: '/marketing/marketingFreeAdvertising/edit',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    statusChangeInfo({ operationStatus }) {
      return {
        title: operationStatus == 1 ? '启动后广告该广告将可以访问' : '停用后广告该广告将无法访问。',
        content: operationStatus == 1 ? '您确定要启用吗？' : '您确定要停用吗？'
      }
    }
  },
  methods: {
    searchReset2() {
      this.queryParam2 = {}
      this.searchReset()
    },
    onDateChange: function(value, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    onDateChange1: function(value, dateString) {
      this.queryParam.updateTime_begin = dateString[0]
      this.queryParam.updateTime_end = dateString[1]
    },
    getAvatarView: function(mainPicture) {
      return this.url.imgerver + '/' + mainPicture
    },
    //启用
    updateStatus: function(id) {
      // var that = this
      // this.$confirm({
      //   title: '启动后广告，该广告将可以访问',
      //   content: '您确定要启用吗？',
      //   onOk: function() {
      //     putAction(that.url.edit, { id, status: '1' }).then(res => {
      //       if (res.success) {
      //         that.$message.success(res.message)
      //         that.loadData()
      //         that.onClearSelected()
      //       } else {
      //         that.$message.warning(res.message)
      //       }
      //     })
      //   }
      // })
      this.showModal(id, 1)
    },
    //停用
    hideModal() {
      this.visible = false
      var that = this
      putAction(that.url.edit, {
        id: this.cahngeId,
        statusExplain: this.statusExplain,
        status: this.operationStatus
      }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.success('修改失败')
        }
      })
    },
    showModal(id, operationStatus) {
      this.cahngeId = id
      this.visible = true
      this.statusExplain = ''
      this.operationStatus = operationStatus
    }
  }
}
</script>
<style scoped></style>
