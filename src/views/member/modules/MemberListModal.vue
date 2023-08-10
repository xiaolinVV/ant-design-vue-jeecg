<template>
  <a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk"
    @cancel="handleCancel" cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="头像">
          <!-- <a-input placeholder="请输入头像绝对地址" v-decorator="['headPortrait', {}]" /> -->

          <a-upload :action="uploadAction" listType="picture-card" :fileList="mainPictureFileList"
            @preview="mainPictureHandlePreview" @change="mainPictureHandleChange" :headers="headers"
            :beforeUpload="mainPictureUpload">
            <div v-if="mainPictureFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>

        </a-form-item>
        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号"> -->
        <!-- <a-input placeholder="请输入手机号" v-decorator="['phone', {}]" /> -->
        <!-- </a-form-item> -->
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="会员昵称">
          <a-input placeholder="请输入会员昵称" v-decorator="['nickName', validatorRules.nickName]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="性别">
          <j-dict-select-tag type="list" placeholder="请选择性别" v-decorator="['sex', validatorRules.sex]" dictCode="sex" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="地区">
          <a-input placeholder="请输入地区" v-decorator="['areaAddr', validatorRules.areaAddr]" />
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
  name: "MemberListModal",
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
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        // phone: { rules: [{ required: true, message: '请输入手机号' }], },
        nickName: { rules: [{ required: true, message: '请输入昵称' }], },
        sex: { rules: [{ required: true, message: '请选择性别' }], },
        areaAddr: { rules: [{ required: false, message: '请输入地区' }], },
      },
      url: {
        add: "/memberList/memberList/add",
        edit: "/memberList/memberList/edit",
      },
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
      this.model.delFlag = 0;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'year', 'month', 'day', 'delFlag', 'headPortrait', 'phone', 'nickName', 'sex', 'areaAddr', 'memberType', 'welfarePayments', 'balance', 'isOpenStore', 'status'))
        //时间格式化
        this.form.setFieldsValue({ vipTime: this.model.vipTime ? moment(this.model.vipTime) : null })
      });
      // this.previewImage([record.headPortrait], "mainPictureFileList")
      if (record.headPortrait) {
        this.mainPictureFileList = [{
          uid: '0',
          url: record.headPortrait,
          response: {
            message: record.headPortrait
          }
        }]
      }
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
          formData.headPortrait = this.configure.imgErver + '/' + this.mainPictureFileList[0].response.message
          //时间格式化
          formData.vipTime = formData.vipTime ? formData.vipTime.format('YYYY-MM-DD HH:mm:ss') : null;
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