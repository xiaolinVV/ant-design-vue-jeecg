<template>
  <div>
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
            label="栏目名称">
            <a-input placeholder="请输入栏目名称" v-decorator="['name', validatorRules.name]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="英文名称">
            <a-input placeholder="请输入英文名称" v-decorator="['englishName', validatorRules.englishName]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="排序">
            <a-input-number v-decorator="[ 'sort', validatorRules.sort]" />
          </a-form-item>
          <!-- <a-form-item
             :labelCol="labelCol"
             :wrapperCol="wrapperCol"
             label="图标">
             <a-input placeholder="请输入图标" v-decorator="['logoAddr', {}]" />
           </a-form-item>-->

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="图标">
            <a-upload
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :action="uploadAction"
              :data="{'isup':1}"
              :headers="headers"
              :beforeUpload="beforeUpload"
              @change="handleChange"
            >
              <img preview="1" v-if="picUrl" :src="getAvatarView()" alt="头像" style="height:104px;max-width:300px"/>
              <div v-else>
                <a-icon :type="uploadLoading ? 'loading' : 'plus'"/>
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
            <div>
              请上传分类图片，支持jpg、jpeg、png格式，大小不超过500k
            </div>
            <!--<a-input placeholder="请输入图片地址"  v-decorator="['pictureAddr', {}]" >{{ pictureAddr }}</a-input>-->
          </a-form-item>


        </a-form>
      </a-spin>
    </a-modal>
    <!--停用弹出-->
    <a-modal title="停用" v-model="visibleStopStatus" @ok="hideModalStopStatus()" okText="确认" cancelText="取消">
      <input style="display: none"  :value="marketingMaterialColumnId"  placeholder="id"/>
      <h3>停用后，栏目将无法使用。</h3>
      <p>您确定要停用吗？</p>
      <a-textarea
        placeholder="停用原因"
        v-model="closeExplain"
        :autosize="{ minRows: 3, maxRows: 6 }"
      />
    </a-modal>
  </div>

</template>

<script>
  import { httpAction,getAction,putAction  } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import { mapGetters } from 'vuex'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import { disabledAuthFilter } from '@/utils/authFilter'
  import Vue from 'vue'
  export default {
    name: "MarketingMaterialColumnModal",
    data () {
      return {
        title:"操作",
        visible: false,
        visibleStopStatus:false,
        marketingMaterialColumnId:'',
        closeExplain:"",
        model: {},
        headers: {},
        picUrl:'',

        uploadLoading: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          name:{ rules: [{ required: true, message: '请输入栏目名称!' }] },
          englishName: { rules: [{ required: true, message: '请输入英文名称' }] },
          sort: { rules: [{ required: true, message: '排序不能为空!' }] }
        },

        url: {
          add: "/marketingTextbookColumn/marketingTextbookColumn/add",
          edit: "/marketingTextbookColumn/marketingTextbookColumn/edit",
          fileUpload: window._CONFIG['domianURL']+"/sys/common/upload",
          imgerver: window._CONFIG['domianURL']+"/sys/common/view",
          updateStatus:"/marketingMaterialColumn/marketingMaterialColumn/updateStatus"
        },
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN)
      this.headers = { 'X-Access-Token': token }
    },
    computed:{
      uploadAction:function () {
        return this.url.fileUpload;
      }
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        //预览显示图片
        if (record.hasOwnProperty('id')) {
          this.picUrl = 'Has no pic url yet'
        }
        this.visible = true;


        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','name','englishName','logoAddr','sort','status','closeExplain'))
          //时间格式化
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            if (values.status){
              //新增默认启用
              values.status = '1';
            }


            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })



          }
        })
      },
      handleCancel () {
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
        this.marketingMaterialColumnId=id;
        this.visibleStopStatus = true;
        this.closeExplain='';
      },
      //停用
      hideModalStopStatus() {
        this.visibleStopStatus = false;
        console.log("this.closeExplain=",this.closeExplain)
        var that = this;

        putAction(that.url.edit, { id: this.marketingMaterialColumnId,status: "0" ,closeExplain: this.closeExplain }).then((res) => {
          if (res.success) {
            that.$message.success(res.message)
            that.$emit('ok')
            // that.loadData()
            // that.onClearSelected()
          } else {
            that.$message.warning(res.message)
          }
        })

        // getAction(that.url.updateStatus, {ids: this.marketingMaterialColumnId,closeExplain:this.closeExplain,status:'0'}).then((res) => {
        //   if (res.code==200) {
        //     that.$message.success(res.message);
        //     that.$emit('ok');//发送父级主键刷新
        //   } else {
        //     that.$message.success("修改失败");
        //   }
        // });


      },
    }
  }
</script>

<style lang="less" scoped>

</style>