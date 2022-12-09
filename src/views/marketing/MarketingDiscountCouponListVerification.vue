<!--店铺优惠券记录-->
<template>
  <a-card :bordered="false">

<h2 >核销</h2>

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="券号">
              <a-input placeholder="请输入" v-model="queryParam.qqzixuangu"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
              <a-button type="primary" @click="searchQueryVerification" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!--优惠券-->
    <div >
<!--      :pagination="false"-->
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSourceQqzixuangu"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
        v-if="youhuiq"
       >
        <template slot="mdgCount" slot-scope="text, record, index">
          <a @click="showModalGoodsInformation(record.id,0)">
          <div class="anty-img-wrap">
            适用商品{{ record.mdgCount }}件
          </div>
          </a>
        </template>

        <template slot="isThreshold" slot-scope="text, record, index">
          <div class="anty-img-wrap" v-if="record.isThreshold =='0' ">无门槛 </div>
          <div class="anty-img-wrap" v-if="record.isThreshold =='1' ">有门槛 </div>
        </template>
        <template slot="completely" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            满{{ record.completely }}元，减{{ record.subtract }}元
          </div>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status==0" >未生效</span>
            <span shape="square" v-if="record.status==1" >已生效</span>
            <span shape="square" v-if="record.status==2" >已使用</span>
            <span shape="square" v-if="record.status==3" >已过期</span>
            <span shape="square" v-if="record.status==4" >已失效</span>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="cancelAfterVerification(record.id,record.isDiscount)">核销</a>

        </span>

      </a-table>
    </div>
<!--兑换券-->
    <div >
<!--      :pagination="false"-->
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        :columns="columns1"
        :dataSource="dataSourceQqzixuangu"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
        v-if="duihuanq"
        >
        <template slot="mdgCount" slot-scope="text, record, index">
          <a @click="showModalGoodsInformation(record.id,1)">
          <div class="anty-img-wrap">
            适用商品{{ record.mdgCount }}件
          </div>
          </a>
        </template>

        <template slot="completely" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            满{{ record.completely }}元，减{{ record.subtract }}元
          </div>
        </template>


        <template slot="isThreshold" slot-scope="text, record, index">
          <div class="anty-img-wrap" v-if="record.isThreshold =='0' ">无门槛 </div>
          <div class="anty-img-wrap" v-if="record.isThreshold =='1' ">有门槛 </div>
        </template>

        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status==0" >未生效</span>
            <span shape="square" v-if="record.status==1" >已生效</span>
            <span shape="square" v-if="record.status==2" >已使用</span>
            <span shape="square" v-if="record.status==3" >已过期</span>
            <span shape="square" v-if="record.status==4" >已失效</span>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="cancelAfterVerification(record.id,record.isDiscount)">核销</a>

        </span>

      </a-table>
    </div>
    <!-- 表单区域 -->
    <marketingDiscountCoupon-modal ref="modalForm" @ok="modalFormOk"></marketingDiscountCoupon-modal>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
  import MarketingDiscountCouponModal from './modules/MarketingDiscountCouponModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import { getAction,postAction } from '@/api/manage'
  export default {
    name: "MarketingDiscountCouponListVerification",
    mixins: [JeecgListMixin],
    inject:['rush'],
    components: {
      MarketingDiscountCouponModal,

    },
    data () {
      return {
        description: '优惠券核销页面',
        dataSourceQqzixuangu:[{
          phone:111
        }],
        youhuiq : false,//优惠券
        duihuanq:false,//兑换券
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '会员手机号',
            align: "center",
            dataIndex: 'phone'
          },
          {
            title: '昵称',
            align: "center",
            dataIndex: 'nickName'
          },
          {
            title: '券号',
            align: "center",
            dataIndex: 'qqzixuangu'
          },
          {
            title: '优惠券名称',
            align: "center",
            dataIndex: 'name'
          },
          {
            title: '使用门槛',
            align: "center",
            dataIndex:'isThreshold',
            scopedSlots: {customRender: 'isThreshold'},
          },
          {
            title: '优惠内容',
            align: "center",
            dataIndex: 'completely',
            scopedSlots: {customRender: 'completely'},
          },
          {
            title: '适用商品',
            align: "center",
            dataIndex: 'mdgCount',
            scopedSlots: {customRender: 'mdgCount'},
          },

          {
            title: '有效期',
            align: "center",
            dataIndex: 'startEndTime'
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'status',
           scopedSlots: {customRender: 'status'},
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        // 兑换券
        columns1: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '会员手机号',
            align: "center",
            dataIndex: 'phone'
          },
          {
            title: '昵称',
            align: "center",
            dataIndex: 'nickName'
          },
          {
            title: '券号',
            align: "center",
            dataIndex: 'qqzixuangu'
          },
          {
            title: '券名称',
            align: "center",
            dataIndex: 'name'
          },
          {
            title: '使用门槛',
            align: "center",
            dataIndex:'isThreshold',
            scopedSlots: {customRender: 'isThreshold'},
          },
          {
            title: '优惠内容',
            align: "center",
            dataIndex: '-'
          },
          {
            title: '兑换商品',
            align: "center",
            scopedSlots: {customRender: 'mdgCount'},
          },

          {
            title: '有效期',
            align: "center",
            dataIndex: 'startEndTime'
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'status',
            scopedSlots: {customRender: 'status'},
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],

        url: {
          list: "/marketingDiscountCoupon/marketingDiscountCoupon/list",
          delete: "/marketingDiscountCoupon/marketingDiscountCoupon/delete",
          deleteBatch: "/marketingDiscountCoupon/marketingDiscountCoupon/deleteBatch",
          exportXlsUrl: "marketingDiscountCoupon/marketingDiscountCoupon/exportXls",
          importExcelUrl: "marketingDiscountCoupon/marketingDiscountCoupon/importExcel",
          couponVerification:"/marketingDiscountCoupon/marketingDiscountCoupon/couponVerification",
          cancelAfterVerification:"/marketingDiscountCoupon/marketingDiscountCoupon/cancelAfterVerification" ,

        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {

      //查询核销按钮
      searchQueryVerification(){
        let that =  this
        that.queryParam.qqzixuangu
        if(!that.queryParam.qqzixuangu){
          that.$message.warning("请输入券号");
          return false;
        }
        getAction(that.url.couponVerification, {qqzixuangu: this.queryParam.qqzixuangu,}).then((res) => {
          if (res.success && res.result) {
            that.dataSourceQqzixuangu = res.result.records
            if(res.result.records[0].isDiscount == "0" ){
              this.youhuiq = true;
              this.duihuanq = false;
            }else{
              this.duihuanq = true;
              this.youhuiq = false;
            }
            //that.$message.success(res.message);

          } else {
            that.$message.warning(res.message);
          }
        });
      },
      cancelAfterVerification(id,isDiscount){

        let that =  this;
        getAction(that.url.cancelAfterVerification, {id:id,isDiscount:isDiscount}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.rush()
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      //商品信息
      showModalGoodsInformation(id,isDiscount) {
        this.$refs.modalForm.showModalGoodsInformation(id,isDiscount);
        this.$refs.modalForm.title = "商品信息";
        this.$refs.modalForm.disableSubmit = false;
      },

    }
  }
</script>
<style scoped lang="less">

</style>