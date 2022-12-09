<template>
  <a-card class="wrap">
    <div class="title">
      小程序前端设置
    </div>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="客户端名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '请输入客户端名称' }] }]"
            placeholder="请输入客户端名称"
          />
        </a-form-item>
        <a-form-item label="描述" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            v-decorator="['description', { rules: [{ required: true, message: '请输入描述' }] }]"
            placeholder="请输入描述"
          />
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          validate-status="error"
          help="尺寸800*800 支持jpg、jpeg、png格式，大小不超过2m"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            <span>
              客户端logo
            </span>
          </span>
          <a-upload
            :action="uploadAction"
            listType="picture-card"
            :fileList="frontLogoFileList"
            @preview="frontLogoPreview"
            @change="frontLogoChange"
            :headers="headers"
            :beforeUpload="frontLogoUpload"
          >
            <div v-if="frontLogoFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="frontLogoVisible" :footer="null" @cancel="frontLogoCancel">
            <img preview="1" alt="example" style="width: 100%" :src="frontLogoImage" />
          </a-modal>
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          validate-status="error"
          help="尺寸946*293 支持jpg、jpeg、png、gif格式，大小不超过5m"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            <span>
              礼包胶囊图
            </span>
          </span>
          <a-upload
            :action="uploadAction"
            listType="picture-card"
            :fileList="giftCapsuleAddrFileList"
            @preview="giftCapsuleAddrPreview"
            @change="giftCapsuleAddrChange"
            :headers="headers"
            :beforeUpload="giftCapsuleAddrUpload"
          >
            <div v-if="giftCapsuleAddrFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="giftCapsuleAddrVisible" :footer="null" @cancel="giftCapsuleAddrCancel">
            <img preview="1" alt="example" style="width: 100%" :src="giftCapsuleAddrImage" />
          </a-modal>
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          validate-status="error"
          help="尺寸800*640 支持jpg、jpeg、png格式，大小不超过2m"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            <span>
              首页推广图
            </span>
          </span>
          <a-upload
            :action="uploadAction"
            listType="picture-card"
            :fileList="homeGeneralizeAddrFileList"
            @preview="homeGeneralizeAddrPreview"
            @change="homeGeneralizeAddrChange"
            :headers="headers"
            :beforeUpload="homeGeneralizeAddrUpload"
          >
            <div v-if="homeGeneralizeAddrFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="homeGeneralizeAddrVisible" :footer="null" @cancel="homeGeneralizeAddrCancel">
            <img preview="1" alt="example" style="width: 100%" :src="homeGeneralizeAddrImage" />
          </a-modal>
        </a-form-item>
        <!-- <a-form-item  :label-col="labelCol" :wrapper-col="wrapperCol" validate-status="error"
                     help="尺寸800*640 支持jpg、jpeg、png格式，大小不超过2m">
            <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
           <span >
            领券中心推广图
          </span>
          </span>
          <a-upload
            :action="uploadAction"
            listType="picture-card"
            :fileList="couponCentreAddrFileList"
            @preview="couponCentreAddrPreview"
            @change="couponCentreAddrChange"
            :headers="headers"
            :beforeUpload="couponCentreAddrUpload"
          >
            <div v-if="couponCentreAddrFileList.length < 1">
              <a-icon type="plus"/>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="couponCentreAddrVisible" :footer="null" @cancel="couponCentreAddrCancel">
            <img preview="1" alt="example" style="width: 100%" :src="couponCentreAddrImage"/>
          </a-modal>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" validate-status="error"
                     help="尺寸800*640 支持jpg、jpeg、png格式，大小不超过2m">
           <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
           <span >
           店铺推广图
          </span>
          </span>
          <a-upload
            :action="uploadAction"
            listType="picture-card"
            :fileList="storeGeneralizeAddrFileList"
            @preview="storeGeneralizeAddrPreview"
            @change="storeGeneralizeAddrChange"
            :headers="headers"
            :beforeUpload="storeGeneralizeAddrUpload"
          >
            <div v-if="storeGeneralizeAddrFileList.length < 1">
              <a-icon type="plus"/>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="storeGeneralizeAddrVisible" :footer="null" @cancel="storeGeneralizeAddrCancel">
            <img preview="1" alt="example" style="width: 100%" :src="storeGeneralizeAddrImage"/>
          </a-modal>
        </a-form-item> -->

        <!-- <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="小程序头部颜色">
          <div style="display: flex;align-items: center;">
            <a-input
              @change="headColorChange"
              v-decorator="[
                'headColor',
                { rules: [{ required: true, message: '请输入颜色值（HEX,RGB,RGBA等形式）' }] }
              ]"
              placeholder="请输入颜色值(HEX,RGB,RGBA)"
              style="width: 210px;margin-right: 10px;"
            ></a-input>
            <div
              style="width: 50px;height: 50px;transition: all .2s linear"
              :style="{ background: dataAll.headColor }"
            ></div>
          </div>
        </a-form-item> -->
        <a-form-item
          :label-col="{
            xs: { span: 24 },
            sm: { span: 3 }
          }"
          :wrapper-col="wrapperCol"
          label="商品数据来源标签(小程序端)"
        >
          <a-checkbox-group
            :options="storeSourceOptions"
            v-decorator="[
              'goodLabelSmallsoft',
              { rules: [{ required: false, message: '请选择商品数据来源标签(小程序端)' }] }
            ]"
          />
        </a-form-item>
        <a-form-item
          :label-col="{
            xs: { span: 24 },
            sm: { span: 3 }
          }"
          :wrapper-col="wrapperCol"
          label="商品数据来源标签(app端)"
        >
          <a-checkbox-group
            :options="storeSourceOptions"
            v-decorator="['goodLabelApp', { rules: [{ required: false, message: '请选择商品数据来源标签(app端)' }] }]"
          />
        </a-form-item>
        <a-form-item
          :label-col="{
            xs: { span: 24 },
            sm: { span: 3 }
          }"
          :wrapper-col="wrapperCol"
          label="首页底部推荐类型"
        >
          <a-radio-group
            v-decorator="['indexBottomRecommend', { rules: [{ required: true, message: '请选择首页底部推荐类型' }] }]"
          >
            <a-radio value="0">
              商品
            </a-radio>
            <a-radio value="1">
              店铺
            </a-radio>
            <a-radio value="2">
              特色商家
            </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-button type="primary" @click="sure" style="margin: 0 auto;display: block;">
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
const storeSourceOptions = [{ label: '京东', value: '1' }, { label: '淘宝', value: '2' }]
export default {
  name: 'SysFrontSetting',
  // inject: ['rush'],
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
      storeSourceOptions,
      dataAll: {
        id: '',
        delFlag: '0', //删除状态
        name: '', //客户端名称
        description: '', //描述
        frontLogo: '', //客户端logo
        giftCapsuleAddr: '', //礼包胶囊图
        homeGeneralizeAddr: '', //首页推广图
        // couponCentreAddr:"",//领券中心推广图
        // storeGeneralizeAddr:"",//店铺推广图
        headColor: '#D73724', //小程序首页头部颜色
        goodLabelSmallsoft: [],
        goodLabelApp: [],
        indexBottomRecommend: 0
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      url: {
        setSysFrontSetting: '/sysFrontSetting/sysFrontSetting/setSysFrontSetting', //小程序设置
        findSysFrontSetting: '/sysFrontSetting/sysFrontSetting/findSysFrontSetting' //小程序设置返显
      },
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
      //配置
      configure: {
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view'
      },
      headers: '',
      //客户端logo 配置
      frontLogoFileList: [],
      frontLogoVisible: false,
      frontLogoImage: '',
      frontLogoPic: true,
      //礼包胶囊图 配置
      giftCapsuleAddrFileList: [],
      giftCapsuleAddrVisible: false,
      giftCapsuleAddrImage: '',
      giftCapsuleAddrPic: true,
      //首页推广图 配置
      homeGeneralizeAddrFileList: [],
      homeGeneralizeAddrVisible: false,
      homeGeneralizeAddrImage: '',
      homeGeneralizeAddrPic: true
      //领券中心推广图 配置
      // couponCentreAddrFileList: [],
      // couponCentreAddrVisible: false,
      // couponCentreAddrImage: '',
      // couponCentreAddrPic: true,
      //店铺推广图 配置
      // storeGeneralizeAddrFileList: [],
      // storeGeneralizeAddrVisible: false,
      // storeGeneralizeAddrImage: '',
      // storeGeneralizeAddrPic: true,
    }
  },
  methods: {
    headColorChange(e) {
      this.dataAll.headColor = e.target.value
      console.log(e.target.value)
    },
    frontLogoUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      const isPic = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!isPic) {
        this.$message.error('请上传jpeg或png或jpg格式的图片！')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在2m以内!')
      }
      this.frontLogoPic = isLt2M && isPic
      return isLt2M && isPic
    },
    giftCapsuleAddrUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5
      const isPic =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg' ||
        file.type === 'image/gif'
      if (!isPic) {
        this.$message.error('请上传jpeg或png或jpg格式的图片！')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在2m以内!')
      }
      this.giftCapsuleAddrPic = isLt2M && isPic
      return isLt2M && isPic
    },
    homeGeneralizeAddrUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      const isPic = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!isPic) {
        this.$message.error('请上传jpeg或png或jpg格式的图片！')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在2m以内!')
      }
      this.homeGeneralizeAddrPic = isLt2M && isPic
      return isLt2M && isPic
    },
    couponCentreAddrUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      const isPic = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!isPic) {
        this.$message.error('请上传jpeg或png或jpg格式的图片！')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在2m以内!')
      }
      this.couponCentreAddrPic = isLt2M && isPic
      return isLt2M && isPic
    },
    storeGeneralizeAddrUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      const isPic = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!isPic) {
        this.$message.error('请上传jpeg或png或jpg格式的图片！')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在2m以内!')
      }
      this.storeGeneralizeAddrPic = isLt2M && isPic
      return isLt2M && isPic
    },
    //上传 客户端logo
    frontLogoCancel() {
      this.frontLogoVisible = false
    },
    frontLogoPreview(file) {
      this.frontLogoImage = file.url || file.thumbUrl
      this.frontLogoVisible = true
    },
    frontLogoChange({ fileList }) {
      if (fileList.length <= 0) {
        this.frontLogoFileList = []
        return
      }
      const isLt2M =
        fileList[0].size / 1024 / 1024 < 2 &&
        (fileList[0].type === 'image/jpeg' || fileList[0].type === 'image/png' || fileList[0].type === 'image/jpg')
      if (!isLt2M) return
      this.frontLogoFileList = fileList
    },
    //上传 礼包胶囊图
    giftCapsuleAddrCancel() {
      this.giftCapsuleAddrVisible = false
    },
    giftCapsuleAddrPreview(file) {
      this.giftCapsuleAddrImage = file.url || file.thumbUrl
      this.giftCapsuleAddrVisible = true
    },
    giftCapsuleAddrChange({ fileList }) {
      if (fileList.length <= 0) {
        this.giftCapsuleAddrFileList = []
        return
      }
      const isLt2M =
        fileList[0].size / 1024 / 1024 < 5 &&
        (fileList[0].type === 'image/jpeg' ||
          fileList[0].type === 'image/png' ||
          fileList[0].type === 'image/jpg' ||
          fileList[0].type === 'image/gif')
      if (!isLt2M) return
      this.giftCapsuleAddrFileList = fileList
    },
    //上传 首页推广图
    homeGeneralizeAddrCancel() {
      this.homeGeneralizeAddrVisible = false
    },
    homeGeneralizeAddrPreview(file) {
      this.homeGeneralizeAddrImage = file.url || file.thumbUrl
      this.homeGeneralizeAddrVisible = true
    },
    homeGeneralizeAddrChange({ fileList }) {
      if (fileList.length <= 0) {
        this.homeGeneralizeAddrFileList = []
        return
      }
      const isLt2M =
        fileList[0].size / 1024 / 1024 < 2 &&
        (fileList[0].type === 'image/jpeg' || fileList[0].type === 'image/png' || fileList[0].type === 'image/jpg')
      if (!isLt2M) return
      this.homeGeneralizeAddrFileList = fileList
    },
    //上传 领券中心推广图
    couponCentreAddrCancel() {
      this.couponCentreAddrVisible = false
    },
    couponCentreAddrPreview(file) {
      this.couponCentreAddrImage = file.url || file.thumbUrl
      this.couponCentreAddrVisible = true
    },
    couponCentreAddrChange({ fileList }) {
      if (fileList.length <= 0) {
        this.couponCentreAddrFileList = []
        return
      }
      const isLt2M =
        fileList[0].size / 1024 / 1024 < 2 &&
        (fileList[0].type === 'image/jpeg' || fileList[0].type === 'image/png' || fileList[0].type === 'image/jpg')
      if (!isLt2M) return
      this.couponCentreAddrFileList = fileList
    },
    //上传 领券中心推广图
    storeGeneralizeAddrCancel() {
      this.storeGeneralizeAddrVisible = false
    },
    storeGeneralizeAddrPreview(file) {
      this.storeGeneralizeAddrImage = file.url || file.thumbUrl
      this.storeGeneralizeAddrVisible = true
    },
    storeGeneralizeAddrChange({ fileList }) {
      if (fileList.length <= 0) {
        this.storeGeneralizeAddrFileList = []
        return
      }
      const isLt2M =
        fileList[0].size / 1024 / 1024 < 2 &&
        (fileList[0].type === 'image/jpeg' || fileList[0].type === 'image/png' || fileList[0].type === 'image/jpg')
      if (!isLt2M) return
      this.storeGeneralizeAddrFileList = fileList
    },
    dataCheck() {
      if (!Array.isArray(this.frontLogoFileList) || this.frontLogoFileList.length <= 0) {
        this.$message.warn('请上传客户端logo')
        return false
      }
      if (!Array.isArray(this.giftCapsuleAddrFileList) || this.giftCapsuleAddrFileList.length <= 0) {
        this.$message.warn('请上传礼包胶囊图')
        return false
      }
      if (!Array.isArray(this.homeGeneralizeAddrFileList) || this.homeGeneralizeAddrFileList.length <= 0) {
        this.$message.warn('请上传首页推广图')
        return false
      }
      // if(!Array.isArray(this.couponCentreAddrFileList) || this.couponCentreAddrFileList.length <= 0){
      //   this.$message.warn('请上传领券中心推广图');
      //   return false;
      // }
      // if(!Array.isArray(this.storeGeneralizeAddrFileList) || this.storeGeneralizeAddrFileList.length <= 0){
      //   this.$message.warn('请上传店铺推广图');
      //   return false;
      // }
      return true
    },
    sure() {
      if (!this.dataCheck()) return
      this.form.validateFields((err, values) => {
        if (!err) {
          this.dataAll = Object.assign({}, this.dataAll, values)
          this.$nextTick(() => {
            let that = this
            let frontLogoFileList = {}
            let giftCapsuleAddrFileList = {}
            let homeGeneralizeAddrFileList = {}
            // let couponCentreAddrFileList = {}
            // let storeGeneralizeAddrFileList = {}
            for (let count = 0; count < that.frontLogoFileList.length; count++) {
              frontLogoFileList[count] = that.frontLogoFileList[count].response.message
            }
            for (let count = 0; count < that.giftCapsuleAddrFileList.length; count++) {
              giftCapsuleAddrFileList[count] = that.giftCapsuleAddrFileList[count].response.message
            }
            for (let count = 0; count < that.homeGeneralizeAddrFileList.length; count++) {
              homeGeneralizeAddrFileList[count] = that.homeGeneralizeAddrFileList[count].response.message
            }
            // for (let count = 0; count < that.couponCentreAddrFileList.length; count++) {
            //   couponCentreAddrFileList[count] = that.couponCentreAddrFileList[count].response.message
            // }
            // for (let count = 0; count < that.storeGeneralizeAddrFileList.length; count++) {
            //   storeGeneralizeAddrFileList[count] = that.storeGeneralizeAddrFileList[count].response.message
            // }

            that.dataAll.frontLogo = that.frontLogoFileList.length > 0 ? JSON.stringify(frontLogoFileList) : ''
            that.dataAll.giftCapsuleAddr =
              that.giftCapsuleAddrFileList.length > 0 ? JSON.stringify(giftCapsuleAddrFileList) : ''
            that.dataAll.homeGeneralizeAddr =
              that.homeGeneralizeAddrFileList.length > 0 ? JSON.stringify(homeGeneralizeAddrFileList) : ''
            // that.dataAll.couponCentreAddr = that.couponCentreAddrFileList.length > 0 ? JSON.stringify(couponCentreAddrFileList) :''
            // that.dataAll.storeGeneralizeAddr = that.storeGeneralizeAddrFileList.length > 0 ? JSON.stringify(storeGeneralizeAddrFileList) : ''
            if (that.dataAll.goodLabelSmallsoft && that.dataAll.goodLabelSmallsoft.length > 0) {
              that.dataAll.goodLabelSmallsoft = that.dataAll.goodLabelSmallsoft.join(',')
            } else {
              that.dataAll.goodLabelSmallsoft = ''
            }
            if (that.dataAll.goodLabelApp && that.dataAll.goodLabelApp.length > 0) {
              that.dataAll.goodLabelApp = that.dataAll.goodLabelApp.join(',')
            } else {
              that.dataAll.goodLabelApp = ''
            }
            this.form.setFieldsValue(that.dataAll)
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
        // &&res.result.couponCentreAddr &&res.result.storeGeneralizeAddr
        if (res.result.frontLogo && res.result.giftCapsuleAddr && res.result.homeGeneralizeAddr) {
          let frontLogo = Object.values(JSON.parse(res.result.frontLogo))
          let giftCapsuleAddr = Object.values(JSON.parse(res.result.giftCapsuleAddr))
          let homeGeneralizeAddr = Object.values(JSON.parse(res.result.homeGeneralizeAddr))
          // let couponCentreAddr = Object.values(JSON.parse(res.result.couponCentreAddr))
          // let storeGeneralizeAddr = Object.values(JSON.parse(res.result.storeGeneralizeAddr))
          let frontLogoSz = []
          let giftCapsuleAddrSz = []
          let homeGeneralizeAddrSz = []
          // let couponCentreAddrSz = []
          // let storeGeneralizeAddrSz = []
          for (let a = 0; a < frontLogo.length; a++) {
            let obj = {
              uid: a,
              url: that.configure.imgErver + '/' + frontLogo[a],
              response: {
                message: frontLogo[a]
              }
            }
            frontLogoSz.push(obj)
          }
          for (let a = 0; a < giftCapsuleAddr.length; a++) {
            let obj = {
              uid: a,
              url: that.configure.imgErver + '/' + giftCapsuleAddr[a],
              response: {
                message: giftCapsuleAddr[a]
              }
            }
            giftCapsuleAddrSz.push(obj)
          }
          for (let a = 0; a < homeGeneralizeAddr.length; a++) {
            let obj = {
              uid: a,
              url: that.configure.imgErver + '/' + homeGeneralizeAddr[a],
              response: {
                message: homeGeneralizeAddr[a]
              }
            }
            homeGeneralizeAddrSz.push(obj)
          }
          // for (let a = 0; a < couponCentreAddr.length; a++) {
          //   let obj = {
          //     uid: a,
          //     url: that.configure.imgErver + '/' + couponCentreAddr[a],
          //     response: {
          //       message: couponCentreAddr[a]
          //     }
          //   }
          //   couponCentreAddrSz.push(obj)
          // }
          // for (let a = 0; a < storeGeneralizeAddr.length; a++) {
          //   let obj = {
          //     uid: a,
          //     url: that.configure.imgErver + '/' + storeGeneralizeAddr[a],
          //     response: {
          //       message: storeGeneralizeAddr[a]
          //     }
          //   }
          //   storeGeneralizeAddrSz.push(obj)
          // }
          // &&res.result.couponCentreAddr
          if (
            res.result.frontLogo &&
            res.result.giftCapsuleAddr &&
            res.result.homeGeneralizeAddr &&
            res.result.storeGeneralizeAddr
          ) {
            that.frontLogoFileList = frontLogoSz
            that.giftCapsuleAddrFileList = giftCapsuleAddrSz
            that.homeGeneralizeAddrFileList = homeGeneralizeAddrSz
            // that.couponCentreAddrFileList = couponCentreAddrSz
            // that.storeGeneralizeAddrFileList = storeGeneralizeAddrSz
          }
        }
        if (!res.result.headColor) res.result.headColor = '#D73724'
        if (res.result.goodLabelApp) {
          res.result.goodLabelApp = res.result.goodLabelApp.split(',')
        } else {
          res.result.goodLabelApp = []
        }
        if (res.result.goodLabelSmallsoft) {
          res.result.goodLabelSmallsoft = res.result.goodLabelSmallsoft.split(',')
        } else {
          res.result.goodLabelSmallsoft = []
        }
        that.dataAll = Object.assign({}, that.dataAll, res.result)
        that.$nextTick(() => {
          that.form.setFieldsValue(that.dataAll)
        })
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
