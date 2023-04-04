<template>
  <j-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :fullscreen="true"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-card title="基础信息">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="专区名称">
          <a-input placeholder="请输入专区名称" v-decorator="['prefectureName', { rules: [{ required: true, message: '请输入专区名称!' }] }]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="图标">
          <kq-upload  ref="iconImgUpload" :imgCount="1" explain="尺寸200*200 支持jpg、jpeg、png格式，大小不超过2M" @change="e=>{iConImages=e}"></kq-upload>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分享图">
          <kq-upload  ref="shareFigureImagesUpload" :imgCount="1" explain="尺寸800*640 ，支持jpg、jpeg、png格式，大小不超过2M" @change="e=>{shareFigureImages=e}"></kq-upload>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="海报图">
          <kq-upload  ref="postersFigureImagesUpload" :imgCount="1" explain="尺寸1428*2540，支持jpg、jpeg、png格式，大小不超过2M。必须预留好二维码位置。以免影响展示效果。" @change="e=>{postersFigureImages=e}"></kq-upload>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="规则">
          <JEditor v-model="model.rule"> </JEditor>
        </a-form-item>
        </a-card>
        <a-card title="类型信息" style="margin-top: 30px">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="专区类型">
          <a-radio-group v-decorator="['prefectureType', {}]" @change="prefectureTypeChange">
            <a-radio value="0">普通专区</a-radio>
            <a-radio value="1">限购专区</a-radio>
            <a-radio value="2">赠送专区</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="model.prefectureType==1"
          label="限制">
          <span>每</span><a-input v-model="limitation.time" style="width: 100px;margin-left: 10px" /> <a-select v-model="limitation.model" style="width: 100px;margin-left: 10px" >
          <a-select-option value="0">天</a-select-option>
          <a-select-option value="1">月</a-select-option>
        </a-select><span style="margin-left: 20px">可使用专区购买资格购买本专区商品</span>
          <a-checkbox-group v-model="limitation.isBuy">
          <a-checkbox  value="1" style="margin-left: 50px">经销商不限购</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="model.prefectureType==2"
          label="赠送">
          <a-select v-model="giveInfo.marketingStorePrefectureListId" style="width: 200px;margin-left: 10px" >
            <a-select-option :value="item.id" v-for="(item,index) in marketingStorePrefectureList" :key="index">{{item.prefectureName}}</a-select-option>
          </a-select>

          <span style="margin-left: 30px">专区购买资格</span>
          <a-input-number :min="0" v-model="giveInfo.totalTimes" style="width: 60px;margin-left: 20px"></a-input-number>
          <span style="margin-left: 20px;">次</span>

        </a-form-item>
        </a-card>
        <a-card title="奖励信息" style="margin-top: 30px">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分红资金">
          <a-input-number style="width: 90%" v-decorator="[ 'dividend', {}]" />元
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="本店分红">
          <a-input-number style="width: 90%" v-decorator="[ 'storeShare', {}]" />%分红资金
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="称号奖励">
          <select-designation-award v-if="storeInfo&&storeInfo.key" ref="selectDesignationAward" :storeInfo="storeInfo" @change="selectDesignationAwardChange"></select-designation-award>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="经销商奖励">
          <a-input-number style="width: 90%" v-decorator="[ 'dealerIncentives', {}]" />%分红资金
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分享人奖励">
          <a-input-number style="width: 90%" v-decorator="[ 'shareAward', {}]" />%分红资金
        </a-form-item>
        </a-card>
        <a-card title="状态信息" style="margin-top: 30px">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态">
          <a-radio-group v-decorator="['status', {}]">
            <a-radio value="0">停用</a-radio>
            <a-radio value="1">启用</a-radio>
          </a-radio-group>
        </a-form-item>
        </a-card>

      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import KqUpload from '@/components/kq/KqUpload/KqUpload'
  import SelectDesignationAward from'../../../common/SelectDesignation/SelectDesignationAward'
  import JEditor from '@/components/jeecg/JEditor'
  export default {
    name: "MarketingStorePrefectureListModal",
    components:{
      KqUpload,
      JEditor,
      SelectDesignationAward
    },
    data () {
      return {
        title:"操作",
        visible: false,
        model: {
          rule:'',
          prefectureType:'0'
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
          add: "/marketing.store.prefecture/marketingStorePrefectureList/add",
          edit: "/marketing.store.prefecture/marketingStorePrefectureList/edit",
          getMarketingStorePrefectureList:"/marketing.store.prefecture/marketingStorePrefectureList/getMarketingStorePrefectureList"
        },
        /*图标*/
        iConImages:[],
        /*分享图*/
        shareFigureImages:[],
        /*海报图*/
        postersFigureImages:[],
        /*限制信息*/
        limitation:{
          time:'',
          model:'',
          isBuy:''
        },
        /*赠送信息*/
        giveInfo:{
          marketingStorePrefectureListId:'',
          totalTimes:0
        },
        marketingStorePrefectureList:[],
        storeInfo:{
          key:''
        },
        /*称号奖励数据*/
        titleDataSource:[]
      }
    },
    created () {
    },
    methods: {
      //值得变化
      selectDesignationAwardChange(e){
        console.log(e);
        this.titleDataSource=e;
      },
      getMarketingStorePrefectureList(){
        if(this.marketingStorePrefectureList.length==0){
          getAction(this.url.getMarketingStorePrefectureList, {storeManageId:this.storeInfo.key}).then((res) => {
            if (res.success) {
              this.marketingStorePrefectureList=res.result;
              console.log(this.marketingStorePrefectureList);
            } else {
              this.$message.warning(res.message);
            }
          });
        }
      },
      prefectureTypeChange(e){
        this.model.prefectureType=e.target.value;
        if(this.model.prefectureType==2){
          this.getMarketingStorePrefectureList();
        }
        console.log(this.model.prefectureType);
      },
      add (param) {
        this.edit({},param);
      },
      edit (record,param) {
        this.form.resetFields();
        this.model = Object.assign({}, record);

        if(this.model.id){
          this.storeInfo.key=this.model.storeManageId;
          /*图标*/
          this.iConImages=JSON.parse(this.model.icon);
          /*分享图*/
          this.shareFigureImages=JSON.parse(this.model.shareFigure);
          /*海报图*/
          this.postersFigureImages=JSON.parse(this.model.postersFigure);
          /*限制*/
          this.limitation=JSON.parse(this.model.astrict);
          /*赠送*/
          this.giveInfo=JSON.parse(this.model.give);
          /*称号*/
          this.titleDataSource=JSON.parse(this.model.titleAward);

          /*赠送专区反显示*/
          if(this.model.prefectureType==2){
            this.getMarketingStorePrefectureList();
          }

         }else{
          this.storeInfo=param;
          this.model.prefectureType='0';
          this.model.status='1';
          this.iConImages=[];
          this.shareFigureImages=[];
          this.postersFigureImages=[];
          this.limitation= {
            time:'',
              model:'',
              isBuy:''
          };
          this.giveInfo={
            arketingStorePrefectureListId:'',
              totalTimes:0
          };
        }
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'prefectureName','rule','prefectureType','astrict','give','dividend','storeShare','titleAward','dealerIncentives','shareAward','status'))
		  //时间格式化
          /*初始化组件数据*/
          this.$refs.iconImgUpload.init(this.iConImages);
          this.$refs.selectDesignationAward.init(this.titleDataSource);
          this.$refs.shareFigureImagesUpload.init(this.shareFigureImages);
          this.$refs.postersFigureImagesUpload.init(this.postersFigureImages);
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

            /*参数校验*/
            if(this.iConImages.length==0){
              this.$message.warning('请上传图标');
              return;
            }
            if(this.shareFigureImages.length==0){
              this.$message.warning('请上传分享图');
              return;
            }
            if(this.postersFigureImages.length==0){
              this.$message.warning('请上传海报图');
              return;
            }

            if(!this.model.rule){
              this.$message.warning('请输入规则信息');
              return;
            }

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
            if(this.model.id){

            }else{
              formData.storeManageId=this.storeInfo.key;
            }
            console.log('1111111111111111111');
            formData.icon=JSON.stringify(this.iConImages);
            formData.shareFigure=JSON.stringify(this.shareFigureImages);
            formData.postersFigure=JSON.stringify(this.postersFigureImages);
            formData.astrict=JSON.stringify(this.limitation);
            if(formData.prefectureType==2){
              let mp=this.marketingStorePrefectureList.find(item=>item.id==this.giveInfo.marketingStorePrefectureListId);
              this.giveInfo.prefectureName=mp.prefectureName;
            }
            formData.give=JSON.stringify(this.giveInfo);
            formData.titleAward=JSON.stringify(this.titleDataSource);
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