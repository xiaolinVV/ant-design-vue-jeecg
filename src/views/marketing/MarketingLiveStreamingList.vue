<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="直播间名称">
              <a-input placeholder="请输入直播间名称" v-model="queryParam.roomName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="状态">
              <!-- 0：预告中；1：进行中；2：结束 -->
              <a-select v-model="queryParam.status" placeholder="请选择" style="margin-right: 10px;">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">预告中</a-select-option>
                <a-select-option :value="1">进行中</a-select-option>
                <a-select-option :value="2">已结束</a-select-option>
                <!-- <a-select-option  :value="3"   >无效</a-select-option> -->
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="预告时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam2.noticeTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="开播时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam2.startTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange2"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="结束时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam2.endTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange3"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="创建时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam2.createTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange4"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('直播管理')">导出</a-button>
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
        :scroll="{ x: 2000 }"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="surfacePlot" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="text != undefined"
            :preview="'surfacePlot' + index"
            :src="getPicView(text)"
            alt=""
          />
          <a-avatar shape="square" v-if="text == undefined || text == ''" :src="getPicView(text)" icon="user" />
        </template>
        <template slot="posters" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="text != undefined"
            :preview="'posters' + index"
            :src="getPicView(text)"
            alt=""
          />
          <a-avatar shape="square" v-if="text == undefined || text == ''" :src="getPicView(text)" icon="user" />
        </template>
        <template slot="wallPanel" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="text != undefined"
            :preview="'wallPanel' + index"
            :src="getPicView(text)"
            alt=""
          />
          <a-avatar shape="square" v-if="text == undefined || text == ''" :src="getPicView(text)" icon="user" />
        </template>

        <template slot="headPortrait" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="text != undefined"
            :preview="'avatar' + index"
            :src="getPicView(text)"
            alt=""
          />
          <a-avatar shape="square" v-if="text == undefined || text == ''" :src="getPicView(text)" icon="user" />
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="text == 0">预告中</span>
            <span shape="square" v-else-if="text == 1">进行中</span>
            <span shape="square" v-else-if="text == 2">已结束</span>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="showLiveInfo(record)">直播流信息</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)" v-if="record.status == 0">编辑</a>
          <a-divider type="vertical" v-if="record.status == 0" />
          <a v-if="record.status == 0" @click="showTextareaModal(record, 1)">删除</a>
          <a-divider type="vertical" v-if="record.status == 0" />
          <a v-if="record.status == 1" @click="showTextareaModal(record, 0)">结束</a>
          <a-divider type="vertical" v-if="record.status == 1" />
          <a v-if="record.status == 2" @click="showTJInfo(record)">统计</a>
          <a-divider type="vertical" v-if="record.status == 2" />
          <a v-if="record.status == 1" @click="setVirtualOnlineNumber(record)">虚拟人数</a>
          <!-- v-if="record.status == 1" -->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingLiveStreaming-modal ref="modalForm" @ok="modalFormOk"></marketingLiveStreaming-modal>
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></textAreaModal>
    <marketing-live-streaming-info-modal ref="MarketingLiveStreamingInfoModal"></marketing-live-streaming-info-modal>
    <marketing-live-streaming-all-info-modal
      ref="MarketingLiveStreamingAllInfoModal"
    ></marketing-live-streaming-all-info-modal>
  </a-card>
</template>

<script>
import MarketingLiveStreamingModal from './modules/MarketingLiveStreamingModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import MarketingLiveStreamingInfoModal from './modules/MarketingLiveStreamingInfoModal.vue'
import textAreaModal from '@/components/popUp/textAreaModal'
import { putAction, deleteAction } from '@/api/manage'
import MarketingLiveStreamingAllInfoModal from './modules/MarketingLiveStreamingAllInfoModal.vue'
export default {
  name: 'MarketingLiveStreamingList',
  mixins: [JeecgListMixin],
  components: {
    MarketingLiveStreamingModal,
    MarketingLiveStreamingInfoModal,
    textAreaModal,
    MarketingLiveStreamingAllInfoModal
  },
  data() {
    return {
      description: '直播管理管理页面',
      queryParam2: {},
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
          title: '直播间名称',
          align: 'center',
          dataIndex: 'roomName'
        },
        {
          title: '直播编号',
          align: 'center',
          dataIndex: 'streamNumber'
        },
        {
          title: '预告时间',
          align: 'center',
          dataIndex: 'noticeTime'
        },
        {
          title: '开播时间',
          align: 'center',
          dataIndex: 'startTime'
        },
        {
          title: '结束时间',
          align: 'center',
          dataIndex: 'endTime'
        },
        {
          title: '封面图',
          align: 'center',
          dataIndex: 'surfacePlot',
          scopedSlots: { customRender: 'surfacePlot' }
        },
        {
          title: '海报图',
          align: 'center',
          dataIndex: 'posters',
          scopedSlots: { customRender: 'posters' }
        },
        {
          title: '背景墙',
          align: 'center',
          dataIndex: 'wallPanel',
          scopedSlots: { customRender: 'wallPanel' }
        },
        {
          title: '主播名字',
          align: 'center',
          dataIndex: 'hostName'
        },
        {
          title: '主播头像',
          align: 'center',
          dataIndex: 'headPortrait',
          scopedSlots: { customRender: 'headPortrait' }
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
        },
        {
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
          scopedSlots: { customRender: 'action' },
          width: 200,
          fixed: 'right'
        }
      ],
      url: {
        edit: '/marketing/marketingLiveStreaming/edit',
        list: '/marketing/marketingLiveStreaming/list',
        delete: '/marketing/marketingLiveStreaming/delete',
        deleteBatch: '/marketing/marketingLiveStreaming/deleteBatch',
        exportXlsUrl: 'marketing/marketingLiveStreaming/exportXls',
        importExcelUrl: 'marketing/marketingLiveStreaming/importExcel',
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
    getPicView: function(mainPicture) {
      if (mainPicture) {
        return this.url.imgerver + '/' + Object.values(JSON.parse(mainPicture))[0]
      } else {
        return ''
      }
    },
    onDateChange: function(value, dateString) {
      this.queryParam2.noticeTime_begin = dateString[0]
      this.queryParam2.noticeTime_end = dateString[1]
    },
    onDateChange2: function(value, dateString) {
      this.queryParam2.startTime_begin = dateString[0]
      this.queryParam2.startTime_end = dateString[1]
    },
    onDateChange3: function(value, dateString) {
      this.queryParam2.endTime_begin = dateString[0]
      this.queryParam2.endTime_end = dateString[1]
    },
    onDateChange4: function(value, dateString) {
      this.queryParam2.createTime_begin = dateString[0]
      this.queryParam2.createTime_end = dateString[1]
    },
    showLiveInfo(record) {
      this.$refs.MarketingLiveStreamingInfoModal.open(record)
    },
    showTJInfo(record) {
      this.$refs.MarketingLiveStreamingAllInfoModal.open(record)
    },
    async setVirtualOnlineNumber(record) {
      record.modalTitle = '虚拟人数设置'
      await this.$nextTick()
      this.handleEdit(record)
    },
    async showTextareaModal(record, type) {
      const allInfos = [
        {
          title: '结束',
          mainText: '结束后，直播间会关闭，用户无法再访问。',
          explainSureText: '您确定要结束吗'
        },
        {
          title: '删除',
          mainText: '删除房间后，该房间将无法恢复？',
          explainSureText: '您确定要删除吗'
        }
      ]
      this.modalForm2Record = record
      this.modalForm2Infos = allInfos[type]
      await this.$nextTick()
      this.$refs.modalForm2.show()
    },
    modalForm2Ok(infos) {
      const title = this.modalForm2Infos.title
      let url = this.url.edit
      let method = putAction
      if (title == '结束') {
        infos.status = 0
      } else if (title == '启用') {
        infos.status = 1
      }
      if (title == '删除') {
        url = this.url.delete
        method = deleteAction
      }
      infos.statusExplain = infos.modalExplain
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
@import '~@assets/less/common.less';
</style>
