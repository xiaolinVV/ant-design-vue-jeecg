<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="用户账号">
              <a-input placeholder="请输入" v-model="queryParam.username"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="手机号">
              <a-input placeholder="请输入" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="用户名字">
                <a-input placeholder="请输入" v-model="queryParam.realname"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="角色">
                <a-select v-model="queryParam.roleCode" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option value="Provincial_agents">省代</a-select-option>
                  <a-select-option value="Municipal_agent">市代</a-select-option>
                  <a-select-option value="County_agent">县代</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!--时间选择框-->
            <a-col :md="6" :sm="8">
              <a-form-item label="代理开始时间">
                <a-range-picker
                  style="width: 210px"
                  v-model="queryParam.startTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChangeStart"
                  @ok="onDateOk"
                />
              </a-form-item>
            </a-col>
            <!--时间选择框-->
            <a-col :md="6" :sm="8">
              <a-form-item label="代理结束时间">
                <a-range-picker
                  style="width: 210px"
                  v-model="queryParam.endTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChangeEnd"
                  @ok="onDateOk"
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
            <!--时间选择框-->
            <a-col :md="6" :sm="8">
              <a-form-item label="创建时间">
                <a-range-picker
                  style="width: 210px"
                  v-model="queryParam.createTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                  @ok="onDateOk"
                />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!--<a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('代理列表')">导出</a-button>-->
      <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
         <a-button type="primary" icon="import">导入</a-button>
       </a-upload>
       <a-dropdown v-if="selectedRowKeys.length > 0">
         <a-menu slot="overlay">
           <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
         </a-menu>
         <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
       </a-dropdown>-->
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
        :scroll="{ x: 3500 }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="avatar" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="record.avatar != undefined"
            :preview="'avatar' + index"
            :src="getAvatarView(record.avatar)"
            alt=""
          />
          <a-avatar
            shape="square"
            v-if="record.avatar == undefined || record.avatar == ''"
            :src="getAvatarView(record.avatar)"
            icon="user"
          />
        </template>
        <template slot="startEndTime" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.startTime">{{ record.startTime }}</span>
            <span shape="square" v-if="record.endTime"> 至 {{ record.endTime }}</span>
          </div>
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
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <agencyManage-modal ref="modalForm" @ok="modalFormOk"></agencyManage-modal>
  </a-card>
</template>

<script>
import AgencyManageModal from './modules/AgencyManageModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import { getAction, postAction } from '@/api/manage'
export default {
  name: 'AgencyManageList',
  mixins: [JeecgListMixin],
  components: {
    AgencyManageModal
  },
  data() {
    return {
      description: '代理列表管理页面',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          fixed: 'left',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '头像',
          align: 'center',
          dataIndex: 'avatar',
          scopedSlots: { customRender: 'avatar' }
        },
        {
          title: '用户账号',
          align: 'center',
          dataIndex: 'username'
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '用户名字',
          align: 'center',
          dataIndex: 'realname'
        },
        {
          title: '部门名称',
          align: 'center',
          dataIndex: 'departName'
        },
        {
          title: '代理公司名称',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '角色',
          align: 'center',
          dataIndex: 'roleName',

          scopedSlots: { customRender: 'roleName' }
        },
        {
          title: '代理区域',
          align: 'center',
          dataIndex: 'sysAreaName'
        },
        {
          title: '订单佣金比例（%）',
          align: 'center',
          dataIndex: 'orderCommissionRate'
        },
        {
          title: '礼包佣金比例（%）',
          align: 'center',
          dataIndex: 'giftCommissionRate'
        },
        {
          title: '开店佣金比例（%）',
          align: 'center',
          dataIndex: 'storeCommissionRate'
        },
        {
          title: '福利金销售奖励（%）',
          align: 'center',
          dataIndex: 'welfareCommissionRate'
        },
        {
          title: '推荐供应商销售奖励（%）',
          align: 'center',
          dataIndex: 'supplierSalesCommissionRate'
        },
        {
          title: '兑换券销售额奖励（%）',
          align: 'center',
          dataIndex: 'cashCouponSalesIncentives'
        },
        {
          title: '推广人佣金比例（%）',
          align: 'center',
          dataIndex: 'promoterCommissionRate'
        },
        {
          title: '代理时间',
          align: 'center',
          dataIndex: 'startEndTime',
          scopedSlots: { customRender: 'startEndTime' }
        },
        /* {
           title: '结束时间',
           align:"center",
           dataIndex: 'endTime'
           },*/
        {
          title: '备注说明',
          align: 'center',
          dataIndex: 'remark'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
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
          fixed: 'right',
          width: 120,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/agencyManage/agencyManage/list',
        delete: '/agencyManage/agencyManage/delete',
        deleteBatch: '/agencyManage/agencyManage/deleteBatch',
        exportXlsUrl: 'agencyManage/agencyManage/exportXls',
        importExcelUrl: 'agencyManage/agencyManage/importExcel',
        updateStatus: '/agencyManage/agencyManage/updateStatus',
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
    getAvatarView: function(mainPicture) {
      return this.url.imgerver + '/' + mainPicture
    },
    /**查询栏时间区间查询*/
    getQueryParams() {
      console.log(this.queryParam.createTime)
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.createTime // 时间参数不传递后台
      delete param.startTime
      delete param.endTime
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    onDateChangeStart: function(value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.startTime_begin = dateString[0]
      this.queryParam.startTime_end = dateString[1]
    },
    onDateChangeEnd: function(value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.endTime_begin = dateString[0]
      this.queryParam.endTime_end = dateString[1]
    },
    onDateOk(value) {
      console.log(value)
    },
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
        this.$message.error('请设置url.updateStatus属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '启用用户后，用户将可恢复提现',
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
@import "~@assets/less/common.less";

</style>
