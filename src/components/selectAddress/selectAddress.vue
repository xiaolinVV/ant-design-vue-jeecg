<template>
  <!-- 不可用在银行卡选择地址中 -->
  <a-cascader
    :options="cityAllData"
    :loadData="cityAllDataLoad"
    changeOnSelect
    v-if="canShowDefaultCity"
    v-model="defaultCity"
    style="width: 250px"
    placeholder="请选择区域"
  />
</template>

<script>
import { httpAction, getAction, postAction, putAction } from '@/api/manage'

export default {
  name: 'selectAddress',
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      //所在城市联想
      cityAllData: [],
      defaultCity: [],
      //地址转换拼接地址
      // areaAddressList:[],
      url: {
        getList: '/sysArea/sysArea/getList',
        findByParentId: '/sysArea/sysArea/findByParentId'
      },
      canShowDefaultCity: false
    }
  },
  watch: {
    info: {
      handler(newVal) {
        this.canShowDefaultCity = false
        this.getList(() => {
          let sysAreaId = []
          if (newVal.provinceId) {
            sysAreaId.push(newVal.provinceId * 1)
          }
          if (newVal.cityId) {
            sysAreaId.push(newVal.cityId * 1)
          }
          if (newVal.countyId) {
            sysAreaId.push(newVal.countyId * 1)
          }
          if (!newVal.sysAreaId) {
            newVal.sysAreaId = sysAreaId.join(',')
          }
          this.cityEchoDisplay(newVal)
        })
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    cleanData() {
      this.defaultCity = []
    },

    getList(callback) {
      getAction(this.url.getList).then(res => {
        if (res.success) {
          let sz3 = []
          for (let item of res.result) {
            sz3.push({
              label: item.name,
              value: item.id,
              isLeaf: false
            })
          }
          //所在城市
          this.cityAllData = sz3
          this.$nextTick(() => {
            callback()
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    //所在城市点击一级，二级，三级分类动态展示数据
    cityAllDataLoad(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      getAction(this.url.findByParentId, { id: targetOption.value }).then(res => {
        targetOption.loading = false
        if (res.success && res.result.length > 0) {
          let sz = []
          for (let item of res.result) {
            sz.push({
              label: item.name,
              value: item.id,
              isLeaf: false
            })
          }
          targetOption.children = sz
        }
        this.cityAllData = [...this.cityAllData]
      })
      this.$emit('cityAllDataLoad', this.defaultCity)
    },

    //所在城市回显
    cityEchoDisplay(info) {
      let sz = info.sysAreaId.split(',')
      let cityAllData = this.cityAllData

      if (info.sysAreaId) {
        this.defaultCity = info.sysAreaId.split(',').map(item => {
          return item * 1
        })
      }

      //第一个id请求其对应的子地址
      if (!sz || sz.length <= 0 || !sz[0]) {
        this.canShowDefaultCity = true
        return
      }
      getAction(this.url.findByParentId, { id: sz[0] }).then(res => {
        if (res.success && res.result.length > 0) {
          let sz2 = [] //子地址
          for (let item of res.result) {
            sz2.push({
              label: item.name,
              value: item.id,
              isLeaf: false
            })
          }
          for (let item of cityAllData) {
            //找到对应的label添加children
            if (this.defaultCity[0] == item.value) {
              item.children = sz2
              getAction(this.url.findByParentId, { id: sz[1] }).then(res2 => {
                if (res2.success && res2.result.length > 0) {
                  let sz3 = []
                  for (let item of res2.result) {
                    sz3.push({
                      label: item.name,
                      value: item.id,
                      isLeaf: false
                    })
                  }
                  for (let item2 of sz2) {
                    if (this.defaultCity[1] == item2.value) {
                      item2.children = sz3
                      this.$nextTick(() => {
                        this.canShowDefaultCity = true
                      })
                      break
                    }
                  }
                } else {
                  this.canShowDefaultCity = true
                  console.log('没有第三季地址')
                }
              })
              break
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped></style>
