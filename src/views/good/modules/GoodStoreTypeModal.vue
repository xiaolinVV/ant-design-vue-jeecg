<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :destroyOnClose="true"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'name', validatorRules.name]" placeholder="请输入分类名称"></a-input>
        </a-form-item>
        <a-form-item v-if="goodTypeId" label="上级分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-if="goodStoreType" v-model="goodStoreType.name" disabled="false"  placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'sort', validatorRules.sort]" placeholder="请输入排序"></a-input>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态"><!--（0：停用；1：启用）-->
          <a-select v-decorator="['status', validatorRules.status]" placeholder="请选择">
            <a-select-option value="0">停用</a-select-option>
            <a-select-option value="1">启用</a-select-option>
          </a-select>
          <!--<a-input placeholder="请输入启用停用状态（0：停用；1：启用）" v-decorator="['status', {}]" />-->
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          style="display: flex;align-items: center"
          label="图片上传"
          >
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :action="uploadAction"
            :data="{'isup':1}"
            :headers="headers"
            v-decorator="['mainPicture',validatorRules.mainPicture]"
            @change="handleChange"
            :beforeUpload="pictureBeforeUpload"
          ><!--:beforeUpload="beforeUpload"-->
            <img v-if="picUrl"  :src="getAvatarView()" alt="头像" style="height:104px;max-width:300px"/>
            <div v-else>
              <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
          <span>
            请上传宽高 不小于140 X 140 ,大小不超过1M的png,jpg图片
          </span>
          <!--<a-form-item label="分类图片地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <j-upload v-decorator="['typePicture']" :trigger-change="true"></j-upload>
          </a-form-item>-->

          <!--<a-input placeholder="请输入图片地址"  v-decorator="['pictureAddr', {}]" >{{ pictureAddr }}</a-input>-->
        </a-form-item>

         <a-form-item style="display: none" label="父级分类id，顶级为空" :labelCol="labelCol" :wrapperCol="wrapperCol">
             <j-tree-select
               ref="treeSelect"
               placeholder="请选择父级分类id，顶级为空"
               v-decorator="['parentId', validatorRules.parentId]"
               dict="good_type,id,id"
               pidField="parent_id"
               hasChildField="has_child">
             </j-tree-select>
           </a-form-item>

           <a-form-item style="display: none" label="是否有子节点" :labelCol="labelCol" :wrapperCol="wrapperCol">
           <a-input v-decorator="[ 'hasChild', validatorRules.hasChild]" placeholder="请输入是否有子节点"></a-input>
         </a-form-item>

        <a-form-item v-if='this.userRole.indexOf("Merchant") === -1' label="所属店铺" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-search-select-tag  :async='false' v-decorator="['sysUserId', { rules: [{ required: true, message: '请选择店铺' }] }]" :dict-options='storeList'  laceholder="请选择店铺"/>
        </a-form-item>

        <!-- <a-form-item label="停用说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
           <a-input v-decorator="[ 'stopRemark', validatorRules.stopRemark]" placeholder="请输入停用说明"></a-input>
         </a-form-item>-->


      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { disabledAuthFilter } from "@/utils/authFilter"
  import {duplicateCheck } from '@/api/api'
  import Vue from 'vue'
  import { getAction } from '@/api/manage'
  import {mapGetters} from 'vuex'
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import JDate from '@/components/jeecg/JDate'
  import JUpload from '@/components/jeecg/JUpload'
  import JTreeSelect from '@/components/jeecg/JTreeSelect'
  export default {
    name: "GoodStoreTypeModal",
    inject:['rush'],
    components: {
      JDate,
      JUpload,
      JTreeSelect
    },
    data () {
      return {
        form: this.$form.createForm(this),
        userRole: this.userInfo().userRole,
        type: '0',
        title:"操作",
        width:800,
        visible: false,
        model: {},
        headers:{},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        uploadLoading:false,
        picUrl:"",
        goodTypeId:"",
        goodStoreType:{},//父级分类数据
        goodTypeLevel:"",
        goodTypeLevelRecord:"",
        typePictureAV:"",
        validatorRules:{
        createBy:{},
        createTime:{},
        updateBy:{},
        updateTime:{},
          name:{rules: [{ required: true, message: '请输入名称!' }]},
        typePicture:{},
        level:{},
        sort:{rules: [{ required: true, pattern:(/^\d+$/), message: '只能输入数字' }]},
        status:{rules: [{ required: true, message: '请选择状态!' }]},
        parentId:{},
        hasChild:{},
        stopRemark:{},
          mainPicture: {
            rules: [{
              validator: this.mainPictureUplode,
            }]
          },
        },
        url: {
          add: "/GoodStoreType/goodStoreType/add",
          edit: "/GoodStoreType/goodStoreType/edit",
          fileUpload: window._CONFIG['domianURL']+"/sys/common/upload",
          imgerver: window._CONFIG['domianURL']+"/sys/common/view",
          queryById:"/GoodStoreType/goodStoreType/queryById",
          getAllStoreList: 'storeManage/storeManage/getAllStoreDictList'
        },
        expandedRowKeys:[],
        pidField:"parentId",
        storeList: []

      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token}
      this.getAllStoreDictList()
    },
    computed:{
      uploadAction:function () {
        return this.url.fileUpload;
      }
    },
    methods: {
      //图片上传
      normFile  (e) {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e
        }
        return e && e.fileList
      },
      beforeUpload: function(file){
        var fileType = file.type;
        if(fileType.indexOf('image')<0){
          this.$message.warning('请上传图片');
          return false;
        }
        //TODO 验证文件大小
      },
      handleChange (info) {
        this.picUrl = "";
        if (info.file.status === 'uploading') {
          this.uploadLoading = true;
          return
        }
        if (info.file.status === 'done') {
          var response = info.file.response;
          this.uploadLoading = false;
          console.log(response);
          if(response.success){
            //this.model.avatar = response.message;
            this.model.typePicture=response.message;
            this.typePictureAV = response.message;
            console.log("this.typePicture:",this.typePicture)
            this.picUrl = "Has no pic url yet";
          }else{
            this.$message.warning(response.message);
          }
        }
      },
      getAvatarView(){
        console.log("ccccccccccccccccccc",this.url.imgerver +"/"+ this.model.typePicture)
        return this.url.imgerver +"/"+ this.model.typePicture;
      },
      ...mapGetters(["nickname", "typePicture", "userInfo"]),
      /*图片上传结束*/

      getAllStoreDictList() {
        getAction(this.url.getAllStoreList, {}).then(res => {
          if (res.success) {
            for (let s of res.result) {
              this.storeList.push(s)
            }
            console.log(this.storeList)
          } else {
            this.$message.warning(res.message)
          }
        })
      },

      add () {
        this.edit({});
      },
      add (goodTypeId,goodTypeLevel) {

        this.goodTypeId=goodTypeId;
       if(this.goodTypeId){
         this.getGoodStoreType();
       }

        this.goodTypeLevel=goodTypeLevel;
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        //判断是否是新增按钮
        if(this.goodTypeLevel==""||this.goodTypeLevel==undefined){
          this.model.level=1;
        }
        if(this.goodTypeId){
          this.model.parentId=this.goodTypeId;
        }
        if(record.parentId){
          this.model.parentId=record.parentId;
        }
        if(record.level){
          this.model.level=record.level;
          this.goodTypeLevelRecord = record.level;
        }
        if(record.typePicture){
          this.typePictureAV = record.typePicture
        }
        if(this.model.delFlag=="" || this.model.delFlag==undefined){
          this.model.delFlag=0;
        }
        if(this.goodTypeLevel!=""||this.goodTypeLevel!=undefined) {
          if (this.goodTypeLevel == "1") {
            this.model.level = "2";
          }
        }
        if(record.level){
          this.model.level=record.level;
        }

        if (!this.model.sysUserId){
           this.model.sysUserId = this.userInfo().id;//获取userID
        }
        console.log("this.model.sysUserId",this.model.sysUserId)
        //预览显示图片
        if(record.hasOwnProperty("id")){
          this.picUrl = "Has no pic url yet";
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'createBy','createTime','updateBy','updateTime','name','typePicture','level','sort','status','parentId','hasChild','stopRemark','sysUserId'))
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.goodTypeLevel = "";
        this.typePictureAV = "";
        this.goodTypeLevelRecord = "";
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
            let old_pid = this.model[this.pidField]
            let formData = Object.assign(this.model, values);
            let new_pid = this.model[this.pidField]
            formData.type = that.type
            console.log("表单提交数据",formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
                that.rush()
                that.submitSuccess(formData,old_pid==new_pid)
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
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'createBy','createTime','updateBy','updateTime','name','typePicture','level','sort','status','parentId','hasChild','stopRemark','sysUserId'))
      },
      submitSuccess(formData,flag){
        if(!formData.id){
          let treeData = this.$refs.treeSelect.getCurrTreeData()
          this.expandedRowKeys=[]
          this.getExpandKeysByPid(formData[this.pidField],treeData,treeData)
          this.$emit('ok',formData,this.expandedRowKeys.reverse());
        }else{
          this.$emit('ok',formData,flag);
        }
      },
      getExpandKeysByPid(pid,arr,all){
        if(pid && arr && arr.length>0){
          for(let i=0;i<arr.length;i++){
            if(arr[i].key==pid){
              this.expandedRowKeys.push(arr[i].key)
              this.getExpandKeysByPid(arr[i]['parentId'],all,all)
            }else{
              this.getExpandKeysByPid(pid,arr[i].children,all)
            }
          }
        }
      },
      //图片校验
      pictureBeforeUpload(file) {
        const isPic = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isPic) {
          this.$message.error('图片格式仅支持JPG,PNG格式!');
        }
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isLt2M) {
          this.$message.error('图片大小必须在1M以内!');
        }
        this.canUploadPic = isPic && isLt2M;
        return isPic && isLt2M;
      },
      /*数据校验*/
      mainPictureUplode(rule, value, callback) {
        //  console.log("this.model.typePicture",this.model.typePicture)
        console.log("goodTypeLevel", this.goodTypeLevel)
        console.log("this.typePictureAV",this.typePictureAV)
        if(this.goodTypeLevel == "1"){
          if (Object.keys(this.typePictureAV).length > 2) {
            callback()
          } else {
            callback("请上传图片");
          }
        }

        if (this.goodTypeLevelRecord == "2"){
          console.log("this.typePictureAV",this.typePictureAV)
          if (Object.keys(this.typePictureAV).length > 2) {
            callback()
          } else {
            callback("请上传图片");
          }
        }else{
          callback()
        }

      },
      //查询父级分类数据
      getGoodStoreType(){
        getAction(this.url.queryById,{id:this.goodTypeId}).then((res) => {
          if (res.success) {
            this.goodStoreType = res.result;

          }
        })
      },

    }
  }
</script>