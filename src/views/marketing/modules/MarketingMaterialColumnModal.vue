<template>
  <div>
    <a-modal
      title="操作"
      :width="800"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="栏目名称">
            <a-input placeholder="请输入栏目名称" v-decorator="['name', validatorRules.name]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="英文名称">
            <a-input placeholder="请输入英文名称" v-decorator="['englishName', validatorRules.englishName]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
            <a-input-number v-decorator="['sort', validatorRules.sort]" />
          </a-form-item>
          <!-- <a-form-item
             :labelCol="labelCol"
             :wrapperCol="wrapperCol"
             label="图标">
             <a-input placeholder="请输入图标" v-decorator="['logoAddr', {}]" />
           </a-form-item>-->

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="图标">
            <a-upload
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :action="uploadAction"
              :data="{ isup: 1 }"
              :headers="headers"
              :beforeUpload="beforeUpload"
              @change="handleChange"
            >
              <img preview="1" v-if="picUrl" :src="getAvatarView()" alt="头像" style="height:104px;max-width:300px" />
              <div v-else>
                <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
            <div>
              请上传分类图片，支持jpg、jpeg、png格式，大小不超过500k
            </div>
            <!--<a-input placeholder="请输入图片地址"  v-decorator="['pictureAddr', {}]" >{{ pictureAddr }}</a-input>-->
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="关联活动" v-if="!confirmLoading">
            <a-select
              style="width: 200px"

              show-search
              @search="handleSearch"
              v-decorator="['marketingActivityListId', validatorRules.marketingActivityListId]"
            >
              <a-select-option value="">
                请选择
              </a-select-option>
              <a-select-option v-for="(item, index) in marketingActivityListIdLists" :key="index" :value="item.id">
                {{ item.activityName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <!--停用弹出-->
    <a-modal :title="title" v-model="visibleStopStatus" @ok="hideModalStopStatus()" okText="确认" cancelText="取消">
      <input style="display: none" :value="marketingMaterialColumnId" placeholder="id" />
      <i style="color: #faad14;font-size: 22px;margin-right: 16px;float: left;">
        <svg
          viewBox="64 64 896 896"
          data-icon="question-circle"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
          class=""
        >
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
          ></path>
          <path
            d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0 1 30.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"
          ></path>
        </svg>
      </i>
      <h3>停用后，栏目将无法使用。</h3>
      <p>您确定要停用吗？</p>
      <a-textarea placeholder="停用原因" v-model="closeExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
    </a-modal>
  </div>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { disabledAuthFilter } from '@/utils/authFilter'
import Vue from 'vue'
export default {
  name: 'MarketingMaterialColumnModal',
  data() {
    return {
      title: '操作',
      visible: false,
      visibleStopStatus: false,
      marketingMaterialColumnId: '',
      closeExplain: '',
      model: {},
      headers: {},
      picUrl: '',
      //活动列表
      marketingActivityListIdLists: [],

      uploadLoading: false,
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
        name: { rules: [{ required: true, message: '请输入栏目名称!' }] },
        englishName: { rules: [{ required: true, message: '请输入英文名称' }] },
        sort: { rules: [{ required: true, message: '排序不能为空!' }] },
        marketingActivityListId: { rules: [{ required: true, message: '请选择关联活动!' }] }
      },

      url: {
        add: '/marketingMaterialColumn/marketingMaterialColumn/add',
        edit: '/marketingMaterialColumn/marketingMaterialColumn/edit',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        updateStatus: '/marketingMaterialColumn/marketingMaterialColumn/updateStatus',
        // 活动列表 GET
        getFindMarketingActivityListByName: '/marketing/marketingActivityList/findMarketingActivityListByName'
      }
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    this.getMarketingActivityList()
  },
  computed: {
    uploadAction: function() {
      return this.url.fileUpload
    }
  },
  methods: {
    handleSearch(value) {
      this.getMarketingActivityList(value)
    },
    add() {
      this.edit({})
    },
    //活动列表数据
    getMarketingActivityList(name) {
      return new Promise((resolve, reject) => {
        getAction(this.url.getFindMarketingActivityListByName, { name }).then(res => {
          if (res.success) {
            this.marketingActivityListIdLists = res.result
            resolve('success')
          } else {
            this.$message.warn(res.message || '网络波动，请稍后刷新页面重试！')
            reject(`栏目列表接口500！具体原因${res.message}`)
          }
        })
      })
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      //预览显示图片
      if (record.hasOwnProperty('id')) {
        this.picUrl = 'Has no pic url yet'
      }
      this.visible = true

      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'year',
            'month',
            'day',
            'delFlag',
            'name',
            'englishName',
            'marketingActivityListId',
            'logoAddr',
            'sort',
            'status',
            'closeExplain'
          )
        )
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
          if (values.status) {
            //新增默认启用
            values.status = '1'
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
    },
    //图片上传
    //图片上传
    normFile(e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    beforeUpload: function(file) {
      var fileType = file.type
      if (fileType.indexOf('image') < 0) {
        this.$message.warning('请上传图片')
        return false
      }
      //TODO 验证文件大小
    },
    handleChange(info) {
      this.picUrl = ''
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        this.uploadLoading = false
        console.log(response)
        if (response.success) {
          //this.model.avatar = response.message;
          this.model.logoAddr = response.message
          console.log('this.pictureAddr:', this.logoAddr)
          this.picUrl = 'Has no pic url yet'
        } else {
          this.$message.warning(response.message)
        }
      }
    },
    getAvatarView() {
      console.log(this.url.imgerver + '/' + this.model.logoAddr)
      return this.url.imgerver + '/' + this.model.logoAddr
    },
    ...mapGetters(['nickname', 'logoAddr', 'userInfo']),
    //停用弹窗
    showModalStopStatus(id) {
      this.marketingMaterialColumnId = id
      this.visibleStopStatus = true
      this.closeExplain = ''
    },
    //停用
    hideModalStopStatus() {
      this.visibleStopStatus = false
      console.log('this.closeExplain=', this.closeExplain)
      var that = this
      getAction(that.url.updateStatus, {
        ids: this.marketingMaterialColumnId,
        closeExplain: this.closeExplain,
        status: '0'
      }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.$emit('ok') //发送父级主键刷新
        } else {
          that.$message.success('修改失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
