<!--店铺分销佣金明细弹窗-->
<template>
  <div>
    <a-modal :title="title"
             :width="1200"
             :visible="visible"
             :confirmLoading="confirmLoading"
             @ok="handleOk"
             @cancel="handleCancel"
             cancelText="关闭"
             class="AppMemberbrokerageModal"
    >
      <a-form layout="inline">
        <a-row :gutter="24">

          <!--<a-col :md="8" :sm="8">-->
            <!--<a-form-item label="成员手机号">-->
              <!--<a-input placeholder=""></a-input>-->
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
      <a-table bordered :dataSource="dataSource" :columns="columns" :pagination="{pageSize:5}" :scroll="{y:400,x:2000}"
               style="margin-top: 10px;" :loading="loading">
        <template slot="headPortrait" slot-scope="text, record, index">
          <img preview="1" :src="text" alt="" style="width: 100px;height: 100px">
        </template>
        <template slot="goodPicture" slot-scope="text, record, index">
          <img preview="1" :src="text" alt="" style="width: 100px;height: 100px">
        </template>
      </a-table>

    </a-modal>
  </div>
</template>

<script>
  import {httpAction, postAction, getAction, putAction} from '@/api/manage'
  import AModal from "ant-design-vue/es/modal/Modal";
  const width = '8.3%'
  export default {
    components: {AModal},
    name: 'AppMemberbrokerageModal',
    data(){
      return {
        title: '累计佣金',
        visible: false,  //弹窗显示隐藏
        confirmLoading: false,//是否正在加载
        dataSource: [
          // {
          //   key: '0',
          //   mainPicture: 'http://b-ssl.duitang.com/uploads/item/201410/09/20141009224754_AswrQ.jpeg',
          //   goodName: '商品名称1',
          //   typeName: '商品分类1',
          //   price: '1.01',
          //   costPrice: '2.02',
          //   vipPrice: '3.03',
          //   repertory: '2'
          // },
        ],
        //接口
        url: {
          //适用商品返显
          findByMarketingDiscount: '/memberDistributionRecord/memberDistributionRecord/findMemberDistributionRecordVOById',
        },
        //配置
        configure: {
          imgErver: window._CONFIG['domianURL'] + "/sys/common/view",
        },
        count: 2,
        columns: [
          {
            title: '成员头像',
            dataIndex: 'headPortrait',
            width,
            scopedSlots: {customRender: 'headPortrait'},
            align:'center'
          },
          {
            title: '成员手机号',
            dataIndex: 'phone',
            textAlign: 'center',
            width,
            align:'center'
          },
          {
            title: '成员昵称',
            dataIndex: 'nickName',
            width,
            align:'center'
          },
          {
            title: '会员类型',
            // memberType_dictText
            dataIndex: 'memberType',
            width,
            align:'center'
          },
          {
            title: '成员级别',
            dataIndex: 'levelName',
            width,
            align:'center'
          },
          {
            title: '订单编号',
            dataIndex: 'orderNo',
            width,
            align:'center'
          },
          {
            title: '商品图片',
            dataIndex: 'goodPicture',
            scopedSlots: {customRender: 'goodPicture'},
            width,
            align:'center'
          },
          {
            title: '商品名称',
            dataIndex: 'goodName',
            width,
            align:'center'
          },
          {
            title: '商品规格',
            dataIndex: 'goodSpecification',
            width,
            align:'center'
          },
          {
            title: '订单状态',
            dataIndex: 'tradeStatus',
            width,
            align:'center'
          },
          {
            title: '佣金',
            dataIndex: 'commission',
            width,
            align:'center'
          },
          {
            title: '下单时间',
            dataIndex: 'createTime',
            width,
            align:'center'
          },
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
          mId: id,
        }
        this.visible = true
        getAction(that.url.findByMarketingDiscount, info).then((res) => {
          if (res.success) {
            for (let item of res.result.records) {
              if (item.goodPicture) {
                item.goodPicture = this.configure.imgErver + '/' + Object.values(JSON.parse(item.goodPicture))[0]
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