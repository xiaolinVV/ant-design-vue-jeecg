<!--店铺信息页面-->
<template>
  <div>
    <a-form style="max-width: 100%; margin: 40px auto 0;">
      <a-alert
        :closable="true"
        message="重要提示：店铺详情、店铺logo会直接展示给买家，请认真填写。"
        style="margin-bottom: 24px;"
      />
    </a-form>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="店铺编号">
          {{ AllData.id }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户账号">
          {{ AllData.userName }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            门店名称
          </span>
          {{ AllData.storeName }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="分店名称">
          <a-input placeholder="请输入分店名称" v-model="AllData.subStoreName" />
          <div>
            仅支持无销量情况下修改分店名称，请谨慎填写！
          </div>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            logo
          </span>
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :action="uploadAction"
            :data="{ isup: 1 }"
            :headers="headers"
            :beforeUpload="logoBeforeUpload"
            @change="handleChange"
          >
            <img
              v-if="AllData.logoShowAddr"
              :src="AllData.logoShowAddr"
              alt="上传Logo"
              style="height:104px;max-width:300px"
            />
            <div v-else>
              <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
          <div>
            上传与店铺气质吻合的logo，能提高用户进店的概率，支持jpg、jpeg、png格式，大小不超过500k
          </div>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            门面照
          </span>
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :action="uploadAction"
            :data="{ isup: 1 }"
            :headers="headers"
            :beforeUpload="pictureBeforeUpload"
            @change="handleChange1"
          >
            <img
              v-if="AllData.storeShowPicture"
              :src="AllData.storeShowPicture"
              alt="上传门脸照"
              style="height:104px;max-width:300px"
            />
            <div v-else>
              <a-icon :type="uploadActiong ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
          <div>
            需拍全，包含完整的牌匾、门框（建议正对门店2米处拍摄）
          </div>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            客服电话
          </span>
          <a-input placeholder="请输入客服电话" v-model="AllData.takeOutPhone" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            服务距离
          </span>
          <a-input placeholder="请输入服务距离" v-model="AllData.serviceRange" />
          <div>
            请根据自身的服务能力进行设置服务距离，避免因设置过大服务范围导致服务不及时而产生的用户投诉
          </div>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="营业时间">
          <a-input placeholder="" v-model="AllData.businessHoursExplain" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            送福利金
          </span>
          <a-radio-group v-model="AllData.ifViewWelfarePayments">
            <a-radio :value="1">显示</a-radio>
            <a-radio :value="0" style="margin-left: 30px;">不显示</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            店铺会员价
          </span>
          <a-radio-group v-model="AllData.isViewVipPrice">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0" style="margin-left: 30px;">停用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            商家介绍
          </span>
          <JEditor v-model="AllData.introduce"> </JEditor>
        </a-form-item>

        <img
          v-if="AllData.showSmallcodeAddress"
          :src="AllData.showSmallcodeAddress"
          style="height:200px;max-width:500px;position: absolute;right: 50px;top: 50px;z-index: 10;"
        />
        <!--<span v-if="!AllData.showSmallcodeAddress" style="font-size: 12px;font-style: italic;">无此文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="uploadFile(AllData.showSmallcodeAddress)">
            下载
          </a-button>-->
        <a-button type="primary" style="display: block;margin: 0 auto;" @click="keepData">
          保存
        </a-button>
      </a-form>
      <qrCode :qrCodeShow="qrCodeShow" :avatarShow="avatarShow" qrCodeNumber="" buttonText="下载店铺二维码"> </qrCode>
    </a-spin>
  </div>
</template>
<script>
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { getAction, putAction, postAction } from '@/api/manage'
import JEditor from '@/components/jeecg/JEditor'
import AUpload from 'ant-design-vue/es/upload/Upload'
import qrCode from '@/components/qrCode/qrCode'
export default {
  name: 'StoreManageInforMation',
  components: {
    AUpload,
    qrCode,
    JEditor
  },
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      AllData: {
        id: '', //店铺编号
        userName: '', //用户账号
        storeName: '', //门店名称
        subStoreName: '', //分店名称
        logoAddr: '', //logo地址
        logoShowAddr: '', //logo显示地址
        storePicture: '', //门面地址
        storeShowPicture: '', //门面显示地址
        takeOutPhone: '', //客服电话
        serviceRange: '', //服务距离
        showSmallcodeAddress: '', //店铺二维码
        address: '',
        ifViewWelfarePayments: '', //送福利金；0：不显示；1：显示
        isViewVipPrice: '', //店铺会员价；0：停用；1：启用
        businessHoursExplain: '', //营业时间说明
        introduce: ''
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      uploadLoading: false,
      headers: {},
      url: {
        findStore: '/storeManage/storeManage/findStore', //返显接口
        updateStore: '/storeManage/storeManage/updateStore', //保存接口
        add: '/storeManage/storeManage/add',
        edit: '/storeManage/storeManage/edit',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      }
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    let that = this
    getAction(that.url.findStore).then(res => {
      if (res.success) {
        this.AllData = res.result
        let that = this.AllData
        that.isViewVipPrice = that.isViewVipPrice * 1
        that.ifViewWelfarePayments = that.ifViewWelfarePayments * 1
        this.$set(this.AllData, 'logoShowAddr', this.url.imgerver + '/' + res.result.logoAddr)
        this.$set(this.AllData, 'storeShowPicture', this.url.imgerver + '/' + res.result.storePicture)
        this.$set(this.AllData, 'showSmallcodeAddress', this.url.imgerver + '/' + res.result.address)
      }
      console.log(res)
    })
  },
  computed: {
    uploadAction: function() {
      return this.url.fileUpload
    },
    qrCodeShow() {
      return this.url.imgerver + '/' + this.AllData.address
    },
    avatarShow() {
      return ''
    }
  },
  methods: {
    //图片校验
    pictureBeforeUpload(file) {
      const isPic = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isPic) {
        this.$message.error('图片格式仅支持JPG,PNG格式!')
      }
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('图片大小必须在5M以内!')
      }
      return isPic && isLt2M
    },
    //logo校验
    logoBeforeUpload(file) {
      const isPic = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isPic) {
        this.$message.error('图片格式仅支持JPG,PNG格式!')
      }
      const isLt2M = file.size / 1024 / 1024 < 0.5
      if (!isLt2M) {
        this.$message.error('图片大小必须在500k以内!')
      }
      return isPic && isLt2M
    },
    //logo图片
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        let response = info.file.response
        this.uploadLoading = false
        this.AllData.logoAddr = response.message
        this.AllData.logoShowAddr = this.url.imgerver + '/' + response.message
        if (!response.success) {
          this.$message.warning(response.message)
        }
      }
    },
    //门面照
    handleChange1(info) {
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        let response = info.file.response
        this.uploadLoading = false
        this.AllData.storePicture = response.message
        this.AllData.storeShowPicture = this.url.imgerver + '/' + response.message
        if (!response.success) {
          this.$message.warning(response1.message)
        }
      }
    },
    //保存
    keepData() {
      if (!this.checkForm()) {
        return false
      }
      let info = {
        id: this.AllData.id,
        logoAddr: this.AllData.logoAddr,
        serviceRange: this.AllData.serviceRange,
        storePicture: this.AllData.storePicture,
        subStoreName: this.AllData.subStoreName,
        takeOutPhone: this.AllData.takeOutPhone,
        ifViewWelfarePayments: this.AllData.ifViewWelfarePayments,
        isViewVipPrice: this.AllData.isViewVipPrice,
        introduce: this.AllData.introduce
      }
      let that = this
      putAction(that.url.updateStore, that.AllData).then(res => {
        if (res.success) {
          this.$message.success(res.message)
        } else {
          this.$message.warn(res.message)
        }
        console.log(res)
      })
    },
    /* 文件下载 */
    uploadFile(text) {
      if (!text) {
        this.$message.warning('未知的文件')
        return
      }
      if (text.indexOf(',') > 0) {
        text = text.substring(0, text.indexOf(','))
      }
      window.open(text)
    },
    //校验
    checkForm() {
      let data = this.AllData
      if (!data.logoAddr) {
        this.$message.warn('请上传logo图片！')
        return false
      }
      if (!data.storePicture) {
        this.$message.warn('请上传门面照！')
        return false
      }
      if (!data.takeOutPhone) {
        this.$message.warn('请填写客服电话！')
        return false
      }
      if (!data.serviceRange) {
        this.$message.warn('请填写服务距离！')
        return false
      }
      if (!data.introduce) {
        this.$message.warn('请填写商家介绍！')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="less" scoped></style>
