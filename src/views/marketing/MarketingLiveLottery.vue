<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="直播编号">
              <a-input placeholder="请输入" v-model="queryParam.streamingStreamNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="直播间名称">
              <a-input placeholder="请输入" v-model="queryParam.roomName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="轮次名称">
              <a-input placeholder="请输入" v-model="queryParam.lotteryName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="开奖时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.lotteryTime"
                format="YYYY-MM-DD"
                :placeholder="['请选择', '请选择']"
                @change="lotteryTimeChange"
              />
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">未开奖</a-select-option>
                <a-select-option :value="1">已开奖</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="取消轮次">
              <a-select placeholder="请选择" v-decorator="queryParam.cancelNumber" @change="prizeTypeChange">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">未取消</a-select-option>
                <a-select-option :value="1">已取消</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item label="创建时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.createTime"
                format="YYYY-MM-DD"
                :placeholder="['请选择', '请选择']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">添加</a-button>
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
          <a @click="showGoodInformation(record.id)">开奖记录</a>
          <a-divider type="vertical" />
          <a @click="showPrizeModal(record)">奖品</a>
          <!-- <a v-if="record.status == 1" @click="showTextareaModal(record, 1)">停用</a>
          <a v-else @click="showTextareaModal(record, 2)">启用</a> -->
          <a-divider type="vertical" />
          <a @click="handleEdit(record)" v-if="record.cancelNumber == 0 && record.status == 0">编辑</a>

          <a @click="showTextareaModal(record, 3)" v-if="record.cancelNumber == 1">删除</a>
          <a-divider type="vertical" v-if="record.cancelNumber == 0 && record.status == 0" />
          <a @click="showTextareaModal(record, 1)" v-if="record.cancelNumber == 0">取消</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 添加编辑弹窗 -->
    <MarketingLiveLotteryModal ref="modalForm" @ok="modalFormOk"></MarketingLiveLotteryModal>
    <!-- 开奖记录弹窗 -->
    <AppMarketingLiveLotteryModal ref="AppMarketingLiveLotteryModal"></AppMarketingLiveLotteryModal>
    <!-- 奖品弹窗 -->
    <MarketingLiveLotteryPrizeDetail ref="MarketingLiveLotteryPrizeDetail"></MarketingLiveLotteryPrizeDetail>
    <!-- 删除取消弹窗 -->
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></textAreaModal>
  </a-card>
</template>

<script>
import MarketingLiveLotteryModal from './modules/MarketingLiveLotteryModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { postAction, getAction } from '@/api/manage'
import { filterObj } from '@/utils/util'
import AppMarketingLiveLotteryModal from './modules/AppMarketingLiveLotteryModal' //开奖记录弹窗
import MarketingLiveLotteryPrizeDetail from './modules/MarketingLiveLotteryPrizeDetail' //奖品弹窗
import textAreaModal from '@/components/popUp/textAreaModal' //取消删除弹窗
export default {
  name: 'MarketingLivePrizeList',
  mixins: [JeecgListMixin],
  components: {
    MarketingLiveLotteryModal,
    textAreaModal,
    AppMarketingLiveLotteryModal,
    MarketingLiveLotteryPrizeDetail
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
          title: '直播编号',
          align: 'center',
          dataIndex: 'streamingStreamNumber'
        },
        {
          title: '直播间名称',
          align: 'center',
          dataIndex: 'roomName'
          // customRender: function(prizeType) {
          //   if (prizeType == 0) {
          //     return '礼品'
          //   } else if (prizeType == 1) {
          //     return '优惠券'
          //   }
          // }
        },
        {
          title: '轮次名称',
          align: 'center',
          dataIndex: 'lotteryName'
        },
        {
          title: '抽奖编号',
          align: 'center',
          dataIndex: 'streamNumber'
        },
        {
          title: '抽奖轮次',
          align: 'center',
          dataIndex: 'lotteryNumber'
        },
        {
          title: '开奖时间',
          align: 'center',
          dataIndex: 'lotteryTime'
        },
        {
          title: '抽奖资格',
          align: 'center',
          dataIndex: 'lotteryQualification',
          customRender: function(lotteryQualification) {
            return '累计观看时长达到' + lotteryQualification + '分钟'
          }
        },
        {
          title: '参与人',
          align: 'center',
          dataIndex: 'participateMember'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          customRender: function(status) {
            if (status == 0) {
              return '未开奖'
            } else if (status == 1) {
              return '已开奖'
            }
          }
        },
        {
          title: '取消轮次',
          align: 'center',
          dataIndex: 'cancelNumber',
          customRender: function(cancelNumber) {
            if (cancelNumber == 0) {
              return '未取消'
            } else if (cancelNumber == 1) {
              return '已取消'
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
        edit: 'marketingLiveLottery/marketingLiveLottery/edit', //编辑
        list: '/marketingLiveLottery/marketingLiveLottery/list', //列表
        delete: '/marketingLiveLottery/marketingLiveLottery/delete', //删除
        deleteBatch: '/marketingLivePrize/marketingLivePrize/deleteBatch',
        exportXlsUrl: 'marketingLivePrize/marketingLivePrize/exportXls',
        importExcelUrl: 'marketingLivePrize/marketingLivePrize/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        cancel: 'marketingLiveLottery/marketingLiveLottery/LiveLotteryCancel' //取消
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    // 奖品弹窗
    showPrizeModal(record, type) {
      this.$refs.MarketingLiveLotteryPrizeDetail.show(record, type)
    },
    //开奖记录弹窗
    showGoodInformation(id) {
      this.$refs.AppMarketingLiveLotteryModal.showModalVisible(id)
    },
    getQueryParams() {
      console.log(this.queryParam.createTime)
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.createTime
      delete param.lotteryTime
      return filterObj(param)
    },
    lotteryTimeChange: function(value, dateString) {
      this.queryParam.lotteryTime_begin = dateString[0]
      this.queryParam.lotteryTime_end = dateString[1]
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
          title: '取消',
          mainText: '取消后,该轮次将无法恢复?',
          explainSureText: '您确定要取消吗',
          type: 1
        },
        {
          title: '启用',
          mainText: '启用后，该商品将在活动中展示',
          explainSureText: '您确定要启用吗'
        },
        {
          title: '删除',
          mainText: '删除后，该轮次将无法恢复。',
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
      if (title == '取消') {
        infos.cancelNumber = '1'
      }
      //  else if (title == '启用') {
      //   infos.status = 1
      // }
      let result
      infos.statusExplain = infos.modalExplain
      var obj = {}

      if (title == '删除') {
        obj.id = infos.id
        obj.delExplain = infos.statusExplain
        result = await postAction(this.url.delete, obj)
      }
      if (title == '取消') {
        obj.id = infos.id
        obj.lotteryNumber = infos.lotteryNumber
        obj.cancelNumber = infos.cancelNumber
        result = await postAction(this.url.cancel, obj)
      }

      // else {
      //   obj.id = infos.id
      //   obj.statusExplain = infos.statusExplain
      //   obj.status = infos.status
      //   obj.sort = infos.sort
      //   result = await postAction(this.url.edit, obj)
      // }
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
