<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="供应商名称">
              <a-input placeholder="请输入" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item label="联系人">
              <a-input placeholder="请输入" v-model="queryParam.linkman"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="结算类型">
              <j-dict-select-tag
                v-model="queryParam.accountType"
                placeholder="请选择结算类型"
                dictCode="provider_account_type"
              />
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="联系电话">
                <a-input placeholder="请输入" v-model="queryParam.linkphone"></a-input>
              </a-form-item>
            </a-col>
            <!--<a-col :md="8" :sm="8">
              <a-form-item label="合作时间">
                <a-range-picker
                  style="width: 210px"
                  v-model="queryParam.timeName"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                />
              </a-form-item>
            </a-col>-->
            <a-col :md="8" :sm="8">
              <a-form-item label="创建日期">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.createTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange1"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option value="0">停用</a-select-option>
                  <a-select-option value="1">启用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item
                label="所在城市">
                <selectAddress ref="selectAddress" @cityAllDataLoad="cityAllDataLoad"
                               style="margin: 0 10px;width: 100%;">
                </selectAddress>
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
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!--<a-button type="primary" icon="download" @click="handleExportXls('供应商列表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />
            删除
          </a-menu-item>
        </a-menu>
        <!--<a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>-->
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
        rowKey="id"
        bordered
        :scroll="{ x: 2500 }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="goodAudit" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-switch
              checkedChildren="免审核"
              unCheckedChildren="需审核"
              v-model="record.goodAudit"
              @change="switchChange(record)"
            />
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a v-if="record.status == 1" @click="showModal(record.id)">停用</a>
          <a v-if="record.status == 0" @click="updateStatus(record.id)">启用</a>
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
    <providerManage-modal ref="modalForm" @ok="modalFormOk"></providerManage-modal>

    <!--启动停用弹窗-->
    <div>
      <a-modal
        title="停用供应商后，其账号将无法使用"
        v-model="visible"
        @ok="hideModal()"
        okText="确认"
        cancelText="取消"
      >
        <input style="display: none" :value="id" placeholder="id" />
        <p>您确定要停用吗？</p>
        <a-textarea placeholder="停用原因" v-model="closeExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
      </a-modal>
      <br />
      <br />
    </div>
  </a-card>
</template>

<script>
import ProviderManageModal from './modules/ProviderManageModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction, getAction, postAction, putAction, deleteAction } from '@/api/manage'
import { filterObj } from '@/utils/util'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import selectAddress from '@/components/selectAddress/selectAddress'
export default {
  name: 'ProviderManageList',
  mixins: [JeecgListMixin],
  inject: ['rush'],
  components: {
    ProviderManageModal,
    selectAddress
  },
  data() {
    return {
      description: '供应商列表管理页面',
      storeClassifactionList: [],//一级分类
      storeClassifactionListSecond: [],//二级分类
      queryParam: {
        timeName: [],
        createTime: []
      },
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
          title: '供应商名称',
          align: 'center',
          dataIndex: 'name'
        },

        {
          title: '所在城市',
          align: 'center',
          dataIndex: 'areaAddress'
        },
        {
          title: '联系地址',
          align: 'center',
          dataIndex: 'address'
        },
        {
          title: '联系电话',
          align: 'center',
          dataIndex: 'companyPhone'
        },
        {
          title: '联系人',
          align: 'center',
          dataIndex: 'linkman'
        },
        {
          title: '联系人手机号',
          align: 'center',
          dataIndex: 'linkphone'
        },
        {
          title: '结算类型',
          align: 'center',
          dataIndex: 'accountType_dictText'
        },
        {
          title: '业务对接人',
          align: 'center',
          dataIndex: 'contactName'
        },
        {
          title: '合作时间',
          align: 'center',
          dataIndex: 'timeName'
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'remark'
        },
        {
          title: '商品审核',
          align: 'center',
          dataIndex: 'goodAudit',
          scopedSlots: { customRender: 'goodAudit' }
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'statusName'
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
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/providerManage/providerManage/findProviderManage',
        delete: '/providerManage/providerManage/delete',
        deleteBatch: '/providerManage/providerManage/deleteBatch',
        exportXlsUrl: 'providerManage/providerManage/exportXls',
        importExcelUrl: 'providerManage/providerManage/importExcel',
        updateStatusById: 'providerManage/providerManage/updateStatusById',
        edit: 'providerManage/providerManage/edit',
        findByParentId: '/sysArea/sysArea/findByParentId',
        getList: '/sysArea/sysArea/getList',
        queryById: '/sysArea/sysArea/queryById',
      },
      visible: false,
      id: '', //id
      closeExplain: '' // 停用说明
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  mounted() {
    this.getStoreClassifactionList()
  },
  methods: {
    //弹窗
    showModal(id) {
      this.id = id
      this.visible = true
      this.closeExplain = ''
    },
    //停用
    hideModal() {
      this.visible = false
      var that = this
      postAction(that.url.updateStatusById, {
        id: this.id,
        closeExplain: this.closeExplain,
        status: '0'
      }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.success(res.message)
        }
        that.rush()
      })
    },
    //启用
    updateStatus: function(id) {
      if (!this.url.updateStatusById) {
        this.$message.error('请设置url.updateFrameStatus属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '启用供应商后，其账号可以正常使用',
        content: '您确定要启用吗？',
        onOk: function() {
          postAction(that.url.updateStatusById, { id: id, closeExplain: '', status: '1' }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
              that.onClearSelected()
            } else {
              that.$message.warning(res.message)
            }
            that.rush()
          })
        }
      })
    },
    switchChange(item) {
      console.log(item)
      let info = {
        goodAudit: item.goodAudit ? true : false,
        id: item.id
      }
      putAction(this.url.edit, info)
    },
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.timeName //合作时间
      delete param.createTime //合作时间
      return filterObj(param)
    },
    onDateChange1: function(value, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    onDateOk(value) {
      console.log(value)
    },
    //二级分分类选中
    setStoreTypeId(value) {
      this.queryParam.storeTypeId = value
    },

    //获取一级分类
    getStoreClassifactionList() {
      this.storeTypeIdTwo = ''
      getAction(this.url.getStoreTypeMap, { pId: '' }).then(res => {
        if (res.success) {
          this.storeClassifactionList = res.result
        }
      })
    },

    //获取二级分类
    getStoreClassifactionListSecond(value) {
      this.queryParam.storeTypeId = value
      this.storeClassifactionListSecond = []
      if (value) {
        getAction(this.url.getStoreTypeMap, { pId: value }).then(res => {
          if (res.success) {
            this.storeClassifactionListSecond = res.result
          }
        })
      }
    },
    async cityAllDataLoad(defaultCity) {
      this.defaultCity = defaultCity
      this.queryParam.areaAddress = ''
      for (let i = 0; i < defaultCity.length; i++) {
        await this.getCityName(defaultCity, i)
      }
    },
    async getCityName(defaultCity, i) {
      await getAction(this.url.queryById, { id: defaultCity[i] }).then((res) => {
        if (res.success) {
          if (i == defaultCity.length - 1) {
            this.queryParam.areaAddress += res.result.name
          } else {
            this.queryParam.areaAddress += res.result.name + ','
          }
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.table-operator {
  margin-bottom: 10px;
  button {
    margin-right: 8px;
  }
}
</style>
