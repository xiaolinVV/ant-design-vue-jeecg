<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="团队名称">
              <a-input placeholder="请输入" v-model="queryParam.groupName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="团队创始人">
              <a-input placeholder="请输入" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="手机号">
              <a-input placeholder="请输入" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="8" :lg="11" :md="12" :sm="24">
              <a-form-item label="创建时间">
                <j-date
                  placeholder="请选择开始日期"
                  class="query-group-cust"
                  v-model="queryParam.createTime_begin"
                ></j-date>
                <span class="query-group-split-cust"></span>
                <j-date
                  placeholder="请选择结束日期"
                  class="query-group-cust"
                  v-model="queryParam.createTime_end"
                ></j-date>
              </a-form-item>
            </a-col>
            <a-col :xl="8" :lg="11" :md="12" :sm="24">
              <a-form-item label="更新时间">
                <j-date
                  placeholder="请选择开始日期"
                  class="query-group-cust"
                  v-model="queryParam.updateTime_begin"
                ></j-date>
                <span class="query-group-split-cust"></span>
                <j-date
                  placeholder="请选择结束日期"
                  class="query-group-cust"
                  v-model="queryParam.updateTime_end"
                ></j-date>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!--<a-button type="primary" icon="download" @click="handleExportXls('团队管理')">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
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
      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
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
        <template slot="headPortrait" slot-scope="text, record, index">
          <img class="clickShowImage" :preview="'headPortrait' + index" :src="record.headPortrait" height="25px" style="max-width:80px;font-size: 12px;font-style: italic;" />
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="showTextareaModal(record, 3)">删除</a>
          <!--<a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>

              </a-menu-item>
            </a-menu>
          </a-dropdown>-->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <memberDesignationGroup-modal ref="modalForm" @ok="modalFormOk"></memberDesignationGroup-modal>
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></textAreaModal>
  </a-card>
</template>

<script>
import MemberDesignationGroupModal from './modules/MemberDesignationGroupModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JDate from '@/components/jeecg/JDate.vue'
import textAreaModal from '@/components/popUp/textAreaModal'
import { getAction, putAction, postAction } from '../../api/manage'
export default {
  name: 'MemberDesignationGroupList',
  mixins: [JeecgListMixin],
  components: {
    MemberDesignationGroupModal,
    JDate,
    textAreaModal
  },
  data() {
    return {
      description: '团队管理管理页面',
      modalForm2Record: {},
      modalForm2Infos: {},
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
          title: '团队名称',
          align: 'center',
          dataIndex: 'groupName'
        },
        {
          title: '团队创始人',
          align: 'center',
          dataIndex: 'nickName'
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
          title: '店铺编号',
          align: 'center',
          dataIndex: 'storeManageId'
        },
        {
          title: '绑定店铺',
          align: 'center',
          dataIndex: 'storeName'
        },

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
      url: {
        list: '/memberDesignationGroup/memberDesignationGroup/list',
        // delete: '/memberDesignationGroup/memberDesignationGroup/delete',
        delete: 'memberDesignationGroup/memberDesignationGroup/delAndexplain',
        deleteBatch: '/memberDesignationGroup/memberDesignationGroup/deleteBatch',
        exportXlsUrl: 'memberDesignationGroup/memberDesignationGroup/exportXls',
        importExcelUrl: 'memberDesignationGroup/memberDesignationGroup/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        // 判定是否可以删除
        ifDel: 'memberDesignationGroup/memberDesignationGroup/ifDel'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    ssAddressView: function(qrcodeAddr) {
      return this.url.imgerver + '/' + qrcodeAddr
    },
    async showTextareaModal(record, type) {
      const allInfos = [
        {
          title: '停用',
          mainText: '停用后，该商品将不在活动中展示',
          explainSureText: '您确定要停用吗'
        },
        {
          title: '启用',
          mainText: '启用后，该商品将会在活动中展示',
          explainSureText: '您确定要启用吗'
        },
        {
          title: '删除',
          mainText: '点击确定将删除该团队',
          explainSureText: '您确定要删除吗'
        }
      ]
      if (type == 3) {
        let candelete = await this.canDelete(record)
        if (candelete == 1) {
          this.$error({
            title: '很抱歉',
            content: '该团队已经开始运作，并已拥有团队成员，无法删除'
          })
          return
        }
      }

      this.modalForm2Record = record
      this.modalForm2Infos = allInfos[type - 1]
      await this.$nextTick()
      this.$refs.modalForm2.show()
    },
    async modalForm2Ok(infos) {
      const title = this.modalForm2Infos.title
      let url = this.url.edit
      let method = postAction
      if (title == '停用') {
        infos.status = 0
      } else if (title == '启用') {
        infos.status = 1
      }
      if (title == '删除') {
        url = this.url.delete
        method = postAction
      }
      infos.delExplain = infos.modalExplain
      method(url, infos).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.error(res.message)
        }
      })
      console.log(infos)
    },
    //判断是否可以删除
    canDelete(record) {
      return new Promise(resolve => {
        getAction(this.url.ifDel, { id: record.id }).then(res => {
          if (res.success) {
            resolve(res.message)
          } else {
            resolve(1)
          }
        })
      })
    }
  }
}
</script>
<style scoped></style>
