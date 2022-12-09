<template>
  <div class="MarketingGroupIntegralBaseSetting">
    <div class="title">
      抢购专区
    </div>
    <a-form :form="form" class="wrap">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="模块别名">
        <a-input placeholder="请输入模块别名" style="width:300px;" v-decorator="rules.anotherName"> </a-input>
      </a-form-item>
      
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="活动标签">
        <a-input placeholder="请输入活动标签" style="width:300px;margin-right:10px;" v-decorator="rules.label"> </a-input>
        <span>字数不能超过4个字</span>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="客户端显示">
        <a-radio-group v-decorator="rules.pointsDisplay">
          <a-radio :value="0">
            全部
          </a-radio>
          <a-radio :value="1">
            仅APP
          </a-radio>
          <a-radio :value="2">
            仅小程序
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="是否开启">
        <a-radio-group v-decorator="rules.status">
          <a-radio :value="0">
            关闭
          </a-radio>
          <a-radio :value="1">
            启用
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          开放时段
        </span>
        <a-time-picker v-model="AllData.dayStartTime" @change="startTimeChange" />
        ~
        <a-time-picker
          v-model="AllData.dayEndTime"
          :disabledHours="endTimeDisabledHours"
          :disabledMinutes="endTimeDisabledMinutes"
          :disabledSeconds="endTimeDisabledSeconds"
        />
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        help="尺寸355*360 ，支持jpg、jpeg、png格式，大小不超过2M"
      >
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          首页广告图
        </span>
        <a-upload
          :action="uploadAction"
          :beforeUpload="diagramFileUpload"
          :fileList="diagramFileList"
          :headers="headers"
          @change="diagramHandleChange"
          @preview="diagramHandlePreview"
          listType="picture-card"
        >
          <div v-if="diagramFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="diagramPreviewVisible" @cancel="diagramHandleCancel">
          <img :src="diagramPreviewImage" alt="example" style="width: 100%" />
        </a-modal>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        help="尺寸710*360 ，支持jpg、jpeg、png格式，大小不超过2M"
      >
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          首页广告图(大)
        </span>
        <a-upload
          :action="uploadAction"
          :beforeUpload="diagramFileUpload"
          :fileList="diagramFileList1"
          :headers="headers"
          @change="diagramHandleChange1"
          @preview="diagramHandlePreview1"
          listType="picture-card"
        >
          <div v-if="diagramFileList1.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="diagramPreviewVisible1" @cancel="diagramHandleCancel1">
          <img :src="diagramPreviewImage1" alt="example" style="width: 100%" />
        </a-modal>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="模块参与资格">
        <span>购买</span>
        <a-select
          v-model="marketingPrefectureId"
          placeholder="请选择"
          @change="chooseMedicine"
          style="width:20%;margin: 0 10px;"
        >
          <a-select-option :value="0">请选择</a-select-option>
          <a-select-option v-for="(item,index) in prefectureList" :value="item.id" :key="index" >{{ item.prefectureName }}</a-select-option>
        </a-select>
        <a-cascader
          :options="prefectureTypeAll"
          changeOnSelect  
          v-model="marketingPrefectureTypeId"
          style="width: 150px;margin-right:10px;"
          placeholder="请选择"
        />
        <span>商品一件</span>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="抢购控制">
        <span>每天各个分类第</span>
        <a-input placeholder="请输入数值,以','英文半角逗号做分割" style="width:300px;margin: 0 10px;" v-decorator="rules.rushController"> </a-input>
        <span>单,必成功</span>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="有效参与奖励">
        <a-radio-group v-decorator="rules.groupRewards">
          <a-radio :value="0">
            不限
          </a-radio>
          <a-radio :value="1">
            仅失败
          </a-radio>
          <a-radio :value="2">
            仅成功
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="有效推荐奖励">
        <a-radio-group v-decorator="rules.recommendGroupRewards">
          <a-radio :value="0">
            不限
          </a-radio>
          <a-radio :value="1">
            仅失败
          </a-radio>
          <a-radio :value="2">
            仅成功
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="有效团队奖励">
        <a-radio-group v-decorator="rules.teamRewards">
          <a-radio :value="0">
            不限
          </a-radio>
          <a-radio :value="1">
            仅失败
          </a-radio>
          <a-radio :value="2">
            仅成功
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="团队奖励时间">
        <span>第</span>
        <a-input placeholder="" style="width:300px;margin: 0 10px;" v-decorator="rules.rewardTime"> </a-input>
        <span>天,结算一次的奖励</span>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          规则
        </span>
        <JEditor v-model="AllData.ruleDescription"> </JEditor>
      </a-form-item>
    </a-form>
    <div class="button-end"></div>
    <div class="button-operation">
      <a-button @click="sure" type="primary">
        确认
      </a-button>
    </div>
  </div>
</template>

<script>
import JEditor from '@/components/jeecg/JEditor'
import Vue from 'vue'
import { getAction, postAction } from '@/api/manage'
import moment from 'moment'
export default {
  name: 'MarketingGroupIntegralBaseSetting',
  data() {
    return {
      prefectureList: [],//专区
      marketingPrefectureId: '',//专区id
      prefectureTypeAll: [],//专区分类
      marketingPrefectureTypeId:'',//专区分类id
      marketingPrefectureTypeIds: [],//专区分类id
      headers: '',
      form: this.$form.createForm(this),
      labelCol: Object.freeze({ span: 2 }),
      wrapperCol: Object.freeze({ span: 12 }),
      dateFormat: 'HH:mm:ss',
      rules: Object.freeze({
        anotherName: [
          'anotherName',
          {
            rules: [
              { required: true, message: '请输入活动别名' },
              {
                max: 4,
                message: '字数不能超过4个字'
              }
            ]
          }
        ],
        label: [
          'label',
          {
            rules: [
              { required: true, message: '请输入活动标签' },
              {
                max: 4,
                message: '字数不能超过4个字'
              }
            ]
          }
        ],
        pointsDisplay: ['pointsDisplay', { rules: [{ required: true, message: '请选择客户端显示' }] }],
        status: ['status', { rules: [{ required: true, message: '请选择是否开启' }] }],
        rushController: ['rushController', { rules: [{ required: true, message: '请输入数值' }] }],
        groupRewards: ['groupRewards', { rules: [{ required: true, message: '请选择有效参与奖励' }] }],
        recommendGroupRewards: ['recommendGroupRewards', { rules: [{ required: true, message: '请选择有效推荐奖励' }] }],
        teamRewards: ['teamRewards', { rules: [{ required: true, message: '请选择有效团队奖励' }] }],
        rewardTime: ['rewardTime', { rules: [{ required: true, message: '请选择有效团队奖励时间' }] }],
        
      }),
      radioStyle: Object.freeze({
        height: '30px',
        lineHeight: '15px'
      }),
      AllData: {
        ruleDescription: '',
        status: 0,
        dayStartTime: null,
        dayEndTime: null
      },
      //图片配置
      diagramFileList: [],
      diagramFileList1: [],
      diagramPreviewVisible: false,
      diagramPreviewVisible1: false,
      diagramPreviewImage: '',
      diagramPreviewImage1: '',
      diagramFilePic: true,
      diagramFilePic1: true,
      url: Object.freeze({
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',

        addOrEdit: '/marketingRushBaseSetting/marketingRushBaseSetting/saveAndUpdate', //设置
        queryByOne: '/marketingRushBaseSetting/marketingRushBaseSetting/findByOne' ,//返显
        getPrefectureList: 'marketingPrefecture/marketingPrefecture/getPrefectureList', //获取专区
        getMarketingPrefectureTypeAll:'marketingPrefectureType/marketingPrefectureType/getMarketingPrefectureTypeAll'//获取专区分类
        
      }),
      //配置
      configure: {
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
      }
    }
  },
  components: {
    JEditor
  },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
    this.getList()
    this.getPrefectureList()
  },
  methods: {
    // 下拉选择
     chooseMedicine: function(value) {
      console.log(value)//0123456索引
      let that = this
      that.marketingPrefectureId = value
      
      getAction(that.url.getMarketingPrefectureTypeAll, { marketingPrefectureId: that.marketingPrefectureId }).then(res => {
        if (res.success) {
          that.prefectureTypeAll = res.result
          console.log( that.prefectureTypeAll,' that.prefectureTypeAll')
        } else {
          that.$message.warning(res.message)
        }
      })
      
    },
    startTimeChange() {
      this.AllData.dayEndTime = null
    },
    endTimeDisabledHours() {
      let startTimeHours = this.AllData.dayStartTime ? this.AllData.dayStartTime.hours() : 0
      let result = []
      for (let i = 0; i < parseInt(startTimeHours); i++) {
        result.push(i)
      }
      return result
    },
    endTimeDisabledMinutes() {
      let startTimeHours = this.AllData.dayStartTime ? this.AllData.dayStartTime.hours() : 0
      let endTimeHours = this.AllData.dayEndTime ? this.AllData.dayEndTime.hours() : 0
      let startTimeMinutes = this.AllData.dayStartTime ? this.AllData.dayStartTime.minutes() : 0
      let endTimeMinutes = this.AllData.dayEndTime ? this.AllData.dayEndTime.minutes() : 0
      let startTimeSeconds = this.AllData.dayStartTime ? this.AllData.dayStartTime.seconds() : 0
      let endTimeSeconds = this.AllData.dayEndTime ? this.AllData.dayEndTime.seconds() : 0
      if (startTimeHours == endTimeHours) {
        let result = []
        for (let i = 0; i < parseInt(startTimeMinutes); i++) {
          result.push(i)
        }
        if (startTimeMinutes > endTimeMinutes) {
          // setTimeout(() => {
          this.AllData.dayEndTime = null
          // }, 100)
        } else if (startTimeMinutes == endTimeMinutes && startTimeSeconds > endTimeSeconds) {
          this.AllData.dayEndTime = null
        }
        return result
      }
      return []
    },
    endTimeDisabledSeconds() {
      let startTimeHours = this.AllData.dayStartTime ? this.AllData.dayStartTime.hours() : 0
      let endTimeHours = this.AllData.dayEndTime ? this.AllData.dayEndTime.hours() : 0
      let startTimeMinutes = this.AllData.dayStartTime ? this.AllData.dayStartTime.minutes() : 0
      let endTimeMinutes = this.AllData.dayEndTime ? this.AllData.dayEndTime.minutes() : 0
      if (startTimeHours == endTimeHours && startTimeMinutes == endTimeMinutes) {
        let startTimeSeconds = this.AllData.dayStartTime ? this.AllData.dayStartTime.seconds() : 0
        let result = []
        for (let i = 0; i <= parseInt(startTimeSeconds); i++) {
          result.push(i)
        }
        return result
      }
      return []
    },
    getPrefectureList() {
        getAction(this.url.getPrefectureList).then(async res => {
          if (res.success && res.result) {
              this.prefectureList = res.result
          }
        })  
    },
    getList() {
      getAction(this.url.queryByOne).then(async res => {
        if (res.success && res.result) {
          let allData = res.result
          try {
            if (allData.indexAddress) {
              let indexAddress1 = Object.values(JSON.parse(allData.indexAddress))
              let indexAddressZ = []
              //图返显
              for (let a = 0; a < indexAddress1.length; a++) {
                let obj = {
                  uid: a,
                  url: this.configure.imgErver + '/' + indexAddress1[a],
                  response: {
                    message: indexAddress1[a]
                  }
                }
                indexAddressZ.push(obj)
              }
              this.diagramFileList = indexAddressZ

            }
            if (allData.indexBigAddress) {
              let indexBigAddress1 = Object.values(JSON.parse(allData.indexBigAddress))
              let indexBigAddressZ = []
              //大图返显
              for (let a = 0; a < indexBigAddress1.length; a++) {
                let obj = {
                  uid: a,
                  url: this.configure.imgErver + '/' + indexBigAddress1[a],
                  response: {
                    message: indexBigAddress1[a]
                  }
                }
                indexBigAddressZ.push(obj)
              }
              this.diagramFileList1 = indexBigAddressZ
              
            }
            
          } catch (e) {
            console.error(e)
          }
        
          if (allData.dayStartTime) {
            allData.dayStartTime = moment(allData.dayStartTime, this.dateFormat)
          }
          if (allData.dayEndTime) {
            allData.dayEndTime = moment(allData.dayEndTime, this.dateFormat)
          }
          console.log(allData, 'allData')
          allData.status = allData.status * 1
          allData.pointsDisplay = allData.pointsDisplay * 1
          allData.groupRewards = allData.groupRewards * 1
          allData.recommendGroupRewards = allData.recommendGroupRewards * 1
          allData.teamRewards = allData.teamRewards * 1
          this.marketingPrefectureId = allData.marketingPrefectureId
          
          
          if (allData.marketingPrefectureTypeId !== undefined && allData.marketingPrefectureTypeId !== '') {
          if (!Array.isArray(allData.marketingPrefectureTypeId)) {
            this.marketingPrefectureTypeId = allData.marketingPrefectureTypeId.split(',')
            }
          } else {
            this.marketingPrefectureTypeId = []
          }
          
           // 如果有分类id请求专区分类
          if (this.marketingPrefectureTypeId) {
            
              getAction(this.url.getMarketingPrefectureTypeAll, { marketingPrefectureId: this.marketingPrefectureId }).then(res => {
                if (res.success) {
                  this.prefectureTypeAll = res.result
                } else {
                  this.$message.warning(res.message)
                }
              })
          }
          this.AllData = { ...this.AllData, ...allData }
          await this.$nextTick()
          this.form.setFieldsValue(this.AllData)
        }
      })
    },
    uploadAction() {
      return this.url.fileUpload
    },
    diagramFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.diagramFilePic = isLt2M
      return isLt2M
    },
    //分享图
    diagramHandleCancel() {
      this.diagramPreviewVisible = false
    },
    diagramHandleCancel1() {
      this.diagramPreviewVisible1 = false
    },
    diagramHandlePreview(file) {
      this.diagramPreviewImage = file.url || file.thumbUrl
      this.diagramPreviewVisible = true
    },
    diagramHandlePreview1(file) {
      this.diagramPreviewImage1 = file.url || file.thumbUrl
      this.diagramPreviewVisible1 = true
    },
    diagramHandleChange({ fileList }) {
      this.diagramFileList = fileList
    },
    diagramHandleChange1({ fileList }) {
      this.diagramFileList1 = fileList
    },

    sure() {
      if (!Array.isArray(this.diagramFileList) || this.diagramFileList.length <= 0) {
        this.$message.warn('请上传首页广告图！')
        return false
      }
      if (!Array.isArray(this.diagramFileList1) || this.diagramFileList1.length <= 0) {
        this.$message.warn('请上传首页广告图(大)！')
        return false
      }
      if (!this.AllData.ruleDescription) {
        this.$message.warn('请填写规则！')
        return false
      }
      if (!this.AllData.dayStartTime) {
        this.$message.warn('请选择开放时段的开始时间')
        return false
      }
      if (!this.AllData.dayEndTime) {
        this.$message.warn('请选择开放时段的结束时间')
        return false
      }
      
      this.form.validateFields((err, values) => {
        
        if (!err) {
          let formData = Object.assign({}, this.AllData, values)
          this.$nextTick(() => {
            let indexAddress = {}//小图
            let indexBigAddress = {}  // 大图
            //小图
            for (let count = 0; count < this.diagramFileList.length; count++) {
              indexAddress[count] = this.diagramFileList[count].response.message
            }
            formData.indexAddress = this.diagramFileList.length > 0 ? JSON.stringify(indexAddress) : ''
           
            formData.dayStartTime = formData.dayStartTime ? formData.dayStartTime.format(this.dateFormat) : null
            formData.dayEndTime = formData.dayEndTime ? formData.dayEndTime.format(this.dateFormat) : null
            
            // 大图
            for (let count = 0; count < this.diagramFileList1.length; count++) {
              indexBigAddress[count] = this.diagramFileList1[count].response.message
            }

            formData.indexBigAddress = this.diagramFileList1.length > 0 ? JSON.stringify(indexBigAddress) : ''
            
            formData.marketingPrefectureId = this.marketingPrefectureId
            formData.marketingPrefectureTypeId = this.marketingPrefectureTypeId.join(',')
          
            
            postAction(this.url.addOrEdit, formData)
              .then(res => {
                if (res.success) {
                  this.$message.success('成功！')
                  this.getList()
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
  },
  watch: {
    marketingPrefectureTypeIds: function(newData, oldData) {
      if (newData.length == 2) {
        this.marketingPrefectureTypeId = newData[1]
        console.log(this.marketingPrefectureTypeId,'this.marketingPrefectureTypeId')
      } else {
        this.marketingPrefectureTypeId = newData[0]
        console.log(this.marketingPrefectureTypeId,'this.marketingPrefectureTypeId')
      }
    }
  }
}
</script>

<style lang="less">
.MarketingGroupIntegralBaseSetting {
	width: 100%;
	background: white;

	.title {
		margin-top: 12px;
		padding: 25px;
		border-bottom: 1px solid #d9d9d9;
		font-weight: 700;
		font-size: 16px;
	}

	.wrap {
		margin-top: 30px;

		.Discount {
			input {
				margin: 0 15px;
				width: 75px;
			}
		}

		.attention {
			margin-top: 10px;
			padding: 0 20px;
			border: 1px solid rgb(0, 153, 255);
			border-radius: 5px;
			background: rgb(204, 235, 255);
			line-height: 34px;
			font-size: 13px;
			color: black;

			-webkit-border-radius: 5px;
			-moz-border-radius: 5px;
		}
	}

	.button-operation {
		display: flex;
		justify-content: space-between;
		margin: 0 auto;
		padding-bottom: 20px;
		width: 200px;

		button {
			width: 80px;
		}
	}

	.button-end {
		margin-bottom: 40px;
		border-bottom: 1px solid gray;
	}
}










































































































































</style>