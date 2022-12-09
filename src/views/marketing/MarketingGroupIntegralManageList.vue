<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="活动名称">
              <a-input placeholder="请输入活动名称" v-model="queryParam.anotherName"></a-input>
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
      <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
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
        :scroll="{ x: 2500 }"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="surfacePlot" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="text != undefined"
            :preview="'surfacePlot' + index"
            :src="handleImage(text)"
            alt=""
          />
          <a-avatar shape="square" v-if="text == undefined || text == ''" :src="handleImage(text)" icon="user" />
        </template>

        <template slot="mainPicture" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="text != undefined"
            :preview="'mainPicture' + index"
            :src="handleImage(text)"
            alt=""
          />
          <a-avatar shape="square" v-if="text == undefined || text == ''" :src="handleImage(text)" icon="user" />
        </template>

        <template slot="payment" slot-scope="text">
          {{ text == 0 ? '产品券' : ' - ' }}
        </template>

        <template slot="rewardType" slot-scope="text">
          {{ text == 0 ? '产品券' : ' - ' }}
        </template>
        <template slot="prizeType" slot-scope="text">
          {{ text == 0 ? '兑换券' : ' - ' }}
        </template>

        <template slot="status" slot-scope="text">
          <div class="anty-img-wrap">
            <div v-if="text == 1">启用</div>
            <div v-else>停用</div>
          </div>
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
    <marketingGroupIntegralManage-modal ref="modalForm" @ok="modalFormOk"></marketingGroupIntegralManage-modal>
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></textAreaModal>
  </a-card>
</template>

<script>
import MarketingGroupIntegralManageModal from './modules/MarketingGroupIntegralManageModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import textAreaModal from '@/components/popUp/textAreaModal'
import { putAction, deleteAction } from '@/api/manage'
export default {
  name: 'MarketingGroupIntegralManageList',
  mixins: [JeecgListMixin],
  components: {
    MarketingGroupIntegralManageModal,
    textAreaModal
  },
  data() {
    return {
      description: '拼购管理管理页面',
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
          title: '活动别名',
          align: 'center',
          dataIndex: 'anotherName'
        },
        {
          title: '封面图',
          align: 'center',
          dataIndex: 'surfacePlot',
          scopedSlots: { customRender: 'surfacePlot' }
        },
        {
          title: '主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          // ；0：产品券
          title: '支付方式',
          align: 'center',
          dataIndex: 'payment',
          scopedSlots: { customRender: 'payment' }
        },
        {
          title: '支付金额',
          align: 'center',
          dataIndex: 'paymentAmount'
        },
        {
          title: '成团人数',
          align: 'center',
          dataIndex: 'numberClusters'
        },
        {
          title: '参与拼购奖励',
          align: 'center',
          dataIndex: 'groupRewards'
        },
        {
          title: '推荐拼购奖励',
          align: 'center',
          dataIndex: 'recommendGroupRewards'
        },
        {
          // ；0：产品券
          title: '未中奖奖品类型',
          align: 'center',
          dataIndex: 'rewardType',
          scopedSlots: { customRender: 'rewardType' }
        },
        {
          // ；0：兑换券
          title: '中奖奖品类型',
          align: 'center',
          dataIndex: 'prizeType',
          scopedSlots: { customRender: 'prizeType' }
        },
        {
          title: '未中奖奖励',
          align: 'center',
          dataIndex: 'missedRewards'
        },
        {
          title: '转化阈值',
          align: 'center',
          dataIndex: 'threshold'
        },
        {
          title: '转入余额',
          align: 'center',
          dataIndex: 'intoBalance'
        },
        {
          title: '转入购物积分',
          align: 'center',
          dataIndex: 'intoShoppingCredits'
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
        },
        {
          // ；0：进行中；1：已成功；2：已失败
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
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          fixed: 'right',
          width: 230
        }
      ],
      modalForm2Record: {},
      modalForm2Infos: {},
      url: {
        list: '/marketing/marketingGroupIntegralManage/list',
        delete: '/marketing/marketingGroupIntegralManage/delete',
        deleteBatch: '/marketing/marketingGroupIntegralManage/deleteBatch',
        exportXlsUrl: 'marketing/marketingGroupIntegralManage/exportXls',
        importExcelUrl: 'marketing/marketingGroupIntegralManage/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        edit: '/marketing/marketingGroupIntegralManage/edit'
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
          mainText: '停用后活动无法访问。',
          explainSureText: '您确定要停用吗'
        },
        {
          title: '启用',
          mainText: '启动该活动将可以访问。',
          explainSureText: '您确定要启用吗'
        },
        {
          title: '删除',
          mainText: '删除后该活动将无法恢复。',
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
@import "~@assets/less/common.less";
</style>
