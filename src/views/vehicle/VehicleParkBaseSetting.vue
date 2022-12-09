<template>
  <a-card title="停车场设置" :loading="confirmLoading">
    <a-form :form="form">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="停车场名称">
        <a-input placeholder="请输入停车场名称" v-decorator="rules.parkName" style="width:200px"> </a-input>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="收费系统">
        <a-radio-group v-decorator="rules.tollCollectionSystem" @change="tollCollectionSystemChange">
          <a-radio :value="0">
            本系统
          </a-radio>
          <a-radio :value="1">
            科拓收费系统
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" v-if="tollCollectionSystem == 0">
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          收费规则
        </span>
        <div class="parking-line">
          <div>
            <div>
              免费时段：
            </div>
            <div>
              0分
            </div>
          </div>
          <div>
            <div>
              至
            </div>
            <div>
              <a-input-number
                :min="0"
                :precision="2"
                v-model="model.chargingRules.freeTime.time"
                style="width:100px;margin-right:5px"
              ></a-input-number>
            </div>
            <div>
              <a-select placeholder="请选择单位" v-model="model.chargingRules.freeTime.unit" style="width:100px">
                <a-select-option value="">请选择单位</a-select-option>
                <a-select-option :value="0">分</a-select-option>
                <a-select-option :value="1">小时</a-select-option>
              </a-select>
            </div>
          </div>
          <div>
            <a-checkbox v-model="model.chargingRules.freeTime.include">
              包含{{ model.chargingRules.freeTime.time }}{{ model.chargingRules.freeTime.unit == 0 ? '分钟' : '小时' }}
            </a-checkbox>
            <a-input-number
              v-model="model.chargingRules.freeTime.price"
              :min="0"
              :precision="2"
              style="width:100px;margin-right:5px"
            ></a-input-number>
            <div>
              元
            </div>
          </div>
        </div>

        <div class="parking-line">
          <div>
            <div>
              常规收费：
            </div>
            <div>
              {{ model.chargingRules.freeTime.time }}{{ model.chargingRules.freeTime.unit == 0 ? '分钟' : '小时' }}（{{
                model.chargingRules.freeTime.include ? '不包含' : '包含'
              }}）
            </div>
          </div>
          <div>
            <div>
              至
            </div>
            <div>
              <a-input-number
                :min="0"
                :precision="2"
                v-model="model.chargingRules.convention.time"
                style="width:100px;margin-right:5px"
              ></a-input-number>
            </div>
            <div>
              <a-select placeholder="请选择单位" v-model="model.chargingRules.convention.unit" style="width:100px">
                <a-select-option value="">请选择单位</a-select-option>
                <a-select-option :value="0">分</a-select-option>
                <a-select-option :value="1">小时</a-select-option>
              </a-select>
            </div>
          </div>
          <div>
            <a-checkbox v-model="model.chargingRules.convention.include">
              包含{{ model.chargingRules.convention.time
              }}{{ model.chargingRules.convention.unit == 0 ? '分钟' : '小时' }}
            </a-checkbox>
            <a-input-number
              v-model="model.chargingRules.convention.price"
              :min="0"
              :precision="2"
              style="width:100px;margin-right:5px"
            ></a-input-number>
            <div>
              元
            </div>
          </div>
        </div>

        <div class="parking-line">
          <div>
            <div>
              额外收费：
            </div>
            <div>
              {{ model.chargingRules.convention.time
              }}{{ model.chargingRules.convention.unit == 0 ? '分钟' : '小时' }}后({{
                model.chargingRules.convention.include ? '不包含' : '包含'
              }})，每
            </div>
          </div>
          <div>
            <div>
              <a-input-number
                v-model="model.chargingRules.extra.time"
                :min="0"
                :precision="2"
                style="width:100px;margin-right:5px"
              ></a-input-number>
            </div>
            <div>
              <a-select v-model="model.chargingRules.extra.unit" placeholder="请选择单位" style="width:100px">
                <a-select-option value="">请选择单位</a-select-option>
                <a-select-option :value="0">分</a-select-option>
                <a-select-option :value="1">小时</a-select-option>
              </a-select>
            </div>
          </div>
          <div>
            <div>
              加收
            </div>
            <a-input-number
              v-model="model.chargingRules.extra.price"
              :min="0"
              :precision="2"
              style="width:100px;margin-right:5px"
            ></a-input-number>
            <div>
              元
            </div>
          </div>
        </div>

        <div class="parking-line">
          <div>
            <div>
              最高收费：
            </div>
            <div>
              连续停放
            </div>
          </div>
          <div>
            <div>
              <a-input-number
                v-model="model.chargingRules.height.time"
                :min="0"
                :precision="2"
                style="width:100px;margin-right:5px"
              ></a-input-number>
            </div>
            <div style="width:100px;text-align:right">
              小时
            </div>
          </div>
          <div>
            <div>
              最高收费
            </div>
            <a-input-number
              :min="0"
              :precision="2"
              v-model="model.chargingRules.height.price"
              style="width:100px;margin-right:5px"
            ></a-input-number>
            <div>
              元
            </div>
          </div>
        </div>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" v-else label="收费规则">
        根据科拓收费系统进行停车费计算。
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          说明
        </span>
        <JEditor v-model="model.content"> </JEditor>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
        <!-- v-decorator="rules.defaultCity" -->
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          停车场位置
        </span>
        <a-cascader
          :options="cityAllData"
          @change="cityAllDataChange"
          :loadData="cityAllDataLoad"
          changeOnSelect
          v-model="defaultCity"
          v-if="canShowDefaultCity"
          placeholder="请选择区域"
          style="width:205px"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="详细地址">
        <a-input style="width:450px" placeholder="请输入详细地址" v-decorator="rules.detailedAddress" />
      </a-form-item>
    </a-form>
    <a-button @click="submit" type="primary" style="margin:0 auto;display:block">
      保存
    </a-button>
  </a-card>
</template>
<script>
import JEditor from '@/components/jeecg/JEditor'
import { httpAction, getAction, postAction } from '@/api/manage'
export default {
  name: 'VehicleParkBaseSetting',
  components: {
    JEditor
  },
  data() {
    return {
      form: this.$form.createForm(this),
      labelCol: Object.freeze({ span: 3 }),
      wrapperCol: Object.freeze({ span: 20 }),
      model: {
        content: '',
        tollCollectionSystem: 0,
        chargingRules: {
          freeTime: {
            time: '',
            unit: '',
            include: false,
            price: ''
          },
          convention: {
            time: '',
            unit: '',
            include: false,
            price: ''
          },
          extra: {
            time: '',
            unit: '',
            include: true,
            price: ''
          },
          height: {
            time: '',
            price: ''
          }
        }
      },
      rules: Object.freeze({
        parkName: [
          'parkName',
          {
            rules: [{ required: true, message: '请输入停车场名称' }]
          }
        ],
        tollCollectionSystem: ['tollCollectionSystem', { rules: [{ required: true, message: '请选择收费系统' }] }],
        defaultCity: [
          'defaultCity',
          {
            initialValue: this.defaultCity,
            rules: [
              {
                required: true,
                message: '请选择所在城市!'
              }
            ]
          }
        ],
        detailedAddress: ['detailedAddress', { rules: [{ required: true, message: '请输入详细地址!' }] }]
      }),
      url: {
        addOrEdit: '/vehicle/vehicleParkBaseSetting/addOrEdit', //新增编辑
        queryByOne: '/vehicle/vehicleParkBaseSetting/queryByOne', //返现
        //获取经纬度
        getLngAndLat: '/storeManage/storeManage/getLngAndLat',
        getList: '/sysArea/sysArea/getList',
        findByParentId: '/sysArea/sysArea/findByParentId'
      },
      //所在城市联想
      cityAllData: [],
      //可以显示回显默认地址
      canShowDefaultCity: false,
      //编辑回显的默认地址
      defaultCity: '',
      //地址转换拼接地址
      areaAddressList: [],
      confirmLoading: false,
      tollCollectionSystem: 0
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.form.resetFields()
      this.confirmLoading = true
      this.canShowDefaultCity = false
      this.getList(() => {
        getAction(this.url.queryByOne).then(async res => {
          this.confirmLoading = false
          if (res.success) {
            if (res.result) {
              let chargingRules = JSON.parse(res.result.chargingRules)
              chargingRules.freeTime.include = chargingRules.freeTime.include == 1 ? true : false
              chargingRules.convention.include = chargingRules.convention.include == 1 ? true : false
              chargingRules.extra.include = chargingRules.extra.include == 1 ? true : false
              this.model = Object.assign({}, this.model, {
                ...res.result,
                tollCollectionSystem: res.result.tollCollectionSystem * 1,
                chargingRules
              })
              this.tollCollectionSystemChange({ target: { value: this.model.tollCollectionSystem } })
            }
            await this.$nextTick()
            if (res.result && res.result.sysAreaIds && res.result.sysAreaExplain) {
              this.areaAddressList = res.result.sysAreaExplain.split(',')
              this.cityEchoDisplay(res.result)
            } else {
              this.areaAddressList = []
              this.canShowDefaultCity = true
            }

            console.log(this.model)
            this.form.setFieldsValue(this.model)
          } else {
            this.$message.warn(res.message || '请稍后再试')
          }
        })
      })
    },
    tollCollectionSystemChange(e) {
      let value = e.target.value
      this.tollCollectionSystem = value
    },
    submit() {
      if (!this.model.content) {
        this.$message.warn('请输入说明')
        return
      }
      if (!Array.isArray(this.defaultCity) || this.defaultCity.length <= 0) {
        this.$message.warn('请选择停车场位置！')
        return false
      }
      const that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          let chargingRules = JSON.parse(JSON.stringify(that.model.chargingRules))
          if (values.tollCollectionSystem == 0) {
            if (chargingRules.freeTime.time === '') {
              this.$message.warn('请输入免费时段时间值')
              return
            }
            if (chargingRules.freeTime.unit === '') {
              this.$message.warn('请选择免费时段时间单位')
              return
            }
            if (chargingRules.freeTime.price === '' && chargingRules.freeTime.include) {
              this.$message.warn('请输入免费时段价格')
              return
            }

            if (chargingRules.convention.time === '') {
              this.$message.warn('请输入常规收费时间值')
              return
            }
            if (chargingRules.convention.unit === '') {
              this.$message.warn('请选择常规收费时间单位')
              return
            }
            if (chargingRules.convention.price === '' && chargingRules.convention.include) {
              this.$message.warn('请输入常规收费价格')
              return
            }

            if (chargingRules.extra.time === '') {
              this.$message.warn('请输入额外收费时间值')
              return
            }
            if (chargingRules.extra.unit === '') {
              this.$message.warn('请选择额外收费时间单位')
              return
            }
            if (chargingRules.extra.price === '' && chargingRules.extra.include) {
              this.$message.warn('请输入额外收费价格')
              return
            }

            if (chargingRules.height.time === '') {
              this.$message.warn('请输入最高收费时间值')
              return
            }

            if (chargingRules.height.price === '') {
              this.$message.warn('请输入最高收费价格')
              return
            }
          }
          this.confirmLoading = true
          chargingRules.freeTime.include = chargingRules.freeTime.include ? 1 : 0
          chargingRules.convention.include = chargingRules.convention.include ? 1 : 0
          chargingRules.extra.include = chargingRules.extra.include ? 1 : 0
          let formData = Object.assign({}, this.model, {
            ...values,
            chargingRules: JSON.stringify(chargingRules),
            sysAreaExplain: this.areaAddressList.join(',')
          })
          console.log(formData)
          postAction(this.url.addOrEdit, formData).then(res => {
            this.confirmLoading = false
            if (res.success) {
              this.$message.success(res.message)
              this.loadData()
            } else {
              this.$message.warn(res.message)
            }
          })
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
    //所在城市回显
    cityEchoDisplay(info) {
      let sz = info.sysAreaIds.split(',')
      let cityAllData = this.cityAllData
      this.defaultCity = info.sysAreaIds.split(',').map(item => {
        return item * 1
      })
      // this.$nextTick(()=>{
      //   this.form.setFieldsValue(Object.assign({},info,this.defaultCity));
      // })
      // console.log();
      // debugger;
      if (this.areaAddressList.length <= 1) {
        this.$message.warn('很抱歉,您的所属城市数据有误，请重新设置！')
        this.canShowDefaultCity = true
      } else {
        //第一个id请求其对应的子地址
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
              if (this.areaAddressList[0] == item.label) {
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
                      if (this.areaAddressList[1] == item2.label) {
                        item2.children = sz3
                        console.log(this.areaAddressList, 'this.areaAddressList')
                        console.log(this.defaultCity, 'this.defaultCity')
                        console.log(this.cityAllData, 'this.cityAllData')
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
          } else {
            this.canShowDefaultCity = true
            console.log('空值')
          }
        })
      }
    },
    //所在城市地址选择完成事件
    cityAllDataChange(value, selectedOptions) {
      let sz = []
      for (let item of selectedOptions) {
        sz.push(item.label)
      }
      this.model.sysAreaIds = value.join(',')
      this.areaAddressList = sz
    }
  }
}
</script>
<style lang="scss" scoped>
.parking-line {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
  > div {
    min-width: 30%;
    display: flex;
    align-items: center;
    > div {
      display: flex;
      align-items: center;
      margin-right: 5px;
    }
  }
  > div:nth-child(2),
  > div:nth-child(3) {
    justify-content: flex-end;
  }
}
</style>
