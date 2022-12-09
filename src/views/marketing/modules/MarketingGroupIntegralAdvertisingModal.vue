<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="广告标题">
          <a-input placeholder="请输入广告标题" v-decorator="['title', validatorRules.title]" />
        </a-form-item>

        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          help="请上传分类图片，支持jpg、jpeg、png格式，大小不超过2M"
          validate-status="error"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            图片
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

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="跳转类型">
          <a-select
            v-decorator="['goToType', validatorRules.goToType]"
            placeholder="请选择跳转类型"
            @change="chooseMedicineGoToType"
          >
            <a-select-option value="">请选择</a-select-option>
            <a-select-option :value="0">无</a-select-option>
            <a-select-option :value="1">大图</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="goToType == 1"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          validate-status="validating"
          help="请上传详情图图片"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            <span>
              地址
            </span>
          </span>
          <a-upload
            :action="uploadAction"
            :beforeUpload="picFileUpload"
            :fileList="picFileList"
            :headers="headers"
            @change="picHandleChange"
            @preview="picHandlePreview"
            listType="picture-card"
          >
            <!--            v-if="picFileList.length < 1"-->
            <div v-if="picFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :footer="null" :visible="picPreviewVisible" @cancel="picHandleCancel">
            <img :src="picPreviewImage" alt="example" style="width: 100%" />
          </a-modal>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input placeholder="请输入排序" v-decorator="['sort', validatorRules.sort]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开始时间">
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['startTime', validatorRules.startTime]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结束时间">
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['endTime', validatorRules.endTime]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import Vue from 'vue'
export default {
  name: 'MarketingGroupIntegralAdvertisingModal',
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      goToType: 0,
      //图片
      headers: '',
      diagramFileList: [],
      diagramPreviewVisible: false,
      diagramPreviewImage: '',
      diagramFilePic: true,
      //地址上传配置
      picFileList: [],
      picPreviewImage: [],
      picPreviewVisible: false,
      picFilePic: true,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        title: {
          rules: [
            {
              required: true,
              message: '请输入广告标题!'
            }
          ]
        },
        goToType: {
          rules: [
            {
              required: true,
              message: '请选择跳转类型!'
            }
          ]
        },
        sort: {
          rules: [
            {
              required: true,
              message: '请选择排序!'
            }
          ]
        },
        startTime: {
          rules: [
            {
              required: true,
              message: '请选择开始时间!'
            }
          ]
        },
        endTime: {
          rules: [
            {
              required: true,
              message: '请选择结束时间!'
            }
          ]
        }
      },
      url: {
        add: '/marketing/marketingGroupIntegralAdvertising/add',
        edit: '/marketing/marketingGroupIntegralAdvertising/edit',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      }
    }
  },
  computed: {
    uploadAction() {
      return this.url.fileUpload
    }
  },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
  },
  methods: {
    //图片上传验证
    picFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5
      const fileType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!fileType) {
        this.$message.error('请上传jpg、jpeg、png格式的图片')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在5M以内!')
      }
      this.picFilePic = isLt2M
      return isLt2M && fileType
    },
    //图片上传
    picHandleChange({ fileList }) {
      if (fileList.length <= 0) {
        this.picFileList = []
        return
      }
      let index = fileList.length - 1
      if (
        fileList[index].size / 1024 / 1024 < 5 &&
        (fileList[index].type === 'image/jpeg' ||
          fileList[index].type === 'image/png' ||
          fileList[index].type === 'image/jpg')
      ) {
        this.picFileList = fileList
      }
    },
    //图片预览
    picHandlePreview(file) {
      this.picPreviewImage = file.url || file.thumbUrl
      this.picPreviewVisible = true
    },
    //图片取消预览
    picHandleCancel() {
      this.picPreviewVisible = false
    },
    //跳转类型
    chooseMedicineGoToType: function(value) {
      this.goToType = value
      this.picFileList = []
    },
    diagramFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.diagramFilePic = isLt2M
      return isLt2M
    },
    //图标
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
    add() {
      this.edit({})
    },
    edit(record) {
      this.diagramFileList = []
      this.picFileList = []
      this.goToType = record.goToType || 0
      this.form.resetFields()
      record.goToType = record.goToType * 1 || 0
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'year',
            'month',
            'day',
            'title',
            'pictureAddr',
            'goToType',
            'sort',
            'status',
            'delFlag',
            'adAdress',
            'statusExplain'
          )
        )
        try {
          if (record.pictureAddr) {
            let pictureAddrIcons = Object.values(JSON.parse(record.pictureAddr))
            let pictureAddrIconsSz = []
            //积分图标返显
            for (let a = 0; a < pictureAddrIcons.length; a++) {
              let obj = {
                uid: a,
                url: this.url.imgerver + '/' + pictureAddrIcons[a],
                response: {
                  message: pictureAddrIcons[a]
                }
              }
              pictureAddrIconsSz.push(obj)
            }
            this.diagramFileList = pictureAddrIconsSz
          }
        } catch (e) {
          console.error(e)
        }
        if (record.adAdress) {
          try {
            let adAdress = Object.values(JSON.parse(record.adAdress))
            let count = 0
            for (let item of adAdress) {
              count++
              this.picFileList.push({
                url: this.url.imgerver + '/' + item,
                uid: count,
                response: {
                  message: item
                }
              })
            }
          } catch {
            console.warn('adAdress商品详情图字段为多图格式！')
          }
        }
        //时间格式化
        this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
        this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      if (this.diagramFileList.length <= 0) {
        this.$message.warn('请上传图片')
        return
      }
      if (this.goToType == 1 && this.picFileList.length <= 0) {
        this.$message.warn('请上传地址跳转的详情图图片')
        return
      }
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let formData = Object.assign(this.model, values)
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            formData.status = 1
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }

          //时间格式化
          formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null

          let pictureAddrIcon = {}
          for (let count = 0; count < this.diagramFileList.length; count++) {
            pictureAddrIcon[count] = this.diagramFileList[count].response.message
          }
          formData.pictureAddr = this.diagramFileList.length > 0 ? JSON.stringify(pictureAddrIcon) : ''
          if (formData.goToType == 1 && this.picFileList.length > 0) {
            let adAdressObj = {}
            for (let index = 0; index < this.picFileList.length; index++) {
              adAdressObj[index] = this.picFileList[index].response.message
            }
            formData.adAdress = JSON.stringify(adAdressObj)
          } else {
            formData.adAdress = ''
          }

          console.log(formData)
          httpAction(httpurl, formData, method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>

<style lang="less" scoped></style>
