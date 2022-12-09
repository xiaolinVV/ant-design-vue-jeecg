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
          style="display: flex;"
          label="商品分类">
          <a-select v-model="goodTypeIdOne"    placeholder="请选择"  @change="chooseMedicine"   style="width:100px;margin-right: 10px;">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option v-for="item in listGoodType" :value="item.id"   >{{ item.name }}</a-select-option>
          </a-select>

          <a-select   v-model="goodTypeIdTwo"  placeholder="请选择" @change="chooseMedicine1"  style="width:100px;margin-right: 10px;" ><!--v-model="id"-->
            <a-select-option value="">请选择</a-select-option>
            <a-select-option v-for="item in listGoodType1"   :value="item.id">{{ item.name }}</a-select-option><!--:defaultValue="listGoodType1.length>0?listGoodType1[0].name : ''"-->
          </a-select>
          <a-select   v-model="goodTypeIdThree"   placeholder="请选择"   style="width:100px;margin-right: 10px;">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option v-for="item in listGoodType2"   :value="item.id" >{{ item.name }}</a-select-option><!--:defaultValue="listGoodType2.length>0?listGoodType2[0].name : ''"-->
          </a-select>
        </a-form-item>


        <!--<a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="平台分类id">
          <a-input placeholder="请输入平台分类id" v-decorator="['goodTypeId', {}]" />
        </a-form-item>-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="推荐分类别名">
          <a-input placeholder="请输入分类别名" v-decorator="['nickName', { rules: [{ required: true, message: '请输入' }] }]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序">
          <a-input-number v-decorator="[ 'sort', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开始时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'startTime',{ }]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="结束时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'endTime', {}]" />
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
    name: "MarketingRecommendTypeModal",
    data () {
      return {
        title:"操作",
        visible: false,
        goodTypeIdOne:"",
        goodTypeIdTwo:"",
        goodTypeIdThree:"",
        listGoodType:[],
        parentId:"",
        listMRT:{},
        listGoodType1:[],
        listGoodType2:[],
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
          add: "/marketingRecommendType/marketingRecommendType/add",
          edit: "/marketingRecommendType/marketingRecommendType/edit",
          getgoodTypeListcascade:"/goodType/goodType/getgoodTypeListcascade",
        },
      }
    },
    created () {
    },
    mounted() {
      //加载一级分类数据
      this.goodTypeListcascade('0')
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        if(record.goodTypeIdOne){
          this.loginchooseMedicine(record.goodTypeIdOne);
        }
        if(record.goodTypeIdTwo){
          this.loginchooseMedicine1(record.goodTypeIdTwo);
        }
        console.log("record====",record)
        this.form.resetFields();
        this.model = Object.assign({}, record);
        if(this.model.delFlag=="" || this.model.delFlag==undefined){
          this.model.delFlag=0;
        }
        if(this.model.status=="" || this.model.status==undefined){
          this.model.status="1";
        }
        this.visible = true;
        this.listMRT = record;
        this.goodTypeIdOne = this.listMRT.goodTypeIdOne;
        this.goodTypeIdTwo = this.listMRT.goodTypeIdTwo;
        this.goodTypeIdThree = this.listMRT.goodTypeIdThree;
        console.log("this.goodTypeIdOne",this.goodTypeIdOne)
        console.log("this.goodTypeIdTwo ",this.goodTypeIdTwo)
        console.log("record====",record)
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','goodTypeId','sort','status','nickName'))
		  //时间格式化
          this.form.setFieldsValue({startTime:this.model.startTime?moment(this.model.startTime):null})
          this.form.setFieldsValue({endTime:this.model.endTime?moment(this.model.endTime):null})
        });

      },
      close () {
        this.$emit('close');
        this.goodTypeIdOne = "",
        this.goodTypeIdTwo = "",
        this.goodTypeIdThree = "",
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if(this.goodTypeIdThree){
            values.goodTypeId = this.goodTypeIdThree ;
          }else if(this.goodTypeIdTwo){
            values.goodTypeId = this.goodTypeIdTwo ;
          }else if(this.goodTypeIdOne){
            values.goodTypeId = this.goodTypeIdOne ;
          }
          if(!values.goodTypeId){
            //that.$message.success("请选择分类");
            that.$message.warning("请选择分类");
            return;
          }
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

      //选择商品分类
      chooseMedicine:function(value){
        let that = this;
        that.listGoodType1="";
        that.listGoodType2="";
        getAction(that.url.getgoodTypeListcascade, {parentId:value}).then((res) => {
          if (res.success) {
            that.listGoodType1=res.result.listGoodType
             this.goodTypeIdTwo = "";
             this.goodTypeIdThree = "";
            // console.log(that.listGoodType1)
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      chooseMedicine1:function (value) {
        console.log("parentId2222"+value)
        let that = this;
        that.listGoodType2=[];
        getAction(that.url.getgoodTypeListcascade, { parentId: value}).then((res) => {
          if (res.success) {
            that.listGoodType2=res.result.listGoodType
             this.goodTypeIdThree = "";
            console.log(that.listGoodType2)
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      //页面加载执行选择商品分类
      loginchooseMedicine:function(value){
        let that = this;
        that.listGoodType1="";
        that.listGoodType2="";
        getAction(that.url.getgoodTypeListcascade, {parentId:value}).then((res) => {
          if (res.success) {
            that.listGoodType1=res.result.listGoodType

            // console.log(that.listGoodType1)
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      loginchooseMedicine1:function (value) {
        let that = this;
        that.listGoodType2=[];
        getAction(that.url.getgoodTypeListcascade, { parentId: value}).then((res) => {
          if (res.success) {
            that.listGoodType2=res.result.listGoodType
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      //加载一级分类数据
      goodTypeListcascade (parentId){

        let that = this;
        that.listGoodType1=[];
        that.listGoodType2=[];
        getAction(that.url.getgoodTypeListcascade, {parentId: parentId}).then((res) => {

          if (res.success) {
            that.listGoodType=res.result.listGoodType
          } else {
            that.$message.warning(res.message);
          }
        });
      },

    }
  }
</script>

<style lang="less" scoped>

</style>