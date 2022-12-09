<template>
  <a-card class="wrap">
    <div class="title">
      代理信息
    </div>
    <a-form style="max-width: 100%; margin: 40px auto 0;">
      <a-alert
        :closable="true"
        message="重要提示：请填写您的信息"
        style="margin-bottom: 24px;"
      />
    </a-form>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="代理编号">
          {{dataAll.id}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户账号">
          {{dataAll.username}}
        </a-form-item>
        <a-form-item label="头像" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :action="uploadAction"
            :data="{'isup':1}"
            :fileList="fileList"
            :headers="headers"
            :beforeUpload="beforeUpload"
            @change="handleChange"
            @preview="handlePreview"
          >
            <div v-if="fileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img preview="1" alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="公司名称">
          {{dataAll.name}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户名字">
          {{dataAll.realname}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="手机号码">
          {{dataAll.phone}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="所在城市">
          <a-cascader
            :options="cityAllData"
            @change="cityAllDataChange"
            :loadData="cityAllDataLoad"
            changeOnSelect
            v-if="canShowDefaultCity"
            :defaultValue='defaultCity'
            placeholder="请选择区域"
            v-decorator="['defaultCity', { rules: [{ required: true, message: '请选择区域' }],initialValue:defaultCity }]"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="详细地址">
          <a-input
            v-decorator="['address', { rules: [{ required: true, message: '请输入详细地址' }] }]"
            placeholder="请输入详细地址"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="公司电话">
          <a-input
            v-model="dataAll.companyPhone"
            placeholder="请输入公司电话"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注说明">
          <a-textarea placeholder="" :rows="4" v-model="dataAll.remark"/>
        </a-form-item>
      </a-form>
      <a-button type="primary" style="margin-left: 8.5%;display: block;" @click="sure()">
        保存
      </a-button>


    </a-spin>
  </a-card>
</template>

<script>
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import Vue from 'vue'
  import {getAction , putAction,postAction} from '@/api/manage'
  import AUpload from "ant-design-vue/es/upload/Upload";
  import AInput from "ant-design-vue/es/input/Input";
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  export default {
    name: "ProviderMessge",
    components: {
      AInput,
      AUpload
    },
    data () {
      return {
        title: "操作",
        visible: false,
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 2},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 8},
        },
        plainOptions:'',
        NoChangeplainOptions:'',
        //所在城市联想
        cityAllData:[
        ],
        //编辑回显的默认地址
        defaultCity:'',
        //地址转换拼接地址
        areaAddressList:[],
        //可以显示回显默认地址
        canShowDefaultCity:false,
        dataAll:{
          id:'',//编号
          username:'',//用户账号
          avatar:'',//头像
          name:'',//公司名称
          realname:'',//用户名字
          phone:'',//手机号码
          agencyAreaId:'',//区域id "1,2,3"
          areaAddress:'',//区域地址说明
          address:'',//详细地址
          companyPhone:'',//公司手机号码
          remark:'',//备注说明
        },
        confirmLoading:false,
        form: this.$form.createForm(this),
        uploadLoading: false,
        headers: {},
        //时间
        selectDateToTime: '',
        //日期选择器返现参数
        dateFormat: 'YYYY-MM-DD',
        // {
        //   uid: '-1',
        //     name: 'image.png',
        //   status: 'done',
        //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
        fileList:[],
        previewVisible: false,
        previewImage: '',
        url:{
          returnProvider:"agencyManage/agencyManage/returnAgencyInfo",//返显信息接口
          edit:"agencyManage/agencyManage/updateAgencyInfo",//编辑
          getList:"/sysArea/sysArea/getList",
          findByParentId: "/sysArea/sysArea/findByParentId",
          fileUpload: window._CONFIG['domianURL']+"/sys/common/upload",
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
        }
      }
    },

    computed:{
      uploadAction(){
        return this.url.fileUpload;
      },
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token};
      let that = this;
      getAction(that.url.returnProvider).then((res)=>{
        if(res.success && res.result){
          if(res.result.avatar){
            this.fileList = [{
              uid: '-1',
              status: 'done',
              url:this.url.imgerver + '/' + res.result.avatar,
              response:{
                message: res.result.avatar
              }
            }]
          }
          this.dataAll = res.result
          // this.$nextTick(()=>{
          this.form.setFieldsValue(res.result)
          // })
          if( res.result.areaAddress){
            this.areaAddressList = res.result.areaAddress.split(',')
          }else{
            this.canShowDefaultCity = true
          }
          // debugger;
          this.getList(()=>{
            //所在城市回显
            this.cityEchoDisplay(res.result);
            // this.canShowDefaultCity = true
          });
        }else{
          this.getList(()=>{
            this.canShowDefaultCity = true
          })
        }
        // console.log(res);

      })
    },
    mounted(){
    },
    methods: {
      beforeUpload: function (file) {
        var fileType = file.type
        if (fileType.indexOf('image') < 0) {
          this.$message.warning('请上传图片')
          return false
        }
        //TODO 验证文件大小
      },
      handleCancel() {
        this.previewVisible = false;
      },
      async handlePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        this.previewImage = file.url || file.preview;
        this.previewVisible = true;
      },
      handleChange({ fileList }) {
        this.fileList = fileList;
      },
      getLogoAddrView() {
        return this.url.imgerver + '/' + this.dataAll.avatar
      },
      //保存
      sure(){
        /*let that = this;*/
        this.form.validateFields((err, values)=>{
          if(!err){
            this.dataAll = Object.assign({},this.dataAll,values)
            if (this.selectDateToTime) {
              let startTime = new Date(this.selectDateToTime[0]._d),
                endTime = new Date(this.selectDateToTime[1]._d);
              this.dataAll.startTime = dayjs(startTime).format('YYYY-MM-DD HH:mm:ss');
              this.dataAll.endTime = dayjs(endTime).format('YYYY-MM-DD HH:mm:ss');
            }
            if(this.fileList.length > 0){
              this.dataAll.avatar = this.fileList[0].response.message
            }else{
              this.dataAll.avatar = ''
            }
            postAction(this.url.edit,this.dataAll).then((res)=>{
              if(res.success){
                this.$message.success(res.message)
              }else{
                this.$message.warn(res.message)
              }
            })
          }
        })
      },
      //所在城市地址选择完成事件
      cityAllDataChange(value,selectedOptions){
        let sz = []
        for (let item of selectedOptions){
          sz.push(item.label)
        }
        this.dataAll.agencyAreaId = value.join(',')
        this.areaAddressList = sz
      },
      //所在城市点击一级，二级，三级分类动态展示数据
      cityAllDataLoad(selectedOptions){
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        getAction(this.url.findByParentId,{id:targetOption.value}).then((res)=>{
          targetOption.loading = false;
          if (res.success && res.result.length>0){
            let sz = []
            for(let item of res.result){
              sz.push( {
                label: item.name,
                value: item.id,
                isLeaf: false
              })
            }
            targetOption.children = sz
          }
          this.cityAllData = [...this.cityAllData];
        });
      },
      //所在城市回显
      cityEchoDisplay(info){
        if(!info.agencyAreaId){
          this.canShowDefaultCity = true
          return
        }
        let sz = info.agencyAreaId.split(',');
        let cityAllData = this.cityAllData
        this.defaultCity =  info.agencyAreaId.split(',').map(item=>{
          return item * 1
        })
        //第一个id请求其对应的子地址
        getAction(this.url.findByParentId,{id:sz[0]}).then(res=>{
          if (res.success && res.result.length>0){
            let sz2 = []; //子地址
            for(let item of res.result){
              sz2.push({
                label: item.name,
                value: item.id,
                isLeaf: false
              })
            }
            for(let item of cityAllData){
              //找到对应的label添加children
              if(this.areaAddressList[0] == item.label){
                item.children = sz2
                getAction(this.url.findByParentId,{id:sz[1]}).then(res2=>{
                  if (res2.success && res2.result.length>0){
                    let sz3 = [];
                    for(let item of res2.result){
                      sz3.push( {
                        label: item.name,
                        value: item.id,
                        isLeaf: false
                      })
                    }
                    for(let item2 of sz2){
                      if(this.areaAddressList[1] == item2.label){
                        item2.children = sz3;
                        this.$nextTick(()=>{
                          this.canShowDefaultCity = true
                        })
                        break;
                      }
                    }
                  }else{
                    this.canShowDefaultCity = true
                    console.log('没有第三季地址')
                  }
                })
                break;
              }
            }
          }
        })

      },
      //获取包邮配送区域地址和所在城市一级options联想地址
      getList(callback) {
        getAction(this.url.getList).then((res)=>{
          if (res.success){
            let  sz = []
            let sz2 = []
            let sz3 = []
            for(let item of res.result){
              sz3.push( {
                label: item.name,
                value: item.id ,
                isLeaf: false,
              })
            }
            //所在城市
            this.cityAllData = sz3
            // //包邮配送区域地址
            for(let item of res.result){
              sz.push(
                { label: item.name, value: item.id }
              )
              sz2.push(item.id)
            }
            if(this.part == 1){
              this.AllData.exemptionPostage = sz2.join(',')
            }
            this.plainOptions = sz
            this.NoChangeplainOptions = sz
            this.$nextTick(()=>{
              callback()
            })
          }else {
            this.$message.warn(res.message);
          }
        });
      },
    }
  }

</script>
<style lang="less">
  .wrap{
    background: white;
    padding-bottom: 20px;
    .title{
      font-size: 20px;
      color: black;
      font-weight: 600;
      padding: 16px 0;
      border-bottom: 1px solid #CCCCCC;
    }
  }

</style>