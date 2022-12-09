<template>
  <a-modal
    :confirmLoading="confirmLoading"
    :title="title"
    :visible="visible"
    :width="800"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="关闭"
  >
    <div class="buyLimit" v-if="state == 1">
      <div class="wrap">
        <div class="line">
          <div>
            规格
          </div>
          <!--          <div>-->
          <!--            购买周期-->
          <!--          </div>-->
          <div>
            购买件数
          </div>
        </div>

        <!--<div v-if="goodsInfo && goodsInfo.goodListSpecificationList && goodsInfo.goodListSpecificationList.length > 0">-->
        <!--<div class="line">-->
        <!--<div>-->
        <!--{{goodsInfo.specification || '无'}}-->
        <!--</div>-->
        <!--<div>-->
        <!--可购买-->
        <!--<a-input style="width: 100px;display: inline-block;margin: 0 5px;" type="number"-->
        <!--v-model="goodsInfo.buyProportionLetter">-->

        <!--</a-input>-->
        <!--件-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->

        <div v-if="goodsInfo && goodsInfo.goodListSpecificationList && goodsInfo.goodListSpecificationList.length > 0">
          <div class="line" v-for="item in goodsInfo.goodListSpecificationList">
            <div>
              {{ item.specification || '无' }}
            </div>
            <div>
              可购买
              <a-input
                style="width: 100px;display: inline-block;margin: 0 5px;"
                type="number"
                v-model="item.buyProportionLetter"
              >
              </a-input>
              件
            </div>
          </div>
        </div>

        <div v-else style="margin: 0 auto;text-align: center">
          暂无规格
        </div>
      </div>
    </div>
    <div class="districtClassification" v-if="state == 2">
      <div class="line">
        <div class="label">
          专区分类：
        </div>
        <div class="value" v-if="classifactionList.length <= 0">
          无分类
        </div>
        <div class="value" v-else>
          <!--          @change="handleChange"-->
          <!--          <a-select style="width: 120px" v-model="goodsInfo.marketingPrefectureTypeId">-->
          <!--            <a-select-option value="">请选择</a-select-option>-->
          <!--            <a-select-option  v-for="item in classifactionList"  :value="item.id">-->
          <!--              {{item.typeName}}-->
          <!--            </a-select-option>-->
          <!--          </a-select>-->
          <!--<a-cascader v-if="goodsInfo.marketingPrefectureTypeId && visible && classifactionList.length > 0"-->
          <!--:options="classifactionList"-->
          <!--:loadData="prefectureTypeDataLoad"-->
          <!--changeOnSelect-->
          <!--v-model="goodsInfo.marketingPrefectureTypeId"-->
          <!--style="width: 150px"-->
          <!--placeholder="请选择专区"/>-->

          <a-cascader
            v-if="goodsInfo.marketingPrefectureTypeId && visible && classifactionList.length > 0"
            :options="classifactionList"
            changeOnSelect
            v-model="goodsInfo.marketingPrefectureTypeId"
            style="width: 150px"
            placeholder="请选择专区"
          />
        </div>
      </div>
    </div>

    <div class="districtPrice" v-if="state == 3">
      <div class="wrap">
        <div class="line">
          <div>
            规格
          </div>
          <div>
            专区折扣
          </div>
          <div>
            专区价格
          </div>
        </div>
        <div v-if="goodsInfo && goodsInfo.goodListSpecificationList && goodsInfo.goodListSpecificationList.length > 0">
          <div class="line" v-for="item in goodsInfo.goodListSpecificationList">
            <div>
              {{ item.specification || '无' }}
            </div>
            <div>
              <!--              :min="allData.prefecturePriceProportion * item.price / 100"-->
              <a-input-number
                v-model="item.prefecturePriceProportion"
                style="width: 100px;display: inline-block;margin: 0 5px;"
                @change="prefecturePriceProportionChange(item)"
              />
              <!--              <a-input style="width: 100px;display: inline-block;margin: 0 5px;" type="number"-->
              <!--                       v-model="item.prefecturePrice" @change="prefecturePriceChange(item)">-->
              <!--              </a-input>-->
              %
            </div>
            <div>
              <!--              :min="allData.prefecturePriceProportion"-->
              <a-input-number
                v-model="item.prefecturePrice"
                style="width: 100px;display: inline-block;margin: 0 5px;"
                @change="prefecturePriceChange(item)"
              />
              <!--              <a-input style="width: 100px;display: inline-block;margin: 0 5px;" type="number"-->
              <!--                       v-model="item.prefecturePriceProportion" @change="prefecturePriceProportionChange(item)">-->
              <!--              </a-input>-->
            </div>
          </div>
        </div>
        <div v-else style="margin: 0 auto;text-align: center">
          暂无规格
        </div>
      </div>
    </div>

    <div class="deductionWelfare" v-if="state == 4">
      <div class="wrap">
        <div class="line">
          <div>
            规格
          </div>
          <div>
            福利金抵扣
          </div>
          <div></div>
        </div>
        <div v-if="!goodsInfo.isWelfare || goodsInfo.isWelfare == 0" style="margin: 0 auto;text-align: center">
          不支持
        </div>
        <div
          v-else-if="goodsInfo && goodsInfo.goodListSpecificationList && goodsInfo.goodListSpecificationList.length > 0"
        >
          <div class="line" v-for="item in goodsInfo.goodListSpecificationList">
            <div>
              {{ item.specification || '无' }}
            </div>
            <div>
              可抵扣
              <a-input
                style="width: 100px;display: inline-block;margin: 0 5px;"
                type="number"
                v-model="item.welfareProportion"
              >
              </a-input>
              %
            </div>
            <div></div>
          </div>
        </div>

        <div v-else style="margin: 0 auto;text-align: center">
          暂无规格
        </div>
      </div>
    </div>
    <div class="sendWelfare" v-if="state == 5">
      <div class="wrap">
        <div class="line">
          <div>
            规格
          </div>
          <div>
            赠送福利金
          </div>
          <div></div>
        </div>
        <div v-if="!goodsInfo.isGiveWelfare || goodsInfo.isGiveWelfare == 0" style="margin: 0 auto;text-align: center">
          不支持
        </div>
        <div
          v-else-if="goodsInfo && goodsInfo.goodListSpecificationList && goodsInfo.goodListSpecificationList.length > 0"
        >
          <div class="line" v-for="item in goodsInfo.goodListSpecificationList">
            <div>
              {{ item.specification || '无' }}
            </div>
            <div>
              可送
              <!--              v-model-->
              <a-input
                style="width: 100px;display: inline-block;margin: 0 5px;"
                type="number"
                v-model="item.giveWelfareProportion"
              >
              </a-input>
              %
            </div>
            <div></div>
          </div>
        </div>
        <div v-else style="margin: 0 auto;text-align: center">
          暂无规格
        </div>
      </div>
    </div>

    <!--<div v-if="state == 7">-->
    <!--<div style="margin-bottom: 10px">-->
    <!--停用后，该商品将无法找到-->
    <!--</div>-->
    <!--<div style="margin-bottom: 10px">-->
    <!--您确定要停用吗？-->
    <!--</div>-->
    <!--<a-textarea v-model="goodsInfo.closeExplain">-->

    <!--</a-textarea>-->
    <!--</div>-->

    <!--<div v-if="state == 8">-->

    <!--<div style="margin-bottom: 10px">-->
    <!--<a-icon type="info"/>-->
    <!--启用后，专区将会展示该商品-->
    <!--</div>-->
    <!--<div style="margin-bottom: 10px">-->
    <!--您确定要启用吗？-->
    <!--</div>-->
    <!--</div>-->

    <div v-if="state == 9">
      <div style="margin-bottom: 10px">
        删除后该商品将恢复到普通商品中。
      </div>
      <div style="margin-bottom: 10px">
        您确定要删除吗？
      </div>
      <a-textarea> </a-textarea>
    </div>

    <div v-if="state == 10" style="display:flex;align-items:center">
      <div style="margin-right:20px">
        排序:
      </div>
      <a-input-number v-model="goodsInfo.sort" :precision="0" :min="0" />
    </div>
  </a-modal>
</template>

<script>
import { getAction, postAction, putAction, deleteAction } from '@/api/manage'

export default {
  name: 'MarketingPrefectureGoodAllModal',
  props: {
    marketingPrefectureId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      state: '',
      title: '购买限制',
      visible: false,
      confirmLoading: false,
      allData: '',
      goodsInfo: '',
      classifactionList: [],
      cascaderVisible: false,
      url: {
        //修改
        updateMarketingPrefectureGoodAndSpecification:
          'marketingPrefectureGood/marketingPrefectureGood/updateMarketingPrefectureGoodAndSpecification',
        //获取对应专区分类
        getMarketingPrefectureTypeAll: 'marketingPrefectureType/marketingPrefectureType/getMarketingPrefectureTypeAll',
        //启用停用
        updateStatus: '/marketingPrefectureGood/marketingPrefectureGood/updateStatus',
        //删除
        deleteAction: '/marketingPrefectureGood/marketingPrefectureGood/delete',
        //获取专区二级分类
        findUnderlingListMap: 'marketingPrefectureType/marketingPrefectureType/findUnderlingListMap',
        //获取上级分类
        getParentMarketingPrefectureType:
          'marketingPrefectureType/marketingPrefectureType/getParentMarketingPrefectureType'
      }
    }
  },
  methods: {
    prefectureTypeDataLoad(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
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
        this.classifactionList = [...this.classifactionList]
      })
    },
    handleOk() {
      if (this.state == 7 || this.state == 8) {
        //停用启用接口
        let info = {
          ids: this.goodsInfo.id,
          status: this.goodsInfo.status == 1 ? 0 : 1,
          closeExplain: this.goodsInfo.closeExplain || ''
        }
        getAction(this.url.updateStatus, info).then(res => {
          if (res.success) {
            this.$message.success(res.message || '修改成功！')
          } else {
            this.$message.warn(res.message)
          }
          setTimeout(() => {
            this.$emit('ok')
          }, 500)
        })
      } else if (this.state == 9) {
        deleteAction(this.url.deleteAction, { id: this.goodsInfo.id }).then(res => {
          if (res.success) {
            this.$message.success(res.message || '修改成功！')
          } else {
            this.$message.warn(res.message)
          }
          setTimeout(() => {
            this.$emit('ok')
          }, 500)
        })
      } else {
        //修改接口
        if (this.goodsInfo.marketingPrefectureTypeId && this.goodsInfo.marketingPrefectureTypeId.length > 0) {
          this.goodsInfo.marketingPrefectureTypeId = this.goodsInfo.marketingPrefectureTypeId.join(',')
        }

        if (this.goodsInfo.marketingPrefectureTypeId.length == 0) {
          this.goodsInfo.marketingPrefectureTypeId = ''
        }

        putAction(this.url.updateMarketingPrefectureGoodAndSpecification, this.goodsInfo).then(res => {
          if (res.success) {
            this.$message.success(res.message || '修改成功！')
          } else {
            this.$message.warn(res.message)
          }
          setTimeout(() => {
            this.$emit('ok')
          }, 500)
        })
      }
      this.handleCancel()
    },
    handleCancel() {
      this.allData = ''
      this.visible = false
    },
    //专区折扣输入框改变值
    prefecturePriceProportionChange(record) {
      record.prefecturePrice = (record.prefecturePriceProportion * record.price) / 100 || 0
      console.log(record)
    },
    //专区价格输入框改变值
    prefecturePriceChange(record) {
      setTimeout(() => {
        record.prefecturePriceProportion = (record.prefecturePrice / record.price) * 100 || 0
        console.log(record)
      }, 200)
    },
    open(state = 1, item = '') {
      if (!this.marketingPrefectureId) {
        this.$message.warn('请在左侧选择对应分类！')
        return
      }

      if (state != 2) {
        if (item.marketingPrefectureTypeId !== undefined && item.marketingPrefectureTypeId !== '') {
          if (!Array.isArray(item.marketingPrefectureTypeId)) {
            item.marketingPrefectureTypeId = item.marketingPrefectureTypeId.split(',')
          }
          console.log(item.marketingPrefectureTypeId,'item.marketingPrefectureTypeId')
        } else {
          item.marketingPrefectureTypeId = []
        }
      }

      var oldString = JSON.stringify(item)
      var newItem = JSON.parse(oldString)
      this.goodsInfo = newItem
      console.log(this.goodsInfo)
      switch (state) {
        case 1:
          this.title = '购买限制'
          break
        case 2:
          getAction(this.url.getParentMarketingPrefectureType, {
            marketingPrefectureTypeId: this.goodsInfo.marketingPrefectureTypeId
          }).then(res => {
            if (res.success) {
              console.log(res.result,'res.success')
              let arr = []
              if (res.result) {
                arr.push(res.result.id)
                arr.push(this.goodsInfo.marketingPrefectureTypeId)
                this.goodsInfo.marketingPrefectureTypeId = arr
              } else {
                arr.push(this.goodsInfo.marketingPrefectureTypeId)
                this.goodsInfo.marketingPrefectureTypeId = arr
              }
            }
          })

          getAction(this.url.getMarketingPrefectureTypeAll, { marketingPrefectureId: this.marketingPrefectureId }).then(
            res => {
              if (res.success) {
                this.classifactionList = res.result
                console.log(res.result,'res.success11111')
                 console.log( this.goodsInfo.marketingPrefectureTypeId, 'iddddd')
               
              }
            }
          )

          this.title = '专区分类'
          break
        case 3:
          this.title = '专区价'
          break
        case 4:
          this.title = '福利金抵扣'
          break
        case 5:
          this.title = '赠送福利金'
          break
        case 6:
          this.title = '购买限制'
          break
        case 7:
          var that = this

          if (item.status == 1) {
            this.state = 7
            // this.title = '停用'

            this.$confirm({
              title: '停用后，该商品将无法找到',
              content: ' 您确定要停用吗？',
              onOk() {
                that.handleOk()
              },
              onCancel() {}
            })
          } else {
            this.$confirm({
              title: '启用后，专区将会展示该商品',
              content: ' 您确定要启用吗？',
              onOk() {
                that.handleOk()
              },
              onCancel() {}
            })
            this.state = 8
          }
          break
        case 10:
          this.title = '排序'
      }
      if (state != 7) {
        this.state = state
        this.visible = true
      }
      this.allData = item
    }
  }
}
</script>

<style lang="less" scoped>
.buyLimit,
.districtPrice,
.deductionWelfare,
.sendWelfare {
	width: 100%;

	.wrap {
		margin: 0 auto;
		width: 100%;
		font-size: 14px;

		.line {
			display: flex;
			justify-content: space-around;
			align-items: center;
			width: 100%;
			height: 50px;

			> div {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 30%;
			}
		}
	}
}

.districtClassification {
	width: 100%;
	font-size: 14px;

	.line {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		height: 50px;

		.label {
			margin-right: 30px;
		}
	}
}








</style>
