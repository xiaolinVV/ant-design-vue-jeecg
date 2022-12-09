<template>
  <a-card :bordered="false" :title="title">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="归属店铺">
          {{storeManage.storeName}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="名称">
          <a-input placeholder="名称" v-decorator="[ 'goodName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分类">
          <a-select v-decorator="[ 'goodCuisineTypeId', {}]" placeholder="请选择分类">
            <a-select-option :value="item.id" v-for="(item,index) in goodCuisineTypeList" :key="index">{{item.typeName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述">
          <a-textarea style="height: 150px" placeholder="描述" v-decorator="['describe', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="主图">
          <a-upload
            :action="getUplosdUrl"
            :headers="headers"
            accept="image/*"
            list-type="picture-card"
            :file-list="mainFileList"
            @preview="mainHandlePreview"
            @change="mainHandleChange"
          >
            <div v-if="mainFileList.length < 5">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
          <a-modal :visible="mainPreviewVisible" :footer="null" @cancel="mainPreviewhandleCancel">
            <img alt="example" style="width: 100%" :src="mainPreviewImage" />
          </a-modal>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="视频">
          <a-upload
            :action="getUplosdUrl"
            :headers="headers"
            accept="image/*"
            list-type="picture-card"
            :file-list="videoFileList"
            @preview="videoHandlePreview"
            @change="videoHandleChange"
          >
            <div v-if="videoFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
          <a-modal :visible="videoPreviewVisible" :footer="null" @cancel="videoPreviewhandleCancel">
            <img alt="example" style="width: 100%" :src="videoPreviewImage" />
          </a-modal>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="详情图">
          <a-upload
            :action="getUplosdUrl"
            :headers="headers"
            accept="image/*"
            list-type="picture-card"
            :file-list="detailsFileList"
            @preview="detailsHandlePreview"
            @change="detailsHandleChange"
          >
            <div v-if="detailsFileList.length < 5">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
          <a-modal :visible="detailsPreviewVisible" :footer="null" @cancel="detailsPreviewhandleCancel">
            <img alt="example" style="width: 100%" :src="detailsPreviewImage" />
          </a-modal>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="规格">
          <div>
          <div>
          <a-button type="primary"  @click="addSpecification">
            添加规格
          </a-button>
          <span style="margin-left: 20px">最多添加两个商品规格，第一个商品规格可添加规格图片</span>
          </div>
          <!--规格数据-->
          <div style="margin-top: 20px">
            <a-card style="background-color: #cccccc" v-for="(item,index) in specifications" :key="index">
              <div style="display: flex;justify-content: space-between;">
                <a-input style="width: 200px" v-model="item.name"></a-input>
                <button type="primary" :ghost="true" @click="delSpecification(index)">
                  删除规格
                </button>
              </div>
              <a-divider />
              <div style="display: flex ; flex-direction: row">
                <a-button type="primary"  @click="addSpe(item)">
                  添加
                </a-button>
                <div v-if="item.spes">
                  <a-input :key="index2" v-for="(item2,index2) in item.spes" v-model="item2.pName" style="width: 100px;margin-left: 20px;" @input="specificationsChange"></a-input>
                </div>
              </div>
            </a-card>
          </div>
          </div>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="价格与库存">
          <div>
            <a-card style="background-color: #cccccc" >
                <div v-if="specifications.length>0">
                  <span style="color: #cf1322;font-weight: bold">批量设置：在下方栏中选择内容进行批量填充</span>
                  <a-card style="margin-top: 20px;background-color: #c0ccda;" >
                    <div style="display: flex;justify-content: space-between;">
                    <div>
                    <a-select v-model="oneSpecification" placeholder="请选择" v-if="specifications.length>=1" style="width: 120px">
                      <a-select-option value="-1">全部</a-select-option>
                      <a-select-option :key="index" :value="item.pName" v-for="(item,index) in specifications[0].spes">{{item.pName}}</a-select-option>
                    </a-select>
                    <a-select v-model="twoSpecification" placeholder="请选择" v-if="specifications.length==2"  style="margin-left: 20px;width: 120px">
                      <a-select-option value="-1">全部</a-select-option>
                      <a-select-option :key="index" :value="item.pName" v-for="(item,index) in specifications[1].spes">{{item.pName}}</a-select-option>
                    </a-select>
                    <a-input placeholder="销售价" v-model="setting.salesPrice" style="margin-left: 20px;width: 100px"></a-input>
                    <a-input placeholder="成本价" v-model="setting.costPrice" style="margin-left: 20px;width: 100px"></a-input>
                    <a-input placeholder="库存" v-model="setting.repertory" style="margin-left: 20px;width: 100px"></a-input>
                    <a-input placeholder="sku" v-model="setting.sku" style="margin-left: 20px;width: 100px"></a-input>
                    </div>
                    <div>
                      <a-button type="primary" @click="submitInfo">确认</a-button>
                    </div>
                    </div>
                  </a-card>

                  <a-table :columns="specificationsColumns" :data-source="specificationsDecribes" :pagination="false" bordered>
                    <template slot="salesPrice" slot-scope="text, record,index">
                      <a-input v-model="specificationsDecribes[index].salesPrice" @input="salesPriceChange"></a-input>
                    </template>
                    <template slot="costPrice" slot-scope="text, record,index">
                      <a-input v-model="specificationsDecribes[index].costPrice" @input="costPriceChange"></a-input>
                    </template>
                    <template slot="repertory" slot-scope="text, record,index">
                      <a-input v-model="specificationsDecribes[index].repertory" @input="repertoryChange"></a-input>
                    </template>
                    <template slot="sku" slot-scope="text, record,index">
                      <a-input v-model="specificationsDecribes[index].sku"></a-input>
                    </template>
                    <template slot="imgUrl" slot-scope="text, record,index">
                      <a-upload
                        v-if="uploadImgs[index]"
                        :action="getUplosdUrl"
                        :headers="headers"
                        accept="image/*"
                        list-type="picture-card"
                        :file-list="uploadImgs[index].fileList"
                        @preview="handlePreview($event,index)"
                        @change="handleChange($event,index)"
                      >
                        <div v-if="uploadImgs[index].fileList.length < 1">
                          <a-icon type="plus" />
                          <div class="ant-upload-text">
                            Upload
                          </div>
                        </div>
                      </a-upload>
                      <a-modal :visible="uploadImgs[index].previewVisible" :footer="null" @cancel="previewhandleCancel(index)">
                        <img alt="example" style="width: 100%" :src="uploadImgs[index].previewImage" />
                      </a-modal>
                    </template>
                  </a-table>
              </div>


              <a-table style="margin-top: 10px" :columns="shopColumns" :data-source="shopInfo" :pagination="false" bordered>
                <template slot="salesPrice" slot-scope="text, record">
                  <a-input v-model="shopInfo[0].salesPrice" :disabled="specifications.length!=0"></a-input>
                </template>
                <template slot="costPrice" slot-scope="text, record">
                  <a-input v-model="shopInfo[0].costPrice" :disabled="specifications.length!=0"></a-input>
                </template>
                <template slot="repertory" slot-scope="text, record">
                  <a-input v-model="shopInfo[0].repertory" :disabled="specifications.length!=0"></a-input>
                </template>
                <template slot="sku" slot-scope="text, record">
                  <a-input v-model="shopInfo[0].sku" :disabled="specifications.length!=0"></a-input>
                </template>
                <template slot="serialNumber" slot-scope="text, record">
                  <a-input v-model="shopInfo[0].serialNumber"></a-input>
                </template>
              </a-table>

            </a-card>
          </div>
        </a-form-item>
        <a-divider />
        <div>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :colon="false"
            label=" ">
          <a-button type="primary" @click="handleOk">提交并上架</a-button>
          </a-form-item>
        </div>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import {getAction} from '@/api/manage';
  import Vue from 'vue'

  export default {
    name: "GoodCuisineListModal",
    components: { ATextarea },
    data () {
      return {
        title:"添加菜品",
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
        },
        url: {
          add: "/good/goodCuisineList/add",
          edit: "/good/goodCuisineList/edit",
          getGoodCuisineTypeList:'good/goodCuisineType/getGoodCuisineTypeList'
        },
        storeManage:{},
        //上传组件参数
        //主图
        mainFileList:[],
        mainPreviewVisible:false,
        mainPreviewImage:[],
        mainImages:[],
        //视频
        videoFileList:[],
        videoPreviewVisible:false,
        videoPreviewImage:[],
        videoImages:[],
        //详情图
        detailsFileList:[],
        detailsPreviewVisible:false,
        detailsPreviewImage:[],
        detailsImages:[],



        headers:{},
        //规格数据
        specifications:[],
        specificationsDecribes:[],
        uploadImgs:[],
        shopInfo:[
          {
            salesPrice:0,
            costPrice:0,
            repertory:0,
            sku:'',
            serialNumber:''
          }
        ],
        shopColumns:[
          {
            title: '销售价（元）',
            dataIndex: 'salesPrice',
            scopedSlots:{customRender:'salesPrice'}
          },
          {
            title: '成本价（元）',
            dataIndex: 'costPrice',
            scopedSlots:{customRender:'costPrice'}
          },
          {
            title: '总库存',
            dataIndex: 'repertory',
            scopedSlots:{customRender:'repertory'}
          },
          {
            title: 'SKU编码',
            dataIndex: 'sku',
          scopedSlots:{customRender:'sku'}
          },
          {
            title: '商品编码',
            dataIndex: 'serialNumber',
            scopedSlots:{customRender:'serialNumber'}
          },
        ],
        specificationsColumns:[
          {
            title: '规格',
            dataIndex: 'pName',
          },
          {
            title: '销售价（元）',
            dataIndex: 'salesPrice',
            scopedSlots:{customRender:'salesPrice'}
          },
          {
            title: '成本价（元）',
            dataIndex: 'costPrice',
            scopedSlots:{customRender:'costPrice'}
          },
          {
            title: '库存',
            dataIndex: 'repertory',
            scopedSlots:{customRender:'repertory'}
          },
          {
            title: 'SKU编码',
            dataIndex: 'sku',
            scopedSlots:{customRender:'sku'}
          },
          {
            title: '规格图',
            dataIndex: 'imgUrl',
            scopedSlots:{customRender:'imgUrl'}
          },
        ],
        oneSpecification:'-1',
        twoSpecification:'-1',
        setting:{
          salesPrice:'',
          costPrice:'',
          repertory:'',
          sku:''
        },
        goodCuisineTypeList:[],
        goodCuisineList:''
      }
    },
    created () {
      if(this.$route.query.storeManage){
        this.storeManage=this.$route.query.storeManage;
        console.log('店铺信息',this.storeManage);
      }
      if(this.$route.query.goodCuisineList){
        this.goodCuisineList=this.$route.query.goodCuisineList;
        console.log('菜品信息',this.goodCuisineList);
        this.storeManage.id=this.goodCuisineList.storeManageId;
        this.storeManage.storeName=this.goodCuisineList.storeName;
        this.edit(this.goodCuisineList);
        //主图
        this.mainFileList=[];
        this.mainImages=JSON.parse(this.goodCuisineList.mainPicture);
        let mainPictureIndex=0;
        for(let m of this.mainImages){
          this.mainFileList.push({
            url:this.getImgUrl(m),
            uid: mainPictureIndex,
            name: 'image.png',
            status: 'done',
          });
          mainPictureIndex++;
        }
        console.log('mainFileList:',this.mainFileList);
        //视频
        this.videoFileList=[];
        this.videoImages=JSON.parse(this.goodCuisineList.video);
        let videoPictureIndex=0;
        for(let m of this.videoImages){
          this.videoFileList.push({
            url:this.getImgUrl(m),
            uid: videoPictureIndex,
            name: 'image.png',
            status: 'done',
          });
          videoPictureIndex++;
        }
        console.log('videoFileList:',this.videoFileList);
        //详情图
        this.detailsFileList=[];
        this.detailsImages=JSON.parse(this.goodCuisineList.detailsFigure);
        let detailsPictureIndex=0;
        for(let m of this.detailsImages){
          this.detailsFileList.push({
            url:this.getImgUrl(m),
            uid: detailsPictureIndex,
            name: 'image.png',
            status: 'done',
          });
          detailsPictureIndex++;
          console.log('detailsFileList:',this.detailsFileList);
          //规格信息
          this.specifications=JSON.parse(this.goodCuisineList.specifications);
          this.specificationsDecribes=JSON.parse(this.goodCuisineList.specificationsDecribes);
          this.shopInfo=JSON.parse(this.goodCuisineList.shopInfo);
          //规格图
          this.uploadImgs=[];
          for(let index of this.specificationsDecribes){
            this.uploadImgs.push({
              fileList:[
                {
                  url:this.getImgUrl(index.imgUrl),
                  uid: 1,
                  name: 'image.png',
                  status: 'done',
                }
              ],
              previewVisible:false,
              previewImage:[]
            })
          }
        }
        console.log('detailsFileList:',this.detailsFileList);
      }
      console.log('修正后店铺信息',this.storeManage);
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token};
      this.getGoodCuisineTypeList();
    },

    methods: {
      getGoodCuisineTypeList(){
        console.log('运行获取菜品类型')
        getAction(this.url.getGoodCuisineTypeList, {storeManageId: this.storeManage.id}).then((res) => {

          if (res.success) {
            console.log(res);
            this.goodCuisineTypeList=res.result;
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      submitInfo(){
        console.log(this.oneSpecification,'=======',this.twoSpecification);
        for (let item of this.specificationsDecribes){
          let frontString=''
          let afterString='';
          if(this.specifications.length==1){
            frontString=item.pName;
            if(this.oneSpecification==-1){
              this.setShuju(item);
            }
            if(frontString==this.oneSpecification){
              this.setShuju(item);
            }
          }
          if(this.specifications.length==2) {
            frontString=item.pName.substr(0,item.pName.indexOf(','));
            afterString= item.pName.substr(item.pName.indexOf(',')+1, item.pName.length);
            if(this.oneSpecification==-1&&this.twoSpecification!=-1){
              if(afterString==this.twoSpecification) {
                this.setShuju(item);
              }
            }
            if(this.oneSpecification!=-1&&this.twoSpecification==-1){
              if(frontString==this.oneSpecification) {
                this.setShuju(item);
              }
            }
            if(this.oneSpecification!=-1&&this.twoSpecification!=-1){
              if(frontString==this.oneSpecification&&afterString==this.twoSpecification) {
                this.setShuju(item);
              }
            }
            if(this.oneSpecification==-1&&this.twoSpecification==-1){
                this.setShuju(item);
            }
          }
          console.log(frontString,'------',afterString);
        }
        this.salesPriceChange()
        this.repertoryChange();
        this.costPriceChange();
      },
      setShuju(item){
        if(this.setting.salesPrice){
          item.salesPrice=this.setting.salesPrice;
        }
        if(this.setting.costPrice){
          item.costPrice=this.setting.costPrice;
        }
        if(this.setting.repertory){
          item.repertory=this.setting.repertory;
        }
        if(this.setting.sku){
          item.sku=this.setting.sku;
        }
      },
      //商品数据统计
      salesPriceChange(){
        let minSalesPrice=parseFloat(this.specificationsDecribes[0].salesPrice);
        let maxSalesPrice=parseFloat(this.specificationsDecribes[0].salesPrice);
        for(let sp of this.specificationsDecribes){
          if(minSalesPrice>parseFloat(sp.salesPrice)) {
            minSalesPrice=parseFloat(sp.salesPrice);
          }
          if(maxSalesPrice<parseFloat(sp.salesPrice)){
            maxSalesPrice=parseFloat(sp.salesPrice);
          }
        }
        this.shopInfo[0].salesPrice=minSalesPrice.toString()+'-'+maxSalesPrice.toString();
      },
      costPriceChange(){
        let minPrice=parseFloat(this.specificationsDecribes[0].costPrice);
        let maxPrice=parseFloat(this.specificationsDecribes[0].costPrice);
        for(let sp of this.specificationsDecribes){
          if(minPrice>parseFloat(sp.costPrice)) {
            minPrice=parseFloat(sp.costPrice);
          }
          if(maxPrice<parseFloat(sp.costPrice)){
            maxPrice=parseFloat(sp.costPrice);
          }
        }
        this.shopInfo[0].costPrice=minPrice.toString()+'-'+maxPrice.toString();
      },
      repertoryChange(){
        let totalRepertory=0;
        for(let sp of this.specificationsDecribes){
          totalRepertory=totalRepertory+parseInt(sp.repertory);
        }
        this.shopInfo[0].repertory=totalRepertory;
      },
      //添加规格
      specificationsChange(){
          console.log(this.specifications);
          if(this.specifications) {
            console.log(this.specifications);
            this.specificationsDecribes = [];
            this.uploadImgs=[];
            if (this.specifications.length == 1) {
              this.specifications[0].spes.forEach(sp => {
                this.specificationsDecribes.push({
                  pName: sp.pName,
                  salesPrice:0,
                  costPrice:0,
                  repertory:0,
                  sku:'',
                  imgUrl:''
                })
              });
            }
            if (this.specifications.length == 2) {
              this.specifications[0].spes.forEach(sp => {
                this.specifications[1].spes.forEach(sp2 => {
                  this.specificationsDecribes.push({
                    pName: sp.pName + ',' + sp2.pName,
                    salesPrice:0,
                    costPrice:0,
                    repertory:0,
                    sku:'',
                    imgUrl:''
                  })
                });
              });
            }
            for(let index of this.specificationsDecribes){
              this.uploadImgs.push({
                fileList:[],
                previewVisible:false,
                previewImage:[]
              })
            }
            this.oneSpecification='-1';
            this.twoSpecification='-1';
            console.log('规格数据',this.specificationsDecribes)
            console.log('规格图',this.uploadImgs);
          }
      },
      addSpe(item){
        item.spes.push({
          pName:'',
          salesPrice:0,
          costPrice:0,
          repertory:0,
          sku:'',
          imgUrl:''
        });
        this.oneSpecification='-1';
        this.twoSpecification='-1';
        console.log(this.specifications);
      },
      addSpecification(){
        if(this.specifications.length>=2){
          this.$message.warning('最多允许添加两个规格');
          return;
        }
        this.specifications.push({
          spes:[],
          name:''
        });
        console.log(this.specifications);
      },
      delSpecification(e){
        console.log(e);
        this.$delete(this.specifications,e);
        this.specificationsChange();
      },
      //上传组件开始
      //主图
      mainPreviewhandleCancel() {
        this.mainPreviewVisible = false;
      },
      async mainHandlePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await this.getBase64(file.originFileObj);
        }
        this.mainPreviewImage = file.url || file.preview;
        this.mainPreviewVisible = true;
      },
      mainHandleChange({ fileList }) {
        this.mainFileList = fileList;

//根据图片变化获取图片地址信息

        let imgUrls=[];
        this.mainFileList.forEach(fl=>{
          console.log(fl,"上传文件返回的报文值！！！");
          if(fl.response) {
            imgUrls.push(fl.response.message);
          }
          if(fl.url){
            imgUrls.push(fl.url.sub(fl.url.sub.indexOf(this.getImgUrl()+2),fl.url.length));
          }
        });
        this.mainImages=imgUrls;
        console.log(this.mainImages,"图片地址结果")
      },
      //视频
      videoPreviewhandleCancel() {
        this.videoPreviewVisible = false;
      },
      async videoHandlePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await this.getBase64(file.originFileObj);
        }
        this.videoPreviewImage = file.url || file.preview;
        this.videoPreviewVisible = true;
      },
      videoHandleChange({ fileList }) {
        this.videoFileList = fileList;

//根据图片变化获取图片地址信息

        let imgUrls=[];
        this.videoFileList.forEach(fl=>{
          console.log(fl,"上传文件返回的报文值！！！");
          if(fl.response) {
            imgUrls.push(fl.response.message);
          }
          if(fl.url){
            imgUrls.push(fl.url.sub(fl.url.sub.indexOf(this.getImgUrl()+2),fl.url.length));
          }
        });
        this.videoImages=imgUrls;
        console.log(this.videoImages,"图片地址结果")
      },
      //详情图
      detailsPreviewhandleCancel() {
        this.detailsPreviewVisible = false;
      },
      async detailsHandlePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await this.getBase64(file.originFileObj);
        }
        this.detailsPreviewImage = file.url || file.preview;
        this.detailsPreviewVisible = true;
      },
      detailsHandleChange({ fileList }) {
        this.detailsFileList = fileList;

//根据图片变化获取图片地址信息

        let imgUrls=[];
        this.detailsFileList.forEach(fl=>{
          console.log(fl,"上传文件返回的报文值！！！");
          if(fl.response) {
            imgUrls.push(fl.response.message);
          }
          if(fl.url){
            imgUrls.push(fl.url.sub(fl.url.sub.indexOf(this.getImgUrl()+2),fl.url.length));
          }
        });
        this.detailsImages=imgUrls;
        console.log(this.detailsImages,"图片地址结果")
      },


      //规格图
      previewhandleCancel(index) {
        this.uploadImgs[index].previewVisible = false;
      },
      async handlePreview(file,index) {
        if (!file.url && !file.preview) {
          file.preview = await this.getBase64(file.originFileObj);
        }
        this.uploadImgs[index].previewImage = file.url || file.preview;
        this.uploadImgs[index].previewVisible = true;
      },
      handleChange({fileList},index) {
        this.uploadImgs[index].fileList = fileList;

//根据图片变化获取图片地址信息

        let imgUrls=[];
        this.uploadImgs[index].fileList.forEach(fl=>{
          console.log(fl,"上传文件返回的报文值！！！");
          if(fl.response) {
            imgUrls.push(fl.response.message);
          }
          if(fl.url){
            imgUrls.push(fl.url.sub(fl.url.sub.indexOf(this.getImgUrl()+2),fl.url.length));
          }
        });
        if(imgUrls.length>0) {
          this.specificationsDecribes[index].imgUrl = imgUrls[0];
        }else{
          this.specificationsDecribes[index].imgUrl='';
        }
        console.log(this.specificationsDecribes[index].imgUrl,"图片地址结果")
      },

      getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      },
      getImgUrl(url){
        return window._CONFIG['imgDomainURL']+'/'+url;
      },
      getUplosdUrl(){
        return window._CONFIG['domianURL']+"/sys/common/upload";
      },

      //上传组件结束


      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.model.describe=this.goodCuisineList.goodDescribe;
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'typeName','goodCuisineTypeId','goodName','describe'))
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
            formData.mainImages=JSON.stringify(this.mainImages);
            formData.videoImages=JSON.stringify(this.videoImages);
            formData.detailsImages=JSON.stringify(this.detailsImages);
            formData.specifications=JSON.stringify(this.specifications);

            formData.specificationsDecribes=JSON.stringify(this.specificationsDecribes);
            formData.storeManageId=this.storeManage.id;


            formData.shopInfo=JSON.stringify(this.shopInfo);


            console.log('规格图',this.uploadImgs);



            console.log(formData)



            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                localStorage.removeItem('GoodCuisineListList')
                this.$router.push({ path: '/good/GoodCuisineListList'})
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