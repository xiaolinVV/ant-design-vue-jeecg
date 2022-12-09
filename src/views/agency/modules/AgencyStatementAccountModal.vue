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
            label="日期">
            <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'calendarDate', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="收入">
            <a-input-number v-decorator="[ 'earning', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="收入笔数">
            <a-input-number v-decorator="[ 'incomeNumber', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="支出">
            <a-input-number v-decorator="[ 'expenditure', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="支出笔数">
            <a-input-number v-decorator="[ 'expenditureNumber', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="收益">
            <a-input-number v-decorator="[ 'revenue', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="期初余额">
            <a-input-number v-decorator="[ 'startBalance', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="期末余额">
            <a-input-number v-decorator="[ 'endBalance', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="代理id">
            <a-input placeholder="请输入代理id" v-decorator="['sysUserId', {}]" />
          </a-form-item>

        </a-form>
      </a-spin>
    </a-modal>

    <!--详情信息-->
    <a-modal title="详情" :footer="null" :width="800" v-model="visiblParticularsInformation" @ok="hideModalDistributionInformation()" okText="确认" cancelText="取消">
      <div>

        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          @change="handleTableChange"
        >
          <template slot="goAndCome" slot-scope="text, record, index">
            <div class="anty-img-wrap" >
              <div v-if="record.goAndCome == 0">收入</div>
              <div v-if="record.goAndCome == 1">支出</div>
            </div>
          </template>

          <template slot="amount" slot-scope="text, record, index">
            <div class="anty-img-wrap" >
              <div v-if="record.goAndCome == 0">{{ record.amount }}</div>
              <div v-if="record.goAndCome == 1">-{{ record.amount }}</div>
            </div>
          </template>
          <template slot="tradeStatus" slot-scope="text, record, index">
            <div class="anty-img-wrap" >
              <div v-if="record.tradeStatus == 0">未支付</div>
              <div v-if="record.tradeStatus == 1">进行中</div>
              <div v-if="record.tradeStatus == 2">待结算</div>
              <div v-if="record.tradeStatus == 3">待打款</div>
              <div v-if="record.tradeStatus == 4">待退款</div>
              <div v-if="record.tradeStatus == 5">交易完成</div>
              <div v-if="record.tradeStatus == 6">已退款</div>
              <div v-if="record.tradeStatus == 7">交易关闭</div>
            </div>
          </template>
          <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->

        </a-table>
      </div>
    </a-modal>

  </div>

</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  export default {
    name: "AgencyStatementAccountModal",
    mixins:[JeecgListMixin],
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        visiblParticularsInformation:false,
        /* 数据源 */
        dataSource:[],
        /* 分页参数 */
        ipagination:{
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        goodListId:"",
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        agencyRechargeRecordList:"",//表格数据
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },

          {
            title: '交易时间',
            align:"center",
            dataIndex: 'createTime'
          },
          {
            title: '代理账号',
            align:"center",
            dataIndex: 'userName'
          },
          {
            title: '代理',
            align:"center",
            dataIndex: 'realname'
          },
          {
            title: '交易类型',//；0：订单交易；1：提现；2：订单退款；3：余额充值；做成数据字典
            align:"center",
            dataIndex: 'payType_dictText'
          },
          {
            title: '收入/支出',
            align:"center",
            dataIndex: 'goAndCome',
            scopedSlots: {customRender: "goAndCome"}

          },
          {
            title: '交易金额',
            align:"center",
            dataIndex: 'amount',
            scopedSlots: {customRender: "amount"}
          },
          {
            title: '单号',
            align:"center",
            dataIndex: 'orderNo'
          },

          /*   {
               title: '操作',
               dataIndex: 'action',
               align:"center",
               scopedSlots: { customRender: 'action' },
             }*/
        ],
        confirmLoading: false,

        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
         // list:"/agencyStatementAccount/agencyStatementAccount/getAgencyAccountCapitalListList",
          add: "/agencyStatementAccount/agencyStatementAccount/add",
          edit: "/agencyStatementAccount/agencyStatementAccount/edit",
          getAgencyAccountCapitalListList:"/agencyStatementAccount/agencyStatementAccount/getAgencyAccountCapitalListList",
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
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','earning','incomeNumber','expenditure','expenditureNumber','revenue','startBalance','endBalance','sysUserId'))
		  //时间格式化
          this.form.setFieldsValue({calendarDate:this.model.calendarDate?moment(this.model.calendarDate):null})
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
            formData.calendarDate = formData.calendarDate?formData.calendarDate.format('YYYY-MM-DD HH:mm:ss'):null;
            
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
      //商品信息弹窗
      showModalParticularsInformation(id){
        this.visiblParticularsInformation = true;
        if(!id){
          return;
        }else{
          this.goodListId = id;
        }
        getAction(this.url.getAgencyAccountCapitalListList,{id: id,pageNo:this.ipagination.current,pageSize:this.ipagination.pageSize}).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
      },
      loadData(arg) {
        if(!this.goodListId){
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        getAction(this.url.getAgencyAccountCapitalListList,{id: this.goodListId,pageNo:this.ipagination.current,pageSize:this.ipagination.pageSize }).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
      },

    }
  }
</script>

<style lang="less" scoped>

</style>