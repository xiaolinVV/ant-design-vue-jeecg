<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="close"
    :footer="null"
  >
    <div v-if="type == 1 || type == 4">
      <div class="CouponTextA">
        <div class="CouponText">买家账号</div>
        <div class="CouponText2">{{ dataSource.phone }}</div>
        <div class="CouponText">买家昵称</div>
        <div class="CouponText2">{{ dataSource.nickName }}</div>
      </div>
      <div class="CouponTextA">
        <div class="CouponText">会员类型</div>
        <div class="CouponText2">{{ dataSource.memberType == 1 ? 'vip会员' : '普通会员' }}</div>
        <div class="CouponText">会员等级</div>
        <div class="CouponText2">{{ dataSource.gradeName }}</div>
      </div>
      <div class="CouponTextA">
        <div class="CouponText">收货人</div>
        <div class="CouponText2">{{ dataSource.consignee }}</div>
        <div class="CouponText">联系电话</div>
        <div class="CouponText2">{{ dataSource.contactNumber }}</div>
      </div>
      <div class="CouponTextA">
        <div class="CouponText" style="width:18.1%">收货地址</div>
        <div class="CouponText2" style="flex:1">{{ dataSource.shippingAddress }}</div>
      </div>
    </div>

    <div v-if="type == 2" class="messageWrap">留言内容：{{ record.message }}</div>
    <div v-if="type == 3">
      <div class="suppliers">
        <div>
          <span>供应商</span>
          <span class="suppliers-content">{{ dataSource[0] && dataSource[0].name }}</span>
        </div>
      </div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :pagination="false"
        :dataSource="dataSource"
      >
        <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
        <template slot="mainPicture" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar
              shape="square"
              v-if="record.mainPicture != undefined"
              :src="getAvatarView(JSON.parse(record.mainPicture)[0])"
              icon="user"
            />
            <a-avatar
              shape="square"
              v-if="record.mainPicture == undefined || record.mainPicture == ''"
              :src="getAvatarView(record.mainPicture)"
              icon="user"
            />
          </div>
        </template>
      </a-table>
    </div>
  </a-modal>
</template>
<script>
import { getAction } from '@/api/manage'
export default {
  name: 'MarketingZoneGroupOrderListDetail',
  data() {
    return {
      visible: false,
      confirmLoading: false,
      //1会员手机号详情 2留言信息 3商品信息
      type: -1,
      record: {},
      dataSource: [],
      columns: [
        {
          title: '商品编号',
          align: 'center',
          dataIndex: 'goodNo'
        },
        {
          title: '商品主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '商品名称',
          align: 'center',
          dataIndex: 'goodName',
          width: 200
        },

        {
          title: '商品规格',
          align: 'center',
          dataIndex: 'specification'
        },

        {
          title: '活动价格',
          align: 'center',
          dataIndex: 'price'
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'quantity'
        },
        {
          title: '小计',
          align: 'center',
          dataIndex: 'goodsTotal'
        },
        {
          title: '重量',
          align: 'center',
          dataIndex: 'weight'
        }
      ],
      title: '',
      url: {
        //会员详情
        memberRecord: '/marketingZoneGroupOrder/marketingZoneGroupOrder/memberRecord',
        // 商品信息
        goodInfo: 'marketingZoneGroupOrder/marketingZoneGroupOrder/goodInfo',
        //创业礼包购买记录收货信息
        getGiftRecordDetails: 'marketingBusinessGiftRecord/marketingBusinessGiftRecord/getGiftRecordDetails',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      }
    }
  },
  methods: {
    getAvatarView: function(mainPicture) {
      return this.url.imgerver + '/' + mainPicture
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    async show(record, type) {
      this.visible = true
      this.confirmLoading = true
      this.type = type
      this.record = record
      await this.$nextTick()
      if (type == 1) {
        await this.getMemberRecord()
      }
      if (type == 3) {
        await this.getGoodInfo()
      }
      if (type == 2) {
        this.title = '留言内容'
      }
      if (type == 4) {
        await this.showGiftRecordDetails()
      }
      this.confirmLoading = false
    },
    getMemberRecord() {
      return new Promise(resolve => {
        this.title = '会员手机号'
        getAction(this.url.memberRecord, { id: this.record.id }).then(res => {
          if (res.success) {
            this.dataSource = res.result || {}
          } else {
            this.dataSource = {}
            this.$message.warn(res.message)
          }
          resolve()
        })
      })
    },
    showGiftRecordDetails() {
      return new Promise(resolve => {
        this.title = '收货信息'
        getAction(this.url.getGiftRecordDetails, { id: this.record.id }).then(res => {
          if (res.success) {
            this.dataSource = res.result || {}
          } else {
            this.dataSource = {}
            this.$message.warn(res.message)
          }
          resolve()
        })
      })
    },
    getGoodInfo() {
      return new Promise(resolve => {
        this.title = '商品详情'
        getAction(this.url.goodInfo, { id: this.record.id }).then(res => {
          if (res.success) {
            this.dataSource = res.result ? [res.result] : []
          } else {
            this.dataSource = []
            this.$message.warn(res.message)
          }
          resolve()
        })
      })
    }
  }
}
</script>
<style lang="scss">
.CouponTextA {
  display: flex;
  justify-content: space-between;

  justify-items: center;
}

.CouponText {
  float: left;
  padding-right: 30px;
  border: 1px solid #ccc;
  width: 35%;
  height: 40px;
  background-color: #f2f2f2;
  line-height: 40px;
  text-align: right;
}

.CouponText2 {
  float: left;
  padding-left: 30px;
  border: 1px solid #ccc;
  width: 65%;
  height: 40px;
  line-height: 40px;
  text-align: left;
}
.messageWrap {
  padding: 30px;
  border: 1px solid gainsboro;
  border-radius: 10px;
  height: 250px;
}
</style>
