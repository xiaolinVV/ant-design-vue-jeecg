<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="公告标题">
          <a-input placeholder="请输入公告标题" v-decorator="validatorRules.announcementTitle"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <div slot="label">
            <span class="dataCheckedStar">
               *
             </span>
            <span style="margin-right: 10px">
              公告内容:
            </span>
          </div>
          <JEditor
            v-model="model.content"
          >
          </JEditor>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from 'moment'
  import JEditor from '@/components/jeecg/JEditor'

  export default {
    name: 'MarketingFreeAnnouncementModal',
    data() {
      return {
        title: '操作',
        visible: false,
        model: {},
        content:'',
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
          announcementTitle: ['announcementTitle', { rules: [{ required: true, message: '请输入公告标题!' }] }]
        },
        url: {
          add: '/marketing/marketingFreeAnnouncement/add',
          edit: '/marketing/marketingFreeAnnouncement/edit'
        }
      }
    },
    components: {
      JEditor
    },
    created() {
    },
    methods: {
      add() {
        this.edit({})
      },
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        if(!record.content)this.$set(this.model,'content','')
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'announcementTitle'))
          //时间格式化
        })

      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleOk() {
        const that = this
        if(!this.model.content){
          this.$message.warn('请输入富文本!');
          return;
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
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            }).finally(() => {
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

<style lang="less" scoped>

</style>