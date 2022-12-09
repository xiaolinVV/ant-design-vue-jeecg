<template>
  <a-card class="wrap">
    <div class="title">
      后台设置
    </div>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="系统名称" :label-col="labelCol" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入系统名称' }] }]" placeholder="请输入系统名称"/>
        </a-form-item>
        <a-form-item label="系统描述" :label-col="labelCol" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['description', { rules: [{ required: true, message: '请输入系统描述' }] }]" placeholder="请输入系统描述"/>
        </a-form-item>
        <a-form-item label="版权信息" :label-col="labelCol" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['copyrightInfo', { rules: [{ required: true, message: '请输入版权信息' }] }]" placeholder="请输入版权信息"/>
        </a-form-item>
        <a-form-item label="备案号" :label-col="labelCol" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['beian',{}]" placeholder="请输入备案号"/>
        </a-form-item>
        <a-form-item label="备案链接" :label-col="labelCol" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['beianUrl',{}]" placeholder="请输入备案链接"/>
        </a-form-item>

        <a-form-item label="登录页logo" :label-col="labelCol" :wrapper-col="{ span: 12 }" validate-status="error"
                     help="尺寸800*800 支持jpg、jpeg、png格式，大小不超过2M">
          <a-upload
            :action="uploadAction"
            listType="picture-card"
            :fileList="mainPictureFileList"
            @preview="mainPictureHandlePreview"
            @change="mainPictureHandleChange"
            :headers="headers"
            :beforeUpload="mainPictureUpload"
          >
            <div v-if="mainPictureFileList.length < 1">
              <a-icon type="plus"/>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="mainPicturePreviewVisible" :footer="null" @cancel="mainPictureHandleCancel">
            <img preview="1" alt="example" style="width: 100%" :src="mainPicturePreviewImage"/>
          </a-modal>
        </a-form-item>
        <a-form-item label="系统内页logo" :label-col="labelCol" :wrapper-col="{ span: 12 }" validate-status="error"
                     help="尺寸800*800 支持jpg、jpeg、png格式，大小不超过2M">
          <a-upload
            :action="uploadAction"
            listType="picture-card"
            :fileList="systemRelatedLogoFileList"
            @preview="systemRelatedLogoPreview"
            @change="systemRelatedLogoChange"
            :headers="headers"
            :beforeUpload="systemRelatedLogoUpload"
          >
            <div v-if="systemRelatedLogoFileList.length < 1">
              <a-icon type="plus"/>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="systemRelatedLogoVisible" :footer="null" @cancel="systemRelatedLogoCancel">
            <img preview="1" alt="example" style="width: 100%" :src="systemRelatedLogoImage"/>
          </a-modal>
        </a-form-item>
        <a-form-item label="标签logo" :label-col="labelCol" :wrapper-col="{ span: 12 }" validate-status="error"
                     help="尺寸800*800 支持jpg、jpeg、png格式，大小不超过2M">
          <a-upload
            :action="uploadAction"
            listType="picture-card"
            :fileList="labelLogoFileList"
            @preview="labelLogoPreview"
            @change="labelLogoChange"
            :headers="headers"
            :beforeUpload="labelLogoUpload"
          >
            <div v-if="labelLogoFileList.length < 1">
              <a-icon type="plus"/>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="labelLogoVisible" :footer="null" @cancel="labelLogoCancel">
            <img preview="1" alt="example" style="width: 100%" :src="labelLogoImage"/>
          </a-modal>
        </a-form-item>
        <a-button type="primary" @click="sure">
          确认
        </a-button>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import Vue from 'vue'
  import {getAction, putAction, postAction} from '@/api/manage'
  import AUpload from "ant-design-vue/es/upload/Upload";
  import AInput from "ant-design-vue/es/input/Input";
  import pick from 'lodash.pick'
  import dayjs from 'dayjs'
  export default {
    name: "SysBackSetting",
    // inject:['rush'],
    components: {
      AInput,
      AUpload
    },
    data () {
      return {
        title: "操作",
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        dataAll: {
          id: '',
          delFlag: '0',//删除状态
          name: "",//系统名称
          description: "",//系统描述
          copyrightInfo: "",//版权信息
          loginLogo: '',//登录页logo地址
          systemRelatedLogo: "",//系统内页logo地址
          labelLogo: "",//标签页logo地址
          beian:"",
          beianUrl:"",
        },
        labelCol: {
          xs: {span: 24},
          sm: {span: 2},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 8},
        },
        url: {
          setSysBackSetting: "/sysBackSetting/sysBackSetting/setSysBackSetting",//后台设置
          findSysBackSetting: "/sysBackSetting/sysBackSetting/findSysBackSetting",//后台设置返显
        },
        uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
        //配置
        configure: {
          imgErver: window._CONFIG['domianURL'] + '/sys/common/view'
        },
        headers: '',
        //登录页logo地址 配置
        mainPictureFileList: [],
        mainPicturePreviewVisible: false,
        mainPicturePreviewImage: '',
        mainPicturePic: true,
        //系统内页logo地址 配置
        systemRelatedLogoFileList: [],
        systemRelatedLogoVisible: false,
        systemRelatedLogoImage: '',
        systemRelatedLogoPic: true,
        //标签页logo地址 配置
        labelLogoFileList: [],
        labelLogoVisible: false,
        labelLogoImage: '',
        labelLogoPic: true,
      }
    },
    methods: {
      mainPictureUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!isLt2M) {
          this.$message.error('图片大小必须在5M以内!')
        }
        this.mainPicturePic = isLt2M
        return isLt2M
      },
      systemRelatedLogoUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!isLt2M) {
          this.$message.error('图片大小必须在5M以内!')
        }
        this.systemRelatedLogoPic = isLt2M
        return isLt2M
      },
      labelLogoUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!isLt2M) {
          this.$message.error('图片大小必须在5M以内!')
        }
        this.labelLogoPic = isLt2M
        return isLt2M
      },
      //上传登录页logo地址
      mainPictureHandleCancel() {
        this.mainPicturePreviewVisible = false
      },
      mainPictureHandlePreview(file) {
        this.mainPicturePreviewImage = file.url || file.thumbUrl
        this.mainPicturePreviewVisible = true
      },
      mainPictureHandleChange({fileList}) {
        this.mainPictureFileList = fileList
      },
      //上传 系统内页logo地址
      systemRelatedLogoCancel() {
        this.systemRelatedLogoVisible = false
      },
      systemRelatedLogoPreview(file) {
        this.systemRelatedLogoImage = file.url || file.thumbUrl
        this.systemRelatedLogoVisible = true
      },
      systemRelatedLogoChange({fileList}) {
        this.systemRelatedLogoFileList = fileList
      },
      //上传 标签页logo地址
      labelLogoCancel() {
        this.labelLogoVisible = false
      },
      labelLogoPreview(file) {
        this.labelLogoImage = file.url || file.thumbUrl
        this.labelLogoVisible = true
      },
      labelLogoChange({fileList}) {
        this.labelLogoFileList = fileList
      },
      sure() {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.dataAll = Object.assign({}, this.dataAll, values)
            this.$nextTick(() => {
              let that = this
              let mainPictureFileList = {}
              let systemRelatedLogoFileList = {}
              let labelLogoFileList = {}
              for (let count = 0; count < that.mainPictureFileList.length; count++) {
                mainPictureFileList[count] = that.mainPictureFileList[count].response.message
              }
              for (let count = 0; count < that.systemRelatedLogoFileList.length; count++) {
                systemRelatedLogoFileList[count] = that.systemRelatedLogoFileList[count].response.message
              }
              for (let count = 0; count < that.labelLogoFileList.length; count++) {
                labelLogoFileList[count] = that.labelLogoFileList[count].response.message
              }
              that.dataAll.loginLogo = JSON.stringify(mainPictureFileList)
              that.dataAll.systemRelatedLogo = JSON.stringify(systemRelatedLogoFileList)
              that.dataAll.labelLogo = JSON.stringify(labelLogoFileList)
              postAction(that.url.setSysBackSetting,that.dataAll).then((res)=>{
                if(res.success){
                  this.$message.success(res.message)
                  this.rush()
                }else{
                  this.$message.warn(res.message)
                  this.rush()
                }
              })
            })
          }
        })
      },
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token};
      let that = this;
      getAction(that.url.findSysBackSetting).then((res)=>{
        if(res.success && res.result){
          if (res.result.loginLogo&&res.result.systemRelatedLogo&&res.result.labelLogo) {
            let loginLogo = Object.values(JSON.parse(res.result.loginLogo))
            let systemRelatedLogo = Object.values(JSON.parse(res.result.systemRelatedLogo))
            let labelLogo = Object.values(JSON.parse(res.result.labelLogo))
            let mainPicturesSz = []
            let systemRelatedLogoSz = []
            let labelLogoSz = []
            for (let a = 0; a < loginLogo.length; a++) {
              let obj = {
                uid: a,
                url: that.configure.imgErver + '/' + loginLogo[a],
                response: {
                  message: loginLogo[a]
                }
              }
              mainPicturesSz.push(obj)
            }
            for (let a = 0; a < systemRelatedLogo.length; a++) {
              let obj = {
                uid: a,
                url: that.configure.imgErver + '/' + systemRelatedLogo[a],
                response: {
                  message: systemRelatedLogo[a]
                }
              }
              systemRelatedLogoSz.push(obj)
            }
            for (let a = 0; a < labelLogo.length; a++) {
              let obj = {
                uid: a,
                url: that.configure.imgErver + '/' + labelLogo[a],
                response: {
                  message: labelLogo[a]
                }
              }
              labelLogoSz.push(obj)
            }
            if (res.result.loginLogo&&res.result.systemRelatedLogo&&res.result.labelLogo) {
              that.mainPictureFileList = mainPicturesSz
              that.systemRelatedLogoFileList = systemRelatedLogoSz
              that.labelLogoFileList = labelLogoSz
            }
          }
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
    border-bottom: 1px solid #CCCCCC;
  }
</style>