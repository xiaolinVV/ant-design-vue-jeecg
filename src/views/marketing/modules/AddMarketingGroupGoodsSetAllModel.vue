<template>
  <a-modal
    title="批量设置"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <div class="wrap">
      <div class="line">
        <div class="label">
          活动分类：
        </div>
        <div class="value">
          <a-select v-model="allData.marketingGroupGoodTypeId" style="width:120px">
            <a-select-option value="">
              请选择
            </a-select-option>
            <a-select-option :value="item.value" v-for="(item, index) in prefectureType" :key="index">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="line">
        <div class="label">
          活动折扣：
        </div>
        <div class="value">
          <a-input type="number" v-model="allData.groupPriceProportion"> </a-input>
          <div>
            %
          </div>
        </div>
      </div>
      <div class="line">
        <div class="label">
          参团人数：
        </div>
        <div class="value">
          <a-input-number class="val-numIpt" v-model="allData.numberTuxedo" :min="0" :precision="0"></a-input-number>
        </div>
      </div>
      <div class="line">
        <div class="label">
          参团积分:
        </div>
        <div class="value">
          <a-input-number
            class="val-numIpt"
            v-model="allData.tuxedoWelfarePayments"
            :min="0"
            :precision="2"
          ></a-input-number>
        </div>
      </div>
      <div class="line">
        <div class="label">
          返还比例(%):
        </div>
        <div class="value">
          <a-input-number
            class="val-numIpt"
            v-model="allData.returnProportion"
            :min="0"
            :precision="2"
          ></a-input-number>
        </div>
      </div>
      <div class="line">
        <div class="label">
          活动时间(天):
        </div>
        <div class="value">
          <a-input-number class="val-numIpt" v-model="allData.activityTime" :min="0" :precision="0"></a-input-number>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { getAction, postAction } from '@/api/manage'
export default {
  name: 'AddMarketingCommoditySetAllModel',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      url: {
        //获取专区二级分类
        findUnderlingListMap: 'marketingPrefectureType/marketingPrefectureType/findUnderlingListMap',
        getAllMarketingGroupGoodType: 'marketing/marketingGroupGoodType/getAllMarketingGroupGoodType'
      },
      prefectureType: [],
      allData: {
        id: '',
        marketingGroupGoodTypeId: '', //活动分类
        groupPriceProportion: '0',
        numberTuxedo: '',
        tuxedoWelfarePayments: '',
        returnProportion: '',
        activityTime: '',
        activityUnit: 0
      }
    }
  },
  created() {
    this.getMarketingPrefectureType()
  },
  methods: {
    getMarketingPrefectureType() {
      this.cardLoading = true
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
    prefectureTypeDataLoad(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      console.log(targetOption)
      getAction(this.url.findUnderlingListMap, { id: targetOption.value }).then(res => {
        targetOption.loading = false
        if (res.success && res.result.length > 0) {
          let sz = []
          for (let item of res.result) {
            sz.push({
              label: item.type_name,
              value: item.id
              // isLeaf: false
            })
          }
          targetOption.children = sz
        }
        this.prefectureType = [...this.prefectureType]
      })
    },
    handleOk() {
      let allData = {
        ...this.allData,
        prefectureType: this.prefectureType
      }
      this.$emit('handleOK', allData)
      this.handleCancel()
    },
    handleCancel() {
      this.visible = false
    },
    open() {
      this.visible = true
    }
  }
}
</script>

<style lang="less">
.wrap {
  width: 100%;
  .line {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    height: 50px;
    justify-content: flex-start;
    .label {
      margin-right: 30px;
      margin-left: 30px;
    }
    .value {
      display: flex;
      align-items: center;

      > div {
        // width: 200px;
        text-align: center;
      }
      .val-numIpt {
        width: 100px;
      }
      > input {
        width: 100px;
      }
    }
  }
}
</style>
