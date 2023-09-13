<!--同城配送-->
<template>
  <a-card :bordered="false">
    <div>
      <a-form style="max-width: 100%; margin: 40px auto 0;">
        <a-alert message="启用后，买家下单可以选择同城配送，由你提供上门配送服务。" style="margin-bottom: 24px;" />
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!--<a-button @click="handleAdd" type="primary" icon="plus">添加</a-button>-->
    </div>
    <!--:rowKey="record => record.id"-->

    <!--:pagination="pagination"-->
    <div>
      <a-table
        ref="table"
        size="middle"
        :rowKey="record => record.id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        bordered
        :rowSelection="rowSelection"
        @change="handleTableChange"
      >
        <template slot="avatarslot1" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            :preview="'avatarslot1' + index"
            :src="getAvatarView1(record.storePicture)"
            alt=""
          />
        </template>
        <template slot="distributionStatus" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.distributionStatus == 0">停用</span>
            <span shape="square" v-if="record.distributionStatus == 1">启用</span>
          </div>
        </template>
        <template slot="cityDistributionType" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.cityDistributionType == 0">商家自配送</span>
            <span shape="square" v-if="record.cityDistributionType == 1">第三方配送</span>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a v-if="record.distributionStatus == 1" @click="showModal(record.id)">停用</a>
          <a v-if="record.distributionStatus == 0" @click="updateStatus(record.id)">启用</a>
          <a-divider type="vertical" />
          <a @click="showModal1(record.id)">计费规则</a>
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
    <storeManage-modal ref="modalForm" @ok="modalFormOk"></storeManage-modal>

    <!--启动停用弹窗-->
    <div>
      <a-modal
        title="停用同城配送后，其关联商品都将无法使用到同城配送功能"
        v-model="visible"
        @ok="hideModal()"
        okText="确认"
        cancelText="取消"
      >
        <input style="display: none" :value="StoreManageId" placeholder="id" />
        <p>您确定要停用吗？</p>
        <a-textarea placeholder="停用原因" v-model="distributionStopRemark" :autosize="{ minRows: 3, maxRows: 6 }" />
      </a-modal>
      <br />
      <br />
    </div>
    <!--计费规则弹窗-->
    <div>
      <a-modal title="" v-model="visible1" @ok="hideModal1()" okText="保存" cancelText="取消">
        <input style="display: none" :value="StoreManageId" placeholder="id" />
<!--        <p>注：因考虑实际送货路况，配送费计算按步行距离，非地图直线距离。</p>-->
        <!--<a-textarea-->
        <!--placeholder="设置计费规则"-->
        <!--v-model="accountingRules"-->
        <!--:autosize="{ minRows: 3, maxRows: 6 }"-->
        <!--/>-->
        <div class="guize-wrap">
          <div class="content" v-for="(item, index) in formShuxing">
            <div>
              {{ item.name }}
            </div>
            <div>
              <a-input v-model="formShuxing[index].value" />
            </div>
            <div>
              {{ item.danwei }}
            </div>
          </div>
        </div>
      </a-modal>
      <br />
      <br />
    </div>
  </a-card>
</template>

<script>
import StoreManageModal from './modules/StoreManageModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import { getAction, postAction, putAction } from '@/api/manage'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import StoreManageAuditModal from './modules/StoreManageAuditModal'
import ACollapsePanel from 'ant-design-vue/es/collapse/CollapsePanel'
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows)
  }
}
export default {
  name: 'StoreManagedistribution',
  mixins: [JeecgListMixin],
  components: {
    ACollapsePanel,
    StoreManageAuditModal,
    StoreManageModal
  },
  data() {
    return {
      rowSelection,

      //表单属性
      formShuxing: [
        {
          name: '配送费',
          danwei: '公里内',
          value: ''
        },
        {
          name: '',
          danwei: '元',
          value: ''
        },
        {
          name: '每增加',
          danwei: '公里',
          value: ''
        },
        {
          name: '配送费增加',
          danwei: '元',
          value: ''
        }
      ],
      description: '店铺管理页面',
      // 表头
      columns: [
        {
          title: '门店名称',
          align: 'center',
          dataIndex: 'storeName'
        },
        {
          title: '分店名称',
          align: 'center',
          dataIndex: 'subStoreName'
        },
        {
          title: '所在城市',
          align: 'center',
          dataIndex: 'areaAddress'
        },
        {
          title: '门店地址',
          align: 'center',
          dataIndex: 'storeAddress'
        },
        {
          title: '客服电话',
          align: 'center',
          dataIndex: 'takeOutPhone'
        },
        {
          title: '门脸照',
          align: 'center',
          dataIndex: 'storePicture',
          scopedSlots: { customRender: 'avatarslot1' }
        },
        {
          title: '配送类型',
          align: 'center',
          dataIndex: 'cityDistributionType',
          scopedSlots: { customRender: 'cityDistributionType' }
        },
        {
          title: '配送计费规则',
          align: 'center',
          dataIndex: 'accountingName'
        },
        {
          title: '配送停用说明',
          align: 'center',
          dataIndex: 'distributionStopRemark'
        },
        {
          title: '配送状态状态',
          align: 'center',
          dataIndex: 'distributionStatus',
          scopedSlots: { customRender: 'distributionStatus' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      //数据
      dataSource: [],
      pagination: {
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
      loading: false,
      url: {
        list: '/storeManage/storeManage/findStoreByAccountingRules',
        delete: '/storeManage/storeManage/delete',
        deleteBatch: '/storeManage/storeManage/deleteBatch',
        exportXlsUrl: 'storeManage/storeManage/exportXls',
        importExcelUrl: 'storeManage/storeManage/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        addAudit: '/storeManage/storeManage/audit',
        updateDistributionStatusById: '/storeManage/storeManage/updateDistributionStatusById',
        updateAccountingRulesById: '/storeManage/storeManage/updateAccountingRulesById'
      },
      StoreManageId: '',
      distributionStopRemark: '',
      visible: false,
      visible1: false
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    //启动停用弹窗
    showModal(id) {
      this.StoreManageId = id
      this.visible = true
      this.distributionStopRemark = ''
    },
    //计费规则弹窗
    showModal1(id) {
      this.StoreManageId = id
      this.visible1 = true
    },
    //计费规则
    hideModal1() {
      let that = this
      this.visible1 = false
      let request = {
        id: this.StoreManageId,
        accountingRules: JSON.stringify({
          distributionFeeDistance: this.formShuxing[0].value, //配送费公里内
          distributionFee: this.formShuxing[1].value, //配送费
          everyIncrease: this.formShuxing[2].value, //每增加
          increaseInDeliveryFee: this.formShuxing[3].value //配送费每增加
        })
      }
      postAction(that.url.updateAccountingRulesById, request).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.warn('修改失败')
        }
      })
    },
    //停用
    hideModal() {
      this.visible = false
      console.log('this.distributionStopRemark=', this.distributionStopRemark)
      let that = this
      getAction(that.url.updateDistributionStatusById, {
        id: this.StoreManageId,
        distributionStopRemark: this.distributionStopRemark
      }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.success('修改失败')
        }
      })
    },
    //启用
    updateStatus: function(id) {
      if (!this.url.updateDistributionStatusById) {
        this.$message.error('请设置url.updateDistributionStatusById!')
        return
      }
      var that = this
      this.$confirm({
        title: '启用同城配送后，其关联商品都将可以使用到同城配送功能',
        content: '您确定要启用吗？',
        onOk: function() {
          getAction(that.url.updateDistributionStatusById, { id: id, distributionStopRemark: '' }).then(res => {
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
    getAvatarView1: function(storePicture) {
      return this.url.imgerver + '/' + storePicture
    }
  }
}
</script>
<style scoped lang="less">
.ant-table-wrapper {
  width: 1500px;
  /*overflow-x: scroll !important;*/
}

.guize-wrap {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  .content {
    margin-top: 30px;
    font-size: 12px;
    width: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    div:nth-child(1),
    div:nth-child(3) {
      text-align: center;
      width: 30%;
    }
  }
}
</style>
