<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="用户账号">
              <a-input placeholder="请输入" v-model="queryParam.username"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="手机号">
              <a-input placeholder="请输入" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="用户名字">
              <a-input placeholder="请输入" v-model="queryParam.realname"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="公司名称">
                <a-input placeholder="请输入" v-model="queryParam.name"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="利润分配">
                <a-input placeholder="" v-model="queryParam.year"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="加盟时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.createTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                  @ok="onDateOk"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="状态">
                <a-select v-model="queryParam.goAndCome" placeholder="请选择" style="margin-right: 10px;">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">收入</a-select-option>
                  <a-select-option :value="1">支出</a-select-option>
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
    <!--<div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('加盟商管理')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>-->

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
        :scroll="{ x: 2500 }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">停用</span>
            <span shape="square" v-if="record.status == 1">启用</span>
          </div>
        </template>
        <template slot="isView" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a shape="square" @click="updateIsView(record)" v-if="record.isView == 0">统计</a>
            <a shape="square" @click="updateIsView(record)" v-if="record.isView == 1">不统计</a>
          </div>
        </template>
        <template slot="profitType" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square">{{ handlerProfitType(record) }}</span>
          </div>
        </template>

        <template slot="address" slot-scope="text, record, index">
          <img class="clickShowImage" :preview="'address' + index" :src="ssAddressView(record.address)" alt="" />
        </template>
        <span slot="action" slot-scope="text, record" style="width: 150px;">
          <a @click="showStartStatus(record)" v-if="record.status == 0">启用</a>
          <a @click="showStopStatus(record)" v-if="record.status == 1">停用</a>
          <a-divider type="vertical" />
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
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <allianceManage-modal ref="modalForm" @ok="modalFormOk"></allianceManage-modal>
  </a-card>
</template>

<script>
import AllianceManageModal from './modules/AllianceManageModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction, getAction, putAction } from '@/api/manage'
import { filterObj } from '@/utils/util'

export default {
  name: 'AllianceManageList',
  mixins: [JeecgListMixin],
  components: {
    AllianceManageModal
  },
  data() {
    return {
      description: '加盟商管理管理页面',
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
          title: '加盟商编号',
          align: 'center',
          dataIndex: 'id'
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
          title: '公司名称',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '二维码',
          align: 'center',
          dataIndex: 'address',
          scopedSlots: { customRender: 'address' }
        },
        {
          title: '共享方式',
          align: 'center',
          scopedSlots: { customRender: 'profitType' }
        },
        {
          title: '分配比例',
          align: 'center',
          dataIndex: 'allocationStr'
        },
        {
          title: '订单佣金比例(%)',
          align: 'center',
          dataIndex: 'orderCommissionRate'
        },
        {
          title: '礼包佣金比例(%)',
          align: 'center',
          dataIndex: 'giftCommissionRate'
        },
        {
          title: '开店佣金比例(%)',
          align: 'center',
          dataIndex: 'storeCommissionRate'
        },
        {
          title: '福利金销售奖励(%)',
          align: 'center',
          dataIndex: 'welfareCommissionRate'
        },
        {
          title: '推荐供应商销售奖励(%)',
          align: 'center',
          dataIndex: 'supplierSalesCommissionRate'
        },
        {
          title: '兑换券销售奖励(%)',
          align: 'center',
          dataIndex: 'cashCouponSalesIncentives'
        },
        {
          title: '加盟时间',
          align: 'center',
          dataIndex: 'startTime'
        },
        {
          title: '备注说明',
          align: 'center',
          dataIndex: 'remarkExplian'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'isView',
          scopedSlots: { customRender: 'isView' }
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
          width: 180,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/allianceManage/allianceManage/list',
        delete: '/allianceManage/allianceManage/delete',
        deleteBatch: '/allianceManage/allianceManage/deleteBatch',
        exportXlsUrl: 'allianceManage/allianceManage/exportXls',
        importExcelUrl: 'allianceManage/allianceManage/importExcel',
        edit: '/allianceManage/allianceManage/edit',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        queryById: '/sysArea/sysArea/queryById',
        updateIsView:'/allianceManage/allianceManage/updateIsView'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    updateIsView(record){
      getAction(this.url.updateIsView, {allianceManageId: record.id}).then((res) => {

        if (res.success) {
          this.modalFormOk();
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    handlerProfitType(record) {
      let typeStr = ''
      if (record.profitType == 0) {
        typeStr = '独享'
      } else {
        if (record.mutualAdvantages == 0) {
          typeStr = '与交易区域代理共享'
        } else {
          typeStr = '与指定区域县级代理共享'
        }
      }
      return typeStr
    },

    showStopStatus(record) {
      this.$refs.modalForm.showModalStopStatus(record)
    },
    showStartStatus(record) {
      if (!this.url.edit) {
        this.$message.error('请设置url.edit属性!')
        return
      }
      let that = this
      this.$confirm({
        title: '启用用户后，用户将恢复登录、提现',
        content: '您确定要启用吗？',
        onOk: function() {
          putAction(that.url.edit, { id: record.id, status: 1 }).then(res => {
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
    },
    ssAddressView: function(address) {
      return this.url.imgerver + '/' + address
    }
  }
}
</script>
<style scoped></style>
