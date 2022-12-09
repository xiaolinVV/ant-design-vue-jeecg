<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <div class="districtClassification" v-if="type == 1">
      <div class="line">
        <div class="label">
          活动商品分类
        </div>
        <div class="value">
          <a-select v-if="!confirmLoading" v-model="model.marketingFreeGoodTypeId" style="width:120px">
            <a-select-option value="">
              请选择
            </a-select-option>
            <a-select-option :value="item.value" v-for="(item, index) in prefectureType" :key="index">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </div>

    <div class="districtPrice" v-else-if="type == 2">
      <div class="wrap">
        <div class="line">
          <div>
            规格
          </div>
          <div>
            活动折扣
          </div>
          <div>
            活动价格
          </div>
        </div>
        <div v-if="goodListSpecificationList.length > 0">
          <div class="line" v-for="(item, index) in goodListSpecificationList" :key="index">
            <div>
              {{ item.specification || '无' }}
            </div>
            <div>
              <a-input
                v-model="item.freePriceProportion"
                style="width: 100px;display: inline-block;margin: 0 5px;"
                @change="value => prefecturePriceProportionChange(item, value)"
              ></a-input>
              %
            </div>
            <div>
              <a-input
                v-model="item.freePrice"
                style="width: 100px;display: inline-block;margin: 0 5px;"
                @change="value => prefecturePriceChange(item, value)"
              >
              </a-input>
            </div>
          </div>
        </div>
        <div v-else style="margin: 0 auto;text-align: center">
          暂无规格
        </div>
      </div>
    </div>
    <div v-else style="display:flex;align-items:center">
      <div style="margin-right:20px">
        排序:
      </div>
      <a-input-number v-model="model.sort" :precision="0" :min="0" />
    </div>
  </a-modal>
</template>

<script>
import { httpAction, getAction, postAction, putAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'

export default {
  name: 'MarketingFreeGoodListModal',
  data() {
    return {
      visible: false,
      model: {},
      goodListSpecificationList: [],
      type: '',
      confirmLoading: false,
      url: {
        edit: '/marketing/marketingFreeGoodList/edit',
        //获取免单活动商品类型（1）
        getAllMarketingFreeGoodType: 'marketing/marketingFreeGoodType/getAllMarketingFreeGoodType',
        // 根据免单商品id查询规格数据(1)
        selectMarketingFreeGoodSpecificationByMarketingFreeGoodListId:
          'marketing/marketingFreeGoodSpecification/selectMarketingFreeGoodSpecificationByMarketingFreeGoodListId',
        setBatchByMarketingFreeGoodSpecificationId:
          'marketing/marketingFreeGoodSpecification/setBatchByMarketingFreeGoodSpecificationId'
      },
      prefectureType: []
    }
  },
  created() {},
  computed: {
    title({ type }) {
      if (type == 1) {
        return '活动商品分类'
      } else if (type == 2) {
        return '活动价格'
      } else {
        return '排序'
      }
    }
  },
  methods: {
    add() {
      this.edit({})
    },
    async edit(record) {
      this.visible = true
      this.type = record.title
      this.goodListSpecificationList = []
      this.model = Object.assign({}, record)
      this.confirmLoading = true
      if (this.type == 1) {
        await this.getMarketingPrefectureType()
      } else {
        await this.selectMarketingFreeGoodSpecificationByMarketingFreeGoodList()
      }
      this.confirmLoading = false
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      let url = this.url.edit
      let options = this.model
      let method = putAction
      if (this.type == 2) {
        url = this.url.setBatchByMarketingFreeGoodSpecificationId
        let lists = this.goodListSpecificationList.map(item => ({
          freePrice: item.freePrice,
          freePriceProportion: item.freePriceProportion,
          marketingFreeGoodSpecificationId: item.id
        }))
        options = JSON.stringify(lists)
        method = postAction
      }

      method(url, options, {
        'Content-Type': 'application/json'
      }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.$emit('handleOk')
          this.close()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleCancel() {
      this.close()
    },
    //折扣输入框改变值
    prefecturePriceProportionChange(record) {
      this.$set(record, 'freePrice', (record.freePriceProportion * this.model.price) / 100 || 0)
    },
    //价格输入框改变值
    prefecturePriceChange(record) {
      // setTimeout(() => {
      this.$set(record, 'freePriceProportion', (record.freePrice / this.model.price) * 100 || 0)
      // record.freePriceProportion = (record.freePrice / record.price) * 100 || 0
      //   console.log(record)
      // }, 200)
    },
    getMarketingPrefectureType() {
      return new Promise(resolve => {
        getAction(this.url.getAllMarketingFreeGoodType).then(res => {
          if (res.success) {
            let sz = []
            for (let item of res.result) {
              sz.push({
                label: item.typeName,
                value: item.id,
                isLeaf: false
              })
            }
            this.prefectureType = sz
            this.$nextTick(() => {
              resolve()
            })
          } else {
            resolve()
          }
        })
      })
    },
    selectMarketingFreeGoodSpecificationByMarketingFreeGoodList() {
      return new Promise(resolve => {
        getAction(this.url.selectMarketingFreeGoodSpecificationByMarketingFreeGoodListId, {
          marketingFreeGoodListId: this.model.id || '',
          isPlatform: 1
        }).then(res => {
          if (res.success) {
            console.log(res)
            // this.model.goodListSpecificationList = res.result
            this.goodListSpecificationList = res.result
            this.$nextTick(() => {
              resolve()
            })
          } else {
            resolve()
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.districtPrice {
  width: 100%;

  .wrap {
    width: 100%;
    margin: 0 auto;
    font-size: 14px;

    .line {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-around;

      > div {
        width: 30%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
.districtClassification {
  width: 100%;
  font-size: 14px;

  .line {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 50px;

    .label {
      margin-right: 30px;
    }
  }
}
</style>
