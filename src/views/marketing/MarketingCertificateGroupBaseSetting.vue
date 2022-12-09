<template>
  <div class="MarketingCertificateGroupBaseSetting">
    <div class="title">
      基础设置
    </div>
    <a-form :form="form" class="wrap">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="活动别名">
        <a-input placeholder="请输入活动别名,字数不能超过4个字" v-decorator="rules.anotherName"> </a-input>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="活动标签">
        <a-input placeholder="请输入活动标签,字数不能超过4个字" v-decorator="rules.label"> </a-input>
      </a-form-item>

      <!-- <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="推荐数量">
        <a-input-number :min="1" placeholder="请输入推荐数量" style="width: 200px;" v-decorator="rules.promoteNumber">
        </a-input-number>
      </a-form-item> -->
      <!-- <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="设置推荐数量">
        <a-input-number
          :min="1"
          placeholder="请输入设置推荐数量"
          style="width: 200px;"
          v-decorator="rules.recommendCount"
        >
        </a-input-number>
      </a-form-item> -->

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="客户端显示">
        <a-radio-group v-decorator="rules.pointsDisplay">
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

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="默认成团人数">
        <a-input-number placeholder="成团人数" v-decorator="rules.numberClusters" :min="1" :precision="0" />
        人
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="成团时限">
        <div style="display:flex;align-itmes:center">
          <a-input-number
            placeholder="成团时限"
            v-decorator="rules.timeLimit"
            :min="0"
            :precision="0"
            style="margin-right:5px"
          />
          <a-select v-model="AllData.timeType" placeholder="请选择成团时限" style="width:100px">
            <a-select-option :value="0">时</a-select-option>
            <a-select-option :value="1">分</a-select-option>
          </a-select>
        </div>
      </a-form-item>
      <!-- 
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="规则简述">
        <a-input placeholder="请输入规则简述" v-decorator="rules.rulesBriefly"> </a-input>
      </a-form-item> -->

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          规则说明
        </span>
        <JEditor v-model="AllData.ruleDescription"> </JEditor>
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
          :beforeUpload="postersFileUpload"
          :fileList="postersFileList"
          :headers="headers"
          @change="postersHandleChange"
          @preview="postersHandlePreview"
          listType="picture-card"
        >
          <div v-if="postersFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="postersPreviewVisible" @cancel="postersHandleCancel">
          <img :src="postersPreviewImage" alt="example" style="width: 100%" />
        </a-modal>
      </a-form-item>

      <!-- <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        help="尺寸800*800 支持jpg、jpeg、png格式，大小不超过2M"
        validate-status="error"
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
      </a-form-item> -->
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
import JEditor from '@/components/jeecg/JEditor'
import Vue from 'vue'
import { getAction, postAction } from '@/api/manage'

export default {
  name: 'MarketingCertificateGroupBaseSetting',
  data() {
    return {
      headers: '',
      form: this.$form.createForm(this),
      labelCol: Object.freeze({ span: 3 }),
      wrapperCol: Object.freeze({ span: 12 }),
      rules: Object.freeze({
        anotherName: [
          'anotherName',
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
        label: [
          'label',
          { rules: [{ required: true, message: '请输入活动标签' }, { max: 4, message: '字数不能超过4个字' }] }
        ],
        // promoteNumber: ['promoteNumber', { rules: [{ required: true, message: '请输入推荐数量' }] }],
        // recommendCount: ['recommendCount', { rules: [{ required: true, message: '请输入设置的推荐数量' }] }],

        pointsDisplay: ['pointsDisplay', { rules: [{ required: true, message: '请选择客户端显示' }] }],
        status: ['status', { rules: [{ required: true, message: '请选择是否开启' }] }],
        // rulesBriefly: ['rulesBriefly', { rules: [{ required: true, message: '请输入规则简述' }] }],
        numberClusters: ['numberClusters', { rules: [{ required: true, message: '请输入商品购买资格有效期' }] }],
        timeLimit: ['timeLimit', { rules: [{ required: true, message: '请输入成团时限' }] }]
      }),
      radioStyle: Object.freeze({
        height: '30px',
        lineHeight: '15px'
      }),
      AllData: {
        ruleDescription: '',
        status: 0,
        timeType: 0
      },
      //分享图配置
      diagramFileList: [],
      diagramPreviewVisible: false,
      diagramPreviewImage: '',
      diagramFilePic: true,
      //海报图配置
      postersFileList: [],
      postersPreviewVisible: false,
      postersPreviewImage: '',
      postersFilePic: true,
      //封面图配置
      // surfacePlotFileList: [],
      // surfacePlotPreviewVisible: false,
      // surfacePlotPreviewImage: '',
      // surfacePlotFilePic: true,
      //接口
      url: Object.freeze({
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        addOrEdit:
          'marketingCertificateGroupBaseSetting/marketingCertificateGroupBaseSetting/setMarketingCertificateGroupBaseSetting', //新增编辑
        queryByOne:
          'marketingCertificateGroupBaseSetting/marketingCertificateGroupBaseSetting/findMarketingCertificateGroupBaseSetting' //返现
      }),
      //配置
      configure: Object.freeze({
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
      })
    }
  },
  components: {
    JEditor
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
            if (allData.coverPlan) {
              let coverPlans = Object.values(JSON.parse(allData.coverPlan))
              let coverPlansSz = []
              //分享图返显
              for (let a = 0; a < coverPlans.length; a++) {
                let obj = {
                  uid: a,
                  url: this.configure.imgErver + '/' + coverPlans[a],
                  response: {
                    message: coverPlans[a]
                  }
                }
                coverPlansSz.push(obj)
              }
              this.diagramFileList = coverPlansSz
            }
            if (allData.posters) {
              let posters = Object.values(JSON.parse(allData.posters))
              let postersSz = []
              //海报图返显
              for (let a = 0; a < posters.length; a++) {
                let obj = {
                  uid: a,
                  url: this.configure.imgErver + '/' + posters[a],
                  response: {
                    message: posters[a]
                  }
                }
                postersSz.push(obj)
              }
              this.postersFileList = postersSz
            }
            // if (allData.surfacePlot) {
            //   let surfacePlot = Object.values(JSON.parse(allData.surfacePlot))
            //   let surfacePlotSz = []
            //   //封面图返显
            //   for (let a = 0; a < surfacePlot.length; a++) {
            //     let obj = {
            //       uid: a,
            //       url: this.configure.imgErver + '/' + surfacePlot[a],
            //       response: {
            //         message: surfacePlot[a]
            //       }
            //     }
            //     surfacePlotSz.push(obj)
            //   }
            //   this.surfacePlotFileList = surfacePlotSz
            // }
          } catch (e) {}
          allData.status = allData.status * 1
          allData.timeType = allData.timeType * 1
          allData.pointsDisplay = allData.pointsDisplay * 1
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
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('图片大小必须在5M以内!')
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
    postersFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('图片大小必须在5M以内!')
      }
      this.postersFilePic = isLt2M
      return isLt2M
    },
    postersHandleCancel() {
      this.postersPreviewVisible = false
    },
    postersHandlePreview(file) {
      this.postersPreviewImage = file.url || file.thumbUrl
      this.postersPreviewVisible = true
    },
    postersHandleChange({ fileList }) {
      this.postersFileList = fileList
    },

    //封面图
    // surfacePlotFileUpload(file) {
    //   const isLt2M = file.size / 1024 / 1024 < 5
    //   if (!isLt2M) {
    //     this.$message.error('图片大小必须在5M以内!')
    //   }
    //   this.surfacePlotFilePic = isLt2M
    //   return isLt2M
    // },
    // surfacePlotHandleCancel() {
    //   this.surfacePlotPreviewVisible = false
    // },
    // surfacePlotHandlePreview(file) {
    //   this.surfacePlotPreviewImage = file.url || file.thumbUrl
    //   this.surfacePlotPreviewVisible = true
    // },
    // surfacePlotHandleChange({ fileList }) {
    //   this.surfacePlotFileList = fileList
    // },

    sure() {
      if (!Array.isArray(this.diagramFileList) || this.diagramFileList.length <= 0) {
        this.$message.warn('请上传分享图！')
        return false
      }
      if (!Array.isArray(this.postersFileList) || this.postersFileList.length <= 0) {
        this.$message.warn('请上传海报图！')
        return false
      }
      // if (!Array.isArray(this.surfacePlotFileList) || this.surfacePlotFileList.length <= 0) {
      //   this.$message.warn('请上传封面图！')
      //   return false
      // }
      if (!this.AllData.ruleDescription) {
        this.$message.warn('请填写规则说明！')
        return false
      }

      this.form.validateFields((err, values) => {
        // if(this.isSelectData.length<=0){
        //   this.$message.warn('请选择适用商品！')
        //   return;
        // }
        if (!err) {
          this.AllData = Object.assign({}, this.AllData, values)
          this.$nextTick(() => {
            let coverPlan = {}
            let postersCK = {}
            // let surfacePlot = {}
            for (let count = 0; count < this.diagramFileList.length; count++) {
              coverPlan[count] = this.diagramFileList[count].response.message
            }
            for (let count = 0; count < this.postersFileList.length; count++) {
              postersCK[count] = this.postersFileList[count].response.message
            }
            // for (let count = 0; count < this.surfacePlotFileList.length; count++) {
            //   surfacePlot[count] = this.surfacePlotFileList[count].response.message
            // }

            this.AllData.coverPlan = this.diagramFileList.length > 0 ? JSON.stringify(coverPlan) : ''
            this.AllData.posters = this.postersFileList.length > 0 ? JSON.stringify(postersCK) : ''
            // this.AllData.surfacePlot = this.surfacePlotFileList.length > 0 ? JSON.stringify(surfacePlot) : ''
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
.MarketingCertificateGroupBaseSetting {
  background: white;
  width: 100%;

  .title {
    font-size: 16px;
    font-weight: 700;
    padding: 25px;
    border-bottom: 1px solid #d9d9d9;
    margin-top: 12px;
  }

  .wrap {
    margin-top: 30px;

    .Discount {
      input {
        width: 75px;
        margin: 0 15px;
      }
    }

    .attention {
      margin-top: 10px;
      /*width: 1080px;*/
      font-size: 13px;
      line-height: 34px;
      padding: 0 20px;
      color: black;
      background: rgb(204, 235, 255);
      border: 1px solid rgb(0, 153, 255);
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
    }
  }

  .button-operation {
    display: flex;
    justify-content: space-between;
    width: 200px;
    margin: 0 auto;
    padding-bottom: 20px;

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
