<template>
  <div>
    <!---->
    <a-modal
      :title="title"
      :width="800"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="创建年">
            <a-input-number v-decorator="['year', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="创建月">
            <a-input-number v-decorator="['month', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="创建日">
            <a-input-number v-decorator="['day', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="删除状态（0，正常，1已删除）">
            <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-decorator="['delFlag', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="会员id">
            <a-input placeholder="请输入会员id" v-decorator="['memberListId', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="单号">
            <a-input placeholder="请输入单号" v-decorator="['orderNo', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号">
            <a-input placeholder="请输入手机号" v-decorator="['phone', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="提现金额">
            <a-input-number v-decorator="['money', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="提现类型；0：微信；1：支付宝">
            <a-input placeholder="请输入提现类型；0：微信；1：支付宝" v-decorator="['withdrawalType', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手续费">
            <a-input-number v-decorator="['serviceCharge', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="实际金额">
            <a-input-number v-decorator="['amount', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="申请时间">
            <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['timeApplication', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="状态；0：待审核；1：待打款；2：已付款；3：无效"
          >
            <a-input placeholder="请输入状态；0：待审核；1：待打款；2：已付款；3：无效" v-decorator="['status', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="打款时间">
            <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['payTime', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
            <a-input placeholder="请输入备注" v-decorator="['remark', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="无效原因">
            <a-input placeholder="请输入无效原因" v-decorator="['closeExplain', {}]" />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <!--审批弹窗-->
    <a-modal title="审批" v-model="visibleAudi" @ok="hideAudiModal()" okText="确认" cancelText="取消">
      <input style="display: none" :value="MemberWithdrawDepositId" placeholder="id" />

      <div style="margin-bottom: 20px">
        <span style="margin-right: 20px">审批</span>
        <a-radio-group @change="onChange" v-model="status">
          <a-radio :value="1">通过</a-radio>
          <a-radio :value="3">不通过</a-radio>
        </a-radio-group>
      </div>
      <a v-if="showPrise">
        <a-textarea placeholder="请输入审核不通过说明" v-model="closeExplain" :autosize="{ minRows: 5, maxRows: 6 }" />
      </a>
    </a-modal>
    <br />
    <br />
    <!--打款弹窗-->
    <a-modal title="打款确认" v-model="visibleEemit" @ok="hideEemitModal()" okText="确认" cancelText="取消">
      <input style="display: none" :value="MemberWithdrawDepositId" placeholder="id" />

      <div style="margin-bottom: 20px">
        <span style="margin-right: 20px">状态</span>
        <a-radio-group @change="onChangeEemit" v-model="status">
          <a-radio :value="1">待打款</a-radio>
          <a-radio :value="2">已打款</a-radio>
        </a-radio-group>
      </div>
      <a v-if="showEemit">
        <a-textarea placeholder="请输入打款备注" v-model="remark" :autosize="{ minRows: 5, maxRows: 6 }" />
      </a>
    </a-modal>
    <br />
    <br />
    <!--查看详情弹窗-->
    <!--    okText="确认" cancelText="取消"-->
    <a-modal title="详情" v-model="visibleDetail" :width="1200" @ok="hideDetailModal()" footer="" class="lookDetail">
      <a-card :bordered="false">
        <div class="title">
          待审核
        </div>
        <div class="describe">
          请尽快审核
        </div>
        <detail-list
          :col="3"
          style="margin: 0 auto;padding-top: 36px;border-bottom: 1px solid #CCCCCC;border-top: 1px solid #CCCCCC ;"
        >
          <detail-list-item v-for="(item, index) in detailData" :term="item.term">
            {{ item.value }}
          </detail-list-item>
        </detail-list>
        <!--        :rowKey="record => record.login.uuid" :pagination="pagination" :loading="loading" @change="handleTableChange"-->
        <a-table
          :columns="detailDataColumns"
          :dataSource="detailDataSource"
          :scroll="{ x: columnsWidth * (detailDataColumns.length + 1), y: 300 }"
        >
          <template slot="headPortrait" slot-scope="text">
            <img preview="1" :src="text" alt="" style="width: 40px;height: 40px;" />
          </template>
          <template slot="storePictures" slot-scope="text">
            <img preview="1" :src="text" alt="" style="width: 40px;height: 40px;" />
          </template>
        </a-table>
      </a-card>
    </a-modal>
  </div>
</template>

<script>
import { httpAction, getAction, postAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import DetailList from '@/components/tools/DetailList'
import STable from '@/components/table/'
const DetailListItem = DetailList.Item
// scopedSlots: { customRender: 'name' },
const columnsWidth = 200
const detailDataColumns = [
  {
    title: '成员头像',
    dataIndex: 'headPortrait',
    width: columnsWidth,
    scopedSlots: { customRender: 'headPortrait' },
    align: 'center'
  },
  {
    title: '成员手机号',
    dataIndex: 'phone',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '成员昵称',
    dataIndex: 'name',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '会员类型',
    dataIndex: 'membershipType',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '成员级别',
    dataIndex: 'memberLevel',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '订单编号',
    dataIndex: 'orderNumber',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '商品图片',
    dataIndex: 'storePictures',
    width: columnsWidth,
    scopedSlots: { customRender: 'storePictures' },
    align: 'center'
  },
  {
    title: '商品名称',
    dataIndex: 'storeName',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '商品规格',
    dataIndex: 'storeSpecification',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '订单状态',
    dataIndex: 'orderStatus',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '佣金',
    dataIndex: 'Commission',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '下单时间',
    dataIndex: 'orderTime',
    width: columnsWidth,
    align: 'center'
  }
]

export default {
  name: 'MemberWithdrawDepositModal',
  components: {
    DetailList,
    STable,
    DetailListItem
  },
  data() {
    return {
      title: '操作',
      visible: false,
      /**审核弹窗*/
      visibleAudi: false,
      status: 1,
      closeExplain: '',
      showPrise: false,
      MemberWithdrawDepositId: '',
      /**打款弹窗*/
      visibleEemit: false,
      showEemit: false,
      remark: '',
      orderNo: '',
      memberListId: '',
      radioStyle: {
        display: 'block'
        /*height: '30px',
           lineHeight: '30px',*/
      },
      /*查看详情弹窗*/
      visibleDetail: false,
      detailData: [],
      detailDataColumns,
      columnsWidth,
      detailDataSource: [
        {
          headPortrait: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          phone: '2121212',
          name: '王彪',
          membershipType: 'vip会员',
          memberLevel: '一级会员',
          orderNumber:
            '4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa',
          storePictures: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          storeName: '商品1',
          storeSpecification: '规格1',
          orderStatus: '已完成',
          Commission: '￥10.00',
          orderTime: '20190909 11:22:22'
        },
        {
          headPortrait: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          phone: '2121212',
          name: '王彪',
          membershipType: 'vip会员',
          memberLevel: '一级会员',
          orderNumber:
            '4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa',
          storePictures: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          storeName: '商品1',
          storeSpecification: '规格1',
          orderStatus: '已完成',
          Commission: '￥10.00',
          orderTime: '20190909 11:22:22'
        },
        {
          headPortrait: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          phone: '2121212',
          name: '王彪',
          membershipType: 'vip会员',
          memberLevel: '一级会员',
          orderNumber:
            '4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa',
          storePictures: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          storeName: '商品1',
          storeSpecification: '规格1',
          orderStatus: '已完成',
          Commission: '￥10.00',
          orderTime: '20190909 11:22:22'
        },
        {
          headPortrait: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          phone: '2121212',
          name: '王彪',
          membershipType: 'vip会员',
          memberLevel: '一级会员',
          orderNumber:
            '4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa',
          storePictures: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          storeName: '商品1',
          storeSpecification: '规格1',
          orderStatus: '已完成',
          Commission: '￥10.00',
          orderTime: '20190909 11:22:22'
        },
        {
          headPortrait: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          phone: '2121212',
          name: '王彪',
          membershipType: 'vip会员',
          memberLevel: '一级会员',
          orderNumber:
            '4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa',
          storePictures: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          storeName: '商品1',
          storeSpecification: '规格1',
          orderStatus: '已完成',
          Commission: '￥10.00',
          orderTime: '20190909 11:22:22'
        },
        {
          headPortrait: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          phone: '2121212',
          name: '王彪',
          membershipType: 'vip会员',
          memberLevel: '一级会员',
          orderNumber:
            '4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa',
          storePictures: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          storeName: '商品1',
          storeSpecification: '规格1',
          orderStatus: '已完成',
          Commission: '￥10.00',
          orderTime: '20190909 11:22:22'
        },
        {
          headPortrait: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          phone: '2121212',
          name: '王彪',
          membershipType: 'vip会员',
          memberLevel: '一级会员',
          orderNumber:
            '4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa',
          storePictures: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          storeName: '商品1',
          storeSpecification: '规格1',
          orderStatus: '已完成',
          Commission: '￥10.00',
          orderTime: '20190909 11:22:22'
        },
        {
          headPortrait: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          phone: '2121212',
          name: '王彪',
          membershipType: 'vip会员',
          memberLevel: '一级会员',
          orderNumber:
            '4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa',
          storePictures: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          storeName: '商品1',
          storeSpecification: '规格1',
          orderStatus: '已完成',
          Commission: '￥10.00',
          orderTime: '20190909 11:22:22'
        },
        {
          headPortrait: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          phone: '2121212',
          name: '王彪',
          membershipType: 'vip会员',
          memberLevel: '一级会员',
          orderNumber:
            '4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa',
          storePictures: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          storeName: '商品1',
          storeSpecification: '规格1',
          orderStatus: '已完成',
          Commission: '￥10.00',
          orderTime: '20190909 11:22:22'
        },
        {
          headPortrait: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          phone: '2121212',
          name: '王彪',
          membershipType: 'vip会员',
          memberLevel: '一级会员',
          orderNumber:
            '4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa',
          storePictures: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          storeName: '商品1',
          storeSpecification: '规格1',
          orderStatus: '已完成',
          Commission: '￥10.00',
          orderTime: '20190909 11:22:22'
        },
        {
          headPortrait: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          phone: '2121212',
          name: '王彪',
          membershipType: 'vip会员',
          memberLevel: '一级会员',
          orderNumber:
            '4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa4564654654654safdasdfasdfa',
          storePictures: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          storeName: '商品1',
          storeSpecification: '规格1',
          orderStatus: '已完成',
          Commission: '￥10.00',
          orderTime: '20190909 11:22:22'
        }
      ],
      /******end********/
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {},
      url: {
        add: '/memberWithdrawDeposit/memberWithdrawDeposit/add',
        edit: '/memberWithdrawDeposit/memberWithdrawDeposit/edit',
        audit: '/memberWithdrawDeposit/memberWithdrawDeposit/audit', //审核
        remit: '/memberWithdrawDeposit/memberWithdrawDeposit/remit' //打款
      }
    }
  },
  created() {},
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'year',
            'month',
            'day',
            'delFlag',
            'memberListId',
            'orderNo',
            'phone',
            'money',
            'withdrawalType',
            'serviceCharge',
            'amount',
            'status',
            'remark',
            'closeExplain'
          )
        )
        //时间格式化
        this.form.setFieldsValue({
          timeApplication: this.model.timeApplication ? moment(this.model.timeApplication) : null
        })
        this.form.setFieldsValue({ payTime: this.model.payTime ? moment(this.model.payTime) : null })
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          let formData = Object.assign(this.model, values)
          //时间格式化
          formData.timeApplication = formData.timeApplication
            ? formData.timeApplication.format('YYYY-MM-DD HH:mm:ss')
            : null
          formData.payTime = formData.payTime ? formData.payTime.format('YYYY-MM-DD HH:mm:ss') : null

          console.log(formData)
          httpAction(httpurl, formData, method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    //审核弹窗
    showAudiModal(id, orderNo, memberListId) {
      this.MemberWithdrawDepositId = id
      this.orderNo = orderNo
      this.memberListId = memberListId
      this.visibleAudi = true
      this.closeExplain = ''
    },
    //审核确认弹窗
    hideAudiModal() {
      this.visibleAudi = false
      var that = this
      postAction(that.url.audit, {
        id: that.MemberWithdrawDepositId,
        closeExplain: that.closeExplain,
        status: that.status,
        orderNo: that.orderNo,
        memberListId: that.memberListId
      }).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.$emit('ok')
        } else {
          that.$message.success(res.message)
        }
      })
    },
    onChange(e) {
      if (e.target.value == 1) {
        this.showPrise = false
        this.closeExplain = ''
      } else {
        this.showPrise = true
      }
    },
    /**打款弹窗*/
    //审核弹窗
    showEemitModal(id, orderNo, memberListId) {
      this.MemberWithdrawDepositId = id
      this.visibleEemit = true
      this.orderNo = orderNo
      this.memberListId = memberListId
      this.remark = ''
    },
    hideEemitModal() {
      this.visibleEemit = false
      var that = this
      postAction(that.url.remit, {
        id: that.MemberWithdrawDepositId,
        remark: that.remark,
        orderNo: that.orderNo,
        memberListId: that.memberListId,
        status: that.status
      }).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.$emit('ok')
        } else {
          that.$message.success(res.message)
        }
      })
    },
    //查看详情弹窗
    showDetailModal(record) {
      console.log(record)
      this.detailData = [
        {
          term: '单号',
          value: record.orderNo || ' - - '
        },
        {
          term: '手机号',
          value: record.phone || ' - - '
        },
        {
          term: '会员昵称',
          value: record.nickName || ' - - '
        },
        {
          term: '提现金额',
          value: record.money || ' - - '
        },
        {
          term: '提现方式',
          value: record.withdrawalType || ' - - '
        },
        {
          term: '提现账号',
          value: record.bankCardName || ' - - '
        },
        {
          term: '收款人',
          value: record.cardholder || ' - - '
        },
        {
          term: '手续费',
          value: record.serviceCharge || ' - - '
        },
        {
          term: '实际金额',
          value: record.amount || ' - - '
        },
        {
          term: '申请时间',
          value: record.createTime || ' - - '
        }
      ]
      this.visibleDetail = true
    },
    hideDetailModal() {
      this.visibleDetail = false
    },
    onChangeEemit(e) {
      if (e.target.value == 1) {
        this.showEemit = false
        this.remark = ''
      } else {
        this.showEemit = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.lookDetail {
  .title {
    font-weight: 700;
    color: black;
    font-size: 22px;
    margin-bottom: 20px;
  }
  .describe {
    padding-bottom: 20px;
  }
}
</style>
