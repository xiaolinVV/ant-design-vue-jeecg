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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="特色标签" v-if="title != '排序'">
          <a-input placeholder="请输入特色标签" v-decorator="['label', validatorRules.label]" />
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          help="尺寸750*375px，支持jpg、jpeg、png格式，大小不超过1M"
          validate-status="error"
          v-if="title != '排序'"
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
        <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否推荐；0：否；1：是">
          <a-input placeholder="请输入是否推荐；0：否；1：是" v-decorator="['isRecommend', {}]" />
        </a-form-item> -->
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input-number
            :min="0"
            :precision="0"
            placeholder="请输入排序"
            v-decorator="['sort', validatorRules.sort]"
            style="width:150px"
          />
        </a-form-item>
        <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态；0：停用；1：启用">
          <a-input placeholder="请输入状态；0：停用；1：启用" v-decorator="['status', {}]" />
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
  name: 'StoreLabelModal',
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

      confirmLoading: false,
      form: this.$form.createForm(this),
      //封面图配置
      surfacePlotFileList: [],
      surfacePlotPreviewVisible: false,
      surfacePlotPreviewImage: '',
      surfacePlotFilePic: true,
      validatorRules: {
        label: {
          rules: [
            {
              required: true,
              message: '请输入特色标签!'
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
        }
      },
      url: {
        add: '/store/storeLabel/add',
        edit: '/store/storeLabel/edit',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
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
      return this.url.fileUpload
    }
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.surfacePlotFileList = []
      this.model = Object.assign({}, record)
      this.visible = true
      let allData = this.model
      this.$nextTick(() => {
        if (record.title) {
          this.title = record.title
        }
        try {
          if (allData.surfacePlot) {
            let surfacePlot = Object.values(JSON.parse(allData.surfacePlot))
            let surfacePlotSz = []
            //封面图返显
            for (let a = 0; a < surfacePlot.length; a++) {
              let obj = {
                uid: a,
                url: this.configure.imgErver + '/' + surfacePlot[a],
                response: {
                  message: surfacePlot[a]
                }
              }
              surfacePlotSz.push(obj)
            }
            this.surfacePlotFileList = surfacePlotSz
          }
        } catch (error) {
          console.warn('封面图解析出错！', error)
        }

        this.form.setFieldsValue(
          pick(this.model, 'year', 'month', 'day', 'delFlag', 'label', 'surfacePlot', 'isRecommend', 'sort', 'status')
        )
        //时间格式化
      })
    },
    //封面图
    surfacePlotFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('图片大小必须在1M以内!')
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
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      if (!Array.isArray(this.surfacePlotFileList) || this.surfacePlotFileList.length <= 0) {
        this.$message.warn('请上传封面图！')
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
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          let formData = Object.assign(this.model, values)
          let surfacePlot = {}
          //时间格式化
          for (let count = 0; count < this.surfacePlotFileList.length; count++) {
            surfacePlot[count] = this.surfacePlotFileList[count].response.message
          }
          formData.surfacePlot = this.surfacePlotFileList.length > 0 ? JSON.stringify(surfacePlot) : ''
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
