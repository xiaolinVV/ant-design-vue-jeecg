<template>
  <div class="marketingZoneGroupBaseSetting">
    <div class="title">
      基础设置
    </div>
    <a-form :form="form" class="wrap">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="活动别名">
        <a-input placeholder="请输入活动别名,字数不能超过4个字" v-decorator="rules.anotherName"> </a-input>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="活动标签">
        <a-input placeholder="请输入活动标签,字数不能超过4个字" v-decorator="rules.label"> </a-input>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        help="尺寸800*640 ，支持jpg、jpeg、png格式，大小不超过2M"
      >
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          默认分享图
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
        help="尺寸1428*2540，支持jpg、jpeg、png格式，大小不超过2M。必须预留好二维码位置。以免影响展示效果。"
      >
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          默认海报图
        </span>
        <a-upload
          :action="uploadAction"
          :beforeUpload="postersFileUpload"
          :fileList="postersFileList"
          :headers="headers"
          @change="postersHandleChange"
          @preview="postersHandlePreview"
          listType="picture-card"
        >
          <div v-if="postersFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="postersPreviewVisible" @cancel="postersHandleCancel">
          <img :src="postersPreviewImage" alt="example" style="width: 100%" />
        </a-modal>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        help="尺寸531*540 ，支持jpg、jpeg、png格式，大小不超过2M"
      >
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          封面图
        </span>
        <a-upload
          :action="uploadAction"
          :beforeUpload="surfacePlotFileUpload"
          :fileList="surfacePlotFileList"
          :headers="headers"
          @change="surfacePlotHandleChange"
          @preview="surfacePlotHandlePreview"
          listType="picture-card"
        >
          <div v-if="surfacePlotFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="surfacePlotPreviewVisible" @cancel="surfacePlotHandleCancel">
          <img :src="surfacePlotPreviewImage" alt="example" style="width: 100%" />
        </a-modal>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="客户端显示">
        <a-radio-group v-decorator="rules.pointsDisplay">
          <a-radio :value="0">
            全部
          </a-radio>
          <a-radio :value="1">
            仅小程序
          </a-radio>
          <a-radio :value="2">
            仅APP
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
        label="建团次数"
        help="每天凌晨00:00:00 重置次数，修改次数，仅对次日产生影响。"
      >
        <a-input-number
          :min="0"
          :precision="0"
          placeholder="请输入建团次数"
          style="width: 200px;"
          v-decorator="rules.groupNumber"
        >
        </a-input-number>
        次/天
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="团队奖励条件"
        help="每天必须完成指定次数的拼团，才能得到团队奖励；若未完成则当日无奖励"
      >
        <a-input-number
          :min="0"
          :precision="0"
          placeholder="请输入团队奖励条件"
          style="width: 200px;"
          v-decorator="rules.rewardConditions"
        >
        </a-input-number>
        次/天
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="团队奖励结算周期"
        help="每天凌晨00:00:00 重置次数，修改次数，仅对次日产生影响。"
      >
        <a-input-number
          :min="0"
          :precision="0"
          placeholder="请输入团队奖励结算周期"
          style="width: 200px;"
          v-decorator="rules.settlementInterval"
        >
        </a-input-number>
        小时
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="规则简述">
        <a-input :min="0" :precision="0" placeholder="请输入规则简述" v-decorator="rules.rulesBriefly"> </a-input>
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
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="分享标题">
        <a-input :min="0" :precision="0" placeholder="请输入分享标题" v-decorator="rules.shareTitle"> </a-input>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="分享描述">
        <a-input :min="0" :precision="0" placeholder="请输入分享描述" v-decorator="rules.shareDescription"> </a-input>
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
  name: 'marketingZoneGroupBaseSetting',
  data() {
    return {
      headers: '',
      form: this.$form.createForm(this),
      labelCol: Object.freeze({ span: 2 }),
      wrapperCol: Object.freeze({ span: 12 }),
      dateFormat: 'HH:mm:ss',
      rules: Object.freeze({
        // startEndTime: { rules: [{ required: true, message: '请选择开放时段!' }] },
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
        groupNumber: ['groupNumber', { rules: [{ required: true, message: '请输入建团次数' }] }],
        settlementInterval: ['settlementInterval', { rules: [{ required: true, message: '请输入奖励结算周期' }] }],
        rewardConditions: ['rewardConditions', { rules: [{ required: true, message: '请输入团队奖励条件' }] }],
        rulesBriefly: ['rulesBriefly', { rules: [{ required: true, message: '请输入规则简述' }] }],
        shareTitle: ['shareTitle', { rules: [{ required: true, message: '请输入分享标题' }] }],
        shareDescription: ['shareDescription', { rules: [{ required: false, message: '请输入分享描述' }] }],
        pointsDisplay: ['pointsDisplay', { rules: [{ required: true, message: '请选择客户端显示' }] }],
        status: ['status', { rules: [{ required: true, message: '请选择是否开启' }] }]
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
        // startEndTime: null
      },
      //分享图
      diagramFileList: [],
      diagramPreviewVisible: false,
      diagramPreviewImage: '',
      diagramFilePic: true,
      //海报图配置
      postersFileList: [],
      postersPreviewVisible: false,
      postersPreviewImage: '',
      postersFilePic: true,
      //封面图配置
      surfacePlotFileList: [],
      surfacePlotPreviewVisible: false,
      surfacePlotPreviewImage: '',
      surfacePlotFilePic: true,
      //接口
      url: Object.freeze({
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        addOrEdit: 'marketingZoneGroupBaseSetting/marketingZoneGroupBaseSetting/saveAndUpdate', //新增编辑
        queryByOne: 'marketingZoneGroupBaseSetting/marketingZoneGroupBaseSetting/findByOne' //返现
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
  },
  methods: {
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
    getList() {
      getAction(this.url.queryByOne).then(async res => {
        if (res.success && res.result) {
          let allData = res.result
          // allData.startEndTime = null
          try {
            if (allData.coverPlan) {
              let coverPlans = Object.values(JSON.parse(allData.coverPlan))
              let coverPlansSz = []
              //分享图返显
              for (let a = 0; a < coverPlans.length; a++) {
                let obj = {
                  uid: a,
                  url: this.configure.imgErver + '/' + coverPlans[a],
                  response: {
                    message: coverPlans[a]
                  }
                }
                coverPlansSz.push(obj)
              }
              this.diagramFileList = coverPlansSz
            }
          } catch (e) {
            console.error(e)
          }
          try {
            if (allData.posters) {
              let posterss = Object.values(JSON.parse(allData.posters))
              let posterssSz = []
              //海报图返显
              for (let a = 0; a < posterss.length; a++) {
                let obj = {
                  uid: a,
                  url: this.configure.imgErver + '/' + posterss[a],
                  response: {
                    message: posterss[a]
                  }
                }
                posterssSz.push(obj)
              }
              this.postersFileList = posterssSz
            }
          } catch (e) {
            console.error(e)
          }
          try {
            if (allData.surfacePlot) {
              let surfacePlots = Object.values(JSON.parse(allData.surfacePlot))
              let surfacePlotsSz = []
              //封面图返显
              for (let a = 0; a < surfacePlots.length; a++) {
                let obj = {
                  uid: a,
                  url: this.configure.imgErver + '/' + surfacePlots[a],
                  response: {
                    message: surfacePlots[a]
                  }
                }
                surfacePlotsSz.push(obj)
              }
              this.surfacePlotFileList = surfacePlotsSz
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
          console.log(allData)
          allData.status = allData.status * 1
          allData.pointsDisplay = allData.pointsDisplay * 1
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
    diagramHandlePreview(file) {
      this.diagramPreviewImage = file.url || file.thumbUrl
      this.diagramPreviewVisible = true
    },
    diagramHandleChange({ fileList }) {
      this.diagramFileList = fileList
    },
    //海报图
    postersFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('图片大小必须在5M以内!')
      }
      this.postersFilePic = isLt2M
      return isLt2M
    },
    postersHandleCancel() {
      this.postersPreviewVisible = false
    },
    postersHandlePreview(file) {
      this.postersPreviewImage = file.url || file.thumbUrl
      this.postersPreviewVisible = true
    },
    postersHandleChange({ fileList }) {
      this.postersFileList = fileList
    },

    //封面图
    surfacePlotFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('图片大小必须在5M以内!')
      }
      this.surfacePlotFilePic = isLt2M
      return isLt2M
    },
    surfacePlotHandleCancel() {
      this.surfacePlotPreviewVisible = false
    },
    surfacePlotHandlePreview(file) {
      this.surfacePlotPreviewImage = file.url || file.thumbUrl
      this.surfacePlotPreviewVisible = true
    },
    surfacePlotHandleChange({ fileList }) {
      this.surfacePlotFileList = fileList
    },

    sure() {
      if (!Array.isArray(this.diagramFileList) || this.diagramFileList.length <= 0) {
        this.$message.warn('请上传分享图！')
        return false
      }
      if (!Array.isArray(this.postersFileList) || this.postersFileList.length <= 0) {
        this.$message.warn('请上传海报图！')
        return false
      }
      if (!Array.isArray(this.surfacePlotFileList) || this.surfacePlotFileList.length <= 0) {
        this.$message.warn('请上传封面图！')
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
        // if(this.isSelectData.length<=0){
        //   this.$message.warn('请选择适用商品！')
        //   return;
        // }
        if (!err) {
          let formData = Object.assign({}, this.AllData, values)
          this.$nextTick(() => {
            let coverPlan = {}
            let postersCK = {}
            let surfacePlot = {}
            for (let count = 0; count < this.diagramFileList.length; count++) {
              coverPlan[count] = this.diagramFileList[count].response.message
            }
            for (let count = 0; count < this.postersFileList.length; count++) {
              postersCK[count] = this.postersFileList[count].response.message
            }
            for (let count = 0; count < this.surfacePlotFileList.length; count++) {
              surfacePlot[count] = this.surfacePlotFileList[count].response.message
            }

            formData.coverPlan = this.diagramFileList.length > 0 ? JSON.stringify(coverPlan) : ''
            formData.posters = this.postersFileList.length > 0 ? JSON.stringify(postersCK) : ''
            formData.surfacePlot = this.surfacePlotFileList.length > 0 ? JSON.stringify(surfacePlot) : ''
            //时间格式化
            // formData.dayStartTime = formData.startEndTime[0] ? formData.startEndTime[0].format(this.dateFormat) : null
            // formData.dayEndTime = formData.startEndTime[1] ? formData.startEndTime[1].format(this.dateFormat) : null
            // delete formData.startEndTime
            formData.dayStartTime = formData.dayStartTime ? formData.dayStartTime.format(this.dateFormat) : null
            formData.dayEndTime = formData.dayEndTime ? formData.dayEndTime.format(this.dateFormat) : null
            postAction(this.url.addOrEdit, formData)
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

<style lang="less">
.marketingZoneGroupBaseSetting {
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

/*width: 1080px;*/
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
