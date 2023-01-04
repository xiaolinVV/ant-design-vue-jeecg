<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="手机号">
              <a-input placeholder="请输入" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchResetSpecial" icon="reload" style="margin-left: 8px">重置</a-button>
      <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown> -->
    </div>

    <!-- table区域-begin -->
    <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;width: 100%">
      <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
      <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
      >项
      <a style="margin-left: 24px" @click="onClearSelected">清空</a>
    </div>
    <div>
      <a-table
        ref="table"
        size="middle"
        rowKey="onlyKey"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :expandedRowKeys="expandedRowKeys"
        @change="handleTableChange"
        @expand="handleExpand"
        v-bind="tableProps"
      >
        <template slot="headPortrait" slot-scope="text, record, index">
          <img class="clickShowImage" :preview="'headPortrait' + index" :src="record.headPortrait" alt="" height="25px" style="max-width:80px;font-size: 12px;font-style: italic;" />
        </template>
        <a slot="teamCount" slot-scope="text, record" @click="showTeamCount(record)">
          {{ text }}
        </a>
        <template slot="isChange" slot-scope="text">
          <div v-if="text == 1">
            是
          </div>
          <div v-else>
            否
          </div>
        </template>
        <template slot="changeTime" slot-scope="text">
          <span v-if="text">
            {{ text }}
          </span>
          <span v-else>
            -
          </span>
        </template>
        <template slot="memberJoinTime" slot-scope="text">
          <span v-if="text">
            {{ text }}
          </span>
          <span v-else>
            -
          </span>
        </template>
        <template slot="totalMembers" slot-scope="text, record">
          <a @click="showTotalMembersDetail(record)">
            {{ text }}
          </a>
        </template>
      </a-table>
    </div>
    <member-my-team-list-modal ref="modalForm"></member-my-team-list-modal>
  </a-card>
</template>

<script>
import { getAction, deleteAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import MemberMyTeamListModal from './modules/MemberMyTeamListModal'
export default {
  name: 'MemberMyTeamList',
  mixins: [JeecgListMixin],
  inject: ['rush'],
  data() {
    return {
      visible: false,
      description: '商品分类管理页面',
      // 表头
      columns: [
        {
          title: '团队名称',
          align: 'center',
          dataIndex: 'groupName'
        },
        {
          //无限级
          title: '昵称',
          align: 'left',
          dataIndex: 'nickName'
        },
        {
          title: '会员编号',
          align: 'center',
          dataIndex: 'memberListId'
        },
        {
          title: '头像',
          align: 'center',
          dataIndex: 'headPortrait',
          scopedSlots: { customRender: 'headPortrait' }
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '上级',
          align: 'center',
          dataIndex: 'superiorName'
        },
        {
          title: '团队总人数',
          align: 'center',
          dataIndex: 'totalMembers',
          scopedSlots: { customRender: 'totalMembers' }
        },
        {
          title: '直属团队',
          align: 'center',
          dataIndex: 'memberSum'
        },
        {
          title: '成员加入时间',
          align: 'center',
          dataIndex: 'memberJoinTime',
          scopedSlots: { customRender: 'memberJoinTime' }
        },
        // {
        //   title: '是否外援',
        //   align: 'center',
        //   dataIndex: 'isChange',
        //   scopedSlots: { customRender: 'isChange' }
        // },
        /*{
          title: '外援加入时间',
          align: 'center',
          dataIndex: 'changeTime',
          scopedSlots: { customRender: 'changeTime' }
        },*/
        {
          title: '当前称号',
          align: 'center',
          dataIndex: 'designationName'
        },
        {
          title: '团队礼包销售总额',
          align: 'center',
          dataIndex: 'totalGiftSales'
        }
        // {
        //   title: '个人销售总额',
        //   align: 'center',
        //   dataIndex: ''
        // }
      ],
      url: {
        list: 'memberDesignationMemberList/memberDesignationMemberList/list',
        childList: 'memberDesignationMemberList/memberDesignationMemberList/findMemberDesignationMemberlist',
        requestList: 'memberDesignationMemberList/memberDesignationMemberList/list'
      },
      expandedRowKeys: [],
      hasChildrenField: 'isViewUnderling',
      pidField: 'memberDesignationGroupId',
      dictOptions: {}
    }
  },
  components: {
    MemberMyTeamListModal
  },
  computed: {
    importExcelUrl() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    tableProps() {
      let _this = this
      return {
        // 列表项是否可选择
        rowSelection: {
          selectedRowKeys: _this.selectedRowKeys,
          onChange: selectedRowKeys => (_this.selectedRowKeys = selectedRowKeys)
        }
      }
    }
  },
  watch: {
    queryParam: {
      handler(newVal) {
        if (newVal && newVal.phone) {
          this.url.requestList = this.url.childList
        } else {
          this.url.requestList = this.url.list
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    showTotalMembersDetail(item) {
      this.$refs.modalForm.open(item)
    },
    // 生成全局唯一id
    generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    searchResetSpecial() {
      this.queryParam = {}
      setTimeout(() => {
        this.searchReset()
      }, 200)
    },

    loadData(arg) {
      console.log(this.ipagination, 'ipaginationipaginationipaginationipagination')
      this.ipagination.hideOnSinglePage = false
      if (arg == 1) {
        this.ipagination.current = 1
      }
      this.loading = true
      this.expandedRowKeys = []
      let params = this.getQueryParams()
      // params.memberDesignationGroupId = ''
      return new Promise(resolve => {
        getAction(this.url.requestList, params).then(res => {
          if (res.success) {
            let result = this.url.requestList == this.url.list ? res.result.records : res.result
            if (Number(result.total) > 0 || result.length > 0) {
              this.ipagination.total = Number(result.total)
              this.dataSource = this.getDataByResult(result)
              resolve()
            } else {
              this.ipagination.total = 0
              this.dataSource = []
            }
          } else {
            this.$message.warning(res.message)
          }
          this.loading = false
        })
      })
    },
    showTeamCount(item) {
      console.log(item)
      if (item.id) {
        this.$refs.modalForm.open(item)
      } else {
        this.$message.warn('此数据的id不存在！')
      }
    },
    getDataByResult(result) {
      return result.map(item => {
        //判断是否标记了带有子节点
        item.onlyKey = this.generateUUID()
        if (item[this.hasChildrenField] == '1') {
          let loadChild = { id: item.id, name: 'loading...', isLoading: true, onlyKey: this.generateUUID() }
          item.children = [loadChild]
        }
        return item
      })
    },
    handleExpand(expanded, record) {
      // 判断是否是展开状态
      if (expanded) {
        this.expandedRowKeys.push(record.onlyKey)
        if (record.children.length > 0 && record.children[0].isLoading === true) {
          let params = this.getQueryParams() //查询条件
          params[this.pidField] = record.memberDesignationGroupId
          if (record.memberListId) {
            params.memberListId = record.memberListId
          }
          if (params.phone) {
            params.phone = ''
          }
          params.memberDesignationGroupId = record.memberDesignationGroupId || ''
          getAction(this.url.childList, params).then(res => {
            console.log(params, 'paramsparamsparams')
            if (res.success) {
              if (res.result && res.result.length > 0) {
                record.children = this.getDataByResult(res.result)
                this.dataSource = [...this.dataSource]
              } else {
                record.children = ''
                record.hasChildrenField = '0'
              }
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      } else {
        let keyIndex = this.expandedRowKeys.indexOf(record.onlyKey)
        if (keyIndex >= 0) {
          this.expandedRowKeys.splice(keyIndex, 1)
        }
      }
    },
    initDictConfig() {}
  }
}
</script>
<style scoped>
.table-operator {
  margin-bottom: 10px;
}
</style>
