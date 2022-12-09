<template>
  <div class="MarketingCouponBaseSetting">
    <div class="title">
      券中心设置
    </div>
    <a-form :form="form" class="wrap">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="券中心别名">
        <a-input placeholder="请输入活动别名,字数不能超过4个字" v-decorator="rules.name"> </a-input>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="推荐限时抢券">
        <a-input-number
          :min="0"
          :precision="0"
          placeholder="请输入推荐限时抢券"
          style="width: 200px;"
          v-decorator="rules.recommendSeckillNumber"
        >
        </a-input-number>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="推荐拼好券">
        <a-input-number
          :min="0"
          :precision="0"
          placeholder="请输入推荐拼好券"
          style="width: 200px;"
          v-decorator="rules.recommendGroupNumber"
        >
        </a-input-number>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="推荐超值券">
        <a-input-number
          :min="0"
          :precision="0"
          placeholder="请输入推荐超值券"
          style="width: 200px;"
          v-decorator="rules.recommendCertificateNumber"
        >
        </a-input-number>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="客户端显示">
        <a-radio-group v-decorator="rules.clientSideShow">
          <a-radio :value="0">
            全部
          </a-radio>
          <a-radio :value="1">
            仅小程序
          </a-radio>
          <a-radio :value="2">
            仅app
          </a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        help="支持jpg、jpeg、png、gif格式，大小不超过2M"
        validate-status="error"
      >
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          券中心图标
        </span>
        <a-upload
          :action="uploadAction"
          :beforeUpload="ticketIconFileUpload"
          :fileList="ticketIconFileList"
          :headers="headers"
          @change="ticketIconHandleChange"
          @preview="ticketIconHandlePreview"
          listType="picture-card"
        >
          <div v-if="ticketIconFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="ticketIconPreviewVisible" @cancel="ticketIconHandleCancel">
          <img :src="ticketIconPreviewImage" alt="example" style="width: 100%" />
        </a-modal>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        help="支持jpg、jpeg、png、gif格式，大小不超过2M"
        validate-status="error"
      >
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          券中心封面
        </span>
        <a-upload
          :action="uploadAction"
          :beforeUpload="ticketSurfacePlotFileUpload"
          :fileList="ticketSurfacePlotFileList"
          :headers="headers"
          @change="ticketSurfacePlotHandleChange"
          @preview="ticketSurfacePlotHandlePreview"
          listType="picture-card"
        >
          <div v-if="ticketSurfacePlotFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="ticketSurfacePlotPreviewVisible" @cancel="ticketSurfacePlotHandleCancel">
          <img :src="ticketSurfacePlotPreviewImage" alt="example" style="width: 100%" />
        </a-modal>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        help="支持jpg、jpeg、png、gif格式，大小不超过2M"
        validate-status="error"
      >
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          券中心广告图
        </span>
        <a-upload
          :action="uploadAction"
          :beforeUpload="ticketAdvertisementBannerFileUpload"
          :fileList="ticketAdvertisementBannerFileList"
          :headers="headers"
          @change="ticketAdvertisementBannerHandleChange"
          @preview="ticketAdvertisementBannerHandlePreview"
          listType="picture-card"
        >
          <div v-if="ticketAdvertisementBannerFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal
          :footer="null"
          :visible="ticketAdvertisementBannerPreviewVisible"
          @cancel="ticketAdvertisementBannerHandleCancel"
        >
          <img :src="ticketAdvertisementBannerPreviewImage" alt="example" style="width: 100%" />
        </a-modal>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        help="尺寸800*640 ，支持jpg、jpeg、png格式，大小不超过2M"
        validate-status="error"
      >
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          默认分享图
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

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        help="尺寸1428*2540，支持jpg、jpeg、png格式，大小不超过2M。必须预留好二维码位置。以免影响展示效果。"
        validate-status="error"
      >
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          默认海报图
        </span>
        <a-upload
          :action="uploadAction"
          :beforeUpload="coverPlanFileUpload"
          :fileList="coverPlanFileList"
          :headers="headers"
          @change="coverPlanHandleChange"
          @preview="coverPlanHandlePreview"
          listType="picture-card"
        >
          <div v-if="coverPlanFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="coverPlanPreviewVisible" @cancel="coverPlanHandleCancel">
          <img :src="coverPlanPreviewImage" alt="example" style="width: 100%" />
        </a-modal>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="是否开启">
        <a-radio-group v-decorator="rules.status">
          <a-radio :style="radioStyle" :value="0">关闭</a-radio>
          <a-radio :style="radioStyle" :value="1">开启</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
    <div class="button-end"></div>
    <div class="button-operation">
      <a-button @click="sure" type="primary">
        确认
      </a-button>
    </div>
  </div>
</template>

<script>
// import JEditor from '@/components/jeecg/JEditor'
import Vue from 'vue'
import { getAction, postAction } from '@/api/manage'

export default {
  name: 'MarketingCouponBaseSetting',
  data() {
    return {
      headers: '',
      form: this.$form.createForm(this),
      labelCol: Object.freeze({ span: 3 }),
      wrapperCol: Object.freeze({ span: 12 }),
      rules: Object.freeze({
        name: [
          'name',
          {
            rules: [
              { required: true, message: '请输入活动别名' },
              {
                max: 4,
                message: '字数不能超过4个字'
              }
            ]
          }
        ],
        // label: [
        //   'label',
        //   { rules: [{ required: true, message: '请输入活动标签' }, { max: 4, message: '字数不能超过4个字' }] }
        // ]
        recommendSeckillNumber: [
          'recommendSeckillNumber',
          { rules: [{ required: true, message: '请输入推荐限时抢券' }] }
        ],
        recommendGroupNumber: ['recommendGroupNumber', { rules: [{ required: true, message: '请输入推荐拼好券' }] }],
        recommendCertificateNumber: [
          'recommendCertificateNumber',
          { rules: [{ required: true, message: '请输入推荐超值券' }] }
        ],

        // recommendCount: ['recommendCount', { rules: [{ required: true, message: '请输入设置的推荐数量' }] }],

        clientSideShow: ['clientSideShow', { rules: [{ required: true, message: '请选择客户端显示' }] }],
        status: ['status', { rules: [{ required: true, message: '请选择是否开启' }] }]
        // distributionCommission: ['distributionCommission', { rules: [{ required: true, message: '请选择分销佣金' }] }],
        // rulesBriefly: ['rulesBriefly', { rules: [{ required: true, message: '请输入规则简述' }] }],
        // numberClusters: ['numberClusters', { rules: [{ required: true, message: '请输入商品购买资格有效期' }] }],
        // timeLimit: ['timeLimit', { rules: [{ required: true, message: '请输入成团时限' }] }]
      }),
      radioStyle: Object.freeze({
        height: '30px',
        lineHeight: '15px'
      }),
      AllData: {
        // ruleDescription: ''
        // distributionCommission: 0
      },
      //分享图配置
      diagramFileList: [],
      diagramPreviewVisible: false,
      diagramPreviewImage: '',
      diagramFilePic: true,
      //海报图配置
      coverPlanFileList: [],
      coverPlanPreviewVisible: false,
      coverPlanPreviewImage: '',
      coverPlanFilePic: true,
      //券中心图标配置
      ticketIconFileList: [],
      ticketIconPreviewVisible: false,
      ticketIconPreviewImage: '',
      ticketIconFilePic: true,
      //券中心封面配置
      ticketSurfacePlotFileList: [],
      ticketSurfacePlotPreviewVisible: false,
      ticketSurfacePlotPreviewImage: '',
      ticketSurfacePlotFilePic: true,
      //券中心广告图配置
      ticketAdvertisementBannerFileList: [],
      ticketAdvertisementBannerPreviewVisible: false,
      ticketAdvertisementBannerPreviewImage: '',
      ticketAdvertisementBannerFilePic: true,
      //接口
      url: Object.freeze({
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        //设置编辑
        addOrEdit:
          '/marketingDiscountCertificateSetting/marketingDiscountCertificateSetting/setMarketingDiscountCertificateSetting',
        queryByOne:
          '/marketingDiscountCertificateSetting/marketingDiscountCertificateSetting/findMarketingDiscountCertificateSetting'
        // addOrEdit:
        // '/marketingCertificateSeckillBaseSetting/marketingCertificateSeckillBaseSetting/setMarketingCertificateSeckillBaseSetting', //新增编辑
        // queryByOne:
        // '/marketingCertificateSeckillBaseSetting/marketingCertificateSeckillBaseSetting/findMarketingCertificateSeckillBaseSetting' //返现
      }),
      //配置
      configure: Object.freeze({
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
      })
    }
  },
  components: {
    // JEditor
  },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
    this.getList()
  },
  methods: {
    getList() {
      getAction(this.url.queryByOne).then(async res => {
        if (res.success) {
          let allData = res.result
          try {
            if (allData.inviteFigure) {
              let inviteFigures = Object.values(JSON.parse(allData.inviteFigure))
              let inviteFiguresSz = []
              //分享图返显
              for (let a = 0; a < inviteFigures.length; a++) {
                let obj = {
                  uid: a,
                  url: this.configure.imgErver + '/' + inviteFigures[a],
                  response: {
                    message: inviteFigures[a]
                  }
                }
                inviteFiguresSz.push(obj)
              }
              this.diagramFileList = inviteFiguresSz
            }
            if (allData.coverPlan) {
              let coverPlan = Object.values(JSON.parse(allData.coverPlan))
              let coverPlanSz = []
              //海报图返显
              for (let a = 0; a < coverPlan.length; a++) {
                let obj = {
                  uid: a,
                  url: this.configure.imgErver + '/' + coverPlan[a],
                  response: {
                    message: coverPlan[a]
                  }
                }
                coverPlanSz.push(obj)
              }
              this.coverPlanFileList = coverPlanSz
            }
            if (allData.ticketIcon) {
              let ticketIcon = Object.values(JSON.parse(allData.ticketIcon))
              let ticketIconSz = []
              //封面图返显
              for (let a = 0; a < ticketIcon.length; a++) {
                let obj = {
                  uid: a,
                  url: this.configure.imgErver + '/' + ticketIcon[a],
                  response: {
                    message: ticketIcon[a]
                  }
                }
                ticketIconSz.push(obj)
              }
              this.ticketIconFileList = ticketIconSz
            }
            if (allData.ticketSurfacePlot) {
              let ticketSurfacePlot = Object.values(JSON.parse(allData.ticketSurfacePlot))
              let ticketSurfacePlotSz = []
              //封面图返显
              for (let a = 0; a < ticketSurfacePlot.length; a++) {
                let obj = {
                  uid: a,
                  url: this.configure.imgErver + '/' + ticketSurfacePlot[a],
                  response: {
                    message: ticketSurfacePlot[a]
                  }
                }
                ticketSurfacePlotSz.push(obj)
              }
              this.ticketSurfacePlotFileList = ticketSurfacePlotSz
            }
            if (allData.ticketAdvertisementBanner) {
              let ticketAdvertisementBanner = Object.values(JSON.parse(allData.ticketAdvertisementBanner))
              let ticketAdvertisementBannerSz = []
              //封面图返显
              for (let a = 0; a < ticketAdvertisementBanner.length; a++) {
                let obj = {
                  uid: a,
                  url: this.configure.imgErver + '/' + ticketAdvertisementBanner[a],
                  response: {
                    message: ticketAdvertisementBanner[a]
                  }
                }
                ticketAdvertisementBannerSz.push(obj)
              }
              this.ticketAdvertisementBannerFileList = ticketAdvertisementBannerSz
            }
          } catch (e) {}
          // allData.distributionCommission = allData.distributionCommission * 1
          allData.clientSideShow = allData.clientSideShow * 1
          allData.status = allData.status * 1
          this.AllData = { ...this.AllData, ...allData }
          await this.$nextTick()
          this.form.setFieldsValue(this.AllData)
        }
      })
    },
    uploadAction() {
      return this.url.fileUpload
    },
    diagramFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.diagramFilePic = isLt2M
      return isLt2M
    },
    //分享图
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
    //海报图
    coverPlanFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.coverPlanFilePic = isLt2M
      return isLt2M
    },
    coverPlanHandleCancel() {
      this.coverPlanPreviewVisible = false
    },
    coverPlanHandlePreview(file) {
      this.coverPlanPreviewImage = file.url || file.thumbUrl
      this.coverPlanPreviewVisible = true
    },
    coverPlanHandleChange({ fileList }) {
      this.coverPlanFileList = fileList
    },

    //券中心图标图
    ticketIconFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.ticketIconFilePic = isLt2M
      return isLt2M
    },
    ticketIconHandleCancel() {
      this.ticketIconPreviewVisible = false
    },
    ticketIconHandlePreview(file) {
      this.ticketIconPreviewImage = file.url || file.thumbUrl
      this.ticketIconPreviewVisible = true
    },
    ticketIconHandleChange({ fileList }) {
      this.ticketIconFileList = fileList
    },
    //券中心封面图
    ticketSurfacePlotFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.ticketSurfacePlotFilePic = isLt2M
      return isLt2M
    },
    ticketSurfacePlotHandleCancel() {
      this.ticketSurfacePlotPreviewVisible = false
    },
    ticketSurfacePlotHandlePreview(file) {
      this.ticketSurfacePlotPreviewImage = file.url || file.thumbUrl
      this.ticketSurfacePlotPreviewVisible = true
    },
    ticketSurfacePlotHandleChange({ fileList }) {
      this.ticketSurfacePlotFileList = fileList
    },
    //券中心广告图
    ticketAdvertisementBannerFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.ticketAdvertisementBannerFilePic = isLt2M
      return isLt2M
    },
    ticketAdvertisementBannerHandleCancel() {
      this.ticketAdvertisementBannerPreviewVisible = false
    },
    ticketAdvertisementBannerHandlePreview(file) {
      this.ticketAdvertisementBannerPreviewImage = file.url || file.thumbUrl
      this.ticketAdvertisementBannerPreviewVisible = true
    },
    ticketAdvertisementBannerHandleChange({ fileList }) {
      this.ticketAdvertisementBannerFileList = fileList
    },

    sure() {
      if (!Array.isArray(this.diagramFileList) || this.diagramFileList.length <= 0) {
        this.$message.warn('请上传分享图！')
        return false
      }
      if (!Array.isArray(this.coverPlanFileList) || this.coverPlanFileList.length <= 0) {
        this.$message.warn('请上传海报图！')
        return false
      }
      if (!Array.isArray(this.ticketIconFileList) || this.ticketIconFileList.length <= 0) {
        this.$message.warn('请上传券中心图标！')
        return false
      }
      if (!Array.isArray(this.ticketSurfacePlotFileList) || this.ticketSurfacePlotFileList.length <= 0) {
        this.$message.warn('请上传券中心封面！')
        return false
      }
      if (
        !Array.isArray(this.ticketAdvertisementBannerFileList) ||
        this.ticketAdvertisementBannerFileList.length <= 0
      ) {
        this.$message.warn('请上传券中心广告图！')
        return false
      }
      // if (!this.AllData.ruleDescription) {
      //   this.$message.warn('请填写规则说明！')
      //   return false
      // }

      this.form.validateFields((err, values) => {
        // if(this.isSelectData.length<=0){
        //   this.$message.warn('请选择适用商品！')
        //   return;
        // }
        if (!err) {
          this.AllData = Object.assign({}, this.AllData, values)
          this.$nextTick(() => {
            let inviteFigure = {}
            let coverPlanCK = {}
            let ticketIcon = {}
            let ticketSurfacePlot = {}
            let ticketAdvertisementBanner = {}
            for (let count = 0; count < this.diagramFileList.length; count++) {
              inviteFigure[count] = this.diagramFileList[count].response.message
            }
            for (let count = 0; count < this.coverPlanFileList.length; count++) {
              coverPlanCK[count] = this.coverPlanFileList[count].response.message
            }
            for (let count = 0; count < this.ticketIconFileList.length; count++) {
              ticketIcon[count] = this.ticketIconFileList[count].response.message
            }
            for (let count = 0; count < this.ticketSurfacePlotFileList.length; count++) {
              ticketSurfacePlot[count] = this.ticketSurfacePlotFileList[count].response.message
            }
            for (let count = 0; count < this.ticketAdvertisementBannerFileList.length; count++) {
              ticketAdvertisementBanner[count] = this.ticketAdvertisementBannerFileList[count].response.message
            }

            this.AllData.inviteFigure = this.diagramFileList.length > 0 ? JSON.stringify(inviteFigure) : ''
            this.AllData.coverPlan = this.coverPlanFileList.length > 0 ? JSON.stringify(coverPlanCK) : ''
            this.AllData.ticketIcon = this.ticketIconFileList.length > 0 ? JSON.stringify(ticketIcon) : ''
            this.AllData.ticketSurfacePlot =
              this.ticketSurfacePlotFileList.length > 0 ? JSON.stringify(ticketSurfacePlot) : ''
            this.AllData.ticketAdvertisementBanner =
              this.ticketAdvertisementBannerFileList.length > 0 ? JSON.stringify(ticketAdvertisementBanner) : ''
            postAction(this.url.addOrEdit, this.AllData)
              .then(res => {
                if (res.success) {
                  this.$message.success('成功！')
                  this.getList()
                } else {
                  this.$message.warn('失败')
                }
              })
              .catch(err => {
                this.$message.warn('失败')
              })
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.MarketingCouponBaseSetting {
  width: 100%;
  background: white;

  .title {
    margin-top: 12px;
    padding: 25px;
    border-bottom: 1px solid #d9d9d9;
    font-weight: 700;
    font-size: 16px;
  }

  .wrap {
    margin-top: 30px;

    .Discount {
      input {
        margin: 0 15px;
        width: 75px;
      }
    }

    .attention {
      margin-top: 10px;
      padding: 0 20px;
      border: 1px solid rgb(0, 153, 255);
      border-radius: 5px;
      background: rgb(204, 235, 255);
      line-height: 34px;

      /*width: 1080px;*/
      font-size: 13px;
      color: black;

      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
    }
  }

  .button-operation {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    padding-bottom: 20px;
    width: 200px;

    button {
      width: 80px;
    }
  }

  .button-end {
    margin-bottom: 40px;
    border-bottom: 1px solid gray;
  }
}
</style>
