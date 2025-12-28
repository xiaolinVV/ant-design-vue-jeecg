<template>
  <j-modal :title="title" :width="600" :visible="visible" @ok="handleOk" @cancel="handleCancel" :confirmLoading="confirmLoading">
    <a-form-model :model="model" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="validatorRules" ref="form">
      <a-form-model-item label="角色编码" prop="roleCode">
        <j-dict-select-tag
          v-model="model.roleCode"
          placeholder="请选择角色"
          dictCode="sys_role,role_name,role_code"
          style="width: 100%" />
      </a-form-model-item>
      <a-form-model-item label="路由地址" prop="url">
        <a-input v-model="model.url" placeholder="例如 /dashboard/analysis" />
      </a-form-model-item>
      <a-form-model-item label="组件路径" prop="component">
        <a-input v-model="model.component" placeholder="例如 dashboard/Analysis" />
      </a-form-model-item>
      <a-form-model-item label="是否路由" prop="route">
        <a-switch v-model="model.route" checked-children="是" un-checked-children="否" />
      </a-form-model-item>
      <a-form-model-item label="优先级" prop="priority">
        <a-input-number style="width:100%" v-model="model.priority" :min="0" :step="1" />
      </a-form-model-item>
      <a-form-model-item label="状态" prop="status">
        <a-switch v-model="model.statusSwitch" checked-children="启用" un-checked-children="禁用" />
      </a-form-model-item>
    </a-form-model>
  </j-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import JDictSelectTag from '@/components/dict/JDictSelectTag'

export default {
  name: 'RoleIndexModal',
  components: { JDictSelectTag },
  data() {
    return {
      visible: false,
      title: '配置角色首页',
      model: {},
      confirmLoading: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
      validatorRules: {
        roleCode: [{ required: true, message: '角色编码必填', trigger: 'blur' }],
        url: [{ required: true, message: '路由地址必填', trigger: 'blur' }],
        component: [{ required: true, message: '组件路径必填', trigger: 'blur' }]
      },
      url: {
        add: '/sys/sysRoleIndex/add',
        edit: '/sys/sysRoleIndex/edit'
      }
    }
  },
  methods: {
    add() {
      this.model = { route: true, priority: 0, status: '1', statusSwitch: true }
      this.title = '新增角色首页'
      this.visible = true
    },
    edit(record) {
      this.model = Object.assign({}, record, { statusSwitch: record.status === '1' || record.status === 1 })
      this.title = '编辑角色首页'
      this.visible = true
    },
    handleOk() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        this.confirmLoading = true
        const isAdd = !this.model.id
        const httpurl = isAdd ? this.url.add : this.url.edit
        const method = isAdd ? 'post' : 'put'
        // 同步状态布尔到后端标记
        this.model.status = this.model.statusSwitch ? '1' : '0'
        try {
          await httpAction(httpurl, this.model, method)
          this.$message.success('保存成功')
          this.$emit('ok')
          this.visible = false
        } finally {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>
