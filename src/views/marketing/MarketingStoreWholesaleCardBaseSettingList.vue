<template>
  <div class="MarketingStoreGiftCardBaseSettingList">
    <div class="title">
      基础设置
    </div>
    <a-form :form="form" class="wrap">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="批发卡别名">
        <a-input placeholder="请输入批发卡别名,字数不能超过4个字" v-decorator="rules.anotherName"> </a-input>
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
            仅app
          </a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        help="尺寸702*440 ，支持jpg、jpeg、png格式，大小不超过2M"
        validate-status="error"
      >
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          卡背景图
        </span>
        <a-upload
          :action="uploadAction"
          :beforeUpload="backgroundImageFileUpload"
          :fileList="backgroundImageFileList"
          :headers="headers"
          @change="backgroundImageHandleChange"
          @preview="backgroundImageHandlePreview"
          listType="picture-card"
        >
          <div v-if="backgroundImageFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="backgroundImagePreviewVisible" @cancel="backgroundImageHandleCancel">
          <img :src="backgroundImagePreviewImage" alt="example" style="width: 100%" />
        </a-modal>
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
          分享图
        </span>
        <a-upload
          :action="uploadAction"
          :beforeUpload="coverPlanFileUpload"
          :fileList="coverPlanFileList"
          :headers="headers"
          @change="coverPlanHandleChange"
          @preview="coverPlanHandlePreview"
          listType="picture-card"
        >
          <div v-if="coverPlanFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="coverPlanPreviewVisible" @cancel="coverPlanHandleCancel">
          <img :src="coverPlanPreviewImage" alt="example" style="width: 100%" />
        </a-modal>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="是否开启">
        <a-radio-group v-decorator="rules.status">
          <a-radio :style="radioStyle" :value="0">关闭</a-radio>
          <a-radio :style="radioStyle" :value="1">开启</a-radio>
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
  name: 'MarketingStoreWholesaleCardBaseSettingList',
  data() {
    return {
      cardType: '1',
      headers: '',
      form: this.$form.createForm(this),
      labelCol: Object.freeze({ span: 3 }),
      wrapperCol: Object.freeze({ span: 12 }),
      rules: Object.freeze({
        anotherName: [
          'anotherName',
          {
            rules: [
              { required: true, message: '请输入批发卡别名' },
              {
                max: 4,
                message: '字数不能超过4个字'
              }
            ]
          }
        ],

        pointsDisplay: ['pointsDisplay', { rules: [{ required: true, message: '请选择客户端显示' }] }],
        status: ['status', { rules: [{ required: true, message: '请选择是否开启' }] }]
      }),
      radioStyle: Object.freeze({
        height: '30px',
        lineHeight: '15px'
      }),
      AllData: {
        // ruleDescription: '',
        status: 0
      },

      //封面图配置
      backgroundImageFileList: [],
      backgroundImagePreviewVisible: false,
      backgroundImagePreviewImage: '',
      backgroundImageFilePic: true,
      //分享图配置
      coverPlanFileList: [],
      coverPlanPreviewVisible: false,
      coverPlanPreviewImage: '',
      coverPlanFilePic: true,
      //接口
      url: Object.freeze({
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        addOrEdit: '/marketing/marketingStoreGiftCardBaseSetting/addOrEdit', //新增编辑
        queryByOne: '/marketing/marketingStoreGiftCardBaseSetting/queryByOne' //返现
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
      getAction(this.url.queryByOne,{"cardType": this.cardType}).then(async res => {
        let allData = res.result
        try {
          if (allData.backgroundImage) {
            let backgroundImage = Object.values(JSON.parse(allData.backgroundImage))
            let backgroundImageSz = []
            //封面图返显
            for (let a = 0; a < backgroundImage.length; a++) {
              let obj = {
                uid: a,
                url: this.configure.imgErver + '/' + backgroundImage[a],
                response: {
                  message: backgroundImage[a]
                }
              }
              backgroundImageSz.push(obj)
            }
            this.backgroundImageFileList = backgroundImageSz
          }
        } catch (e) {}
        try {
          if (allData.coverPlan) {
            let coverPlan = Object.values(JSON.parse(allData.coverPlan))
            let coverPlanSz = []
            //分享图返显
            for (let a = 0; a < coverPlan.length; a++) {
              let obj = {
                uid: a,
                url: this.configure.imgErver + '/' + coverPlan[a],
                response: {
                  message: coverPlan[a]
                }
              }
              coverPlanSz.push(obj)
            }
            this.coverPlanFileList = coverPlanSz
          }
        } catch (e) {}
        allData.status = allData.status * 1
        allData.pointsDisplay = allData.pointsDisplay * 1
        this.AllData = { ...this.AllData, ...allData }
        await this.$nextTick()
        this.form.setFieldsValue(this.AllData)
      })
    },
    uploadAction() {
      return this.url.fileUpload
    },

    //封面图
    backgroundImageFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.backgroundImageFilePic = isLt2M
      return isLt2M
    },
    backgroundImageHandleCancel() {
      this.backgroundImagePreviewVisible = false
    },
    backgroundImageHandlePreview(file) {
      this.backgroundImagePreviewImage = file.url || file.thumbUrl
      this.backgroundImagePreviewVisible = true
    },
    backgroundImageHandleChange({ fileList }) {
      this.backgroundImageFileList = fileList
    },
    //分享图
    coverPlanFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.coverPlanFilePic = isLt2M
      return isLt2M
    },
    coverPlanHandleCancel() {
      this.coverPlanPreviewVisible = false
    },
    coverPlanHandlePreview(file) {
      this.coverPlanPreviewImage = file.url || file.thumbUrl
      this.coverPlanPreviewVisible = true
    },
    coverPlanHandleChange({ fileList }) {
      this.coverPlanFileList = fileList
    },

    sure() {
      if (!Array.isArray(this.backgroundImageFileList) || this.backgroundImageFileList.length <= 0) {
        this.$message.warn('请上传封面图！')
        return false
      }
      if (!Array.isArray(this.coverPlanFileList) || this.coverPlanFileList.length <= 0) {
        this.$message.warn('请上传分享图！')
        return false
      }

      this.form.validateFields((err, values) => {
        if (!err) {
          this.AllData = Object.assign({}, this.AllData, values)
          this.$nextTick(() => {
            let backgroundImage = {}
            let coverPlan = {}

            for (let count = 0; count < this.backgroundImageFileList.length; count++) {
              backgroundImage[count] = this.backgroundImageFileList[count].response.message
            }
            for (let count = 0; count < this.coverPlanFileList.length; count++) {
              coverPlan[count] = this.coverPlanFileList[count].response.message
            }
            this.AllData.backgroundImage =
              this.backgroundImageFileList.length > 0 ? JSON.stringify(backgroundImage) : ''
            this.AllData.coverPlan = this.coverPlanFileList.length > 0 ? JSON.stringify(coverPlan) : ''
            this.AllData.cardType = this.cardType
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
.MarketingStoreGiftCardBaseSettingList {
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
