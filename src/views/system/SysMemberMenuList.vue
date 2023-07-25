<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="菜单名">
              <a-input placeholder="请输入" v-model="queryParam.menuName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="英文名">
              <a-input placeholder="请输入" v-model="queryParam.englishName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="菜单类型">
                <a-select v-model="queryParam.menuType" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">非必须</a-select-option>
                  <a-select-option :value="1">必须</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="转态">
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('菜单配置表')">导出</a-button>
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
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
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
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="menuLogo" slot-scope="text, record">
          <div class="anty-img-wrap">
            <a-avatar shape="square" v-if="record.menuLogo" :src="getAvatarView(record.menuLogo)" icon="user" />
            <a-avatar
              shape="square"
              v-if="record.menuLogo == undefined || record.menuLogo == ''"
              :src="getAvatarView(record.menuLogo)"
              icon="user"
            />
          </div>
        </template>
        <template slot="menuCurrentLogo" slot-scope="text, record">
          <div class="anty-img-wrap">
            <a-avatar
              shape="square"
              v-if="record.menuCurrentLogo"
              :src="getAvatarView(record.menuCurrentLogo)"
              icon="user"
            />
            <a-avatar
              shape="square"
              v-if="record.menuCurrentLogo == undefined || record.menuCurrentLogo == ''"
              :src="getAvatarView(record.menuCurrentLogo)"
              icon="user"
            />
          </div>
        </template>

        <template slot="menuType" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.menuType == 0">非必须</span>
            <span shape="square" v-if="record.menuType == 1">必须</span>
          </div>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">停用</span>
            <span shape="square" v-if="record.status == 1">启用</span>
          </div>
        </template>
        <template slot="reviewHidden" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.reviewHidden == 0">隐藏</span>
            <span shape="square" v-if="record.reviewHidden == 1">显示</span>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" v-if="record.menuType == 0" />
          <a v-if="record.status == 1 && record.menuType == 0" @click="showModalStopStatus(record.id, '0')">停用</a>
          <a v-if="record.status == 0 && record.menuType == 0" @click="updateStatus(record.id, '1')">启用</a>
          <a-divider type="vertical" />
          <a v-if="record.reviewHidden == 1" @click="changeReviewHidden(record)">启用审核隐藏</a>
          <a v-else @click="changeReviewHidden(record)">停用审核隐藏</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <sysMemberMenu-modal ref="modalForm" @ok="modalFormOk"></sysMemberMenu-modal>
  </a-card>
</template>

<script>
import SysMemberMenuModal from './modules/SysMemberMenuModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction, getAction } from '@/api/manage'
import { filterObj } from '@/utils/util'
import { putAction } from '../../api/manage'
export default {
  name: 'SysMemberMenuList',
  mixins: [JeecgListMixin],
  components: {
    SysMemberMenuModal
  },
  data() {
    return {
      description: '菜单配置表管理页面',
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
          title: '菜单编号',
          align: 'center',
          dataIndex: 'id'
        },
        {
          title: '菜单名称',
          align: 'center',
          dataIndex: 'menuName'
        },
        {
          title: '英文名称',
          align: 'center',
          dataIndex: 'englishName'
        },

        {
          title: '菜单类型', //；0：非必须；1：必须
          align: 'center',
          dataIndex: 'menuType',
          scopedSlots: { customRender: 'menuType' }
        },
        {
          title: '图标',
          align: 'center',
          dataIndex: 'menuLogo',
          scopedSlots: { customRender: 'menuLogo' }
        },
        {
          title: '选中图标',
          align: 'center',
          dataIndex: 'menuCurrentLogo',
          scopedSlots: { customRender: 'menuCurrentLogo' }
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
        },
        {
          title: '状态', //;0:停用；1：启用
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },

        {
          title: '审核隐藏', //;0:隐藏 1：显示
          align: 'center',
          dataIndex: 'reviewHidden',
          scopedSlots: { customRender: 'reviewHidden' }
        },
        {
          title: '停用说明',
          align: 'center',
          dataIndex: 'closeExplian'
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/sysMemberMenu/sysMemberMenu/list',
        delete: '/sysMemberMenu/sysMemberMenu/delete',
        deleteBatch: '/sysMemberMenu/sysMemberMenu/deleteBatch',
        exportXlsUrl: 'sysMemberMenu/sysMemberMenu/exportXls',
        importExcelUrl: 'sysMemberMenu/sysMemberMenu/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        updateStatus: '/sysMemberMenu/sysMemberMenu/updateStatus',
        edit: '/sysMemberMenu/sysMemberMenu/edit'
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
      if (mainPicture) {
        return this.url.imgerver + '/' + mainPicture
      } else {
        return ''
      }
    },
    //启用停用审核隐藏
    changeReviewHidden: function(item) {
      var reviewHidden = item.reviewHidden == 1 ? 0 : 1
      var that = this
      this.$confirm({
        title:
          reviewHidden == 1
            ? '关闭该菜单的审核隐藏后，审核时用户端底部菜单将显示'
            : '开启该菜单的审核隐藏后，审核时用户端底部菜单将隐藏',
        content: `您确定要${reviewHidden == 1 ? '关闭' : '开启'}吗？`,
        onOk: function() {
          putAction(that.url.edit, { id: item.id, reviewHidden }).then(res => {
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
    //启用
    updateStatus: function(id, status) {
      //this.stopRemark="";
      if (!this.url.updateStatus) {
        this.$message.error('请设置url.updateStatus属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '启用该菜单后，用户端底部菜单将显示',
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
    },
    //停用
    showModalStopStatus(id) {
      this.$refs.modalForm.showModalStopStatus(id)
      this.$refs.modalForm.title = '停用'
      this.$refs.modalForm.disableSubmit = false
    },
    /**查询栏时间区间查询*/
    getQueryParams() {
      console.log(this.queryParam.createTime)
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.createTime // 时间参数不传递后台
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    onDateOk(value) {
      console.log(value)
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
