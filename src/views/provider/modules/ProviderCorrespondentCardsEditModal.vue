<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-form :form="form">
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="银行卡绑定手机号">
        <a-input-number style="width: 100%;" :precision='0' v-decorator="[ 'phone', validatorRules.phone]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="收款人">
        <a-input v-decorator="[ 'cardholder', validatorRules.cardholder]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="开户行">
        <a-input v-decorator="[ 'bankName', validatorRules.bankName]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="银行卡号">
        <a-input style="width: 100%;" :precision='0' v-decorator="[ 'bankCard', validatorRules.bankCard]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="变更说明"

      >
        <a-textarea v-decorator="[ 'updateExplain', validatorRules.updateExplain]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
         <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          变更凭证
        </span>
        <!--        updateCertificate-->
        <a-upload
          :action="uploadAction"
          :beforeUpload="mainPictureUpload"
          :fileList="mainPictureFileList"
          :headers="headers"
          @change="mainPictureHandleChange"
          @preview="mainPictureHandlePreview"
          listType="picture-card"
        >
          <div v-if="mainPictureFileList.length < 1">
            <a-icon type="plus"/>
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="mainPicturePreviewVisible" @cancel="mainPictureHandleCancel">
          <img :src="mainPicturePreviewImage" alt="example" style="width: 100%"/>
        </a-modal>
        <div>
          支持jpg、jpeg、png格式，大小不超过500k
        </div>
      </a-form-item>
    </a-form>

  </a-modal>
</template>

<script>
  import { httpAction, getAction, postAction } from '@/api/manage'
  import Vue from 'vue'
  import ATextarea from 'ant-design-vue/es/input/TextArea'

  export default {
    name: 'ProviderCorrespondentCardsEditModal',
    components: { ATextarea },
    created() {
      const token = Vue.ls.get('Access-Token')
      this.headers = { 'X-Access-Token': token }
    },
    data() {
      return {
        title: '编辑分类',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        model: {},
        headers: '',
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        validatorRules: {
          phone: {
            rules: [{
              required: true, message: '请输入手机号!'
            }, {
              required: true,
              pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
              message: '请输入正确的手机号码！'
            }]
          },
          cardholder: {
            rules: [
              {
                required: true, message: '请输入收款人!'
              }
            ]
          },
          bankName: {
            rules: [
              {
                required: true, message: '请输入开户行名称!'
              }
            ]
          },
          bankCard: {
            rules: [
              {
                required: true, message: '请输入银行卡号!'
              },
              {
                required: true,
                pattern: /^([1-9]{1})(\d{14}|\d{18})$/,
                message: '请输入正确的银行卡号！'
              }
            ]
          },
          updateExplain: {
            rules: [
              {
                required: true, message: '请输入变更说明!'
              }
            ]
          }
        },
        uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
        //变更说明 配置
        mainPictureFileList: [],
        mainPicturePreviewVisible: false,
        mainPicturePreviewImage: '',
        mainPicturePic: true,
        url: {
          edit: 'providerBankCard/providerBankCard/edit'
        },
        //配置
        configure: {
          imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
        }
      }
    },
    methods: {
      mainPictureUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 0.5
        if (!isLt2M) {
          this.$message.error('图片大小必须在500k以内!')
        }
        this.mainPicturePic = isLt2M
        return isLt2M
      },
      mainPictureHandleChange({ fileList }) {
        this.mainPictureFileList = fileList
      },
      mainPictureHandlePreview(file) {
        this.mainPicturePreviewImage = file.url || file.thumbUrl
        this.mainPicturePreviewVisible = true
      },
      mainPictureHandleCancel() {
        this.mainPicturePreviewVisible = false
      },
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!this.mainPictureFileList || this.mainPictureFileList.length <= 0) {
            this.$message.warn('请上传变更说明！')
            return
          }
          if (!err) {
            that.confirmLoading = true
            let httpurl = this.url.edit
            let method = 'post'
            // if (!this.model.id) {
            //   httpurl += this.url.add;
            //   // method = 'post';
            // } else {
            //   httpurl += this.url.edit;
            //   // method = 'put';
            // }
            let formData = Object.assign(this.model, values)
            let mainPictureFileList = {}
            for (let count = 0; count < this.mainPictureFileList.length; count++) {
              mainPictureFileList[count] = this.mainPictureFileList[count].response.message
            }
            formData.updateCertificate = this.mainPictureFileList.length > 0 ? JSON.stringify(mainPictureFileList) : ''
            console.log(formData)
            // /^[1][3,4,5,7,8][0-9]{9}$/
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
              that.close()
            })
          }
        })
      },
      handleCancel() {
        this.visible = false
        this.mainPictureFileList = []
        this.$nextTick(() => {
          this.form.resetFields()
        })
        this.$emit('close')
      },
      close() {
        this.handleCancel()
      },
      add() {
        this.edit({})
      },
      edit(record) {
        if (record.updateCertificate) {
          let mainPicture = Object.values(JSON.parse(record.updateCertificate))
          let mainPicturesSz = []
          //主图返显
          for (let a = 0; a < mainPicture.length; a++) {
            let obj = {
              uid: a,
              url: this.configure.imgErver + '/' + mainPicture[a],
              response: {
                message: mainPicture[a]
              }
            }
            mainPicturesSz.push(obj)
          }
          this.mainPictureFileList = mainPicturesSz
        }
        this.visible = true
        this.model = Object.assign({}, this.model, record)
        this.$nextTick(() => {
          this.form.setFieldsValue(this.model)
        })
      }
    }
  }
</script>

<style scoped>

</style>