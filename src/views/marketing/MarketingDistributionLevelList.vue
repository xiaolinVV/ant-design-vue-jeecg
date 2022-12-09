<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="等级名称">
              <a-input placeholder="请输入等级名称" v-model="queryParam.levelName"></a-input>
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
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
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
      <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
      <!--<a-button type="primary" icon="download" @click="handleExportXls('分销等级')">导出</a-button>
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
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="icon" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="text != undefined"
            :preview="'icon' + index"
            :src="handleImage(text)"
            alt=""
          />
          <a-avatar shape="square" v-if="text == undefined || text == ''" :src="handleImage(text)" icon="user" />
        </template>
        <template slot="status" slot-scope="text">
          <div v-if="text == 1">启用</div>
          <div v-else>停用</div>
        </template>
        <template slot="waysObtain" slot-scope="text, record">
          <div v-if="text == 0">默认获得</div>
          <div v-else-if="text == 1">参团次</div>
          <div v-else>直推{{ record.direct }}人，团队{{ record.teamNumber }}人</div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a v-if="record.status == 1" @click="showTextareaModal(record, 1)">停用</a>
          <a v-else @click="showTextareaModal(record, 2)">启用</a>
          <a-divider type="vertical" />
          <a @click="showTextareaModal(record, 3)">删除</a>
          <!-- <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingDistributionLevel-modal ref="modalForm" @ok="modalFormOk"></marketingDistributionLevel-modal>
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></textAreaModal>
  </a-card>
</template>

<script>
import MarketingDistributionLevelModal from './modules/MarketingDistributionLevelModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import textAreaModal from '@/components/popUp/textAreaModal'
import { putAction, deleteAction } from '@/api/manage'
export default {
  name: 'MarketingDistributionLevelList',
  mixins: [JeecgListMixin],
  components: {
    MarketingDistributionLevelModal,
    textAreaModal
  },
  data() {
    return {
      description: '分销等级管理页面',
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
          title: '等级名称',
          align: 'center',
          dataIndex: 'levelName'
        },
        {
          title: '图标',
          align: 'center',
          dataIndex: 'icon',
          scopedSlots: { customRender: 'icon' }
        },
        {
          title: '级别',
          align: 'center',
          dataIndex: 'grade'
        },
        {
          // ；0：默认获得，1：参与拼购；2：直推人数
          title: '获取方式',
          align: 'center',
          dataIndex: 'waysObtain'
//          scopedSlots: { customRender: 'waysObtain' }
        },
        {
          title: '级差奖励比例(%)',
          align: 'center',
          dataIndex: 'differentialReward'
        },
        {
          title: '平级奖励比例(%)',
          align: 'center',
          dataIndex: 'levelRewards'
        },
        {
          // ；0：停用；1：启用
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '停用说明',
          align: 'center',
          dataIndex: 'statusExplain'
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
        // {
        //   title: '直推人数',
        //   align: 'center',
        //   dataIndex: 'direct'
        // },
        // {
        //   title: '团队人数',
        //   align: 'center',
        //   dataIndex: 'teamNumber'
        // },

        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/marketing/marketingDistributionLevel/list',
        delete: '/marketing/marketingDistributionLevel/delete',
        deleteBatch: '/marketing/marketingDistributionLevel/deleteBatch',
        exportXlsUrl: 'marketing/marketingDistributionLevel/exportXls',
        importExcelUrl: 'marketing/marketingDistributionLevel/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        edit: '/marketing/marketingDistributionLevel/edit'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    async showTextareaModal(record, type) {
      const allInfos = [
        {
          title: '停用',
          mainText: '停用该称号后，该称号失效，对应称号的会员无法获得奖励。',
          explainSureText: '您确定要停用吗'
        },
        {
          title: '启用',
          mainText: '启用该称号后，该称号生效，对应称号的会员可以获得奖励。',
          explainSureText: '您确定要启用吗'
        },
        {
          title: '删除',
          mainText: '删除该称号后，该称号失效，对应称号的会员无法获得奖励，删除后不可恢复。',
          explainSureText: '您确定要删除吗'
        }
      ]
      this.modalForm2Record = record
      this.modalForm2Infos = allInfos[type - 1]
      await this.$nextTick()
      this.$refs.modalForm2.show()
    },
    async modalForm2Ok(infos) {
      const title = this.modalForm2Infos.title
      if (title == '停用') {
        infos.status = 0
      } else if (title == '启用') {
        infos.status = 1
      }
      let result
      infos.statusExplain = infos.modalExplain
      if (title == '删除') {
        result = await deleteAction(this.url.delete, infos)
      } else {
        result = await putAction(this.url.edit, infos)
      }
      if (result.success) {
        this.$message.success(result.message)
        this.loadData()
      } else {
        this.$message.error(result.message)
      }

      console.log(infos)
    },
    onDateChange: function(value, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    handleImage(imgUrl) {
      if (imgUrl) {
        try {
          return this.url.imgerver + '/' + Object.values(JSON.parse(imgUrl))[0]
        } catch (error) {
          console.error(error, '图片解析出错')
        }
      }
      return ''
    },
    /**查询栏时间区间查询*/
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.startTime
      delete param.endTime
      return filterObj(param)
    }
  }
}
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>
