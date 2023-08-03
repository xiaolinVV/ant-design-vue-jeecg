<template>
  <a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk"
    @cancel="handleCancel" cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="头像">
          <!-- <a-input placeholder="请输入头像绝对地址" v-decorator="['head_portrait', {}]" /> -->
          <a-upload :action="uploadAction" listType="picture-card" :fileList="mainPictureFileList"
            @preview="mainPictureHandlePreview" @change="mainPictureHandleChange" :headers="headers"
            :beforeUpload="mainPictureUpload">
            <div v-if="mainPictureFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="会员账号">
          <a-input placeholder="会员账号" v-decorator="['phone', validatorRules.phone]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="会员昵称">
          <a-input placeholder="请输入会员昵称" v-decorator="['nick_name', validatorRules.nick_name]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系人">
          <a-input placeholder="请输入联系人" v-decorator="['linkman', validatorRules.linkman]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系电话">
          <a-input placeholder="请输入联系电话" v-decorator="['contact_number', validatorRules.contact_number]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from "moment"
import Vue from 'vue'
export default {
  name: "MarketingActivityListRecordModal",
  data () {
    return {
      title: "操作",
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        phone: { rules: [{ required: true, message: '请输入会员账号' }], },
        nick_name: { rules: [{ required: true, message: '请选择会员昵称' }], },
        linkman: { rules: [{ required: true, message: '请输入联系人' }], },
        contact_number: { rules: [{ required: true, message: '请输入联系电话' }], },
      },
      url: {
        add: "/marketing/marketingActivityListRecord/add",
        edit: "/marketing/marketingActivityListRecord/edit",
      },
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
      configure: {
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
      },
      //头像
      mainPictureFileList: [],
      mainPicturePreviewVisible: false,
      mainPicturePreviewImage: '',
      mainPicturePic: true,
    }
  },
  created () {
  },
  computed: {
    headers () {
      const token = Vue.ls.get('Access-Token')
      return { 'X-Access-Token': token }
    }
  },
  methods: {
    add () {
      this.edit({});
    },
    edit (record) {
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(this.model)
        if (record.head_portrait) {
          this.mainPictureFileList = [{
            uid: '0',
            url: record.head_portrait,
            response: {
              message: record.head_portrait
            }
          }]
        }
        //时间格式化
        // this.form.setFieldsValue({ registrationTime: this.model.registrationTime ? moment(this.model.registrationTime) : null })
      });

    },
    close () {
      this.$emit('close');
      this.visible = false;
    },
    handleOk () {
      const that = this;
      if (this.mainPictureFileList && this.mainPictureFileList.length <= 0) {
        this.$message.warn('请上传头像！')
        return;
      }
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let httpurl = '';
          let method = '';
          if (!this.model.id) {
            httpurl += this.url.add;
            method = 'post';
          } else {
            httpurl += this.url.edit;
            method = 'put';
          }
          let formData = Object.assign(this.model, values);
          formData.head_portrait = this.configure.imgErver + '/' + this.mainPictureFileList[0].response.message
          //时间格式化
          // formData.registrationTime = formData.registrationTime ? formData.registrationTime.format('YYYY-MM-DD HH:mm:ss') : null;

          console.log(formData)
          httpAction(httpurl, formData, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.$emit('ok');
            } else {
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
            that.close();
          })



        }
      })
    },
    handleCancel () {
      this.close()
    },

    //上传主图
    mainPictureHandleCancel () {
      this.mainPicturePreviewVisible = false
    },
    mainPictureUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 0.5
      if (!isLt2M) {
        this.$message.error('图片大小必须在500k以内!')
      }
      this.mainPicturePic = isLt2M
      return isLt2M
    },
    mainPictureHandlePreview (file) {
      this.mainPicturePreviewImage = file.url || file.thumbUrl
      this.mainPicturePreviewVisible = true
    },
    mainPictureHandleChange ({ fileList }) {
      if (this.mainPicturePic) {
        this.mainPictureFileList = fileList
      }
    },


  }
}
</script>

<style lang="less" scoped></style>