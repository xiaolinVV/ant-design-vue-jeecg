<template>
  <a-row :gutter="10" >
    <a-col :span="4">
      <a-card :bordered="false" style="min-height: 800px">
        <store-tree @ok="getSelectStore"></store-tree>
      </a-card>
    </a-col>
    <a-col :span="8">



      <a-card :bordered="false" style="min-width: 1400px;min-height: 800px">
        <div class="title">
          礼包设置
        </div>
        <div v-if="!storeInfo.key">
          <a-empty description="请先选择商户"/>
        </div>
        <div v-else>
        <a-form :form="form" style="margin-top: 20px">
          <a-card title="基本信息">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="商户名称">
            {{storeInfo.title}}
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="售价">
            <a-input-number :min="0" style="width: 80%" v-decorator="[ 'price', {}]" />元
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="兑换券">
            <a-button @click="selectCoinCertiClick"> 选择兑换券 </a-button>
            <a-alert
              :closable="false"
              message="重要提示：未选择即为不送，兑换券所对应的商品若库存不足，也为不送。"
            />
            <a-table
              ref="table"
              size="middle"
              bordered
              :scroll="{x:1500}"
              rowKey="id"
              :columns="coinCertiColumns"
              :dataSource="coinCertiDataSource"
              :pagination="false">
              <template slot="isContinuous" slot-scope="text,record,index">
                <a-select v-model="coinCertiDataSource[index].isContinuous">
                  <a-select-option value="0">相同有效期</a-select-option>
                  <a-select-option value="1">连续有效期</a-select-option>
                </a-select>
              </template>
              <template slot="quantity" slot-scope="text,record,index">
                <a-input-number :min="1" v-model="coinCertiDataSource[index].quantity"></a-input-number>
              </template>
        <span slot="action" slot-scope="text, record,index">
           <a-popconfirm title="确定删除吗?" @confirm="() => coinCertiHandleDelete(index)">
                  <a>删除</a>
           </a-popconfirm>
        </span>

            </a-table>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="优惠券">
            <a-button @click="selectDiscountClick"> 选择优惠券 </a-button>
            <a-alert
              :closable="false"
              message="重要提示：未选择即为不送"
            />
            <a-table
              ref="table"
              size="middle"
              bordered
              :scroll="{x:1500}"
              rowKey="id"
              :columns="discountColumns"
              :dataSource="discountDataSource"
              :pagination="false">
              <template slot="isContinuous" slot-scope="text,record,index">
                <a-select v-model="discountDataSource[index].isContinuous">
                  <a-select-option value="0">相同有效期</a-select-option>
                  <a-select-option value="1">连续有效期</a-select-option>
                </a-select>
              </template>
        <template slot="quantity" slot-scope="text,record,index">
          <a-input-number :min="1" v-model="discountDataSource[index].quantity"></a-input-number>
        </template>
        <span slot="action" slot-scope="text, record,index">
          <a-popconfirm title="确定删除吗?" @confirm="() => discountHandleDelete(index)">
                  <a>删除</a>
                </a-popconfirm>
        </span>

            </a-table>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="礼品卡">
            <a-button @click="selectGiftCardClick"> 选择礼品卡 </a-button>
            <a-alert
              :closable="false"
              message="重要提示：未选择即为不送"
            />
            <a-table
              ref="table"
              size="middle"
              bordered
              :scroll="{x:1500}"
              rowKey="id"
              :columns="giftColumns"
              :dataSource="giftDataSource"
              :pagination="false">
              <template slot="quantity" slot-scope="text,record,index">
                <a-input-number :min="1" v-model="giftDataSource[index].quantity"></a-input-number>
              </template>
              <template slot="timeWay" slot-scope="text, record">
                {{ handleTimeWay(record) }}
              </template>
        <span slot="action" slot-scope="text, record,index">
           <a-popconfirm title="确定删除吗?" @confirm="() => giftDataHandleDelete(index)">
                  <a>删除</a>
                </a-popconfirm>
        </span>

            </a-table>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="封面图">
            <a-upload
              :action="getUplosdUrl"
              :headers="headers"
              accept="image/*"
              list-type="picture-card"
              :file-list="surfacePlotFileList"
              @preview="surfacePlotHandlePreview"
              @change="surfacePlotHandleChange"
            >
              <div v-if="surfacePlotFileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  Upload
                </div>
              </div>
            </a-upload>
            <span>尺寸800*800 支持jpg、jpeg、png格式，大小不超过2M</span>
            <a-modal :visible="surfacePlotPreviewVisible" :footer="null" @cancel="surfacePlotPreviewhandleCancel">
              <img alt="example" style="width: 100%" :src="surfacePlotPreviewImage" />
            </a-modal>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="分享图">
            <a-upload
              :action="getUplosdUrl"
              :headers="headers"
              accept="image/*"
              list-type="picture-card"
              :file-list="shareFigureFileList"
              @preview="shareFigureHandlePreview"
              @change="shareFigureHandleChange"
            >
              <div v-if="shareFigureFileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  Upload
                </div>
              </div>
            </a-upload>
            <span>尺寸800*640 ，支持jpg、jpeg、png格式，大小不超过2M</span>
            <a-modal :visible="shareFigurePreviewVisible" :footer="null" @cancel="shareFigurePreviewhandleCancel">
              <img alt="example" style="width: 100%" :src="shareFigurePreviewImage" />
            </a-modal>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="海报图">
            <a-upload
              :action="getUplosdUrl"
              :headers="headers"
              accept="image/*"
              list-type="picture-card"
              :file-list="postersFigureFileList"
              @preview="postersFigureHandlePreview"
              @change="postersFigureHandleChange"
            >
              <div v-if="postersFigureFileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  Upload
                </div>
              </div>
            </a-upload>
            <a-modal :visible="postersFigurePreviewVisible" :footer="null" @cancel="postersFigurePreviewhandleCancel">
              <img alt="example" style="width: 100%" :src="postersFigurePreviewImage" />
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
              :multiple="true"
              list-type="picture-card"
              :file-list="detailsFigureFileList"
              @preview="detailsFigureHandlePreview"
              @change="detailsFigureHandleChange"
            >
              <div v-if="detailsFigureFileList.length < 50">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  Upload
                </div>
              </div>
            </a-upload>
            <span>尺寸800*不限高度，支持jpg、jpeg、png格式，大小不超过2M</span>
            <a-modal :visible="detailsFigurePreviewVisible" :footer="null" @cancel="detailsFigurePreviewhandleCancel">
              <img alt="example" style="width: 100%" :src="detailsFigurePreviewImage" />
            </a-modal>
          </a-form-item>
          </a-card>
          <a-card title="奖励设置" style="margin-top: 30px;">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="称号奖励">
          <select-designation-award v-if="storeInfo&&storeInfo.key" ref="selectDesignationAward" :storeInfo="storeInfo" @change="selectDesignationAwardChange"></select-designation-award>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="团长奖励">
            <a-input-number style="width: 80%" v-decorator="[ 'headReward', {}]" />元
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="分红资金">
            <a-input-number style="width: 80%" v-decorator="[ 'usingBonuses', {}]" />元
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="本店分红">
            <a-input-number style="width: 80%" v-decorator="[ 'shareBonus', {}]" />%
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="推荐奖励">
            <a-input-number style="width: 80%" v-decorator="[ 'referralBonuses', {}]" />%
          </a-form-item>
          </a-card>
          <a-card title="状态设置" style="margin-top: 30px;">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="状态">
            <a-radio-group v-decorator="['status', {}]">
              <a-radio value="0">
                停用
              </a-radio>
              <a-radio value="1">
                启用
              </a-radio>
            </a-radio-group>
          </a-form-item>
          </a-card>
          <a-button type="primary" style="width: 100%;margin-top: 30px;" @click="submit">提交</a-button>
        </a-form>
        </div>
    <!-- table区域-end -->

      </a-card>
    </a-col>

    <!--选择兑换券-->
    <select-coin-certi ref="selectCoinCerti" @ok="selectCoinCertiCallBack"></select-coin-certi>
    <!--选择优惠券-->
    <select-discount ref="selectDiscount" @ok="selectDiscountCallBack"></select-discount>
    <!--礼品卡-->
    <select-gift-card ref="selectGiftCard" @ok="selectGiftCardCallBack"></select-gift-card>

  </a-row>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {getAction,httpAction} from '@/api/manage';
  import SelectCoinCerti from '../../common/SelectCoinCerti/SelectCoinCerti'
  import SelectDiscount from'../../common/SelectDiscount/SelectDiscount'
  import SelectGiftCard from'../../common/SelectGiftCard/SelectGiftCard'
  import SelectDesignationAward from'../../common/SelectDesignation/SelectDesignationAward'
  import StoreTree from'../../../common/StoreTree/StoreTree'
  import Vue from 'vue'
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import pick from 'lodash.pick'

  export default {
    name: "MarketingStoreGiftbagListList",
    mixins:[JeecgListMixin],
    components: {
      SelectCoinCerti,
      SelectDiscount,
      SelectGiftCard,
      SelectDesignationAward,
      StoreTree
    },
    data () {
      return {
        description: '礼包团-礼包设置管理页面',
        storeList:[],
        storeListFilt:[],
        searchValue:'',
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 2 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 22 },
        },
        form: this.$form.createForm(this),
		url: {
          importExcelUrl: "marketing.store.giftbag/marketingStoreGiftbagList/importExcel",
      getStoreGiftbagByStoreManageId:"marketing.store.giftbag/marketingStoreGiftbagList/getStoreGiftbagByStoreManageId",
      addOrEdit:"/marketing.store.giftbag/marketingStoreGiftbagList/addOrEdit"
       },
        storeInfo:{},

        //优惠券
        discountDataSource:[],
        discountColumns: [
          {
            title: '优惠券id',
            align:"center",
            dataIndex: 'id'
          },
          {
            title: '优惠券名称',
            align:"center",
            dataIndex: 'name'
          },
          {
            title: '使用门槛',
            align:"center",
            dataIndex: 'usingThreshold'
          },
          {
            title: '优惠内容',
            align:"center",
            dataIndex: 'preferentialContent'
          },
          {
            title: '用券时间',
            align:"center",
            dataIndex: 'usrTime'
          },
          {
            title: '适用商品',
            align:"center",
            dataIndex: 'applyGood'
          },
          {
            title: '券剩余发行量',
            align:"center",
            dataIndex: 'discountSurplus'
          },
          {
            title: '购买限制',
            align:"center",
            dataIndex: 'memberTypeName'
          },
          {
            title: '发行人',
            align:"center",
            dataIndex: 'issuer'
          },
          {
            title: '发放数量',
            align:"center",
            dataIndex: 'quantity',
            scopedSlots:{customRender:'quantity'}
          },
          {
            title: '有效期控制',
            align:"center",
            dataIndex: 'isContinuous',
            scopedSlots:{customRender:'isContinuous'}
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
            fixed: 'right',
            width:150,
          }
        ],

        //兑换券

        coinCertiDataSource:[],
        coinCertiColumns:[
          {
            title: '兑换券id',
            align:"center",
            dataIndex: 'id'
          },
          {
            title: '兑换券名称',
            align:"center",
            dataIndex: 'name'
          },
          {
            title: '用券时间',
            align:"center",
            dataIndex: 'usrTime'
          },
          {
            title: '兑换商品',
            align:"center",
            dataIndex: 'goodQuantity'
          },
          {
            title: '兑换方式',
            align:"center",
            dataIndex: 'certificateType'
          },
          {
            title: '使用人限制',
            align:"center",
            dataIndex: 'memberTypeName'
          },
          {
            title: '券剩余发行量',
            align:"center",
            dataIndex: 'discountSurplus'
          },
          {
            title: '核销门店',
            align:"center",
            dataIndex: 'storeQuantity'
          },
          {
            title: '核销奖励',
            align:"center",
            dataIndex: 'theReward'
          },
          {
            title: '发放数量',
            align:"center",
            dataIndex: 'quantity',
            scopedSlots:{customRender:'quantity'}
          },
          {
            title: '有效期控制',
            align:"center",
            dataIndex: 'isContinuous',
            scopedSlots:{customRender:'isContinuous'}
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed: 'right',
            width:150,
            scopedSlots: { customRender: 'action' },
          }
        ],
        //礼品卡

        giftDataSource:[],
        giftColumns:[
          {
            title: '礼品卡编号',
            align:"center",
            dataIndex: 'serialNumber'
          },
          {
            title: '发行店铺',
            align:"center",
            dataIndex: 'storeName'
          },
          {
            title: '卡名称',
            align:"center",
            dataIndex: 'carName'
          },
          {
            title: '面额',
            align:"center",
            dataIndex: 'denomination'
          },
          {
            title: '可选商品',
            align:"center",
            dataIndex: 'goodCount'
          },
          {
            title: '有效期',
            align:"center",
            dataIndex: 'timeWay',
            scopedSlots:{customRender:'timeWay'}
          },
          {
            title: '发放数量',
            align:"center",
            dataIndex: 'quantity',
            scopedSlots:{customRender:'quantity'}
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed: 'right',
            width:150,
            scopedSlots: { customRender: 'action' },
          }
        ],

        //称号
        titleDataSource:[],

        headers:{},

        //详情图
        detailsFigureFileList:[],
        detailsFigurePreviewVisible:false,
        detailsFigurePreviewImage:[],
        detailsFigureImages:[],


        //海报图
        postersFigureFileList:[],
        postersFigurePreviewVisible:false,
        postersFigurePreviewImage:[],
        postersFigureImages:[],


      //封面图
        surfacePlotFileList:[],
        surfacePlotPreviewVisible:false,
        surfacePlotPreviewImage:[],
        surfacePlotImages:[],

        //分享图
        shareFigureFileList:[],
        shareFigurePreviewVisible:false,
        shareFigurePreviewImage:[],
        shareFigureImages:[],
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    created(){
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token};
    },
    methods: {
      selectDesignationAwardChange(e){
        console.log(e);
        this.titleDataSource=e;
      },
      //提交数据
      submit(){
        let that=this;
        this.form.validateFields((err, values) => {
          if (!err) {
            let formData = Object.assign(this.model, values);
            //时间格式化
            formData.coinCertificate=JSON.stringify(this.coinCertiDataSource);
            formData.discountCoupon=JSON.stringify(this.discountDataSource);
            formData.giftCard=JSON.stringify(this.giftDataSource);
            formData.titleReward=JSON.stringify(this.titleDataSource);

            formData.surfacePlot=JSON.stringify(this.surfacePlotImages);
            formData.shareFigure=JSON.stringify(this.shareFigureImages);
            formData.postersFigure=JSON.stringify(this.postersFigureImages);
            formData.detailsFigure=JSON.stringify(this.detailsFigureImages);

            formData.storeManageId=this.storeInfo.key;

            console.log(formData)
            httpAction(this.url.addOrEdit,formData,'post').then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                this.getStoreGiftbagByStoreManageId();
              }else{
                that.$message.warning(res.message);
              }
            })
          }});
      },


      //详情图
      detailsFigurePreviewhandleCancel() {
        this.detailsFigurePreviewVisible = false;
      },
      async detailsFigureHandlePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await this.getBase64(file.originFileObj);
        }
        this.detailsFigurePreviewImage = file.url || file.preview;
        this.detailsFigurePreviewVisible = true;
      },
      detailsFigureHandleChange({ fileList }) {
        this.detailsFigureFileList = fileList;

//根据图片变化获取图片地址信息

        let imgUrls=[];
        this.detailsFigureFileList.forEach(fl=>{
          console.log(fl,"上传文件返回的报文值！！！");
          if(fl.response) {
            imgUrls.push(fl.response.message);
          }
          if(fl.url){
            imgUrls.push(fl.url.sub(fl.url.sub.indexOf(this.getImgUrl()+2),fl.url.length));
          }
        });
        this.detailsFigureImages=imgUrls;
        console.log(this.detailsFigureImages,"图片地址结果")
      },



      //海报图
      postersFigurePreviewhandleCancel() {
        this.postersFigurePreviewVisible = false;
      },
      async postersFigureHandlePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await this.getBase64(file.originFileObj);
        }
        this.postersFigurePreviewImage = file.url || file.preview;
        this.postersFigurePreviewVisible = true;
      },
      postersFigureHandleChange({ fileList }) {
        this.postersFigureFileList = fileList;

//根据图片变化获取图片地址信息

        let imgUrls=[];
        this.postersFigureFileList.forEach(fl=>{
          console.log(fl,"上传文件返回的报文值！！！");
          if(fl.response) {
            imgUrls.push(fl.response.message);
          }
          if(fl.url){
            imgUrls.push(fl.url.sub(fl.url.sub.indexOf(this.getImgUrl()+2),fl.url.length));
          }
        });
        this.postersFigureImages=imgUrls;
        console.log(this.postersFigureImages,"图片地址结果")
      },



      //分享图
      shareFigurePreviewhandleCancel() {
        this.shareFigurePreviewVisible = false;
      },
      async shareFigureHandlePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await this.getBase64(file.originFileObj);
        }
        this.shareFigurePreviewImage = file.url || file.preview;
        this.shareFigurePreviewVisible = true;
      },
      shareFigureHandleChange({ fileList }) {
        this.shareFigureFileList = fileList;

//根据图片变化获取图片地址信息

        let imgUrls=[];
        this.shareFigureFileList.forEach(fl=>{
          console.log(fl,"上传文件返回的报文值！！！");
          if(fl.response) {
            imgUrls.push(fl.response.message);
          }
          if(fl.url){
            imgUrls.push(fl.url.sub(fl.url.sub.indexOf(this.getImgUrl()+2),fl.url.length));
          }
        });
        this.shareFigureImages=imgUrls;
        console.log(this.shareFigureImages,"图片地址结果")
      },



      //封面图
      surfacePlotPreviewhandleCancel() {
        this.surfacePlotPreviewVisible = false;
      },
      async surfacePlotHandlePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await this.getBase64(file.originFileObj);
        }
        this.surfacePlotPreviewImage = file.url || file.preview;
        this.surfacePlotPreviewVisible = true;
      },
      surfacePlotHandleChange({ fileList }) {
        this.surfacePlotFileList = fileList;

//根据图片变化获取图片地址信息

        let imgUrls=[];
        this.surfacePlotFileList.forEach(fl=>{
          console.log(fl,"上传文件返回的报文值！！！");
          if(fl.response) {
            imgUrls.push(fl.response.message);
          }
          if(fl.url){
            imgUrls.push(fl.url.sub(fl.url.sub.indexOf(this.getImgUrl()+2),fl.url.length));
          }
        });
        this.surfacePlotImages=imgUrls;
        console.log(this.surfacePlotImages,"图片地址结果")
      },





      getImgUrl(url){
        return window._CONFIG['imgDomainURL']+'/'+url;
      },
      getUplosdUrl(){
        return window._CONFIG['domianURL']+"/sys/common/upload";
      },

      getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      },

      //礼品卡
      handleTimeWay(record) {
        let timeWay = record.timeWay
        let result = ''
        if (timeWay == 1 || timeWay == 2) {
          if (timeWay == 1) {
            result += '当日起'
          } else {
            result += '次日起'
          }
          result += record.timeDigital
          if (record.timeUnit == 1) {
            result += '周'
          } else if (record.timeUnit == 2) {
            result += '月'
          } else {
            result += '天'
          }
          result += '内可用'
        } else {
          result = `${record.startTime}~${record.endTime}`
        }
        return result
      },
      selectGiftCardClick(){
        this.$refs.selectGiftCard.showModal(this.storeInfo);
      },
      selectGiftCardCallBack(giftCard){
        for (let g of giftCard) {
          let gg=this.giftDataSource.find(item => item.id ===g.id);
          if(!gg){
            g.quantity=1;
            this.giftDataSource.push(g);
          }
        }
      },
      giftDataHandleDelete(index){
        this.$delete(this.giftDataSource,index);
      },

      //优惠券
      discountHandleDelete(index){
        this.$delete(this.discountDataSource,index);
      },
      selectDiscountClick(){
        this.$refs.selectDiscount.showModal(this.storeInfo);
      },
      selectDiscountCallBack(discount){
        for (let d of discount) {
          let dd=this.discountDataSource.find(item => item.id ===d.id);
          if(!dd){
            d.quantity=1;
            d.isContinuous='0';
            this.discountDataSource.push(d);
          }
        }
      },
      //兑换券
      coinCertiHandleDelete(index){
        this.$delete(this.coinCertiDataSource,index);
      },
      selectCoinCertiCallBack(coinCerti){
        for (let c of coinCerti) {
          let cc=this.coinCertiDataSource.find(item => item.id ===c.id);
          if(!cc){
            c.quantity=1;
            c.isContinuous='0';
            this.coinCertiDataSource.push(c);
          }
        }
      },
      selectCoinCertiClick(){
        this.$refs.selectCoinCerti.showModal(this.storeInfo);
      },
      getStoreGiftbagByStoreManageId(){
        getAction(this.url.getStoreGiftbagByStoreManageId, {storeManageId: this.storeInfo.key}).then((res) => {

          if (res.success) {
            this.model=res.result;
            this.form.resetFields();
            if(this.model){
              this.titleDataSource=JSON.parse(this.model.titleReward);
              this.$refs.selectDesignationAward.init(this.titleDataSource);


              this.giftDataSource=JSON.parse(this.model.giftCard);
              this.discountDataSource=JSON.parse(this.model.discountCoupon);
              this.coinCertiDataSource=JSON.parse(this.model.coinCertificate);



              //详情图
              this.detailsFigureFileList=[];
              if(this.model.detailsFigure) {
                this.detailsFigureImages = JSON.parse(this.model.detailsFigure);
                let detailsFigureIndex = 0;
                for (let m of this.detailsFigureImages) {
                  this.detailsFigureFileList.push({
                    url: this.getImgUrl(m),
                    uid: detailsFigureIndex,
                    name: 'image.png',
                    status: 'done',
                  });
                  detailsFigureIndex++;
                }
                console.log('detailsFigureFileList:', this.detailsFigureFileList);
              }

              //海报图
              this.postersFigureFileList=[];
              if(this.model.postersFigure) {
                this.postersFigureImages = JSON.parse(this.model.postersFigure);
                let postersFigureIndex = 0;
                for (let m of this.postersFigureImages) {
                  this.postersFigureFileList.push({
                    url: this.getImgUrl(m),
                    uid: postersFigureIndex,
                    name: 'image.png',
                    status: 'done',
                  });
                  postersFigureIndex++;
                }
                console.log('postersFigureFileList:', this.postersFigureFileList);
              }

              //封面图
              this.surfacePlotFileList=[];
              if(this.model.surfacePlot) {
                this.surfacePlotImages = JSON.parse(this.model.surfacePlot);
                let surfacePlotIndex = 0;
                for (let m of this.surfacePlotImages) {
                  this.surfacePlotFileList.push({
                    url: this.getImgUrl(m),
                    uid: surfacePlotIndex,
                    name: 'image.png',
                    status: 'done',
                  });
                  surfacePlotIndex++;
                }
                console.log('surfacePlotFileList:', this.surfacePlotFileList);
              }


              //分享图
              this.shareFigureFileList=[];
              if(this.model.shareFigure) {
                this.shareFigureImages = JSON.parse(this.model.shareFigure);
                let shareFigureIndex = 0;
                for (let m of this.shareFigureImages) {
                  this.shareFigureFileList.push({
                    url: this.getImgUrl(m),
                    uid: shareFigureIndex,
                    name: 'image.png',
                    status: 'done',
                  });
                  shareFigureIndex++;
                }
                console.log('shareFigureFileList:', this.shareFigureFileList);
              }


            }else{
              this.model={};
              this.model.status='1';

              this.titleDataSource=[];
              this.giftDataSource=[];
              this.discountDataSource=[];
              this.coinCertiDataSource=[];


              //详情图
              this.detailsFigureFileList=[];
                this.detailsFigureImages=[];


                //海报图
                this.postersFigureFileList=[];
                this.postersFigureImages=[];


                //封面图
                this.surfacePlotFileList=[];
                this.surfacePlotImages=[];

                //分享图
                this.shareFigureFileList=[];
              this.shareFigureImages=[];
            }
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model,'price','headReward','usingBonuses','shareBonus','referralBonuses','status'))
//时间格式化
            });
          } else {
            this.$message.warning(res.message);
          }
        });
      },


      getSelectStore(e){
        this.storeInfo=e;
        this.getStoreGiftbagByStoreManageId();
      },
    }
  }
</script>
<style lang="less">
  .title {
    margin-top: 12px;
    padding: 25px;
    border-bottom: 1px solid #d9d9d9;
    font-weight: 700;
    font-size: 16px;
  }
</style>