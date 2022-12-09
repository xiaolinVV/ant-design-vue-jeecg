<template>
  <div class="MarketingGroupActiveSetting">
    <div class="title">
      加盟商设置
    </div>
    <a-form :form="form" class="wrap">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="开通年费">
        <a-input-number style="width: 90%" :min="0" placeholder="请输入开通年费" v-decorator="rules.annualFee"> </a-input-number>
      </a-form-item>


      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        help="尺寸800*640 ，支持jpg、jpeg、png格式，大小不超过2M"
        validate-status="error"
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
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="入口开关">
        <a-radio-group v-decorator="rules.status">
          <a-radio :style="radioStyle" :value="0">停用</a-radio>
          <a-radio :style="radioStyle" :value="1">启用</a-radio>
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
import Vue from 'vue'
import { getAction, postAction } from '@/api/manage'

export default {
  name: 'AllianceSetting',
  data() {
    return {
      headers: '',
      form: this.$form.createForm(this),
      labelCol: Object.freeze({ span: 3 }),
      wrapperCol: Object.freeze({ span: 12 }),
      rules: Object.freeze({
        annualFee: [
          'annualFee'
        ],
        status: ['status', { rules: [{ required: true, message: '请选择是否启用' }] }]
      }),
      radioStyle: Object.freeze({
        height: '30px',
        lineHeight: '15px'
      }),
      AllData: {
        status: 0,
        ruleDescription: '',
        distributionCommission: 0
      },
      //分享图配置
      diagramFileList: [],
      diagramPreviewVisible: false,
      diagramPreviewImage: '',
      diagramFilePic: true,
      //接口
      url: Object.freeze({
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        addOrEdit: '/alliance/allianceSetting/add', //新增编辑
        queryByOne: '/alliance/allianceSetting/queryByOne' //返现
      }),
      //配置
      configure: Object.freeze({
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
      })
    }
  },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
    this.getList()
  },
  methods: {
    getList() {
      getAction(this.url.queryByOne).then(async res => {
        let allData = res.result
        try {
          if (allData.coverPlan) {
            let coverPlans = Object.values(JSON.parse(allData.introduce))
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
        } catch (e) {}
        allData.distributionCommission = allData.distributionCommission * 1
        allData.pointsDisplay = allData.pointsDisplay * 1
        allData.status = allData.status * 1
        this.AllData = { ...this.AllData, ...allData }
        await this.$nextTick()
        this.form.setFieldsValue(this.AllData)
      })
    },
    uploadAction() {
      return this.url.fileUpload
    },
    diagramFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('图片大小必须在5M以内!')
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
    sure() {
      if (!Array.isArray(this.diagramFileList) || this.diagramFileList.length <= 0) {
        this.$message.warn('请上传分享图！')
        return false
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          this.AllData = Object.assign({}, this.AllData, values)
          this.$nextTick(() => {
            let coverPlan = {}
            for (let count = 0; count < this.diagramFileList.length; count++) {
              coverPlan[count] = this.diagramFileList[count].response.message
            }

            this.AllData.introduce = this.diagramFileList.length > 0 ? JSON.stringify(coverPlan) : ''
            console.log(this.AllData);
            postAction(this.url.addOrEdit, this.AllData)
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
  }
}
</script>

<style lang="less">
.MarketingGroupActiveSetting {
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
