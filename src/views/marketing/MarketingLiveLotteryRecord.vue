<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="会员编号">
              <a-input placeholder="请输入" v-model="queryParam.memberListId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员手机号">
              <a-input placeholder="请输入" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员昵称">
              <a-input placeholder="请输入" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="奖品单号">
              <a-input placeholder="请输入" v-model="queryParam.lotteryNo"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item label="请选择奖品类型">
              <a-select placeholder="请选择奖品类型" v-decorator="queryParam.prizeType">
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
            <a-form-item label="获得时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.getTime"
                format="YYYY-MM-DD"
                :placeholder="['请选择', '请选择']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="领取状态">
                <a-select v-model="queryParam.drawStatus" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">未领取</a-select-option>
                  <a-select-option :value="1">已领取</a-select-option>
                </a-select>
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
        <template slot="headPortrait" slot-scope="text, record, index">
          <img class="clickShowImage" v-if="text != undefined" :preview="'headPortrait' + index" :src="text" />
        </template>

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

        <span slot="information" slot-scope="text, record">
          <a @click="informationModal(record)">领取信息</a>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="showEdit(record, 1)">备注</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <!-- 奖品弹窗 -->
    <MarketingLiveLotteryinformationModal
      ref="MarketingLiveLotteryinformationModal"
    ></MarketingLiveLotteryinformationModal>
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></textAreaModal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import MarketingLiveLotteryinformationModal from './modules/MarketingLiveLotteryinformationModal' //奖品弹窗
import textAreaModal from '@/components/popUp/remarksModal' //取消删除弹窗
import { postAction, getAction } from '@/api/manage'
import { filterObj } from '@/utils/util'
export default {
  name: 'MarketingLivePrizeList',
  mixins: [JeecgListMixin],
  components: {
    textAreaModal,
    MarketingLiveLotteryinformationModal
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
          title: '会员编号',
          align: 'center',
          dataIndex: 'memberListId'
        },
        {
          title: '会员头像',
          align: 'center',
          dataIndex: 'headPortrait',
          scopedSlots: { customRender: 'headPortrait' }
        },
        {
          title: '会员手机号',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '会员昵称',
          align: 'center',
          dataIndex: 'nickName'
        },
        {
          title: '奖品单号',
          align: 'center',
          dataIndex: 'lotteryNo'
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
          title: '奖品数量',
          align: 'center',
          dataIndex: 'quantity'
        },
        {
          title: '获得时间',
          align: 'center',
          dataIndex: 'getTime'
        },
        {
          title: '领取状态',
          align: 'center',
          dataIndex: 'drawStatus',
          customRender: function(drawStatus) {
            if (drawStatus == 0) {
              return '未领取'
            } else if (drawStatus == 1) {
              return '已领取'
            }
          }
        },
        {
          title: '领取信息',
          align: 'center',
          dataIndex: 'information',
          scopedSlots: { customRender: 'information' }
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'remark'
        },

        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        edit: 'marketingLiveLotteryRecord/marketingLiveLotteryRecord/edit', //备注
        list: '/marketingLiveLotteryRecord/marketingLiveLotteryRecord/list',
        delete: '/marketingLivePrize/marketingLivePrize/delete',
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
    getPicView: function(mainPicture) {
      if (mainPicture) {
        return this.url.imgerver + '/' + Object.values(JSON.parse(mainPicture))[0]
      } else {
        return ''
      }
    },
    getQueryParams() {
      console.log(this.queryParam.getTime)
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.getTime
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      this.queryParam.getTime_begin = dateString[0]
      this.queryParam.getTime_end = dateString[1]
    },

    //领取信息弹窗
    informationModal(record, type) {
      this.$refs.MarketingLiveLotteryinformationModal.show(record, type)
    },
    // 备注弹窗
    async showEdit(record, type) {
      const allInfos = [
        {
          title: '备注'
        }
      ]
      this.modalForm2Record = record
      this.modalForm2Infos = allInfos[type - 1]
      await this.$nextTick()
      this.$refs.modalForm2.show()
    },

    async modalForm2Ok(infos) {
      const title = this.modalForm2Infos.title

      let result
      infos.remark = infos.modalExplain
      var obj = {}

      if (title == '备注') {
        obj.id = infos.id
        obj.remark = infos.remark
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
