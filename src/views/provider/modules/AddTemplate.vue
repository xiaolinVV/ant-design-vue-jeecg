<!--新增运费模板-->
<template>
  <div class="AddTemplate" ref="AddTemplate">
    <div class="head" @click="push1">
      运费模板   >   {{part==2?'编辑':'添加'}}运费模板
    </div>
    <div class="content">
      <div class="title">
        模板基础信息
      </div>
      <div class="detail">
        <a-form :form="form" >
          <a-form-item label="模板名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              v-decorator="['name', { rules: [{ required: true, message: '请输入模板名称' },{ max: 50, message: '字数不超过50个字!' }] }]"
              placeholder="请输入模板名称,字数不超过50个字"
            /><!--v-model="AllData.name"-->
          </a-form-item>
          <a-form-item
            style="display: flex;margin-bottom: 10px;"
            :label-col="{ span: 5 }" :wrapper-col="{ span: 6}"
            label="所在城市" >
            <a-cascader :options="cityAllData"
                        @change="cityAllDataChange"
                        :loadData="cityAllDataLoad"
                        changeOnSelect
                        v-if="canShowDefaultCity"
                        v-decorator="['defaultCity', { rules: [{ required: true, message: '请选择区域' }],initialValue:defaultCity }]"
                        placeholder="请选择区域" />
          </a-form-item>
          <div class="form-detail">
            发货地与您的实际发货地不符，可能会导致物流投诉
          </div>
          <a-form-item label="模板类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            {{AllData.templateType == '0'?'包邮类型':'自定义类型'}}
          </a-form-item>
        </a-form>
      </div>
    </div>
    <!--供应商-->
    <!--<div>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="商品供应商"
      >
        <a-select style="width: 150px"
                  v-decorator="['sysUserId',{ rules: [{ required: true, message: '请选择' }] },]"
                  placeholder="请选择"
                  @change="selectSupply"
        >
          <a-select-option v-for="item in sysUserDTOs"  :key="item.id">
            {{ item.realname }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </div>-->
    <div class="content">
      <div style="clear: both;">
      </div>
      <div class="title">
        包邮配送区域
      </div>
      <div class="detail">
        <div>
        </div>
        <div>
          <div :style="{ borderBottom: '1px solid #E9E9E9' }">
            <a-checkbox :indeterminate="indeterminate" @change="onCheckAllChange" :checked="checkAll" ref="checkbox">
              全选
            </a-checkbox>
          </div>
          <br/>
          <a-checkbox-group :options="plainOptions" v-model="checkedList" @change="onChange"  />
        </div>
      </div>
      <div style="clear: both;">
      </div>
    </div>
    <div class="content" v-if="PostageArea.length>0">
      <div class="title">
        买家付邮费区域
      </div>
      <div class="detail" >
        <div style="margin-top: 0;width: 100%;">
               <span>
                 计算方式:
               </span>
          <div class="radio-group">
            <a-radio-group @change="onChangeRadioGroup" v-model="RadioGroup">
              <a-radio :value="0">按件数计费</a-radio>
              <a-radio :value="1">按量数计费</a-radio>
            </a-radio-group>
          </div>
        </div>
        <div style="margin-bottom: 20px">
          生效范围: 合并支付时，店铺内绑定该模板的多个商品（如有）会一起计算运费，运费按件数平分到各子单；非合并支付时，针对付款的单个商品计算运费。
        </div>
        <div class="card-content" v-for="(item,index) in PostageArea">
          <div style="clear: both">

          </div>
          <div class="card-title">
            {{item.city}}
          </div>
          <div class="radio-group">
            <a-radio-group @change="onChangePeisongGroup" v-model="item.isDelivery">
              <a-radio :value=1>配送</a-radio>
              <a-radio :value=2>不配送</a-radio>
            </a-radio-group>
          </div>
          <div style="clear: both">
          </div>
          <div class="ipt-cnt" v-show="item.isDelivery == 1">
            <div>
              <a-input-number :min="1" v-model="item.count" placeholder="请输入" type="number"/>
              <span v-if="RadioGroup == 0">
                件
              </span>
              <span v-if="RadioGroup == 1">
                kg
              </span>
              <span></span>

            </div>
            <div>
              <span>

              </span>
              <a-input-number :min="0" v-model="item.price" type="number"  placeholder="请输入"/>
              <span>
                元
              </span>

            </div>
            <div>
              <span>
                每增加
              </span>

              <a-input-number :min="0" v-model="item.everyIncreaseCount"  type="number"placeholder="请输入"/>
              <span v-if="RadioGroup == 0">
                件
              </span>
              <span v-if="RadioGroup == 1">
                kg
              </span>
            </div>
            <div>
              <span>
                增加运费
              </span>

              <a-input-number :min="0"  v-model="item.everyIncreasePrice"  type="number"  placeholder="请输入"/>
              <span>
                元
              </span>

            </div>
          </div>
          <div class="free-shipping" v-if="item.isDelivery == 1">
            <a-checkbox  style="margin-right: 150px;" :defaultChecked="item.isConditionalPostage" :checked="item.isConditionalPostage" @change="onChangeCheckShipping($event,index)">
              指定条件包邮
            </a-checkbox>

            <span v-show="item.isConditionalPostage">
              满
            </span>
            <a-input-number :min="0" v-show="item.isConditionalPostage" v-model="item.satisfyPriceNumber"   type="number" placeholder="请输入" style="margin-right: 10px"  />

            <a-select   style="width:100px;margin-right: 10px;" v-model="item.unit" v-show="item.isConditionalPostage" placeholder="请输入">
              <a-select-option value="0" >
                件
              </a-select-option>
              <a-select-option value="1" >
                元
              </a-select-option>
            </a-select>
            <span v-show="item.isConditionalPostage">包邮</span>
            <span v-show="item.isConditionalPostage && item.unit == 1 && item.satisfyPriceNumber">
              ({{item.satisfyPriceNumber}}元是指用券前的商品价格)
            </span>
          </div>
          <div class="none-delivery" v-show="item.isDelivery == 2">
            <p>
              1、不配送区域的买家将极有可能无法搜索和查看该运费模板绑定的商品；
            </p>
            <p>
              2、收货地址为不配送区域的买家将无法购买该运费模板绑定的商品；
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="abc" style="width: 100%;display: flex;justify-content: center;margin: 20px 0">
      <a-checkbox @change="onChangeCheck" :checked="checked">
        将本模版设为新建商品时默认使用的模版
      </a-checkbox>
    </div>
    <div style="margin: 0 auto;display: flex;justify-content: space-between;width: 8%">
      <a-button type="primary" @click="sure">确定</a-button>
      <a-button @click="push1">取消</a-button>
    </div>
  </div>
</template>
<script>
  import {getAction,postAction,putAction} from '@/api/manage'
  import Vue from 'vue'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  export default{
    name: 'AddTemplate',

    data(){
      return {
        formLayout: 'Vertical',
        form: this.$form.createForm(this, {name: 'coordinated'}),
        checkedList: [],
        indeterminate: true,
        checkAll: false,
        plainOptions:[],
        RadioGroup: 0,
        isPeisong: 1,
        //固定的包邮配送地址多选
        NoChangeplainOptions:"",
        checkShipping:false,
        //判断是编辑进入页面还是添加进入页面
        part:0,
        //所在城市联想
        cityAllData:[
        ],
        //供应商列表
        supplierList:[],
        exemptionPostage:'',//地址一级options
        sysUserDTOs:[],//供应商数据
        //编辑回显的默认地址
        defaultCity:'',
        //可以显示回显默认地址
        canShowDefaultCity:false,
        //地址转换拼接地址
        areaAddressList:[],
        //检查是否选中默认
        checked:false,
        //默认供应商  反选
        supplyDefault:'',
        //上一次的包邮地址选择
        lastExemptionPostage:[],
        AllData:{
          sysAreaId:'',   //地址ID
          sysUserId:'',  //供应商id
          placeDispatch:'',//发货地
          name:'',      //模板名称
          exemptionPostage:'',//包邮配送区域 ID字符串
          templateType:'0',   //全部包邮  0  不是包邮  1
          delFlag:'0',//删除状态
          isTemplate:'0', //是否默认
        },
        url:{
          adds: "/providerTemplate/providerTemplate/add",
          edits: "/providerTemplate/providerTemplate/edit",
          getList:"/sysArea/sysArea/getList",
          findByParentId: "/sysArea/sysArea/findByParentId",
          getUserByRoleName:"/sys/user/getUserByRoleName",
        },
        PostageArea:[]


      }
    },
    //页面加载
    created() {
      let part = this.$route.query.part;
      let info = JSON.parse(localStorage.getItem('supplierFreightTemplate'))
      if(part){
        //添加返回1  编辑返回2
        this.part = part;
      }
      if(part == 1){
        this.canShowDefaultCity = true
      }
      this.getList(()=>{
        let result = []
        if(this.part == 1){
          for(let item of this.plainOptions){
            result.push(item.value)
          }
          Object.assign(this, {
            checkedList: result,
            checkAll: true,
          });
          this.lastExemptionPostage = result
        }
        if(info){
          //所在城市回显
          this.cityEchoDisplay(info);
        }
      });
      if (info) {
        this.AllData = Object.assign(this.AllData,info)
        if(this.AllData.isTemplate == 1){
          this.checked = true
        }else{
          this.checked = false
        }
        this.areaAddressList = this.AllData.placeDispatch.split(',')
        this.$nextTick(() => {
          this.RadioGroup = (info.chargeMode) * 1
          let AllSz = ''
          if(info.exemptionPostage){
            AllSz = info.exemptionPostage.split(',').map(item=>{
              return item * 1
            })
          }
          this.checkedList = AllSz
          this.model = Object.assign({},this.AllData);
          this.form.setFieldsValue(this.model)
          this.PostageArea = JSON.parse(info.mailDelivery)
          this.lastExemptionPostage =  AllSz
          // console.log(this.PostageArea)
          // debugger
          // this.form.setFieldsValue(pick(this.model1,str))
        })
//        this.AllData.placeDispatch = this.areaAddressList.split('-')
      }
//      const token = Vue.ls.get(ACCESS_TOKEN);
//      this.headers = {"X-Access-Token": token}
    },
    mounted(){
      if(this.$route.query.record){
        // let data = this.$route.query.record
        // console.log(data);
      }
      this.getUserByRoleName()
    },

    computed: {
      uploadAction: function () {
        return this.url.fileUpload;
      },
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.delFlag = "0"
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','sysUserId','name','sysAreaId','placeDispatch','exemptionPostage','chargeMode','mailDelivery','templateType'))
          //时间格式化
        });
      },
      getUserByRoleName(){
        let that = this;
        getAction(that.url.getUserByRoleName).then((res) => {
          if (res.success) {
            this.sysUserDTOs =res.result ;
            console.log('下拉:',res.result)
            // that.$message.success(res.message);
          } else {
            //that.$message.warning(res.message);
          }
        });
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
          }
        })

      },
      //选择供应商
      selectSupply(id){
        this.AllData.sysUserId = id
      },
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
            //包邮配送区域地址
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
            this.$message.warning(res.message);
          }
        });
      },

      onChange(checkedList) {
        this.indeterminate = !!this.checkedList.length && this.checkedList.length < this.plainOptions.length;
        this.checkAll = this.checkedList.length === this.plainOptions.length;
        this.AllData.exemptionPostage = checkedList.join(',')
        // console.log(checkedList,this.checkedList,checkedList.join(','))
        if(this.lastExemptionPostage.length > checkedList.length){
          this.lastExemptionPostage.forEach((item,index)=>{
            if(checkedList.indexOf(item) == -1){
              //取消勾选（增加城市）
              for(let item2 of this.NoChangeplainOptions){
                if(item2.value == item){
                  this.PostageArea.push({
                    //每个城市id
                    id:item2.value,
                    //城市
                    city:item2.label,
                    //是否配送
                    isDelivery:1,
                    //数量
                    count:"1",
                    //多少元
                    price:"0",
                    //每增加的数量
                    everyIncreaseCount:"0",
                    //每增加的价格
                    everyIncreasePrice:'0',
                    //是否指定包邮
                    isConditionalPostage:false,
                    //满价格number
                    satisfyPriceNumber:'',
                    //价格单位
                    unit:'0',
                  })
                  break;
                }
              }
            }
          })
        }else{
          checkedList.forEach((item,index)=>{
            if(this.lastExemptionPostage.indexOf(item) == -1){
              this.PostageArea.forEach((item2,index2)=>{
                if(item2.id == item){
                  console.log(this.PostageArea,index2);
                  debugger;
                  this.PostageArea.splice(index2,1);
                }
              })
            }
          })
        }
        this.lastExemptionPostage =  checkedList
      },
      onCheckAllChange(e) {
        let dom = e?e.target:this.$refs.checkbox;
        let result = [];
        let sz = [];
        if(dom.checked){
          for(let item of this.plainOptions){
            result.push(item.value)
          }
          this.AllData.exemptionPostage = result.join(',')
        }else{
          for(let item2 of this.NoChangeplainOptions){
            sz.push({
              //每个城市id
              id:item2.value,
              //城市
              city:item2.label,
              //是否配送
              isDelivery:1,
              //数量
              count:"1",
              //多少元
              price:"10",
              //每增加的数量
              everyIncreaseCount:"10",
              //每增加的价格
              everyIncreasePrice:'10',
              //是否指定包邮
              isConditionalPostage:false,
              //满价格number
              satisfyPriceNumber:100,
              //价格单位
              unit:'0',
            })
          }
          this.AllData.exemptionPostage = ''
        }
        this.PostageArea = sz
        Object.assign(this, {
          checkedList: dom.checked ? result : [],
          indeterminate: false,
          checkAll: dom.checked,
        });
        // console.log(this.checkedList)
      },
      onChangeRadioGroup(){

      },
      onChangePeisongGroup(){

      },
      onChangeCheckShipping(e,index){
        this.PostageArea[index].isConditionalPostage = e.target.checked
      },
      //确认按钮
      sure(){
        let a  = this;
        let url;
        this.AllData.placeDispatch = this.areaAddressList.join(',')
        if(this.part == 2){
          url = a.url.edits
        }else{
          url = a.url.adds
        }
        this.form.validateFields((err, values) => {
          if(err){
            return
          }
          // this.$nextTick(() => {
            // this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','sysUserId','name','sysAreaId','placeDispatch','exemptionPostage','chargeMode','mailDelivery','templateType'))
            //时间格式化
          // });
          values.sysAreaId = this.AllData.sysAreaId;
          values.placeDispatch = this.AllData.placeDispatch;
          values.exemptionPostage = this.AllData.exemptionPostage;
          values.templateType = this.AllData.templateType;
          values.delFlag = this.AllData.delFlag;
          if(this.checked){
            values.isTemplate = 1;
          }else{
            values.isTemplate = 0;
          }
          values.sysUserId = this.AllData.sysUserId;
          values.id = this.AllData.id;
          values.chargeMode   = this.RadioGroup
          values.mailDelivery = JSON.stringify(this.PostageArea)
          if(this.part ==  2){
            putAction(url,values).then((res)=>{
              if (res.code == 200){
                a.$message.success(res.message);
                a.$router.push({path:"/provider/ProviderTemplateList"})
              }else {
                a.$message.success("修改失败")
              }
            })
          }else{
            postAction(url,values).then((res)=>{
              if (res.code == 200){
                a.$message.success(res.message);
                a.$router.push({path:"/provider/ProviderTemplateList"})
              }else {
                a.$message.success("添加失败")
              }
            })
          }

        })

      },
      //是否默认勾选
      onChangeCheck(e){
        this.checked = e.target.checked;
      }

    },
    watch:{
      checkAll(){
        if(this.checkAll){
          this.AllData.templateType = 0
        }else{
          this.AllData.templateType = 1
        }
      },
    }
  }
</script>
<style lang="less">
  .AddTemplate {
    color: black;
    width: 100vw;
    background: white;
    padding: 30px;
    .ant-checkbox-group-item + .ant-checkbox-group-item {
      margin-left: 0;
      margin-bottom: 20px;
    }
    .ant-col-5 {
      width: 8%;
    }
    .ant-form-item-children {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .head {
      cursor: pointer;
      font-size: 22px;
      border-bottom: 1px solid gray;
      padding-bottom: 20px;
    }
    .content {
      width: 80%;
      /*background: gray;*/
      color: black;
      .title {
        font-weight: 700;
        font-size: 15px;
        margin: 15px 0;
      }
      .detail {
        width: 100%;
        background: #eeeeee;
        padding: 20px;
        min-height: 70px;
        .radio-group {
          float: left;
        }
        > div:nth-child(1) {
          line-height: 22px;
          font-size: 12px;
          display: flex;
          justify-content: space-around;
          float: left;
          flex-direction: column;
          margin-top: 40px;
        }
        .ant-checkbox-group {
          width: 90%;
          margin-left: 3%;
        }
        .card-content {
          width: 100%;
          background: white;
          padding: 20px;
          border: 1px solid #CCCCCC;
          margin-bottom: 20px;
          .card-title {
            float: left;
            width: 70px;
            margin-right: 30px;
            text-align: center;
            color: white;
            background: #0099FF;
            padding: 2px 10px;
            border-radius: 10px;
          }
          >.ipt-cnt{
            width:95%;
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            >div{
              width: 22%;
              display: flex;
              align-items: center;

            }
            span{
              text-align: center;
              min-width: 30%;
            }
            input{
              margin:0 10px;
            }
          }
          .free-shipping{
            display: flex;
            align-items: center;
            margin-top: 20px;
            input{
              width: 250px;
              margin:  0 15px;
            }
          }
          .none-delivery{
            line-height: 30px;
            margin-top: 20px;

          }
        }
      }

    }
    .form-detail {
      margin-left: 8%;
    }

  }
</style>