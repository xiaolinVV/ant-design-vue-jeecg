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
      <a-form :form="form" v-if="model.editType != 2">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="任务标题">
          <a-input placeholder="请输入任务标题" v-decorator="validatorRules.taskTitle" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="任务描述">
          <a-textarea placeholder="请输入任务描述" v-decorator="validatorRules.taskDescription" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="任务方式">
          <!-- ；0：连续签到；1：每日任务；2：唯一任务 -->
          <j-dict-select-tag
            v-decorator="validatorRules.taskeMode"
            @change="taskeModeChange"
            placeholder="请选择任务方式"
            dictCode="task_way"
            :triggerChange="true"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="任务类型" v-if="taskeMode === ''">
          请先选择任务方式
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="任务类型" v-else>
          <!-- ；字典类型：0：注册成功；1：交易密码；2：连续签到；3：每日浏览；4；邀请签到；5：邀请注册 -->
          <j-dict-select-tag
            :triggerChange="true"
            :limitShowValList="taskTypeLimitShowValList"
            v-decorator="validatorRules.taskType"
            placeholder="请选择"
            dictCode="task_type"
            @change="taskTypeChange"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="任务次数" v-if="taskeMode == '0'">
          <a-input-number
            style="width:150px"
            :min="0"
            :precision="0"
            placeholder="请输入任务次数"
            v-decorator="validatorRules.times"
          ></a-input-number>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="任务次数" v-else-if="taskeMode !== ''">
          1
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="签到天数" v-if="taskType == 2">
          <a-input-number
            style="width:150px"
            :min="1"
            :precision="0"
            placeholder="请输入签到天数"
            v-decorator="validatorRules.numberDays"
          />天
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="显示位置">
          <!-- ；0：签到栏；1：任务栏；2：奖励栏 -->
          <a-select placeholder="请选择显示位置" v-decorator="validatorRules.displayPosition">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option :value="0">签到栏</a-select-option>
            <a-select-option :value="1">任务栏</a-select-option>
            <a-select-option :value="2">奖励栏</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否显示">
          <a-radio-group v-decorator="validatorRules.isView">
            <a-radio :value="0">
              不显示
            </a-radio>
            <a-radio :value="1">
              显示
            </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          help="请上传图标237*288 支持jpg、jpeg、png格式，大小不超过500k"
          validate-status="error"
        >
          <span slot="label">
            图标
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
          help="尺寸800*640 支持jpg、jpeg、png格式，大小不超过2M"
          validate-status="error"
        >
          <span slot="label">
            分享图
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

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="奖励类型">
          <a-select placeholder="请选择奖励类型" v-decorator="validatorRules.awardType" @change="awardTypeChange">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option :value="0">水滴</a-select-option>
            <a-select-option :value="1">专区团参团次数</a-select-option>
            <a-select-option :value="2">平台优惠券</a-select-option>
            <a-select-option :value="3">店铺优惠券</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="奖励">
          <a-input-number style="width:150px" :min="0" placeholder="请输入奖励" v-decorator="validatorRules.award" />{{
            awardType == '0' ? '个' : awardType == '1' ? '次' : awardType == '2' || awardType == '3' ? '张' : ''
          }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="券id" v-if="awardType == 2 || awardType == 3">
          <a-input v-decorator="validatorRules.ticketId" placeholder="请输入券id" />
        </a-form-item>

        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态；0：停用；1：启用">
          <a-input placeholder="请输入状态；0：停用；1：启用" v-decorator="['status', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态说明">
          <a-input placeholder="请输入状态说明" v-decorator="['statusExplain', {}]" />
        </a-form-item> -->
      </a-form>
      <a-form :form="form" v-else>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input-number
            style="width:150px"
            :min="0"
            :precision="0"
            placeholder="请输入排序"
            v-decorator="validatorRules.sort"
          />
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
  name: 'MarketingIntegralTaskModal',
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
      //积分配置
      headers: '',
      diagramFileList: [],
      diagramPreviewVisible: false,
      diagramPreviewImage: '',
      diagramFilePic: true,
      //分享图
      coverPlanFileList: [],
      coverPlanPreviewVisible: false,
      coverPlanPreviewImage: '',
      coverPlanFilePic: true,
      confirmLoading: false,
      form: this.$form.createForm(this),
      taskType: '',
      taskeMode: '',
      awardType: '',
      taskTypeLimitShowValList: [],
      validatorRules: {
        ticketId: [
          'ticketId',
          {
            rules: [
              {
                required: true,
                message: '请输入券id!'
              }
            ]
          }
        ],
        isView: [
          'isView',
          {
            rules: [
              {
                required: true,
                message: '请选择是否显示!'
              }
            ]
          }
        ],
        times: [
          'times',
          {
            rules: [
              {
                required: true,
                message: '请输入任务次数!'
              }
            ]
          }
        ],
        taskType: [
          'taskType',
          {
            rules: [
              {
                required: true,
                message: '请选择任务类型!'
              }
            ]
          }
        ],
        numberDays: [
          'numberDays',
          {
            rules: [
              {
                required: true,
                message: '请输入签到天数!'
              }
            ]
          }
        ],
        sort: [
          'sort',
          {
            rules: [
              {
                required: true,
                message: '请输入排序!'
              }
            ]
          }
        ],
        taskTitle: [
          'taskTitle',
          {
            rules: [
              {
                required: true,
                message: '请输入任务标题!'
              }
            ]
          }
        ],
        taskDescription: [
          'taskDescription',
          {
            rules: [
              {
                required: true,
                message: '请输入任务描述!'
              }
            ]
          }
        ],
        taskeMode: [
          'taskeMode',
          {
            rules: [
              {
                required: true,
                message: '请选择任务方式!'
              }
            ]
          }
        ],
        displayPosition: [
          'displayPosition',
          {
            rules: [
              {
                required: false,
                message: '请选择显示位置!'
              }
            ]
          }
        ],
        isView: [
          'isView',
          {
            rules: [
              {
                required: true,
                message: '请选择是否显示!'
              }
            ]
          }
        ],
        award: [
          'award',
          {
            rules: [
              {
                required: true,
                message: '请输入奖励!'
              }
            ]
          }
        ],
        awardType: [
          'awardType',
          {
            rules: [
              {
                required: true,
                message: '请选择奖励类型!'
              }
            ]
          }
        ]
      },
      url: {
        add: '/marketing/marketingIntegralTask/add',
        edit: '/marketing/marketingIntegralTask/edit',
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
    awardTypeChange(value) {
      this.awardType = value
      this.form.resetFields('award')
      this.form.resetFields('ticketId')
    },
    taskeModeChange(value, isEdit = false) {
      this.taskeMode = value
      if (!isEdit) {
        this.form.resetFields('taskType')
      }

      let taskTypeLimitShowValList = [['4', '5', '8', '9'], ['2', '3', '7'], ['0', '1', '6']]
      if (value == '0') {
        if (!isEdit) {
          this.form.resetFields('times')
        }

        this.taskTypeLimitShowValList = taskTypeLimitShowValList[value]
      } else if (value !== '') {
        // if (!isEdit) {
        //   this.form.setFieldsValue({ times: 1 })
        //   console.log('执行了')
        // }

        this.taskTypeLimitShowValList = taskTypeLimitShowValList[value]
      }
    },
    taskTypeChange(value) {
      this.taskType = value
      this.form.resetFields('numberDays')
    },
    add() {
      this.edit({})
    },
    diagramFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 0.5
      if (!isLt2M) {
        this.$message.error('图片大小必须在500k以内!')
      }
      this.diagramFilePic = isLt2M
      return isLt2M
    },
    //图标
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
    coverPlanFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.coverPlanFilePic = isLt2M
      return isLt2M
    },
    //分享图
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
    edit(record) {
      this.form.resetFields()
      this.diagramFileList = []
      this.coverPlanFileList = []

      if (record.id) {
        record.awardType = record.awardType * 1
        record.displayPosition = record.displayPosition * 1
        record.isView = record.isView * 1
        this.taskType = record.taskType * 1
        this.taskeMode = record.taskeMode * 1
        this.awardType = record.awardType * 1
        this.taskeModeChange(record.taskeMode, true)
      }
      if (record.editType == 2) {
        this.title = '排序'
      } else {
        this.title = '操作'
      }

      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        try {
          if (record.taskImg) {
            let taskImgIcons = Object.values(JSON.parse(record.taskImg))
            let taskImgIconsSz = []
            //积分图标返显
            for (let a = 0; a < taskImgIcons.length; a++) {
              let obj = {
                uid: a,
                url: this.url.imgerver + '/' + taskImgIcons[a],
                response: {
                  message: taskImgIcons[a]
                }
              }
              taskImgIconsSz.push(obj)
            }
            this.diagramFileList = taskImgIconsSz
          }
        } catch (e) {
          console.error(e)
        }
        try {
          if (record.coverPlan) {
            let coverPlanIcons = Object.values(JSON.parse(record.coverPlan))
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

        this.form.setFieldsValue(this.model)

        //时间格式化
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      // if (!Array.isArray(this.diagramFileList) || this.diagramFileList.length <= 0) {
      //   this.$message.warn('请上传图标！')
      //   return false
      // }
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
          let taskImgIcon = {}
          for (let count = 0; count < this.diagramFileList.length; count++) {
            taskImgIcon[count] = this.diagramFileList[count].response.message
          }
          let coverPlanIcon = {}
          for (let count = 0; count < this.coverPlanFileList.length; count++) {
            coverPlanIcon[count] = this.coverPlanFileList[count].response.message
          }

          formData.taskImg = this.diagramFileList.length > 0 ? JSON.stringify(taskImgIcon) : ''
          formData.coverPlan = this.coverPlanFileList.length > 0 ? JSON.stringify(coverPlanIcon) : ''
          formData.status = 1
          if (formData.taskeMode != '0' && formData.taskeMode !== '') {
            formData.times = 1
          }
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
