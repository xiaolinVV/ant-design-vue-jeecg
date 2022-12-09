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
      
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="创建年">-->
<!--          <a-input-number v-decorator="[ 'year', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="创建月">-->
<!--          <a-input-number v-decorator="[ 'month', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="创建日">-->
<!--          <a-input-number v-decorator="[ 'day', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="删除状态（0，正常，1已删除）">-->
<!--          <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-decorator="['delFlag', {}]" />-->
<!--        </a-form-item>-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="专区名称">
          <a-select style="width: 120px" :disabled="model.id" v-decorator="['marketingPrefectureId', validatorRules.marketingPrefectureId]" @change="marketingPrefectureIdChange">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option  v-for="item in prefectureNameList"  :value="item.id">
              {{item.prefectureName}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="专区id">
          {{model.marketingPrefectureId}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="推荐名称">
          <a-input placeholder="请输入推荐名称" v-decorator="['recommendName', validatorRules.recommendName]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="呈现方式">
          <a-radio-group :disabled="model.id" v-decorator="['appearType', validatorRules.appearType]" @change="appearTypeChange">
            <a-radio value="0">栏目推荐</a-radio>
            <a-radio value="1">列表推荐</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          validate-status="validating"
          help="请上传推荐封面图片，尺寸177x130px，支持jpg、jpeg、png格式，大小不超过500k"
          :colon="false"
          v-if="model.appearType != 1"
        >
          <div slot="label">
            <span class="dataCheckedStar">
               *
             </span>
            <span style="margin-right: 10px">
              推荐封面:
            </span>
          </div>
          <a-upload
            :action="uploadAction"
            :headers="headers"
            :fileList="frontCoverFileList"
            :beforeUpload="frontCoverBeforeUpload"
            list-type="picture-card"
            @preview="frontCoverPreview"
            @change="frontCoverChange"
          >
            <div v-if="frontCoverFileList.length < 1">
              <a-icon type="plus"/>
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
          <a-modal :visible="frontCoverPreviewVisible" :footer="null" @cancel="frontCoverCancel">
            <img alt="example" style="width: 100%" :src="frontCoverPreviewImage"/>
          </a-modal>
        </a-form-item>


<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="推荐封面" v-if="model.appearType != 1">-->

<!--          <a-input placeholder="请输入推荐封面" v-decorator="['coverPicture', {}]" />-->

<!--        </a-form-item>-->

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分类推荐" v-else>
<!--          <a-input placeholder="请输入分类推荐" v-decorator="['recommendClassify', {}]" />-->
          <a-radio-group v-decorator="['recommendClassify', validatorRules.recommendClassify]">
            <a-radio value="0">不显示</a-radio>
            <a-radio value="1">显示</a-radio>
          </a-radio-group>

        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序">
          <a-input-number v-decorator="[ 'sort',validatorRules.sort]" />
        </a-form-item>
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="状态；0：停用；1：启用">-->
<!--          <a-input placeholder="请输入状态；0：停用；1：启用" v-decorator="['status', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="停用说明">-->
<!--          <a-input placeholder="请输入停用说明" v-decorator="['closeExplain', {}]" />-->
<!--        </a-form-item>-->
		
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction ,getAction,postAction} from '@/api/manage'
  import Vue from 'vue'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "MarketingPrefectureRecommendModal",
    data () {
      return {
        title:"操作",
        visible: false,
        headers: '',
        uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
        model: {
          appearType:'0',
          marketingPrefectureId:'',
          coverPicture:"",
          recommendClassify:"0",
          status:"1"
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        //推荐封面配置
        frontCoverFileList: [],
        frontCoverPic: true,
        frontCoverPreviewImage: '',
        frontCoverPreviewVisible: false,

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          marketingPrefectureId:{rules: [{ required: true, message: '请选择专区分类!' }]},
          recommendName:{rules: [{ required: true, message: '请输入推荐名称!' }]},
          appearType:{rules: [{ required: true, message: '请选择呈现方式!' }]},
          recommendClassify:{rules: [{ required: true, message: '请选择分类推荐!' }]},
          sort:{rules: [{ required: true, message: '请输入排序!' }]},
        },
        prefectureNameList:[],
        //配置
        configure: {
          imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
        },
        url: {
          add: "/marketingPrefectureRecommend/marketingPrefectureRecommend/add",
          edit: "/marketingPrefectureRecommend/marketingPrefectureRecommend/edit",
          //专区分类左边  参数 prefectureName null || 指定名字
          getMarketingPrefecture: '/marketingPrefecture/marketingPrefecture/getMarketingPrefecture',
        },
      }
    },
    created () {
      this.leftListMethods();
      const token = Vue.ls.get('Access-Token');
      this.headers = { 'X-Access-Token': token };
    },
    methods: {
      //封面图
      frontCoverCancel() {
        this.frontCoverPreviewVisible = false
      },
      async frontCoverPreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj)
        }
        this.frontCoverPreviewImage = file.url || file.preview
        this.frontCoverPreviewVisible = true
      },
      frontCoverChange({ fileList }) {
        if (this.frontCoverPic) {
          this.frontCoverFileList = fileList
        }
      },
      frontCoverBeforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
        const isLt2M = file.size / 1024 / 1024 < 0.5
        if (!isJpgOrPng) {
          this.$message.error('图片必须为jpeg，png,jpg格式!')
        }
        if (!isLt2M) {
          this.$message.error('图片大小必须在500k以内!')
        }
        this.frontCoverPic = isLt2M && isJpgOrPng
        return isLt2M && isJpgOrPng
      },
      //返显图片事件封装
      previewImage(imageLists,thisImageName){
        let that = this;
        if (imageLists && imageLists != '{}') {
          let image = Object.values(JSON.parse(imageLists))
          let sz = []
          for (let a = 0; a < image.length; a++) {
            let obj = {
              uid: a,
              url: that.configure.imgErver + '/' + image[a],
              response: {
                message: image[a]
              }
            }
            sz.push(obj)
          }
          that[thisImageName] = sz
        }
      },
      //提交图片事件封装
      submitImage(thisImageName,allDataImageName){
        let list = {},
          that = this;
        for (let count = 0; count < that[thisImageName].length; count++) {
          list[count] = that[thisImageName][count].response.message
        }
        that.model[allDataImageName] = JSON.stringify(list)
      },
      marketingPrefectureIdChange(e){
        this.model.marketingPrefectureId = e
      },
      appearTypeChange(e){
        this.model.appearType = e.target.value
      },
      // 分类左边方法封装
      leftListMethods(prefectureName = '') {
        getAction(this.url.getMarketingPrefecture, { prefectureName, isViewType: '',isViewPrefectureRecommended:"1"}).then(res => {
          if (res.success) {
            let sz = []
            for(let item of res.result){
              // if(item.isViewRecommend == 1){
                sz.push(item)
              // }
            }
            this.prefectureNameList = sz
          }
        })
      },
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        if(record.id){
          this.previewImage(record.coverPicture,"frontCoverFileList")
          this.appearTypeChange({
            target:record.appearType
          })
        }else{
          this.model =  {
            appearType:'0',
            marketingPrefectureId:'',
            coverPicture:"",
            recommendClassify:'0',
            status:"1"
          }
          this.frontCoverFileList = []
        }
        this.model = Object.assign({},this.model,record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(this.model)
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
               method = 'post';
            }
            let formData = Object.assign(this.model, values);
            if(this.model.appearType != 1 ){
              if(this.frontCoverFileList.length > 0){
                this.submitImage('frontCoverFileList','coverPicture')
              }else{
                this.$message.warn('请上传推荐封面图')
                return;
              }
            }
            if(formData.status === undefined || formData.status === null){
              formData.status = "1"
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


    }
  }
</script>

<style lang="less" scoped>

</style>