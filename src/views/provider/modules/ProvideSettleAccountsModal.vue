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
            <a-input-number v-decorator="[ 'year', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="创建月">
            <a-input-number v-decorator="[ 'month', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="创建日">
            <a-input-number v-decorator="[ 'day', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="删除状态（0，正常，1已删除）">
            <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-decorator="['delFlag', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="供应商id">
            <a-input placeholder="请输入供应商id" v-decorator="['sysUserId', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="单号">
            <a-input placeholder="请输入单号" v-decorator="['orderNo', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="手机号">
            <a-input placeholder="请输入手机号" v-decorator="['phone', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="提现金额">
            <a-input-number v-decorator="[ 'money', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="提现类型；0：微信；1：支付宝">
            <a-input placeholder="请输入提现类型；0：微信；1：支付宝" v-decorator="['withdrawalType', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="手续费">
            <a-input-number v-decorator="[ 'serviceCharge', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="实际金额">
            <a-input-number v-decorator="[ 'amount', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="申请时间">
            <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'timeApplication', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="状态；0：待审核；1：待打款；2：已付款；3：无效">
            <a-input placeholder="请输入状态；0：待审核；1：待打款；2：已付款；3：无效" v-decorator="['status', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="打款时间">
            <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'payTime', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="备注">
            <a-input placeholder="请输入备注" v-decorator="['remark', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="无效原因">
            <a-input placeholder="请输入无效原因" v-decorator="['closeExplain', {}]"/>
          </a-form-item>

        </a-form>
      </a-spin>
    </a-modal>
    <!--审批弹窗-->
    <div>
      <a-modal title="审批" v-model="visibleAudi" @ok="hideAudiModal()" okText="确认" cancelText="取消">
        <input style="display: none" :value="AgencySettleAccountsId" placeholder="id"/>

        <div style="margin-bottom: 20px">
          <span style="margin-right: 20px">审批</span>
          <a-radio-group @change="onChange" v-model="status">
            <a-radio :value="1">通过</a-radio>
            <a-radio :value="3">不通过</a-radio>
          </a-radio-group>


        </div>
        <a v-if="showPrise">
          <a-textarea
            placeholder="请输入审核不通过说明"
            v-model="closeExplain"
            :autosize="{ minRows: 5, maxRows: 6 }"
          />
        </a>


      </a-modal>
      <br/>
      <br/>
    </div>
    <!--打款弹窗-->
    <div>
      <a-modal title="打款确认" v-model="visibleEemit" @ok="hideEemitModal()" okText="确认" cancelText="取消">
        <input style="display: none" :value="AgencySettleAccountsId" placeholder="id"/>

        <div style="margin-bottom: 20px">
          <span style="margin-right: 20px">状态</span>
          <a-radio-group @change="onChangeEemit" v-model="status">
            <a-radio :value="1">待打款</a-radio>
            <a-radio :value="2">已打款</a-radio>
          </a-radio-group>


        </div>
        <a v-if="showEemit">

          <a-textarea
            placeholder="请输入打款备注"
            v-model="remark"
            :autosize="{ minRows: 5, maxRows: 6 }"
          />
        </a>


      </a-modal>
      <br/>
      <br/>
    </div>
  </div>

</template>

<script>
  import {httpAction, getAction,postAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "ProvideSettleAccountsModal",
    data () {
      return {
        title: "操作",
        visible: false,
        /**审核弹窗*/
        visibleAudi: false,
        status: 1,
        closeExplain: "",
        showPrise: false,
        AgencySettleAccountsId: "",
        /**打款弹窗*/
        visibleEemit: false,
        showEemit: false,
        remark: "",
        orderNo: '',
        sysUserId: '',
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {},
        url: {
          add: "/provideSettleAccounts/provideSettleAccounts/add",
          edit: "/provideSettleAccounts/provideSettleAccounts/edit",
          updateAuditStatus: "/provideSettleAccounts/provideSettleAccounts/updateAuditStatus",//弃用
          updateStatusRemit: "/provideSettleAccounts/provideSettleAccounts/updateStatusRemit",//弃用
          audit:"/provideSettleAccounts/provideSettleAccounts/audit",//审核
          remit:'/provideSettleAccounts/provideSettleAccounts/remit',//打款
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
          this.form.setFieldsValue(pick(this.model, 'year', 'month', 'day', 'delFlag', 'sysUserId', 'orderNo', 'phone', 'money', 'withdrawalType', 'serviceCharge', 'amount', 'status', 'remark', 'closeExplain'))
          //时间格式化
          this.form.setFieldsValue({timeApplication: this.model.timeApplication ? moment(this.model.timeApplication) : null})
          this.form.setFieldsValue({payTime: this.model.payTime ? moment(this.model.payTime) : null})
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
            if (!this.model.id) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            formData.timeApplication = formData.timeApplication ? formData.timeApplication.format('YYYY-MM-DD HH:mm:ss') : null;
            formData.payTime = formData.payTime ? formData.payTime.format('YYYY-MM-DD HH:mm:ss') : null;

            console.log(formData)
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
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
      //审核弹窗
      showAudiModal(id, orderNo, sysUserId) {
        this.AgencySettleAccountsId = id;
        this.orderNo = orderNo;
        this.sysUserId = sysUserId;
        this.visibleAudi = true;
        this.closeExplain = '';
      },
      //审核确认弹窗
      hideAudiModal() {
        this.visibleAudi = false;
        var that = this;
        postAction(that.url.audit, {
          id: that.AgencySettleAccountsId,
          closeExplain: that.closeExplain,
          status: that.status,
          orderNo:that.orderNo,
          sysUserId: that.sysUserId,
        }).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.$emit('ok');
          } else {

            that.$message.warning(res.message);
          }
        });
      },
      onChange(e) {
        if (e.target.value == 1) {
          this.showPrise = false;
          this.closeExplain = "";
        } else {
          this.showPrise = true;
        }
      },
      /**打款弹窗*/
      //审核弹窗
      showEemitModal(id,orderNo,sysUserId) {
        this.AgencySettleAccountsId = id;
        this.visibleEemit = true;
        this.remark = '';
        this.orderNo = orderNo;
        this.sysUserId = sysUserId;
      },
      hideEemitModal(){
        this.visibleEemit = false;
        var that = this;
        postAction(that.url.remit, {
          id: that.AgencySettleAccountsId,
          remark: that.remark,
          status: that.status,
          orderNo:that.orderNo,
          sysUserId: that.sysUserId,
        }).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.$emit('ok');
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      onChangeEemit(e) {
        if (e.target.value == 1) {
          this.showEemit = false;
          this.remark = "";
        } else {
          this.showEemit = true;
        }
      },

    }
  }
</script>

<style lang="less" scoped>

</style>