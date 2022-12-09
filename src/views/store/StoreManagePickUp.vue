<!--到店自提-->
<template>
  <a-card :bordered="false">
    <div>
      <a-form style="max-width: 100%; margin: 40px auto 0;">
        <a-alert
          message="启用到店自提功能后，买家可以到您的店内提货，下单后你需要尽快联系买家来提货。"
          style="margin-bottom: 24px;"
        />
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!--<a-button @click="handleAdd" type="primary" icon="plus">添加</a-button>-->
    </div>
    <div>
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        :scroll="{ x: 1500 }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        bordered
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
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
        <template slot="pickUpStatus" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.pickUpStatus == 0">停用</span>
            <span shape="square" v-if="record.pickUpStatus == 1">启用</span>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a v-if="record.pickUpStatus == 1" @click="showModal(record.id)">停用</a>
          <a v-if="record.pickUpStatus == 0" @click="updateStatus(record.id)">启用</a>
          <a-divider type="vertical" />
          <a @click="showpickUpRemark(record.id)">备注</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <!--
    <a-rate :defaultValue="0" allowHalf/>
-->
    <!-- 表单区域 -->
    <storeManage-modal ref="modalForm" @ok="modalFormOk"></storeManage-modal>

    <!--启动停用弹窗-->
    <div>
      <a-modal
        title="停用到店自提后，其关联商品都将无法使用到店自提功能"
        v-model="visible"
        @ok="hideModal()"
        okText="确认"
        cancelText="取消"
      >
        <input style="display: none" :value="StoreManageId" placeholder="id" />
        <p>您确定要停用吗？</p>
        <a-textarea placeholder="停用原因" v-model="pickUpStopRemark" :autosize="{ minRows: 3, maxRows: 6 }" />
      </a-modal>
      <br />
      <br />
    </div>
    <!--备注弹窗-->
    <div>
      <a-modal title="备注说明" v-model="visible1" @ok="hideModal1()" okText="保存" cancelText="取消">
        <input style="display: none" :value="StoreManageId" placeholder="id" />
        <a-textarea placeholder="备注说明" v-model="pickUpRemark" :autosize="{ minRows: 3, maxRows: 6 }" />
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
import { deleteAction, getAction, downFile } from '@/api/manage'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import StoreManageAuditModal from './modules/StoreManageAuditModal'
import { putAction } from '@/api/manage'

export default {
  name: 'StoreManagePickUp',
  mixins: [JeecgListMixin],
  components: {
    StoreManageAuditModal,
    StoreManageModal
  },
  data() {
    return {
      visible: false,
      visible1: false,
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
          title: '门脸照',
          align: 'center',
          dataIndex: 'storePicture',
          scopedSlots: { customRender: 'avatarslot1' }
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
          title: '备注说明',
          align: 'center',
          dataIndex: 'pickUpRemark'
        },
        {
          title: '自提停用说明',
          align: 'center',
          dataIndex: 'pickUpStopRemark'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'pickUpStatus',
          scopedSlots: { customRender: 'pickUpStatus' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/storeManage/storeManage/pickUpList',
        delete: '/storeManage/storeManage/delete',
        deleteBatch: '/storeManage/storeManage/deleteBatch',
        exportXlsUrl: 'storeManage/storeManage/exportXls',
        importExcelUrl: 'storeManage/storeManage/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        addAudit: '/storeManage/storeManage/audit',
        updatePickUpStatusById: '/storeManage/storeManage/updatePickUpStatusById',
        updatePickUpRemarkById: '/storeManage/storeManage/updatePickUpRemarkById'
      },
      StoreManageId: '',
      pickUpStopRemark: '',
      pickUpRemark: ''
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    //弹窗
    showModal(id) {
      this.StoreManageId = id
      this.visible = true
      this.pickUpStopRemark = ''
    },
    showpickUpRemark(id) {
      this.StoreManageId = id
      this.visible1 = true
      this.pickUpRemark = ''
    },
    //备注
    hideModal1() {
      this.visible1 = false
      console.log('this.pickUpRemark=', this.pickUpRemark)
      var that = this
      getAction(that.url.updatePickUpRemarkById, {
        id: this.StoreManageId,
        pickUpRemark: this.pickUpRemark
      }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.success('修改失败')
        }
      })
    },
    //停用
    hideModal() {
      this.visible = false
      console.log('this.pickUpStopRemark=', this.pickUpStopRemark)
      var that = this
      getAction(that.url.updatePickUpStatusById, {
        id: this.StoreManageId,
        pickUpStopRemark: this.pickUpStopRemark
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
      if (!this.url.updatePickUpStatusById) {
        this.$message.error('请设置url.updateFrameStatus属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '启用到店自提后，其关联商品都将可以使用到店自提功能',
        content: '您确定要启用吗？',
        onOk: function() {
          getAction(that.url.updatePickUpStatusById, { id: id, pickUpStopRemark: '' }).then(res => {
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

    addAudit: function(record) {
      this.$refs.modalTable.audit(record)
      this.$refs.modalTable.title = '审核'
      this.$refs.modalTable.disableSubmit = false
    },
    getAvatarView: function(logoAddr) {
      return this.url.imgerver + '/' + logoAddr
    },
    getAvatarView1: function(storePicture) {
      return this.url.imgerver + '/' + storePicture
    },
    getAvatarView2: function(accordingStore) {
      return this.url.imgerver + '/' + accordingStore
    },
    getAvatarView3: function(licenseForEnterprise) {
      return this.url.imgerver + '/' + licenseForEnterprise
    },
    getAvatarView4: function(idPictureZ) {
      return this.url.imgerver + '/' + idPictureZ
    },
    getAvatarView5: function(idPictureF) {
      return this.url.imgerver + '/' + idPictureF
    },
    getAvatarView6: function(idHand) {
      return this.url.imgerver + '/' + idHand
    },
    getAvatarView7: function(agentAuthorization) {
      return this.url.imgerver + '/' + agentAuthorization
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';

.ant-table-wrapper {
  width: 1200px;
  /*overflow-x: scroll !important;*/
}
</style>
