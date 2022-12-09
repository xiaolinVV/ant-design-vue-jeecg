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
          v-if="storeInfo"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="店铺名称">
         {{storeInfo.storeName}}({{storeInfo.subStoreName}})
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="竞价活动">
          <a-radio-group v-model="model.biddingActivities" v-decorator="['biddingActivities', {}]">
            <a-radio :value="0">关闭</a-radio>
            <a-radio :value="1">启用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="藏品征集">
          <a-radio-group v-model="model.collectionCollection" v-decorator="['collectionCollection', {}]">
            <a-radio :value="0">关闭</a-radio>
            <a-radio :value="1">启用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="包厢管理">
          <a-radio-group v-model="model.roomsManagement" v-decorator="['roomsManagement', {}]">
            <a-radio :value="0">关闭</a-radio>
            <a-radio :value="1">启用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="桌台和扫码点餐管理">
          <a-radio-group v-model="model.tablesManagement" v-decorator="['tablesManagement', {}]">
            <a-radio :value="0">关闭</a-radio>
            <a-radio :value="1">启用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="鉴定中心">
          <a-radio-group v-model="model.evaluationCenter" v-decorator="['evaluationCenter', {}]">
            <a-radio :value="0">关闭</a-radio>
            <a-radio :value="1">启用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="溯源中心">
          <a-radio-group v-model="model.resourceCenter" v-decorator="['resourceCenter', {}]">
            <a-radio :value="0">关闭</a-radio>
            <a-radio :value="1">启用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="展示中心">
          <a-radio-group v-model="model.exhibitionCenter" v-decorator="['exhibitionCenter', {}]">
            <a-radio :value="0">关闭</a-radio>
            <a-radio :value="1">启用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="供需管理">
          <a-radio-group v-model="model.demandManagement" v-decorator="['demandManagement', {}]">
            <a-radio :value="0">关闭</a-radio>
            <a-radio :value="1">启用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "StoreFunctionSetModal",
    data () {
      return {
        title:"功能设置",
        visible: false,
        model: {

        },
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
          addOrEdit: "/store/storeFunctionSet/addOrEdit",
          queryById:"/store/storeFunctionSet/queryById"
        },
        storeInfo:{}
      }
    },
    created () {
    },
    methods: {
      async showSettting(record){
        this.form.resetFields();
        console.log(record);
        this.storeInfo=record;
        await this.loadData();
      },
      loadData(){
        getAction(this.url.queryById, {storeManageId: this.storeInfo.id}).then((res) => {

          if (res.success&&res.result) {
            this.model=res.result;
            console.log(this.model);
            this.visible=true;
            this.model.biddingActivities=parseInt(this.model.biddingActivities);
            this.model.collectionCollection=parseInt(this.model.collectionCollection);
            this.model.roomsManagement=parseInt(this.model.roomsManagement);
            this.model.tablesManagement=parseInt(this.model.tablesManagement);
            this.model.evaluationCenter=parseInt(this.model.evaluationCenter);
            this.model.resourceCenter=parseInt(this.model.resourceCenter);
            this.model.exhibitionCenter=parseInt(this.model.exhibitionCenter);
            this.model.demandManagement=parseInt(this.model.demandManagement);
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model,'biddingActivities','collectionCollection','roomsManagement','tablesManagement','evaluationCenter','resourceCenter','exhibitionCenter','demandManagement'))
              //时间格式化
            });
          } else {
            this.visible=true;
            this.model={
              biddingActivities:0,
              collectionCollection:0,
              roomsManagement:0,
              tablesManagement:0,
              evaluationCenter:0,
              resourceCenter:0,
              exhibitionCenter:0,
              demandManagement:0,
            };
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model,'biddingActivities','collectionCollection','roomsManagement','tablesManagement','evaluationCenter','resourceCenter','exhibitionCenter','demandManagement'))
              //时间格式化
            });
          }
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
            httpurl+=this.url.addOrEdit;
            method = 'post';
            let formData = Object.assign(this.model, values);
            formData.storeManageId=this.storeInfo.id;
            //时间格式化

            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
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
      independentAccountChange(e){
        console.log(e);
        this.model.independentAccount=e.target.value+0;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'accountType'))
          //时间格式化
        });
      },
      isIntegralChange(e){
        this.model.isIntegral=e.target.value+0;
      }

    }
  }
</script>

<style lang="less" scoped>

</style>