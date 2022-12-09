<template>
  <div class="MarketingPaypalNamelyIntegralBaseSetting">
    <div class="title">
      支付即积分设置
    </div>
    <a-form :form="form" class="wrap">
      <a-form-item
        help="微信支付即积分服务，仅针已开通商圈快速积分的小程序有用，未开通即使启用用户也无法使用"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="微信支付即积分"
      >
        <a-radio-group v-decorator="rules.status">
          <a-radio :style="radioStyle" :value="0">关闭</a-radio>
          <a-radio :style="radioStyle" :value="1">开启</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        help="即商圈内每笔交易赠送的积分比例为实付款的50%"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="赠送比例"
      >
        <a-input-number
          :min="0"
          :precision="2"
          style="width:200px"
          placeholder="请输入赠送比例"
          v-decorator="rules.presentProportion"
        >
        </a-input-number>
        %
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        help="尺寸1065*207 ，支持jpg、jpeg、png格式，大小不超过2M"
        validate-status="error"
      >
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          封面广告
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
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          支付即积分介绍
        </span>
        <JEditor v-model="AllData.introduce"> </JEditor>
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
import JEditor from '@/components/jeecg/JEditor'
import Vue from 'vue'
import { getAction, postAction } from '@/api/manage'

export default {
  name: 'MarketingPaypalNamelyIntegralBaseSetting',
  components: {
    JEditor
  },
  data() {
    return {
      headers: '',
      form: this.$form.createForm(this),
      labelCol: Object.freeze({ span: 3 }),
      wrapperCol: Object.freeze({ span: 12 }),
      rules: Object.freeze({
        presentProportion: [
          'presentProportion',
          {
            rules: [{ required: true, message: '请输入赠送比例' }]
          }
        ],

        status: ['status', { rules: [{ required: true, message: '请选择是否开启' }] }]
      }),
      radioStyle: Object.freeze({
        height: '30px',
        lineHeight: '15px'
      }),
      AllData: {
        status: 0,
        introduce: ''
      },

      //封面图配置
      surfacePlotFileList: [],
      surfacePlotPreviewVisible: false,
      surfacePlotPreviewImage: '',
      surfacePlotFilePic: true,
      //接口
      url: Object.freeze({
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        addOrEdit: '/marketing/marketingPayIntegralSetting/addOrEdit', //新增编辑
        queryByOne: '/marketing/marketingPayIntegralSetting/queryByOne' //返现
      }),
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
    this.getList()
  },
  methods: {
    getList() {
      getAction(this.url.queryByOne).then(async res => {
        let allData = res.result ? res.result : {}
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
        } catch (e) {}
        allData.status = allData.status * 1
        this.AllData = { ...this.AllData, ...allData }
        await this.$nextTick()
        this.form.setFieldsValue(this.AllData)
      })
    },
    uploadAction() {
      return this.url.fileUpload
    },

    //封面图
    surfacePlotFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
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

    sure() {
      if (!Array.isArray(this.surfacePlotFileList) || this.surfacePlotFileList.length <= 0) {
        this.$message.warn('请上传封面广告！')
        return false
      }
      if (!this.AllData.introduce) {
        this.$message.warn('请填写支付即积分介绍！')
        return false
      }

      this.form.validateFields((err, values) => {
        if (!err) {
          this.AllData = Object.assign({}, this.AllData, values)
          this.$nextTick(() => {
            let surfacePlot = {}

            for (let count = 0; count < this.surfacePlotFileList.length; count++) {
              surfacePlot[count] = this.surfacePlotFileList[count].response.message
            }

            this.AllData.surfacePlot = this.surfacePlotFileList.length > 0 ? JSON.stringify(surfacePlot) : ''
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
.MarketingPaypalNamelyIntegralBaseSetting {
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
