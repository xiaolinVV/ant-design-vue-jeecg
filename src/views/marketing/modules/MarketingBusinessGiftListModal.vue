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
      <a-form :form="form" v-if="!isEditSort">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="礼包名称">
          <a-input placeholder="请输入礼包名称" v-decorator="['giftName', validatorRules.giftName]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="销售价">
          <a-input-number
            placeholder="请输入销售价"
            style="width:200px"
            :min="0"
            :precision="2"
            v-decorator="['salesPrice', validatorRules.salesPrice]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="成本价">
          <a-input-number
            placeholder="请输入成本价"
            style="width:200px"
            :min="0"
            :precision="2"
            v-decorator="['costPrice', validatorRules.costPrice]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库存">
          <a-input-number
            placeholder="请输入库存"
            style="width:200px"
            :min="0"
            :precision="0"
            v-decorator="['repertory', validatorRules.repertory]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="推荐奖励">
          <a-input-number
            placeholder="请输入推荐奖励,若无请输入0"
            style="width:200px"
            :min="0"
            :precision="2"
            v-decorator="['referralBonuses', validatorRules.referralBonuses]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="分红资金">
          <a-input-number
            placeholder="请输入分红资金,若无请输入0"
            style="width:200px"
            :min="0"
            :precision="2"
            v-decorator="['bonusMoney', validatorRules.bonusMoney]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="分享标题">
          <a-input placeholder="请输入分享标题" v-decorator="['shareTitle', validatorRules.shareTitle]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="分享描述">
          <a-input placeholder="请输入分享描述" v-decorator="['shareDescription', validatorRules.shareDescription]" />
        </a-form-item>

        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          help="尺寸750*375px，支持jpg、jpeg、png格式，大小不超过1M"
          validate-status="error"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            礼包主图
          </span>
          <a-upload
            :action="uploadAction"
            :beforeUpload="mainPictureFileUpload"
            :fileList="mainPictureFileList"
            :headers="headers"
            @change="mainPictureHandleChange"
            @preview="mainPictureHandlePreview"
            listType="picture-card"
          >
            <div v-if="mainPictureFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :footer="null" :visible="mainPicturePreviewVisible" @cancel="mainPictureHandleCancel">
            <img :src="mainPicturePreviewImage" alt="example" style="width: 100%" />
          </a-modal>
        </a-form-item>

        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          help="尺寸750*750px，支持jpg、jpeg、png格式，大小不超过1M"
          validate-status="error"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            礼包详情图
          </span>
          <a-upload
            :action="uploadAction"
            :beforeUpload="detailsFigureFileUpload"
            :fileList="detailsFigureFileList"
            :headers="headers"
            @change="detailsFigureHandleChange"
            @preview="detailsFigureHandlePreview"
            listType="picture-card"
          >
            <div v-if="detailsFigureFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :footer="null" :visible="detailsFigurePreviewVisible" @cancel="detailsFigureHandleCancel">
            <img :src="detailsFigurePreviewImage" alt="example" style="width: 100%" />
          </a-modal>
        </a-form-item>

        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          help="尺寸750*750px，支持jpg、jpeg、png格式，大小不超过1M"
          validate-status="error"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            礼包分享图
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

        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          help="尺寸1428*2540，支持jpg、jpeg、png格式，大小不超过2M。必须预留好二维码位置，以免影响展示效果。"
          validate-status="error"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            礼包海报图
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

        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态；0：停用；1：启用">
          <a-input placeholder="请输入状态；0：停用；1：启用" v-decorator="['status', {}]" />
        </a-form-item> -->
      </a-form>
      <a-form :form="form" v-else>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input-number v-decorator="['sort', validatorRules.sort]" />
        </a-form-item>
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
  name: 'MarketingBusinessGiftListModal',
  data() {
    return {
      title: '操作',
      visible: false,
      headers: '',
      isEditSort: false,
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
      //详情图
      detailsFigureFileList: [],
      detailsFigurePreviewVisible: false,
      detailsFigurePreviewImage: '',
      detailsFigureFilePic: true,
      //礼包主图
      mainPictureFileList: [],
      mainPicturePreviewVisible: false,
      mainPicturePreviewImage: '',
      mainPictureFilePic: true,
      //分享图
      coverPlanFileList: [],
      coverPlanPreviewVisible: false,
      coverPlanPreviewImage: '',
      coverPlanFilePic: true,
      //海报图
      postersFileList: [],
      postersPreviewVisible: false,
      postersPreviewImage: '',
      postersFilePic: true,
      validatorRules: {
        giftName: {
          rules: [
            {
              required: true,
              message: '请输入礼包名称!'
            }
          ]
        },
        salesPrice: {
          rules: [
            {
              required: true,
              message: '请输入销售价!'
            }
          ]
        },
        costPrice: {
          rules: [
            {
              required: true,
              message: '请输入成本价!'
            }
          ]
        },
        repertory: {
          rules: [
            {
              required: true,
              message: '请输入库存!'
            }
          ]
        },
        referralBonuses: {
          rules: [
            {
              required: true,
              message: '请输入推荐奖励!'
            }
          ]
        },
        bonusMoney: {
          rules: [
            {
              required: true,
              message: '请输入分红资金!'
            }
          ]
        },
        shareTitle: {
          rules: [
            {
              required: true,
              message: '请输入分享标题!'
            }
          ]
        },
        shareDescription: {
          rules: [
            {
              required: false,
              message: '请输入分享描述!'
            }
          ]
        },
        sort: {
          rules: [
            {
              required: true,
              message: '请输入排序!'
            }
          ]
        }
      },
      url: {
        add: '/marketingBusinessGiftList/marketingBusinessGiftList/add',
        edit: '/marketingBusinessGiftList/marketingBusinessGiftList/edit',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      }
    }
  },
  computed: {
    uploadAction() {
      return this.url.fileUpload
    }
  },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.detailsFigureFileList = []
      this.mainPictureFileList = []
      this.coverPlanFileList = []
      this.postersFileList = []
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      if (record.isEditSort && record.id) {
        this.isEditSort = true
      } else {
        this.isEditSort = false
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'year',
            'month',
            'day',
            'delFlag',
            'giftName',
            'salesPrice',
            'costPrice',
            'repertory',
            'referralBonuses',
            'bonusMoney',
            'shareTitle',
            'shareDescription',
            'mainPicture',
            'detailsFigure',
            'coverPlan',
            'posters',
            'sort',
            'status',
            'statusExplain',
            'delExplain',
            'serialNumber'
          )
        )
        //时间格式化
        try {
          if (record.coverPlan) {
            let coverPlanIcons = Object.values(JSON.parse(record.coverPlan))
            let coverPlanIconsSz = []
            //分享图
            for (let a = 0; a < coverPlanIcons.length; a++) {
              let obj = {
                uid: a,
                url: this.url.imgerver + '/' + coverPlanIcons[a],
                response: {
                  message: coverPlanIcons[a]
                }
              }
              coverPlanIconsSz.push(obj)
            }
            this.coverPlanFileList = coverPlanIconsSz
          }
        } catch (e) {
          console.error(e)
        }
        try {
          if (record.posters) {
            let postersIcons = Object.values(JSON.parse(record.posters))
            let postersIconsSz = []
            //分享图
            for (let a = 0; a < postersIcons.length; a++) {
              let obj = {
                uid: a,
                url: this.url.imgerver + '/' + postersIcons[a],
                response: {
                  message: postersIcons[a]
                }
              }
              postersIconsSz.push(obj)
            }
            this.postersFileList = postersIconsSz
          }
        } catch (e) {
          console.error(e)
        }
        try {
          if (record.detailsFigure) {
            let detailsFigureIcons = Object.values(JSON.parse(record.detailsFigure))
            let detailsFigureIconsSz = []
            //详情图
            for (let a = 0; a < detailsFigureIcons.length; a++) {
              let obj = {
                uid: a,
                url: this.url.imgerver + '/' + detailsFigureIcons[a],
                response: {
                  message: detailsFigureIcons[a]
                }
              }
              detailsFigureIconsSz.push(obj)
            }
            this.detailsFigureFileList = detailsFigureIconsSz
          }
        } catch (e) {
          console.error(e)
        }
        try {
          if (record.mainPicture) {
            let mainPictureIcons = Object.values(JSON.parse(record.mainPicture))
            let mainPictureIconsSz = []
            //礼包详情图
            for (let a = 0; a < mainPictureIcons.length; a++) {
              let obj = {
                uid: a,
                url: this.url.imgerver + '/' + mainPictureIcons[a],
                response: {
                  message: mainPictureIcons[a]
                }
              }
              mainPictureIconsSz.push(obj)
            }
            this.mainPictureFileList = mainPictureIconsSz
          }
        } catch (e) {
          console.error(e)
        }
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    //礼包主图
    mainPictureFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('图片大小必须在1M以内!')
      }
      this.mainPictureFilePic = isLt2M
      return isLt2M
    },

    mainPictureHandleCancel() {
      this.mainPicturePreviewVisible = false
    },
    mainPictureHandlePreview(file) {
      this.mainPicturePreviewImage = file.url || file.thumbUrl
      this.mainPicturePreviewVisible = true
    },
    mainPictureHandleChange({ fileList }) {
      this.mainPictureFileList = fileList
    },
    //详情图
    detailsFigureFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('图片大小必须在1M以内!')
      }
      this.detailsFigureFilePic = isLt2M
      return isLt2M
    },

    detailsFigureHandleCancel() {
      this.detailsFigurePreviewVisible = false
    },
    detailsFigureHandlePreview(file) {
      this.detailsFigurePreviewImage = file.url || file.thumbUrl
      this.detailsFigurePreviewVisible = true
    },
    detailsFigureHandleChange({ fileList }) {
      this.detailsFigureFileList = fileList
    },
    //分享图
    coverPlanFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('图片大小必须在1M以内!')
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
    //海报图
    postersFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('图片大小必须在1M以内!')
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
    handleOk() {
      if (this.detailsFigureFileList.length <= 0) {
        this.$message.warn('请上传礼包详情图')
        return
      }
      if (this.mainPictureFileList.length <= 0) {
        this.$message.warn('请上传礼包主图')
        return
      }
      if (this.coverPlanFileList.length <= 0) {
        this.$message.warn('请上传礼包分享图')
        return
      }
      if (this.coverPlanFileList.length <= 0) {
        this.$message.warn('请上传礼包海报图')
        return
      }
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = 'post'
          if (!this.model.id) {
            httpurl += this.url.add
            // method = 'post'
          } else {
            httpurl += this.url.edit
            // method = 'put'
          }
          let formData = Object.assign(this.model, values)
          //时间格式化
          let postersIcon = {}
          for (let count = 0; count < this.postersFileList.length; count++) {
            postersIcon[count] = this.postersFileList[count].response.message
          }
          formData.posters = this.postersFileList.length > 0 ? JSON.stringify(postersIcon) : ''

          let coverPlanIcon = {}
          for (let count = 0; count < this.coverPlanFileList.length; count++) {
            coverPlanIcon[count] = this.coverPlanFileList[count].response.message
          }
          formData.coverPlan = this.coverPlanFileList.length > 0 ? JSON.stringify(coverPlanIcon) : ''

          let detailsFigureIcon = {}
          for (let count = 0; count < this.detailsFigureFileList.length; count++) {
            detailsFigureIcon[count] = this.detailsFigureFileList[count].response.message
          }
          formData.detailsFigure = this.detailsFigureFileList.length > 0 ? JSON.stringify(detailsFigureIcon) : ''

          let mainPictureIcon = {}
          for (let count = 0; count < this.mainPictureFileList.length; count++) {
            mainPictureIcon[count] = this.mainPictureFileList[count].response.message
          }
          formData.mainPicture = this.mainPictureFileList.length > 0 ? JSON.stringify(mainPictureIcon) : ''

          console.log(formData)
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
