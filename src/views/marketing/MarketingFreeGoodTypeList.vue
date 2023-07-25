<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <!-- <a-col :md="6" :sm="8">
            <a-form-item label="创建年">
              <a-input placeholder="请输入创建年" v-model="queryParam.year"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="创建月">
              <a-input placeholder="请输入创建月" v-model="queryParam.month"></a-input>
            </a-form-item>
          </a-col> -->
          <!-- <template v-if="toggleSearchStatus"> -->
          <!-- <a-col :md="6" :sm="8">
            <a-form-item label="创建日">
              <a-input placeholder="请输入创建日" v-model="queryParam.day"></a-input>
            </a-form-item>
          </a-col> -->
          <a-col :md="8" :sm="8">
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
          <a-col :md="8" :sm="8">
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
          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">停用</a-select-option>
                <a-select-option :value="1">启用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="活动商品分类">
              <a-input placeholder="请输入活动商品分类" v-model="queryParam.typeName"></a-input>
            </a-form-item>
          </a-col>
          <!-- </template> -->
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset2" icon="reload" style="margin-left: 8px">重置</a-button>
              <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!-- <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('免单商品类型')">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
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
      </a-dropdown> -->
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
    <marketingFreeGoodType-modal ref="modalForm" @ok="modalFormOk"></marketingFreeGoodType-modal>
    <a-modal :title="statusChangeInfo.title" v-model="visible" @ok="hideModal()" okText="确认" cancelText="取消">
      <!--      <input style="display: none" :value="marketingFreeGoodTypeId" placeholder="id"/>-->
      <p>{{ statusChangeInfo.content }}</p>
      <a-textarea placeholder="说明" v-model="typeExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
    </a-modal>
  </a-card>
</template>

<script>
import MarketingFreeGoodTypeModal from './modules/MarketingFreeGoodTypeModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction, getAction, postAction, putAction } from '@/api/manage'

export default {
  name: 'MarketingFreeGoodTypeList',
  mixins: [JeecgListMixin],
  components: {
    MarketingFreeGoodTypeModal
  },
  data() {
    return {
      description: '免单商品类型管理页面',
      visible: false,
      typeExplain: '',
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
          title: '活动商品分类',
          align: 'center',
          dataIndex: 'typeName'
        },
        {
          title: '专区分类排序',
          align: 'center',
          dataIndex: 'sort'
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
          dataIndex: 'typeExplain'
        },

        // {
        //   title: '停用说明',
        //   align: 'center',
        //   dataIndex: 'closeExplain'
        // },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '创建者',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '更新者',
          align: 'center',
          dataIndex: 'updateBy'
        },

        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      marketingFreeGoodTypeId: '',
      url: {
        list: '/marketing/marketingFreeGoodType/list',
        delete: '/marketing/marketingFreeGoodType/delete',
        deleteBatch: '/marketing/marketingFreeGoodType/deleteBatch',
        exportXlsUrl: 'marketing/marketingFreeGoodType/exportXls',
        importExcelUrl: 'marketing/marketingFreeGoodType/importExcel',
        edit: '/marketing/marketingFreeGoodType/edit'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    statusChangeInfo({ operationStatus }) {
      return {
        title:
          operationStatus == 1
            ? '启用分类后，将展示该分类及该分类下的商品'
            : '停用分类后，不展示该分类及该分类下的商品',
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
    //启用
    updateStatus: function(id) {
      // var that = this
      // this.$confirm({
      //   title: '启用分类后，将展示该分类及该分类下的商品',
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
    showModal(id, operationStatus) {
      this.marketingFreeGoodTypeId = id
      this.visible = true
      this.typeExplain = ''
      this.operationStatus = operationStatus
    },
    //启用
    hideModal() {
      this.visible = false
      var that = this
      putAction(that.url.edit, {
        id: this.marketingFreeGoodTypeId,
        typeExplain: this.typeExplain,
        status: this.operationStatus
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
