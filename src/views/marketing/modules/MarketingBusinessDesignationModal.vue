<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="称号名称">
          <a-input placeholder="请输入称号名称" v-decorator="['designationName', validatorRules.designationName]" />
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          help="尺寸40*40 支持png格式，大小不超过200k"
          validate-status="error"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            图标
          </span>
          <a-upload
            :action="uploadAction"
            :beforeUpload="iconFileUpload"
            :fileList="iconFileList"
            :headers="headers"
            @change="iconHandleChange"
            @preview="iconHandlePreview"
            listType="picture-card"
          >
            <div v-if="iconFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :footer="null" :visible="iconPreviewVisible" @cancel="iconHandleCancel">
            <img :src="iconPreviewImage" alt="example" style="width: 100%" />
          </a-modal>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否默认">
          <a-radio-group v-decorator="['isDefault', validatorRules.isDefault]">
            <a-radio value="0">
              否
            </a-radio>
            <a-radio value="1">
              是
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="级别">
          <a-input-number :precision="0" :min="0" v-decorator="['grade', validatorRules.grade]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="获得方式">
          <!-- ；0：无；1：自购金额满；2：直推  getWay-->
          <a-radio-group v-decorator="['getWay', validatorRules.getWay]">
            <a-radio value="0" :style="radioStyle">
              无
            </a-radio>
            <a-radio value="1" :style="radioStyle">
              自购金额满
              <a-input-number
                style="width:200px"
                :precision="2"
                :min="0"
                v-model="model.money"
                placeholder="请输入自购金额满"
              />
            </a-radio>
            <div style="display:flex;align-itmes:center">
              <a-radio value="2" :style="radioStyle">
                直推
                <a-input-number
                  style="width:200px"
                  :precision="0"
                  :min="0"
                  v-model="model.pushingNumber"
                  placeholder="请输入直推人数"
                />
                个
              </a-radio>
              <a-select v-model="model.marketingBusinessDesignationId" placeholder="请选择直推称号" style="width:250px">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option
                  v-for="(item, index) in marketingBusinessDesignationList"
                  :key="index"
                  :value="item.id"
                  >{{ item.designationName }}</a-select-option
                >
              </a-select>
            </div>
            <a-radio value="3" :style="radioStyle">
              业绩完成次数
              <a-input-number
                style="width:200px"
                :precision="0"
                :min="0"
                v-model="model.completionTimes"
                placeholder="请输入"
              />
              次
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="自购金额">
          <a-input-number v-decorator="['money', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="直推人数">
          <a-input-number v-decorator="['pushingNumber', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="直推称号id">
          <a-input placeholder="请输入直推称号id" v-decorator="['marketingBusinessDesignationId', {}]" />
        </a-form-item> -->
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="规则描述">
          <j-editor v-decorator="['rulesDescription', validatorRules.rulesDescription]" triggerChange></j-editor>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import JEditor from '@/components/jeecg/JEditor'
import Vue from 'vue'
export default {
  name: 'MarketingBusinessDesignationModal',
  components: {
    JEditor
  },
  data() {
    return {
      title: '操作',
      visible: false,
      headers: '',
      model: {
        money: '',
        marketingBusinessDesignationId: '',
        pushingNumber: ''
      },
      marketingBusinessDesignationList: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      radioStyle: {
        display: 'block',
        marginBottom: '20px',
        height: '30px',
        lineHeight: '30px'
      },
      //图标
      iconFileList: [],
      iconPreviewVisible: false,
      iconPreviewImage: '',
      iconFilePic: true,

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        designationName: {
          rules: [
            {
              required: true,
              message: '请输入称号名称!'
            }
          ]
        },
        isDefault: {
          rules: [
            {
              required: true,
              message: '请选择是否默认!'
            }
          ]
        },
        grade: {
          rules: [
            {
              required: true,
              message: '请输入级别!'
            }
          ]
        },
        rulesDescription: {
          rules: [
            {
              required: false,
              message: '请输入规则描述'
            }
          ]
        },
        getWay: {
          rules: [
            {
              required: true,
              message: '请选择获得方式'
            }
          ]
        }
      },
      url: {
        add: '/marketingBusinessDesignation/marketingBusinessDesignation/add',
        edit: '/marketingBusinessDesignation/marketingBusinessDesignation/edit',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        findMarketingBusinessDesignationMaps:
          'marketingBusinessDesignation/marketingBusinessDesignation/findMarketingBusinessDesignationMaps'
      }
    }
  },
  created() {
    this.findMarketingBusinessDesignationMaps()
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
  },
  computed: {
    uploadAction() {
      return this.url.fileUpload
    }
  },
  methods: {
    findMarketingBusinessDesignationMaps() {
      getAction(this.url.findMarketingBusinessDesignationMaps).then(res => {
        if (res.success) {
          this.marketingBusinessDesignationList = res.result
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    add() {
      this.edit({})
    },
    edit(record) {
      this.iconFileList = []

      this.form.resetFields()
      this.model = Object.assign(
        {},
        {
          money: '',
          marketingBusinessDesignationId: '',
          pushingNumber: ''
        },
        record
      )
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'year',
            'month',
            'day',
            'delFlag',
            'designationName',
            'icon',
            'isDefault',
            'grade',
            'getWay',
            'money',
            'pushingNumber',
            'marketingBusinessDesignationId',
            'ruleDescription',
            'status',
            'statusExplain',
            'delExplain'
          )
        )
        //时间格式化
        try {
          if (record.icon) {
            let iconIcons = Object.values(JSON.parse(record.icon))
            let iconIconsSz = []
            //图标
            for (let a = 0; a < iconIcons.length; a++) {
              let obj = {
                uid: a,
                url: this.url.imgerver + '/' + iconIcons[a],
                response: {
                  message: iconIcons[a]
                }
              }
              iconIconsSz.push(obj)
            }
            this.iconFileList = iconIconsSz
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
    //图标
    iconFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 0.2
      if (!isLt2M) {
        this.$message.error('图片大小必须在200k以内!')
      }
      this.iconFilePic = isLt2M
      return isLt2M
    },

    iconHandleCancel() {
      this.iconPreviewVisible = false
    },
    iconHandlePreview(file) {
      this.iconPreviewImage = file.url || file.thumbUrl
      this.iconPreviewVisible = true
    },
    iconHandleChange({ fileList }) {
      this.iconFileList = fileList
    },
    handleOk() {
      const that = this
      if (this.iconFileList.length <= 0) {
        this.$message.warn('请上传图标')
        return
      }
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = 'post'
          if (!this.model.id) {
            httpurl += this.url.add
          } else {
            httpurl += this.url.edit
          }
          let formData = Object.assign(this.model, values)
          //时间格式化

          let iconIcon = {}
          for (let count = 0; count < this.iconFileList.length; count++) {
            iconIcon[count] = this.iconFileList[count].response.message
          }
          formData.icon = this.iconFileList.length > 0 ? JSON.stringify(iconIcon) : ''
          if (formData.getWay == 1 && formData.money === '') {
            that.confirmLoading = false
            this.$message.warn('请输入自购金额满')
            return
          }
          if (formData.getWay == 2) {
            if (formData.pushingNumber === '') {
              that.confirmLoading = false
              this.$message.warn('请输入直推人数')
              return
            }
            if (formData.marketingBusinessDesignationId === '') {
              that.confirmLoading = false
              this.$message.warn('请选择直推称号')
              return
            }
          }
          if (formData.getWay == 3) {
            if (formData.completionTimes === '') {
              that.confirmLoading = false
              this.$message.warn('请输入业绩完成人数')
              return
            }
          }
          for (let key in formData) {
            if (formData[key] == undefined) {
              formData[key] = ''
            }
          }

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
