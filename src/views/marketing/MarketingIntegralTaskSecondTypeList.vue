<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="任务编号">
              <a-input placeholder="请输入任务编号" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="任务类型">
              <j-dict-select-tag v-model="queryParam.taskType" placeholder="请选择" dictCode="task_type" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="任务标题">
              <a-input placeholder="请输入任务标题" v-model="queryParam.taskTitle"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="任务方式">
              <!-- ；0：连续签到；1：每日任务；2：唯一任务 -->
              <j-dict-select-tag v-model="queryParam.taskeMode" placeholder="请选择" dictCode="task_way" />
              <!-- <a-select placeholder="请选择任务方式" v-model="queryParam.taskeMode">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">连续签到</a-select-option>
                <a-select-option :value="1">每日任务</a-select-option>
                <a-select-option :value="2">唯一任务</a-select-option>
              </a-select> -->
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="显示位置">
              <!-- ；0：签到栏；1：任务栏；2：奖励栏 -->
              <a-select placeholder="请选择显示位置" v-model="queryParam.displayPosition">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">签到栏</a-select-option>
                <a-select-option :value="1">任务栏</a-select-option>
                <a-select-option :value="2">奖励栏</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="状态">
              <a-select placeholder="请选择状态" v-model="queryParam.status">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">停用</a-select-option>
                <a-select-option :value="1">启用</a-select-option>
                <!-- <a-select-option :value="2">奖励栏</a-select-option> -->
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('积分任务')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
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
        :scroll="{ x: true }"
      >
        <!-- <template slot="taskeMode" slot-scope="text">
          <div class="anty-img-wrap">
            <div v-if="text == 0">连续签到</div>
            <div v-if="text == 1">每日任务</div>
            <div v-if="text == 2">唯一任务</div>
          </div>
        </template> -->
        <!-- displayPosition -->
        <template slot="displayPosition" slot-scope="text">
          <div class="anty-img-wrap">
            <div v-if="text == '0'">签到栏</div>
            <div v-else-if="text == 1">任务栏</div>
            <div v-else-if="text == 2">奖励栏</div>
            <div v-else>- -</div>
          </div>
        </template>
        <template slot="isView" slot-scope="text">
          <div class="anty-img-wrap">
            <div v-if="text == 0">不显示</div>
            <div v-if="text == 1">显示</div>
            <div v-if="text == 2">奖励栏</div>
          </div>
        </template>

        <template slot="status" slot-scope="text, record">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">停用</span>
            <span shape="square" v-if="record.status == 1">启用</span>
          </div>
        </template>

        <template slot="awardType" slot-scope="text">
          <div class="anty-img-wrap">
            <span shape="square" v-if="text == 0">水滴</span>
            <span shape="square" v-else-if="text == 1">专区团参团次数</span>
            <span shape="square" v-else-if="text == 2">平台优惠券</span>
            <span shape="square" v-else-if="text == 3">店铺优惠券</span>
            <span shape="square" v-else>- -</span>
          </div>
        </template>

        <template slot="taskImg" slot-scope="text, record, index">
          <img class="clickShowImage" :preview="'gradeLogo' + index" v-if="text" :src="getAvatarView(text)" alt="" />
          <a-avatar shape="square" v-else :src="getAvatarView(text)" icon="user" />
        </template>

        <template slot="coverPlan" slot-scope="text, record, index">
          <img class="clickShowImage" :preview="'coverPlan' + index" v-if="text" :src="getAvatarView(text)" alt="" />
          <a-avatar shape="square" v-else :src="getAvatarView(text)" icon="user" />
        </template>

        <span slot="action" slot-scope="text, record">
          <a
            @click="
              () => {
                let result = JSON.parse(JSON.stringify(record))
                result.editType = 2
                handleEdit(result)
              }
            "
            >排序</a
          >
          <a-divider type="vertical" />
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
    <marketingIntegralTask-modal ref="modalForm" @ok="modalFormOk"></marketingIntegralTask-modal>
    <text-area-modal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></text-area-modal>
  </a-card>
</template>

<script>
import MarketingIntegralTaskModal from './modules/MarketingIntegralTaskModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import TextAreaModal from '../../components/popUp/textAreaModal.vue'
import { postAction, deleteAction } from '../../api/manage'

export default {
  name: 'MarketingIntegralTaskSecondTypeList',
  mixins: [JeecgListMixin],
  components: {
    MarketingIntegralTaskModal,
    TextAreaModal
  },
  data() {
    return {
      description: '积分任务管理页面',
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
          title: '任务编号',
          align: 'center',
          dataIndex: 'serialNumber'
        },
        {
          title: '任务标题',
          align: 'center',
          dataIndex: 'taskTitle'
        },

        {
          title: '任务描述',
          align: 'center',
          dataIndex: 'taskDescription'
        },

        {
          // 0：连续签到；1：每日任务；2：唯一任务
          title: '任务方式',
          align: 'center',
          dataIndex: 'taskeMode_dictText'
          // scopedSlots: { customRender: 'taskeMode' }
        },
        {
          // ；字典类型：0：注册成功；1：交易密码；2：连续签到；3：每日浏览；4；邀请签到；5：邀请注册
          title: '任务类型',
          align: 'center',
          dataIndex: 'taskType_dictText'
        },

        {
          title: '任务次数',
          align: 'center',
          dataIndex: 'times'
        },
        {
          title: '签到天数',
          align: 'center',
          dataIndex: 'numberDays'
        },

        {
          // 0：签到栏；1：任务栏；2：奖励栏
          title: '显示位置',
          align: 'center',
          dataIndex: 'displayPosition',
          scopedSlots: { customRender: 'displayPosition' }
        },
        {
          // 0：不显示 1 显示
          title: '是否显示',
          align: 'center',
          dataIndex: 'isView',
          scopedSlots: { customRender: 'isView' }
        },
        {
          title: '图标',
          align: 'center',
          dataIndex: 'taskImg',
          scopedSlots: { customRender: 'taskImg' }
        },
        {
          title: '分享图',
          align: 'center',
          dataIndex: 'coverPlan',
          scopedSlots: { customRender: 'coverPlan' }
        },

        {
          //  ；0：积分
          title: '奖励类型',
          align: 'center',
          dataIndex: 'awardType',
          scopedSlots: { customRender: 'awardType' }
        },
        {
          title: '奖励',
          align: 'center',
          dataIndex: 'award'
        },
        {
          title: '券id',
          align: 'center',
          dataIndex: 'ticketId'
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
        },
        {
          // 0：停用；1：启用
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '状态说明',
          align: 'center',
          dataIndex: 'statusExplain'
        },
        {
          width: 200,
          fixed: 'right',
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/marketing/marketingIntegralTask/list',
        delete: '/marketing/marketingIntegralTask/delete',
        deleteBatch: '/marketing/marketingIntegralTask/deleteBatch',
        exportXlsUrl: 'marketing/marketingIntegralTask/exportXls',
        importExcelUrl: 'marketing/marketingIntegralTask/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        edit: '/marketing/marketingIntegralTask/edit'
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
        return this.url.imgerver + '/' + Object.values(JSON.parse(mainPicture))[0]
      } else {
        return ''
      }
    },
    async showTextareaModal(record, type) {
      const allInfos = [
        {
          title: '停用',
          mainText: '停用后任务将无法访问',
          explainSureText: '您确定要停用吗',
          url: this.url.edit
        },
        {
          title: '启用',
          mainText: '启用后任务将可以访问',
          explainSureText: '您确定要启用吗',
          url: this.url.edit
        },
        {
          title: '删除',
          mainText: '删除任务将无法恢复',
          explainSureText: '您确定要删除吗',
          url: this.url.delete
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
      let method = postAction
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
    }
  }
}
</script>
<style scoped>
@import "~@assets/less/common.less";

</style>
