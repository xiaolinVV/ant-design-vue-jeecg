<template>
  <a-card :bordered="false" class="card-area">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="角色编码">
              <j-dict-select-tag
                v-model="queryParam.roleCode"
                placeholder="请选择角色"
                dictCode="sys_role,role_name,role_code"
                style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" allowClear style="width: 100%" placeholder="全部">
                <a-select-option value="1">启用</a-select-option>
                <a-select-option value="0">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="searchQuery">查询</a-button>
            <a-button style="margin-left: 8px" @click="searchReset">重置</a-button>
          </span>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="margin-top: 5px">
      <a-button type="primary" icon="plus" @click="handleAdd" v-has="'system:roleindex:add'">新增</a-button>
      <a-button type="default" icon="home" style="margin-left:8px" @click="openDefIndex">设置默认首页</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import" style="margin-left:8px">导入</a-button>
      </a-upload>
      <a-button type="primary" icon="download" @click="handleExportXls('角色首页配置')" style="margin-left:8px">导出</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域 -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择&nbsp;<a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项&nbsp;&nbsp;
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

        <span slot="routeSlot" slot-scope="text">{{ text ? '是' : '否' }}</span>
        <span slot="statusSlot" slot-scope="text, record">
          <a-switch :checked="record.status === '1' || record.status === 1" @change="(val)=>onStatusChange(val,record)" />
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)" v-has="'system:roleindex:edit'">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)" v-has="'system:roleindex:delete'">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>

    <!-- 表单 -->
    <role-index-modal ref="modalForm" @ok="modalFormOk" />

    <!-- 默认首页设置弹窗 -->
    <a-modal :visible="defVisible" title="设置默认首页" @ok="saveDefIndex" @cancel="defVisible=false" :confirmLoading="defLoading">
      <a-form-model :model="defForm" :label-col="{span:6}" :wrapper-col="{span:16}">
        <a-form-model-item label="路由地址">
          <a-input v-model="defForm.url" placeholder="例如 /dashboard/analysis" />
        </a-form-model-item>
        <a-form-model-item label="组件路径">
          <a-input v-model="defForm.component" placeholder="例如 dashboard/Analysis" />
        </a-form-model-item>
        <a-form-model-item label="是否路由">
          <a-switch v-model="defForm.isRoute" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import RoleIndexModal from './modules/RoleIndexModal'
import { getAction, httpAction } from '@/api/manage'
import JDictSelectTag from '@/components/dict/JDictSelectTag'

export default {
  name: 'RoleIndexList',
  mixins: [JeecgListMixin],
  components: { RoleIndexModal, JDictSelectTag },
  data() {
    return {
      description: '角色首页配置',
      queryParam: {},
      defVisible: false,
      defLoading: false,
      defForm: { url: '', component: '', isRoute: true },
      columns: [
        { title: '角色编码', align: 'center', dataIndex: 'roleCode' },
        { title: '路由地址', align: 'center', dataIndex: 'url' },
        { title: '组件', align: 'center', dataIndex: 'component' },
        { title: '是否路由', align: 'center', dataIndex: 'route', scopedSlots: { customRender: 'routeSlot' } },
        { title: '优先级', align: 'center', dataIndex: 'priority' },
        { title: '状态', align: 'center', dataIndex: 'status', scopedSlots: { customRender: 'statusSlot' } },
        { title: '创建时间', align: 'center', dataIndex: 'createTime' },
        { title: '操作', dataIndex: 'action', align: 'center', scopedSlots: { customRender: 'action' } }
      ],
      url: {
        list: '/sys/sysRoleIndex/list',
        delete: '/sys/sysRoleIndex/delete',
        deleteBatch: '/sys/sysRoleIndex/deleteBatch',
        exportXlsUrl: '/sys/sysRoleIndex/exportXls',
        importExcelUrl: '/sys/sysRoleIndex/importExcel'
      }
    }
  },
  created() {
    this.loadDefIndex()
  },
  methods: {
    handleAdd() {
      this.$refs.modalForm.add()
    },
    handleEdit(record) {
      this.$refs.modalForm.edit(record)
    },
    modalFormOk() {
      this.loadData()
    },
    onStatusChange(val, record) {
      const payload = Object.assign({}, record, { status: val ? '1' : '0' })
      httpAction('/sys/sysRoleIndex/edit', payload, 'put').then(res => {
        if (res.success) {
          this.$message.success('状态已更新')
          this.loadData()
        }
      })
    },
    openDefIndex() {
      this.defVisible = true
      this.loadDefIndex()
    },
    loadDefIndex() {
      getAction('/sys/sysRoleIndex/queryDefIndex').then(res => {
        if (res.success && res.result) {
          this.defForm = {
            url: res.result.url,
            component: res.result.component,
            isRoute: res.result.route
          }
        }
      })
    },
    saveDefIndex() {
      this.defLoading = true
      const params = {
        url: this.defForm.url,
        component: this.defForm.component,
        isRoute: this.defForm.isRoute
      }
      httpAction('/sys/sysRoleIndex/updateDefIndex', params, 'put').then(res => {
        if (res.success) {
          this.$message.success('默认首页已更新')
          this.defVisible = false
        }
      }).finally(() => {
        this.defLoading = false
      })
    }
  }
}
</script>
