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
      <a-form :form="form" v-if="title != '虚拟人数设置'">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="直播间名称">
          <a-input placeholder="请输入直播间名称" v-decorator="validatorRules.roomName" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="直播群id">
          <a-input placeholder="请输入直播群id" v-decorator="validatorRules.groupId" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="预告时间">
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="validatorRules.noticeTime" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开播时间">
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="validatorRules.startTime" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结束时间">
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="validatorRules.endTime" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          validate-status="validating"
          help="将以分享卡片的形式呈现，建议尺寸：800像素 * 640像素，图片大小不得超过1M。"
          :colon="false"
        >
          <div slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            <span style="margin-right: 10px">
              分享图:
            </span>
          </div>

          <div class="clearfix">
            <a-upload
              :action="uploadAction"
              :beforeUpload="postersUpload"
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
          </div>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          validate-status="validating"
          help="将会出现在直播频道内，图片建议大小为 800像素 * 800像素,图片大小不超过 300KB。"
          :colon="false"
        >
          <div slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            <span style="margin-right: 10px">
              封面图:
            </span>
          </div>

          <div class="clearfix">
            <a-upload
              :action="uploadAction"
              :beforeUpload="surfacePlotUpload"
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
          </div>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          validate-status="validating"
          help="背景墙是每个直播间的默认背景。建议尺寸：750像素 * 1334像素，图片大小不得超过 3M。"
          :colon="false"
        >
          <div slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            <span style="margin-right: 10px">
              背景墙:
            </span>
          </div>

          <div class="clearfix">
            <a-upload
              :action="uploadAction"
              :beforeUpload="wallPanelUpload"
              :fileList="wallPanelFileList"
              :headers="headers"
              @change="wallPanelHandleChange"
              @preview="wallPanelHandlePreview"
              listType="picture-card"
            >
              <div v-if="wallPanelFileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :footer="null" :visible="wallPanelPreviewVisible" @cancel="wallPanelHandleCancel">
              <img :src="wallPanelPreviewImage" alt="example" style="width: 100%" />
            </a-modal>
          </div>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="主播名字">
          <a-input placeholder="请输入主播名字" v-decorator="validatorRules.hostName" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          validate-status="validating"
          help="建议尺寸：400像素 * 400像素，图片大小不得超过 1M。"
          :colon="false"
        >
          <div slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            <span style="margin-right: 10px">
              主播头像:
            </span>
          </div>

          <div class="clearfix">
            <a-upload
              :action="uploadAction"
              :beforeUpload="headPortraitUpload"
              :fileList="headPortraitFileList"
              :headers="headers"
              @change="headPortraitHandleChange"
              @preview="headPortraitHandlePreview"
              listType="picture-card"
            >
              <div v-if="headPortraitFileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :footer="null" :visible="headPortraitPreviewVisible" @cancel="headPortraitHandleCancel">
              <img :src="headPortraitPreviewImage" alt="example" style="width: 100%" />
            </a-modal>
          </div>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input-number v-decorator="validatorRules.sort" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="温馨提示">
          <div>
            开播时间段仅供参考，不是实际直播间可以开播的时间
          </div>
          <div>
            直播间在开始时间前也可以开播，并且到结束时间后不会强制结束。
          </div>
          <div>
            若到结束时间仍未开播，则直播间无法再开播
          </div>
        </a-form-item>
      </a-form>
      <a-form :form="form" v-else>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="当前在线人数">
          <div style="width:150px;display: flex;justify-content:space-between">
            <div>
              {{ model.onlineNumber }}
            </div>
            <a @click="refresh">刷新</a>
          </div>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="虚拟在线人数">
          <a-input-number
            :min="0"
            :precision="0"
            style="width:150px"
            placeholder="请输入虚拟在线人数"
            v-decorator="validatorRules.virtualOnlineNumber"
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
import { getAction } from '../../../api/manage'
export default {
  name: 'MarketingLiveStreamingModal',
  data() {
    return {
      title: '',
      visible: false,
      model: {},
      headers: '',
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
        virtualOnlineNumber: [
          'virtualOnlineNumber',
          {
            rules: [
              {
                required: true,
                message: '请输入虚拟在线人数!'
              }
            ]
          }
        ],
        roomName: [
          'roomName',
          {
            rules: [
              {
                required: true,
                message: '请输入直播间名称!'
              }
            ]
          }
        ],
        groupId: [
          'groupId',
          {
            rules: [
              {
                required: true,
                message: '请输入直播群ID!'
              }
            ]
          }
        ],
        noticeTime: [
          'noticeTime',
          {
            rules: [
              {
                required: true,
                message: '请选择预告时间!'
              }
            ]
          }
        ],
        startTime: [
          'startTime',
          {
            rules: [
              {
                required: true,
                message: '请选择开播时间!'
              }
            ]
          }
        ],
        endTime: [
          'endTime',
          {
            rules: [
              {
                required: true,
                message: '请选择结束时间!'
              }
            ]
          }
        ],
        hostName: [
          'hostName',
          {
            rules: [
              {
                required: true,
                message: '请输入主播名字!'
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
        ]
      },
      //分享图 配置
      postersFileList: [],
      postersPreviewVisible: false,
      postersPreviewImage: '',
      postersPic: true,
      //封面图 配置
      surfacePlotFileList: [],
      surfacePlotPreviewVisible: false,
      surfacePlotPreviewImage: '',
      surfacePlotPic: true,
      //背景图 配置
      wallPanelFileList: [],
      wallPanelPreviewVisible: false,
      wallPanelPreviewImage: '',
      wallPanelPic: true,
      //头像 配置
      headPortraitFileList: [],
      headPortraitPreviewVisible: false,
      headPortraitPreviewImage: '',
      headPortraitPic: true,
      url: {
        add: '/marketing/marketingLiveStreaming/add',
        edit: '/marketing/marketingLiveStreaming/edit',
        queryById: '/marketing/marketingLiveStreaming/queryById'
      },
      //配置
      configure: {
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
      }
    }
  },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
  },
  computed: {
    uploadAction() {
      return this.configure.fileUpload
    }
  },
  methods: {
    refresh() {
      getAction(this.url.queryById, { id: this.model.id }).then(res => {
        if (res.success) {
          console.log(res)
          this.model.onlineNumber = res.result.onlineNumber
        }
      })
    },
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      if (record.modalTitle == '虚拟人数设置') {
        this.title = record.modalTitle
      } else {
        this.title = '操作'
      }
      if (record.posters) {
        let posters = Object.values(JSON.parse(record.posters))
        let postersSz = []
        //详情图返显
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
      } else {
        this.postersFileList = []
      }
      if (record.surfacePlot) {
        let surfacePlot = Object.values(JSON.parse(record.surfacePlot))
        let surfacePlotSz = []
        //详情图返显
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
      } else {
        this.surfacePlotFileList = []
      }
      if (record.wallPanel) {
        let wallPanel = Object.values(JSON.parse(record.wallPanel))
        let wallPanelSz = []
        //详情图返显
        for (let a = 0; a < wallPanel.length; a++) {
          let obj = {
            uid: a,
            url: this.configure.imgErver + '/' + wallPanel[a],
            response: {
              message: wallPanel[a]
            }
          }
          wallPanelSz.push(obj)
        }
        this.wallPanelFileList = wallPanelSz
      } else {
        this.wallPanelFileList = []
      }
      if (record.headPortrait) {
        let headPortrait = Object.values(JSON.parse(record.headPortrait))
        let headPortraitSz = []
        //详情图返显
        for (let a = 0; a < headPortrait.length; a++) {
          let obj = {
            uid: a,
            url: this.configure.imgErver + '/' + headPortrait[a],
            response: {
              message: headPortrait[a]
            }
          }
          headPortraitSz.push(obj)
        }
        this.headPortraitFileList = headPortraitSz
      } else {
        this.headPortraitFileList = []
      }

      this.$nextTick(() => {
        this.refresh()
        this.form.setFieldsValue(pick(this.model, 'roomName', 'hostName', 'sort', 'groupId', 'virtualOnlineNumber'))
        //时间格式化
        this.form.setFieldsValue({ noticeTime: this.model.noticeTime ? moment(this.model.noticeTime) : null })
        this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
        this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
        this.form.setFieldsValue({ streamEndTime: this.model.streamEndTime ? moment(this.model.streamEndTime) : null })
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      if (!this.postersFileList || this.postersFileList.length <= 0) {
        this.$message.warn('请上传分享图')
        return
      }
      if (!this.surfacePlotFileList || this.surfacePlotFileList.length <= 0) {
        this.$message.warn('请上传封面图')
        return
      }
      if (!this.wallPanelFileList || this.wallPanelFileList.length <= 0) {
        this.$message.warn('请上传背景墙')
        return
      }
      if (!this.headPortraitFileList || this.headPortraitFileList.length <= 0) {
        this.$message.warn('请上传主播头像')
        return
      }
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
          //时间格式化
          console.log(formData)
          try {
            formData.noticeTime = formData.noticeTime ? formData.noticeTime.format('YYYY-MM-DD HH:mm:ss') : null
            formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null
            formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null
            formData.streamEndTime = formData.streamEndTime
              ? formData.streamEndTime.format('YYYY-MM-DD HH:mm:ss')
              : null
          } catch (error) {
            console.log('地址解析错误', error)
          }

          let postersFileList = {}
          for (let count = 0; count < this.postersFileList.length; count++) {
            postersFileList[count] = this.postersFileList[count].response.message
          }
          formData.posters = JSON.stringify(postersFileList)

          let surfacePlotFileList = {}
          for (let count = 0; count < this.surfacePlotFileList.length; count++) {
            surfacePlotFileList[count] = this.surfacePlotFileList[count].response.message
          }
          formData.surfacePlot = JSON.stringify(surfacePlotFileList)

          let wallPanelFileList = {}
          for (let count = 0; count < this.wallPanelFileList.length; count++) {
            wallPanelFileList[count] = this.wallPanelFileList[count].response.message
          }
          formData.wallPanel = JSON.stringify(wallPanelFileList)

          let headPortraitFileList = {}
          for (let count = 0; count < this.headPortraitFileList.length; count++) {
            headPortraitFileList[count] = this.headPortraitFileList[count].response.message
          }
          formData.headPortrait = JSON.stringify(headPortraitFileList)

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
    },
    postersUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('图片大小必须在1M以内!')
      }
      this.postersPic = isLt2M
      return isLt2M
    },
    //上传详情图
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

    surfacePlotUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 0.3
      if (!isLt2M) {
        this.$message.error('图片大小必须在300k以内!')
      }
      this.surfacePlotPic = isLt2M
      return isLt2M
    },
    //上传详情图
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

    wallPanelUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 3
      if (!isLt2M) {
        this.$message.error('图片大小必须在3M以内!')
      }
      this.wallPanelPic = isLt2M
      return isLt2M
    },
    //上传详情图
    wallPanelHandleCancel() {
      this.wallPanelPreviewVisible = false
    },
    wallPanelHandlePreview(file) {
      this.wallPanelPreviewImage = file.url || file.thumbUrl
      this.wallPanelPreviewVisible = true
    },
    wallPanelHandleChange({ fileList }) {
      this.wallPanelFileList = fileList
    },
    headPortraitUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 3
      if (!isLt2M) {
        this.$message.error('图片大小必须在3M以内!')
      }
      this.headPortraitPic = isLt2M
      return isLt2M
    },
    //上传详情图
    headPortraitHandleCancel() {
      this.headPortraitPreviewVisible = false
    },
    headPortraitHandlePreview(file) {
      this.headPortraitPreviewImage = file.url || file.thumbUrl
      this.headPortraitPreviewVisible = true
    },
    headPortraitHandleChange({ fileList }) {
      this.headPortraitFileList = fileList
    }
  }
}
</script>

<style lang="less" scoped></style>
