<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="奖品编号">
              <a-input placeholder="请输入" v-model="queryParam.prizeSerialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="奖品类型">
              <!-- <a-input placeholder="请输入" v-model="queryParam.prizeType"></a-input> -->
              <a-select placeholder="请选择奖励类型" v-decorator="queryParam.prizeType" @change="prizeTypeChange">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">礼品</a-select-option>
                <a-select-option :value="1">优惠券</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="奖品名称">
              <a-input placeholder="请输入" v-model="queryParam.prizeName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="超库存">
              <!-- <a-input placeholder="请选择" v-model="queryParam.superInventory"></a-input> -->
              <a-select placeholder="请选择奖励类型" v-decorator="queryParam.superInventory" @change="awardTypeChange">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">不允许</a-select-option>
                <a-select-option :value="1">允许</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
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
    </div>

    <!-- table区域-begin -->
    <div>
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
        <template slot="prizeImage" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="text != undefined"
            :preview="'prizeImage' + index"
            :src="getPicView(text)"
            alt=""
          />
          <a-avatar shape="square" v-if="text == undefined || text == ''" :src="getPicView(text)" icon="user" />
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a v-if="record.status == 1" @click="showTextareaModal(record, 1)">停用</a>
          <a v-else @click="showTextareaModal(record, 2)">启用</a>
          <a-divider type="vertical" v-if="record.status != 1" />
          <a @click="showTextareaModal(record, 3)" v-if="record.status != 1">删除</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingLivePrize-modal ref="modalForm" @ok="modalFormOk"></marketingLivePrize-modal>
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></textAreaModal>
  </a-card>
</template>

<script>
import MarketingLivePrizeModal from './modules/MarketingLivePrizeModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import textAreaModal from '@/components/popUp/textAreaModal'
import { postAction, getAction } from '@/api/manage'
import { filterObj } from '@/utils/util'
export default {
  name: 'MarketingLivePrizeList',
  mixins: [JeecgListMixin],
  components: {
    MarketingLivePrizeModal,
    textAreaModal
  },
  data() {
    return {
      modalForm2Record: {},
      modalForm2Infos: {},
      description: '直播管理-抽奖奖品管理页面',
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
          title: '奖品编号',
          align: 'center',
          dataIndex: 'prizeSerialNumber'
        },
        {
          title: '奖品类型',
          align: 'center',
          dataIndex: 'prizeType',
          customRender: function(prizeType) {
            if (prizeType == 0) {
              return '礼品'
            } else if (prizeType == 1) {
              return '优惠券'
            }
          }
        },
        {
          title: '奖品名称',
          align: 'center',
          dataIndex: 'prizeName'
        },
        {
          title: '奖品图片',
          align: 'center',
          dataIndex: 'prizeImage',
          scopedSlots: { customRender: 'prizeImage' }
        },
        {
          title: '奖品实际库存',
          align: 'center',
          dataIndex: 'repertory'
        },

        {
          title: '超库存',
          align: 'center',
          dataIndex: 'superInventory',
          customRender: function(superInventory) {
            if (superInventory == 0) {
              return '不允许'
            } else if (superInventory == 1) {
              return '允许'
            }
          }
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          customRender: function(text) {
            if (text == 0) {
              return '停用'
            } else if (text == 1) {
              return '启用'
            }
          }
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
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        edit: 'marketingLivePrize/marketingLivePrize/edit',
        list: '/marketingLivePrize/marketingLivePrize/list',
        delete: '/marketingLivePrize/marketingLivePrize/delete',
        deleteBatch: '/marketingLivePrize/marketingLivePrize/deleteBatch',
        exportXlsUrl: 'marketingLivePrize/marketingLivePrize/exportXls',
        importExcelUrl: 'marketingLivePrize/marketingLivePrize/importExcel',
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
    getQueryParams() {
      console.log(this.queryParam.createTime)
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.createTime
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    prizeTypeChange(value) {
      console.log(value)
      this.queryParam.prizeType = value
    },
    awardTypeChange(value) {
      console.log(value)
      this.queryParam.superInventory = value
    },
    getPicView: function(mainPicture) {
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
          mainText: '停用后，该商品将不在活动中展示',
          explainSureText: '您确定要停用吗'
        },
        {
          title: '启用',
          mainText: '启用后，该商品将在活动中展示',
          explainSureText: '您确定要启用吗'
        },
        {
          title: '删除',
          mainText: '删除后，该商品将不在活动中展示。',
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
      var obj = {}

      if (title == '删除') {
        obj.id = infos.id
        obj.delExplain = infos.statusExplain
        result = await postAction(this.url.delete, obj)
      } else {
        obj.id = infos.id
        obj.statusExplain = infos.statusExplain
        obj.status = infos.status
        obj.sort = infos.sort
        result = await postAction(this.url.edit, obj)
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
