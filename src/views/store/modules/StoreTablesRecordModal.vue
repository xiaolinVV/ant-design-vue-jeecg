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
          label="归属店铺">
          {{storeInfo.storeName}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="桌位名称">
          <a-input placeholder="请输入桌位名称" v-decorator="['tableName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="桌台二维码">
          <a-select v-decorator="['storeTablesId', {}]" >
            <a-select-option :value="item.id" v-for="(item,index) in storeTables" :key="index">{{item.qrCodeName}}({{item.serialNumber}})</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="容纳人数">
          <a-input-number v-model="minPeople" placeholder="请输入"/>------<a-input-number v-model="maxPeople" placeholder="请输入"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态">
          <a-radio-group name="radioGroup" v-decorator="['status', {}]">
            <a-radio value="0">停用</a-radio>
            <a-radio value="1">启用</a-radio>
          </a-radio-group>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {getAction} from '@/api/manage';

  export default {
    name: "StoreTablesRecordModal",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
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
        },
        url: {
          add: "/store/storeTablesRecord/add",
          edit: "/store/storeTablesRecord/edit",
          getStoreTablesByStoreManageId:'store/storeTables/getStoreTablesByStoreManageId'
        },
        storeInfo:{},
        storeTables:[],
        minPeople:'',
        maxPeople:''
      }
    },
    created () {
    },
    methods: {
      getStoreTablesByStoreManageId(){
        getAction(this.url.getStoreTablesByStoreManageId, {storeManageId: this.storeInfo.id}).then((res) => {

          if (res.success) {
            this.storeTables=res.result;
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      add (record) {
        console.log('新增信息',record);
        this.storeInfo=record;
        this.visible = true;
        this.model.status="0";
        this.getStoreTablesByStoreManageId();
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'tableName','status','storeTablesId'))
          //时间格式化
        });

      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.storeInfo.id=record.storeManageId;
        this.storeInfo.storeName=record.storeName;
        this.getStoreTablesByStoreManageId();

        this.minPeople=record.galleryful.substring(0,record.galleryful.indexOf('-'));
        this.maxPeople=record.galleryful.substring(record.galleryful.indexOf('-')+1,record.galleryful.length);

        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'tableName','status','storeTablesId'))
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
            if(!this.minPeople){
              that.confirmLoading = false;
              this.$message.warning('请输入最小容客数量');
              return;
            }
            if(!this.maxPeople){
              that.confirmLoading = false;
              this.$message.warning('请输入最大容客数量');
              return;
            }
            if(!formData.storeTablesId){
              that.confirmLoading = false;
              this.$message.warning('请选择桌台二维码');
              return;
            }
            formData.galleryful=this.minPeople+'-'+this.maxPeople;
            formData.storeManageId=this.storeInfo.id;


            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
                that.close();
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
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