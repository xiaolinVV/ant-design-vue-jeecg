<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="特色标签">
              <a-input placeholder="请输入特色标签" v-model="queryParam.label"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item label="是否推荐">
              <a-select v-model="queryParam.isRecommend" placeholder="请选择是否推荐">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">否</a-select-option>
                <a-select-option :value="1">是</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">停用</a-select-option>
                <a-select-option :value="1">启用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item label="创建时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.createTime"
                format="YYYY-MM-DD HH:MM:SS"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange2"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
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
        <template slot="status" slot-scope="text">
          <span shape="square" v-if="text == 0">停用</span>
          <span shape="square" v-if="text == 1">启动</span>
        </template>

        <template slot="isRecommend" slot-scope="text">
          <span shape="square" v-if="text == 0">否</span>
          <span shape="square" v-if="text == 1">是</span>
        </template>
        <template slot="surfacePlot" slot-scope="text">
          <a-avatar shape="square" v-if="text != undefined" :src="getAvatarView(JSON.parse(text)[0])" icon="user" />
          <a-avatar shape="square" v-if="text == undefined || text == ''" :src="getAvatarView(text)" icon="user" />
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record, '排序')">排序</a>
          <a-divider type="vertical" />
          <a v-if="record.isRecommend == 0" @click="changeCommand(record)">设为推荐</a>
          <a v-else @click="changeCommand(record)">取消推荐</a>
          <a-divider type="vertical" />
          <a v-if="record.status == 1" @click="showTextareaModal(record, 1)">停用</a>
          <a v-else @click="showTextareaModal(record, 2)">启用</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="showTextareaModal(record, 3)">删除</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <storeLabel-modal ref="modalForm" @ok="modalFormOk"></storeLabel-modal>
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></textAreaModal>
  </a-card>
</template>

<script>
import StoreLabelModal from './modules/StoreLabelModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction, getAction, postAction, putAction, deleteAction } from '@/api/manage'
import { filterObj } from '@/utils/util'
import textAreaModal from '@/components/popUp/textAreaModal'
export default {
  name: 'StoreLabelList',
  mixins: [JeecgListMixin],
  components: {
    StoreLabelModal,
    textAreaModal
  },
  data() {
    return {
      description: '店铺标签管理页面',
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
          title: '特色标签',
          align: 'center',
          dataIndex: 'label'
        },
        {
          title: '封面图',
          align: 'center',
          dataIndex: 'surfacePlot',
          scopedSlots: { customRender: 'surfacePlot' }
        },
        {
          // ；0：否；1：是
          title: '是否推荐',
          align: 'center',
          dataIndex: 'isRecommend',
          scopedSlots: { customRender: 'isRecommend' }
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
        },
        {
          // ；0：停用；1：启用
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建者',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/store/storeLabel/list',
        delete: '/store/storeLabel/delete',
        deleteBatch: '/store/storeLabel/deleteBatch',
        exportXlsUrl: 'store/storeLabel/exportXls',
        importExcelUrl: 'store/storeLabel/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        edit: '/store/storeLabel/edit'
      },
      modalForm2Record: {},
      modalForm2Infos: {}
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    changeCommand(record) {
      let modelInfo = {
        title: '点击确定将该特色标签设为推荐',
        content: '您确定要这么设定吗',
        isRecommend: 0
      }

      if (record.isRecommend == 1) {
        modelInfo = {
          title: '点击确定将取消该特色标签的推荐',
          content: '您确定要这么设定吗',
          isRecommend: 0
        }
      } else {
        modelInfo = {
          title: '点击确定将该特色标签设为推荐',
          content: '您确定要这么设定吗',
          isRecommend: 1
        }
      }
      this.$confirm({
        title: modelInfo.title,
        content: modelInfo.content,
        onOk: () => {
          putAction(this.url.edit, {
            // ...record,
            id: record.id,
            isRecommend: modelInfo.isRecommend
          }).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              this.loadData()
            } else {
              this.$message.warning(res.message)
            }
          })
        },
        onCancel() {}
      })
    },
    getAvatarView: function(mainPicture) {
      return this.url.imgerver + '/' + mainPicture
    },
    async showTextareaModal(record, type) {
      const allInfos = [
        {
          title: '停用',
          mainText: '停用后特色标签将无法显示',
          explainSureText: '您确定要停用吗'
        },
        {
          title: '启用',
          mainText: '启动后特色标签将可以显示',
          explainSureText: '您确定要启用吗'
        },
        {
          title: '删除',
          mainText: '删除特色标签将无法恢复',
          explainSureText: '您确定要删除吗'
        }
      ]
      this.modalForm2Record = record
      this.modalForm2Infos = allInfos[type - 1]
      await this.$nextTick()
      this.$refs.modalForm2.show()
    },
    modalForm2Ok(infos) {
      const title = this.modalForm2Infos.title
      let url = this.url.edit
      let method = putAction
      if (title == '停用') {
        infos.status = 0
      } else if (title == '启用') {
        infos.status = 1
      }
      if (title == '删除') {
        url = this.url.delete
        method = deleteAction
      }
      infos.closeExplain = infos.modalExplain
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
    /**查询栏时间区间查询*/
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.createTime
      return filterObj(param)
    },
    onDateChange2: function(value, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
