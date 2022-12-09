<!--兑换券适用商品-->
<template>
  <div>
    <a-modal
      :title="title"
      :width="1200"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭"
      class="AppMarketingLiveLotteryModal"
    >
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="会员编号">
              <a-input placeholder="请输入会员编号" style="width: 200px;" v-model="queryParam.memberListId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员手机号">
              <a-input placeholder="请输入会员手机号" style="width: 200px;" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="会员昵称">
              <a-input placeholder="请输入会员昵称" style="width: 200px;" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="18" :sm="8">
            <a-form-item label="是否中奖" style="width: 100%;display: flex;align-items: center">
              <!--下拉框-->
              <a-select placeholder="请选择" style="width: 200px;margin-right: 20px" v-model="queryParam.isLottery">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">未中奖</a-select-option>
                <a-select-option :value="1">已中奖</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="8" style="display: flex;align-items: center;margin-top: 10px">
            <a-button type="primary" @click="search" icon="search">
              查询
            </a-button>
            <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
          </a-col>
        </a-row>
      </a-form>

      <a-table
        bordered
        :dataSource="dataSource"
        :columns="columns"
        :pagination="ipagination"
        :scroll="{ y: 600, x: 1500 }"
        style="margin-top: 10px;"
        :loading="loading"
        @change="handleTableChange"
      >
        <!-- 会员头像 -->
        <template slot="headPortrait" slot-scope="text, record, index">
          <img class="clickShowImage" v-if="text != undefined" :preview="'headPortrait' + index" :src="text" alt="" />
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { httpAction, postAction, getAction, putAction } from '@/api/manage'
import AModal from 'ant-design-vue/es/modal/Modal'

export default {
  components: { AModal },
  name: 'AppMarketingLiveLotteryModal',
  data() {
    return {
      title: '兑换商品',
      visible: false, //弹窗显示隐藏
      confirmLoading: false, //是否正在加载
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      //查询条件
      queryParam: {
        memberListId: '',
        phone: '',
        nickName: '',
        isLottery: ''
      },
      dataSource: [],
      //接口
      url: {
        //适用商品返显
        findByMarketingDiscount: 'marketingLiveLotteryRecord/marketingLiveLotteryRecord/list'
      },
      //配置
      configure: {
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view'
      },
      count: 2,
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: '5%',
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '会员编号',
          dataIndex: 'memberListId',
          width: '15%',
          align: 'center'
        },
        {
          title: '会员头像',
          dataIndex: 'headPortrait',
          width: '5%',
          align: 'center',
          scopedSlots: { customRender: 'headPortrait' }
        },
        {
          title: '会员手机号',
          dataIndex: 'phone',
          width: '15%',
          align: 'center'
        },
        {
          title: '会员昵称',
          dataIndex: 'nickName',
          width: '8%',
          align: 'center'
        },
        {
          title: '累计时长',
          dataIndex: 'totalTimes',
          width: '8%',
          align: 'center'
        },
        {
          title: '是否中奖',
          dataIndex: 'isLottery',
          width: '8%',
          align: 'center',
          customRender: function(isLottery) {
            if (isLottery == 0) {
              return '未中奖'
            } else if (isLottery == 1) {
              return '已中奖'
            }
          }
        },
        {
          title: '奖品单号',
          dataIndex: 'lotteryNo',
          width: '8%',
          align: 'center'
        },
        {
          title: '奖品名称',
          dataIndex: 'prizeType',
          width: '6%',
          align: 'center',
          customRender: function(prizeType) {
            if (prizeType == 0) {
              return '礼品'
            } else if (prizeType == 1) {
              return '优惠券'
            }
          }
        },
        {
          title: '奖品数量',
          dataIndex: 'quantity',
          width: '5%',
          align: 'center'
        }
      ],
      loading: false
    }
  },

  mounted() {},
  methods: {
    //弹窗确定事件
    handleOk() {
      this.hideModalVisible()
    },
    //弹窗取消事件
    handleCancel() {
      this.hideModalVisible()
    },

    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      // if (Object.keys(sorter).length > 0) {
      //   this.isorter.column = sorter.field;
      //   this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
      // }
      this.ipagination = pagination
      // this.loadData();
    },
    //显示弹窗
    showModalVisible(id) {
      this.marketingCertificateId = id
      this.$nextTick(() => {
        this.searchReset()
      })
    },
    //隐藏弹窗
    hideModalVisible() {
      this.visible = false
    },
    //搜索
    search() {
      this.visible = true
      this.loading = true
      let that = this
      let info = {
        marketingLiveLotteryId: this.marketingCertificateId
      }
      //参数  marketingDiscountId
      info = Object.assign({}, info, this.queryParam)
      getAction(that.url.findByMarketingDiscount, info).then(res => {
        if (res.success) {
          for (let item of res.result.records) {
            if (item.mainPicture) {
              item.mainPicture = this.configure.imgErver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
            }
          }
          this.dataSource = res.result.records
        }
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    },
    searchReset() {
      this.$nextTick(() => {
        this.search()
      })
    }
  }
}
</script>

<style lang="less">
.ApplicableCommodityModal {
  .ant-modal-body {
    vertical-align: center;
  }

  .ant-form-item-control-wrapper {
    width: 80% !important;
  }

  .ant-form-inline .ant-form-item {
    display: flex;
  }

  .ant-form-item-control {
    width: 100% !important;
  }
}
</style>
