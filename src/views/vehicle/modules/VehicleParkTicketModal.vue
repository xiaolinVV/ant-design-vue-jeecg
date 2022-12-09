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
        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="停车券编号">
          <a-input placeholder="请输入停车券编号" v-decorator="['serialNumber', {}]" />
        </a-form-item> -->
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="券名称">
          <a-input placeholder="请输入券名称" v-decorator="validatorRules.ticketName" />
        </a-form-item>

        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          help="尺寸800*800 ，支持jpg、jpeg、png格式，大小不超过2M"
          validate-status="error"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            主图
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

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="优惠">
          <div style="display:flex;align-items:center">
            <a-input-number
              v-decorator="validatorRules.preferentialTime"
              placeholder="请输入优惠时长"
              :min="0"
              :precision="2"
              style="margin-right:8px;width:200px"
            />
            <a-select v-model="model.timeType" style="width:100px">
              <a-select-option :value="0">时</a-select-option>
              <a-select-option :value="1">分</a-select-option>
            </a-select>
          </div>
        </a-form-item>
        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="时间类型；0：时；1：分">
          <a-input placeholder="请输入时间类型；0：时；1：分" v-decorator="['timeType', {}]" />
        </a-form-item> -->
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="有效期">
          <div style="display:flex;align-items:center">
            <a-input-number
              :min="0"
              :precision="0"
              v-decorator="validatorRules.effectiveDays"
              style="margin-right:2px;width:200px"
            />
            天有效（含当日）
          </div>
        </a-form-item>
        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态；0：停用；1：启用">
          <a-input placeholder="请输入状态；0：停用；1：启用" v-decorator="['status', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态说明">
          <a-input placeholder="请输入状态说明" v-decorator="['statusExplain', {}]" />
        </a-form-item> -->
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
  name: 'VehicleParkTicketModal',
  data() {
    return {
      title: '操作',
      headers: '',
      visible: false,
      model: {
        timeType: 0
      },
      //分享图配置
      diagramFileList: [],
      diagramPreviewVisible: false,
      diagramPreviewImage: '',
      diagramFilePic: true,
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
        ticketName: ['ticketName', { rules: [{ required: true, message: '请输入券名称!' }] }],
        preferentialTime: ['preferentialTime', { rules: [{ required: true, message: '请输入优惠时长!' }] }],
        effectiveDays: ['effectiveDays', { rules: [{ required: true, message: '请输入有效期!' }] }]
      },
      url: {
        add: '/vehicle/vehicleParkTicket/add',
        edit: '/vehicle/vehicleParkTicket/edit'
      },
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
  },
  methods: {
    uploadAction() {
      return this.configure.fileUpload
    },
    //主图
    diagramFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.diagramFilePic = isLt2M
      return isLt2M
    },
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
      this.model = {
        timeType: 0
      }
      this.form.resetFields()
      if (record && record.id) {
        try {
          if (record.mainPicture) {
            let mainPictures = Object.values(JSON.parse(record.mainPicture))
            let mainPicturesSz = []
            //分享图返显
            for (let a = 0; a < mainPictures.length; a++) {
              let obj = {
                uid: a,
                url: this.configure.imgErver + '/' + mainPictures[a],
                response: {
                  message: mainPictures[a]
                }
              }
              mainPicturesSz.push(obj)
            }
            this.diagramFileList = mainPicturesSz
          }
        } catch (e) {
          console.error('解析图出错', e)
        }
      } else {
        this.diagramFileList = []
      }
      this.model = Object.assign({}, this.model, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'serialNumber',
            'ticketName',
            'mainPicture',
            'preferentialTime',
            'timeType',
            'effectiveDays',
            'status'
          )
        )
        //时间格式化
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      if (!Array.isArray(this.diagramFileList) || this.diagramFileList.length <= 0) {
        this.$message.warn('请上传主图！')
        return false
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
          let mainPicture = {}
          for (let count = 0; count < this.diagramFileList.length; count++) {
            mainPicture[count] = this.diagramFileList[count].response.message
          }
          formData.mainPicture = this.diagramFileList.length > 0 ? JSON.stringify(mainPicture) : ''
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
