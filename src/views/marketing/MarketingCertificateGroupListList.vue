<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="活动编号">
              <j-input placeholder="请输入活动编号" v-model="queryParam.activityNumber"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="兑换券id">
              <j-input placeholder="请输入兑换券id" v-model="queryParam.marketingCertificateId"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="兑换券名称">
              <j-input placeholder="请输入兑换券名称" v-model="queryParam.name"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">停用</a-select-option>
                <a-select-option :value="1">启用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--<a-col :md="6" :sm="8">
            <a-form-item label="加入时间">
              <a-range-picker
                v-model="queryParam2.joinDate"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>-->
          <a-col :md="6" :sm="8">
            <a-form-item label="加入时间">
              <a-range-picker
                format="YYYY-MM-DD HH:mm:ss"
                v-model="queryParam2.joinDate"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="更新时间">
              <a-range-picker
                format="YYYY-MM-DD HH:mm:ss"
                v-model="queryParam2.updateTime"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange2"
              />
            </a-form-item>
          </a-col>
          <!-- <a-col :md="24" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col> -->
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="toEdit" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset2" icon="reload" style="margin-left: 8px">重置</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('拼好券')">导出</a-button>
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
      </a-dropdown> -->
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
        :scroll="{ x: 2500 }"
      >
        <template slot="status" slot-scope="text, record">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">停用</span>
            <span shape="square" v-if="record.status == 1">启用</span>
          </div>
        </template>
        <template slot="mainPicture" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="record.mainPicture != undefined"
            :preview="'mainPicture' + index"
            :src="handleImage(text)"
            alt=""
          />
          <a-avatar
            shape="square"
            v-if="record.mainPicture == undefined || record.mainPicture == ''"
            :src="handleImage(text)"
            icon="user"
          />
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="toEditRecord(record, 1)">排序</a>
          <a-divider type="vertical" />
          <a v-if="record.status == 1" @click="showTextareaModal(record, 1)">停用</a>
          <a v-else @click="showTextareaModal(record, 2)">启用</a>
          <a-divider type="vertical" />
          <a @click="toEditRecord(record, 2)">改活动价格</a>
          <a-divider type="vertical" />
          <a @click="showTextareaModal(record, 3)">删除</a>
          <a-divider type="vertical" />
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingCertificateGroupList-modal ref="modalForm" @ok="modalFormOk"></marketingCertificateGroupList-modal>
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></textAreaModal>
  </a-card>
</template>

<script>
import MarketingCertificateGroupListModal from './modules/MarketingCertificateGroupListModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import textAreaModal from '@/components/popUp/textAreaModal'
import { httpAction, getAction, postAction, putAction } from '@/api/manage'
import { filterObj } from '@/utils/util'
import { deleteAction } from '../../api/manage'
import JInput from '@/components/jeecg/JInput.vue'
import JDate from '@/components/jeecg/JDate.vue'
export default {
  name: 'MarketingCertificateGroupListList',
  mixins: [JeecgListMixin],
  components: {
    JDate,
    JInput,
    MarketingCertificateGroupListModal,
    textAreaModal
  },
  data() {
    return {
      description: '拼好券管理页面',
      modalForm2Record: {},
      modalForm2Infos: {},
      queryParam2: {},
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
          title: '活动编号',
          align: 'center',
          dataIndex: 'activityNumber'
        },
        {
          title: '兑换券id',
          align: 'center',
          dataIndex: 'marketingCertificateId'
        },
        {
          title: '兑换券名称',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '市场价',
          align: 'center',
          dataIndex: 'marketPrice'
        },
        {
          title: '销售价',
          align: 'center',
          dataIndex: 'price'
        },
        {
          title: '成本价',
          align: 'center',
          dataIndex: 'costPrice'
        },

        {
          title: '库存',
          align: 'center',
          dataIndex: 'total'
        },
        {
          title: '活动折扣(%)',
          align: 'center',
          dataIndex: 'discountActivity'
        },
        {
          title: '活动价',
          align: 'center',
          dataIndex: 'activityPrice'
        },
        {
          title: '成团人数',
          align: 'center',
          dataIndex: 'numberClusters'
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
          title: '状态说明',
          align: 'center',
          dataIndex: 'statusExplain'
        },
        {
          title: '加入时间',
          align: 'center',
          dataIndex: 'joinDate'
        },
        {
          title: '加入者',
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
          fixed: 'right',
          width: 250,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/marketingCertificateGroupList/marketingCertificateGroupList/list',
        delete: '/marketingCertificateGroupList/marketingCertificateGroupList/delete',
        deleteBatch: '/marketingCertificateGroupList/marketingCertificateGroupList/deleteBatch',
        exportXlsUrl: 'marketingCertificateGroupList/marketingCertificateGroupList/exportXls',
        importExcelUrl: 'marketingCertificateGroupList/marketingCertificateGroupList/importExcel',
        edit: '/marketingCertificateGroupList/marketingCertificateGroupList/edit',
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
    async searchReset2() {
      this.queryParam2 = {}
      await this.$nextTick()
      this.searchReset()
    },
    onDateChange: function(value, dateString) {
      this.queryParam.joinDate_begin = dateString[0]
      this.queryParam.joinDate_end = dateString[1]
    },
    onDateChange2: function(value, dateString) {
      this.queryParam.updateTime_begin = dateString[0]
      this.queryParam.updateTime_end = dateString[1]
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
    modalForm2Ok(infos) {
      const title = this.modalForm2Infos.title
      if (title == '停用') {
        infos.status = 0
      } else if (title == '启用') {
        infos.status = 1
      }
      putAction(this.url.edit, infos).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.error(res.message)
        }
      })
      console.log(infos)
    },
    toEdit() {
      this.$router.push({ path: '/marketing/modules/MarketingCertificateGroupAddCertifacate' })
    },
    toEditRecord(record, type) {
      record.openType = type
      this.handleEdit(record)
    },
    async showTextareaModal(record, type) {
      const allInfos = [
        {
          title: '停用',
          mainText: '停用后，该券将不在活动中展示。',
          explainSureText: '您确定要停用吗'
        },
        {
          title: '启用',
          mainText: '启用后，该券将会在活动中展示。',
          explainSureText: '您确定要启用吗'
        },
        {
          title: '删除',
          mainText: '删除后，该券将不在活动中展示。',
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
      infos.statusExplain = infos.modalExplain
      let result
      if (title == '删除') {
        result = await deleteAction(this.url.delete, infos)
      } else {
        result = await postAction(this.url.edit, infos)
      }
      if (result.success) {
        this.$message.success(result.message)
        this.loadData()
      } else {
        this.$message.error(result.message)
      }

      console.log(infos)
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
