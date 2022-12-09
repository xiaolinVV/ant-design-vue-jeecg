<template>
  <div>
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
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="专区分类名">
            <a-input placeholder="请输入专区分类名" v-decorator="['typeName', validatorRules.typeName]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级分类" v-if="model.parentTypeName">
            <a-input v-decorator="['parentTypeName', {}]" :disabled="true" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
            <a-input-number placeholder="请输入排序" v-decorator="['sort', validatorRules.sort]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            validate-status="validating"
            help="请上传分类图片，支持jpg,jpeg,png等形式，大小不超过500k"
            :colon="false"
          >
            <div slot="label">
              <span class="dataCheckedStar">
                *
              </span>
              <span style="margin-right: 10px">
                图标:
              </span>
            </div>
            <a-upload
              :action="uploadAction"
              :headers="headers"
              :fileList="frontCoverFileList"
              :beforeUpload="frontCoverBeforeUpload"
              list-type="picture-card"
              @preview="frontCoverPreview"
              @change="frontCoverChange"
            >
              <div v-if="frontCoverFileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  上传
                </div>
              </div>
            </a-upload>
            <a-modal :visible="frontCoverPreviewVisible" :footer="null" @cancel="frontCoverCancel">
              <img alt="example" style="width: 100%" :src="frontCoverPreviewImage" />
            </a-modal>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <!--停用弹出-->
    <a-modal title="停用" v-model="visibleStopStatus" @ok="hideModalStopStatus()" okText="确认" cancelText="取消">
      <input style="display: none" :value="model.marketingPrefectureId" placeholder="id" />
      <h3>停用专区分类后，在专区中将不展示该专区分类</h3>
      <p>您确定要停用吗？</p>
      <a-textarea placeholder="停用原因" v-model="closeExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
    </a-modal>
  </div>
</template>

<script>
import { httpAction, getAction, postAction, putAction } from '@/api/manage'
import pick from 'lodash.pick'
import Vue from 'vue'
import moment from 'moment'

export default {
  name: 'MarketingPrefectureTypeModal',
  data() {
    return {
      title: '操作',
      visible: false,
      visibleStopStatus: false, //停用弹窗
      closeExplain: '', //停用说明
      headers: '',
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
      model: {
        pid: '',
        marketingPrefectureId: '',
        parentTypeName: '',
        sort: '',
        typeName: ''
      },
      //图标配置
      frontCoverFileList: [],
      frontCoverPic: true,
      frontCoverPreviewImage: '',
      frontCoverPreviewVisible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      form: '',
      validatorRules: {
        typeName: { rules: [{ required: true, message: '请输入专区分类名!' }] },
        sort: { rules: [{ required: true, message: '请输入排序!' }] }
      },
      url: {
        // add: "/marketingPrefectureType/marketingPrefectureType/add",
        edit: '/marketingPrefectureType/marketingPrefectureType/edit',
        add: 'marketingPrefectureType/marketingPrefectureType/setMarketingPrefectureType',
        // updateStatus:"/marketingPrefectureType/marketingPrefectureType/updateStatus",
        updateStatus: 'marketingPrefectureType/marketingPrefectureType/setMarketingPrefectureType'
      },
      //配置
      configure: {
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
      }
    }
  },
  created() {
    this.form = this.$form.createForm(this)
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
  },
  methods: {
    //封面图
    frontCoverCancel() {
      this.frontCoverPreviewVisible = false
    },
    async frontCoverPreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.frontCoverPreviewImage = file.url || file.preview
      this.frontCoverPreviewVisible = true
    },
    frontCoverChange({ fileList }) {
      if (this.frontCoverPic) {
        this.frontCoverFileList = fileList
      }
    },
    frontCoverBeforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 0.5
      if (!isJpgOrPng) {
        this.$message.error('图片必须为jpeg，png,jpg格式!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在500k以内!')
      }
      this.frontCoverPic = isLt2M && isJpgOrPng
      return isLt2M && isJpgOrPng
    },
    add(marketingPrefectureId) {
      this.model.marketingPrefectureId = marketingPrefectureId
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      if (record.title) {
        this.title = record.title
      }
      if (record.id) {
        this.model = Object.assign({}, this.model, record)
        // if(record.level > 1){
        //   this.model.parentTypeName = record.parentTypeName
        // }else{
        //   this.model.parentTypeName = record.typeName
        // }

        if (record.title == '添加子分类') {
          this.model.pid = record.id
          this.frontCoverFileList = []
          this.model.sort = ''
          this.model.typeName = ''
        } else {
          this.previewImage(record.logoAddr, 'frontCoverFileList')
          // this.model.pid = ''
        }
      } else {
        this.model = {
          pid: '',
          marketingPrefectureId: this.model.marketingPrefectureId,
          parentTypeName: '',
          sort: '',
          typeName: ''
        }
        this.frontCoverFileList = []
      }
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(this.model)
        console.log(this.model)
        //时间格式化
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      if (this.frontCoverFileList && this.frontCoverFileList.length <= 0) {
        this.$message.warn('请上传logo！')
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          this.submitImage('frontCoverFileList', 'logoAddr')
          let formData = Object.assign(this.model, values)
          if (!this.model.id || this.title == '添加子分类') {
            httpurl += this.url.add
            method = 'post'
            formData = {
              typeName: formData.typeName,
              sort: formData.sort,
              marketingPrefectureId: this.model.marketingPrefectureId || '',
              status: formData.status || '',
              closeExplain: formData.closeExplain || '',
              pid: formData.pid || '',
              logoAddr: this.model.logoAddr
            }
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
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
    //停用弹窗
    showModalStopStatus(id) {
      this.model.marketingPrefectureId = id
      this.visibleStopStatus = true
      this.closeExplain = ''
    },
    //停用
    hideModalStopStatus() {
      this.visibleStopStatus = false
      var that = this
      putAction(that.url.edit, {
        id: this.model.marketingPrefectureId,
        closeExplain: this.closeExplain,
        status: '0'
      }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.$emit('ok') //发送父级主键刷新
        } else {
          that.$message.success('修改失败')
        }
      })
    },
    //返显图片事件封装
    previewImage(imageLists, thisImageName) {
      let that = this
      if (imageLists && imageLists != '{}') {
        let image = Object.values(JSON.parse(imageLists))
        let sz = []
        for (let a = 0; a < image.length; a++) {
          let obj = {
            uid: a,
            url: that.configure.imgErver + '/' + image[a],
            response: {
              message: image[a]
            }
          }
          sz.push(obj)
        }
        that[thisImageName] = sz
      }
    },
    //提交图片事件封装
    submitImage(thisImageName, allDataImageName) {
      let list = {},
        that = this
      for (let count = 0; count < that[thisImageName].length; count++) {
        list[count] = that[thisImageName][count].response.message
      }
      that.model[allDataImageName] = JSON.stringify(list)
    }
  }
}
</script>

<style lang="less" scoped></style>
