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
            label="创建年">
            <a-input-number v-decorator="[ 'year', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="创建月">
            <a-input-number v-decorator="[ 'month', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="创建日">
            <a-input-number v-decorator="[ 'day', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="删除状态（0，正常，1已删除）">
            <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-decorator="['delFlag', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="代理id">
            <a-input placeholder="请输入代理id" v-decorator="['sysUserId', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="交易类型；0：订单交易；1：提现；2：订单退款；3：余额充值；做成数据字典">
            <a-input placeholder="请输入交易类型；0：订单交易；1：提现；2：订单退款；3：余额充值；做成数据字典" v-decorator="['payType', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="支付和收入；0：收入；1：支出">
            <a-input placeholder="请输入支付和收入；0：收入；1：支出" v-decorator="['goAndCome', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="交易金额">
            <a-input-number v-decorator="[ 'amount', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="单号">
            <a-input placeholder="请输入单号" v-decorator="['orderNo', {}]" />
          </a-form-item>

        </a-form>
      </a-spin>
    </a-modal>
    <!--查看详情-->
    <a-modal title="查看详情" :width="700" v-model="visiblViewDetailsInformation"
             @ok="showWithdrawDeposit()" okText="确认" cancelText="取消">

      <div v-if="agencyAccountCapital">
        <div style="width: 100%;background-color: #f2f2f2;padding: 20px;line-height: 30px">
          <h3>待审核</h3>
          <div>提现申请审核中，请等待...</div>
        </div>
      <div>
        <div class="tixianTime" >
          <div class="tixianTimeFirst"><span>提现时间：</span><span>{{ agencyAccountCapital.createTime}} </span></div>
          <div><span>交易类型：</span><span>余额提现</span></div>
        </div>
        <div class="tixianTime" >
          <div class="tixianTimeFirst"><span>提现到：</span><span>({{ agencyAccountCapital.bankCard }})</span></div>
          <div><span>操作人：</span><span>{{ agencyAccountCapital.operator }}</span></div>
        </div>
        <div class="tixianTime" >
          <div class="tixianTimeFirst"><span>单号：</span><span>{{ agencyAccountCapital.orderNo}}</span></div>
          <div><span>交易金额：</span><span>{{ agencyAccountCapital.amount}}</span></div>
        </div>
        <div class="tixianTime" >
          <div><span>备注：</span><span>-</span></div>

        </div>
      </div>


      </div>

    </a-modal>


  </div>

</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "AgencyAccountCapitalModal",
    data () {
      return {
        title:"操作",
        visible: false,
        visiblViewDetailsInformation:false,
        agencyAccountCapital:{},
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
          add: "/agencyAccountCapital/agencyAccountCapital/add",
          edit: "/agencyAccountCapital/agencyAccountCapital/edit",
        },
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','sysUserId','payType','goAndCome','amount','orderNo'))
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
      //查看详情
      viewDetails(record){
        this.visiblViewDetailsInformation = true;
     console.log("record",record)
        if(record){
         this.agencyAccountCapital =   record;

        }

      }

    }
  }
</script>

<style lang="less" scoped>
.tixianTime{display: flex;justify-content: left;line-height: 30px;padding: 20px;}
.tixianTimeFirst{
  width: 60%;
}
</style>