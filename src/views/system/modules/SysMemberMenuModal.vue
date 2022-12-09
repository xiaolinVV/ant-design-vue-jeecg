<template>
  <div>
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
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="菜单名称">
            <a-input placeholder="请输入菜单名称" v-decorator="['menuName', validatorRules.menuName]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="英文名称">
            <a-input
              :disabled="disabledEnglishName"
              placeholder="请输入英文名称"
              v-decorator="['englishName', validatorRules.englishName]"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="菜单类型"
            ><!--；0：非必须；1：必须-->
            <a-select
              :disabled="disabledMenuType"
              v-decorator="['menuType', validatorRules.menuType]"
              placeholder="请选择"
            >
              <a-select-option value="0">非必须</a-select-option>
              <a-select-option value="1">必须</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            validate-status="validating"
            help=" 尺寸800*800 支持jpg、jpeg、png格式，大小不超过2M"
            :colon="false"
          >
            <div slot="label">
              <span class="dataCheckedStar">
                *
              </span>
              <span style="margin-right: 10px">
                图标:
              </span>
            </div>
            <a-upload
              :action="uploadAction"
              :headers="headers"
              :fileList="menuLogoFileList"
              :beforeUpload="menuLogoBeforeUpload"
              list-type="picture-card"
              @preview="menuLogoPreview"
              @change="menuLogoChange"
            >
              <div v-if="menuLogoFileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  上传
                </div>
              </div>
            </a-upload>
            <a-modal :visible="menuLogoPreviewVisible" :footer="null" @cancel="menuLogoCancel">
              <img preview="1" alt="example" style="width: 100%" :src="menuLogoPreviewImage" />
            </a-modal>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            validate-status="validating"
            help=" 尺寸800*800 支持jpg、jpeg、png格式，大小不超过2M"
            :colon="false"
          >
            <div slot="label">
              <span class="dataCheckedStar">
                *
              </span>
              <span style="margin-right: 10px">
                选中图标:
              </span>
            </div>
            <a-upload
              :action="uploadAction"
              :headers="headers"
              :fileList="menuCurrentLogoFileList"
              list-type="picture-card"
              @preview="menuCurrentLogoPreview"
              @change="menuCurrentLogoChange"
            >
              <!-- :beforeUpload="menuCurrentLogoBeforeUpload" -->
              <div v-if="menuCurrentLogoFileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  上传
                </div>
              </div>
            </a-upload>
            <a-modal :visible="menuCurrentLogoPreviewVisible" :footer="null" @cancel="menuCurrentLogoCancel">
              <img preview="1" alt="example" style="width: 100%" :src="menuCurrentLogoPreviewImage" />
            </a-modal>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
            <a-input-number v-decorator="['sort', validatorRules.sort]" />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <!--停用弹出-->
    <a-modal title="停用" v-model="visibleStopStatus" @ok="hideModalStopStatus()" okText="确认" cancelText="取消">
      <input style="display: none" :value="sysMemberMenuId" placeholder="id" />
      <h3>停用该菜单后，用户端底部菜单将不再显示。</h3>
      <p>您确定要停用吗？</p>
      <a-textarea placeholder="停用原因" v-model="closeExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
    </a-modal>
  </div>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import Vue from 'vue'

export default {
  name: 'SysMemberMenuModal',
  data() {
    return {
      title: '操作',
      visible: false,
      disabledEnglishName: false,
      disabledMenuType: false,
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
      headers: '',
      //图标配置
      menuLogoFileList: [],
      menuLogoPic: true,
      menuLogoPreviewImage: '',
      menuLogoPreviewVisible: false,
      //选中图标配置
      menuCurrentLogoFileList: [],
      menuCurrentLogoPic: true,
      menuCurrentLogoPreviewImage: '',
      menuCurrentLogoPreviewVisible: false,

      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      //停用弹窗
      visibleStopStatus: false,
      sysMemberMenuId: '',
      closeExplain: '',

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        menuName: { rules: [{ required: true, message: '请输入菜单名称' }] },
        englishName: { rules: [{ required: true, message: '请输入菜单英文名称' }] },
        menuType: { rules: [{ required: true, message: '请选择菜单类型' }] },
        sort: { rules: [{ required: true, message: '请输入排序' }] }
      },
      url: {
        add: '/sysMemberMenu/sysMemberMenu/add',
        edit: '/sysMemberMenu/sysMemberMenu/edit',
        updateStatus: '/sysMemberMenu/sysMemberMenu/updateStatus'
      },
      //配置
      configure: {
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      }
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
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        if (!this.model.id) {
          //限制输入英文名
          this.disabledEnglishName = false
          //限制输入类型
          this.disabledMenuType = false
        } else {
          //限制输入英文名
          this.disabledEnglishName = true
          //限制输入类型
          this.disabledMenuType = true
        }
        if (this.model.menuLogo) {
          this.menuLogoFileList = [
            {
              uid: '-1',
              status: 'done',
              url: this.configure.imgerver + '/' + this.model.menuLogo,
              response: {
                message: this.model.menuLogo
              }
            }
          ]
        } else {
          this.menuLogoFileList = []
        }
        //选中图标
        if (this.model.menuCurrentLogo) {
          this.menuCurrentLogoFileList = [
            {
              uid: '-1',
              status: 'done',
              url: this.configure.imgerver + '/' + this.model.menuCurrentLogo,
              response: {
                message: this.model.menuCurrentLogo
              }
            }
          ]
        } else {
          this.menuCurrentLogoFileList = []
        }

        this.form.setFieldsValue(
          pick(
            this.model,
            'year',
            'month',
            'day',
            'delFlag',
            'menuName',
            'englishName',
            'menuType',
            'menuLogo',
            'sort',
            'status',
            'closeExplian',
            'menuCurrentLogo'
          )
        )
        //时间格式化
        this.form.setFieldsValue({ closeTime: this.model.closeTime ? moment(this.model.closeTime) : null })
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
      //限制输入英文名
      //  this.disabledEnglishName = false;
      //限制输入类型
      //    this.disabledMenuType = false;
    },
    handleOk() {
      const that = this

      if (!that.imgUpLoadCheck()) {
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
          //formData.closeTime = formData.closeTime?formData.closeTime.format('YYYY-MM-DD HH:mm:ss'):null;

          if (this.menuLogoFileList && this.menuLogoFileList.length > 0) {
            formData.menuLogo = this.menuLogoFileList[0].response.message
          } else {
            formData.menuLogo = ''
          }
          if (this.menuCurrentLogoFileList && this.menuCurrentLogoFileList.length > 0) {
            formData.menuCurrentLogo = this.menuCurrentLogoFileList[0].response.message
          } else {
            formData.menuCurrentLogo = ''
          }

          console.log(formData)
          httpAction(httpurl, formData, method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
                that.$emit('ok')
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
    //图片格式处理
    getImgView(url = '') {
      if (url) {
        return this.configure.imgerver + '/' + Object.values(JSON.parse(url))[0]
      }
    },
    //图标上传
    menuLogoCancel() {
      this.menuLogoPreviewVisible = false
    },
    async menuLogoPreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.menuLogoPreviewImage = file.url || file.preview
      this.menuLogoPreviewVisible = true
    },
    menuLogoChange({ fileList }) {
      if (this.menuLogoPic) {
        this.menuLogoFileList = fileList
      }
    },

    menuLogoBeforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJpgOrPng) {
        this.$message.error('图片必须为jpeg，png,jpg格式!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.menuLogoPic = isLt2M && isJpgOrPng
      return isLt2M && isJpgOrPng
    },

    //选中图标
    menuCurrentLogoCancel() {
      this.menuCurrentLogoPreviewVisible = false
    },
    async menuCurrentLogoPreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.menuCurrentLogoPreviewImage = file.url || file.preview
      this.menuCurrentLogoPreviewVisible = true
    },
    menuCurrentLogoChange({ fileList }) {
      if (this.menuCurrentLogoPic) {
        this.menuCurrentLogoFileList = fileList
      }
    },

    menuLogoBeforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJpgOrPng) {
        this.$message.error('图片必须为jpeg，png,jpg格式!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.menuCurrentLogoPic = isLt2M && isJpgOrPng
      return isLt2M && isJpgOrPng
    },

    //图片校验
    imgUpLoadCheck() {
      //封面图
      if (!Array.isArray(this.menuLogoFileList) || this.menuLogoFileList.length <= 0) {
        this.$message.warn('请上传图标！')
        return false
      }
      //选中图标图
      if (!Array.isArray(this.menuCurrentLogoFileList) || this.menuCurrentLogoFileList.length <= 0) {
        this.$message.warn('请上传图标！')
        return false
      }

      return true
    },

    //停用弹窗
    showModalStopStatus(id) {
      this.sysMemberMenuId = id
      this.visibleStopStatus = true
      this.closeExplain = ''
    },
    //停用
    hideModalStopStatus() {
      this.visibleStopStatus = false
      console.log('this.statusExplain=', this.closeExplain)
      var that = this
      getAction(that.url.updateStatus, {
        ids: this.sysMemberMenuId,
        closeExplain: this.closeExplain,
        status: '0'
      }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.$emit('ok') //发送父级主键刷新
        } else {
          that.$message.warning('修改失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
