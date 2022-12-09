<template>
  <a-card :border="false" title="每日浏览">
    <a-form :form="form">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="浏览时长">
        <a-input-number
          style="width:150px"
          :min="1"
          :precision="0"
          placeholder="请输入浏览时长"
          v-decorator="rules.viewingHours"
        >
        </a-input-number>
        S
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="浏览类型">
        <a-select v-decorator="rules.browseType" placeholder="请选择浏览类型" @change="browseTypeChange">
          <a-select-option value="">请选择</a-select-option>
          <a-select-option :value="0">商品分类</a-select-option>
          <a-select-option :value="1">专区</a-select-option>
          <a-select-option :value="2">免单</a-select-option>
          <a-select-option :value="3">拼团</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="浏览页面" v-if="browseType === 0">
        <a-select
          v-model="queryParam.goodTypeIdOne"
          placeholder="请选择"
          @change="chooseMedicine"
          style="width:100px;margin-right: 10px;"
        >
          <a-select-option value="">请选择</a-select-option>
          <a-select-option v-for="item in listGoodType" :value="item.id" :key="item.id">{{
            item.name
          }}</a-select-option>
        </a-select>
        <a-select
          v-model="queryParam.goodTypeIdTwo"
          placeholder="请选择"
          @change="chooseMedicine1"
          style="width:100px;margin-right: 10px;"
          ><!--v-model="id"-->
          <a-select-option value="">请选择</a-select-option>
          <a-select-option v-for="item in listGoodType1" :value="item.id" :key="item.id">{{
            item.name
          }}</a-select-option>
          <!--:defaultValue="listGoodType1.length>0?listGoodType1[0].name : ''"-->
        </a-select>
        <a-select
          v-decorator="rules.goodTypeId"
          placeholder="请选择"
          style="width:100px;margin-right: 10px;"
          @change="chooseMedicine2"
        >
          <a-select-option value="">请选择</a-select-option>
          <a-select-option v-for="item in listGoodType2" :value="item.id" :key="item.id">{{
            item.name
          }}</a-select-option>
          <!--:defaultValue="listGoodType2.length>0?listGoodType2[0].name : ''"-->
        </a-select>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="浏览页面" v-if="browseType === 1">
        <a-select
          v-decorator="rules.marketingPrefectureId"
          placeholder="请选择"
          style="width:100px;margin-right: 10px;"
        >
          <a-select-option value="">请选择</a-select-option>
          <a-select-option v-for="item in prefectureListData" :value="item.id">{{
            item.prefectureName
          }}</a-select-option>
          <!--:defaultValue="listGoodType2.length>0?listGoodType2[0].name : ''"-->
        </a-select>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="浏览页面" v-if="browseType === 2">
        <a-input :disabled="true" value="免单专区"></a-input>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="浏览页面" v-if="browseType === 3">
        <a-input :disabled="true" value="拼团专区"></a-input>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="任务周期">
        <!-- style="width: 100%" -->
        <a-range-picker
          v-decorator="rules.time"
          :format="dateFormat"
          :placeholder="['开始时间', '结束时间']"
          @change="onDateChange"
        />
      </a-form-item>
      <a-button @click="sure" type="primary" style="display:block;margin:0 auto">
        确认
      </a-button>
    </a-form>
  </a-card>
</template>
<script>
import { getAction, postAction } from '@/api/manage'
import moment from 'moment'
export default {
  name: 'MarketingIntegralBrowseEverydaySetting',
  data() {
    return {
      form: this.$form.createForm(this),
      labelCol: Object.freeze({ span: 2 }),
      wrapperCol: Object.freeze({ span: 12 }),
      queryParam: {},
      listGoodType: [],
      listGoodType1: [],
      listGoodType2: [],
      prefectureListData: [],
      browseType: '',
      AllData: {
        viewingHours: '',
        browseType: '',
        time: '',
        goodTypeId: '',
        marketingPrefectureId: ''
      },
      rules: Object.freeze({
        viewingHours: ['viewingHours', { rules: [{ required: true, message: '请输入浏览时长' }] }],
        browseType: ['browseType', { rules: [{ required: true, message: '请选择浏览类型' }] }],
        time: ['time', { rules: [{ required: true, message: '请选择任务周期' }] }],
        goodTypeId: ['goodTypeId', { rules: [{ required: true, message: '请选择浏览页面' }] }],
        marketingPrefectureId: ['marketingPrefectureId', { rules: [{ required: true, message: '请选择浏览页面' }] }]
        // rulesBriefly: ['rulesBriefly', { rules: [{ required: true, message: '请输入规则简述' }] }]
      }),
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      url: {
        getgoodTypeListcascade: 'goodType/goodType/getgoodTypeListcascade',
        getMarketingPrefecture: '/marketingPrefecture/marketingPrefecture/getMarketingPrefecture',
        //每日浏览设置
        textaddOrEdit: 'marketing/marketingIntegralBrowse/addOrEdit',
        //每日浏览返显
        queryByOne: 'marketing/marketingIntegralBrowse/queryByOne'
      }
    }
  },
  async created() {
    await this.goodTypeListcascade('0')
    await this.leftListMethods()
    this.loadData()
  },
  methods: {
    moment,
    loadData() {
      let dateFormat = this.dateFormat
      getAction(this.url.queryByOne).then(res => {
        if (res.success) {
          console.log(res)
          this.AllData = {
            ...this.AllData,
            ...res.result,
            browseType: res.result.browseType * 1,
            time: [moment(res.result.startTime, dateFormat), moment(res.result.endTime, dateFormat)]
          }
          this.$nextTick(() => {
            this.browseTypeChange(this.AllData.browseType)
            setTimeout(() => {
              this.form.setFieldsValue(this.AllData)
            }, 300)
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    browseTypeChange(value) {
      console.log(value)
      this.browseType = value
      this.form.resetFields(['goodTypeId', 'marketingPrefectureId'])
    },
    // 分类左边方法封装
    leftListMethods(prefectureName = '') {
      return new Promise(resolve => {
        getAction(this.url.getMarketingPrefecture, {
          prefectureName,
          isViewType: '',
          isViewPrefectureRecommended: ''
        }).then(res => {
          if (res.success) {
            this.prefectureListData = res.result
          }
          this.$nextTick(() => {
            resolve()
          })
        })
      })
    },
    onDateChange: function(value, dateString) {
      this.queryParam.startTime = dateString[0]
      this.queryParam.endTime = dateString[1]
    },
    //查询
    chooseMedicine: function(value) {
      console.log('parentId1111111111' + value)
      let that = this
      //console.log("parentId1111111111"+value)
      that.listGoodType1 = []
      that.listGoodType2 = []
      that.$set(that.queryParam, 'goodTypeIdOne', value)
      that.queryParam.goodTypeIdTwo = ''
      // that.queryParam.goodTypeIdThree = ''
      that.form.resetFields('goodTypeId')
      getAction(that.url.getgoodTypeListcascade, { parentId: value }).then(res => {
        if (res.success) {
          that.listGoodType1 = res.result.listGoodType

          console.log(that.listGoodType1)
        } else {
          that.$message.warning(res.message)
        }
      })
      //  that.queryParam.goodTypeIdThree = "";
    },
    chooseMedicine1: function(value) {
      console.log('parentId2222' + value)
      let that = this
      that.$set(that.queryParam, 'goodTypeIdTwo', value)

      that.listGoodType2 = []
      that.form.resetFields('goodTypeId')
      //  that.queryParam.goodTypeIdThree = "";
      getAction(that.url.getgoodTypeListcascade, { parentId: value }).then(res => {
        if (res.success) {
          that.listGoodType2 = res.result.listGoodType
          console.log(that.listGoodType2)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    chooseMedicine2: function(value) {
      // this.$set(this.queryParam, 'goodTypeIdThree', value)
    },
    goodTypeListcascade(parentId) {
      return new Promise(resolve => {
        let that = this
        that.listGoodType1 = []
        that.listGoodType2 = []
        getAction(that.url.getgoodTypeListcascade, { parentId: parentId }).then(res => {
          if (res.success) {
            that.listGoodType = res.result.listGoodType
          } else {
            that.$message.warning(res.message)
          }
          this.$nextTick(() => {
            resolve()
          })
        })
      })
    },
    sure() {
      this.form.validateFields((err, values) => {
        if (!err) {
          delete values.time
          values.startTime = this.queryParam.startTime
          values.endTime = this.queryParam.endTime
          this.AllData = Object.assign({}, this.AllData, values)
          this.$nextTick(() => {
            postAction(this.url.textaddOrEdit, this.AllData)
              .then(res => {
                if (res.success) {
                  this.$message.success('成功！')
                } else {
                  this.$message.warn('失败')
                }
              })
              .catch(err => {
                this.$message.warn('失败')
              })
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
