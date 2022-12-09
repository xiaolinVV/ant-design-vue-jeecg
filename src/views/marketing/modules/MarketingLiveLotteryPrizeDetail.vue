<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="close"
    :footer="null"
  >
    <div class="center">
      <div class="title">中奖奖品</div>
      <div class="centerline">
        <div class="centerleft">奖品类型</div>
        <div v-if="record.lotteryPrizeType == 0">礼品</div>
        <div v-if="record.lotteryPrizeType == 1">优惠券</div>
      </div>
      <div class="centerline">
        <div class="centerleft">奖品信息</div>
        <div>{{ prizeName }}</div>
      </div>
      <div class="centerline">
        <div class="centerleft">奖励数量</div>
        <div>{{ record.lotteryPrizeQuantity }}</div>
      </div>
      <div class="centerline">
        <div class="centerleft">奖励总量</div>
        <div>{{ record.lotteryPrizeTotal }}</div>
      </div>
    </div>
    <div class="center">
      <div class="title">未中奖奖品</div>
      <div class="centerline">
        <div class="centerleft">奖品类型</div>
        <div v-if="record.lotteryPrizeType == 1">优惠券</div>
        <div v-if="record.lotteryPrizeType == 0">无</div>
      </div>
      <div class="centerline">
        <div class="centerleft">奖品信息</div>
        <div v-if="record.lotteryPrizeType == 1">{{ prizeidName }}</div>
        <div v-else>无</div>
      </div>
      <div class="centerline">
        <div class="centerleft">奖励数量</div>
        <div>1</div>
      </div>
      <div class="centerline">
        <div class="centerleft">奖励总量</div>
        <div>无限制</div>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { getAction } from '@/api/manage'
export default {
  name: 'MarketingZoneGroupOrderListDetail',
  data() {
    return {
      title: '奖品',
      visible: false,
      prizeName: '', //奖品信息
      prizeidName: '', //优惠券信息
      record: {},
      url: {
        marketingDiscountId: 'marketingLivePrize/marketingLivePrize/queryById', //通过优惠券id获取优惠券信息
        findMarketingLivePrizeList: 'marketingLivePrize/marketingLivePrize/findMarketingLivePrizeList' //奖品下拉列表
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.visible = false
    },
    async show(record) {
      this.visible = true
      this.confirmLoading = true
      this.record = record

      console.log(this.record, 'record')

      //中奖奖品信息显示
      let that = this
      if (record.lotteryPrizeType) {
        getAction(that.url.findMarketingLivePrizeList, { prizeType: record.lotteryPrizeType }).then(res => {
          if (res.success) {
            res.result.forEach(function(item) {
              if (item.id == record.lotteryPrizeId) {
                that.prizeName = item.name
              }
            })
          } else {
            that.$message.warning(res.message)
          }
        })
      }

      //未中奖优惠券信息
      if (record.losingLotteryPrizeType == 1) {
        // console.log('未中奖奖品')
        getAction(that.url.findMarketingLivePrizeList, { prizeType: 1, superInventory: 1 }).then(res => {
          if (res.success) {
            res.result.forEach(function(item) {
              if (item.id == record.losingLotteryPrizeId) {
                that.prizeidName = item.name
              }
            })
          } else {
            that.$message.warning(res.message)
          }
        })
      }
      await this.$nextTick()
    }
  }
}
</script>
<style lang="scss">
.center {
  background-color: #f2f2f2;
  padding: 20px;
  margin-bottom: 20px;
  .title {
    font-weight: bold;
  }

  .centerline {
    display: flex;
    margin-top: 20px;
  }
  .centerleft {
    margin-right: 30px;
  }
}
</style>
