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
          <a-select v-if="!confirmLoading" v-model="model.marketingGroupGoodTypeId" style="width:120px">
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
        <div v-if="model && model.goodListSpecificationList && model.goodListSpecificationList.length > 0">
          <div class="line" v-for="item in model.goodListSpecificationList">
            <div>
              {{ item.specification || '无' }}
            </div>
            <div>
              <a-input-number
                v-model="item.groupPriceProportion"
                style="width: 100px;display: inline-block;margin: 0 5px;"
                @change="prefecturePriceProportionChange(item)"
              />

              %
            </div>
            <div>
              <a-input-number
                v-model="item.groupPrice"
                style="width: 100px;display: inline-block;margin: 0 5px;"
                @change="prefecturePriceChange(item)"
              />
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
import pick from 'lodash.pick'
import moment from 'moment'
import { httpAction, getAction, postAction, putAction } from '@/api/manage'
export default {
  name: 'MarketingFreeGoodListModal',
  data() {
    return {
      visible: false,
      model: {},
      type: '',
      confirmLoading: false,
      url: {
        edit: '/marketing/marketingGroupGoodList/edit',
        //获取免单活动商品类型（1）
        getAllMarketingGroupGoodType: '/marketing/marketingGroupGoodType/getAllMarketingGroupGoodType',
        // 根据免单商品id查询规格数据(1)
        selectMarketingGroupGoodSpecificationByMarketingGroupGoodListId:
          '/marketing/marketingGroupGoodSpecification/selectMarketingGroupGoodSpecificationByMarketingGroupGoodListId'
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
      this.model = Object.assign({}, record)
      this.confirmLoading = true
      if (this.type == 1) {
        await this.getMarketingPrefectureType()
      } else if (this.type == 2) {
        await this.selectMarketingFreeGoodSpecificationByMarketingFreeGoodList()
      }
      this.confirmLoading = false
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      putAction(this.url.edit, this.model).then(res => {
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
      record.groupPrice = (record.groupPriceProportion * record.price) / 100 || 0
      console.log(record)
    },
    //价格输入框改变值
    prefecturePriceChange(record) {
      setTimeout(() => {
        record.groupPriceProportion = (record.groupPrice / record.price) * 100 || 0
        console.log(record)
      }, 200)
    },
    getMarketingPrefectureType() {
      return new Promise(resolve => {
        getAction(this.url.getAllMarketingGroupGoodType).then(res => {
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
        getAction(this.url.selectMarketingGroupGoodSpecificationByMarketingGroupGoodListId, {
          marketingGroupGoodListId: this.model.id || '',
          isPlatform: 1
        }).then(res => {
          if (res.success) {
            this.model.goodListSpecificationList = res.result
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
