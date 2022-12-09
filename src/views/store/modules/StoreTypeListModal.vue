<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @cancel="close"
    cancelText="关闭"
  >
    <a-table
      ref="table"
      size="middle"
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="confirmLoading"
      @change="handleTableChange"
    >
    </a-table>
  </a-modal>
</template>

<script>
//表头
const columns = [
  {
    title: '序号',
    align: 'center',
    dataIndex: 'index',
    scopedSlots: { customRender: 'index' }
  },
  {
    title: '称号',
    align: 'center',
    dataIndex: 'name'
  },
  {
    title: '称号人数',
    align: 'center',
    dataIndex: 'totalMembers'
  }
]
import { getAction } from '@/api/manage'
export default {
  name: 'StoreTypeListModal',
  data() {
    return {
      title: '团队总人数',
      confirmLoading: false,
      visible: false,
      dataSource: [],
      columns,
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      /* 排序参数 */
      isorter: {
        column: 'createTime',
        order: 'desc'
      },
      url: {
        list: '/memberDesignationCount/memberDesignationCount/findMemberDesignationCountPageListByMemberId'
      },
      id: ''
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.visible = false
      this.dataSource = []
    },
    open(item) {
      if (item.id) {
        this.id = item.id
      }
      this.$emit('open')
      this.visible = true
      this.confirmLoading = true
      this.ipagination.current = 1
      let param = {
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
        memberListId: item.memberListId,
        memberDesignationGroupId: item.memberDesignationGroupId
      }
      getAction(this.url.list, param).then(res => {
        this.confirmLoading = false
        let count = 1
        if (res.success) {
          for (let item of res.result.records) {
            item.index = count
            count++
          }
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
        } else {
          this.$message.warning(res.message || '请稍后再试！')
        }
      })
    },
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      this.ipagination = pagination
      this.open()
    }
  }
}
</script>

<style scoped></style>
