<template>
  <a-modal
    :confirmLoading="confirmLoading"
    :title="title"
    :visible="visible"
    :width="800"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="供应商名称">
<!--          v-model="AllData.name"-->
          <a-input
            placeholder="请输入供应商名称"
            v-decorator="['name', { rules: [{ required: true, message: '请输入供应商名称' }] }]"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="所在城市">
          <a-cascader :loadData="cityAllDataLoad" :options="cityAllData" @change="cityAllDataChange" changeOnSelect
                      placeholder="请选择区域"
                      v-decorator="['defaultCity', { rules: [{ required: true, message: '请选择区域' }],initialValue:defaultCity }]"
                      v-if="canShowDefaultCity"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="详细地址">
<!--          v-model="AllData.address"-->
          <a-input
            placeholder="请输入详细地址"
            v-decorator="['address', { rules: [{ required: true, message: '请输入详细地址' }] }]"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="公司手机号码">
          <a-input placeholder="请输入公司手机号码" v-model="AllData.companyPhone"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="联系人">
<!--          v-model="AllData.linkman"-->
          <a-input
            placeholder="请输入联系人"
            v-decorator="['linkman', { rules: [{ required: true, message: '请输入联系人' }] }]"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="联系人手机号">
<!--          v-model="AllData.linkphone"-->
          <a-input
            placeholder="请输入联系人手机号"
            v-decorator="['linkphone', { rules: [{ required: true, message: '请输入联系人手机号' },{pattern:/^1[3456789]\d{9}$/, message: '请输入正确的联系人手机号'}] }]"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="结算类型"
          v-if="visible"
        >
<!--          v-model="AllData.accountType"-->
          <j-dict-select-tag
                              :triggerChange="true"
                              dictCode="provider_account_type"
                              placeholder="请选择结算类型"
                              v-decorator="['accountType', { rules: [{ required: true, message: '请选择结算类型！' }],initialValue:AllData.accountType}]"/>
        </a-form-item>
        <!--v-decorator="['contactPerson',{ rules: [{ required: true, message: '请选择' }] },]"-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务对接人">
          <a-select :defaultValue="AllData.contactPerson"
                    @change="selectSupply"
                    placeholder="请选择"
                    style="width: 150px"
                    v-model="AllData.contactPerson">
            <a-select-option :key="item.sysUserId"  :value="item.sysUserId" v-for="item in sysUserDTOs">
              {{ item.nameAndAgency }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="合作开始时间">
<!--          v-model="AllData.startTime"-->
          <a-date-picker :format='dateFormat'
                         showTime
                         v-decorator="['startTime', { rules: [{ required: true, message: '请选择合作开始时间！' }] }]"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="合作结束时间">
<!--          v-model="AllData.endTime"-->
          <a-date-picker :format='dateFormat'
                         showTime
                         v-decorator="['endTime', { rules: [{ required: true, message: '请选择合作结束时间！' }] }]"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注说明">
          <a-textarea placeholder="请输入备注说明"  v-model="AllData.remark"/>
        </a-form-item>
        <!--<a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态；0：停用；1：启用">
          <a-input placeholder="请输入状态；0：停用；1：启用" v-decorator="['status', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="停用说明">
          <a-input placeholder="请输入停用说明" v-decorator="['closeExplain', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="余额">
          <a-input-number v-decorator="[ 'balance', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="冻结金额（待结算）">
          <a-input-number v-decorator="[ 'accountFrozen', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="不可用金额">
          <a-input-number v-decorator="[ 'unusableFrozen', {}]" />
        </a-form-item>-->

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction, getAction, postAction ,putAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import dayjs from 'dayjs'
  import moment from 'moment'
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import Vue from 'vue'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  export default {
    inject:['rush'],
    name: 'ProviderManageModal',
    moment,
    data() {
      return {
        title: '操作',
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        //所在城市联想
        cityAllData: [],
        sysUserDTOs:[],//代理数据
        //全部数据
        AllData: {
          sysUserId:'',
          name:'',
          sysAreaId:'',
          areaAddress:'',
          address:'',
          companyPhone:'',
          linkman:"",
          linkphone:'',
          accountType:'',
          contactPerson:'',
          remark:'',
          status:'',
          closeExplain :'',
          balance:'',
          accountFrozen:'',
          unusableFrozen:'',
          startTime:"",
          endTime:''
        },
        //可以显示回显默认地址
        canShowDefaultCity: false,
        //编辑回显的默认地址
        defaultCity: '',
        //地址转换拼接地址
        areaAddressList: [],
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {},
        dateFormat:'YYYY-MM-DD HH:mm:ss',
        url: {
          add: '/providerManage/providerManage/add',
          edit: '/providerManage/providerManage/edit',
          getList: '/sysArea/sysArea/getList',
          findByParentId: '/sysArea/sysArea/findByParentId',
          getAgencyManageMap:'/agencyManage/agencyManage/getAgencyManageMap',
        }
      }
    },
    mounted(){
      this.getAgencyManageMap();
    },
    created() {
    },
    methods: {
      moment,
      add() {
        this.edit()
      },
      edit(record) {
        // this.form.resetFields();
        // this.model = Object.assign({}, record);
        this.canShowDefaultCity = false
        this.getList(() => {
          if (record) {
            if(record.areaAddress){
              this.areaAddressList = record.areaAddress.split(',')
            }
            // record.accountType = record.accountType * 1
            if(record.startTime) record.startTime = moment( record.startTime, this.dateFormat);
            if(record.endTime)record.endTime = moment(record.endTime, this.dateFormat);
            this.AllData = Object.assign({},this.AllData,record)
            //所在城市回显
            this.$nextTick(()=>{
              this.visible = true
              setTimeout(()=>{
                this.form.setFieldsValue(this.AllData)
              },200)
            })
            if (record.sysAreaId && this.areaAddressList) {
              this.cityEchoDisplay(record)
            } else {
              this.canShowDefaultCity = true
            }
          } else {
            this.areaAddressList = ''
            this.canShowDefaultCity = true
          }
        })
         //   this.$nextTick(() => {
         // this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','sysUserId','name','sysAreaId','areaAddress','address','companyPhone','linkman','linkphone','accountType','contactPerson','remark','status','closeExplain','balance','accountFrozen','unusableFrozen'))
         // //时间格式化
         // this.form.setFieldsValue({startTime:this.model.startTime?moment(this.model.startTime):null})
         // this.form.setFieldsValue({endTime:this.model.endTime?moment(this.model.endTime):null})
         // });
      },
      getAgencyManageMap(){
        let that = this;
        getAction(that.url.getAgencyManageMap).then((res) => {
          if (res.success) {
              let empty = {
                id: "",
                sysUserId: "",
                nameAndAgency: "请选择"
              }
             res.result = [empty,...res.result]
            this.sysUserDTOs =res.result ;
            console.log('下拉:',res.result)
            // that.$message.success(res.message);
          } else {
            //that.$message.warning(res.message);
          }
        });
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleOk() {
        this.form.validateFields((err, values) => {
          if(!err){
            this.confirmLoading = true;
            this.AllData = Object.assign({},this.AllData,values)
            this.$nextTick(()=>{
              this.AllData.startTime =  this.AllData.startTime?dayjs(this.AllData.startTime).format(this.dateFormat):''
              this.AllData.endTime = this.AllData.endTime?dayjs(this.AllData.endTime).format(this.dateFormat):''
              this.AllData.areaAddress = this.areaAddressList.join(',')
              this.$nextTick(()=>{
                putAction(this.url.edit,this.AllData).then(res=>{
                  this.confirmLoading = false;
                  this.close();
                  if(res.success){
                    this.$message.success(res.message);
                    this.rush()
                  }else{
                    this.$message.success(res.message);
                    this.rush()
                  }
                })
              })
            })
          }
        })
      },
      handleCancel() {
        this.close()
      },
      //所在城市地址选择完成事件
      cityAllDataChange(value, selectedOptions) {
        let sz = []
        for (let item of selectedOptions) {
          sz.push(item.label)
        }
        this.AllData.sysAreaId = value.join(',')
        this.areaAddressList = sz
      },
      //所在城市点击一级，二级，三级分类动态展示数据
      cityAllDataLoad(selectedOptions) {
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true
        getAction(this.url.findByParentId, { id: targetOption.value }).then((res) => {
          targetOption.loading = false
          if (res.success && res.result.length > 0) {
            let sz = []
            for (let item of res.result) {
              sz.push({
                label: item.name,
                value: item.id,
                isLeaf: false
              })
            }
            targetOption.children = sz
          }
          this.cityAllData = [...this.cityAllData]
        })
      },
      //所在城市回显
      cityEchoDisplay(info) {
        let sz = info.sysAreaId.split(',')
        let cityAllData = this.cityAllData
        this.defaultCity = info.sysAreaId.split(',').map(item => {
          return item * 1
        })
        //第一个id请求其对应的子地址
        getAction(this.url.findByParentId, { id: sz[0] }).then(res => {
          if (res.success && res.result.length > 0) {
            let sz2 = [] //子地址
            for (let item of res.result) {
              sz2.push({
                label: item.name,
                value: item.id,
                isLeaf: false
              })
            }
            for (let item of cityAllData) {
              //找到对应的label添加children
              if (this.areaAddressList[0] == item.label) {
                item.children = sz2
                getAction(this.url.findByParentId, { id: sz[1] }).then(res2 => {
                  if (res2.success && res2.result.length > 0) {
                    let sz3 = []
                    for (let item of res2.result) {
                      sz3.push({
                        label: item.name,
                        value: item.id,
                        isLeaf: false
                      })
                    }
                    for (let item2 of sz2) {
                      if (this.areaAddressList[1] == item2.label) {
                        item2.children = sz3
                        this.$nextTick(() => {
                          this.canShowDefaultCity = true
                        })
                        break
                      }
                    }
                  } else {
                    this.canShowDefaultCity = true
                    console.log('没有第三级地址')
                  }
                })
                break
              }
            }
          } else {
            this.canShowDefaultCity = true
            console.log('空值')
          }
        })

      },
      //获取包邮配送区域地址和所在城市一级options联想地址
      getList(callback) {
        getAction(this.url.getList).then((res) => {
          if (res.success) {
            let sz3 = []
            for (let item of res.result) {
              sz3.push({
                label: item.name,
                value: item.id,
                isLeaf: false
              })
            }
            //所在城市
            this.cityAllData = sz3
            this.$nextTick(() => {
              callback()
            })
          } else {
            this.$message.warning(res.message)
          }
        })
      }


    }
  }
</script>

<style lang="less" scoped>

</style>