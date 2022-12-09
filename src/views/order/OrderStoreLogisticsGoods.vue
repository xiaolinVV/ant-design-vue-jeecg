<template>
  <div class="order-details">
    <div class="title">
      物流详情
    </div>
    <!--包裹-->
    <a-card class="wrap">
      <div>
        <a-menu
          mode="horizontal"
          :defaultSelectedKeys="[0]"
          :style="{ lineHeight: '50px',
         fontSize:'18PX',
         }">
          <a-menu-item :key="index" v-for="(orderStoreSubListDTO,index) in orderStoreSubListDTOs" @click="theParcelInformation(orderStoreSubListDTO,index)">包裹 {{ index+1 }}</a-menu-item>
          <!--<a-menu-item :key="1">包裹2</a-menu-item>
          <a-menu-item :key="2" >包裹3 </a-menu-item>-->
        </a-menu>
      </div>
   <!--物流数据-->
      <a-card :bordered="true" class="head-decoration-parcel">
        <div >
          <div style="font-size: 16px;color: black">包裹{{ bgIndex+1 }}</div>
          <div style="margin-top: 30px">
            <template v-if="logisticsTracking">
              <a-timeline>
                <a-timeline-item color="red" v-for="item in logisticsTrackingList">{{ item.time }} {{ item.status }} </a-timeline-item>
              </a-timeline>
            </template>
            <template v-else>
            <div>  您的快件还未发货，请耐心等待...</div>
            </template>


          </div>
        </div>
      </a-card>

      <!--供应商信息-->
      <a-card class="wrap">
        <detail-list  :col="1" >
          <detail-list-item v-for='item in card1Cnt' :term="item.term" >
            <div>
              {{item.content}}
            </div>
          </detail-list-item>
        </detail-list>
      </a-card>
    </a-card>

    <!--公司物流信息-->
    <a-card class="wrap" >

      <!--选择物流服务-->
      <div>
      <!--发货商品-->
      <div class="fahuoGoods" style="border: 1px solid #e6e6e6;margin-top: 20px;padding: 20px">

        <a-table
          style="margin-top: 20px"
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="orderStoreGoodRecords"
          :pagination="false"
          :loading="loading"
          @change="handleTableChange">
          <template slot="mainPicture" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-avatar shape="square" v-if="record.mainPicture != undefined " :src="getAvatarView(JSON.parse(record.mainPicture)[0])" icon="user"/>
              <a-avatar shape="square" v-if="record.mainPicture == undefined || record.mainPicture ==''  " :src="getAvatarView(record.mainPicture)" icon="user"/>
            </div>
          </template>
        </a-table>
      </div>
      </div>
    </a-card>
    <!-- 表单区域 -->
    <orderList-modal ref="modalForm" @ok="modalFormOk"></orderList-modal>
  </div>

</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util';
  import DetailList from '@/components/tools/DetailList'
  import STable from '@/components/table/'
  import {deleteAction, getAction, downFile} from '@/api/manage'
  const DetailListItem = DetailList.Item
  //字典
  import {filterDictText, initDictOptions} from '@/components/dict/JDictSelectUtil'

  export default {
    name: "OrderListList",
    mixins:[JeecgListMixin],
    components: {
      DetailList,
      DetailListItem,
      STable
    },
    data () {
      return {
        description: '订单列表管理页面',
        formList:{},
        orderType:'',
        orderStoreGoodRecords:[],
        orderStoreSubListDTOs:[],
        reusePage:"",
        OrderProviderGoodRecordId:[],
        orderProviderList:{},
        logisticsCompany:"",
        logisticsCompanyOPL:"",
        bgIndex:'0',
        record:{},
        //卡片1的上半部分内容
        card1Cnt:[
          {
            term:'供应商',
            content:''
          },{
            term:'运单号码',
            content:''
          },{
            term:'物流公司',
            content:''
          },
          {
            term:'收货信息',
            content:''
          },
          {
            term:'收货信息',
            content:''
          }
        ],


        //卡片2 留言
        card5Cnt:[
          {
            term:'留言信息',
            content:''
            },
        ],

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
            title: '商品规格',
            align:"center",
            dataIndex: 'specification',
            scopedSlots: {customRender: "specification"}
          },

          {
            title: '数量',
            align:"center",
            dataIndex: 'amount',
            scopedSlots: {customRender: "amount"}
          },
        ],

		url: {
          list: "/orderStoreList/orderStoreList/list",
          delete: "/orderStoreList/orderStoreList/delete",
          deleteBatch: "/orderStoreList/orderStoreList/deleteBatch",
          exportXlsUrl: "/orderStoreList/orderStoreList/exportXls",
          importExcelUrl: "/orderStoreList/orderStoreList/importExcel",
          imgerver: window._CONFIG['domianURL'] + "/sys/common/view",
          parcelInformation:"/orderStoreSubList/orderStoreSubList/parcelInformation",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    mounted() {

      this.init(()=>{
//**********************************数据渲染开始********************************************//

        let data = JSON.parse(localStorage.getItem('deliverGoods'))
        this.record = this.$route.query.record;
        //包裹数据方法
        this.parcelInformation(data.id);
       // parcelInformation
        // localStorage.setItem();
        // localStorage.getItem();
        if(this.orderType && this.orderType){
          for(let item of this.orderType){//字典值替换
            if(item.value == data.orderType){
              data.orderType = item.text
              break;
            }
          }
        }

        if(this.oderCloseType && data.closeType){
          for(let item of this.oderCloseType){//字典值替换
            if(item.value == data.closeType){
              data.closeType = item.text
              break;
            }
          }
        }

        if(data.closeExplain && this.oderCloseExplain){
          for(let item of this.oderCloseExplain){//字典值替换
            if(item.value == data.closeExplain){
              data.closeExplain = item.text
              break;
            }
          }
        }

        if(data.memberList){
        if(data.memberList.memberType && this.memberTypeDict){
          for(let item of this.memberTypeDict){//字典值替换
            if(item.value == data.memberList.memberType){
              data.memberList.memberType = item.text
              break;
            }
          }
        }
        }


        let memberList = data.memberList
        //商品信息

       /*********************************包裹添加未处理**************************************************/
        this.reusePage = this.$route.query.reusePage;
        console.log("data",data)
        console.log("reusePage",this.reusePage)
       /* let  orderStoreSubListDTOs = this.orderStoreSubListDTOs
       let orderProviderList =   this.orderProviderList
        if(this.orderProviderList){
          this.card1Cnt = [
            {
              term:'供应商',
              content:orderProviderList.sysUserName
            },{
              term:'运单号码',
              content:orderProviderList.trackingNumber
            },{
              term:'物流公司',
              content:orderProviderList.logisticsCompany
            },
            {
              term:'收货信息',
              content:""
            },
            {
              term:'退货信息',
              content:""
            }
          ]
        }*/

          this.card2Cnt = [

            {
              term:'买家账号',
              content:memberList.phone
            },{
              term:'昵称',
              content:memberList.nickName
            },{
              term:'会员类型',
              content:memberList.memberType
            },{
              term:'收货人',
              content:data.consignee
            },
            {
              term:'联系电话',
              content:data.contactNumber
            },
            {
              term:'收货地址',
              content:data.shippingAddress
            },
            {
              term:'门牌号',
              content:data.houseNumber
            },
          ]

          this.card5Cnt = [
            {
              term:'留言信息',
              content:data.message
            },
          ]
      });//字典加载


    },
    methods: {
      getAvatarView: function (mainPicture) {
        return this.url.imgerver + "/" + mainPicture;
      },
      //字典
      init(callback) {
        this.initIndex(callback);

      },
      initIndex(callback) {
          //oderCloseType关闭类型字典
        initDictOptions('oder_close_type').then((res) => {
          if (res.success) {
            this.oderCloseType =res.result ;
            console.log("this.oderCloseType关闭类型字典",this.oderCloseType)
          }
        }),
         // oder_close_explain订单关闭原因字典
          initDictOptions('oder_close_explain').then((res) => {
            if (res.success) {
              this.oderCloseExplain =res.result ;

              console.log("this.oderCloseExplain订单关闭原因字典",this.oderCloseExplain)
            }
          });
        //oder_distribution 订单配送方式字典
        initDictOptions('oder_distribution').then((res) => {
          if (res.success) {
            this.oderDistribution =res.result ;
            this.distribution = res.result;
            console.log("this.oderDistribution订单关闭原因字典",this.oderDistribution)
          }
        });
        //logistics_company 快递公司
        initDictOptions('logistics_company').then((res) => {
          if (res.success) {
            this.logisticsCompany =res.result;
            console.log("this.orderType订单类型字典",this.logisticsCompany)

          }
        });
        //member_type 会员类型字典
        initDictOptions('member_type').then((res) => {
          if (res.success) {
            this.memberTypeDict =res.result;
            console.log("this.memberTypeDict会员类型类型字典",this.memberTypeDict)
            this.$nextTick(()=>{
              callback()
            })
          }
        });
        //order_type 订单类型字典
        initDictOptions('order_type').then((res) => {
          if (res.success) {
            this.orderType =res.result;
            console.log("this.orderType订单类型字典",this.orderType)
            this.$nextTick(()=>{
              callback()
            })
          }
        });



      },
      //取消按钮
      showModalCancelInformation(orderListId){
        console.log(orderListId)
        this.$refs.modalForm.showModalCancelInformation(orderListId);
        this.$refs.modalForm.title = "取消按钮";
        this.$refs.modalForm.disableSubmit = false;
      } ,
      //修改地址
      showModalAddressInformation(goodListId,memberListId,consignee,contactNumber,shippingAddress){
        console.log(goodListId,memberListId,consignee,contactNumber,shippingAddress)
        this.$refs.modalForm.showModalAddressInformation(goodListId,memberListId,consignee,contactNumber,shippingAddress);
        this.$refs.modalForm.title = "修改地址";
        this.$refs.modalForm.disableSubmit = false;
      },
      //获取选择包裹的Id
      ChooseParcel( id){
       console.log(" 包裹id",id)
  },

      //包裹数据
      parcelInformation(id){
        console.log("id++++",id)
        var that = this;
        getAction(that.url.parcelInformation, {orderListId:id}).then((res) => {
          if (res.success) {
            console.log("res.result",res.result)
            this.orderStoreSubListDTOs = res.result
            if(this.orderStoreSubListDTOs.length>0){
              this.orderProviderList = this.orderStoreSubListDTOs[0]
              //包裹订单点击渲染信息
              this.theParcelInformation(this.orderProviderList,0)
            }

          } else {
            that.$message.success("修改失败");
          }
        });
      },
      //包裹订单点击渲染信息
      theParcelInformation(orderProviderList,index){

        //快递公司
        if(orderProviderList){
          if(orderProviderList.logisticsCompany && this.logisticsCompany){
            for(let item of this.logisticsCompany){//字典值替换
              if(item.value == orderProviderList.logisticsCompany){
                orderProviderList.logisticsCompany = item.text
                break;
              }
            }
          }
          console.log("orderProviderList.providerAddressDTO",orderProviderList.providerAddressDTOFa)
          let providerAddressFa ="";
          if(orderProviderList.providerAddressDTOFa){
           // 张小娴 ， 18750202107  ， 福建省厦门市思明区望海路10号之二
            //发货信息
            let providerAddressDTOFa = orderProviderList.providerAddressDTOFa
            providerAddressFa = providerAddressDTOFa.contactName +","+providerAddressDTOFa.contactPhone+","+
              providerAddressDTOFa.contactPhone+","+providerAddressDTOFa.detailedAddress
          }else{
            providerAddressFa = "-";
          }
          //退货信息
          let providerAddressTui ="";
          if(orderProviderList.providerAddressDTOTui){
            // 张小娴 ， 18750202107  ， 福建省厦门市思明区望海路10号之二
            //发货信息
            let providerAddressDTOTui = orderProviderList.providerAddressDTOTui
            providerAddressTui = providerAddressDTOTui.contactName +","+providerAddressDTOTui.contactPhone+","+
              providerAddressDTOTui.contactPhone+","+providerAddressDTOTui.detailedAddress
          }else{
            providerAddressTui = "-";
          }
          this.card1Cnt = [
            {
              term:'供应商',
              content:orderProviderList.sysUserName
            },{
              term:'运单号码',
              content:orderProviderList.trackingNumber
            },{
              term:'物流公司',
              content:orderProviderList.logisticsCompany
            },
            {
              term:'收货信息',
              content:providerAddressFa
            },
            {
              term:'退货信息',
              content:providerAddressTui
            }
          ],
            //下标
            this.bgIndex = index;
            //当前商品信息
            this.orderStoreGoodRecords = orderProviderList.orderStoreGoodRecords;
          //快递公司
          this.logisticsCompanyOPL = orderProviderList.logisticsCompany;
          this.logisticsTracking = orderProviderList.logisticsTracking;
          if(this.logisticsTracking){
            this.logisticsTrackingList = JSON.parse(this.logisticsTracking).result.list
          }else{
            this.logisticsTrackingList = {};
          }

        }

      },

    }
  }
</script>
<style  lang="less">
.order-details{
  width: 100%;
  color: black;
  .title{
    font-size: 20px;
    font-weight: 700;
    padding: 0 20px;
    padding-top: 25px;
    margin-bottom: 25px;
  }
  .wrap{
    margin-top: 25px;
    padding:  20px;
    box-sizing: content-box;
    .head{
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      color: black;
      .term{
        font-weight: 700;
        margin-right: 15px;
      }
    }
  }

  .head-decoration{
    background: #ececec;
    font-size: 14px;
    height: 150px;
    .ant-card-body{
      height: 100%!important;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      color: black;
    }
  }
  .cnt-title{
    font-size: 20px;
    font-weight: 700;
  }
  .logisticsService{
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .head-decoration-parcel{
    background: #ececec;
    font-size: 14px;
    margin-top: 20px;

  }
  .head-decorationGoods{width: 200px;margin-left: 20px;margin-bottom: 10px;margin-top: 10px}
 .fahuoGoods{border: 1px solid #e6e6e6;margin-top: 20px;padding: 20px}
.fahuoGoods1{height: 35px;border: 1px solid #0099ff;background-color: #b3e1ff;line-height: 35px;border-radius: 4px;}

}
</style>