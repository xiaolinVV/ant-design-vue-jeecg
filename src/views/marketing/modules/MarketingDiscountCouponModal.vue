<template>
  <div>
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
            label="优惠金额">
            <a-input-number v-decorator="[ 'price', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="优惠券名称">
            <a-input placeholder="请输入优惠券名称" v-decorator="['name', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="优惠券规则">
            <a-input placeholder="请输入优惠券规则" v-decorator="['regulation', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="发行人；0：平台；1：店铺">
            <a-input placeholder="请输入发行人；0：平台；1：店铺" v-decorator="['publisher', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="会员id">
            <a-input placeholder="请输入会员id" v-decorator="['memberListId', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="店铺id">
            <a-input placeholder="请输入店铺id" v-decorator="['sysUserId', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="开始时间">
            <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'startTime', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="结束时间">
            <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'endTime', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="优惠券状态；0:未生效；1：已生效（未使用）；2：已使用；3：已过期；4：已失效">
            <a-input placeholder="请输入优惠券状态；0:未生效；1：已生效（未使用）；2：已使用；3：已过期；4：已失效" v-decorator="['status', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="券号">
            <a-input placeholder="请输入券号" v-decorator="['qqzixuangu', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="领取渠道名称">
            <a-input placeholder="请输入领取渠道名称" v-decorator="['theChannel', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="平台渠道id">
            <a-input placeholder="请输入平台渠道id" v-decorator="['marketingChannelDiscountId', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="使用门槛说明">
            <a-input placeholder="请输入使用门槛说明" v-decorator="['threshold', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="使用时间">
            <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'userTime', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="实际抵扣金额（核销默认全抵）">
            <a-input-number v-decorator="[ 'practicalDeduction', {}]" />
          </a-form-item>

        </a-form>
      </a-spin>
    </a-modal>
    <!--店铺商品信息弹出-->
    <a-modal title="商品信息" :footer="null" :width="1000" v-model="visiblGoodsStoreInformation" @ok="hideModalGoodsInformation()" okText="确认" cancelText="取消">
      <div  style="margin-bottom: 20px">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">

              <a-col :md="6" :sm="8">
                <a-form-item label="商品名称">
                  <a-input placeholder="请输入商品名称" v-model="queryParam.goodName"></a-input>
                </a-form-item>
              </a-col>
                <a-form-item
                  style="display: flex;"
                  label="商品分类">

                  <a-select v-model="queryParam.goodStoreTypeIdOne"    placeholder="请选择"  @change="chooseMedicine"   style="width:100px;margin-right: 10px;">
                    <a-select-option value="">请选择</a-select-option>
                    <a-select-option v-for="item in listGoodType" :value="item.id"   >{{ item.name }}</a-select-option>
                  </a-select>

                  <a-select v-model="queryParam.goodStoreTypeIdTwo"  placeholder="请选择"   style="width:100px;margin-right: 10px;" ><!--v-model="id"-->
                    <a-select-option value="">请选择</a-select-option>
                    <a-select-option v-for="item in listGoodType1"   :value="item.id">{{ item.name }}</a-select-option><!--:defaultValue="listGoodType1.length>0?listGoodType1[0].name : ''"-->
                  </a-select><!--@change="chooseMedicine1"-->
                  <!-- <a-select v-model="queryParam.goodTypeIdThreeLevel"   placeholder="请选择"   style="width:100px;margin-right: 10px;">
                     <a-select-option v-for="item in listGoodType2"   :value="item.id" >{{ item.name }}</a-select-option>&lt;!&ndash;:defaultValue="listGoodType2.length>0?listGoodType2[0].name : ''"&ndash;&gt;
                   </a-select>-->
                </a-form-item>
              <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
              </a-col>

            </a-row>
          </a-form>
        </div>
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="columns"
          :pagination="ipagination"
          :dataSource="listGoodList"

        >
          <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
          <template slot="mainPicture" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-avatar shape="square" v-if="record.mainPicture != undefined " :src="getAvatarView(JSON.parse(record.mainPicture)[0])" icon="user"/>
              <a-avatar shape="square" v-if="record.mainPicture == undefined || record.mainPicture ==''  " :src="getAvatarView(record.mainPicture)" icon="user"/>
            </div>
          </template>
        </a-table>
      </div>
    </a-modal>

    <!--平台商品信息弹出-->
    <a-modal title="商品信息" :footer="null" :width="1000" v-model="visiblGoodsInformation" @ok="hideModalGoodsInformation()" okText="确认" cancelText="取消">
      <div  style="margin-bottom: 20px">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">

              <a-col :md="6" :sm="8">
                <a-form-item label="商品名称">
                  <a-input placeholder="请输入商品名称" v-model="queryParam.goodName"></a-input>
                </a-form-item>
              </a-col>
              <a-form-item
                style="display: flex;"
                label="商品分类">
                <a-select v-model="queryParam.goodTypeIdOne"    placeholder="请选择"  @change="chooseMedicineGood"   style="width:100px;margin-right: 10px;">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option v-for="item in listGoodTypes" :value="item.id"   >{{ item.name }}</a-select-option>
                </a-select>

                <a-select v-model="queryParam.goodTypeIdTwo"  placeholder="请选择" @change="chooseMedicineGood1"  style="width:100px;margin-right: 10px;" ><!--v-model="id"-->
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option v-for="item in listGoodType1"   :value="item.id">{{ item.name }}</a-select-option><!--:defaultValue="listGoodType1.length>0?listGoodType1[0].name : ''"-->
                </a-select>
                <a-select v-model="queryParam.goodTypeIdThree"   placeholder="请选择"   style="width:100px;margin-right: 10px;">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option v-for="item in listGoodType2"   :value="item.id" >{{ item.name }}</a-select-option><!--:defaultValue="listGoodType2.length>0?listGoodType2[0].name : ''"-->
                </a-select>
              </a-form-item>
              <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
              </a-col>

            </a-row>
          </a-form>
        </div>
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="columns"
          :pagination="ipagination"
          :dataSource="listGoodList"
        >
          <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
          <template slot="mainPicture" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-avatar shape="square" v-if="record.mainPicture != undefined " :src="getAvatarView(JSON.parse(record.mainPicture)[0])" icon="user"/>
              <a-avatar shape="square" v-if="record.mainPicture == undefined || record.mainPicture ==''  " :src="getAvatarView(record.mainPicture)" icon="user"/>
            </div>
          </template>
        </a-table>
      </div>
    </a-modal>


  </div>

</template>

<script>
  import { filterObj } from '@/utils/util';
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  export default {
    name: "MarketingDiscountCouponModal",
    mixins: [JeecgListMixin],
    data () {
      return {
        title:"操作",
        visible: false,
        visiblGoodsInformation:false,
        visiblGoodsStoreInformation:false,
        listGoodType1:[],
        listGoodType2:[],
        listGoodType:[],
        listGoodList:[],
        listGoodTypes:[],
         id:"",
        isDiscount:"",
        queryParam: {
          goodName:"",
          goodStoreTypeIdOne:"",
          goodStoreTypeIdTwo:""
        },
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        // 商品信息表头
        columns: [
          {
            title: '商品主图',
            align:"center",
            dataIndex: 'mainPicture',
            scopedSlots: {customRender: "mainPicture"}
          },
          {
            title: '商品名称',
            align:"center",
            dataIndex: 'goodName'
          },
          {
            title: '商品分类',
            align:"center",
            dataIndex: 'goodStoreTypeNames'
          },
          {
            title: '市场价',
            align:"center",
            dataIndex: 'marketPrice'
          },
          {
            title: '销售价',
            align:"center",
            dataIndex: 'price'
          },
          {
            title: '成本价',
            align:"center",
            dataIndex: 'costPrice',
          },
          {
            title: '会员价',
            align:"center",
            dataIndex: 'vipPrice'
          },
          {
            title: '库存',
            align:"center",
            dataIndex: 'repertory'
          }],
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          add: "/marketingDiscountCoupon/marketingDiscountCoupon/add",
          edit: "/marketingDiscountCoupon/marketingDiscountCoupon/edit",
          imgerver: window._CONFIG['domianURL'] + "/sys/common/view",
          getgoodTypeListcascade:"/GoodStoreType/goodStoreType/getgoodStorTypeListcascade",
          getgoodTypeListcascadeGood:"/goodType/goodType/getgoodTypeListcascade",//平台分类
          cancelAfterVerificationGoodList:"/marketingDiscountCoupon/marketingDiscountCoupon/cancelAfterVerificationGoodList",
        },
      }
    },
    created () {
    },
    mounted() {
      this.goodTypeListcascade('0')
      this.goodTypeListcascadeGood("0");
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.model.delFlag = 0;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','price','name','regulation','publisher','memberListId','sysUserId','status','qqzixuangu','theChannel','marketingChannelDiscountId','threshold','practicalDeduction'))
		  //时间格式化
          this.form.setFieldsValue({startTime:this.model.startTime?moment(this.model.startTime):null})
          this.form.setFieldsValue({endTime:this.model.endTime?moment(this.model.endTime):null})
          this.form.setFieldsValue({userTime:this.model.userTime?moment(this.model.userTime):null})
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
            formData.startTime = formData.startTime?formData.startTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.endTime = formData.endTime?formData.endTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.userTime = formData.userTime?formData.userTime.format('YYYY-MM-DD HH:mm:ss'):null;
            
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
      //商品信息弹窗
      showModalGoodsInformation(id,isDiscount){
        this.queryParam.goodName =""
        this.queryParam.goodStoreTypeIdOne = "",
        this.queryParam.goodStoreTypeIdTwo = ""
       this.id = id
       this.isDiscount = isDiscount
        if(this.isDiscount == "0"){
          //优惠券店铺商品
           this.visiblGoodsStoreInformation = true;
        }else{
          //兑换券平台商品
          this.visiblGoodsInformation = true;
        }
        getAction(this.url.cancelAfterVerificationGoodList, {marketingDiscountCouponId:id,isDiscount:isDiscount,goodStoreListVo:this.queryParam}).then((res) => {
          if (res.success && res.result) {
            this.listGoodList = res.result.records
            console.log("this.listGoodList",this.listGoodList)
          } else {
            this.$message.warning(res.message);
          }
        });

      },
      hideModalEmemberInformation(){
        this.visiblGoodsInformation = false;
      },
      //店铺分类搜索
      goodTypeListcascade (parentId){
        let that = this;
        that.listGoodType1=[];
        that.listGoodType2=[];
        getAction(that.url.getgoodTypeListcascade, {parentId: parentId}).then((res) => {

          if (res.success) {
            that.listGoodType=res.result.listGoodStorType

            console.log("that.listGoodType",that.listGoodType)
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      //店铺查询二级分类
      chooseMedicine:function(value){
        console.log("parentId1111111111"+value)
        let that = this;
        //console.log("parentId1111111111"+value)
        that.listGoodType1="";
        that.listGoodType2="";
        getAction(that.url.getgoodTypeListcascade, {parentId:value}).then((res) => {
          if (res.success) {
            that.listGoodType1=res.result.listGoodStorType
            this.queryParam.goodStoreTypeIdTwo = ""
            console.log(that.listGoodType1)
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      //兑换券平台商品分类搜索
      chooseMedicineGood:function(value){
        console.log("parentId1111111111"+value)
        let that = this;
        //console.log("parentId1111111111"+value)
        that.listGoodType1="";
        that.listGoodType2="";
        getAction(that.url.getgoodTypeListcascadeGood, {parentId:value}).then((res) => {
          if (res.success) {
            that.listGoodType1 = res.result.listGoodType
            that.queryParam.goodTypeIdTwo = "",
            that.queryParam.goodTypeIdThree = "",
            console.log(that.listGoodType1)
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      //兑换券平台商品分类搜索
      chooseMedicineGood1:function (value) {

        console.log("parentId2222"+value)
        let that = this;
        that.listGoodType2=[];
        getAction(that.url.getgoodTypeListcascadeGood, { parentId: value}).then((res) => {
          if (res.success) {
            that.listGoodType2=res.result.listGoodType
            that.queryParam.goodTypeIdThree = "",
            console.log(that.listGoodType2)
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      //兑换券平台商品分类搜索
      goodTypeListcascadeGood (parentId){

        let that = this;
        that.listGoodType1=[];
        that.listGoodType2=[];
        that.goodTypeIdTwo = ""
        that.goodTypeIdThree = ""
        getAction(that.url.getgoodTypeListcascadeGood, {parentId: parentId}).then((res) => {

          if (res.success) {
            that.listGoodTypes =res.result.listGoodType
            //that.$message.success(res.message);
            //  console.log("res.message===="+res.result.listGoodType[0].id)

          } else {
            that.$message.warning(res.message);
          }
        });
      },


      getAvatarView: function (mainPicture) {
        return this.url.imgerver + "/" + mainPicture;
      },
  /************************** //弹窗搜索开始*******************************/
      searchQuery() {
        this.loadData(1);
      },
      loadData(arg) {
       /* if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }*/
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        this.goodStoreListVo = {
          goodName:this.queryParam.goodName,
          goodStoreTypeIdOne:this.queryParam.goodStoreTypeIdOne,
          goodStoreTypeIdTwo:this.queryParam.goodStoreTypeIdTwo}
          console.log("this.goodStoreListVo",this.goodStoreListVo)
        if(this.isDiscount == "0"){
          getAction(this.url.cancelAfterVerificationGoodList, {marketingDiscountCouponId:this.id,isDiscount:this.isDiscount,
            goodName:this.queryParam.goodName,
            goodStoreTypeIdOne:this.queryParam.goodStoreTypeIdOne,
            goodStoreTypeIdTwo:this.queryParam.goodStoreTypeIdTwo}).then((res) => {
            // getAction(this.url.cancelAfterVerificationGoodList, {marketingDiscountCouponId:this.id,isDiscount:this.isDiscount,goodStoreListVo:params}).then((res) => {
            if (res.success && res.result) {
              this.listGoodList = res.result.records;
              this.ipagination.total = res.result.total;
            }
            if(res.code===510){
              this.$message.warning(res.message)
            }
            this.loading = false;
          })

        }else{
          getAction(this.url.cancelAfterVerificationGoodList, {marketingDiscountCouponId:this.id,isDiscount:this.isDiscount,
            goodName:this.queryParam.goodName,
            goodStoreTypeIdOne:this.queryParam.goodTypeIdOne,
            goodStoreTypeIdTwo:this.queryParam.goodTypeIdTwo,
            goodStoreTypeIdThree:this.queryParam.goodTypeIdThree}).then((res) => {
            // getAction(this.url.cancelAfterVerificationGoodList, {marketingDiscountCouponId:this.id,isDiscount:this.isDiscount,goodStoreListVo:params}).then((res) => {
            if (res.success && res.result) {

              this.listGoodList = res.result.records;
              this.ipagination.total = res.result.total;
            }
            if(res.code===510){
              this.$message.warning(res.message)
            }
            this.loading = false;
          })
        }

      },
      getQueryParams() {
        //获取查询条件
        let sqp = {}
        if(this.superQueryParams){
          sqp['superQueryParams']=encodeURI(this.superQueryParams)
        }
        var param = Object.assign(sqp, this.queryParam, this.isorter ,this.filters);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return filterObj(param);
      },
    }
  }
</script>

<style lang="less" scoped>

</style>