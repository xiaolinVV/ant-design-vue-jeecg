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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="奖品类型">
          <a-radio-group v-decorator="['prizeType', {}]" @change="prizeTypeRadio">
            <a-radio :value="0">
              礼品
            </a-radio>
            <a-radio :value="1">
              优惠券
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="奖品名称">
          <a-input
            placeholder="请输入奖品名称"
            v-decorator="['prizeName', { rules: [{ required: true, message: '奖品名称' }] }]"
          />
        </a-form-item>

        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          help="建议尺寸:800像素*800像素，大小不超过1M"
          validate-status="error"
        >
          <span slot="label">
            <span style="color:red">*</span>
            奖品图片
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

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="奖品实际库存">
          <a-input-number
            style="width:500px;"
            v-decorator="['repertory', { rules: [{ required: true, message: '奖品实际库存' }] }]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="超库存">
          <a-radio-group v-decorator="['superInventory', {}]">
            <a-radio :value="0">
              不允许
            </a-radio>
            <a-radio :value="1">
              允许
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="温馨提示">
          <span style="color:red">
            超库存设置时若选择不允许,且该礼品若已被应用于还未开奖的活动,且当前修改后的实际库存小于活动库存,则活动库存将会被同步下调。</span
          >
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="绑定优惠券id" v-if="prizeTypes == 1">
          <a-input
            placeholder="请输入优惠券id"
            v-decorator="['marketingDiscountId', { rules: [{ required: true, message: '请输入优惠券id' }] }]"
            @change="queryByIdChange"
            v-model="marketingDiscountId"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="优惠券信息" v-if="prizeTypes == 1">
          <span v-if="!queryByName">请先绑定优惠券id</span>
          <span v-else>{{ queryByName }}</span>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import Vue from 'vue'
import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'

export default {
  name: 'MarketingLivePrizeModal',
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      prizeTypes: '',
      marketingDiscountId: '', //优惠券id
      queryByName: '', //优惠券信息
      headers: '',
      coverPlanFileList: [],
      coverPlanPreviewVisible: false,
      coverPlanPreviewImage: '',
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        prizeType: [
          'prizeType',
          {
            rules: [
              {
                required: true,
                message: '请选择是否显示!'
              }
            ]
          }
        ],
        superInventory: [
          'superInventory',
          {
            rules: [
              {
                required: true,
                message: '请选择是否显示!'
              }
            ]
          }
        ]
      },

      url: Object.freeze({
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',

        add: '/marketingLivePrize/marketingLivePrize/add',
        edit: '/marketingLivePrize/marketingLivePrize/edit',
        marketingDiscountId: 'marketingDiscount/marketingDiscount/queryById' //通过优惠券id获取优惠券信息
      }),
      //配置
      configure: {
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
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
    queryByIdChange() {
      // console.log(this.marketingDiscountId, 'this.mmarketingDiscountId')
      var that = this
      getAction(that.url.marketingDiscountId, { id: this.marketingDiscountId }).then(res => {
        if (res.success) {
          that.queryByName = res.result.name
          // console.log(res.result)
        } else {
          // that.$message.warning(res.message)
        }
      })
    },
    prizeTypeRadio(e) {
      // console.log(e.target.value)
      // console.log(this.marketingDiscountId, 'this.mmarketingDiscountId')
      this.queryByName = ''
      this.prizeTypes = e.target.value
    },
    coverPlanHandleCancel() {
      this.coverPlanPreviewVisible = false
    },
    coverPlanFileUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('图片大小必须在1M以内!')
      }
      this.coverPlanFilePic = isLt1M
      // console.log(this.coverPlanFilePic, 'this.coverPlanFilePic')
      return isLt1M
    },
    coverPlanHandlePreview(file) {
      this.coverPlanPreviewImage = file.url || file.thumbUrl
      this.coverPlanPreviewVisible = true
      // console.log(this.coverPlanPreviewImage, 'this.coverPlanPreviewImage')
    },
    coverPlanHandleChange({ fileList }) {
      this.coverPlanFileList = fileList
    },
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.coverPlanFileList = []

      if (record.id) {
        record.superInventory = record.superInventory * 1
        record.prizeType = record.prizeType * 1
      }
      if (record.prizeType) {
        this.prizeTypes = record.prizeType
      }
      if (record.marketingDiscountId) {
        var that = this

        this.marketingDiscountId = record.marketingDiscountId
        getAction(that.url.marketingDiscountId, { id: this.marketingDiscountId }).then(res => {
          if (res.success) {
            that.queryByName = res.result.name
            // console.log(res.result)
          } else {
            // that.$message.warning(res.message)
          }
        })
      }
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'prizeType',
            'prizeName',
            'prizeImage',
            'repertory',
            'superInventory',
            'marketingDiscountId',
            'status',
            'statusExplain',
            'delExplain'
          )
        )
        //时间格式化
        try {
          if (record.prizeImage) {
            let coverPlanIcons = Object.values(JSON.parse(record.prizeImage))
            let coverPlanIconsSz = []
            //积分图标返显
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
            method = 'post'
          }
          let formData = Object.assign(this.model, values)
          //时间格式化
          let coverPlanIcon = {}
          for (let count = 0; count < this.coverPlanFileList.length; count++) {
            coverPlanIcon[count] = this.coverPlanFileList[count].response.message
          }
          formData.prizeImage = this.coverPlanFileList.length > 0 ? JSON.stringify(coverPlanIcon) : ''
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
