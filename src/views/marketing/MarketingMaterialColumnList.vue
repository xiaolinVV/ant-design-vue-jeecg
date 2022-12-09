<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="栏目名称">
              <a-input placeholder="请输入" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="英文名称">
              <a-input placeholder="请输入" v-model="queryParam.englishName"></a-input>
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
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
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
      <a-button type="primary" icon="download" @click="handleExportXls('素材库栏目')">导出</a-button>

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
      >
        <template slot="logoAddr" slot-scope="text, record">
          <img
            preview="1"
            :src="url.imgerver + '/' + text"
            alt=""
            style="width: 50px;height: 50px;display: block;vertical-align: middle;margin: 0 auto"
          />
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">停用</span>
            <span shape="square" v-if="record.status == 1">启用</span>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a v-if="record.status == 1" @click="showModalStopStatus(record.id, '0')">停用</a>
          <a v-if="record.status == 0" @click="updateStatus(record.id, '1')">启用</a>
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
    <marketingMaterialColumn-modal ref="modalForm" @ok="modalFormOk"></marketingMaterialColumn-modal>
  </a-card>
</template>

<script>
import MarketingMaterialColumnModal from './modules/MarketingMaterialColumnModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'
export default {
  name: 'MarketingMaterialColumnList',
  mixins: [JeecgListMixin],
  components: {
    MarketingMaterialColumnModal
  },
  data() {
    return {
      description: '素材库栏目管理页面',
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
          title: '栏目名称',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '英文名称',
          align: 'center',
          dataIndex: 'englishName'
        },
        {
          title: '图标',
          align: 'center',
          dataIndex: 'logoAddr',
          scopedSlots: { customRender: 'logoAddr' }
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
        },
        {
          title: '状态', //；0：停用；1：启用
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '停用说明',
          align: 'center',
          dataIndex: 'closeExplain'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/marketingMaterialColumn/marketingMaterialColumn/list',
        delete: '/marketingMaterialColumn/marketingMaterialColumn/delete',
        deleteBatch: '/marketingMaterialColumn/marketingMaterialColumn/deleteBatch',
        exportXlsUrl: 'marketingMaterialColumn/marketingMaterialColumn/exportXls',
        importExcelUrl: 'marketingMaterialColumn/marketingMaterialColumn/importExcel',
        updateStatus: '/marketingMaterialColumn/marketingMaterialColumn/updateStatus',
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
    //停用
    showModalStopStatus(id) {
      this.$refs.modalForm.showModalStopStatus(id)
      this.$refs.modalForm.title = '停用'
      this.$refs.modalForm.disableSubmit = false
    },
    //启用
    updateStatus: function(id, status) {
      //this.stopRemark="";
      if (!this.url.updateStatus) {
        this.$message.error('请设置url.updateFrameStatus属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '启用后，栏目将恢复使用。',
        content: '您确定要启用吗？',
        onOk: function() {
          getAction(that.url.updateStatus, { ids: id, closeExplain: '', status: status }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
              that.onClearSelected()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
