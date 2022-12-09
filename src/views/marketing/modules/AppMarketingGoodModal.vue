<template>
  <div>
    <a-modal :title="title"
             :width="1200"
             :visible="visible"
             :confirmLoading="confirmLoading"
             @ok="handleOk"
             @cancel="handleCancel"
             cancelText="关闭"
             class="AppMarketingGoodModal"
    >
      <a-form layout="inline">
        <a-row :gutter="24">

          <!--<a-col :md="8" :sm="8">-->
            <!--<a-form-item label="商品名称">-->
              <!--<a-input placeholder=""></a-input>-->
            <!--</a-form-item>-->
          <!--</a-col>-->


          <!--<a-col :md="12" :sm="12" class="classification">-->
            <!--<a-form-item label="商品分类"-->
                         <!--style="width: 100%;display: flex;justify-content: space-between;align-items: center">-->
              <!--&lt;!&ndash;下拉框&ndash;&gt;-->
              <!--<a-select placeholder="请选择" style="width: 45%;margin-right: 20px">-->
                <!--<a-select-option value="">请选择</a-select-option>-->
                <!--<a-select-option value="0">免费领取</a-select-option>-->
                <!--<a-select-option value="1">分享后领取</a-select-option>-->
                <!--<a-select-option value="2">下单后领取</a-select-option>-->
                <!--<a-select-option value="3">扫码领取</a-select-option>-->
              <!--</a-select>-->
              <!--<a-select placeholder="请选择" style="width: 45%">-->
                <!--<a-select-option value="">请选择</a-select-option>-->
                <!--<a-select-option value="0">免费领取</a-select-option>-->
                <!--<a-select-option value="1">分享后领取</a-select-option>-->
                <!--<a-select-option value="2">下单后领取</a-select-option>-->
                <!--<a-select-option value="3">扫码领取</a-select-option>-->
              <!--</a-select>-->
            <!--</a-form-item>-->
          <!--</a-col>-->
          <!--<a-col :md="2" :sm="2">-->
            <!--<a-button type="primary" @click="search">-->
              <!--查询-->
            <!--</a-button>-->
          <!--</a-col>-->

        </a-row>
      </a-form>
      <!--      :scroll="{y:600}"-->
      <a-table bordered :dataSource="dataSource" :columns="columns" :pagination="{pageSize:5}" :scroll="{y:600,x:1800}"
               style="margin-top: 10px;" :loading="loading">
        <template slot="mainPicture" slot-scope="text, record, index">
          <img preview="1" :src="text" alt="" style="width: 100px;height: 100px">
        </template>

      </a-table>

    </a-modal>
  </div>
</template>

<script>
  import {httpAction, postAction, getAction, putAction} from '@/api/manage'
  import AModal from "ant-design-vue/es/modal/Modal";
  export default {
    components: {AModal},
    name: 'AppMarketingGoodModal',
    data(){
      return {
        title: '适用商品',
        visible: false,  //弹窗显示隐藏
        confirmLoading: false,//是否正在加载
        dataSource: [
          // {
          //   key: '0',
          //   mainPicture: 'http://b-ssl.duitang.com/uploads/item/201410/09/20141009224754_AswrQ.jpeg',
          //   goodName: '商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称1商品名称商品名称商品名称商品名称',
          //   typeName: '商品分类商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称1',
          //   price: '1.01',
          //   costPrice: '2.02',
          //   vipPrice: '3.03',
          //   repertory: '2'
          // },
        ],
        //接口
        url: {
          //适用商品返显
          findByMarketingDiscount: '/marketingDiscount/marketingDiscount/findByMarketingDiscount',
        },
        //配置
        configure: {
          imgErver: window._CONFIG['domianURL'] + "/sys/common/view",
        },
        count: 2,
        columns: [
          {
            title: '商品图片',
            dataIndex: 'mainPicture',
            width: '10%',
            scopedSlots: {customRender: 'mainPicture'},
            align:'center'
          },
          {
            title: '商品名称',
            dataIndex: 'goodName',
            textAlign: 'center',
            width: '15%',
            align:'center'
          },
          {
            title: '商品分类',
            dataIndex: 'typeName',
            // width: '200',
            width: '15%',
            align:'center'
          },
          {
            title: '市场价',
            dataIndex: 'marketPrice',
            // width: '200',
            width: '8%',
            align:'center'
          },
          {
            title: '销售价',
            dataIndex: 'price',
            // width: '200',
            width: '8%',
            align:'center'
          },
          {
            title: '成本价',
            dataIndex: 'costPrice',
            // width: '200',
            width: '8%',
            align:'center'
          },
          {
            title: '会员价',
            dataIndex: 'vipPrice',
            // width: '200',
            width: '8%',
            align:'center'
          },
          {
            title: '库存',
            dataIndex: 'repertory',
            width: '8%',
            align:'center'
          },
          {
            title: '供应商',
            dataIndex: 'name',
            // width: '200',
            width: '20%',
            align:'center'
          }
        ],
        loading: false,
      }
    },
    methods: {
      //弹窗确定事件
      handleOk(){
        this.hideModalVisible()
      },
      //弹窗取消事件
      handleCancel(){
        this.hideModalVisible()
      },
      //显示弹窗
      showModalVisible(id){
        this.loading = true
        let that = this;
        let info = {
          marketingDiscountId: id,
        }
        this.visible = true
        //参数  marketingDiscountId
        getAction(that.url.findByMarketingDiscount, info).then((res) => {
          if (res.success) {
            for (let item of res.result.records) {
              if (item.mainPicture) {
                item.mainPicture = this.configure.imgErver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
              }
            }
            this.dataSource = res.result.records
            // for(let item of res.result.records){
            //   item.operation = '删除'
            //   this.selectedRowKeys.push(item.id);
            // }
          }
          setTimeout(() => {
            this.loading = false
          }, 500)
        });
      },
      //隐藏弹窗
      hideModalVisible(){
        this.visible = false
      },
      //搜索
      search(){
        //搜索接口
        // this.dataSource = ''
      }
    }
  }
</script>

<style lang="less">
  .ApplicableCommodityModal {
    .ant-modal-body {
      vertical-align: center;
    }
    .ant-form-item-control-wrapper {
      width: 80% !important;
    }
    .ant-form-inline .ant-form-item {
      display: flex;
    }
    .ant-form-item-control {
      width: 100% !important;
    }
  }

</style>