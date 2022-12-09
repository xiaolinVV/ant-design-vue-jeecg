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
          label="联系人">
          <a-input
            placeholder="请输入联系人"
            v-decorator="['contactName', { rules: [{ required: true, message: '请输入联系人' }]}]"
           ></a-input>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="手机号">
          <a-input
            placeholder="请输入手机号"
            v-decorator="['contactPhone', { rules: [{ required: true, message: '请输入手机号' },{pattern: /^1[3456789]\d{9}$/,message: '请输入正确的手机号'}]}]"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="电话号">
          <a-input placeholder="请输入电话号" v-decorator="['contactTelephone', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="所在城市"
        >
          <a-cascader
            :options="cityAllData"
            @change="cityAllDataChange"
            :loadData="cityAllDataLoad"
            changeOnSelect
            v-if="canShowDefaultCity"
            v-decorator="['defaultCity', { rules: [{ required: true, message: '请选择区域' }],initialValue:defaultCity }]"
            placeholder="请选择区域"
          />
          <lable style="font-size:12px;">需填写完整的省/市/区信息</lable>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="详细地址">
          <a-input placeholder="请输入详细地址"
                   v-decorator="['detailedAddress', { rules: [{ required: true, message: '请输入详细地址' }]}]"
          />
        </a-form-item>
		
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { getAction , httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import Vue from 'vue'
  export default {
    name: "ProviderAddressModal",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {
          areaAddress: '',
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        //所在城市联想
        cityAllData:[

        ],
        //可以显示回显默认地址
        canShowDefaultCity:false,
        //编辑回显的默认地址
        defaultCity:'',
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {},
        RadioGroup: 1,
        isPeisong: '1',
        exemptionPostage: '',//地址一级options
        //地址转换拼接地址
        areaAddressList: ['', '', ''],
        sysAreaId: '',
        areaAddress: '',
        AllData:{
          sysAreaId:''
        },
        url: {
          add: "/providerAddress/providerAddress/add",
          edit: "/providerAddress/providerAddress/edit",
          getList: "/sysArea/sysArea/getList",
          findByParentId: "/sysArea/sysArea/findByParentId",
        },
      }
    },
    computed: {
      uploadAction: function () {
        return this.url.fileUpload;
      },
    },
    created () {
    },
    methods: {
      initIndex() {
        initDictOptions('straight').then((res) => {
          if (res.success) {
            this.straight = res.result;
          }
        });
      },
      push1(){
        this.$router.go(-1)
      },
      add () {
        this.edit();
      },
      edit (record) {
        this.canShowDefaultCity = false
        if (record) {
          console.log(record)
          //所在城市回显
          this.areaAddressList = record.areaAddress.split('-')
          this.getList(()=>{
            //所在城市回显
            if(record.sysAreaId){
              this.cityEchoDisplay(record);
            }else{
              this.canShowDefaultCity = true
            }
          });
        }else{
          this.areaAddressList = []
          this.defaultCity = ''
          this.getList(()=>{
            this.canShowDefaultCity = true
          })

        }
        // this.form.resetFields();
        this.model = record;
        this.model.delFlag = 0;
        this.model.isDeliver = 0;
        this.model.isReturn = 0;
        this.visible = true;
        this.$nextTick(()=>{
          this.form.setFieldsValue(record)
        })


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
            that.model.sysAreaId = that.AllData.sysAreaId
            that.model.areaAddress = that.areaAddressList.join('-');
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
      //所在城市地址选择完成事件
      cityAllDataChange(value,selectedOptions){
        let sz = []
        for (let item of selectedOptions){
          sz.push(item.label)
        }
        this.AllData.sysAreaId = value.join(',')
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
        let sz = info.sysAreaId.split(',');
        let cityAllData = this.cityAllData
        this.defaultCity =  info.sysAreaId.split(',').map(item=>{
          return item * 1
        })
        //第一个id请求其对应的子地址
        getAction(this.url.findByParentId,{id:sz[0]}).then(res=>{
          if (res.success && res.result.length>0){
            let sz2 = []; //子地址
            for(let item of res.result){
              sz2.push( {
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
          }else{
            this.canShowDefaultCity = true
            console.log('空值')
          }
        })

      },
      //获取包邮配送区域地址和所在城市一级options联想地址
      getList(callback) {
        getAction(this.url.getList).then((res)=>{
          if (res.success){
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
            this.$nextTick(()=>{
              callback()
            })
          }else {
            this.$message.warning(res.message);
          }
        });
      },
    }
  }
</script>

<style lang="less" scoped>

</style>