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
<!--      -->
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
          label="选择店铺">
<!--          店铺管理id-->
          <!--          <a-input placeholder="请输入店铺管理id" v-decorator="['storeManageId', {}]" />-->


<!--          label-in-value-->
<!--          :filter-option="false"-->
<!--          mode="multiple"-->
          <a-select
            show-search
            option-filter-prop="children"
            v-decorator="['storeManageId', validatorRules.storeManageId]"
            placeholder="请选择店铺"
            :filter-option="filterOption"
            style="width: 150px"
            :not-found-content="fetching ? undefined : null"
            @search="selectStoreSearch"
            @change="selectStoreHandleChange"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="item in findStoreInfoByStoreNameList" :key="item.storeManageId" :value="item.storeManageId">
              {{ item.storeName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="店铺账号">
          {{showInfo.username || '-'}}
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="联系人">
          {{showInfo.bossName || '-'}}
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="联系人手机">
          {{showInfo.bossPhone || '-'}}
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="所在城市">
          {{showInfo.areaAddress || '-'}}
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="门店地址">
          {{showInfo.storeAddress || '-'}}
        </a-form-item>

        <!--<a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="主营分类">
          {{showInfo.mainType || '-'}}
        </a-form-item>-->

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="店铺分类">

          <a-select placeholder="请选择店铺分类" style="width:100px;margin-right: 10px;" @change="storeClassifactionFirstChange" v-model="model.storeTypeIdOne" >
            <a-select-option value="" >
              请选择
            </a-select-option>
            <a-select-option :value="item.id" v-for="(item,index) in storeClassifactionList" :key="index">
              {{item.typeName}}
            </a-select-option>
          </a-select>

          <a-select placeholder="请选择店铺分类" style="width:100px;margin-right: 10px;"
                    v-decorator="['storeTypeId',  validatorRules.storeTypeId]" :disabled="storeClassifactionListSecond.length <= 0">
            <a-select-option value="" >
              请选择
            </a-select-option>
            <a-select-option :value="item.id" v-for="(item,index) in storeClassifactionListSecond" :key="index">
              {{item.typeName}}
            </a-select-option>
          </a-select>

        </a-form-item>


        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="福利金收款状态">
<!--          状态;0:停用；1：启用-->
<!--          <a-input placeholder="请选择福利金收款状态" v-decorator="['status', {}]" />-->
          <a-radio-group v-decorator="['status',  validatorRules.status]" :options="statusOptions"  />
<!--          @change="onChange2"-->
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="福利金抵扣最低值">
          <a-input-number style="width: 150px" v-decorator="[ 'storeSmallWelfarePayments', validatorRules.storeSmallWelfarePayments]" :min="0" placeholder="请输入福利金抵扣最低值" /> %
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="福利金兑换余额比例">
          <a-input-number style="width: 150px" v-decorator="[ 'subscriptionRatio', validatorRules.subscriptionRatio]" :min="0" placeholder="请输入福利金兑换余额比例" /> %
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序">
          <a-input-number style="width: 150px" v-decorator="[ 'sort', validatorRules.sort]" :min="0" placeholder="请输入排序" />
        </a-form-item>

<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="停用时间">-->
<!--          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'closeTime', {}]" />-->
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
  import pick from 'lodash.pick'
  import moment from "moment"
  import debounce from 'lodash/debounce';
  const statusOptions = [
    { label: '开启', value: '1' },
    { label: '关闭', value: '0' },
  ];
  export default {
    name: "StoreWelfarePaymentsGatheringModal",
    data () {
      this.lastFetchId = 0;
      this.selectStoreSearch = debounce(this.selectStoreSearch, 800);
      return {
        fetching: false,
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
        storeClassifactionList:[],
        storeClassifactionListSecond:[],
        //展示信息
        showInfo:{

        },
        statusOptions,
        findStoreInfoByStoreNameList: [],
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          storeManageId:{ rules: [{ required: true, message: '请选择店铺!' }] },
          status:{ rules: [{ required: true, message: '请选择福利金收款状态!' }] },
          subscriptionRatio:{ rules: [{ required: true, message: '请输入福利金兑换余额比例!' }] },
          storeSmallWelfarePayments:{ rules: [{ required: true, message: '请输入福利金抵扣最低值!' }] },
          sort:{ rules: [{ required: true, message: '请输入排序!' }] },
          storeTypeId:{ rules: [{ required: true, message: '请选择店铺分类！!' }] },
          storeTypeIdOne:{ rules: [{ required: false, message: '请选择第一个店铺分类！!' }] },
        },
        url: {
          add: "/storeWelfarePaymentsGathering/storeWelfarePaymentsGathering/add",
          edit: "/storeWelfarePaymentsGathering/storeWelfarePaymentsGathering/edit",
          findStoreInfoByStoreName:"storeManage/storeManage/findStoreInfoByStoreName",//搜索店铺下拉列表 参数:storeName(get)
          getStoreTypeMap: "storeType/storeType/getStoreTypeMap",//店铺分类
        },
      }
    },

    created () {

    },
    methods: {

      add () {
        this.edit({});
      },
      selectStoreHandleChange(value){
        console.log('selectStoreHandleChange',value);
        if(this.findStoreInfoByStoreNameList.length > 0){
          for(let item of this.findStoreInfoByStoreNameList ){
            if(item.storeManageId == value){
              this.showInfo = item;
              break;
            }
          }
        }
      },
      storeClassifactionFirstChange(value){
        this.storeClassifactionListSecond = []
        // storeTypeId
        this.form.setFieldsValue({storeTypeId:''})
        if(value){
          getAction(this.url.getStoreTypeMap,{pId:value}).then(res=>{
            if(res.success){
              this.storeClassifactionListSecond = res.result
            }
          })
        }
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
      selectStoreSearch(value) {
        console.log('selectStoreSearch', value);
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.findStoreInfoByStoreNameList = [];
        this.fetching = true;
        getAction(this.url.findStoreInfoByStoreName,{storeName:value || ''}).then(res=>{
          if(!res.success){
            this.$message.warn(res.message);
            return
          }
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return;
          }
          this.findStoreInfoByStoreNameList = res.result;
          this.fetching = false;
        })
      },
      edit (record) {
        this.form.resetFields();
        this.showInfo = Object.assign({}, record)
        this.model = Object.assign({}, record);
        getAction(this.url.getStoreTypeMap,{pId:''}).then(res=>{
          if(res.success){
            this.storeClassifactionList = res.result
          }
        })
        if(record.id){
          this.findStoreInfoByStoreNameList = [record]
          if(this.model.storeTypeIdOne){
            getAction(this.url.getStoreTypeMap,{pId:this.model.storeTypeIdOne}).then(res=>{
              if(res.success){
                this.storeClassifactionListSecond = res.result
              }
            })
          }
          // this.storeClassifactionListSecond = []
        }else{
          getAction(this.url.findStoreInfoByStoreName,{storeName:''}).then(res=>{
            if(!res.success){
              this.$message.warn(res.message);
              return
            }
            this.findStoreInfoByStoreNameList = res.result;
          })
        }
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(this.model)
		  // //时间格式化
      //     this.form.setFieldsValue({closeTime:this.model.closeTime?moment(this.model.closeTime):null})
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
            //时间格式化
            formData.closeTime = formData.closeTime?formData.closeTime.format('YYYY-MM-DD HH:mm:ss'):null;
            
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