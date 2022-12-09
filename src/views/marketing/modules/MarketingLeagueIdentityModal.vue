<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    :destroyOnClose=true>
    
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="身份名称">
          <a-input placeholder="请输入身份名称" v-decorator="['identityName', { rules: [{ required: true, message: '请输入身份名称' }] }]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否默认">
          <a-radio-group v-decorator="['isDefault',{ rules: [{ required: true, message: '请选择默认值' }] }]">
            <a-radio value="1">
             是
            </a-radio>
            <a-radio value="0">
              否
            </a-radio>

          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="获得方式">
          <a-radio-group v-decorator="['getWay',{ rules: [{ required: true, message: '请选择获取方式' }] }]">
            <a-row>
            <a-radio value="0">
              注册
            </a-radio>
            </a-row>
            <a-row>
            <a-radio value="1">
              加盟专区下单
            </a-radio>
            </a-row>
            <a-row>
              <a-radio value="2">
                <a-select style="width: 200px"
                  v-decorator="['frontMarketingLeagueIdentityId']"
                  placeholder="请选择"
                >
                  <a-select-option value="" >
                    请选择
                  </a-select-option>
                  <a-select-option :key="item.id" :value="item.id" v-for="item in marketingLeagueIdentityData">
                    {{item.identityName}}
                  </a-select-option>
                </a-select>身份，直推
                <a-input-number style="width: 50px" placeholder="1" v-decorator="['directDrive', {}]" />个
                <a-select style="width: 200px"
                          v-decorator="['afterMarketingLeagueIdentityId']"
                          placeholder="请选择"
                >
                  <a-select-option value="" >
                    请选择
                  </a-select-option>
                  <a-select-option :key="item.id" :value="item.id" v-for="item in marketingLeagueIdentityData">
                    {{item.identityName}}
                  </a-select-option>
                </a-select>
              </a-radio>
            </a-row>
            <a-row>
              <a-radio value="3">
                缴纳 <a-input-number style="width: 100px" placeholder="1" v-decorator="['payPrice', {}]" />元
              </a-radio>
            </a-row>
            <a-row>
              <a-radio value="4">
                后台开通
              </a-radio>
            </a-row>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="权益">
          <a-row>
           <a-checkbox   v-decorator="['pushStraightReward',{valuePropName:'checked',initialValue:false}]">
         直推奖励
        </a-checkbox>
          </a-row>
          <a-row>
            <a-checkbox  v-decorator="['managerReward',{valuePropName:'checked',initialValue:false}]">
              店长奖励
            </a-checkbox>
          </a-row>
          <a-row>
            <a-checkbox v-decorator="['storeManagerReward',{valuePropName:'checked',initialValue:false}]">
              店长管理奖励
            </a-checkbox>
          </a-row>
          <a-row>
            <a-checkbox  v-decorator="['partnerStoreReward',{valuePropName:'checked',initialValue:false}]">
              合伙人店长管理奖励
            </a-checkbox>
          </a-row>
          <a-row>
            <a-checkbox   v-decorator="['cityServiceProviderAward',{valuePropName:'checked',initialValue:false}]">
             城市服务商奖励
            </a-checkbox>
          </a-row>
          <a-row>
            <a-checkbox   v-decorator="['superPartnerAward',{valuePropName:'checked',initialValue:false}]">
              超级合伙人管理奖励
            </a-checkbox>
          </a-row>
          <a-row>
            <a-checkbox   v-decorator="['storeManagerSupportAward',{valuePropName:'checked',initialValue:false}]">
              店长扶持奖励
            </a-checkbox>
          </a-row>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否附加身份">
          <a-radio-group v-decorator="['additionalIdentity']">
            <a-radio value="1">
              是
            </a-radio>
            <a-radio value="0">
              否
            </a-radio>

          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="支持附加身份">
          <a-radio-group v-decorator="['supportAdditionalIdentity']">
            <a-radio value="0">
              不支持
            </a-radio>
            <a-radio value="1">
              支持
            </a-radio>

          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          help="请上传图标 750*高度不限，支持jpg、jpeg、png格式，大小不超过5M"
          label="宣传海报">
          <a-upload
            :action="getUplosdUrl"
            :headers="headers"
            accept="image/*"
            list-type="picture-card"
            :file-list="fileList"
            @preview="handlePreview"
            @change="handleChange"
          >
            <div v-if="fileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="previewhandleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
        </a-form-item>
		
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import ARow from 'ant-design-vue/es/grid/Row'
  import Vue from 'vue'
  import {ACCESS_TOKEN} from "@/store/mutation-types"

  export default {
    name: "MarketingLeagueIdentityModal",
    components: { ARow },
    data () {
      return {
        title:"操作",
        visible: false,
        fileList:[],
        previewVisible:false,
        previewImage:[],
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        headers:"",
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          add: "/marketing/marketingLeagueIdentity/add",
          edit: "/marketing/marketingLeagueIdentity/edit",
          getAll:"/marketing/marketingLeagueIdentity/getAll"
        },
        marketingLeagueIdentityData:[]
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token};
      this.getAll();
    },
    methods: {
      getAll(){
        console.log("方法进来了");
        this.$nextTick(()=>{
          getAction(this.url.getAll, {}).then((res) => {
            if (res.success) {
              this.marketingLeagueIdentityData=res.result;
              console.log(this.marketingLeagueIdentityData);
            } else {
              that.$message.warning(res.message);
            }
          });
        });
      },
      previewhandleCancel() {
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

//根据图片变化获取图片地址信息

        let imgUrls=[];
        this.fileList.forEach(fl=>{
          console.log(fl,"上传文件返回的报文值！！！");
          if(fl.response) {
            imgUrls.push(fl.response.message);
          }
        });
        this.images=imgUrls;
        console.log(this.images,"图片地址结果")
      },
      getImgUrl(url){
        return window._CONFIG['imgDomainURL']+url;
      },
      getUplosdUrl(){
        return window._CONFIG['domianURL']+"/sys/common/upload";
      },
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        console.log("编辑身份信息：",record);
        if(record.cityServiceProviderAward==1){
          record.cityServiceProviderAward=true;
        }else{
          record.cityServiceProviderAward=false;
        }
        if(record.managerReward==1){
          record.managerReward=true;
        }else{
          record.managerReward=false;
        }
        if(record.pushStraightReward==1){
          record.pushStraightReward=true;
        }else{
          record.pushStraightReward=false;
        }

        if(record.storeManagerReward==1){
          record.storeManagerReward=true;
        }else{
          record.storeManagerReward=false;
        }

        if(record.superPartnerAward==1){
          record.superPartnerAward=true;
        }else{
          record.superPartnerAward=false;
        }

        if(record.storeManagerSupportAward==1){
          record.storeManagerSupportAward=true;
        }else{
          record.storeManagerSupportAward=false;
        }

        if(record.partnerStoreReward==1){
          record.partnerStoreReward=true;
        }else{
          record.partnerStoreReward=false;
        }
        //图片处理
        if(record.poster){
          this.fileList= [{
            uid: 1,
            url: this.getImgUrl("/"+record.poster),
            response: {
              message: record.poster
            }
          }]
        }
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','identityName','isDefault','getWay','frontMarketingLeagueIdentityId','afterMarketingLeagueIdentityId','payPrice','pushStraightReward','managerReward','storeManagerReward','cityServiceProviderAward','superPartnerAward','storeManagerSupportAward','additionalIdentity','supportAdditionalIdentity'))
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
            if(formData.cityServiceProviderAward){
              formData.cityServiceProviderAward="1";
            }else{
              formData.cityServiceProviderAward="0";
            }
            if(formData.managerReward){
              formData.managerReward="1";
            }else{
              formData.managerReward="0";
            }
            if(formData.pushStraightReward){
              formData.pushStraightReward="1";
            }else{
              formData.pushStraightReward="0";
            }

            if(formData.storeManagerReward){
              formData.storeManagerReward="1";
            }else{
              formData.storeManagerReward="0";
            }

            if(formData.superPartnerAward){
              formData.superPartnerAward="1";
            }else{
              formData.superPartnerAward="0";
            }

            if(formData.storeManagerSupportAward){
              formData.storeManagerSupportAward="1";
            }else{
              formData.storeManagerSupportAward="0";
            }

            if(formData.partnerStoreReward){
              formData.partnerStoreReward="1";
            }else{
              formData.partnerStoreReward="0";
            }
            if(this.images) {
              formData.poster = this.images.join(",");
            }
            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                this.getAll();
                this.fileList=[];
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
        this.fileList=[];
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>