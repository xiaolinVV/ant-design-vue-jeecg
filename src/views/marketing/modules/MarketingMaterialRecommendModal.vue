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
          label="编号"
        >
          <div @click="showSelectMaterial">
            <a-input placeholder="请点击选择素材列表id" v-decorator="['marketingMaterialListId', validatorRules.marketingMaterialListId]"  :disabled="true" />
          </div>

        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="标题">
         <span>
           {{model.title}}
           </span>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序">
          <a-input-number v-decorator="[ 'sort', validatorRules.sort]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开始时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'startTime', validatorRules.startTime]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="结束时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'endTime', validatorRules.endTime]" />
        </a-form-item>
      </a-form>
    </a-spin>
    <marketing-material-recommend-select-material-modal ref="selectMaterialModal" @close="selectMaterialModalClose">

    </marketing-material-recommend-select-material-modal>
  </a-modal>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import MarketingMaterialRecommendSelectMaterialModal from './MarketingMaterialRecommendSelectMaterialModal'
  export default {
    name: "MarketingMaterialRecommendModal",
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
          marketingMaterialListId: { rules: [{ required: true, message: '请点击选择素材列表id!' }] },
          sort: { rules: [{ required: true, message: '请输入排序!' }] },
          startTime: { rules: [{ required: true, message: '请选择开始时间' }] },
          endTime: { rules: [{ required: true, message: '请选择结束时间!' }] },
        },
        url: {
          add: "/marketingMaterialRecommend/marketingMaterialRecommend/add",
          edit: "/marketingMaterialRecommend/marketingMaterialRecommend/edit",
        },
      }
    },
    created () {
    },
    components:{
      MarketingMaterialRecommendSelectMaterialModal
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','marketingMaterialListId','sort','status','closeExplain'))
		  //时间格式化
          this.form.setFieldsValue({startTime:this.model.startTime?moment(this.model.startTime):null})
          this.form.setFieldsValue({endTime:this.model.endTime?moment(this.model.endTime):null})
          this.form.setFieldsValue({closeTime:this.model.closeTime?moment(this.model.closeTime):null})
        });

      },
      selectMaterialModalClose(info){
        if(info.id){
          this.form.setFieldsValue({marketingMaterialListId:info.id,title:info.title})
          this.model.title = info.title
        }
      },
      showSelectMaterial(){
        let id = this.form.getFieldValue('marketingMaterialListId')
        console.log(id)
        this.$refs.selectMaterialModal.open(id)
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
            formData.startTime = formData.startTime?formData.startTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.endTime = formData.endTime?formData.endTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.closeTime = formData.closeTime?formData.closeTime.format('YYYY-MM-DD HH:mm:ss'):null;
            if(values.status){
              values.status = 1;
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
      //素材列表
      getMarketingMaterialList() {
        this.visibleAudi = false;

        var that = this;
        getAction(that.url.marketingMaterialList, {isPublish:"1"}).then((res) => {
          if (res.success) {
            that.marketingMaterialList = res.result

          } else {

            that.$message.success("修改失败");
          }
        });
      },

    }
  }
</script>

<style lang="less" scoped>

</style>