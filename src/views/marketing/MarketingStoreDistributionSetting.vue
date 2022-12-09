<template>
    <a-card class="MarketingStoreDistributionSetting">
      <div class="title">
        分销设置
      </div>
      <div class="wrap">
        <a-form :form="form">
          <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <span slot="label">
              <span class="dataCheckedStar">
                *
              </span>
              分销比例
            </span>
            <div class="distributionRatio">
              <div class="distributionWrap">
                <div>
                  普通一级分销比例
                </div>
                <a-input v-model="AllData.commonFirst"/>
                %
              </div>
              <div class="distributionWrap">
                <div>
                  vip会员一级分销比例
                </div>
                <a-input v-model="AllData.vipFirst"/>
                %
              </div>
              <div class="distributionWrap">
                <div>
                  普通二级分销比例
                </div>
                <a-input v-model="AllData.commonSecond"/>
                %
              </div>
              <div class="distributionWrap">
                <div>
                  vip会员二级分销比例
                </div>
                <a-input v-model="AllData.vipSecond"/>
                %
              </div>
            </div>
            <div>
              注意：若不做二级分销则设置分销比例为0%，分销佣金来自于店铺利润乘以分销比例。为确保店铺利益，建议不要设置过高的比例。
            </div>
          </a-form-item>
          <a-form-item label="状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
<!--            v-model="AllData.status"-->
            <a-radio-group
              :default-value="0"
              v-decorator="['status', { rules: [{ required: true, message: '请选择状态' }] }]"
            >
              <a-radio :value="1">启用</a-radio>
              <a-radio :value="0" style="margin-left: 30px;">停用</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </div>
      <div class="button-end">

      </div>
      <div class="button-operation">
        <a-button type="primary" @click="sure">
          确认
        </a-button>
      </div>
      <a-modal
        :title="modalTitle"
        :visible="visible"
        @ok="modalOk"
        :confirmLoading="confirmLoading"
        @cancel="modelCancel"
      >
        <p>{{ModalText}}</p>
        <a-textarea placeholder="请输入说明" :rows="4" v-model="AllData.stopExplain" v-if="operation == 0"/>
      </a-modal>
    </a-card>
</template>
<script>
  import {httpAction, postAction, getAction, putAction} from '@/api/manage'
  import AFormItem from "ant-design-vue/es/form/FormItem";
  import Vue from 'vue'
  export default {
    components: {AFormItem},
    name: "MarketingStoreDistributionSetting",
    inject: ['rush'],
    data(){
      return {
        AllData: {
          id: '',
          commonFirst: 0,//普通一级分销
          vipFirst: 0,//vip一级级分销
          commonSecond: 0,//普通二级分销
          vipSecond: 0,//vip二级级分销
          status: '',//状态
          delFlag: "0",//删除状态
        },
        form:this.$form.createForm(this),
        url: {
          findStoreDistributionSetting: "/marketingStoreDistributionSetting/marketingStoreDistributionSetting/findStoreDistributionSetting",//店铺分销返显
          savaStoreDistributionSetting: "/marketingStoreDistributionSetting/marketingStoreDistributionSetting/savaStoreDistributionSetting",//店铺分销设置
        }
      }
    },
    created() {
      const token = Vue.ls.get('Access-Token');
      this.headers = {"X-Access-Token": token};
      getAction(this.url.findStoreDistributionSetting).then(res => {
        console.log(res)
        if (res.success && res.result) {
          res.result.status = res.result.status * 1
          this.AllData = res.result;
          this.$nextTick(()=>{
            this.form.setFieldsValue(res.result)
          })
        }
      })
    },
    methods: {
      //保存
      sure(){
        let result = this.AllData.commonFirst.toString() && this.AllData.vipFirst.toString() && this.AllData.commonSecond.toString() && this.AllData.vipSecond.toString()
        if(!result){
          this.$message.warn('请设置完成分销比例！')
          return
        }
        this.form.validateFields((err,values)=>{
          if(!err && this.AllData ){
            this.AllData.status = values.status
            putAction(this.url.savaStoreDistributionSetting, this.AllData).then(res => {
              if (res.success) {
                this.$message.success(res.message)
                this.rush()
              } else {
                this.$message.warn(res.message)
                this.rush()
              }
            })
          }
        })
      },
    }
  }

</script>
<style lang="less">
  .MarketingStoreDistributionSetting {
    width: 100%;
    .title {
      font-size: 16px;
      font-weight: 700;
      padding-bottom: 25px;
      border-bottom: 1px solid gray;
      margin-top: 30px;
    }
    .wrap {
      margin-top: 30px;
      .distributionRatio {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap-reverse;
        .distributionWrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 40%;
          margin-bottom: 15px;
          input {
            width: 50%;
          }
        }
      }
    }
    .button-operation {
      display: flex;
      justify-content: space-between;
      width: 200px;
      margin: 0 auto;

      button {
        width: 80px;
      }
    }

    .button-end {
      margin-bottom: 40px;
      border-bottom: 1px solid gray;
    }
  }
</style>