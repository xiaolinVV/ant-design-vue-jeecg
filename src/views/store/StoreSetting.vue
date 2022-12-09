<template>
  <a-card class="wrap">
    <div class="title">
      店铺设置
    </div>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="开店功能" :label-col="labelCol" :wrapper-col="{ span: 12 }">
          <a-radio-group v-model="dataAll.openStore">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="店铺管理地址" :label-col="labelCol" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['manageAddress', { rules: [{ required: true, message: '请输入店铺管理地址' }] }]"
            placeholder="请输入店铺管理地址"
          />
        </a-form-item>

        <a-form-item label="店铺初始密码" :label-col="labelCol" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['initialPasswd', { rules: [{ required: true, message: '请输入店铺初始密码' }] }]"
            placeholder="请输入店铺初始密码"
          />
        </a-form-item>
        <a-form-item label="默认服务距离" :label-col="labelCol" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['serviceDistance', { rules: [{ required: true, message: '请输入默认服务距离' }] }]"
            placeholder="请输入默认服务距离"
          />
        </a-form-item>
        <a-form-item label="店铺首页推荐店铺" :label-col="labelCol" :wrapper-col="{ span: 12 }">
          <a-radio-group v-model="dataAll.storeCut">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
          <div style="color: red">
            开启后，店铺首页将显示平台的推荐店铺模块
          </div>
        </a-form-item>
        <a-form-item label="店铺欢迎弹窗" :label-col="labelCol" :wrapper-col="{ span: 12 }">
          <a-radio-group v-model="dataAll.autoWelcome">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
          <div>
            设置了不自动踏出，则进入店铺不主动弹出欢迎页
          </div>
        </a-form-item>

        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" label="店铺列表默认排序">
          <a-radio-group
            v-decorator="['defaultSort', { rules: [{ required: true, message: '请选择首页底部推荐类型' }] }]"
          >
            <a-radio value="0">
              按距离
            </a-radio>
            <a-radio value="1">
              按排序值
            </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :label-col="labelCol"
          :wrapper-col="{ span: 12 }"
          validate-status="error"
          help="尺寸宽度750，高度不限，支持jpg、jpeg、png格式"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            <span style="color: red">
              开店邀请图
            </span>
          </span>
          <a-upload
            :action="uploadAction"
            listType="picture-card"
            :fileList="inviteFigureFileList"
            @preview="inviteFigurePreview"
            @change="inviteFigureChange"
            :headers="headers"
            :beforeUpload="inviteFigureUpload"
          >
            <div v-if="inviteFigureFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="inviteFigureVisible" :footer="null" @cancel="inviteFigureCancel">
            <img preview="1" alt="example" style="width: 100%" :src="inviteFigureImage" />
          </a-modal>
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="{ span: 12 }"
          validate-status="error"
          help="尺寸800*640 ，支持jpg、jpeg、png格式，大小不超过2M"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            <span style="color: red">
              分享图
            </span>
          </span>
          <a-upload
            :action="uploadAction"
            listType="picture-card"
            :fileList="coverPlanFileList"
            @preview="coverPlanPreview"
            @change="coverPlanChange"
            :headers="headers"
            :beforeUpload="coverPlanUpload"
          >
            <div v-if="coverPlanFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="coverPlanVisible" :footer="null" @cancel="coverPlanCancel">
            <img preview="1" alt="example" style="width: 100%" :src="coverPlanImage" />
          </a-modal>
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="{ span: 12 }"
          validate-status="error"
          help="尺寸1428*2540，支持jpg、jpeg、png格式，大小不超过2M。必须预留好二维码位置。以免影响展示效果。"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            <span>
              海报图
            </span>
          </span>
          <a-upload
            :action="uploadAction"
            listType="picture-card"
            :fileList="postersFileList"
            @preview="postersPreview"
            @change="postersChange"
            :headers="headers"
            :beforeUpload="postersUpload"
          >
            <div v-if="postersFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="postersVisible" :footer="null" @cancel="postersCancel">
            <img preview="1" alt="example" style="width: 100%" :src="postersImage" />
          </a-modal>
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="{ span: 12 }"
          validate-status="error"
          help="尺寸宽度750，高度不限，支持jpg、jpeg、png格式"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            <span>
              开店宣传图
            </span>
          </span>
          <a-upload
            :action="uploadAction"
            listType="picture-card"
            :fileList="openPublicityPicFileList"
            @preview="openPublicityPicPreview"
            @change="openPublicityPicChange"
            :headers="headers"
            :beforeUpload="openPublicityPicUpload"
          >
            <div v-if="openPublicityPicFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="openPublicityPicVisible" :footer="null" @cancel="openPublicityPicCancel">
            <img preview="1" alt="example" style="width: 100%" :src="openPublicityPicImage" />
          </a-modal>
        </a-form-item>

        <a-button type="primary" @click="sure" style="margin: 0 auto;display: block;width: 120px">
          确认
        </a-button>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { getAction, putAction, postAction } from '@/api/manage'
import AUpload from 'ant-design-vue/es/upload/Upload'
import AInput from 'ant-design-vue/es/input/Input'
import pick from 'lodash.pick'
import dayjs from 'dayjs'

export default {
  name: 'StoreSetting',
  inject: ['rush'],
  components: {
    AInput,
    AUpload
  },
  data() {
    return {
      title: '操作',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      dataAll: {
        id: '',
        delFlag: '0', //删除状态
        openStore: 0, //开店功能
        manageAddress: '', //店铺管理地址
        initialPasswd: '', //初始密码
        serviceDistance: '', //默认服务距离
        openPublicityPic: '', //开店宣传图
        inviteFigure: '', //开店邀请图
        coverPlan: '', //分享图
        posters: '', //海报图
        storeCut: 0, //店铺切换
        autoWelcome: 1, //自动弹出欢迎弹窗：0：不自动弹出；1：自动弹出 默认为1
        defaultSort: 0 //默认排序方式；0：按距离；1：按照排序字段
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      url: {
        setSysFrontSetting: '/storeSetting/storeSetting/setStoreSetting', //小程序设置
        findSysFrontSetting: '/storeSetting/storeSetting/findStoreSetting' //小程序设置返显
      },
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
      //配置
      configure: {
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view'
      },
      headers: '',
      //开店宣传图 配置
      openPublicityPicFileList: [],
      openPublicityPicVisible: false,
      openPublicityPicImage: '',
      openPublicityPicPic: true,
      //分享图 配置
      coverPlanFileList: [],
      coverPlanVisible: false,
      coverPlanImage: '',
      coverPlanPic: true,
      //海报图 配置
      postersFileList: [],
      postersVisible: false,
      postersImage: '',
      postersPic: true,
      //开店邀请图 配置
      inviteFigureFileList: [],
      inviteFigureVisible: false,
      inviteFigureImage: '',
      inviteFigurePic: true
    }
  },
  methods: {
    //上传 开店宣传图
    openPublicityPicUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJpgOrPng) {
        this.$message.error('图片必须为jpeg，png,jpg格式!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.openPublicityPicPic = isLt2M && isJpgOrPng
      return isLt2M && isJpgOrPng
    },
    openPublicityPicCancel() {
      this.openPublicityPicVisible = false
    },
    openPublicityPicPreview(file) {
      this.openPublicityPicImage = file.url || file.thumbUrl
      this.openPublicityPicVisible = true
    },
    openPublicityPicChange({ fileList }) {
      if (this.openPublicityPicPic) {
        this.openPublicityPicFileList = fileList
      }
    },
    //上传 分享图
    coverPlanUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJpgOrPng) {
        this.$message.error('图片必须为jpeg，png,jpg格式!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.coverPlanPic = isLt2M && isJpgOrPng
      return isLt2M && isJpgOrPng
    },
    coverPlanCancel() {
      this.coverPlanVisible = false
    },
    coverPlanPreview(file) {
      this.coverPlanImage = file.url || file.thumbUrl
      this.coverPlanVisible = true
    },
    coverPlanChange({ fileList }) {
      if (this.coverPlanPic) {
        this.coverPlanFileList = fileList
      }
    },
    //上传 海报图
    postersUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJpgOrPng) {
        this.$message.error('图片必须为jpeg，png,jpg格式!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.postersPic = isLt2M && isJpgOrPng
      return isLt2M && isJpgOrPng
    },
    postersCancel() {
      this.postersVisible = false
    },
    postersPreview(file) {
      this.postersImage = file.url || file.thumbUrl
      this.postersVisible = true
    },
    postersChange({ fileList }) {
      if (this.postersPic) {
        this.postersFileList = fileList
      }
    },
    //开店邀请图
    inviteFigureUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJpgOrPng) {
        this.$message.error('图片必须为jpeg，png,jpg格式!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.inviteFigurePic = isLt2M && isJpgOrPng
      return isLt2M && isJpgOrPng
    },
    inviteFigureCancel() {
      this.inviteFigureVisible = false
    },
    inviteFigurePreview(file) {
      this.inviteFigureImage = file.url || file.thumbUrl
      this.inviteFigureVisible = true
    },
    inviteFigureChange({ fileList }) {
      if (this.inviteFigurePic) {
        this.inviteFigureFileList = fileList
      }
    },
    //图片上传校验
    imageUpLoad() {
      if (this.openPublicityPicFileList.length <= 0) {
        this.$message.warn('请上传开店宣传图')
        return false
      }
      if (this.coverPlanFileList.length <= 0) {
        this.$message.warn('请上传分享图')
        return false
      }
      if (this.postersFileList.length <= 0) {
        this.$message.warn('请上传海报图')
        return false
      }
      if (this.inviteFigureFileList.length <= 0) {
        this.$message.warn('请上传开店邀请图')
        return false
      }
      return true
    },
    sure() {
      if (!this.imageUpLoad()) return
      this.form.validateFields((err, values) => {
        if (!err) {
          this.dataAll = Object.assign({}, this.dataAll, values)
          this.$nextTick(() => {
            let that = this
            let openPublicityPicFileList = {}
            for (let count = 0; count < that.openPublicityPicFileList.length; count++) {
              openPublicityPicFileList[count] = that.openPublicityPicFileList[count].response.message
            }
            that.dataAll.openPublicityPic = JSON.stringify(openPublicityPicFileList)

            let coverPlanFileList = {}
            for (let count = 0; count < that.coverPlanFileList.length; count++) {
              coverPlanFileList[count] = that.coverPlanFileList[count].response.message
            }
            that.dataAll.coverPlan = JSON.stringify(coverPlanFileList)

            let postersFileList = {}
            for (let count = 0; count < that.postersFileList.length; count++) {
              postersFileList[count] = that.postersFileList[count].response.message
            }
            that.dataAll.posters = JSON.stringify(postersFileList)

            let inviteFigureFileList = {}
            for (let count = 0; count < that.inviteFigureFileList.length; count++) {
              inviteFigureFileList[count] = that.inviteFigureFileList[count].response.message
            }
            that.dataAll.inviteFigure = JSON.stringify(inviteFigureFileList)
            postAction(that.url.setSysFrontSetting, that.dataAll).then(res => {
              if (res.success) {
                this.$message.success(res.message)
                this.rush()
              } else {
                this.$message.warn(res.message)
                this.rush()
              }
            })
          })
        }
      })
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    let that = this
    getAction(that.url.findSysFrontSetting).then(res => {
      if (res.success && res.result) {
        if (res.result.openPublicityPic && res.result.openPublicityPic != '{}') {
          let openPublicityPic = Object.values(JSON.parse(res.result.openPublicityPic))
          let openPublicityPicSz = []
          for (let a = 0; a < openPublicityPic.length; a++) {
            let obj = {
              uid: a,
              url: that.configure.imgErver + '/' + openPublicityPic[a],
              response: {
                message: openPublicityPic[a]
              }
            }
            openPublicityPicSz.push(obj)
          }
          that.openPublicityPicFileList = openPublicityPicSz
        }
        if (res.result.inviteFigure && res.result.inviteFigure != '{}') {
          let inviteFigure = Object.values(JSON.parse(res.result.inviteFigure))
          let inviteFigureSz = []
          for (let a = 0; a < inviteFigure.length; a++) {
            let obj = {
              uid: a,
              url: that.configure.imgErver + '/' + inviteFigure[a],
              response: {
                message: inviteFigure[a]
              }
            }
            inviteFigureSz.push(obj)
          }
          that.inviteFigureFileList = inviteFigureSz
        }
        if (res.result.coverPlan && res.result.coverPlan != '{}') {
          let coverPlan = Object.values(JSON.parse(res.result.coverPlan))
          let coverPlanSz = []
          for (let a = 0; a < coverPlan.length; a++) {
            let obj = {
              uid: a,
              url: that.configure.imgErver + '/' + coverPlan[a],
              response: {
                message: coverPlan[a]
              }
            }
            coverPlanSz.push(obj)
          }
          that.coverPlanFileList = coverPlanSz
        }
        if (res.result.posters && res.result.posters != '{}') {
          let posters = Object.values(JSON.parse(res.result.posters))
          let postersSz = []
          for (let a = 0; a < posters.length; a++) {
            let obj = {
              uid: a,
              url: that.configure.imgErver + '/' + posters[a],
              response: {
                message: posters[a]
              }
            }
            postersSz.push(obj)
          }
          that.postersFileList = postersSz
        }
        res.result.openStore = res.result.openStore * 1
        res.result.storeCut = res.result.storeCut * 1
        res.result.autoWelcome = res.result.autoWelcome * 1
        that.dataAll = res.result
        that.form.setFieldsValue(res.result)
      }
    })
  }
}
</script>
<style lang="less">
.title {
  font-size: 20px;
  color: black;
  font-weight: 600;
  padding: 16px 0;
  border-bottom: 1px solid #cccccc;
}
</style>
