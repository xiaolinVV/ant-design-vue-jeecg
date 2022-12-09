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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="活动名称">
          <a-input placeholder="请输入活动名称" v-decorator="['anotherName', validatorRules.anotherName]" />
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
            封面图
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
          help="尺寸750*375px，支持jpg、jpeg、png格式，大小不超过1M"
          validate-status="error"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            主图
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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="支付方式">
          <a-select v-decorator="['payment', validatorRules.payment]" placeholder="请选择支付方式">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option :value="0">产品券</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数量">
          <a-input-number v-decorator="['paymentAmount', validatorRules.paymentAmount]" :min="0" :precision="0" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="成团人数">
          <a-input-number v-decorator="['numberClusters', validatorRules.numberClusters]" :min="0" :precision="0" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="参与拼购奖励">
          <a-input-number v-decorator="['groupRewards', validatorRules.groupRewards]" :min="0" :precision="2" />
          元
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="推荐拼购奖励">
          <a-input-number
            v-decorator="['recommendGroupRewards', validatorRules.recommendGroupRewards]"
            :min="0"
            :precision="2"
          />
          元
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="中奖奖品类型">
          <a-select v-decorator="['prizeType', validatorRules.prizeType]" placeholder="请选择中奖奖品类型">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option :value="0">兑换券</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="中奖奖励">
          <a-input-number v-decorator="['winningNumber', validatorRules.winningNumber]" :min="0" :precision="0" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="未中奖奖品类型">
          <a-select v-decorator="['rewardType', validatorRules.rewardType]" placeholder="请选择未中奖奖品类型">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option :value="0">产品券</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="未中奖奖励">
          <a-input-number v-decorator="['missedRewards', validatorRules.missedRewards]" :min="0" :precision="0" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="转化阈值">
          <a-input-number v-decorator="['threshold', validatorRules.threshold]" :min="0" :precision="0" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="转入余额">
          <a-input-number v-decorator="['intoBalance', validatorRules.intoBalance]" :min="0" :precision="0" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="转入购物积分">
          <a-input-number
            v-decorator="['intoShoppingCredits', validatorRules.intoShoppingCredits]"
            :min="0"
            :precision="0"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input-number v-decorator="['sort', validatorRules.sort]" :min="0" :precision="0" />
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
  name: 'MarketingGroupIntegralManageModal',
  computed: {
    uploadAction() {
      return this.url.fileUpload
    }
  },
  data() {
    return {
      title: '操作',
      visible: false,
      headers: '',
      //封面图
      diagramFileList: [],
      diagramPreviewVisible: false,
      diagramPreviewImage: '',
      diagramFilePic: true,
      //主图
      mainPictureFileList: [],
      mainPicturePreviewVisible: false,
      mainPicturePreviewImage: '',
      mainPictureFilePic: true,
      //主图
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
      validatorRules: {
        anotherName: {
          rules: [
            {
              required: true,
              message: '请输入活动名称!'
            }
          ]
        },
        paymentAmount: {
          rules: [
            {
              required: true,
              message: '请输入数量!'
            }
          ]
        },
        numberClusters: {
          rules: [
            {
              required: true,
              message: '请输入成团人数!'
            }
          ]
        },
        groupRewards: {
          rules: [
            {
              required: true,
              message: '请输入参与拼购奖励!'
            }
          ]
        },
        recommendGroupRewards: {
          rules: [
            {
              required: true,
              message: '请输入推荐拼购奖励!'
            }
          ]
        },
        winningNumber: {
          rules: [
            {
              required: true,
              message: '请输入中奖奖励!'
            }
          ]
        },
        missedRewards: {
          rules: [
            {
              required: true,
              message: '请输入未中奖奖励!'
            }
          ]
        },
        threshold: {
          rules: [
            {
              required: true,
              message: '请输入转化阈值!'
            }
          ]
        },
        intoBalance: {
          rules: [
            {
              required: true,
              message: '请输入余额!'
            }
          ]
        },
        intoShoppingCredits: {
          rules: [
            {
              required: true,
              message: '请输入转入购物积分!'
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
        },
        payment: {
          rules: [
            {
              required: true,
              message: '请选择支付方式!'
            }
          ]
        },
        prizeType: {
          rules: [
            {
              required: true,
              message: '请选择中奖奖品类型!'
            }
          ]
        },
        rewardType: {
          rules: [
            {
              required: true,
              message: '请选择未中奖奖品类型!'
            }
          ]
        }
      },
      url: {
        add: '/marketing/marketingGroupIntegralManage/add',
        edit: '/marketing/marketingGroupIntegralManage/edit',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      }
    }
  },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
  },
  methods: {
    //封面图
    diagramFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('图片大小必须在1M以内!')
      }
      this.diagramFilePic = isLt2M
      return isLt2M
    },

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
    //主图
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
    add() {
      this.edit({})
    },
    edit(record) {
      this.diagramFileList = []
      this.mainPictureFileList = []
      this.form.resetFields()
      record.payment = record.payment * 1 || 0
      record.prizeType = record.prizeType * 1 || 0
      record.rewardType = record.rewardType * 1 || 0
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'year',
            'month',
            'day',
            'delFlag',
            'anotherName',
            'surfacePlot',
            'mainPicture',
            'payment',
            'paymentAmount',
            'numberClusters',
            'groupRewards',
            'recommendGroupRewards',
            'prizeType',
            'winningNumber',
            'rewardType',
            'missedRewards',
            'threshold',
            'intoBalance',
            'intoShoppingCredits',
            'sort',
            'status',
            'statusExplain'
          )
        )
        try {
          if (record.surfacePlot) {
            let surfacePlotIcons = Object.values(JSON.parse(record.surfacePlot))
            let surfacePlotIconsSz = []
            //封面图
            for (let a = 0; a < surfacePlotIcons.length; a++) {
              let obj = {
                uid: a,
                url: this.url.imgerver + '/' + surfacePlotIcons[a],
                response: {
                  message: surfacePlotIcons[a]
                }
              }
              surfacePlotIconsSz.push(obj)
            }
            this.diagramFileList = surfacePlotIconsSz
          }
        } catch (e) {
          console.error(e)
        }
        try {
          if (record.mainPicture) {
            let mainPictureIcons = Object.values(JSON.parse(record.mainPicture))
            let mainPictureIconsSz = []
            //封面图
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
        //时间格式化
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      if (this.diagramFileList.length <= 0) {
        this.$message.warn('请上传封面图')
        return
      }
      if (this.mainPictureFileList.length <= 0) {
        this.$message.warn('请上传主图')
        return
      }
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let formData = Object.assign(this.model, values)
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
            formData.status = 1
          } else {
            httpurl += this.url.edit
            method = 'put'
          }

          //时间格式化
          let surfacePlotIcon = {}
          for (let count = 0; count < this.diagramFileList.length; count++) {
            surfacePlotIcon[count] = this.diagramFileList[count].response.message
          }
          formData.surfacePlot = this.diagramFileList.length > 0 ? JSON.stringify(surfacePlotIcon) : ''

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
