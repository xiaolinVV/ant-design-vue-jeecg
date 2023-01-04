<template>
  <div class="MarketingGiftPackageModal">
    <!--    @ok="handleOk"-->
    <a-modal
      :title="title"
      :width="1500"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      cancelText="关闭"
      :footer="null"
    >
      <a-form :form="form">
        <a-form-item label="兑换券" :label-col="labelCol" :wrapper-col="wrapperCol">
          <!--                          @change="couponTableChange"  :pagination="pagination"-->
          <a-table
            :columns="exchangeCouponColumns"
            :dataSource="exchangeCouponData"
            :rowKey="record => record.id"
            :loading="loading"
            :pagination="false"
            :scroll="{x:true}"
          >
        <span slot="id" slot-scope="text, record" style="color: red;">
         {{text}}
        </span>
            <span slot="name" slot-scope="text, record" style="color: red;">
          {{text}}
        </span>
            <span slot="exchangeStock" slot-scope="text, record" style="color: red;">
          {{text}}
        </span>

            <span slot="commodity" slot-scope="text, record">
          <a href="javascript:;">{{text}}</a>
        </span>
            <span slot="cancelStores" slot-scope="text, record">
          <a href="javascript:;">{{text}}</a>
        </span>
            <template slot="certificateType" slot-scope="text, record, index">
              <div v-if="record.certificateType == 1">
                可兑换的商品任选一个
              </div>
              <div v-else>
                可兑换的商品全部兑换
              </div>
            </template>
            <template slot="goodQuantity" slot-scope="text, record, index">
                <a @click="showExchangeGoodInformation(record.id)">{{record.goodQuantity}}</a>
            </template>
          </a-table>
        </a-form-item>
        <a-form-item label="优惠券" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-table
            :columns="couponColumns"
            :dataSource="couponData"
            :rowKey="record => record.id"
            :loading="loading"
            :pagination="false"
            :scroll="{x:true}"
          >
        <span slot="id" slot-scope="text, record" style="color: red;">
         {{text}}
        </span>
            <span slot="applicableCommodity" slot-scope="text, record">
          <a href="javascript:;">{{text}}</a>
        </span>
            <span slot="validityControl" slot-scope="text, record" style="color: red;">
         {{text}}
        </span>
            <span slot="issueQuantity" slot-scope="text, record" style="color: red;">
         {{text}}
        </span>
            <span slot="remainingCirculation" slot-scope="text, record" style="color: red;">
         {{text}}
        </span>
            <span slot="Publisher" slot-scope="text, record" style="color: red;">
         {{text}}
        </span>
            <template slot="applyGood" slot-scope="text, record, index">
              <a @click="showGoodInformation(record.id)">{{record.applyGood}}</a>
            </template>
          </a-table>

        </a-form-item>
        <a-form-item label="福利金" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input v-decorator="['welfarePayments', { rules: [{ required: true, message: '请输入福利金!' }] }]">

          </a-input>

        </a-form-item>
        <a-form-item label="vip特权" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-radio-group :options="options" @change="selectVip"
                         v-decorator="['vipPrivilege', { rules: [{ required: true, message: '请选择vip特权!' }] }]"/>
          <!--            v-decorator="['vip特权', { rules: [{ required: true, message: 'Please input your vip特权!' }] }]"-->
        </a-form-item>
        <a-form-item label="分销特权" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="showIsThreshold">
          <a-radio-group :options="options"
                         v-decorator="['distributionPrivileges', { rules: [{ required: true, message: '请选择分销特权!' }] }]"/>
          <!--            v-decorator="['vip特权', { rules: [{ required: true, message: 'Please input your vip特权!' }] }]"-->
        </a-form-item>
        <a-form-item label="团队特权" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="showBindingTeamRelationshipCondition">
          <a-radio-group :options="options"
                         v-decorator="['teamPrivileges', { rules: [{ required: true, message: '请选择团队特权!' }] }]"/>
          <!--            v-decorator="['vip特权', { rules: [{ required: true, message: 'Please input your vip特权!' }] }]"-->
        </a-form-item>
      </a-form>

    </a-modal>
    <AppMarketingCertificateGoodModal ref="AppMarketingCertificateGoodModal"></AppMarketingCertificateGoodModal>
    <AppMarketingGoodModal ref="AppMarketingGoodModal"></AppMarketingGoodModal>

  </div>
</template>

<script>
  import { httpAction, getAction, postAction, putAction, deleteAction } from '@/api/manage'
  import AppMarketingCertificateGoodModal from './AppMarketingCertificateGoodModal'
  import AppMarketingGoodModal from './AppMarketingGoodModal'

  const options = [
    { label: '赠送', value: '1' },
    { label: '不赠送', value: '0' }
  ]
  //兑换券表头
  const exchangeCouponColumns = [
    {
      title: '#',
      dataIndex: '#',
      align: 'center'
    },
    {
      title: '兑换券id',
      dataIndex: 'id',
      scopedSlots: { customRender: 'id' },
      align: 'center'

    },
    {
      title: '兑换券名称',
      dataIndex: 'name',
      align: 'center',
      scopedSlots: { customRender: 'name' }
    },
    {
      title: '用券时间',
      dataIndex: 'usrTime',
      scopedSlots: { customRender: 'usrTime' },
      align: 'center'
    },
    {
      title: '兑换方式',
      dataIndex: 'certificateType',
      scopedSlots: { customRender: 'certificateType' },
      align: 'center'
    },
    {
      title: '兑换商品',
      dataIndex: 'goodQuantity',
      scopedSlots: { customRender: 'goodQuantity' },
      align: 'center'
    },
    {
      title: '兑换商品库存',
      dataIndex: 'discountSurplus',
      align: 'center',
      scopedSlots: { customRender: 'discountSurplus' }
    },
    {
      title: '核销门店',
      dataIndex: 'storeQuantity',
      scopedSlots: { customRender: 'storeQuantity' },
      align: 'center'
    },
    {
      title: '核销奖励',
      dataIndex: 'theReward',
      scopedSlots: { customRender: 'theReward' },
      align: 'center'
    },
    {
      title: '发放数量',
      dataIndex: 'distributedAmount',
      scopedSlots: { customRender: 'distributedAmount' },
      align: 'center'
    },

    {
      title: '有效期控制',
      dataIndex: 'validityTypeName',
      scopedSlots: { customRender: 'validityTypeName' },
      align: 'center'
    }
  ]
  //优惠券表头
  const couponColumns = [
    {
      title: '#',
      dataIndex: '#',
      align: 'center'
    },
    {
      title: '优惠券id',
      dataIndex: 'id',
      scopedSlots: { customRender: 'id' },
      align: 'center'

    },
    {
      title: '优惠券名称',
      dataIndex: 'name',
      scopedSlots: { customRender: 'name' },
      align: 'center'
    },
    {
      title: '使用门槛',
      dataIndex: 'usingThreshold',
      scopedSlots: { customRender: 'usingThreshold' },
      align: 'center'
    },
    {
      title: '优惠内容',
      dataIndex: 'preferentialContent',
      scopedSlots: { customRender: 'preferentialContent' },
      align: 'center'
    },
    {
      title: '用券时间',
      dataIndex: 'usrTime',
      align: 'center',
      scopedSlots: { customRender: 'usrTime' }
    },
    {
      title: '适用商品',
      dataIndex: 'applyGood',
      scopedSlots: { customRender: 'applyGood' },
      align: 'center'
    },
    {
      title: '使用人限制',
      dataIndex: 'memberTypeName',
      scopedSlots: { customRender: 'memberTypeName' },
      align: 'center'
    },
    {
      title: '发放人',
      dataIndex: 'issuer',
      align: 'center',
      scopedSlots: { customRender: 'issuer' }
    },
    {
      title: '券剩余发行量',
      dataIndex: 'discountSurplus',
      align: 'center',
      scopedSlots: { customRender: 'discountSurplus' }
    },
    {
      title: '发放数量',
      dataIndex: 'distributedAmount',
      align: 'center',
      scopedSlots: { customRender: 'distributedAmount' }
    },
    {
      title: '有效期控制',
      dataIndex: 'validityTypeName',
      align: 'center',
      scopedSlots: { customRender: 'validityTypeName' }
    }
  ]
  export default {
    name: 'MarketingGiftPackageModal',
    data() {
      return {
        title: '礼包内容',
        visible: false,
        confirmLoading: false,
        loading: false,
        formLayout: 'horizontal',
        form: this.$form.createForm(this, { name: 'MarketingGiftPackageModal' }),
        labelCol: { span: 2 },
        wrapperCol: { span: 21 },
        pagination: {},
        options,
        exchangeCouponColumns,
        exchangeCouponData: [],
        couponColumns,
        couponData: [],
        url: {
          giftContent: '/marketingGiftBag/marketingGiftBag/giftContent',//礼包弹窗接口 传入数据(marketingGiftBagId)
          //分销特权的展示
          ifViewDistributionPrivileges:"marketingGiftBag/marketingGiftBag/ifViewDistributionPrivileges"
        },
        showIsThreshold:false,
        showBindingTeamRelationshipCondition:false
      }
    },
    components:{
      AppMarketingCertificateGoodModal,
      AppMarketingGoodModal
    },
    methods: {
      // handleOk() {
      //   this.form.validateFields((err, values) => {
      //     if (!err) {
      //       console.log(values)
      //       this.totalModal()
      //     }
      //   })
      // },
      ifViewDistributionPrivileges(){
        return new Promise(resolve=>{
          getAction(this.url.ifViewDistributionPrivileges).then(res=>{
            if(res.success){
              if(res.result.isThreshold == 1 || res.result.isThreshold == 3){
                this.showIsThreshold = true;
              }else{
                this.showIsThreshold = false;
              }
              if(res.result.bindingTeamRelationshipCondition == 1 || res.result.bindingTeamRelationshipCondition == 3){
                this.showBindingTeamRelationshipCondition = true
              }else{
                this.showBindingTeamRelationshipCondition = false;
              }
            }
            resolve()
          })
        })
      },
      //适用商品弹窗(兑换券)
      showExchangeGoodInformation(id){
        this.$refs.AppMarketingCertificateGoodModal.showModalVisible(id);
      },
      //适用商品弹窗（优惠券）
      showGoodInformation(id){
        this.$refs.AppMarketingGoodModal.showModalVisible(id);
      },
      handleCancel() {
        this.totalModal()
      },
      async totalModal(record = '') {
        console.log(record)
        this.visible = !this.visible
        this.confirmLoading = true
        this.loading = true
        if(this.visible){
         await this.ifViewDistributionPrivileges()
        }
        if (record) {
          getAction(this.url.giftContent, { marketingGiftBagId:( record.marketingGiftBagId || record.id || '')}).then(res => {
            console.log(res)
            let couponData = res.result.Discounts.result.records
            let exchangeCouponData = res.result.Certificates.result.records
            for (let i = 0; i < couponData.length; i++) {
              couponData[i]['#'] = i + 1
            }
            for (let i = 0; i < exchangeCouponData.length; i++) {
              exchangeCouponData[i]['#'] = i + 1
            }
            //优惠券
            this.couponData = couponData || []
            //兑换券
            this.exchangeCouponData = exchangeCouponData || []
            this.$nextTick(()=>{
              if (record) {
                this.form.setFieldsValue({
                  welfarePayments: record.welfarePayments,
                  vipPrivilege: record.vipPrivilege ? record.vipPrivilege.toString() : '0',
                  teamPrivileges: record.teamPrivileges ? record.teamPrivileges.toString() : '0',
                  distributionPrivileges: record.distributionPrivileges ? record.distributionPrivileges.toString() : '0',
                })
              } else {
                this.form.setFieldsValue({
                  welfarePayments: '',
                  vipPrivilege: '',
                  teamPrivileges:'',
                  distributionPrivileges:''
                })
              }
              this.confirmLoading = false
              this.loading = false
            })
          })
        }
      },
      selectVip(e) {
        console.log(e.target.value)
      }
    }
  }
</script>

<style scoped>

</style>