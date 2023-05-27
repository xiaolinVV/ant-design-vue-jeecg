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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="广告位置">
          <!-- <j-dict-select-tag
            v-decorator="['adLocation', validatorRules.adLocation]"
            :triggerChange="true"
            placeholder="请选择广告位置"
            dictCode="ad_location"
          /> -->
          <a-select
            placeholder="请选择广告位置"
            v-decorator="['adLocation', validatorRules.adLocation]"
            :triggerChange="true"
          >
            <a-select-option value="">请选择</a-select-option>
            <a-select-option v-for="(item, key) in adLocationOptions" :key="key" :value="item.value">
              <span style="display: inline-block;width: 100%" :title="item.text || item.label">
                {{ item.text }}
              </span>
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="图片上传">
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :action="uploadAction"
            :data="{ isup: 1 }"
            :headers="headers"
            :beforeUpload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="picUrl" :src="getAvatarView()" alt="头像" style="height:104px;max-width:300px" />
            <div v-else>
              <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
          <!--<a-input placeholder="请输入图片地址"  v-decorator="['pictureAddr', {}]" >{{ pictureAddr }}</a-input>-->
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="跳转类型"
          ><!--；0：无；1：商品详情-->
          <div>
            <!-- //0：无；1：商品详情-->
            <a-radio-group v-decorator="['goToType', validatorRules.goToType]" @change="chooseMedicineGoToType">
              <a-radio value="0">
                无
              </a-radio>
              <a-radio value="1">
                商品详情
              </a-radio>
              <a-radio value="2">
                详情图
              </a-radio>
              <a-radio value="4">
                封坛礼包
              </a-radio>
            </a-radio-group>
          </div>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="店铺商品" v-if="goToType == 1"
          ><!--如果广告类型为0代表平台商品id，如果为1代表店铺商品的id-->
          <!--<a-input placeholder="请输入如果广告类型为0代表平台商品id，如果为1代表店铺商品的id" v-decorator="['goodListId', {}]" />-->
          <a-select
            @change="changeGoodListId"
            v-decorator="['goodListId', validatorRules.goodListId]"
            placeholder="请选择"
          >
            <a-select-option v-for="item in goodlist" :value="item.id">{{ item.goodName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="goToType == 2"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          validate-status="validating"
          help="请上传广告详情图图片，宽度800，高度不限，支持jpg、jpeg、png格式，大小不超过5M"
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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态"
          ><!--0：停用；1：启用-->
          <a-select v-decorator="['status', validatorRules.status]" placeholder="请选择">
            <a-select-option value="0">停用</a-select-option>
            <a-select-option value="1">启用</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { disabledAuthFilter } from '@/utils/authFilter'
import pick from 'lodash.pick'
import moment from 'moment'
import Vue from 'vue'
import { getAction } from '@/api/manage'
import { duplicateCheck } from '@/api/api'
import { mapGetters } from 'vuex'
import { filterDictText, initDictOptions } from '@/components/dict/JDictSelectUtil'
export default {
  name: 'MarketingAdvertisingModal',
  data() {
    return {
      title: '操作',
      visible: false,
      goToType: 0,
      goodlist: [],
      adType: '',
      adLocationOptions: [],

      model: {},
      headers: {},
      aa: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      //图片上传配置
      picFileList: [],
      picPreviewImage: [],
      picPreviewVisible: false,
      picFilePic: true,
      confirmLoading: false,
      form: this.$form.createForm(this),
      uploadLoading: false,
      picUrl: '',
      sysUserId: '',
      delFlag: '',
      validatorRules: {
        title: { rules: [{ required: true, message: '请输入标题!' }] },
        adLocation: { rules: [{ required: true, message: '请选择' }] },
        goToType: { rules: [{ required: true, message: '请选择' }] },
        goodListId: { rules: [{ required: true, message: '请选择' }] },
        sort: { rules: [{ required: true, pattern: /^\d+$/, message: '只能输入数字' }] },
        startTime: { rules: [{ required: true, message: '请选择' }] },
        endTime: { rules: [{ required: true, message: '请选择' }] },
        status: { rules: [{ required: true, message: '请选择状态!' }] }
      },
      url: {
        add: '/marketingAdvertising/marketingAdvertising/add',
        edit: '/marketingAdvertising/marketingAdvertising/edit',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        goodListOk: '/marketingAdvertising/marketingAdvertising/goodListOk'
      }
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    initDictOptions('ad_location').then(res => {
      if (res.success) {
        this.adLocationOptions = res.result.filter(item => item.value != 1 && item.value != 2)
      }
    })
  },
  computed: {
    uploadAction: function() {
      return this.url.fileUpload
    }
  },
  methods: {
    //图片上传
    normFile(e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    beforeUpload: function(file) {
      var fileType = file.type
      if (fileType.indexOf('image') < 0) {
        this.$message.warning('请上传图片')
        return false
      }
      //TODO 验证文件大小
    },
    handleChange(info) {
      this.picUrl = ''
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        this.uploadLoading = false
        console.log(response)
        if (response.success) {
          //this.model.avatar = response.message;
          this.model.pictureAddr = response.message
          console.log('this.pictureAddr:', this.pictureAddr)
          this.picUrl = 'Has no pic url yet'
        } else {
          this.$message.warning(response.message)
        }
      }
    },
    getAvatarView() {
      console.log(this.url.imgerver + '/' + this.model.pictureAddr)
      return this.url.imgerver + '/' + this.model.pictureAddr
    },
    ...mapGetters(['nickname', 'pictureAddr', 'userInfo']),
    /*图片上传结束*/
    add() {
      this.edit({})
    },
    edit(record) {
      this.goodlist = []
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.goToType = this.model.goToType
      this.model.adType = '1'
      if (this.model.delFlag == '' || this.model.delFlag == undefined) {
        this.model.delFlag = 0
      }
      if (record.pictureDetails) {
        this.picFileList = [
          {
            url: this.url.imgerver + '/' + record.pictureDetails,
            uid: 1,
            response: {
              message: record.pictureDetails
            }
          }
        ]
      }
      if (this.model.adType != null || this.model.adType != undefined) {
        //查询添加商品列表
        //this.goodlist=[];
        getAction(this.url.goodListOk, { adType: this.model.adType }).then(res => {
          if (res.success) {
            console.log('res.result.goodlist===', res.result.goodlist)
            this.goodlist = res.result.goodlist
            // this.dataSource2 = res.result.listGoodList;
          }
        })
      }
      this.model.sysUserId = this.userInfo().id
      console.log('this.model.sysUserId===', this.model.sysUserId)
      //预览显示图片
      if (record.hasOwnProperty('id')) {
        this.picUrl = 'Has no pic url yet'
      }

      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'year',
            'month',
            'day',
            'sysUserId',
            'title',
            'adType',
            'adLocation',
            'pictureAddr',
            'goToType',
            'goodListId',
            'sort',
            'status',
            'delFlag'
          )
        )
        //时间格式化
        this.form.setFieldsValue({})
        this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
        this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
        console.log('record', record)
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
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
          // formData.sysUserId=this.sysUserId;//保存店铺Id
          //时间格式化
          formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null
          if (formData.goToType == 2 && this.picFileList.length > 0) {
            formData.pictureDetails = this.picFileList[0].response.message
          } else {
            formData.pictureDetails = ''
          }
          console.log(formData)
          httpAction(httpurl, formData, method)
            .then(res => {
              console.log(formData)
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

    //跳转类型
    chooseMedicineGoToType: function(value) {
      console.log('goToType---' + value)
      let that = this
      this.goToType = false
      this.goToType = value.target.value
      this.picFileList = []
      if (value.target.value == 1) {
        if (this.adType != null || this.adType != undefined) {
          getAction(this.url.goodListOk, { adType: this.adType }).then(res => {
            if (res.success) {
              console.log('res.result.goodlist===', res.result.goodlist)
              this.goodlist = res.result.goodlist
              // this.dataSource2 = res.result.listGoodList;
            }
          })
        }
      }
    },
    changeGoodListId: function(value) {
      console.log(value)
      value = ''
    },
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
      if (
        fileList[0].size / 1024 / 1024 < 5 &&
        (fileList[0].type === 'image/jpeg' || fileList[0].type === 'image/png' || fileList[0].type === 'image/jpg')
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
    }
  }
}
</script>

<style lang="less" scoped></style>
