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
          <a-input placeholder="请输入广告标题" v-decorator="validatorRules.advertisingTitle" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          validate-status="validating"
          help=" 请上传分类图片，支持jpg、jpeg、png格式，大小不超过500k"
          :colon="false"
        >
          <div slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            <span style="margin-right: 10px">
              图片:
            </span>
          </div>
          <!--          <a-input placeholder="请输入图片" v-decorator="['image', {}]"/>-->
          <div class="clearfix">
            <a-upload
              :action="uploadAction"
              :beforeUpload="giftDealsUpload"
              :fileList="giftDealsFileList"
              :headers="headers"
              @change="giftDealsHandleChange"
              @preview="giftDealsHandlePreview"
              listType="picture-card"
            >
              <div v-if="giftDealsFileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :footer="null" :visible="giftDealsPreviewVisible" @cancel="giftDealsHandleCancel">
              <img :src="giftDealsPreviewImage" alt="example" style="width: 100%" />
            </a-modal>
          </div>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="跳转类型">
          <a-select v-decorator="validatorRules.jumpType" laceholder="请选择跳转类型" @change="chooseMedicineGoToType">
            <a-select-option value="0">
              无
            </a-select-option>
            <a-select-option value="1">
              商品
            </a-select-option>
            <a-select-option value="2">
              大图
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="地址" v-if="goToType == 1">
          <a-input placeholder="请输入地址" v-decorator="validatorRules.address" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          validate-status="validating"
          help=" 请上传分类图片，支持jpg、jpeg、png格式，大小不超过500k"
          :colon="false"
          v-else-if="goToType == 2"
        >
          <div slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            <span style="margin-right: 10px">
              地址:
            </span>
          </div>
          <!--          <a-input placeholder="请输入图片" v-decorator="['image', {}]"/>-->
          <div class="clearfix">
            <a-upload
              :action="uploadAction"
              :beforeUpload="pictureDetailsUpload"
              :fileList="pictureDetailsFileList"
              :headers="headers"
              @change="pictureDetailsHandleChange"
              @preview="pictureDetailsHandlePreview"
              listType="picture-card"
            >
              <div v-if="pictureDetailsFileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :footer="null" :visible="pictureDetailsPreviewVisible" @cancel="pictureDetailsHandleCancel">
              <img :src="pictureDetailsPreviewImage" alt="example" style="width: 100%" />
            </a-modal>
          </div>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input-number v-decorator="validatorRules.sort" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开始时间">
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="validatorRules.startTime" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结束时间">
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="validatorRules.endTime" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import dayjs from 'dayjs'
import Vue from 'vue'
export default {
  name: 'MarketingGroupAdvertisingModal',
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      goToType: '0',
      confirmLoading: false,
      form: this.$form.createForm(this),
      //详情图 配置
      giftDealsFileList: [],
      giftDealsPreviewVisible: false,
      giftDealsPreviewImage: '',
      giftDealsPic: true,
      //地址图片 配置
      pictureDetailsFileList: [],
      pictureDetailsPreviewVisible: false,
      pictureDetailsPreviewImage: '',
      pictureDetailsPic: true,
      validatorRules: {
        advertisingTitle: ['advertisingTitle', { rules: [{ required: true, message: '请输入广告标题!' }] }],
        jumpType: ['jumpType', { rules: [{ required: true, message: '请选择跳转类型!' }] }],
        address: ['address', { rules: [{ required: true, message: '请输入地址!' }] }],
        sort: ['sort', { rules: [{ required: true, message: '请输入排序!' }] }],
        startTime: ['startTime', { rules: [{ required: true, message: '请选择开始时间!' }] }],
        endTime: ['endTime', { rules: [{ required: true, message: '请选择结束时间!' }] }]
      },
      headers: '',
      url: {
        add: '/marketing/marketingFreeAdvertising/add',
        edit: '/marketing/marketingFreeAdvertising/edit'
      },
      //配置
      configure: {
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
      }
    }
  },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
  },
  computed: {
    uploadAction() {
      return this.configure.fileUpload
    }
  },
  methods: {
    add() {
      this.edit({})
    },
    //跳转类型
    chooseMedicineGoToType(value) {
      this.goToType = value
      // this.picFileList = [];
      // this.form.setFieldsValue({goodListId:''})
    },
    edit(record) {
      this.form.resetFields()
      if (record.image) {
        let giftDeals = Object.values(JSON.parse(record.image))
        let giftDealsSz = []
        //详情图返显
        for (let a = 0; a < giftDeals.length; a++) {
          let obj = {
            uid: a,
            url: this.configure.imgErver + '/' + giftDeals[a],
            response: {
              message: giftDeals[a]
            }
          }
          giftDealsSz.push(obj)
        }
        this.giftDealsFileList = giftDealsSz
      } else {
        this.giftDealsFileList = []
      }

      if (record.address && record.jumpType == 2) {
        let pictureDetails = Object.values(JSON.parse(record.address))
        let pictureDetailsSz = []
        //大图返显
        for (let a = 0; a < pictureDetails.length; a++) {
          let obj = {
            uid: a,
            url: this.configure.imgErver + '/' + pictureDetails[a],
            response: {
              message: pictureDetails[a]
            }
          }
          pictureDetailsSz.push(obj)
        }
        this.pictureDetailsFileList = pictureDetailsSz
      } else {
        this.pictureDetailsFileList = []
      }
      this.chooseMedicineGoToType(record.jumpType)
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'advertisingTitle', 'image', 'jumpType', 'address', 'sort'))
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
      if (!this.giftDealsFileList || this.giftDealsFileList.length <= 0) {
        this.$message.warn('请上传图片')
        return
      }
      if (this.goToType == 2 && (!this.pictureDetailsFileList || this.pictureDetailsFileList.length <= 0)) {
        this.$message.warn('请上传大图')
        return
      }
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
            values.status = 1
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          let formData = Object.assign(this.model, values)
          //时间格式化
          formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null
          let giftDealsFileList = {}
          for (let count = 0; count < this.giftDealsFileList.length; count++) {
            giftDealsFileList[count] = this.giftDealsFileList[count].response.message
          }
          let pictureDetailsFileList = {}
          for (let count = 0; count < this.pictureDetailsFileList.length; count++) {
            pictureDetailsFileList[count] = this.pictureDetailsFileList[count].response.message
          }
          if (this.goToType == 2) {
            formData.address = JSON.stringify(pictureDetailsFileList)
          }
          formData.image = JSON.stringify(giftDealsFileList)
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
    },
    giftDealsUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 0.5
      if (!isLt2M) {
        this.$message.error('图片大小必须在500k以内!')
      }
      this.giftDealsPic = isLt2M
      return isLt2M
    },
    //上传详情图
    giftDealsHandleCancel() {
      this.giftDealsPreviewVisible = false
    },
    giftDealsHandlePreview(file) {
      this.giftDealsPreviewImage = file.url || file.thumbUrl
      this.giftDealsPreviewVisible = true
    },
    giftDealsHandleChange({ fileList }) {
      this.giftDealsFileList = fileList
    },

    pictureDetailsUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 0.5
      if (!isLt2M) {
        this.$message.error('图片大小必须在500k以内!')
      }
      this.pictureDetailsPic = isLt2M
      return isLt2M
    },
    //上传详情图
    pictureDetailsHandleCancel() {
      this.pictureDetailsPreviewVisible = false
    },
    pictureDetailsHandlePreview(file) {
      this.pictureDetailsPreviewImage = file.url || file.thumbUrl
      this.pictureDetailsPreviewVisible = true
    },
    pictureDetailsHandleChange({ fileList }) {
      this.pictureDetailsFileList = fileList
    }
  }
}
</script>

<style lang="less" scoped></style>
