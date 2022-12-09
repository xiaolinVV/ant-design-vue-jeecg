<template>
  <a-card :bordered="false">




    <div class="table-operator" style="width: 80%">
      <a-spin :spinning="confirmLoading" >
        <a-form :form="form"  ><!--@submit="handleSubmit"-->
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="商品分类">
            <!-- <span   >{{ GoodTypeByid }} </span>-->
            <span class="ant-form-text" v-decorator="['goodStoreTypeId', {}]" >{{ GoodTypeByid }}</span>

            <a style="margin-left: 40px" @click="updataGoodType">修改分类 </a>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="商品名称">
            <a-input placeholder="请输入商品名称" maxlength="30" v-decorator="['goodName', { rules: [{ required: true, message: '请选择' }] }]"  />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="商品描述">
            <a-textarea placeholder="请输入商品描述" v-decorator="['goodDescribe', {}]" :rows="4" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="商品图片">
            <a-upload
              listType="picture-card"
              :fileList="fileList1"
              :action="uploadAction"
              :multiple="true"
              :headers="headers"
              @preview="handlePreview1"
              @change="handleChange1"
              v-decorator="['mainPicture',validatorRules.mainPicture]"
            >
              <!--  v-decorator="['mainPicture',{ rules: [{ required: true, message: '请上传图片' }] }]"-->
              <div v-if="fileList1.length < 5">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传({{ uploadingNumber1 }}/5)</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible1" :footer="null" @cancel="handleCancel1">
              <img preview="1" alt="example" style="width: 100%" :src="previewImage1" />
            </a-modal>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="视频地址">
            <a-upload
              listType="picture-card"
              :fileList="fileList2"
              :headers="headers"
              :action="uploadAction"
              @preview="handlePreview2"
              @change="handleChange2">
              <div v-if="fileList2.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传视频</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible2" :footer="null" @cancel="handleCancel2">
              <img preview="1" alt="example" style="width: 100%" :src="previewImage2" />
            </a-modal>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="商品详情图">
            <a-upload
              listType="picture-card"
              :fileList="fileList3"
              :headers="headers"
              :multiple="true"
              :action="uploadAction"
              @preview="handlePreview3"
              @change="handleChange3">
              <div v-if="fileList3.length < 20">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传({{ uploadingNumber }}/20)</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible3" :footer="null" @cancel="handleCancel3">
              <img preview="1" alt="example" style="width: 100%" :src="previewImage3" />
            </a-modal>
          </a-form-item>


          <!--价格与库存-->
          <div>
            <h2 style="margin-left: 10%;">
          <span style="color: red;">
            *
          </span>
              价格与库存
            </h2>
            <div class="wrap">
              <div class="title">
             <span>
               商品规格
             </span>
                <div>
                  <a-button  icon="plus" @click="addSpecification()">添加规格</a-button>
                </div>
                <div>
                  最多添加两个商品规格，第一个商品规格可添加规格图片
                </div>
              </div>

              <div class="content" v-for="(item,index) in CommoditySpecificationData ">
                <div class="floor">
                  <a-input placeholder="请输入规格名" class="ipt" v-model="item.CommodityStyle" />
                  <span @click="deleteSpecification(index)" >
                 删除规格
               </span>
                </div>
                <div class="add">
                  <a-button  icon="plus" @click="addSpecificationDetail(index)">添加</a-button>
                  <div   v-for="(item2,index2) in item.classification" class="ipt-wrap" @mouseenter="enter(index2)" @mouseleave="leave()">
                    <a-icon type="close-circle"  v-show="index2 == iptActiveIndex" @click="clearClassification(index,index2)"/>
                    <a-input placeholder="请输入" v-decorator="[item, { rules: [{ required: true, message: '请选择' }] }]"    v-model="item2.value" @change="iptChange2(index2,item2.value,index)" :disabled="item2.value!='' && index2 != item.classification.length - 1"/>
                  </div>
                </div>
              </div>

            </div>
            <div class="wrap">
              <div class="title">
                <span>
                  价格与库存
                </span>
              </div>
              <div class="content" >
                <a-table :columns="columns" :dataSource="data" bordered>
                  <template  v-for="(item,index) in ['price','costPrice','supplyPrice','vipPrice','repertory','skuNo','specificationPicture']" :slot="item"  slot-scope="text, record, index"   >
                    <a-form-item   class="anty-img-wrap" :key="item" v-if="item!='specificationPicture'">

                      <a-input type="text" :min="0"  :max="9999999" :step="0.1" v-decorator="[item + index, item != 'skuNo' ? validatorRules.SpecificationsInputCheck : validatorRules.skucheck]"    placeholder=""  :value="text" @change="handleChange($event.target.value,record.key,item)"/>
                      <!--v-decorator="[item + index, item != 'skuNo' ? validatorRules.SpecificationsInputCheck : validatorRules.skucheck]"-->
                    </a-form-item>
                    <a-form-item
                      label="" v-else>
                      <a-upload
                        listType="picture-card"
                        :fileList="fileList4"
                        :action="uploadAction"
                        :multiple="true"
                        :headers="headers"
                        @preview="handlePreview4"
                        @change="handleChange44"
                        :data-set="item + index"

                      >
                        <div v-if="fileList4.length < 1">
                          <a-icon type="plus" />
                          <div class="ant-upload-text">上传({{ uploadingNumber4 }}/1)</div>
                        </div>
                      </a-upload>
                      <a-modal :visible="previewVisible4" :footer="null" @cancel="handleCancel4">
                        <img preview="1" alt="example" style="width: 10%" :src="previewImage4" />
                      </a-modal>
                    </a-form-item>
                  </template>
                </a-table>

                <a-table :columns="columns2" :dataSource="data2" bordered style="margin-top: 60px">
                  <template v-for="(item,index) in ['price','costPrice','supplyPrice','vipPrice','repertory','goodNo']" :slot="item"  slot-scope="text, record, index"   >
                    <a-form-item class="anty-img-wrap" :key="item">
                      <a-input type="text" placeholder=""   :value="text" @change="handleChange4($event.target.value,record.key,item)" v-if="CommoditySpecificationData.length == 0 || item == 'goodNo'"/>
                      <p v-else>
                        {{text}}
                      </p>
                    </a-form-item>
                  </template>
                </a-table>
              </div>
            </div>
            <a-form-item
              style="margin-top: 10px"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="商品市场价">
              <a-input placeholder="应高于商品最大销售价" v-model="marketPrice"  />
              <!-- v-decorator="['marketPrice', { initialValue: marketPrice, rules: [{ required: true, message: '请输入' }] }]"-->

            </a-form-item>
          </div>
          <!--服务与承诺-->
          <div>
            <h2 style="margin-left: 10%;">
          <span style="color: red;">
            *
          </span>
              服务与承诺
            </h2>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="运费模板">
              <a-select style="width: 150px"
                        v-decorator="['storeTemplateId',{ rules: [{ required: true, message: '请选择' }] }]"
                        placeholder="请选择"
              >
                <a-select-option value="0">
                  包邮
                </a-select-option>
                <a-select-option value="1">
                  案件
                </a-select-option>
                <a-select-option value="2">
                  按重量
                </a-select-option>
              </a-select>
              <span style="margin-left:40px">新建运费模板</span>
            </a-form-item>

            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="自提">
              <a-radio-group

                v-decorator="['noutoasiakasStatus',{ rules: [{ required: true, message: '请选择' }] }]">
                <a-radio value="1">
                  支持
                </a-radio>
                <a-radio value="0">
                  不支持
                </a-radio>
                  </a-radio-group>
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="配送">
              <a-radio-group
                v-decorator="['distributionStatus',{ rules: [{ required: true, message: '请选择' }] }]">
                <a-radio value="1">
                  支持
                </a-radio>
                <a-radio value="0">
                  不支持
                </a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="服务承诺">
              <a-checkbox-group
                v-decorator="['commitmentCustomers',{ rules: [{ required: true, message: '请输入' }] },]"
                style="width: 100%;"
              >
                <a-row>
                  <a-col :span="8">
                    <a-checkbox value="0">
                      7天无理由退换货
                    </a-checkbox>
                  </a-col>
                  <a-col :span="8">
                    <a-checkbox  value="1">
                      假一赔十
                    </a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </a-form-item>
          </div>


          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            style="display: flex;justify-content:center;margin: 0 auto;width: 40%;">
            <a-button  @click="prevStep(0)">
              保存草稿箱
            </a-button>
            <a-button style="margin-left: 8px" type="primary"   @click="prevStep(1)">
              提交并上架
            </a-button>
          </a-form-item>

        </a-form>
      </a-spin>
    </div>
  </a-card>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { disabledAuthFilter } from "@/utils/authFilter"
  import { getAction } from '@/api/manage'
  import Vue from 'vue'
  import {mapActions,mapState} from 'vuex';
  import { postAction } from '@/api/manage'
  import RowspanTable from '../../jeecg/RowspanTable'
  import SplitPanel from '../../jeecg/SplitPanel'
  //字典
  import {filterDictText, initDictOptions} from '@/components/dict/JDictSelectUtil'
  //去除空字符串

  export default {
    name: "GoodListadd2",
    components: { SplitPanel, RowspanTable },
    data () {

      return {
        title:"操作",
        GoodTypeByid:[],
        GoodTypeByid1:"",
        supplyPriceRatio:0,
        addtest:{},
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

          //主图校验
          mainPicture:{
            rules: [{
              validator: this.mainPictureUplode,
            }]},
          //规格表单验证
          SpecificationsInputCheck:{rules: [{ required: true, pattern:(/(^[1-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{2}$)/), message: '只能输入两位小数的数字' }]},
          //sku规格验证
          skucheck:{},
        },
        url: {
          add: "/goodStoreList/goodStoreList/add",
          edit: "/goodStoreList/goodStoreList/edit",
          fileUpload: window._CONFIG['domianURL']+"/sys/common/upload",
          imgerver: window._CONFIG['domianURL']+"/sys/common/view",
        },

        //主图上传
        previewVisible1: false,
        previewImage1: '',
        fileList1: [

        ],
        uploadingNumber1:0,
        previewImage1list:{},
        //视频上传
        previewVisible2: false,
        previewImage2: '',
        fileList2: [],
        previewImage2list:{},
        //多图上传
        previewVisible3: false,
        previewImage3: '',
        fileList3: [],
        uploadingNumber:0,
        previewImage3list:{},
        //规格上传
        previewVisible4: false,
        previewImage4: '',
        fileList4: [],
        uploadingNumber4:0,
        previewImage4list:{},
        selectUploadIndex:"0",

        //表单头部
        columns:[
          {
            title: '规格',
            dataIndex: 'specification',
            align:"center",
            scopedSlots: { customRender: 'specification' },
          },
          {
            title: '销售价（元）',
            dataIndex: 'price',
            align:"center",
            scopedSlots: { customRender: 'price' },
          },
          {
            title: '成本价（元）',
            dataIndex: 'costPrice',
            align:"center",
            scopedSlots: { customRender: 'costPrice' },
          },
         /* {
            title: '供货价（元）',
            dataIndex: 'supplyPrice',
            align:"center",
            scopedSlots: { customRender: 'supplyPrice' },
          },*/
          {
            title: '会员价（元）',
            dataIndex: 'vipPrice',
            align:"center",
            scopedSlots: { customRender: 'vipPrice' },
          },
          {
            title: '库存',
            dataIndex: 'repertory',
            align:"center",
            scopedSlots: { customRender: 'repertory' },
          },
          {
            title: 'sku编码',
            dataIndex: 'skuNo',
            align:"center",
            scopedSlots: { customRender: 'skuNo' },
          },
          {
            title: '规格图',
            dataIndex: 'specificationPicture',
            align:"center",
            scopedSlots: { customRender: 'specificationPicture' },
          },
        ],
        //表单数据
        data:[
        ],
        // 商品规格数据
        CommoditySpecificationData:[

        ],
        //鼠标经过的ipt坐标
        iptActiveIndex:-1,
        //表单2
        columns2:[
          {
            title: '销售价',
            dataIndex: 'price',
            align:"center",
            scopedSlots: { customRender: 'price' },
          },
          {
            title: '成本价',
            dataIndex: 'costPrice',
            align:"center",
            scopedSlots: { customRender: 'costPrice' },
          },
         /* {
            title: '供货价',
            dataIndex: 'supplyPrice',
            align:"center",
            scopedSlots: { customRender: 'supplyPrice' },
          },*/
          {
            title: '会员价',
            dataIndex: 'vipPrice',
            align:"center",
            scopedSlots: { customRender: 'vipPrice' },
          },
          {
            title: '总库存',
            dataIndex: 'repertory',
            align:"center",
            scopedSlots: { customRender: 'repertory' },
          },
          {
            title: '商品编码',
            dataIndex: 'goodNo',
            align:"center",
            scopedSlots: { customRender: 'goodNo' },
          },
        ],
        data2:[
          {
            price:'0',
            costPrice:'0',
            supplyPrice:'0',
            vipPrice:'0',
            repertory:'0',
            goodNo:''
          }
        ],
        //商品市场价
        marketPrice:'0'
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token}

      if(this.storeManage){
        //开始加载时判断storeManage(vuex中)是否有值
        this.marketPrice = this.storeManage.marketPrice
        this.data2 = this.storeManage.data2
        this.data = this.storeManage.data
        this.goodName = this.storeManage.goodName
        this.model=this.storeManage.model
        console.log("this.model",this.model)
      }
    },
    beforeDestroy(){
      //页面销毁前保存数据到vuex的storeManage
      let info = {
        marketPrice:this.marketPrice,
        data2:this.data2,
        data:this.data,
        goodName:this.goodName,
        model:this.model,
        // form:this.$form.createForm(this, options),

      }

      this.changeStoreManage(info);
    },
    computed:{
      ...mapState(['storeManage']),
      uploadAction(){
        return this.url.fileUpload;
      },
      getMarketPrice(){
        return this.data2[0].price
      }

    },
    mounted(){
      if(this.$route.query.record){
        let data = this.$route.query.record
        console.log(data);
        // localStorage.setItem('data',JSON.stringify(data));
        // JSON.parse(localStorage.getItem('data'));
        //编辑
        this.GoodTypeByid= data.goodTypeNameSan//分类

        this.form.resetFields();
        this.model = Object.assign({}, data);
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','sysUserId','delFlag','mainPicture','goodName','nickName','price','goodStoreTypeId','vipPrice','goodNo','storeTemplateId','costPrice','activitiesType','marketPrice','status','goodDescribe','goodVideo','detailsGoods','repertory','frameStatus','frameExplain','statusExplain','specification','isSpecification','commitmentCustomers','delExplain','noutoasiakasStatus','distributionStatus','auditStatus'))
          //时间格式化
          this.form.setFieldsValue({delTime:this.model.delTime?moment(this.model.delTime):null})
        });
        //主图
        if(data.mainPicture){
          let obj = JSON.parse(data.mainPicture)
          let sz = [];
          let count=0;
          this.previewImage1list = data.mainPicture.toString()
          for(let item of Object.values(obj)){
            let ojb2 ={
              uid: count,
              name: `${count}.png`,
              status: 'done',
              url:this.url.imgerver+"/"+ item,
              response :{
                success: true,
                message: item,
                code: 0,
                result: null,
                timestamp: null}
            }
            sz.push(ojb2);
            count++
          }
          if(sz){
            this.fileList1 = sz
          }

        }
        //视频上传回选
        if(data.goodVideo){
          let obj1 = JSON.parse(data.goodVideo)
          let sz1 = [];
          let count1 = 0;
          this.previewImage2list = data.goodVideo.toString()

          for(let item of Object.values(obj1)){
            let ojb2 ={
              uid: count1,
              name: `${count1}.png`,
              status: 'done',
              url:this.url.imgerver+"/"+ item,
              response :{
                success: true,
                message: item,
                code: 0,
                result: null,
                timestamp: null}
            }
            sz1.push(ojb2);
            count1++
          }
          if(sz1){
            this.fileList2 = sz1
          }
        }
        //商品图片回选
        if(data.detailsGoods){
          let obj2 = JSON.parse(data.detailsGoods)
          let count2 = 0;
          let sz2 = [];
          this.previewImage3list = data.detailsGoods.toString()

          for(let item of Object.values(obj2)){
            let ojb2 ={
              uid: count2,
              name: `${count2}.png`,
              status: 'done',
              url:this.url.imgerver+"/"+ item,
              response :{
                success: true,
                message: item,
                code: 0,
                result: null,
                timestamp: null}
            }
            sz2.push(ojb2);
            count2++
          }
          if(sz2){
            this.fileList3 = sz2
          }

        }
        //规格

        let goodListSpecificationVOs = data.goodListSpecificationVOs;
        console.log("goodListSpecificationVOs",goodListSpecificationVOs)
        if(goodListSpecificationVOs){

          for(let a = 0;a < goodListSpecificationVOs.length;a++){
            goodListSpecificationVOs[a].key = a
          }
          this.data =  goodListSpecificationVOs;
          let str = '';
          let datas = {};
          for(let count = 0;count < goodListSpecificationVOs.length;count++){
            let name ='price'+ count,
              name1 = 'vipPrice'+ count,
              name2 = 'repertory'+ count,
              name3 = 'supplyPrice'+ count,
              name4 = 'skuNo'+ count,
              name5 = 'costPrice'+ count;
            datas[name]  =goodListSpecificationVOs[count].price,
              datas[name1] =goodListSpecificationVOs[count].vipPrice,
              datas[name2] =goodListSpecificationVOs[count].repertory,
              datas[name3] =goodListSpecificationVOs[count].supplyPrice,
              datas[name4] =goodListSpecificationVOs[count].skuNo,
              datas[name5] =goodListSpecificationVOs[count].costPrice,
              str= str+"'"+name+"'"+","+"'"+name1+"'"+","+"'"+name2+"'"+","+"'"+name3+"'"+","+"'"+name4+"'"+","+"'"+name5+"'"+","
          }
          this.model1 = Object.assign({},datas);
          this.$nextTick(() => {
            //this.form.setFieldsValue(pick(this.model1,str))
            this.form.setFieldsValue(this.model1)

          });
          if(data.specification){
            let specification = JSON.parse(data.specification) ;
            this.CommoditySpecificationData = specification
            console.log("this.CommoditySpecificationData",this.CommoditySpecificationData)

          }
        }
        console.log('data2',data)
        this.data2=[{
          costPrice: data.costPrice,
          goodNo: data.goodNo,
          price: data.price,
          repertory: data.repertory,
          supplyPrice: data.supplyPrice,
          vipPrice: data.vipPrice
        }]
        this.marketPrice = data.marketPrice
      }


      /**编辑结束*/
      console.log("this.$route.query.GoodTypeByid",this.$route.query.GoodTypeByid)
      if(this.$route.query.GoodTypeByid){
        this.GoodTypeByid = this.$route.query.GoodTypeByid
        console.log("this.GoodTypeByid ----",this.GoodTypeByid )
        let obj=this.$route.query.GoodTypeByid
        if(this.GoodTypeByid.length==2){
          this.GoodTypeByid =  obj[0][1]+"-"+obj[1][1];
          this.GoodTypeByid1 =   obj[1][0]
        }else if(this.GoodTypeByid.length==1){
          this.GoodTypeByid =  obj[0][1]
          this.GoodTypeByid1 = obj[0][0]
        }else {
          this.GoodTypeByid=[];
          this.GoodTypeByid1="";
        }

      }
    },

    // watch :{
    //   // getMarketPrice(){
    //   //   this.marketPrice = (this.data2[0].price * 1.1).toFixed(2)
    //   // }
    // },
    methods: {
      //改变市场价格
      ...mapActions(['changeStoreManage']),
      add () {
        this.edit({});
      },
      //添加规格
      addSpecification(){
        if(this.CommoditySpecificationData.length<2){
          //商品规格数据集合形式
          let data = {
            //规格名
            CommodityStyle:'',
            //规格值集合
            classification:[
              {
                value:''
              },
            ]
          }
          this.CommoditySpecificationData.push(data)
        }
      },
      //添加规格具体值
      addSpecificationDetail(index){
        let data = {
            value:''
          },
          classifyData = this.CommoditySpecificationData[index].classification;
        if(classifyData.length == 0 ){
          classifyData.push(data)
        }else{
          if(classifyData[classifyData.length-1].value.length>0){
            classifyData.push(data)
          }
        }
      },
      // 删除规格
      deleteSpecification(index){
        if(index == 0){
          this.CommoditySpecificationData = [];
          this.data = []
          this.$nextTick(()=>{
            this.RecalculationMinOrMax()
          })
        }
        if(index == 1){
          this.CommoditySpecificationData.splice(1,1);
          this.data = [];
          let sz = [];
          let count = 0
          for(let item of this.CommoditySpecificationData[0].classification){
            let data =  {
              key: count,
              specification: item.value,
              price: '',
              costPrice: '',
              vipPrice:'',
              supplyPrice:'',
              repertory:"",
              skuNo:'',
              specificationPicture:'',
            }
            sz.push(data)
            count++;
          }
          this.data = sz
          this.$nextTick(()=>{
            this.RecalculationMinOrMax()
          })
        }
      },
      //规格具体值内容变化时
      iptChange2(index,ct,wrapIndex){
        if(wrapIndex + 1 == 1 && this.CommoditySpecificationData.length == 1){
          if(this.data.length == index){
            let data =  {
              key: index + wrapIndex + 1,
              specification: ct,
              price: '',
              costPrice: '',
              supplyPrice:'',
              vipPrice:'',
              repertory:"",
              skuNo:'',
              specificationPicture:'',
            }
            this.data.push(data)
          }else{
            if(ct.length>0){
              this.data[index].specification = ct
            }else {
              this.data.splice(index,1)
            }
          }
        }
        if(wrapIndex + 1 == 2 || this.CommoditySpecificationData.length == 2){
          let sz = [];
          let count = 1;
          for(let item of this.CommoditySpecificationData[0].classification){
            for(let item2 of this.CommoditySpecificationData[1].classification){
              count++
              let shuzu = [item.value,item2.value]
              let data =  {
                key: count,
                specification: shuzu.join(','),
                price: '',
                costPrice: '',
                supplyPrice:'',
                vipPrice:'',
                repertory:"",
                skuNo:'',
                specificationPicture:'',
              }
              sz.push(data)
            }
          }
          this.data = sz;
        }
        this.$nextTick(()=>{
          this.RecalculationMinOrMax()
        })
      },
      //表单1内容input改变
      handleChange(value, key, column) {
        const newData = [...this.data];
        const target = newData.filter((item) => key === item.key)[0];
        if (target) {
          target[column] = value;
          this.data = newData;
          this.MinOrMax(column);
        }
      },
      //鼠标进入事件
      enter(index){
        this.iptActiveIndex = index
      },
      //鼠标离开事件
      leave(){
        this.iptActiveIndex = -1
      },
      //点击删除规格值
      clearClassification(index,index2){
        this.CommoditySpecificationData[index].classification.splice(index2,1);
        this.data.splice(index2,1)
        this.$nextTick(()=>{
          this.RecalculationMinOrMax()
        })
      },
      //表单2输入框输入事件
      handleChange4(value, key, column){
        const newData = [...this.data2];
        const target = newData.filter((item) => key === item.key)[0];
        if (target) {
          target[column] = value;
          this.data2 = newData;
        }

      },
      //判断范围值
      MinOrMax(column){
        this.$nextTick(()=>{
          let sz = [],
            type = '',
            Max,
            Min
          switch (column) {
            case 'price':
              for(let item of this.data){
                sz.push(item.price)
              }
              type = 'price';
              break;
            case 'costPrice':
              for(let item of this.data){
                sz.push(item.costPrice)
              }
              type = 'costPrice';
              break;
            case 'supplyPrice':
              for(let item of this.data){
                sz.push(item.supplyPrice)
              }
              type = 'supplyPrice';
              break;
            case 'vipPrice':
              for(let item of this.data){
                sz.push(item.vipPrice)
              }
              type = 'vipPrice';
              break;
            case 'repertory':
              for(let item of this.data){
                sz.push(item.repertory)
              }
              type = 'repertory';
              break;
          }
          sz = sz.notempty();
          if(type == 'repertory'){
            let result = 0;
            for(let i = 0; i < sz.length; i++) {
              result += sz[i]*1;
            }
            this.data2[0][type] = result
          }else{
            if(sz.length == 0){
              Max = 0;
              Min = 0
            }else{
              Max =  Math.max(...sz);
              Min = Math.min(...sz);
            }
            if(Min == Max){
              this.data2[0][type] = Min || Max;
            }else{
              this.data2[0][type] = `${Min} -- ${Max} `;
            }
          }
          if(type == 'price'){
            this.marketPrice = (Max * 1.1).toFixed(2);
          }
        })
      },
      //重新计算范围值
      RecalculationMinOrMax(){
        let Attribute = ['price','costPrice','supplyPrice','vipPrice','repertory'];
        for(let item of Attribute){
          let sz = [],
            type = item,
            Max,
            Min
          for(let item2 of this.data){
            sz.push(item2[type])
          }
          if(sz.length>0){
            Max =  Math.max(...sz);
            Min = Math.min(...sz);
            if(Min == Max){
              this.data2[0][type] = Min || Max;
            }else{
              this.data2[0][type] = `${Min} -- ${Max} `;
            }
            if(type == 'price'){
              this.marketPrice =(Max * 1.1).toFixed(2);
            }
          }else{
            this.data2[0][type] = `0`;
            this.marketPrice = '0'
          }
        }
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        if(this.model.delFlag=="" || this.model.delFlag==undefined){
          this.model.delFlag=0;
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','sysUserId','delFlag','mainPicture','goodName','nickName','price','goodStoreTypeId','vipPrice','goodNo','storeTemplateId','costPrice','activitiesType','marketPrice','status','goodDescribe','goodVideo','detailsGoods','repertory','frameStatus','frameExplain','statusExplain','specification','isSpecification','commitmentCustomers','delExplain','noutoasiakasStatus','distributionStatus','auditStatus'))
          //时间格式化
          this.form.setFieldsValue({delTime:this.model.delTime?moment(this.model.delTime):null})

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
            formData.delTime = formData.delTime?formData.delTime.format('YYYY-MM-DD HH:mm:ss'):null;

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
      /*主图上传*/
      //多图上传开始
      handleCancel1 () {
        this.previewVisible1 = false;
        this.close()
      },
      handlePreview1(file) {
        this.previewImage1 = file.url || file.thumbUrl;
        this.previewVisible1 = true;
      },
      handleChange1({ fileList  }) {
        console.log("fileList",fileList);
        this.fileList1 = fileList;
        let result = [];
        for(let item of fileList){
          let obj = {
            name:item.name,
            imgUrl:item.response?item.response.message:''
          };
          result.push(obj)
        }
        this.uploadingNumber1=result.length;
        let obj ={};
        for(var i=0;i<result.length;i++){
          obj[i] = result[i].imgUrl;
        }
        this.previewImage1list = JSON.stringify(obj).toString()
      },
      /*视频上传*/
      handleCancel2 () {
        this.previewVisible2 = false;
        this.close()
      },
      handlePreview2(file) {
        this.previewImage2 = file.url || file.thumbUrl;
        this.previewVisible2 = true;
      },
      handleChange2({ fileList  }) {
        this.fileList2 = fileList;
        let result = [];
        for(let item of fileList){
          let obj = {
            name:item.name,
            imgUrl:item.response?item.response.message:''
          };
          result.push(obj)
        }
        let obj ={};
        for(var i=0;i<result.length;i++){
          obj[i] = result[i].imgUrl;
        }
        this.previewImage2list = JSON.stringify(obj).toString()
        console.log("this.previewImage2list",this.previewImage2list)
      },
      //商品详情图
      handleCancel3 () {
        this.previewVisible3 = false;
        this.close()
      },
      handlePreview3(file) {
        this.previewImage3 = file.url || file.thumbUrl;
        this.previewVisible3 = true;
      },
      handleChange3({ fileList  }) {
        this.fileList3 = fileList;
        let result = [];
        for(let item of fileList){
          let obj = {
            name:item.name,
            imgUrl:item.response?item.response.message:''
          };
          result.push(obj)
        }
        this.uploadingNumber=result.length;
        let obj ={};
        for(var i=0;i<result.length;i++){
          obj[i] = result[i].imgUrl;
        }
        this.previewImage3list = JSON.stringify(obj).toString()
        console.log("this.previewImage3list",this.previewImage3list)
      },
      //商品规格图
      handleCancel4 () {
        this.previewVisible4 = false;
        this.close()
      },
      handlePreview4(file) {
        this.previewImage4 = file.url || file.thumbUrl;
        this.previewVisible4 = true;
      },
      handleChange44({ fileList  }) {
        console.log(fileList)
        this.fileList4 = fileList;
        let result = [];
        for(let item of fileList){
          let obj = {
            name:item.name,
            imgUrl:item.response?item.response.message:''
          };
          result.push(obj)
        }
        this.uploadingNumber=result.length;
        let obj ={};
        for(var i=0;i<result.length;i++){
          obj[i] = result[i].imgUrl;
        }
        this.previewImage4list = JSON.stringify(obj).toString()
        console.log("this.previewImage4list",this.previewImage4list)


      },
      prevStep(e) {
        //e.preventDefault();
        /**表单验证*/
        /* let yz = this.data2.every(item=>{
           return (item.costPrice && item.price && item.supplyPrice && item.vipPrice)
         }),
            yz2,
            yz3;
         if(this.data.length>0){
            yz2 = this.data.every(item=>{
             return (item.price && item.costPrice && item.supplyPrice && item.vipPrice)
           })
         }else{
           yz2 = false
         }
         if(this.CommoditySpecificationData.length>0){
           yz3 = this.CommoditySpecificationData.every(item=>{
             return (item.CommodityStyle && item.classification.every(item2=>{ return item2.value}))
           })
         }else{
           yz3 = false
         }
         console.log(yz,yz2,yz3)
       if(this.CommoditySpecificationData.length>0){
         if(!(yz && yz2 && yz3)){
           this.$message.warning('请不要输入空字符串');
           return false;
         }

       }else{
         if(!yz){
           this.$message.warning('请不要输入空字符串');
           return false;
         }
       }
 */

        this.form.validateFields((err, values) => {
          console.log('this.CommoditySpecificationData,商品规格数据' + JSON.stringify(this.CommoditySpecificationData));
          console.log('this.data,表单数据' + JSON.stringify(this.data))
          //values.GoodListSpecificationVOs1="ssss";
          if(values.delFlag=="" || values.delFlag==undefined){
            values.delFlag=0;//删除状态
          }
          if(values.frameStatus=="" || values.frameStatus==undefined){
            values.frameStatus=1;//上下架状态
          }
          if(values.status=="" || values.status==undefined){
            values.status=1;//上下架状态
          }
          if(values.goodStoreTypeId=="" || values.goodStoreTypeId==undefined){
            values.goodStoreTypeId=this.GoodTypeByid1;//分类id
          }
          if(this.model.id!="" || this.model.id!=undefined){
            values.id=this.model.id;
          }

          values.auditStatus = e;
          if(this.CommoditySpecificationData.length){
            values.specification = JSON.stringify(this.CommoditySpecificationData);
            values.isSpecification="1";
            console.log("this.data2",this.data2)
            console.log("this.data2[0].costPrice",this.data2[0].costPrice)
            values.goodListSpecificationVOs1=JSON.stringify(this.data)
            values.GoodListSpecificationVOs=JSON.stringify(this.data);
            values.costPrice=this.data2[0].costPrice;
            values.price=this.data2[0].price;
            values.goodNo=this.data2[0].goodNo;
            values.supplyPrice=this.data2[0].supplyPrice;
            values.vipPrice=this.data2[0].vipPrice;
            values.repertory=this.data2[0].repertory;
            values.marketPrice = this.marketPrice;
          }else {
            values.isSpecification="0";
            console.log("this.data2",this.data2)
            console.log("this.data2",this.data2[0].costPrice)
            values.GoodListSpecificationVOs1=JSON.stringify(this.data2);
            values.costPrice=this.data2[0].costPrice;
            values.price=this.data2[0].price;
            values.goodNo=this.data2[0].goodNo;
            values.supplyPrice=this.data2[0].supplyPrice;
            values.vipPrice=this.data2[0].vipPrice;
            values.repertory=this.data2[0].repertory;
            values.marketPrice = this.marketPrice;
          }
          if(Object.keys(this.previewImage1list).length>0){
            values.mainPicture=this.previewImage1list.toString();
          }else{
            values.mainPicture = null;
          }
          if(Object.keys(this.previewImage2list).length>0){
            console.log('这个对象不是空的')
            values.goodVideo=this.previewImage2list.toString();
          }else{
            values.goodVideo=null;
            console.log('这个对象是空的')
          }
          if(Object.keys(this.previewImage3list).length>0){
            values.detailsGoods=this.previewImage3list.toString();
          }else{
            values.detailsGoods=null;
          }
          console.log("values.goodVideo",values.goodVideo)

          console.log("values.detailsGoods",values.detailsGoods)
          if( values.commitmentCustomers!=undefined ||  values.commitmentCustomers!=""){
            values.commitmentCustomers = values.commitmentCustomers.toString();
          }


          let formData = Object.assign(this.model, values);

          if (!err) {
            console.log('Received values of form: ', values);
            this.addtest=values;

            httpAction(this.url.add,values,"post").then((res)=>{
              if(res.success){
                this.$message.success(res.message);
                this.$emit('ok');
                this.$router.push({ path: `/good/GoodStoreListList` ,query:{isrush:true}})
              }else{
                this.$message.warning(res.message);
              }
            }).finally(() => {
              // this.confirmLoading = false;
              this.close();
            })
          }
        });
      },
      updataGoodType(){
        this.$router.push({ path: `/good/modules/GoodStoreListadd` ,query:{}})
      },
      /*数据校验*/
      mainPictureUplode(rule, value, callback){
        if(Object.keys(this.previewImage1list).length>2){
          callback()
        }else{
          callback("请上传图片");
        }
      },


    }
  }
</script>

<style lang="less" scoped>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-table-pagination.ant-pagination{
    display: none;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }
  .anty-img-wrap{
    width: 100%;
    margin: 0 auto;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  .wrap{
    width: 100%;
    margin-left: 13%;
    margin-top: 2%;
    .title{
      width: 40%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }
    .content{
      margin-top: 1%;
      background: #eeeeee;
      width: 80%;
      padding: 20px;
      margin-left: 6%;
      .floor{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 10px;
        border-bottom: 1px solid gray;
        .ipt{
          width: 30%;
        }
        span{
          cursor: pointer;
        }
      }
      .add{

        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        width: 100%;
        .ipt-wrap{
          position: relative;
          margin-top: 2%;
          margin-right: 1.5%;
          i{
            position: absolute;
            top: -20%;
            right: -3%;
            z-index: 2;
          }
        }
        >input,button{
          margin-top: 2%;
          margin-right: 1.5%;
        }
        input{
          width:175px;
        }
      }
    }
  }
</style>